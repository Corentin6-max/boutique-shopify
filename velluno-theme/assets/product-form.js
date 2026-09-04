/* VELLUNO — product form
   Handles: variant selection (radio cards + swatches), price/SKU/media
   updates, add-to-cart via /cart/add.js, and the "achetez ensemble" bundle.
   Without JS the form is a plain POST to /cart/add with a checked radio —
   still a working purchase.
*/

import { qs, qsa, on, emit, formatMoney } from './velluno.js';

/* Variant selection */

class VariantPicker {
  constructor(root) {
    this.root = root;
    this.form = qs('[data-product-form]', root) || root.closest('[data-product-form]');
    this.idInput = this.form ? qs('[data-variant-id]', this.form) : null;
    this.moneyFormat = root.dataset.moneyFormat || '{{amount}} €';

    const script = qs('[data-variants-json]', root);
    this.variants = script ? JSON.parse(script.textContent) : [];

    this.inputs = qsa('[data-option-input]', root);
    this.inputs.forEach((input) => on(input, 'change', () => this.onChange()));

    // Deep links (?variant=) are resolved server-side; nothing to do on load.
  }

  get selectedOptions() {
    const options = [];
    this.inputs
      .filter((input) => input.checked)
      .forEach((input) => {
        options[Number(input.dataset.optionPosition) - 1] = input.value;
      });
    return options;
  }

  findVariant() {
    const selected = this.selectedOptions;
    return this.variants.find((variant) =>
      variant.options.every((value, index) => value === selected[index])
    );
  }

  onChange() {
    const variant = this.findVariant();
    this.update(variant);
    emit('velluno:variant:change', {
      variant,
      mediaId: variant && variant.featured_media_id,
    });
  }

  update(variant) {
    const available = Boolean(variant && variant.available);

    if (this.idInput && variant) this.idInput.value = variant.id;

    // Price + compare-at + savings pill
    const priceHost = qs('[data-price-target]', this.root);
    if (priceHost && variant) {
      const amount = qs('[data-price-amount]', priceHost);
      const compare = qs('[data-price-compare]', priceHost);
      const saving = qs('[data-price-saving]', priceHost);
      if (amount) amount.textContent = formatMoney(variant.price, this.moneyFormat);
      const hasCompare = variant.compare_at_price && variant.compare_at_price > variant.price;
      if (compare) {
        compare.textContent = hasCompare
          ? formatMoney(variant.compare_at_price, this.moneyFormat)
          : '';
        compare.hidden = !hasCompare;
      }
      if (saving) {
        const percent = hasCompare
          ? Math.round((1 - variant.price / variant.compare_at_price) * 100)
          : 0;
        saving.textContent = `-${percent} %`;
        saving.hidden = !hasCompare;
      }
      priceHost.classList.toggle('price--on-sale', Boolean(hasCompare));
    }

    // Instalment line — 4× without fees, computed from the live price
    const instalment = qs('[data-instalment]', this.root);
    if (instalment && variant) {
      const template = instalment.dataset.template || '{{ amount }}';
      instalment.textContent = template.replace(
        '{{ amount }}',
        formatMoney(Math.round(variant.price / 4), this.moneyFormat)
      );
    }

    // SKU
    const sku = qs('[data-variant-sku]', this.root);
    if (sku && variant) {
      sku.textContent = variant.sku || '';
      sku.hidden = !variant.sku;
    }

    // Submit button state
    const submit = this.form ? qs('[data-add-to-cart]', this.form) : null;
    if (submit) {
      submit.disabled = !available;
      const label = qs('.btn__label', submit);
      if (label) {
        label.textContent = available
          ? submit.dataset.labelAvailable
          : submit.dataset.labelSoldOut;
      }
    }

    // Keep the URL shareable without adding a history entry per click.
    if (variant && window.history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url);
    }

    // Mirror into the sticky mobile bar.
    const stickyPrice = qs('[data-sticky-price]');
    if (stickyPrice && variant) {
      stickyPrice.textContent = formatMoney(variant.price, this.moneyFormat);
    }
  }
}

/* Add to cart */

