/* VELLUNO — cart drawer
   Listens for `velluno:cart:add` (fired by product-form.js), refreshes itself
   through the Section Rendering API, and opens. Every mutation degrades to a
   normal form POST if JS fails: the forms keep their action attributes.
*/

import { qs, qsa, on, emit, formatMoney } from './velluno.js';

const drawer = qs('[data-cart-drawer]');

/* ---------- Section rendering ---------- */

async function fetchCartSection() {
  const sectionId = drawer ? drawer.dataset.sectionId : null;
  if (!sectionId) return null;
  const response = await fetch(`${window.location.pathname}?section_id=${sectionId}`, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });
  if (!response.ok) return null;
  return response.text();
}

async function refresh() {
  const html = await fetchCartSection();
  if (!html || !drawer) return;
  const parsed = new DOMParser().parseFromString(html, 'text/html');

  ['[data-cart-body]', '[data-cart-foot]'].forEach((selector) => {
    const fresh = parsed.querySelector(selector);
    const current = qs(selector, drawer);
    if (fresh && current) current.innerHTML = fresh.innerHTML;
  });

  bindLines();
}

/** Keeps every header bubble in sync without a second round trip. */
function updateCount(count) {
  qsa('[data-cart-count]').forEach((node) => {
    node.textContent = count;
    node.hidden = count === 0;
    node.classList.add('is-bumped');
    window.setTimeout(() => node.classList.remove('is-bumped'), 220);
  });
  const label = qs('[data-cart-count-label]');
  if (label) label.textContent = String(count);
}

/* ---------- Open / close ---------- */

export function openDrawer(opener) {
  if (!drawer) return;
  emit('velluno:panel:open', { panel: drawer, opener });
}

function closeDrawer() {
  if (!drawer) return;
  emit('velluno:panel:close', { panel: drawer });
}

/* ---------- Mutations ---------- */

function setBusy(state) {
  if (drawer) drawer.classList.toggle('is-loading', state);
}

async function changeLine(key, quantity) {
  setBusy(true);
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity }),
    });
    const cart = await response.json();
    if (!response.ok) throw new Error(cart.description || cart.message);
    updateCount(cart.item_count);
    await refresh();
    emit('velluno:cart:updated', { cart });
  } catch (error) {
    showError(error.message);
  } finally {
    setBusy(false);
  }
}

function showError(message) {
  const box = qs('[data-cart-error]', drawer);
  if (!box) return;
  box.textContent = message || '';
  box.hidden = !message;
}

/* ---------- Line item controls ---------- */

function bindLines() {
  if (!drawer) return;

  qsa('[data-line-qty]', drawer).forEach((group) => {
    const input = qs('.qty__input', group);
    const key = group.dataset.lineKey;
    if (!input || !key) return;

    qsa('[data-qty-step]', group).forEach((button) =>
      on(button, 'click', () => {
        const next = Math.max(0, Number(input.value) + Number(button.dataset.qtyStep));
        input.value = next;
        changeLine(key, next);
      })
    );

    on(input, 'change', () => changeLine(key, Math.max(0, Number(input.value) || 0)));
  });

  qsa('[data-line-remove]', drawer).forEach((button) =>
    on(button, 'click', (event) => {
      event.preventDefault();
      changeLine(button.dataset.lineRemove, 0);
    })
  );
}

/* ---------- Wiring ---------- */

function init() {
  if (!drawer) return;

  bindLines();
  qsa('[data-cart-open]').forEach((trigger) =>
    on(trigger, 'click', (event) => {
      // Ctrl/Cmd-click and middle-click should still reach /cart.
      if (event.metaKey || event.ctrlKey || event.button !== 0) return;
      event.preventDefault();
      openDrawer(trigger);
    })
  );

  on(document, 'velluno:cart:add', async (event) => {
    updateCount(event.detail.cart ? event.detail.cart.item_count : undefined);
    showError(null);
    await refresh();
    openDrawer(event.detail.opener);
  });

  on(document, 'velluno:cart:error', (event) => showError(event.detail.message));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

export { refresh, closeDrawer, formatMoney };
