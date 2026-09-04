# Visuels à fournir — procédure complète

Les images sont **la seule partie du catalogue qui n'est pas automatisable**.
L'import CSV de Shopify ne sait lire que des **URL publiques** : il ne peut pas
aller chercher un fichier sur votre disque. D'où cette procédure en trois temps.

`import/products_velluno.csv` est donc livré avec :

- `Image Src` **vide** — c'est vous qui collerez les URL ;
- `Image Alt Text` **déjà rédigé en français** — rien à réécrire ;
- `Image Position` renseignée sur les lignes de variantes existantes.

---

## Procédure en 3 étapes

### 1. Téléverser les fichiers

Admin Shopify → **Contenu → Fichiers** → *Télécharger des fichiers*.
Déposez toutes les images d'un coup. Nommez-les avant l'envoi selon le schéma
`handle-01.webp`, `handle-02.webp`… : les URL resteront lisibles et vous
retrouverez l'ordre au premier coup d'œil.

### 2. Copier les URL publiques

Toujours dans **Contenu → Fichiers**, cliquez sur l'icône « lien » à droite de
chaque fichier pour copier son URL. Elle ressemble à :

```
https://cdn.shopify.com/s/files/1/0000/0000/files/fontaine-eau-velluno-7l-inox-01.webp?v=1700000000
```

Gardez le `?v=...` : il fait partie de l'URL.

### 3. Coller dans le CSV, puis réimporter

