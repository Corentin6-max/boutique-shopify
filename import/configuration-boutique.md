# Configuration de la boutique Velluno

Les 4 produits sont **déjà dans Shopify** — rien à importer. Le thème est branché
directement dessus via les collections listées ci-dessous.

---

## 1. Ce que le thème utilise déjà

Ces liens sont enregistrés dans `theme/templates/index.json` : après l'import du thème,
la page d'accueil affiche vos vrais produits, sans réglage supplémentaire.

| Section de la page d'accueil | Ressource liée |
|---|---|
| Nos best-sellers | collection `frontpage` — *Page d'accueil* (4 produits) |
| Le coup de cœur | produit *Fontaine à Eau 7L pour Chat & Chien* |
| Trouvez ce qu'il vous faut — bloc 1 | collection `fontaines-hydratation` (3 produits) |
| Trouvez ce qu'il vous faut — bloc 2 | collection `repas-gamelles` (1 produit) |
| Trouvez ce qu'il vous faut — bloc 3 | collection `jouets-hygiene-dentaire` (1 produit) |

Sous chaque produit, un bouton **« Voir plus »** mène à la fiche de ce produit précis.
Le libellé se change dans **Personnaliser → Paramètres du thème → Fiches produit → Libellé du bouton**
(mettez « See more », « Découvrir », ce que vous voulez).

---

## 2. Collections de votre boutique

| Collection | Handle | Produits |
|---|---|---|
| Page d'accueil | `frontpage` | 4 |
| Accessoires pour Chiens | `accessoires-pour-chiens` | 4 |
| Fontaines & Hydratation | `fontaines-hydratation` | 3 |
| Repas & Gamelles | `repas-gamelles` | 1 |
| Jouets & Hygiène Dentaire | `jouets-hygiene-dentaire` | 1 |
| Packs & Économies | `packs-economies` | 0 |
| New Arrivals | `new-arrivals` | 0 |
| Lits & Couchages pour Chiens | `lits-couchages-pour-chiens` | 0 |

Les quatre dernières sont vides : soit vous les remplissez, soit vous les masquez
(elles n'apparaissent nulle part dans le thème tant que vous ne les y ajoutez pas).

---

## 3. Menus à vérifier

**Boutique en ligne → Navigation.** Le thème lit le menu `main-menu` pour l'en-tête
et `footer` pour le pied de page.

### Menu principal (`main-menu`)
| Intitulé | Lien |
|---|---|
| Boutique | Collection → Page d'accueil |
| Fontaines | Collection → Fontaines & Hydratation |
| Repas & gamelles | Collection → Repas & Gamelles |
| Jouets | Collection → Jouets & Hygiène Dentaire |
| Contact | Page → Contact |

### Pied de page (`footer`)
| Intitulé | Lien |
|---|---|
| Tous les produits | Collection → Page d'accueil |
| Fontaines & hydratation | Collection → Fontaines & Hydratation |
| Livraison et retours | Page → Livraison et retours |
| À propos | Page → À propos |
| Contact | Page → Contact |

---

## 4. Pages à créer

**Boutique en ligne → Pages.** Basculez l'éditeur en mode HTML (`<>`) pour coller le contenu.

### Page « À propos »

```html
<p>Velluno est née d'un constat simple : on achète beaucoup d'accessoires pour nos animaux, et la moitié finit au placard. Trop grand, trop bruyant, trop fragile, ou juste boudé.</p>
<p>Alors on a pris le problème à l'envers. Chaque produit que nous vendons passe d'abord plusieurs semaines chez nous, avec nos propres chiens et chats. S'il casse, s'il glisse, s'il fait du bruit la nuit, il ne rentre pas au catalogue. C'est pour cette raison que notre sélection reste volontairement courte.</p>
<h2>Ce que nous vérifions systématiquement</h2>
<ul>
<li><strong>Les matériaux.</strong> Silicone de qualité alimentaire, acier inoxydable 304, caoutchouc non toxique. Sans BPA, sans exception.</li>
<li><strong>La durée de vie.</strong> Un produit qui ne tient pas une année d'usage normal n'a rien à faire ici.</li>
<li><strong>L'entretien.</strong> S'il ne se démonte pas, s'il ne se nettoie pas facilement, il ne sera pas nettoyé. Donc il ne sera pas utilisé.</li>
<li><strong>Les pièces de rechange.</strong> Un filtre, un joint ou une pompe doivent pouvoir se remplacer sans racheter tout l'appareil.</li>
</ul>
<h2>Nos engagements</h2>
<p>Livraison offerte dès 49€, expédition sous 24 h ouvrées, et 30 jours pour changer d'avis — même si le produit a servi. Si votre animal boude, ce n'est pas à vous de payer l'essai.</p>
<p>Une question ? Écrivez à <a href="mailto:bonjour@velluno.fr">bonjour@velluno.fr</a>. C'est une vraie personne qui répond, sous 24 h ouvrées.</p>
```

### Page « Livraison et retours »

```html
<h2>Livraison</h2>
<p>Toutes les commandes passées avant 14 h (du lundi au vendredi) partent le jour même. Les autres partent le jour ouvré suivant.</p>
<table>
<tr><th>Destination</th><th>Délai</th><th>Tarif</th></tr>
<tr><td>France métropolitaine</td><td>2 à 5 jours ouvrés</td><td>4,90€ — offert dès 49€</td></tr>
<tr><td>Belgique, Luxembourg</td><td>3 à 6 jours ouvrés</td><td>6,90€ — offert dès 69€</td></tr>
<tr><td>Suisse</td><td>4 à 8 jours ouvrés</td><td>9,90€</td></tr>
</table>
<p>Un numéro de suivi vous est envoyé par e-mail dès la prise en charge du colis.</p>
<h2>Retours</h2>
<p>Vous disposez de <strong>30 jours après réception</strong> pour nous retourner un article, même utilisé. Écrivez-nous à <a href="mailto:bonjour@velluno.fr">bonjour@velluno.fr</a> avec votre numéro de commande : nous vous envoyons une étiquette de retour.</p>
<p>Le remboursement est effectué sur le moyen de paiement d'origine sous 5 jours ouvrés après réception du colis.</p>
<p>Pour des raisons d'hygiène, les filtres déjà ouverts ne peuvent pas être repris, sauf défaut de fabrication.</p>
<h2>Commande abîmée ou incomplète</h2>
<p>Prenez une photo du colis et de son contenu et envoyez-la nous dans les 48 h. Nous réexpédions ou remboursons immédiatement, sans retour à votre charge.</p>
```

### Page « Contact »
Laissez une phrase d'accueil : le formulaire est ajouté automatiquement par le modèle
`page.contact` du thème.

```html
<p>Une question sur une taille, une commande ou un produit ? Écrivez-nous, on répond sous 24 h ouvrées.</p>
```

---

## 5. Réglages à vérifier

- **Paramètres → Livraison** : créer un palier « offert à partir de 49€ », pour rester cohérent
  avec la barre de progression du panier (réglée sur 49 dans le thème).
- **Paramètres → Politiques** : générer remboursement, confidentialité, CGV, expédition,
  mentions légales, puis les relire.
- **Boutique en ligne → Préférences** : titre et méta-description de la boutique.
