/* VELLUNO — core behaviours
   ES module. No globals, no dependencies. Every enhancement is additive: with
   JS disabled the markup below still renders and submits normally. Modules
   talk to each other through CustomEvents on `document`, so cart-drawer.js and
   product-form.js stay independently loadable.
*/

/* ---------- Shared helpers (exported for the sibling modules) ---------- */

export const on = (el, type, fn, opts) => el && el.addEventListener(type, fn, opts);
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Shopify prices are integers in cents. Formats with the shop's locale. */
export function formatMoney(cents, format) {
  const value = (cents / 100).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return (format || '{{amount}} €').replace(/\{\{\s*amount\s*\}\}/, value);
}

export function emit(name, detail) {
  document.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
}

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Focus management ----------
   Shared by the nav drawer, the cart drawer and the search panel. */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function trapFocus(container, opener) {
  const previous = opener || document.activeElement;

  function onKeydown(event) {
    if (event.key !== 'Tab') return;
    const items = qsa(FOCUSABLE, container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  container.addEventListener('keydown', onKeydown);
  const target = qs('[data-autofocus]', container) || qsa(FOCUSABLE, container)[0];
  if (target) target.focus();

  return function release() {
    container.removeEventListener('keydown', onKeydown);
    if (previous && typeof previous.focus === 'function') previous.focus();
  };
}

/* ---------- Overlay & body scroll lock ---------- */

let lockCount = 0;

export function lockScroll() {
  if (lockCount === 0) {
    const bar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = bar > 0 ? `${bar}px` : '';
    document.body.classList.add('no-scroll');
  }
  lockCount += 1;
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.classList.remove('no-scroll');
    document.body.style.paddingRight = '';
  }
}

export function showOverlay() {
  const overlay = qs('[data-overlay]');
  if (overlay) overlay.classList.add('is-open');
}

export function hideOverlay() {
  const overlay = qs('[data-overlay]');
  if (overlay) overlay.classList.remove('is-open');
}

/* Panels — nav drawer + search share one open/close contract */

const openPanels = new Set();

function openPanel(panel, opener) {
  panel.classList.add('is-open');
  panel.removeAttribute('aria-hidden');
  const trigger = document.querySelector(`[aria-controls="${panel.id}"]`);
  if (trigger) trigger.setAttribute('aria-expanded', 'true');
  showOverlay();
  lockScroll();
  panel._release = trapFocus(panel, opener);
  openPanels.add(panel);
}

function closePanel(panel) {
  if (!openPanels.has(panel)) return;
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  const trigger = document.querySelector(`[aria-controls="${panel.id}"]`);
  if (trigger) trigger.setAttribute('aria-expanded', 'false');
  openPanels.delete(panel);
  if (!openPanels.size) hideOverlay();
  unlockScroll();
  if (panel._release) {
    panel._release();
    panel._release = null;
  }
}

export function closeAllPanels() {
  Array.from(openPanels).forEach(closePanel);
  emit('velluno:panels:closed');
}

function initPanels() {
  qsa('[data-panel-open]').forEach((trigger) => {
    on(trigger, 'click', (event) => {
      event.preventDefault();
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;
      if (openPanels.has(panel)) closePanel(panel);
      else {
        closeAllPanels();
        openPanel(panel, trigger);
      }
    });
  });

  qsa('[data-panel-close]').forEach((btn) =>
    on(btn, 'click', (event) => {
      event.preventDefault();
      const panel = btn.closest('[data-panel]');
      if (panel) closePanel(panel);
      else closeAllPanels();
    })
  );

  on(qs('[data-overlay]'), 'click', closeAllPanels);

  on(document, 'keydown', (event) => {
    if (event.key === 'Escape' && openPanels.size) closeAllPanels();
  });

  // Let other modules (cart drawer) reuse the same overlay/lock contract.
  on(document, 'velluno:panel:open', (event) => {
    closeAllPanels();
    if (event.detail && event.detail.panel) openPanel(event.detail.panel, event.detail.opener);
  });
  on(document, 'velluno:panel:close', (event) => {
    if (event.detail && event.detail.panel) closePanel(event.detail.panel);
  });
}

/* Sticky header — adds a hairline once the page scrolls */

function initHeader() {
  const header = qs('[data-header]');
  if (!header) return;
  let ticking = false;
  const update = () => {
    header.classList.toggle('is-stuck', window.scrollY > 4);
    ticking = false;
  };
  on(
    window,
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

/* Accordions — <button> + grid-template-rows animation, fully keyboard-driven */

function initAccordions(root = document) {
  qsa('[data-accordion]', root).forEach((accordion) => {
    qsa('[data-accordion-trigger]', accordion).forEach((trigger) => {
      if (trigger.dataset.bound) return;
      trigger.dataset.bound = 'true';
      on(trigger, 'click', () => {
        const panel = document.getElementById(trigger.getAttribute('aria-controls'));
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        const exclusive = accordion.dataset.accordion === 'exclusive';

        if (exclusive && !expanded) {
          qsa('[data-accordion-trigger]', accordion).forEach((other) => {
            if (other === trigger) return;
            other.setAttribute('aria-expanded', 'false');
            const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
            if (otherPanel) otherPanel.dataset.open = 'false';
          });
        }

        trigger.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.dataset.open = String(!expanded);
      });
    });
  });
}

/* Scroll reveal — IntersectionObserver, one-shot, honours reduced motion */

function initReveal() {
  const items = qsa('[data-reveal]');
  if (!items.length) return;

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  items.forEach((el, index) => {
    // Stagger only within a group, so a long page never waits on a queue.
    const group = el.closest('[data-reveal-group]');
    if (group) {
      const siblings = qsa('[data-reveal]', group);
      el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 5) * 70}ms`);
    } else if (index < 3) {
      el.style.setProperty('--reveal-delay', `${index * 70}ms`);
    }
    observer.observe(el);
  });
}

/* Announcement bar — cross-fading messages, paused on hover/focus */

function initAnnouncement() {
  const bar = qs('[data-announcement]');
  if (!bar) return;
  const items = qsa('.announcement__item', bar);
  if (items.length < 2) return;

  const delay = Number(bar.dataset.interval || 5000);
  let index = 0;
  let timer = null;

  const go = () => {
    items[index].classList.remove('is-active');
    index = (index + 1) % items.length;
    items[index].classList.add('is-active');
  };
  const start = () => {
    if (!reduceMotion()) timer = window.setInterval(go, delay);
  };
  const stop = () => {
    window.clearInterval(timer);
    timer = null;
  };

  on(bar, 'mouseenter', stop);
  on(bar, 'mouseleave', start);
  on(bar, 'focusin', stop);
  on(bar, 'focusout', start);
  on(document, 'visibilitychange', () => (document.hidden ? stop() : start()));
  start();
}

/* Predictive search — Shopify's /search/suggest endpoint, debounced */

function initSearch() {
  const panel = qs('[data-search-panel]');
  if (!panel) return;
  const input = qs('[data-search-input]', panel);
  const results = qs('[data-search-results]', panel);
  if (!input || !results) return;

  const skeleton = results.innerHTML;
  let controller = null;
  let debounce = null;

  const render = (html) => {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const fresh = parsed.querySelector('[data-search-results]');
    results.innerHTML = fresh ? fresh.innerHTML : '';
  };

  on(input, 'input', () => {
    const term = input.value.trim();
    window.clearTimeout(debounce);
    if (controller) controller.abort();

    if (term.length < 2) {
      results.innerHTML = skeleton;
      results.hidden = true;
      return;
    }

    debounce = window.setTimeout(() => {
      controller = new AbortController();
      results.hidden = false;
      results.setAttribute('aria-busy', 'true');
      const url = `${panel.dataset.searchUrl || '/search'}/suggest?q=${encodeURIComponent(
        term
      )}&resources[type]=product&resources[limit]=5&section_id=predictive-search`;
      fetch(url, { signal: controller.signal })
        .then((response) => (response.ok ? response.text() : Promise.reject(response)))
        .then(render)
        .catch((error) => {
          if (error.name !== 'AbortError') results.innerHTML = '';
        })
        .finally(() => results.removeAttribute('aria-busy'));
    }, 220);
  });
}

/* Cookie banner — GDPR
   Refusing is one click, exactly like accepting. Uses Shopify's Customer
   Privacy API when present; otherwise it only records the choice locally and
   loads nothing.
*/

const CONSENT_KEY = 'velluno:consent';

function applyConsent(choice) {
  const api = window.Shopify && window.Shopify.customerPrivacy;
  if (api && typeof api.setTrackingConsent === 'function') {
    api.setTrackingConsent(choice === 'accepted', () => {});
  }
}

function initCookieBanner() {
  const banner = qs('[data-cookie-banner]');
  if (!banner) return;

  let stored = null;
  try {
    stored = window.localStorage.getItem(CONSENT_KEY);
  } catch (error) {
    stored = null; // Private mode: show the banner, store nothing.
  }

  if (stored) {
    applyConsent(stored);
    banner.remove();
    return;
  }

  banner.hidden = false;
  window.requestAnimationFrame(() => banner.classList.add('is-visible'));

  const decide = (choice) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch (error) {
      /* Nothing to persist to — the choice still applies to this page view. */
    }
    applyConsent(choice);
    banner.classList.remove('is-visible');
    window.setTimeout(() => banner.remove(), 260);
  };

  on(qs('[data-cookie-accept]', banner), 'click', () => decide('accepted'));
  on(qs('[data-cookie-decline]', banner), 'click', () => decide('declined'));
}

/* Sticky mobile buy bar — appears once the main ATC button scrolls away */

function initStickyBuy() {
  const bar = qs('[data-sticky-buy]');
  const anchor = qs('[data-sticky-anchor]');
  if (!bar || !anchor || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      bar.classList.toggle('is-visible', passed);
    },
    { threshold: 0 }
  );
  observer.observe(anchor);
}

/* Product gallery — scroll-snap slides, thumbnails, dots */

function initGallery() {
  qsa('[data-gallery]').forEach((gallery) => {
    const slidesEl = qs('[data-gallery-slides]', gallery);
    if (!slidesEl) return;
    const slides = qsa('[data-gallery-slide]', slidesEl);
    const thumbs = qsa('[data-gallery-thumb]', gallery);
    const dots = qsa('[data-gallery-dot]', gallery);
    if (slides.length < 2) return;

    const setCurrent = (index) => {
      thumbs.forEach((t, i) => t.setAttribute('aria-current', String(i === index)));
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
    };

    const goTo = (index) => {
      slidesEl.scrollTo({
        left: slides[index].offsetLeft - slidesEl.offsetLeft,
        behavior: reduceMotion() ? 'auto' : 'smooth',
      });
      setCurrent(index);
    };

    thumbs.forEach((thumb, index) => on(thumb, 'click', () => goTo(index)));
    dots.forEach((dot, index) => on(dot, 'click', () => goTo(index)));

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setCurrent(slides.indexOf(entry.target));
          });
        },
        { root: slidesEl, threshold: 0.6 }
      );
      slides.forEach((slide) => observer.observe(slide));
    }

    // Variant changes ask the gallery to jump to the matching media.
    on(document, 'velluno:variant:change', (event) => {
      const mediaId = event.detail && event.detail.mediaId;
      if (!mediaId) return;
      const index = slides.findIndex((slide) => slide.dataset.mediaId === String(mediaId));
      if (index > -1) goTo(index);
    });
  });
}

/* Delivery estimate — "commandez aujourd'hui, réception estimée entre
   X et Y" Business days only; the copy and the disclaimer come from Liquid.
*/

function addBusinessDays(from, days) {
  const date = new Date(from.getTime());
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return date;
}

function initShippingEstimate() {
  const nodes = qsa('[data-shipping-estimate]');
  if (!nodes.length) return;

  nodes.forEach((node) => {
    const min = Number(node.dataset.minDays || 5);
    const max = Number(node.dataset.maxDays || 12);
    const now = new Date();
    // Orders placed after the cut-off are handled the next business day.
    const cutoff = Number(node.dataset.cutoffHour || 14);
    const base = now.getHours() >= cutoff ? addBusinessDays(now, 1) : now;

    const fmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const from = fmt.format(addBusinessDays(base, min));
    const to = fmt.format(addBusinessDays(base, max));

    const target = qs('[data-estimate-range]', node) || node;
    const template = node.dataset.template || '%%from%% — %%to%%';
    target.innerHTML = template
      .replace('%%from%%', `<strong>${from}</strong>`)
      .replace('%%to%%', `<strong>${to}</strong>`);
  });
}

/* Boot */

function init() {
  document.documentElement.classList.add('js');
  initPanels();
  initHeader();
  initAccordions();
  initReveal();
  initAnnouncement();
  initSearch();
  initCookieBanner();
  initStickyBuy();
  initGallery();
  initShippingEstimate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

// Sections re-rendered by the theme editor need their behaviours re-bound.
document.addEventListener('shopify:section:load', (event) => {
  initAccordions(event.target);
  initReveal();
  initGallery();
  initShippingEstimate();
});