Ouvrez `products_velluno.csv` (LibreOffice Calc, ou Google Sheets — **pas**
Excel en double-clic, qui casse l'UTF-8 : passez par *Données → Importer*, en
choisissant l'encodage **UTF-8** et le séparateur **virgule**).

- Collez chaque URL dans `Image Src`, sur la ligne dont `Image Position`
  correspond.
- Pour les visuels **au-delà du nombre de variantes** (la fontaine a 3 variantes
  mais 6 visuels), **ajoutez des lignes supplémentaires** juste sous les lignes
  du produit, ne remplissant que quatre colonnes :
  `Handle`, `Image Src`, `Image Position`, `Image Alt Text`.
  Toutes les autres colonnes restent vides. C'est la façon standard d'attacher
  plusieurs images à un produit dans un CSV Shopify.
- Enregistrez en **CSV UTF-8**, puis réimportez le fichier
  (**Produits → Importer**, avec *Remplacer les produits existants* coché).

> Une fois les images en place, relancez `python3 tools/test_products_csv.py` :
> le test tolère un `Image Src` rempli, il vérifie surtout que les 23 lignes de
> variantes et les prix n'ont pas bougé pendant l'édition dans le tableur.

---

## Règles communes à tous les visuels

| Critère | Valeur |
|---|---|
| Format | `.webp` (fallback `.jpg` si votre banque d'images ne le propose pas) |
| Largeur max | 1600 px |
| Qualité | 82 |
| Ratio | **1:1 (carré)** pour toutes les images produit |
| Poids visé | < 250 Ko par image |
| Fond | Clair, lumière naturelle, sans fouillis graphique |
| Interdit | Flèches rouges, pastilles « MEGA SALE », texte incrusté, logo de marketplace |

L'image en **position 1** est celle qui apparaît dans les grilles de collection,
le panier et les résultats de recherche : c'est la plus importante.

---

## 1. `fontaine-eau-velluno-7l-inox` — 6 visuels

| Pos. | Contenu attendu | Ratio | Texte alternatif (déjà dans le CSV) |
|---|---|---|---|
| 1 | La fontaine entière, de trois quarts, sur un sol clair, fond neutre | 1:1 | Fontaine à eau VELLUNO Source 7L en inox, posée sur un sol clair |
| 2 | Gros plan sur la cuve inox : on doit voir le grain du métal | 1:1 | Détail de la cuve en inox 304 de la fontaine VELLUNO Source 7L |
| 3 | Le module magnétique détaché du socle, câble USB-C visible | 1:1 | Module d'alimentation magnétique de la fontaine VELLUNO Source 7L, sans câble dans l'eau |
| 4 | Un filtre 4 étages, éclaté ou en coupe, à côté de la fontaine | 1:1 | Filtre 4 étages de la fontaine VELLUNO Source 7L, coton et charbon actif |
| 5 | **Mise en situation** : un chat qui boit, lumière naturelle, salon | 1:1 | Chat buvant à la fontaine VELLUNO Source 7L dans un salon |
| 6 | La fenêtre de niveau et le témoin lumineux, en gros plan | 1:1 | Fenêtre de niveau d'eau et témoin lumineux de la fontaine VELLUNO Source 7L |

## 2. `filtres-rechange-velluno-source` — 4 visuels

| Pos. | Contenu attendu | Ratio | Texte alternatif |
|---|---|---|---|
| 1 | Le lot de filtres, empilés ou en éventail, fond neutre | 1:1 | Lot de filtres de rechange VELLUNO 4 étages pour fontaine à eau |
| 2 | Coupe ou éclaté montrant les 4 couches | 1:1 | Coupe d'un filtre VELLUNO montrant les quatre étages de filtration |
| 3 | Un filtre en place dans la fontaine, capot ouvert | 1:1 | Filtre VELLUNO installé dans la fontaine Source 7L |
| 4 | Les mousses noires de pré-filtration, seules | 1:1 | Mousses noires de pré-filtration incluses avec les filtres VELLUNO |

## 3. `tapis-gamelle-silicone-velluno` — 5 visuels

| Pos. | Contenu attendu | Ratio | Texte alternatif |
|---|---|---|---|
| 1 | Le tapis vert sauge avec deux gamelles posées dessus | 1:1 | Tapis de gamelle VELLUNO Base en silicone vert sauge avec deux gamelles |
| 2 | Gros plan de profil sur le rebord relevé, avec un filet d'eau retenu | 1:1 | Détail du rebord relevé anti-débordement du tapis VELLUNO Base |
| 3 | Les 5 coloris à plat, alignés ou en dégradé | 1:1 | Les cinq coloris du tapis de gamelle VELLUNO Base |
| 4 | Le tapis enroulé, tenu à la main ou dans un sac | 1:1 | Tapis de gamelle VELLUNO Base enroulé pour le voyage |
| 5 | **Mise en situation** : tapis sous la fontaine, dans une cuisine | 1:1 | Tapis VELLUNO Base sous la fontaine Source 7L dans une cuisine |

## 4. `os-a-macher-dentaire-velluno` — 5 visuels

| Pos. | Contenu attendu | Ratio | Texte alternatif |
|---|---|---|---|
| 1 | Un os bleu seul, fond neutre | 1:1 | Os à mâcher dentaire VELLUNO Chew en caoutchouc bleu |
| 2 | Macro sur les picots texturés | 1:1 | Détail des picots texturés de l'os à mâcher VELLUNO Chew |
| 3 | Les 6 coloris ensemble | 1:1 | Les six coloris de l'os à mâcher VELLUNO Chew |
| 4 | Le lot de 3, groupés | 1:1 | Lot de 3 os à mâcher VELLUNO Chew |
| 5 | **Mise en situation** : un chien qui joue, jardin, lumière du jour | 1:1 | Chien jouant avec l'os à mâcher VELLUNO Chew dans un jardin |

---

## Visuels hors catalogue

Ceux-ci ne passent pas par le CSV : ils se règlent dans le thème.

| Emplacement | Réglage | Format | Contenu |
|---|---|---|---|
| Héro d'accueil | Personnaliser → Héro éditorial → Image | 3:2 paysage, 1600 px | La fontaine en situation, cadrage large, beaucoup d'air |
| Bloc « Pourquoi l'inox » | Personnaliser → Image et texte | 1:1, 1200 px | Macro sur l'inox, ou comparaison inox / plastique rayé |
| 3 bandeaux bénéfices (fiche fontaine) | Personnaliser → Image et texte ×3 | 1:1, 1200 px | 01 inox · 02 silence (fontaine dans un salon calme) · 03 les 7 litres |
| Cartes de collection | Personnaliser → Grille de collections | 4:3, 800 px | Une image d'ambiance par univers |
| Partage social | Paramètres du thème → Marque → Image de partage | **1200 × 630 px** | La fontaine, wordmark discret |
| Favicon | Paramètres du thème → Marque → Favicon | **512 × 512 px** carré | La goutte VELLUNO sur fond encre |
| Page mot de passe | Paramètres du thème → Marque → Image de partage | 3:4 portrait | Nature morte : fontaine + végétal |

> **Tant que ces images ne sont pas fournies**, le thème affiche des
> placeholders SVG intégrés (moins de 1 Ko chacun, aux bonnes dimensions).
> Rien ne casse, rien ne saute : la mise en page est déjà réservée, il n'y a
> donc aucun décalage (CLS) au remplacement.
