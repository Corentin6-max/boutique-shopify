# Contenu à créer dans l'admin Shopify

Le thème est prêt : il ne reste qu'à créer les collections, les menus et les pages.
Tout le contenu ci-dessous est prêt à copier-coller.

---

## 1. Collections à créer

**Boutique → Collections → Créer une collection** (type *Automatique*, condition « Tag est égal à … »).

| Titre | Handle attendu | Condition automatique |
|---|---|---|
| Nos best-sellers | `best-sellers` | Tag est égal à `best-seller` |
| Chiens | `chiens` | Tag est égal à `chien` |
| Chats | `chats` | Tag est égal à `chat` |
| Fontaines et filtres | `fontaines-et-filtres` | Type de produit est égal à `Fontaines et filtres` |
| Repas et gamelles | `repas-et-gamelles` | Type de produit est égal à `Repas et gamelles` |
| Jouets | `jouets` | Type de produit est égal à `Jouets pour chien` |

Les tags et les types sont déjà renseignés dans `velluno-produits.csv`, les collections
automatiques se remplissent donc toutes seules après l'import.

Ensuite, dans **Personnaliser le thème** :
- section *Nos best-sellers* → choisir la collection « Nos best-sellers »
- section *Trouvez ce qu'il vous faut* → affecter une collection à chacun des 3 blocs
- section *Le coup de cœur* → choisir « Fontaine à eau 7 L »

---

## 2. Menus

**Boutique en ligne → Navigation.**

### Menu principal (`main-menu`)
| Intitulé | Lien |
|---|---|
| Boutique | Collection → Tous les produits |
| Chiens | Collection → Chiens |
| Chats | Collection → Chats |
| Fontaines | Collection → Fontaines et filtres |
| Journal | Blog → Actualités |
| Contact | Page → Contact |

### Pied de page (`footer`)
| Intitulé | Lien |
|---|---|
| Tous les produits | Collection → Tous les produits |
| Nos best-sellers | Collection → Nos best-sellers |
| Livraison et retours | Page → Livraison et retours |
| À propos | Page → À propos |
| Contact | Page → Contact |
| Mentions légales | Politique → Mentions légales |

---

## 3. Pages à créer

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
<p>Une question ? Écrivez à <a href="mailto:bonjour@velluno.com">bonjour@velluno.com</a>. C'est une vraie personne qui répond, sous 24 h ouvrées.</p>
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
<p>Vous disposez de <strong>30 jours après réception</strong> pour nous retourner un article, même utilisé. Écrivez-nous à <a href="mailto:bonjour@velluno.com">bonjour@velluno.com</a> avec votre numéro de commande : nous vous envoyons une étiquette de retour.</p>
<p>Le remboursement est effectué sur le moyen de paiement d'origine sous 5 jours ouvrés après réception du colis.</p>
<p>Pour des raisons d'hygiène, les filtres déjà ouverts ne peuvent pas être repris, sauf défaut de fabrication.</p>
<h2>Commande abîmée ou incomplète</h2>
<p>Prenez une photo du colis et de son contenu et envoyez-la nous dans les 48 h. Nous réexpédions ou remboursons immédiatement, sans retour à votre charge.</p>
```

### Page « Contact »
Laissez le contenu vide (ou une phrase d'accueil) : le formulaire est ajouté automatiquement
par le modèle `page.contact` du thème.

```html
<p>Une question sur une taille, une commande ou un produit ? Écrivez-nous, on répond sous 24 h ouvrées.</p>
```

### Page « FAQ » (facultatif)
Le thème affiche déjà une FAQ sur la page d'accueil et sur les fiches produit.
Si vous voulez une page dédiée, créez une page vide « FAQ » et ajoutez-y la section *FAQ*
depuis l'éditeur de thème.

---

## 4. Politiques légales

**Paramètres → Politiques.** Shopify propose des modèles pré-remplis à adapter :
remboursement, confidentialité, conditions générales de vente, expédition, mentions légales.
Générez-les puis relisez-les — ce sont des documents contractuels.

---

## 5. Réglages recommandés

- **Paramètres → Paiements** : activer Shopify Payments / PayPal.
- **Paramètres → Livraison** : créer un tarif « Standard 4,90€ » et un palier « Gratuit à partir de 49€ » (cohérent avec la barre de progression du panier réglée sur 49 dans le thème).
- **Paramètres → Taxes** : TVA incluse dans les prix affichés (les prix du CSV sont TTC).
- **Boutique en ligne → Préférences** : titre et méta-description de la boutique.
