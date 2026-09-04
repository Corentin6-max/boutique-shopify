# VELLUNO — installation, étape par étape

Tout ce qui suit se fait **par vous, dans votre admin Shopify**. Aucun script de
ce dossier ne se connecte à votre boutique.

Comptez **1 h 30 à 2 h** sans les images, une demi-journée avec.

> **Ordre impératif.** Les collections ont besoin des produits, les menus ont
> besoin des collections et des pages, le thème a besoin des menus. Suivez la
> numérotation.

---

## Récapitulatif de l'ordre d'import

| # | Action | Fichier | Durée |
|---|---|---|---|
| 1 | Importer le thème | `velluno-theme.zip` | 5 min |
| 2 | Importer les produits | `import/products_velluno.csv` | 10 min |
| 3 | Créer les 5 collections | `import/collections.csv` | 15 min |
| 4 | Créer les 9 pages | `content/pages/*.md` | 30 min |
| 5 | Créer les menus | `content/navigation.md` | 15 min |
| 6 | Importer les redirections | `import/redirects.csv` | 5 min |
| 7 | Régler les paramètres du thème | — | 10 min |
| 8 | Régler la livraison | — | 15 min |
| 9 | Créer les remises de bundle | — | 10 min |
| 10 | Personnaliser les notifications | `content/emails/*.md` | 30 min |
| 11 | Téléverser les images | `import/images_TODO.md` | variable |
| 12 | Vérifications finales | — | 20 min |

---

## Étape 0 — Construire l'archive

Si `velluno-theme.zip` n'est pas déjà là :

```bash
./build.sh
```

Le script **analyse le Liquid avec le vrai linter Shopify** (`theme-check`,
hors ligne, sans authentification), vérifie que les **19 templates obligatoires**
sont présents, valide tous les JSON, contrôle les clés de traduction et les
budgets CSS/JS, refuse les fichiers interdits, puis construit l'archive.
Il **échoue** si quelque chose empêcherait l'import. Il ne contacte aucune
boutique.

Au premier lancement : `npm install` (installe `@shopify/theme-check-node`).

---

## Étape 1 — Importer le thème

1. **Boutique en ligne → Thèmes**
2. *Ajouter un thème* → **Importer un fichier zip**
3. Sélectionnez `velluno-theme.zip`
4. Attendez la fin du traitement. **Ne publiez pas encore** — travaillez en
   aperçu jusqu'à l'étape 12.

> **Erreur d'import ?** Relancez `./build.sh` et lisez sa sortie : il détecte à
> l'avance à peu près tout ce que Shopify refuse (dossier parasite à la racine,
> JSON invalide, fichier trop lourd).

Le thème arrive avec le préréglage **VELLUNO** déjà actif : couleurs,
typographie, seuils de livraison, e-mail du service client.

---

## Étape 2 — Importer les produits

1. **Produits → Importer**
2. Fichier : `import/products_velluno.csv`
3. **Ne cochez pas** « Remplacer tous les produits actuels » lors du premier
   import.
4. *Télécharger et prévisualiser* → vérifiez que Shopify annonce **4 produits**
   → *Importer les produits*

**À vérifier immédiatement après :**

- [ ] 4 produits, tous en statut **Actif**
- [ ] La fontaine a **3 variantes**, les filtres **3**, le tapis **5**, l'os
      **12** — soit **23 variantes**
- [ ] Les accents sont corrects (« Os à mâcher », « 4 étages »). Si vous voyez
      `Ã©`, le fichier a été ouvert et réenregistré par Excel : reprenez le CSV
      d'origine.
- [ ] Chaque produit est publié sur le canal **Boutique en ligne**
- [ ] Le suivi des stocks est **désactivé** (les produits restent achetables)

### Assigner le template de la fontaine ⚠️

C'est l'étape la plus facile à oublier, et celle qui change tout.

1. Ouvrez **VELLUNO Source 7L**
2. Colonne de droite, encart **Publication de la boutique en ligne** → *Modifier*
   à côté de « Modèle de thème »
3. Choisissez **`product.fontaine`**
4. Enregistrer

Sans ça, la fontaine s'affiche avec le template produit standard : pas de
bundle, pas de comparatif, pas de FAQ, pas de bandeaux bénéfices.

---

## Étape 3 — Créer les collections

> **Shopify ne sait pas importer des collections par CSV.**
> `import/collections.csv` sert donc de **source de copie** : ouvrez-le et
> recopiez les champs. (Si vous utilisez l'application **Matrixify**, le fichier
> est directement importable tel quel.)

Pour chacune des 5 lignes : **Produits → Collections → Créer une collection**

- **Titre** → colonne `Title`
- **Description** → colonne `Body HTML` (basculez l'éditeur en mode HTML avec
  le bouton `<>`)
