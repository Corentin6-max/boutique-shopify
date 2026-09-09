# boutique-shopify

Code du thème Shopify de **Velluno** (velluno.fr).

## Thème « Velluno — Shapewear »

Thème dédié à la vente du **débardeur gainant homme**, construit à partir du thème
principal `vellunotheme-7` (même en-tête, pied de page, tiroir panier), avec une
identité visuelle masculine et une fiche produit orientée conversion.

- Thème Shopify : `Velluno — Shapewear` (id `205757677905`), **non publié**
- Aperçu : `https://velluno.fr/?preview_theme_id=205757677905`

### Arborescence

```
theme/
├── assets/
│   ├── shapewear.css        Styles des sections (namespace .sw)
│   └── shapewear.js         Sélection pack/couleur/taille, prix dynamique, accordéons
├── config/
│   └── settings_data.json   Palette masculine, DM Sans, boutons noirs
├── layout/
│   └── theme.liquid         Ajout des deux assets ci-dessus
├── sections/
│   ├── shapewear-hero.liquid
│   ├── shapewear-stats.liquid
│   ├── shapewear-cards.liquid       (réutilisable : problème / bénéfices)
│   ├── shapewear-compare.liquid
│   ├── shapewear-proof.liquid       (image + texte, masqué tant qu'il n'y a pas de photo)
│   ├── shapewear-offer.liquid       (rappel des packs, prix lus sur le produit)
│   ├── shapewear-reviews.liquid
│   ├── shapewear-faq.liquid
│   ├── shapewear-guarantee.liquid
│   └── shapewear-pdp.liquid         Fiche produit complète
├── sections/  (suite)
│   ├── shapewear-shipbar.liquid     Bandeau livraison sous l'en-tête
│   └── header-group.json            En-tête : annonces, menu, bandeau
├── snippets/
│   └── sw-icon.liquid       Jeu d'icônes SVG
└── templates/
    ├── index.json           Page d'accueil (9 sections)
    └── product.json         Fiche produit (4 sections)
```

### Structure produit attendue

La fiche produit détecte **trois options par leur nom** (pas leur position) :

| Option    | Valeurs                                        |
|-----------|------------------------------------------------|
| `Pack`    | `1 débardeur`, `2 débardeurs`, `3 débardeurs`  |
| `Couleur` | `Noir`, `Blanc`, `Beige`                        |
| `Taille`  | `S`, `M`, `L`, `XL`, `2XL`                      |

Soit 45 variantes. Le nombre d'unités d'un pack est lu sur le premier mot de la
valeur (`2 débardeurs` → 2), ce qui alimente le prix à l'unité et le calcul
d'économie. Si l'une des trois options manque, la section retombe sur le
sélecteur de variantes standard du thème au lieu de casser la page.

### Points d'attention

- L'en-tête utilise le menu Shopify **`velluno-shapewear`** (3 entrées), pas
  `main-menu` : le menu de l'ancienne boutique animalerie reste intact pour le
  thème publié tant que celui-ci n'est pas remplacé.
- « Guide des tailles » pointe sur `#guide-tailles`. La navigation Shopify ne
  peut pas porter d'attribut de section : `shapewear.js` écoute donc la
  destination du lien, et ouvre aussi la fenêtre à l'arrivée si l'ancre est
  dans l'URL.
- Le bouton de recherche de l'en-tête est masqué par la feuille de style
  (`.section-header #SearchToggle`), pas retiré de `sections/header.liquid` :
  ce fichier appartient au thème de base et n'est pas suivi dans ce dépôt.
- Les blocs d'avis clients sont livrés **vides**. Un avis inventé est une pratique
  commerciale trompeuse (art. L121-2 du code de la consommation).
- La FAQ de la fiche produit émet un balisage `FAQPage` (schema.org). Depuis 2023
  Google réserve les résultats enrichis FAQ aux sites institutionnels et de santé :
  le balisage sert à la compréhension de la page, **pas** à obtenir des étoiles.
- La réponse sur la gynécomastie dit explicitement que le vêtement **n'est pas un
  traitement médical**. Ne pas retirer cette phrase : c'est ce qui sépare une
  description de produit d'une allégation de santé.
- Les mentions de livraison sont volontairement neutres : renseignez vos délais
  réels une fois le fournisseur configuré.
- Le compteur d'avis est à `0`, ce qui masque la note. Ne l'augmentez qu'avec de
  vrais avis.

### Déploiement

Les fichiers sont téléversés via l'API Admin (`themeFilesUpsert`). L'opération est
**asynchrone** : un fichier peut n'apparaître qu'après quelques secondes. Vérifiez
avec `checksumMd5` plutôt qu'avec le retour de la mutation, qui renvoie une liste
vide même en cas de succès.

Deux constructions Liquid sont **silencieusement rejetées** par `themeFilesUpsert`
et sont donc à proscrire :

- `comment` / `endcomment` à l'intérieur d'un tag `{% liquid %}`
- un `#` à l'intérieur d'un tag `{% liquid %}` (il y ouvre un commentaire de ligne),
  y compris entre guillemets — sortez les valeurs hexadécimales dans un `assign`
  classique
