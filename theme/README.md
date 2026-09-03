# Thème — « Copie de Vitals Store Builder »

Fichiers écrits sur le thème **non publié** `Copie de Vitals Store Builder`
(ID `205464535377`). Le thème publié, lui, n'a pas été touché : Shopify interdit
toute écriture par API sur le thème en ligne.

| Fichier | Rôle |
|---|---|
| `templates/index.json` | Page d'accueil : 11 sections Vitals, sans images, textes corrigés |
| `assets/velluno-custom.css` | Titres de cartes, bouton panier, défilement horizontal mobile |
| `assets/velluno-custom.js` | Bouton « Ajouter au panier » sur les cartes produit |

Le CSS et le JS sont chargés par une section `custom-liquid` nommée
`velluno_custom_assets`, placée en fin de page d'accueil :

```liquid
{{ 'velluno-custom.css' | asset_url | stylesheet_tag }}
{{ 'velluno-custom.js' | asset_url | script_tag }}
```

## Les 5 modifications demandées

**1. Bouton « Ajouter au panier » sur les cartes produit** — `velluno-custom.js`

La section Vitals « Featured Collection Grid » n'a **aucun** support natif du
panier : le mot `cart` n'apparaît pas une seule fois dans ses 110 000 caractères.
Le bouton ne pouvait donc pas venir d'un réglage ni du seul CSS. Il est créé en
JavaScript, puis relié à l'API panier de Shopify (`/cart/add.js`).

Comportement par défaut : un produit à **une seule variante** s'ajoute au panier ;
un produit à **plusieurs variantes** affiche « Choisir les options » et renvoie
vers sa fiche. C'est délibéré — ajouter d'office la première variante d'une
fontaine à 90 € revient à faire commander la mauvaise référence.
Pour ajouter toujours la première variante disponible, passer `ALWAYS_ADD` à
`true` en tête du fichier.

**2. Les 4 produits sur une ligne, en défilement horizontal sur mobile** — CSS

En dessous de 992 px (le point de bascule de Vitals), la grille passe en
`display:flex` avec `overflow-x:auto` et accroche au défilement
(`scroll-snap-type`). Les cartes font 62 % de la largeur : la suivante dépasse,
ce qui montre qu'on peut faire défiler. Réglable via `--vl-mobile-card-width`.

**3. Retrait de la fontaine 7L de la section New Arrivals**

Impossible depuis l'éditeur : la section Vitals affiche une collection entière
avec une limite de produits, sans exclusion possible. Le produit a donc été
retiré de la **collection** `new-arrivals` — c'est une donnée Shopify, pas un
réglage de thème, donc l'effet vaut aussi pour le thème publié. Réversible en
le remettant dans la collection.

Produit retiré : `11098253328721` « Stainless Steel Pet Water Fountain – 7L Auto
Dispenser » (doublon de la Série B, stock 0).

**4. Couleurs, polices et espacements des sections Vitals** — CSS

Les valeurs modifiables sont regroupées dans le bloc `:root` en tête de
`velluno-custom.css`. Les sélecteurs Vitals sont très spécifiques : les
surcharges nécessitent `!important`.

**5. Style du titre produit** — `.VtlsProductsGridProdCardTextContainer__ProductTitle`

Passé de 14 px à 15 px, graisse 600, interligne 1,35. Une hauteur minimale de
deux lignes est réservée pour que les prix restent alignés d'une carte à l'autre.

## Prévisualiser

Boutique en ligne → Thèmes → « Copie de Vitals Store Builder » → Aperçu.
Le bouton panier et le défilement mobile ne se voient que sur la boutique réelle,
pas dans l'éditeur.