- **Type** → **Manuelle** (colonne `Collection Type` = Custom)
- **Produits** → ceux listés dans `Product Handles`
- **Modifier le référencement du site web** → collez `Metafield: title_tag` dans
  *Titre de la page* et `Metafield: description_tag` dans *Description*
- **Handle** → vérifiez qu'il correspond exactement à la colonne `Handle`

| Handle | Titre | Produits |
|---|---|---|
| `hydratation` | Hydratation | Fontaine + filtres |
| `coin-repas` | Coin repas | Tapis + fontaine |
| `jeu-mastication` | Jeu & mastication | Os à mâcher |
| `rechanges` | Consommables & rechanges | Filtres |
| `best-sellers` | Best-sellers | Les 4 produits |

> ⚠️ **Les handles doivent être exacts** : la page d'accueil et le template de
> la fontaine appellent `best-sellers`, `hydratation`, `coin-repas`,
> `jeu-mastication` et `rechanges` par leur handle. Un handle
> `hydratation-1` (ce que Shopify génère en cas de doublon) casse la section
> concernée.

---

## Étape 4 — Créer les pages

**Contenu → Pages → Ajouter une page**, pour chacun des 9 fichiers de
`content/pages/`.

Chaque fichier commence par un bloc `---` qui indique le titre, le handle, le
template et les champs SEO. **Ne collez pas ce bloc** dans la page : il est là
pour vous.

| Fichier | Titre | Handle | Modèle |
|---|---|---|---|
| `a-propos.md` | À propos | `a-propos` | `page` |
| `livraison.md` | Livraison & suivi | `livraison` | `page` |
| `retours-et-remboursements.md` | Retours & remboursements | `retours-et-remboursements` | `page` |
| `faq.md` | FAQ | `faq` | **`page.faq`** |
| `contact.md` | Contact | `contact` | **`page.contact`** |
| `cgv.md` | Conditions générales de vente | `cgv` | `page` |
| `mentions-legales.md` | Mentions légales | `mentions-legales` | `page` |
| `politique-de-confidentialite.md` | Politique de confidentialité | `politique-de-confidentialite` | `page` |
| `cookies.md` | Cookies | `cookies` | `page` |

Pour chaque page :

1. Collez le corps du fichier dans l'éditeur (le Markdown se convertit bien en
   copier-coller ; les tableaux se recréent avec l'outil tableau).
2. **Modèle de thème** → celui de la colonne de droite ci-dessus.
3. **Modifier le référencement** → recopiez `seo_title` et `seo_description`.
4. Vérifiez le **handle** dans la section référencement.

### ⛔ Avant de publier les pages juridiques

```bash
grep -rn '\[\[' content/pages/
```

**65 champs `[[…]]`** attendent vos données réelles : dénomination sociale,
SIRET, adresse, hébergeur, médiateur de la consommation. Aucun n'a été inventé.
Ne publiez pas les CGV, les mentions légales, la politique de confidentialité
ni la page cookies avec des `[[…]]` visibles.

> **Le médiateur de la consommation est une obligation légale** (article
> L.612-1 du Code de la consommation) pour tout professionnel vendant à des
> consommateurs en France. Adhérez à un dispositif **avant** l'ouverture.

---

## Étape 5 — Créer les menus

**Contenu → Menus.** L'arborescence complète est dans
`content/navigation.md` — quatre menus :

| Menu | Handle | Contenu |
|---|---|---|
| Menu principal | `main-menu` | Fontaine, Hydratation, Coin repas, Jeu & mastication, Rechanges, La marque |
| Pied — Boutique | `footer` | Les 4 produits + Tous les produits |
| Pied — Aide | `footer-aide` | Livraison, Retours, FAQ, Contact, Mon compte |
| Pied — Légal | `footer-legal` | CGV, Mentions légales, Confidentialité, Cookies, La marque |

Le rattachement des menus au thème se fait à l'étape 7.

---

## Étape 6 — Importer les redirections

1. **Boutique en ligne → Navigation → Redirections d'URL**
2. *Importer les redirections* → `import/redirects.csv`
3. 29 redirections, format natif Shopify (`Redirect from`, `Redirect to`)

Elles couvrent les URL courtes qu'un client tape ou qu'une campagne pourrait
viser (`/products/fontaine`, `/pages/retours`, `/collections/all`…).

---

## Étape 7 — Régler les paramètres du thème

**Boutique en ligne → Thèmes → … → Personnaliser**

### Paramètres du thème (icône engrenage, en bas à gauche)

