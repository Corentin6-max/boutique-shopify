# Navigation — arborescence à recréer

Shopify ne permet pas d'importer les menus par fichier : ils se créent à la main
dans **Contenu → Menus**. Voici l'arborescence exacte, prête à recopier.

> **Ordre de travail :** créez d'abord les collections et les pages, sinon les
> liens ne seront pas proposés dans le sélecteur. Voir `SETUP.md`, étapes 3 à 5.

---

## Menu principal — `main-menu`

L'en-tête n'affiche que les **5 premières entrées** en desktop (le tiroir mobile
les affiche toutes). L'ordre ci-dessous est donc l'ordre de priorité.

| # | Intitulé | Type de lien | Cible |
|---|---|---|---|
| 1 | Fontaine Source 7L | Produit | `fontaine-eau-velluno-7l-inox` |
| 2 | Hydratation | Collection | `hydratation` |
| 3 | Coin repas | Collection | `coin-repas` |
| 4 | Jeu & mastication | Collection | `jeu-mastication` |
| 5 | Rechanges | Collection | `rechanges` |
| 6 | La marque | Page | `a-propos` |

**Sous-menu de « Hydratation » :**

| Intitulé | Type | Cible |
|---|---|---|
| Fontaine Source 7L | Produit | `fontaine-eau-velluno-7l-inox` |
| Filtres de rechange | Produit | `filtres-rechange-velluno-source` |

**Sous-menu de « Coin repas » :**

| Intitulé | Type | Cible |
|---|---|---|
| Tapis de gamelle Base | Produit | `tapis-gamelle-silicone-velluno` |
| Fontaine Source 7L | Produit | `fontaine-eau-velluno-7l-inox` |

> Le thème n'affiche pas de méga-menu déroulant en version 1.0 : les sous-menus
> ci-dessus sont facultatifs et servent surtout au référencement interne et au
> plan de site. Créez-les si vous prévoyez d'étoffer la gamme.

---

## Menu pied de page — `footer`

Le pied de page affiche **trois colonnes de liens** plus une colonne « Service
client » générée automatiquement par le thème (e-mail, disponibilité,
transporteurs). Créez donc **trois menus distincts**.

### Colonne 1 — « Boutique » (menu `footer`)

| Intitulé | Type | Cible |
|---|---|---|
| Fontaine Source 7L | Produit | `fontaine-eau-velluno-7l-inox` |
| Filtres de rechange | Produit | `filtres-rechange-velluno-source` |
| Tapis de gamelle | Produit | `tapis-gamelle-silicone-velluno` |
| Os à mâcher | Produit | `os-a-macher-dentaire-velluno` |
| Tous les produits | Collection | `best-sellers` |

### Colonne 2 — « Aide » (menu `footer-aide`)

| Intitulé | Type | Cible |
|---|---|---|
| Livraison & suivi | Page | `livraison` |
| Retours & remboursements | Page | `retours-et-remboursements` |
| FAQ | Page | `faq` |
| Nous contacter | Page | `contact` |
| Mon compte | Lien | `/account` |

### Colonne 3 — « Informations légales » (menu `footer-legal`)

| Intitulé | Type | Cible |
|---|---|---|
| Conditions générales de vente | Page | `cgv` |
| Mentions légales | Page | `mentions-legales` |
| Politique de confidentialité | Page | `politique-de-confidentialite` |
| Cookies | Page | `cookies` |
| La marque | Page | `a-propos` |

---

## Rattachement dans le thème

Une fois les menus créés : **Boutique en ligne → Personnaliser**.

| Emplacement | Réglage |
|---|---|
| En-tête | *En-tête → Menu principal* → `main-menu` |
| Pied de page, colonne 1 | *Pied de page → Colonne de liens 1* → titre « Boutique », menu `footer` |
| Pied de page, colonne 2 | *Pied de page → Colonne de liens 2* → titre « Aide », menu `footer-aide` |
| Pied de page, colonne 3 | *Pied de page → Colonne de liens 3* → titre « Informations légales », menu `footer-legal` |
| Pied de page, colonne 4 | *Pied de page → Contact* → titre « Service client » (contenu automatique) |

---

## Barre d'annonce

Trois messages défilants, réglables dans *Personnaliser → Barre d'annonce*.
Ils sont déjà pré-remplis par le thème :

1. « Livraison offerte dès 39 € d'achat en France métropolitaine » — icône
   *Livraison*
2. « Retours gratuits sous 90 jours » — icône *Retour*
3. « Service client français — réponse sous 24 h ouvrées » — icône *Service
   client*

> ⚠️ **Ces trois messages doivent rester cohérents** avec vos tarifs réels de
> livraison (Paramètres → Livraison et traitement) et avec la page
> `/pages/livraison`. C'est la règle absolue du brief : aucune promesse ne doit
> se contredire d'une page à l'autre.
