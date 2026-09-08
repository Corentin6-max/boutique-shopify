/* Velluno — Shapewear
   Logique de la fiche produit : sélection pack / couleur / taille, prix dynamique,
   guide des tailles, accordéons. L'ajout au panier et la barre collante sont
   déjà gérés globalement par theme.js (form[data-product-form], [data-sticky-atc]),
   on se contente de tenir le champ « id » et l'affichage à jour. */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------------------ Money */

  function formatter(currency) {
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'fr-FR', {
        style: 'currency',
        currency: currency || 'EUR'
      });
    } catch (error) {
      return { format: function (value) { return value.toFixed(2) + ' ' + (currency || 'EUR'); } };
    }
  }

  /* -------------------------------------------------------- Fiche produit */

  function ShapewearProduct(root) {
    this.root = root;
    var payload = $('[data-sw-variants]', root);
    if (!payload) return;

    this.variants = JSON.parse(payload.textContent);
    this.money = formatter(root.dataset.swCurrency).format;
    this.optionIndex = {
      pack: Number(root.dataset.swPackIndex),
      color: Number(root.dataset.swColorIndex),
      size: Number(root.dataset.swSizeIndex)
    };

    this.idInput = $('[data-sw-id]', root);
    this.priceEl = $('[data-sw-price]', root);
    this.compareEl = $('[data-sw-compare]', root);
    this.saveEl = $('[data-sw-save]', root);
    this.unitEl = $('[data-sw-unit]', root);
    this.button = $('[data-sw-add]', root);
    this.buttonText = $('[data-sw-add-text]', root);
    this.errorEl = $('[data-sw-error]', root);

    this.stickyPrice = $('[data-sw-sticky-price]');
    this.stickyMeta = $('[data-sw-sticky-meta]');

    this.bindInputs();
    this.bindSizeGuide();
    this.update();
  }

  ShapewearProduct.prototype.bindInputs = function () {
    var self = this;
    this.root.addEventListener('change', function (event) {
      if (event.target.matches('[data-sw-option]')) self.update();
    });
  };

  ShapewearProduct.prototype.selection = function () {
    var root = this.root;
    var read = function (group) {
      var checked = $('[data-sw-option][data-sw-group="' + group + '"]:checked', root);
      return checked ? checked.value : null;
    };
    return { pack: read('pack'), color: read('color'), size: read('size') };
  };

  ShapewearProduct.prototype.find = function (selection) {
    var idx = this.optionIndex;
    for (var i = 0; i < this.variants.length; i++) {
      var v = this.variants[i];
      if (v.options[idx.pack] === selection.pack &&
          v.options[idx.color] === selection.color &&
          v.options[idx.size] === selection.size) {
        return v;
      }
    }
    return null;
  };

  /* Une combinaison est proposée seulement si elle correspond à une variante
     existante et disponible — évite d'envoyer le client dans un cul-de-sac. */
  ShapewearProduct.prototype.refreshAvailability = function (selection) {
    var self = this;
    var idx = this.optionIndex;

    $$('[data-sw-option][data-sw-group="size"]', this.root).forEach(function (input) {
      var candidate = { pack: selection.pack, color: selection.color, size: input.value };
      var variant = self.find(candidate);
      input.disabled = !variant || !variant.available;
    });

    $$('[data-sw-option][data-sw-group="color"]', this.root).forEach(function (input) {
      var exists = self.variants.some(function (v) {
        return v.options[idx.pack] === selection.pack &&
               v.options[idx.color] === input.value &&
               v.available;
      });
      input.disabled = !exists;
    });
  };

  ShapewearProduct.prototype.update = function () {
    var selection = this.selection();
    this.refreshAvailability(selection);

    var variant = this.find(selection);

    /* Si la taille retenue n'existe pas dans le pack choisi, on bascule sur la
       première taille disponible plutôt que de bloquer le bouton. */
    if (!variant || !variant.available) {
      var fallback = $('[data-sw-option][data-sw-group="size"]:not(:disabled)', this.root);
      if (fallback && !fallback.checked) {
        fallback.checked = true;
        selection = this.selection();
        variant = this.find(selection);
      }
    }

    $$('[data-sw-selected-label]', this.root).forEach(function (el) {
      var group = el.getAttribute('data-sw-selected-label');
      if (selection[group]) el.textContent = selection[group];
    });

    if (!variant) {
      this.setUnavailable();
      return;
    }

    if (this.idInput) this.idInput.value = variant.id;

    var price = this.money(variant.price / 100);
    if (this.priceEl) this.priceEl.textContent = price;

    var hasCompare = variant.compare_at_price && variant.compare_at_price > variant.price;
    if (this.compareEl) {
      this.compareEl.textContent = hasCompare ? this.money(variant.compare_at_price / 100) : '';
      this.compareEl.hidden = !hasCompare;
    }
    if (this.saveEl) {
      if (hasCompare) {
        var saved = Math.round(((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100);
        this.saveEl.textContent = '−' + saved + ' %';
        this.saveEl.hidden = false;
      } else {
        this.saveEl.hidden = true;
      }
    }

    var units = Number(variant.units || 1);
    if (this.unitEl) {
      this.unitEl.textContent = units > 1
        ? 'Soit ' + this.money(variant.price / units / 100) + ' le débardeur'
        : '';
      this.unitEl.hidden = units <= 1;
    }

    if (this.button) {
      this.button.removeAttribute('aria-disabled');
      if (this.buttonText) this.buttonText.textContent = this.root.dataset.swAddText || 'Ajouter au panier';
    }
    if (this.errorEl) this.errorEl.textContent = '';

    if (this.stickyPrice) this.stickyPrice.textContent = price;
    if (this.stickyMeta) {
      this.stickyMeta.textContent = [selection.pack, selection.color, 'Taille ' + selection.size]
        .filter(Boolean).join(' · ');
    }

    this.syncUrl(variant.id);
    this.syncMedia(variant);
  };

  ShapewearProduct.prototype.setUnavailable = function () {
    if (this.button) this.button.setAttribute('aria-disabled', 'true');
    if (this.buttonText) this.buttonText.textContent = this.root.dataset.swSoldOutText || 'Rupture de stock';
  };

  ShapewearProduct.prototype.syncUrl = function (id) {
    if (!window.history || !window.history.replaceState) return;
    try {
      var url = new URL(window.location.href);
      url.searchParams.set('variant', id);
      window.history.replaceState({}, '', url.toString());
    } catch (error) { /* URL indisponible sur navigateurs anciens */ }
  };

  /* Si la variante porte une image dédiée (utile dès que les photos couleur
     seront en ligne), on affiche la vignette correspondante. */
  ShapewearProduct.prototype.syncMedia = function (variant) {
    if (!variant.featured_media_id) return;
    var thumb = $('[data-sw-thumb="' + variant.featured_media_id + '"]');
    if (thumb) thumb.click();
  };

  ShapewearProduct.prototype.bindSizeGuide = function () {
    var modal = $('[data-sw-modal]');
    if (!modal) return;
    var lastFocus = null;

    var open = function (opener) {
      lastFocus = opener;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      var close = $('[data-sw-modal-close]', modal);
      if (close) close.focus();
    };

    var close = function () {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    $$('[data-sw-modal-open]').forEach(function (button) {
      button.addEventListener('click', function () { open(button); });
    });

    modal.addEventListener('click', function (event) {
      if (event.target.closest('[data-sw-modal-close]') || event.target.matches('[data-sw-modal-veil]')) close();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) close();
    });
  };

  /* ---------------------------------------------------------- Accordéons */

  /* Les panneaux sont ouverts dans le HTML puis repliés ici : sans JS, le
     contenu reste lisible au lieu de disparaître. */
  function initAccordions(scope) {
    $$('[data-sw-accordion]', scope).forEach(function (group) {
      var openFirst = group.hasAttribute('data-sw-accordion-open-first');
      $$('[data-sw-acc-trigger]', group).forEach(function (trigger, index) {
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));
        if (!panel) return;
        var expanded = openFirst && index === 0;
        trigger.setAttribute('aria-expanded', String(expanded));
        panel.hidden = !expanded;

        trigger.addEventListener('click', function () {
          var isOpen = trigger.getAttribute('aria-expanded') === 'true';
          trigger.setAttribute('aria-expanded', String(!isOpen));
          panel.hidden = isOpen;
        });
      });
    });
  }

  /* ----------------------------------------------------------------- Init */

  function init(scope) {
    $$('[data-sw-product]', scope).forEach(function (root) { new ShapewearProduct(root); });
    initAccordions(scope);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(document); });
  } else {
    init(document);
  }

  document.addEventListener('shopify:section:load', function (event) { init(event.target); });
})();
