# À faire

Points ouverts, par ordre d'urgence.

---

## 🔴 1. Compléter et publier les mentions légales et les CGV

Les deux pages existent mais restent en **brouillon** : elles contiennent des champs
`[RAISON SOCIALE]`, `[SIRET]`, `[ADRESSE]`, `[NOM DU MÉDIATEUR]`.

Ces deux pages sont **obligatoires** pour un site marchand français. Complétez-les avec
les informations réelles de l'entreprise, puis publiez-les. Pensez aussi à l'adhésion à
un médiateur de la consommation (article L612-1), également obligatoire.

---

## 🔴 2. Doublons de produits à trancher

Deux séries des mêmes 4 produits coexistent, toutes deux en ACTIVE : les clients voient
chaque produit en double.

**Série A — conservée et retravaillée** (import DSers, stock réel synchronisé)

`11094761275729` fontaine · `11094760259921` filtres · `11094762455377` tapis ·
`11094776643921` jouet

**Série B — doublons à traiter** (titres anglais, stock 0, aucun lien fournisseur)

`11098253328721` · `11098259259729` · `11098262372689` · `11098266763601`

Les passer en brouillon (réversible) ou les archiver. Non fait ici : c'est une
modification du storefront en ligne, elle revient au propriétaire de la boutique.

---

## 🔴 3. Mapper les packs dans DSers, puis les publier

Les 4 packs sont en **DRAFT**. Ce sont des produits neufs, sans lien fournisseur :
publiés tels quels, ils encaisseraient des commandes que DSers ne saurait pas router.

Mapper chaque variante vers les produits AliExpress listés dans [bundles.md](bundles.md)
— ou dans le métachamp `supplier.composition` du produit — puis passer en **ACTIVE**.

---

## 🟠 4. Le design du thème

Le thème live (Vitals Store Builder) ne peut pas être modifié par l'API : Shopify bloque
toute écriture sur le thème publié. Le design se règle dans **Boutique en ligne →
Personnaliser**. Voir [storefront.md](storefront.md).

Priorités visuelles, dans l'ordre d'impact :

1. **Barre de réassurance en en-tête** — reprendre les 4 promesses du bandeau produit,
   visibles sur toutes les pages
2. **Page d'accueil** — une seule bannière, la fontaine en héros, puis les packs
3. **Typographie** — deux polices maximum, une pour les titres, une pour le texte
4. **Palette** — une couleur d'accent unique pour les boutons, le reste en neutres
5. **Logo** — un logo texte propre vaut mieux qu'un logo image approximatif

---

## 🟠 5. Images

Aucune image sur les 4 packs — à insérer manuellement.

Les 4 produits gardent leurs visuels AliExpress importés par DSers : fonctionnels mais
génériques, avec des cadrages et des fonds différents d'une fiche à l'autre. Des visuels
homogènes sur fond neutre sont ce qui sépare le plus visiblement une boutique amateur
d'une boutique crédible.

---

## 🟠 6. Commander un échantillon de filtres

Le fournisseur des filtres (Vissoiter Online Store) n'a **qu'un seul avis pour 37 ventes**,
et c'est lui qui porte toute la récurrence de la boutique. Vérifier la qualité et la
compatibilité 2,2 L avant d'engager du budget publicitaire, et identifier un fournisseur
de secours. Voir [fournisseurs.md](fournisseurs.md).

---

## 🟡 7. Tenir la promesse « réponse sous 24 à 48 h »

C'est le seul engagement du bandeau de réassurance qui ne dépend pas d'un réglage
technique mais d'une organisation. Une adresse `contact@velluno.fr` relevée tous les
jours ouvrés suffit — mais elle doit l'être.

---

## 🟡 8. Produits hors périmètre

Quatre montres connectées traînent dans le catalogue, toutes à stock 0, sans rapport avec
l'animalerie : `11095270588753` · `11095271539025` · `11095272685905` ·
`11095273406801` (déjà archivé). Elles diluent le positionnement. À archiver, sauf
intention contraire.

---

## 🟡 9. Pistes commerciales

- **Relance filtres à J+240** — chaque acheteur de fontaine devient un client récurrent.
  C'est le levier de rentabilité le plus évident du catalogue.
- **Upsell panier** — proposer le jouet à 8,95 € (77 % de marge) sur toute commande.
- **Code de bienvenue** — un −10 % sur la fontaine laisse encore 32 € de marge.
- **Avis clients** — le bandeau promet, les avis prouvent. C'est le prochain gain de
  conversion une fois les premières commandes passées.
