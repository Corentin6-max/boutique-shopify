# Collections

## Créées

| Collection | Handle | Produits | Tri |
|---|---|---|---|
| Fontaines & Hydratation | `fontaines-hydratation` | Fontaine, Filtres, Pack Hydratation | Manuel |
| Repas & Gamelles | `repas-gamelles` | Tapis, Pack Coin Repas, Pack Gourmand | Manuel |
| Jouets & Hygiène Dentaire | `jouets-hygiene-dentaire` | Jouet os | Manuel |
| Packs & Économies | `packs-economies` | Les 4 packs | Prix décroissant |

## Alimentées

| Collection | Handle | Contenu ajouté |
|---|---|---|
| Page d'accueil | `frontpage` | Fontaine + 2 packs + les 3 accessoires |
| Accessoires pour Chiens | `accessoires-pour-chiens` | Les 4 produits (était vide) |

## Laissées vides

- `lits-couchages-pour-chiens` — aucun produit correspondant au catalogue actuel
- `velluno-brosse-lissante-a-vapeur` — hors périmètre animalerie
- `new-arrivals` — contient 8 anciens produits (montres connectées), non touchée

## Logique de navigation

L'arborescence suit le parcours d'achat plutôt que le type de produit :

1. **Fontaines & Hydratation** — la porte d'entrée, autour du produit phare
2. **Repas & Gamelles** — l'accessoire naturel une fois la fontaine choisie
3. **Jouets & Hygiène Dentaire** — l'achat d'impulsion en fin de parcours
4. **Packs & Économies** — le raccourci pour ceux qui veulent tout d'un coup

Trié par prix décroissant, le pack le plus cher — et le plus rentable — apparaît en
premier dans la collection Packs.
