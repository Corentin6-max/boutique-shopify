# Thème « Velluno — Boutique (sans Vitals) »

Thème **créé pour l'occasion** (`themeDuplicate` de Horizon), non publié.
ID `205470794065`.

Horizon est le thème gratuit récent de Shopify. Il ne contient **aucun fichier
Vitals** et **aucun bloc d'application Vitals** dans ses réglages — contrairement
au thème publié, dont les 11 sections de page d'accueil sont toutes des sections
`vitals-*` fournies par l'application.

## Ce que Horizon fait nativement

Les deux points qui exigeaient du CSS et du JavaScript sur Vitals sont ici de
simples réglages :

| Besoin | Sur Vitals | Sur Horizon |
|---|---|---|
| Bouton « Ajouter au panier » sur les cartes | JS maison + API panier | bloc natif `buy-buttons` |
| Défilement horizontal mobile | CSS `flex` + `scroll-snap` | réglage `carousel_on_mobile: true` |

Le fichier `velluno-custom.js` n'a donc plus lieu d'être : le panier passe par le
tiroir natif du thème (`cart_type: drawer`).

## Page d'accueil

| Section | Type | Contenu |
|---|---|---|
| 1 | `hero` | « Votre chat ne boit pas assez. » + bouton vers la collection fontaines |
| 2 | `marquee` | Bandeau défilant : livraison offerte · retours 90 jours · paiement sécurisé · service client français |
| 3 | `product-list` | 4 produits, carrousel sur mobile, bouton panier sur chaque carte |
| 4 | `hero` | « Une gamme courte, pensée autour d'un usage » + lien vers Notre histoire |

Aucune image : les sections sont sur fond de couleur, prêtes à recevoir les
visuels dans l'éditeur.

La grille produits pointe sur la collection **Accessoires pour Chiens**, qui
contient les 4 vrais produits en français — et non `new-arrivals`, qui contient
encore les montres connectées.

## Réglages hérités de Horizon

Police Inter, palette blanc/noir, largeur de page « narrow », panier en tiroir,
rayon des boutons 14 px. Tout se change dans **Personnaliser → Réglages du thème**.

## Prévisualiser

Boutique en ligne → Thèmes → « Velluno — Boutique (sans Vitals) » → Aperçu.

## En-tête et pied de page

Sur Horizon tel qu'installé, la section d'en-tête, la barre d'annonce et les deux
sections de pied de page arrivent avec `"disabled": true` — la boutique
s'afficherait sans navigation ni pied de page. Elles ont été **activées**, et
leurs textes traduits :

- barre d'annonce : « Livraison offerte en France · Retours sous 90 jours » et
  « Paiement sécurisé · Service client français »
- newsletter : « Recevez nos conseils d'hydratation »
- bouton : « S'inscrire »
- « Powered by Shopify » retiré du copyright
- liens sociaux retirés : ils pointaient vers facebook.com, instagram.com et x.com
  génériques

Le menu principal est `main-menu`, déjà en français.

## Ce qui n'est PAS recréé

Seules la page d'accueil, l'en-tête et le pied de page ont été refaits.
**Les pages produit, collection, panier, recherche et blog sont celles de Horizon
par défaut**, avec quelques libellés encore en anglais (« Disclosures »,
« You may also like »).

La page d'accueil compte 4 sections, contre 11 sur le thème Vitals. Ne sont pas
reprises : les deux blocs « Image & liste d'avantages », le bloc de 4 cartes,
l'argument vétérinaire sur les problèmes rénaux, et le badge d'avis Vitals.
