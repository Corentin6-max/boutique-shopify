/* Velluno — Shapewear
   Fiche produit : coloris, taille, et packs multi-exemplaires.

   Un pack n'est pas une variante Shopify : chaque exemplaire ayant son propre
   couple couleur/taille, on ajoute N lignes de panier en une seule requête.
   L'ajout au panier est donc géré ici et non par le handler générique de
   theme.js — la section ne porte volontairement pas data-product-form. */
(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function routeRoot() {
    return (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  }

  function formatter(currency) {
    try {
      return new Intl.NumberFormat(document.documentElement.lang || 'fr-FR', {
        style: 'currency',
        currency: currency || 'EUR'
      }).format;
    } catch (error) {
      return function (value) { return value.toFixed(2) + ' ' + (currency || 'EUR'); };
    }
  }

  /* ------------------------------------------------------------- Produit */

  function ShapewearProduct(root) {
    var payload = $('[data-sw-variants]', root);
    if (!payload) return;

    this.root = root;
    this.variants = JSON.parse(payload.textContent);
    this.money = formatter(root.dataset.swCurrency);
    this.colorIndex = Number(root.dataset.swColorIndex);
    this.sizeIndex = Number(root.dataset.swSizeIndex);

    /* La remise quantité est appliquée par Shopify au panier. On la reproduit
       ici pour l'affichage : le prix annoncé doit être celui qui sera facturé. */
    this.discountPct = Number(root.dataset.swDiscountPercent || 0) / 100;
    this.discountMin = Number(root.dataset.swDiscountMin || 0);

    this.form = $('[data-sw-form]', root);
    this.priceEl = $('[data-sw-price]', root);
    this.compareEl = $('[data-sw-compare]', root);
    this.saveEl = $('[data-sw-save]', root);
    this.unitEl = $('[data-sw-unit]', root);
    this.button = $('[data-sw-add]', root);
    this.buttonText = $('[data-sw-add-text]', root);
    this.errorEl = $('[data-sw-error]', root);
    this.stickyPrice = $('[data-sw-sticky-price]');
    this.stickyMeta = $('[data-sw-sticky-meta]');

    this.bind();
    this.syncUnitRows();
    this.update();
  }

  ShapewearProduct.prototype.bind = function () {
    var self = this;

    this.root.addEventListener('change', function (event) {
      var target = event.target;

      /* Le choix principal pilote la galerie et réamorce les lignes du pack. */
      if (target.matches('[data-sw-option]')) {
        self.syncUnitRows();
        self.update();
        return;
      }
      if (target.matches('[data-sw-tier]')) {
        self.syncUnitRows();
        self.update();
        return;
      }
      if (target.matches('[data-sw-unit-color]')) {
        self.refreshRowSizes(target.closest('[data-sw-unit-row]'));
      }
    });

    if (this.form) {
      this.form.addEventListener('submit', function (event) {
        event.preventDefault();
        self.addToCart();
      });
    }

    this.bindSizeGuide();
  };

  /* ----------------------------------------------------------- Sélection */

  ShapewearProduct.prototype.topSelection = function () {
    var color = $('[data-sw-option][data-sw-group="color"]:checked', this.root);
    var size = $('[data-sw-option][data-sw-group="size"]:checked', this.root);
    return { color: color ? color.value : null, size: size ? size.value : null };
  };

  ShapewearProduct.prototype.activeTier = function () {
    var tier = $('[data-sw-tier]:checked', this.root);
    return {
      units: tier ? Number(tier.value) : 1,
      panel: tier ? $('[data-sw-tier-units="' + tier.value + '"]', this.root) : null
    };
  };

  ShapewearProduct.prototype.find = function (color, size) {
    for (var i = 0; i < this.variants.length; i++) {
      var v = this.variants[i];
      if (v.options[this.colorIndex] === color && v.options[this.sizeIndex] === size) return v;
    }
    return null;
  };

  ShapewearProduct.prototype.exists = function (color, size) {
    var v = this.find(color, size);
    return !!v && v.available;
  };

  /* Les lignes du pack repartent du choix principal à chaque changement :
     comportement prévisible plutôt qu'un état partiel difficile à relire. */
  ShapewearProduct.prototype.syncUnitRows = function () {
    var self = this;
    var top = this.topSelection();
    var tier = this.activeTier();
    if (!tier.panel) return;

    $$('[data-sw-unit-row]', tier.panel).forEach(function (row) {
      var colorSelect = $('[data-sw-unit-color]', row);
      var sizeSelect = $('[data-sw-unit-size]', row);
      if (colorSelect && top.color) colorSelect.value = top.color;
      if (sizeSelect && top.size) sizeSelect.value = top.size;
      self.refreshRowSizes(row);
    });
  };

  /* Grise les tailles indisponibles dans la couleur retenue pour cette ligne. */
  ShapewearProduct.prototype.refreshRowSizes = function (row) {
    if (!row) return;
    var self = this;
    var colorSelect = $('[data-sw-unit-color]', row);
    var sizeSelect = $('[data-sw-unit-size]', row);
    if (!colorSelect || !sizeSelect) return;

    var color = colorSelect.value;
    var firstAvailable = null;

    $$('option', sizeSelect).forEach(function (option) {
      var ok = self.exists(color, option.value);
      option.disabled = !ok;
      if (ok && firstAvailable === null) firstAvailable = option.value;
    });

    if (sizeSelect.selectedOptions[0] && sizeSelect.selectedOptions[0].disabled && firstAvailable) {
      sizeSelect.value = firstAvailable;
    }
  };

  /* -------------------------------------------------------- Rafraîchissement */

  ShapewearProduct.prototype.discounted = function (subtotal, units) {
    if (this.discountMin > 0 && units >= this.discountMin && this.discountPct > 0) {
      return Math.round(subtotal * (1 - this.discountPct));
    }
    return subtotal;
  };

  ShapewearProduct.prototype.update = function () {
    var self = this;
    var top = this.topSelection();

    /* Coloris et tailles impossibles désactivés en amont du clic. */
    $$('[data-sw-option][data-sw-group="size"]', this.root).forEach(function (input) {
      input.disabled = !self.exists(top.color, input.value);
    });
    $$('[data-sw-option][data-sw-group="color"]', this.root).forEach(function (input) {
      input.disabled = !self.variants.some(function (v) {
        return v.options[self.colorIndex] === input.value && v.available;
      });
    });

    var variant = this.find(top.color, top.size);
    if ((!variant || !variant.available)) {
      var fallback = $('[data-sw-option][data-sw-group="size"]:not(:disabled)', this.root);
      if (fallback && !fallback.checked) {
        fallback.checked = true;
        top = this.topSelection();
        variant = this.find(top.color, top.size);
      }
    }

    $$('[data-sw-selected-label]', this.root).forEach(function (el) {
      var group = el.getAttribute('data-sw-selected-label');
      if (top[group]) el.textContent = top[group];
    });

    if (!variant) {
      if (this.button) this.button.setAttribute('aria-disabled', 'true');
      if (this.buttonText) this.buttonText.textContent = this.root.dataset.swSoldOutText || 'Indisponible';
      return;
    }

    var units = this.activeTier().units;
    var gross = variant.price * units;
    var total = this.discounted(gross, units);

    /* Le prix barré d'un pack est le prix unitaire réel multiplié — jamais un
       tarif de référence inventé. */
    $$('[data-sw-tier]', this.root).forEach(function (tier) {
      var n = Number(tier.value);
      var box = tier.nextElementSibling;
      if (!box) return;

      var brut = variant.price * n;
      var net = self.discounted(brut, n);
      var economie = brut - net;

      var totalEl = $('[data-sw-tier-total]', box);
      var wasEl = $('[data-sw-tier-was]', box);
      var subEl = $('[data-sw-tier-sub]', box);

      if (totalEl) totalEl.textContent = self.money(net / 100);
      if (wasEl) {
        wasEl.textContent = economie > 0 ? self.money(brut / 100) : '';
        wasEl.hidden = economie <= 0;
      }
      if (subEl) {
        subEl.textContent = economie > 0
          ? self.money(net / n / 100) + " l'unité · vous économisez " + self.money(economie / 100)
          : (self.root.dataset.swPackOneNote || '');
      }
    });

    if (this.priceEl) this.priceEl.textContent = this.money(total / 100);

    var remise = gross > total;
    if (this.compareEl) {
      this.compareEl.textContent = remise ? this.money(gross / 100) : '';
      this.compareEl.hidden = !remise;
    }
    if (this.saveEl) {
      this.saveEl.hidden = !remise;
      if (remise) this.saveEl.textContent = '−' + Math.round(((gross - total) / gross) * 100) + ' %';
    }
    if (this.unitEl) {
      this.unitEl.hidden = units <= 1;
      this.unitEl.textContent = units > 1 ? 'Soit ' + this.money(total / units / 100) + ' le débardeur' : '';
    }

    if (this.button) this.button.removeAttribute('aria-disabled');
    if (this.buttonText) this.buttonText.textContent = this.root.dataset.swAddText || 'Ajouter au panier';
    if (this.errorEl) this.errorEl.textContent = '';

    if (this.stickyPrice) this.stickyPrice.textContent = this.money(total / 100);
    if (this.stickyMeta) {
      this.stickyMeta.textContent = units > 1
        ? units + ' débardeurs'
        : [top.color, 'Taille ' + top.size].filter(Boolean).join(' · ');
    }

    this.syncMedia(variant);
  };

  ShapewearProduct.prototype.syncMedia = function (variant) {
    /* Au chargement, la galerie reste sur la photo d'ouverture : l'image
       liée à la variante ne s'impose qu'après un choix du visiteur. */
    if (!this.mediaReady) {
      this.mediaReady = true;
      return;
    }
    if (!variant.featured_media_id) return;
    var thumb = $('[data-sw-thumb="' + variant.featured_media_id + '"]');
    if (thumb) thumb.click();
  };

  /* ------------------------------------------------------------- Panier */

  /* Un même couple couleur/taille choisi deux fois doit produire une ligne de
     quantité 2, pas deux lignes identiques. */
  ShapewearProduct.prototype.collectItems = function () {
    var tier = this.activeTier();
    var top = this.topSelection();
    var pairs = [];

    if (tier.units <= 1 || !tier.panel) {
      pairs.push({ color: top.color, size: top.size });
    } else {
      $$('[data-sw-unit-row]', tier.panel).forEach(function (row) {
        var colorSelect = $('[data-sw-unit-color]', row);
        var sizeSelect = $('[data-sw-unit-size]', row);
        pairs.push({ color: colorSelect.value, size: sizeSelect.value });
      });
    }

    var byId = {};
    var order = [];
    for (var i = 0; i < pairs.length; i++) {
      var variant = this.find(pairs[i].color, pairs[i].size);
      if (!variant || !variant.available) {
        return { error: 'La combinaison ' + pairs[i].color + ' / ' + pairs[i].size + ' n’est pas disponible.' };
      }
      if (!byId[variant.id]) {
        byId[variant.id] = { id: variant.id, quantity: 0 };
        order.push(variant.id);
      }
      byId[variant.id].quantity += 1;
    }

    return { items: order.map(function (id) { return byId[id]; }) };
  };

  ShapewearProduct.prototype.addToCart = function () {
    var self = this;
    var collected = this.collectItems();

    if (collected.error) {
      if (this.errorEl) this.errorEl.textContent = collected.error;
      return;
    }

    if (this.button) {
      this.button.classList.add('is-loading');
      this.button.setAttribute('aria-disabled', 'true');
    }
    if (this.errorEl) this.errorEl.textContent = '';

    fetch(routeRoot() + 'cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: collected.items })
    })
      .then(function (response) {
        return response.json().then(function (data) {
          if (!response.ok) throw new Error(data.description || data.message || 'Ajout impossible');
          return data;
        });
      })
      .then(function () {
        if (typeof window.VellunoRefreshCart === 'function') return window.VellunoRefreshCart();
        return null;
      })
      .then(function () {
        if (document.body.dataset.cartType === 'drawer' && window.VellunoDrawer) {
          window.VellunoDrawer.open('CartDrawer', self.button);
        } else {
          window.location.href = routeRoot() + 'cart';
        }
      })
      .catch(function (error) {
        if (self.errorEl) self.errorEl.textContent = error.message;
      })
      .finally(function () {
        if (self.button) {
          self.button.classList.remove('is-loading');
          self.button.removeAttribute('aria-disabled');
        }
      });
  };

  /* ------------------------------------------------- Guide des tailles */

  ShapewearProduct.prototype.bindSizeGuide = function () {
    var modal = $('[data-sw-modal]');
    if (!modal) return;
    var lastFocus = null;

    var close = function () {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    var open = function (trigger, event) {
      if (event) event.preventDefault();
      lastFocus = trigger;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      var closer = $('[data-sw-modal-close]', modal);
      if (closer) closer.focus();
    };

    $$('[data-sw-modal-open]').forEach(function (button) {
      button.addEventListener('click', function () { open(button); });
    });

    /* Un lien de menu pointant sur #guide-tailles ouvre la même fenêtre :
       la navigation Shopify ne peut pas porter d'attribut de section. */
    $$('a[href$="#guide-tailles"]').forEach(function (link) {
      link.addEventListener('click', function (event) { open(link, event); });
    });

    modal.addEventListener('click', function (event) {
      if (event.target.closest('[data-sw-modal-close]') || event.target.matches('[data-sw-modal-veil]')) close();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) close();
    });

    /* Arrivée depuis une autre page : le guide s'ouvre de lui-même. */
    if (window.location.hash === '#guide-tailles') open(null);
  };

  /* ---------------------------------------------------------- Accordéons */

  /* Panneaux ouverts dans le HTML puis repliés ici : sans JavaScript le
     contenu reste lisible et indexable. */
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

  /* --------------------------------------------------------------- Galerie */

  function initGallery(scope) {
    $$('[data-sw-gallery]', scope).forEach(function (gallery) {
      var main = $('[data-sw-gallery-main]', gallery);
      if (!main) return;
      $$('[data-sw-thumb]', gallery).forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var full = thumb.getAttribute('data-sw-full');
          if (full) main.src = full;
          $$('[data-sw-thumb]', gallery).forEach(function (other) {
            other.setAttribute('aria-current', String(other === thumb));
          });
        });
      });
    });
  }

  /* ------------------------------------------------------------------ Init */

  function init(scope) {
    initGallery(scope);
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

/* ==========================================================================
   Thème autonome : annonces, comparateur avant/après, compteur du panier.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------ Annonces défilantes */

  var bandeau = document.querySelector('[data-sw-announce]');
  if (bandeau) {
    var messages = bandeau.querySelectorAll('.sw-announce__msg');
    if (messages.length > 1) {
      var vitesse = (parseInt(bandeau.getAttribute('data-speed'), 10) || 5) * 1000;
      var courant = 0;
      setInterval(function () {
        messages[courant].classList.remove('is-on');
        courant = (courant + 1) % messages.length;
        messages[courant].classList.add('is-on');
      }, vitesse);
    }
  }

  /* --------------------------------------------------- Curseur avant/après */

  var cadre = document.querySelector('[data-sw-avap]');
  if (cadre) {
    var placer = function (ratio) {
      var pos = Math.min(100, Math.max(0, ratio));
      cadre.style.setProperty('--pos', pos + '%');
      cadre.setAttribute('aria-valuenow', Math.round(pos));
    };

    var depuisEvenement = function (event) {
      var boite = cadre.getBoundingClientRect();
      var x = event.touches ? event.touches[0].clientX : event.clientX;
      placer(((x - boite.left) / boite.width) * 100);
    };

    var glisse = false;
    cadre.addEventListener('pointerdown', function (event) {
      glisse = true;
      cadre.setPointerCapture(event.pointerId);
      depuisEvenement(event);
    });
    cadre.addEventListener('pointermove', function (event) {
      if (glisse) depuisEvenement(event);
    });
    cadre.addEventListener('pointerup', function () { glisse = false; });
    cadre.addEventListener('pointercancel', function () { glisse = false; });

    cadre.addEventListener('keydown', function (event) {
      var actuel = parseFloat(cadre.getAttribute('aria-valuenow')) || 50;
      if (event.key === 'ArrowLeft') { placer(actuel - 4); event.preventDefault(); }
      if (event.key === 'ArrowRight') { placer(actuel + 4); event.preventDefault(); }
    });
  }

  /* ------------------------------------------------- Compteur du panier */

  var compteur = document.querySelector('[data-sw-cart-count]');
  if (compteur) {
    document.addEventListener('sw:cart-updated', function () {
      fetch('/cart.js', { headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (panier) { compteur.textContent = panier.item_count; })
        .catch(function () {});
    });
  }
})();