| Section | À faire |
|---|---|
| **Marque** | Favicon (512 × 512), image de partage (1200 × 630). Logo : laissez vide pour utiliser le mot-symbole SVG intégré. |
| **Couleurs** | Déjà réglées sur la palette VELLUNO. Ne changez que si nécessaire — et revérifiez alors le contraste. |
| **Typographie** | *Titres* : choisissez **Fraunces** ou **Instrument Serif** si votre offre les propose (Georgia sinon, déjà correct). *Texte* : Inter, ou la pile système. |
| **Livraison & garanties** | Vérifiez : seuil **39 €**, handle du produit toujours livré gratuitement, délais **5–12 jours**, heure limite **14 h**, retours **90 jours**. |
| **Service client** | Votre e-mail réel. Il apparaît dans le pied de page, la page contact et le JSON-LD. |
| **Confidentialité** | Bannière cookies activée, et lien vers `/pages/cookies`. |
| **Panier** | Tiroir latéral (recommandé) ou page. |

> **« Afficher le paiement en 4 fois »** est activé par défaut. **Désactivez-le
> si PayPal Pay ou Klarna n'est pas réellement actif** sur votre boutique :
> annoncer un service indisponible est une pratique commerciale trompeuse.

### Rattacher les menus

- *En-tête* → **Menu principal** → `main-menu`
- *Pied de page* → les trois colonnes de liens → `footer`, `footer-aide`,
  `footer-legal` (titres : Boutique / Aide / Informations légales)

### Vérifier la page d'accueil

Les sections sont préremplies. Ajoutez seulement les images (héro, bloc inox,
cartes de collection) — voir `import/images_TODO.md`.

---

## Étape 8 — Régler la livraison ⚠️

**Le thème affiche une promesse ; seul Shopify peut la facturer.** Si les deux
divergent, vos clients le verront au paiement — c'est la première source de
réclamations.

**Paramètres → Livraison et traitement → Tarifs généraux → Gérer**

Zone : **France métropolitaine**.

| Tarif | Condition | Prix |
|---|---|---|
| Point relais | Prix de commande **0 € – 38,99 €** | **3,90 €** |
| Colissimo — domicile | Prix de commande **0 € – 38,99 €** | **4,90 €** |
| Livraison offerte | Prix de commande **39 € et plus** | **0 €** |

### Livraison toujours offerte sur la fontaine

Shopify ne sait pas dire « gratuit si le panier contient ce produit » avec les
tarifs seuls. Deux solutions :

- **Recommandée — profil de livraison dédié.** *Créer un profil de livraison* →
  ajoutez uniquement le produit **VELLUNO Source 7L** → un seul tarif à
  **0 €** pour la France métropolitaine.
- **Alternative — remise automatique.** Une remise « livraison gratuite »
  conditionnée à la présence du produit (voir étape 9).

**Paramètres → Taxes et droits de douane** : la France doit être configurée pour
que les prix affichés soient TTC (TVA 20 % incluse).

---

## Étape 9 — Créer les remises de bundle

Le thème calcule et affiche le total du bundle, mais **il ne peut pas créer de
remise** — cela relève de Shopify. Sans cette étape, « Achetez ensemble » ajoute
bien les trois produits, mais au prix plein.

**Réductions → Créer une réduction → Montant sur les produits → Automatique**

### Le Pack Source — 119,90 € au lieu de 124,70 €

- Nom : `Le Pack Source`
- S'applique à : produits spécifiques → **Fontaine (Fontaine + 10 filtres)**,
  **Tapis Base**
- Valeur : **4,80 € de réduction fixe**
- Conditions : quantité minimale de 1 pour chacun
- *(Shopify n'exprime pas nativement « ces trois produits ensemble » ; une
  remise fixe déclenchée sur la combinaison est l'équivalent le plus proche.)*

### Le Pack Découverte — 16,90 € au lieu de 18,80 €

- Nom : `Le Pack Découverte`
- S'applique à : **Tapis Base** + **Os Chew (1 pièce)**
- Valeur : **1,90 € de réduction fixe**

> Vérifiez le résultat dans un panier de test avant l'ouverture. Si les montants
> ne tombent pas juste, ajustez la remise — **ne modifiez pas les prix affichés
> par le thème** : ils viennent du catalogue et doivent rester cohérents.

---

## Étape 10 — Personnaliser les notifications

**Paramètres → Notifications**

| Notification | Fichier |
|---|---|
| Commandes → Confirmation de commande | `content/emails/01-confirmation-de-commande.md` |
| Commandes → Confirmation d'expédition | `content/emails/02-expedition.md` |
| Panier abandonné | `content/emails/03-panier-abandonne-1.md` |

Les e-mails **2 et 3 de la séquence panier abandonné** (J+1 et J+3) et le
**rappel filtres J+30** nécessitent un outil d'e-mailing (Shopify Email, Klaviyo,
Omnisend). Shopify n'envoie qu'un seul e-mail de panier abandonné nativement.

**Objets d'e-mail** : dans Notifications, l'objet se modifie en haut de
l'éditeur de chaque modèle.

