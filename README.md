# Velluno — thème Shopify

Thème **Online Store 2.0** pour la boutique Velluno (velluno.fr), déjà branché sur les
produits et les collections présents dans le magasin.

---

## Contenu du dépôt

```
theme/                            le thème Shopify (source)
dist/velluno-theme.zip            le ZIP prêt à importer (généré par build.sh)
import/configuration-boutique.md  menus, pages et réglages restant à faire dans l'admin
build.sh                          régénère le ZIP après modification du thème
```

---

## Installation en 2 étapes

### 1. Importer le thème
`dist/velluno-theme.zip` → **Boutique en ligne → Thèmes → Ajouter un thème → Importer un fichier ZIP**,
puis **Publier**.

### 2. Créer les menus et les pages
Suivez `import/configuration-boutique.md` — tout le texte est prêt à copier-coller.

Le logo Velluno est intégré en SVG (il s'affiche sans réglage). Pour le remplacer :
**Personnaliser → Paramètres du thème → Logo**.

---

## Produits et collections déjà branchés

Aucun réglage à faire : la page d'accueil pointe directement sur le catalogue existant.

| Section de la page d'accueil | Ressource liée |
|---|---|
| Nos best-sellers | collection `frontpage` (les 4 produits) |
| Le coup de cœur | *Fontaine à Eau 7L pour Chat & Chien* |
| Trouvez ce qu'il vous faut | `fontaines-hydratation`, `repas-gamelles`, `jouets-hygiene-dentaire` |

Sous chaque produit d'une grille, un bouton **« Voir plus »** mène à la fiche de ce produit.
Le libellé se change dans **Personnaliser → Paramètres du thème → Fiches produit**.

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
offres par quantité (1/2/3), bouton « Voir plus » vers la fiche sous chaque produit des grilles,
sélecteur de variantes sans rechargement, bouton d'achat collant sur mobile,
galerie produit à miniatures, données structurées Produit / FAQ / Article / Organisation.

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
