# Velluno — thème Shopify + catalogue de démarrage

Boutique complète prête à importer dans Shopify : un thème **Online Store 2.0** (Velluno)
et un fichier d'import produits contenant les 4 articles demandés.

Aucun compte Shopify n'a été utilisé pour construire ce dépôt — tout se fait par import de fichiers.

---

## Contenu du dépôt

```
theme/                        le thème Shopify (à zipper et importer)
dist/velluno-theme.zip        le ZIP prêt à importer (généré par build.sh)
import/velluno-produits.csv   les 4 produits + leurs 24 variantes
import/pages-collections-menus.md   collections, menus et pages à créer (contenu prêt à coller)
build.sh                      régénère le ZIP après modification du thème
```

---

## Installation en 4 étapes

### 1. Importer le thème
`dist/velluno-theme.zip` → **Boutique en ligne → Thèmes → Ajouter un thème → Importer un fichier ZIP**,
puis **Publier**.

### 2. Importer les produits
`import/velluno-produits.csv` → **Produits → Importer → Ajouter le fichier**.
Cochez « Remplacer les produits ayant le même handle » si vous réimportez.

Les 4 produits arrivent avec leurs variantes, prix, prix barrés, SKU, poids, tags, catégories
Google et descriptions HTML complètes.

> **Les images ne sont pas incluses** (le CSV ne contient pas de colonne `Image Src`) :
> ajoutez-les depuis la fiche produit, ou remplissez la colonne `Image Src` avec des URLs
> publiques avant l'import. Comptez 5 à 7 photos par produit.

### 3. Créer collections, menus et pages
Suivez `import/pages-collections-menus.md` — tout le texte est prêt à copier-coller.

### 4. Régler le thème
**Personnaliser** → assignez les collections aux sections *Nos best-sellers*, *Trouvez ce qu'il
vous faut* et *Le coup de cœur*, puis ajoutez vos images dans les sections *Bannière*
et *Image avec texte*.

Le logo Velluno est intégré en SVG (il s'affiche sans réglage). Pour le remplacer :
**Personnaliser → Paramètres du thème → Logo**.

---

## Les 4 produits importés

| Produit | Variantes | Prix |
|---|---|---|
| Jouet à mâcher os en caoutchouc | 6 couleurs × 2 lots = 12 | 1,99€ / 4,99€ |
| Filtres de rechange pour fontaine | 3 lots (10/20/30) | 6,49€ → 16,49€ |
| Fontaine à eau 7 L acier inoxydable | 4 packs | 53,99€ → 68,99€ |
| Tapis de gamelle en silicone | 5 couleurs | 5,69€ |

**Prix** : les tarifs des lots 20 et 30 filtres, ainsi que les packs « fontaine + filtres »,
sont des extrapolations cohérentes — ajustez-les à vos marges avant de publier.
Les prix repris des captures sont des prix fournisseur : pensez à définir votre marge
(colonne `Cost per item` du CSV, laissée vide) avant de mettre la boutique en ligne.

---

## Ce que contient le thème

**Pages** : accueil, collection (avec filtres et tri), fiche produit, panier (page + tiroir),
recherche avec suggestions instantanées, blog, article, pages libres, contact, 404,
page mot de passe, et tous les écrans client (connexion, inscription, compte, commande, adresses).

**Sections modulaires** (glisser-déposer dans l'éditeur) : bannière héro, bandeau défilant,
colonnes à icônes, collection en vedette, produit en vedette, liste de collections,
image avec texte, avant/après avec curseur, avis clients, étapes, tableau comparatif, FAQ
(avec données structurées), texte enrichi, vidéo, colonnes multiples, articles de blog,
newsletter, formulaire de contact, et une section « Apps » pour les blocs d'applications.

**Fonctionnalités** : tiroir de panier en AJAX, barre de progression « livraison offerte »,
offres par quantité (1/2/3), ajout rapide depuis les grilles, sélecteur de variantes sans
rechargement, bouton d'achat collant sur mobile, galerie produit à miniatures,
données structurées Produit / FAQ / Article / Organisation.

**Réglages** : couleurs, typographies (Playfair Display + Assistant), largeur de page,
arrondis, animations, format des fiches produit, type de panier, réseaux sociaux.

**Langues** : français et anglais (`theme/locales/`), 200 clés chacune.

Le thème passe `@shopify/theme-check` sans erreur ni avertissement.

---

## Modifier et régénérer le ZIP

```bash
./build.sh          # recrée dist/velluno-theme.zip depuis theme/
```

Pour un développement en direct avec rechargement automatique :

```bash
npm install -g @shopify/cli
shopify theme dev --path theme --store votre-boutique.myshopify.com
```

---

## Note sur la boutique de référence

La demande initiale était de reproduire `yoracare.com`. Ce domaine est **bloqué par la
politique réseau de l'environnement d'exécution** (403 du proxy sur `curl` comme sur le
fetch HTTP) : la page n'a donc pas pu être analysée, ni sa mise en page ni ses textes copiés.

Le thème reprend la structure et les codes d'une boutique DTC monoproduit de ce type
(héro avec preuve sociale, bandeau de réassurance, offres par quantité, avant/après, avis,
FAQ, garantie) mais avec une identité, des textes et un design propres à Velluno.
Si vous m'envoyez des captures d'écran ou l'export HTML de la page, je peux aligner
la mise en page de plus près.
