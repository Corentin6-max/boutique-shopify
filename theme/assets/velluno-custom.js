/* ==========================================================================
   Velluno — bouton « Ajouter au panier » sur les cartes de la grille Vitals
   La section Vitals « Featured Collection Grid » n'en propose pas nativement :
   le bouton est ajouté ici, puis relié à l'API panier de Shopify.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Réglage ----------------------------------------------------------
     false : un produit à plusieurs variantes envoie vers sa fiche
             (« Choisir les options »). Évite qu'un client commande la
             mauvaise variante d'une fontaine à 90 €.
     true  : ajoute toujours la première variante disponible au panier.
     ---------------------------------------------------------------------- */
  var ALWAYS_ADD = false;

  var GRID = '.VtlsFeaturedCollectionGridContent__Products';
  var CARD = '.VtlsProductsGridProdCard';
  var cache = {};

  function euro(cents) {
    return (cents / 100).toFixed(2).replace('.', ',') + ' €';
  }

  function getProduct(handle) {
    if (cache[handle]) return cache[handle];
    cache[handle] = fetch('/products/' + handle + '.js', {
      headers: { Accept: 'application/json' }
    }).then(function (r) {
      if (!r.ok) throw new Error('produit introuvable');
      return r.json();
    });
    return cache[handle];
  }

  function refreshCartCount() {
    fetch('/cart.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        document.querySelectorAll('.cart-count-bubble span[aria-hidden="true"]')
          .forEach(function (el) { el.textContent = cart.item_count; });
        var bubbleHost = document.querySelector('#cart-icon-bubble');
        if (bubbleHost && cart.item_count > 0 && !bubbleHost.querySelector('.cart-count-bubble')) {
          var b = document.createElement('div');
          b.className = 'cart-count-bubble';
          b.innerHTML = '<span aria-hidden="true">' + cart.item_count + '</span>';
          bubbleHost.appendChild(b);
        }
        document.dispatchEvent(new CustomEvent('vl:cart-updated', { detail: cart }));
      })
      .catch(function () { /* le compteur se remettra à jour au prochain chargement */ });
  }

  function addToCart(variantId, btn) {
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Ajout…';

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
    })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (e) { throw new Error(e.description || 'refus du panier'); });
        return r.json();
      })
      .then(function () {
        btn.textContent = 'Ajouté au panier';
        btn.classList.add('vl-atc--done');
        refreshCartCount();
        setTimeout(function () {
          btn.textContent = label;
          btn.classList.remove('vl-atc--done');
          btn.disabled = false;
        }, 2200);
      })
      .catch(function (err) {
        btn.textContent = 'Indisponible';
        console.warn('[Velluno] ajout au panier impossible :', err.message);
        setTimeout(function () {
          btn.textContent = label;
          btn.disabled = false;
        }, 2200);
      });
  }

  function buildButton(card) {
    if (card.querySelector('.vl-atc')) return;

    var link = card.querySelector('a[href*="/products/"]');
    if (!link) return;

    var match = link.getAttribute('href').match(/\/products\/([^/?#]+)/);
    if (!match) return;
    var handle = match[1];

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vl-atc';
    btn.textContent = 'Ajouter au panier';
    btn.disabled = true;
    card.appendChild(btn);

    getProduct(handle).then(function (product) {
      var available = product.variants.filter(function (v) { return v.available; });

      if (!available.length) {
        btn.textContent = 'Épuisé';
        btn.classList.add('vl-atc--soldout');
        return;
      }

      // Plusieurs variantes : on envoie choisir sur la fiche produit.
      if (available.length > 1 && !ALWAYS_ADD) {
        var a = document.createElement('a');
        a.className = 'vl-atc';
        a.href = '/products/' + handle;
        a.textContent = 'Choisir les options';
        btn.replaceWith(a);
        return;
      }

      var variant = available[0];
      btn.disabled = false;
      btn.setAttribute('aria-label', 'Ajouter ' + product.title + ' au panier, ' + euro(variant.price));
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        addToCart(variant.id, btn);
      });
    }).catch(function () {
      btn.remove();
    });
  }

  function scan() {
    document.querySelectorAll(GRID + ' ' + CARD).forEach(buildButton);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }

  // Les sections Vitals se re-rendent dans l'éditeur de thème et après le chargement différé.
  var mo = new MutationObserver(function () { scan(); });
  mo.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('shopify:section:load', scan);
})();