async function submitForm(form, opener) {
  const button = qs('[data-add-to-cart]', form) || qs('button[type="submit"]', form);
  const errorBox = qs('[data-form-error]', form);

  if (button) button.classList.add('is-loading');
  if (errorBox) errorBox.classList.remove('is-visible');

  try {
    const body = new FormData(form);
    // Ask Shopify to return the cart so the drawer can update its badge.
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.description || data.message);

    const cartResponse = await fetch('/cart.js', { headers: { Accept: 'application/json' } });
    const cart = await cartResponse.json();

    emit('velluno:cart:add', { item: data, cart, opener: opener || button });

    const live = qs('[data-atc-status]', form);
    if (live) live.textContent = form.dataset.addedMessage || '';
  } catch (error) {
    if (errorBox) {
      const message = qs('[data-form-error-text]', errorBox) || errorBox;
      message.textContent = error.message;
      errorBox.classList.add('is-visible');
    }
    emit('velluno:cart:error', { message: error.message });
  } finally {
    if (button) button.classList.remove('is-loading');
  }
}

function initForms() {
  qsa('[data-product-form]').forEach((form) => {
    on(form, 'submit', (event) => {
      // Dynamic checkout buttons submit elsewhere; only intercept our own ATC.
      if (event.submitter && event.submitter.hasAttribute('data-no-ajax')) return;
      event.preventDefault();
      submitForm(form, event.submitter);
    });
  });
}

/* Bundle — "Achetez ensemble", total recomputed client-side */

function initBundle() {
  const bundle = qs('[data-bundle]');
  if (!bundle) return;

  const items = qsa('[data-bundle-item]', bundle);
  const totalEl = qs('[data-bundle-total]', bundle);
  const compareEl = qs('[data-bundle-compare]', bundle);
  const savingEl = qs('[data-bundle-saving]', bundle);
  const button = qs('[data-bundle-add]', bundle);
  const format = bundle.dataset.moneyFormat || '{{amount}} €';

  const recalc = () => {
    let total = 0;
    let compare = 0;
    let count = 0;

    items.forEach((item) => {
      const input = qs('input[type="checkbox"]', item);
      const checked = input && input.checked;
      item.classList.toggle('is-checked', Boolean(checked));
      if (!checked) return;
      count += 1;
      total += Number(item.dataset.price || 0);
      compare += Number(item.dataset.compare || item.dataset.price || 0);
    });

    if (totalEl) totalEl.textContent = formatMoney(total, format);
    if (compareEl) {
      compareEl.textContent = formatMoney(compare, format);
      compareEl.hidden = compare <= total;
    }
    if (savingEl) {
      savingEl.textContent = (savingEl.dataset.template || '{{ amount }}').replace(
        '{{ amount }}',
        formatMoney(compare - total, format)
      );
      savingEl.hidden = compare <= total;
    }
    if (button) {
      button.disabled = count === 0;
      const label = qs('.btn__label', button);
      if (label && button.dataset.labelTemplate) {
        label.textContent = button.dataset.labelTemplate.replace('{{ count }}', String(count));
      }
    }
  };

  items.forEach((item) => {
    const input = qs('input[type="checkbox"]', item);
    if (input) on(input, 'change', recalc);
  });

  if (button) {
    on(button, 'click', async () => {
      const payload = items
        .filter((item) => {
          const input = qs('input[type="checkbox"]', item);
          return input && input.checked;
        })
        .map((item) => ({ id: Number(item.dataset.variantId), quantity: 1 }));

      if (!payload.length) return;
      button.classList.add('is-loading');
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ items: payload }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.description || data.message);
        const cart = await (await fetch('/cart.js', { headers: { Accept: 'application/json' } })).json();
        emit('velluno:cart:add', { item: data, cart, opener: button });
      } catch (error) {
        emit('velluno:cart:error', { message: error.message });
      } finally {
        button.classList.remove('is-loading');
      }
    });
  }

  // Selecting a different pack re-prices the bundle's locked first line.
  on(document, 'velluno:variant:change', (event) => {
    const variant = event.detail && event.detail.variant;
    const main = qs('[data-bundle-item][data-bundle-main]', bundle);
    if (!variant || !main) return;
    main.dataset.variantId = variant.id;
    main.dataset.price = variant.price;
    main.dataset.compare = variant.compare_at_price || variant.price;
    const priceEl = qs('[data-bundle-item-price]', main);
    if (priceEl) priceEl.textContent = formatMoney(variant.price, format);
    const variantEl = qs('[data-bundle-item-variant]', main);
    if (variantEl) variantEl.textContent = variant.title;
    recalc();
  });

  recalc();
}

/* Boot */

function init() {
  qsa('[data-variant-picker]').forEach((root) => new VariantPicker(root));
  initForms();
  initBundle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

document.addEventListener('shopify:section:load', init);
