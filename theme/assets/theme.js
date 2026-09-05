/* Velluno theme scripts — vanilla JS, no dependencies. */
(function () {
  'use strict';

  const on = (el, evt, fn, opts) => el && el.addEventListener(evt, fn, opts);
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const money = (cents) => {
    const format = window.Velluno && window.Velluno.moneyFormat;
    const amount = (cents / 100).toFixed(2);
    if (!format) return amount;
    return format.replace(/\{\{\s*amount\s*\}\}/, amount).replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents / 100));
  };

  /* ---------------------------------------------------------------- Toasts */
  function toast(message) {
    const region = document.getElementById('ToastRegion');
    if (!region) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    region.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  /* --------------------------------------------------------------- Drawers */
  const Drawer = {
    open(id, opener) {
      const drawer = document.getElementById(id);
      if (!drawer) return;
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      drawer.dataset.opener = opener && opener.id ? opener.id : '';
      const focusable = drawer.querySelector('[data-drawer-close], a, button, input');
      if (focusable) setTimeout(() => focusable.focus(), 60);
    },
    close(drawer) {
      if (!drawer) return;
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      if (!$('.drawer.is-open')) document.body.style.overflow = '';
      const opener = drawer.dataset.opener && document.getElementById(drawer.dataset.opener);
      if (opener) opener.focus();
    },
    closeAll() { $$('.drawer.is-open').forEach((d) => Drawer.close(d)); }
  };
  window.VellunoDrawer = Drawer;

  on(document, 'click', (event) => {
    const opener = event.target.closest('[data-drawer-open]');
    if (opener) {
      event.preventDefault();
      Drawer.open(opener.getAttribute('data-drawer-open'), opener);
      return;
    }
    if (event.target.closest('[data-drawer-close]') || event.target.classList.contains('drawer__overlay')) {
      Drawer.close(event.target.closest('.drawer'));
    }
  });

  on(document, 'keydown', (event) => {
    if (event.key === 'Escape') Drawer.closeAll();
    if (event.key === 'Enter' || event.key === ' ') {
      const option = event.target.closest('[data-bundle-option]');
      if (option) {
        event.preventDefault();
        option.click();
      }
    }
  });

  /* ------------------------------------------------------------ Cart utils */
  async function cartRequest(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.description || data.message || 'Cart error');
    return data;
  }

  async function refreshCart() {
    const root = window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/';
    try {
      const response = await fetch(`${root}?sections=cart-drawer,cart-icon-bubble`);
      const data = await response.json();
      const parse = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.querySelector('.shopify-section') || doc.body;
      };
      if (data['cart-drawer']) {
        const target = document.getElementById('shopify-section-cart-drawer');
        if (target) target.innerHTML = parse(data['cart-drawer']).innerHTML;
      }
      if (data['cart-icon-bubble']) {
        const bubble = document.getElementById('cart-icon-bubble');
        if (bubble) bubble.innerHTML = parse(data['cart-icon-bubble']).innerHTML;
      }
    } catch (error) {
      /* Leave the current markup in place if section rendering is unavailable. */
    }
    document.dispatchEvent(new CustomEvent('velluno:cart:updated'));
  }

  window.VellunoRefreshCart = refreshCart;

  /* ------------------------------------------------------- Add to cart form */
  on(document, 'submit', async (event) => {
    const form = event.target.closest('form[data-product-form]');
    if (!form) return;
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    const errorEl = form.querySelector('[data-form-error]');
    if (errorEl) errorEl.textContent = '';
    if (button) { button.classList.add('is-loading'); button.setAttribute('aria-disabled', 'true'); }
    try {
      const formData = new FormData(form);
      const quantity = Number(formData.get('bundle_quantity') || formData.get('quantity') || 1);
      const items = { items: [{ id: formData.get('id'), quantity: quantity }] };
      const properties = {};
      formData.forEach((value, key) => {
        const match = key.match(/^properties\[(.+)\]$/);
        if (match && value) properties[match[1]] = value;
      });
      if (Object.keys(properties).length) items.items[0].properties = properties;
      const selling = formData.get('selling_plan');
      if (selling) items.items[0].selling_plan = selling;
      await cartRequest(`${window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/'}cart/add.js`, items);
      await refreshCart();
      if (document.body.dataset.cartType === 'drawer') {
        Drawer.open('CartDrawer', button);
      } else {
        window.location.href = `${window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/'}cart`;
      }
    } catch (error) {
      if (errorEl) errorEl.textContent = error.message;
      else toast(error.message);
    } finally {
      if (button) { button.classList.remove('is-loading'); button.removeAttribute('aria-disabled'); }
    }
  });

  /* --------------------------------------------------- Cart line item edits */
  async function changeLine(line, quantity) {
    try {
      await cartRequest(`${window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/'}cart/change.js`, { line: Number(line), quantity: Number(quantity) });
      if (document.body.classList.contains('template-cart')) {
        window.location.reload();
      } else {
        await refreshCart();
      }
    } catch (error) {
      toast(error.message);
    }
  }

  on(document, 'click', (event) => {
    const remove = event.target.closest('[data-cart-remove]');
    if (remove) {
      event.preventDefault();
      changeLine(remove.getAttribute('data-cart-remove'), 0);
    }
  });

  on(document, 'change', (event) => {
    const input = event.target.closest('[data-cart-quantity]');
    if (input) changeLine(input.getAttribute('data-cart-quantity'), input.value);
  });

  /* -------------------------------------------------------- Quantity widget */
  on(document, 'click', (event) => {
    const button = event.target.closest('.quantity__button');
    if (!button) return;
    const input = button.parentElement.querySelector('.quantity__input');
    if (!input) return;
    const step = button.dataset.action === 'increase' ? 1 : -1;
    const min = Number(input.min || 1);
    const next = Math.max(min, Number(input.value || min) + step);
    if (next === Number(input.value)) return;
    input.value = next;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* -------------------------------------------------------- Variant picker */
  class VariantPicker {
    constructor(root) {
      this.root = root;
      this.productHandle = root.dataset.productHandle;
      const json = root.querySelector('[data-variant-json]');
      this.variants = json ? JSON.parse(json.textContent) : [];
      this.idInput = root.querySelector('[data-variant-id]');
      this.priceTarget = root.querySelector('[data-price-target]');
      this.submit = root.querySelector('[data-add-button]');
      this.submitText = root.querySelector('[data-add-button-text]');
      root.addEventListener('change', () => this.onChange());
    }

    selectedOptions() {
      return $$('fieldset', this.root).map((fieldset) => {
        const checked = fieldset.querySelector('input:checked');
        if (checked) return checked.value;
        const select = fieldset.querySelector('select');
        return select ? select.value : null;
      });
    }

    onChange() {
      if (!$$('fieldset', this.root).length) return;
      const options = this.selectedOptions();
      const variant = this.variants.find((v) => v.options.every((opt, index) => opt === options[index]));
      if (!variant) {
        if (this.submit) {
          this.submit.setAttribute('aria-disabled', 'true');
          if (this.submitText) this.submitText.textContent = this.root.dataset.unavailableText || 'Unavailable';
        }
        return;
      }
      if (this.idInput) this.idInput.value = variant.id;
      if (this.priceTarget) {
        this.priceTarget.innerHTML = variant.compare_at_price && variant.compare_at_price > variant.price
          ? `<span class="price__regular">${money(variant.price)}</span> <s class="price__compare">${money(variant.compare_at_price)}</s>`
          : `<span class="price__regular">${money(variant.price)}</span>`;
      }
      if (this.submit) {
        if (variant.available) {
          this.submit.removeAttribute('aria-disabled');
          if (this.submitText) this.submitText.textContent = this.root.dataset.addText || 'Add to cart';
        } else {
          this.submit.setAttribute('aria-disabled', 'true');
          if (this.submitText) this.submitText.textContent = this.root.dataset.soldOutText || 'Sold out';
        }
      }
      const url = new URL(window.location.href);
      url.searchParams.set('variant', variant.id);
      window.history.replaceState({}, '', url.toString());
      if (variant.featured_media_id) {
        const thumb = $(`[data-media-id="${variant.featured_media_id}"]`);
        if (thumb) thumb.click();
      }
    }
  }

  /* -------------------------------------------------------- Product gallery */
  on(document, 'click', (event) => {
    const thumb = event.target.closest('[data-media-id]');
    if (!thumb) return;
    const gallery = thumb.closest('[data-product-gallery]');
    if (!gallery) return;
    const id = thumb.getAttribute('data-media-id');
    $$('.product__media-item', gallery).forEach((item) => item.classList.toggle('is-active', item.dataset.mediaItem === id));
    $$('.product__thumb', gallery).forEach((item) => item.classList.toggle('is-active', item === thumb));
  });

  /* --------------------------------------------------------- Bundle options */
  on(document, 'click', (event) => {
    const option = event.target.closest('[data-bundle-option]');
    if (!option) return;
    const group = option.closest('[data-bundle-group]');
    $$('[data-bundle-option]', group).forEach((el) => el.classList.toggle('is-selected', el === option));
    const input = group.querySelector('[data-bundle-input]');
    if (input) input.value = option.dataset.bundleQuantity || 1;
    const variantInput = group.closest('form') && group.closest('form').querySelector('[data-variant-id]');
    if (variantInput && option.dataset.bundleVariant) variantInput.value = option.dataset.bundleVariant;
  });

  /* ----------------------------------------------------------- Countdown */
  function initCountdown(root) {
    const pad = (n) => String(Math.max(0, n)).padStart(2, '0');
    const daysEl = $('[data-countdown-days]', root);
    const hoursEl = $('[data-countdown-hours]', root);
    const minutesEl = $('[data-countdown-minutes]', root);
    const secondsEl = $('[data-countdown-seconds]', root);
    const evergreen = root.dataset.evergreen === 'true';
    const cycleMs = Math.max(1, Number(root.dataset.hours || 24)) * 3600 * 1000;

    // "2026-12-24 23:59" is read in the visitor's own time zone, like a shop-wide
    // deadline would be; an invalid or past date falls back to the evergreen cycle.
    const parseEnd = () => {
      const raw = (root.dataset.end || '').trim().replace(' ', 'T');
      const parsed = raw ? Date.parse(raw.length === 16 ? `${raw}:00` : raw) : NaN;
      return Number.isNaN(parsed) ? null : parsed;
    };

    let target = parseEnd();
    if (target === null || target <= Date.now()) {
      if (!evergreen) { root.hidden = true; return; }
      target = null;
    }

    // Evergreen mode anchors the cycle to the visitor's first visit so the timer
    // stays consistent for them instead of resetting on every page view.
    const anchorKey = 'velluno:countdown';
    const evergreenTarget = () => {
      let anchor;
      try { anchor = Number(localStorage.getItem(anchorKey)); } catch (error) { anchor = 0; }
      if (!anchor || Number.isNaN(anchor) || anchor <= Date.now()) {
        anchor = Date.now() + cycleMs;
        try { localStorage.setItem(anchorKey, String(anchor)); } catch (error) { /* private mode */ }
      }
      return anchor;
    };

    const tick = () => {
      const end = target !== null ? target : evergreenTarget();
      let remaining = end - Date.now();
      if (remaining <= 0) {
        if (!evergreen) { root.hidden = true; return; }
        try { localStorage.removeItem(anchorKey); } catch (error) { /* private mode */ }
        target = null;
        remaining = cycleMs;
      }
      const totalSeconds = Math.floor(remaining / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      if (daysEl) {
        daysEl.textContent = pad(days);
        if (hoursEl) hoursEl.textContent = pad(hours);
      } else if (hoursEl) {
        hoursEl.textContent = pad(days * 24 + hours);
      }
      if (minutesEl) minutesEl.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
      if (secondsEl) secondsEl.textContent = pad(totalSeconds % 60);
    };

    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------ Announcement bar */
  function initAnnouncement(root) {
    const slides = $$('.announcement-bar__slide', root);
    if (slides.length < 2) return;
    let index = 0;
    const speed = Number(root.dataset.speed || 5) * 1000;
    const show = (next) => {
      slides[index].classList.remove('is-active');
      index = (next + slides.length) % slides.length;
      slides[index].classList.add('is-active');
    };
    let timer = setInterval(() => show(index + 1), speed);
    $$('[data-announcement-nav]', root).forEach((button) => {
      on(button, 'click', () => {
        clearInterval(timer);
        show(index + Number(button.dataset.announcementNav));
        timer = setInterval(() => show(index + 1), speed);
      });
    });
  }

  /* ------------------------------------------------------- Compare slider */
  function initCompare(root) {
    const handle = $('.compare__handle', root);
    if (!handle) return;
    let dragging = false;
    const setPosition = (clientX) => {
      const rect = root.getBoundingClientRect();
      const percent = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
      root.style.setProperty('--compare-position', `${percent}%`);
      root.style.setProperty('--compare-width', `${(100 / percent) * 100}%`);
      handle.setAttribute('aria-valuenow', Math.round(percent));
    };
    const start = () => { dragging = true; };
    const stop = () => { dragging = false; };
    on(root, 'pointerdown', (e) => { start(); setPosition(e.clientX); });
    on(window, 'pointermove', (e) => { if (dragging) setPosition(e.clientX); });
    on(window, 'pointerup', stop);
    on(handle, 'keydown', (e) => {
      const current = parseFloat(getComputedStyle(root).getPropertyValue('--compare-position')) || 50;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const rect = root.getBoundingClientRect();
        const delta = e.key === 'ArrowLeft' ? -4 : 4;
        setPosition(rect.left + (rect.width * (current + delta)) / 100);
      }
    });
    root.style.setProperty('--compare-width', '200%');
  }

  /* ------------------------------------------------------------ Sticky ATC */
  function initStickyAtc() {
    const sticky = $('[data-sticky-atc]');
    const trigger = $('[data-sticky-trigger]');
    if (!sticky || !trigger) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => sticky.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0)),
      { threshold: 0 }
    );
    observer.observe(trigger);
  }

  /* ------------------------------------------------------------- Predictive */
  function initSearch() {
    const form = $('[data-predictive-search]');
    if (!form) return;
    const input = $('input[type="search"]', form);
    const results = $('[data-predictive-results]', form);
    if (!input || !results) return;
    let controller;
    let timer;
    on(input, 'input', () => {
      clearTimeout(timer);
      const term = input.value.trim();
      if (term.length < 2) { results.innerHTML = ''; results.hidden = true; return; }
      timer = setTimeout(async () => {
        if (controller) controller.abort();
        controller = new AbortController();
        try {
          const url = `${window.Shopify && window.Shopify.routes ? window.Shopify.routes.root : '/'}search/suggest?q=${encodeURIComponent(term)}&resources[type]=product,collection,article&resources[limit]=6&section_id=predictive-search`;
          const response = await fetch(url, { signal: controller.signal });
          results.innerHTML = await response.text();
          results.hidden = false;
        } catch (error) { /* aborted */ }
      }, 250);
    });
  }

  /* --------------------------------------------------------- Scroll reveal */
  function initReveal() {
    if (!document.body.classList.contains('animate-on-scroll')) return;
    const targets = $$('.shopify-section > *:not(script)');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => { el.classList.add('reveal'); observer.observe(el); });
  }

  /* ------------------------------------------------------------ Facet form */
  on(document, 'change', (event) => {
    const form = event.target.closest('[data-facet-form]');
    if (!form) return;
    form.submit();
  });

  /* ----------------------------------------------------------------- Init */
  function init(scope) {
    $$('[data-announcement]', scope).forEach(initAnnouncement);
    $$('[data-countdown]', scope).forEach(initCountdown);
    $$('[data-compare]', scope).forEach(initCompare);
    $$('[data-variant-picker]', scope).forEach((el) => new VariantPicker(el));
    initStickyAtc();
    initSearch();
  }

  document.addEventListener('DOMContentLoaded', () => {
    init(document);
    initReveal();
  });

  document.addEventListener('shopify:section:load', (event) => init(event.target));
})();