> **Rappel filtres J+30** : segmentez sur l'achat de
> `fontaine-eau-velluno-7l-inox` et **excluez** les SKU `VL-SRC-7L-F10` et
> `VL-SRC-7L-F20` — ces clients ont déjà 6 ou 12 mois de filtres.

---

## Étape 11 — Téléverser les images

**C'est la seule partie du catalogue qui n'est pas automatisée.** L'import CSV
de Shopify ne lit que des **URL publiques** : il ne peut pas atteindre un
fichier sur votre disque.

La procédure complète — téléverser, copier les URL, coller dans le CSV,
réimporter — est dans **`import/images_TODO.md`**, avec la liste ordonnée des
20 visuels produit et des 7 visuels de thème, leurs ratios et leurs textes
alternatifs (déjà rédigés en français dans le CSV).

Tant que les images ne sont pas là, le thème affiche des placeholders SVG aux
bonnes dimensions : rien ne casse, et **il n'y aura aucun décalage de mise en
page** au remplacement.

---

## Étape 12 — Vérifications avant publication

### Fonctionnel

- [ ] La fiche fontaine utilise bien le modèle `product.fontaine` (bundle,
      comparatif, FAQ, 3 bandeaux bénéfices visibles)
- [ ] Le changement de pack met à jour prix, économie, mention « 4 × » et SKU
      **sans rechargement**
- [ ] Ajout au panier → le tiroir s'ouvre, le compteur s'incrémente
- [ ] La barre de livraison offerte se remplit, et affiche le bon message quand
      le panier contient la fontaine
- [ ] « Achetez ensemble » : décocher recalcule le total
- [ ] La barre d'achat mobile apparaît au défilement et ajoute au panier
- [ ] La recherche prédictive renvoie des produits
- [ ] Un panier de test passe le paiement de bout en bout
- [ ] Les frais de port au paiement **correspondent** à ce qu'annonce le thème

### Contenu

- [ ] **Aucun `[[…]]` visible** sur le site publié
- [ ] Les mêmes conditions de livraison partout : barre d'annonce, fiche
      produit, panier, pied de page, `/pages/livraison`
- [ ] Les 4 pages juridiques sont complètes et relues
- [ ] Le médiateur de la consommation est renseigné
- [ ] Les prix barrés sont conformes à la règle Omnibus — **lisez
      `NOTES.md` § 5**

### Technique

- [ ] Lighthouse mobile sur la page d'accueil et la fiche fontaine
- [ ] Test au clavier seul : menu, recherche, tiroir panier, accordéons,
      sélecteur de pack
- [ ] La bannière cookies apparaît, « Refuser » fonctionne et ne réapparaît pas
- [ ] Test de la page 404 et de la recherche sans résultat
- [ ] `./build.sh` se termine sans erreur (theme-check inclus)

---

## Brancher de vrais avis clients

Le thème ne contient **aucun avis inventé**. La section *Avis clients* affiche
« Soyez le premier à donner votre avis » tant que rien n'existe.

1. Installez **Judge.me** (offre gratuite) ou **Loox**
2. **Personnaliser** → section *Avis clients* → *Ajouter un bloc* → le bloc de
   l'application
3. Le bloc d'application remplace automatiquement l'état vide

Le `aggregateRating` en JSON-LD s'active **tout seul** dès que l'application
écrit de vraies notes (`product.metafields.reviews.rating_count > 0`). Aucune
note n'est envoyée à Google avant ça — c'est délibéré, et c'est ce qui évite
une action manuelle de Google.

---

## Publier

**Boutique en ligne → Thèmes → Publier**, une fois l'étape 12 verte.

Retirez ensuite le mot de passe de la boutique :
**Boutique en ligne → Préférences → Protection par mot de passe** → décocher.

---

## Dépannage

| Symptôme | Cause probable |
|---|---|
| La fiche fontaine n'a ni bundle ni comparatif | Le modèle `product.fontaine` n'est pas assigné (étape 2) |
| Une section d'accueil est vide | Handle de collection incorrect — Shopify a peut-être créé `hydratation-1` (étape 3) |
| « Translation missing » | Le thème a été modifié : relancez `python3 tools/check_translations.py` |
| Accents cassés dans les produits | Le CSV a été réenregistré par Excel. Repartez du fichier d'origine, ou importez via *Données → Importer* en UTF-8 |
| Le tiroir panier ne s'ouvre pas | JavaScript bloqué. Le lien vers `/cart` reste fonctionnel : c'est le repli prévu |
| Les frais de port diffèrent du site | Les tarifs Shopify ne correspondent pas au thème (étape 8) |
| Le bundle n'applique pas la remise | Les remises automatiques ne sont pas créées (étape 9) |
| L'import du thème échoue | Relancez `./build.sh` et lisez sa sortie |
