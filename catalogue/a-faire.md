# À faire avant mise en ligne

Points ouverts, par ordre d'urgence.

---

## 🔴 1. Doublons à trancher

La boutique contient **deux séries des mêmes 4 produits**, toutes deux en ACTIVE.
Les clients voient donc chaque produit en double sur le storefront.

**Série A — conservée et retravaillée** (import DSers du 1er sept.)

| Product ID | Produit |
|---|---|
| `11094761275729` | Fontaine 7L |
| `11094760259921` | Filtres |
| `11094762455377` | Tapis silicone |
| `11094776643921` | Jouet os |

Stock réel synchronisé avec les fournisseurs. C'est la seule série livrable — d'où le
choix de tout construire dessus. Ses prix étaient au prix d'achat (fontaine à 51,86 €,
soit **une marge nulle**) : corrigés.

**Série B — doublons, à traiter** (créée le 2 sept.)

| Product ID | Produit | Stock |
|---|---|---|
| `11098253328721` | Stainless Steel Pet Water Fountain – 7L | 0 |
| `11098259259729` | Replacement Filters For Cat Water Fountains 2.2L | 0 |
| `11098262372689` | Bone-Shaped Dog Chew Toy | 0 |
| `11098266763601` | Waterproof Silicone Pet Feeding Mat | 0 |

Titres anglais, stock à 0, aucun lien fournisseur : invendables en l'état.

**Décision à prendre :** les passer en brouillon (réversible en un clic) ou les archiver.
Non traité ici — c'est une modification du storefront en ligne, elle revient au
propriétaire de la boutique.

---

## 🔴 2. Mapper les packs dans DSers, puis les publier

Les 4 packs sont en **DRAFT**. Ce sont des produits neufs, sans lien fournisseur :
publiés tels quels, ils encaisseraient des commandes que DSers ne saurait pas router.

Pour chacun : mapper chaque variante vers les produits AliExpress listés dans
[bundles.md](bundles.md) (ou dans le métachamp `supplier.composition` du produit),
puis passer le produit en **ACTIVE**.

---

## 🟠 3. Images

Aucune image n'a été ajoutée aux packs — à insérer manuellement.

Les 4 produits de la série A ont conservé leurs visuels AliExpress importés par DSers.
Ils sont fonctionnels mais génériques : des visuels propres sur fond neutre, aux mêmes
cadrages sur les 4 fiches, feraient beaucoup pour la crédibilité de la marque.

---

## 🟠 4. Commander un échantillon de filtres

Le fournisseur des filtres (Vissoiter Online Store) n'a **qu'un seul avis pour 37 ventes**.
C'est le produit qui porte toute la récurrence de la boutique. Vérifier la qualité et la
compatibilité 2,2 L avant d'engager du budget publicitaire, et identifier un fournisseur
de secours. Voir [fournisseurs.md](fournisseurs.md).

---

## 🟡 5. Annoncer les livraisons multiples

Un pack à 4 fournisseurs part en jusqu'à 4 colis, avec 4 numéros de suivi et des dates
d'arrivée différentes. Sans mention explicite en page produit **et** dans l'e-mail de
confirmation, cela génère mécaniquement des réclamations « commande incomplète ».

Délais fournisseurs : 8 à 14 jours, sauf le tapis (10 à 16 jours) — c'est le plus lent
qui détermine la date à annoncer.

---

## 🟡 6. Produits hors périmètre

Quatre montres connectées traînent dans le catalogue, toutes à stock 0, sans rapport
avec l'animalerie :

`11095270588753` · `11095271539025` · `11095272685905` · `11095273406801` (déjà archivé)

Elles diluent le positionnement de la boutique. À archiver, sauf intention contraire.

---

## 🟡 7. Pistes commerciales

- **Relance filtres à J+240** — chaque acheteur de fontaine devient un client récurrent.
  C'est le levier de rentabilité le plus évident du catalogue.
- **Upsell panier** — proposer le jouet à 8,95 € (77 % de marge) sur toute commande.
- **Code de bienvenue** — un −10 % sur la fontaine reste à 32 € de marge. Confortable.
- **Seuil de livraison gratuite à 49 €** — au-dessus du panier accessoires, en dessous
  du prix de la fontaine : pousse mécaniquement vers les packs.
