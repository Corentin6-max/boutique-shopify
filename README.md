# Velluno — Boutique Shopify

Boutique Shopify **velluno.fr** — accessoires pour chiens et chats, en dropshipping via
AliExpress / DSers. Marché France, devise EUR, plan Basic.

Ce dépôt sert de **documentation de référence** du catalogue : fournisseurs, coûts
d'achat, prix de vente, marges et composition des packs. Il ne contient pas de code —
la boutique est gérée directement dans Shopify.

## Catalogue

| Document | Contenu |
|---|---|
| [catalogue/produits.md](catalogue/produits.md) | Les 4 produits, variantes, coûts, prix, marges |
| [catalogue/bundles.md](catalogue/bundles.md) | Les 4 packs et leur mapping DSers |
| [catalogue/fournisseurs.md](catalogue/fournisseurs.md) | Fiches fournisseurs et niveaux de risque |
| [catalogue/collections.md](catalogue/collections.md) | Arborescence des collections |
| [catalogue/a-faire.md](catalogue/a-faire.md) | Points ouverts avant mise en ligne |

## Produit phare

**Fontaine à Eau 7L pour Chat & Chien** — 89,95 € à 119,95 €.
Toute la boutique est construite autour d'elle : les filtres sont son consommable
récurrent, le tapis son accessoire naturel, et trois des quatre packs la contiennent.

## Où sont stockées les infos fournisseurs

Dans Shopify, sur chaque produit, en **métachamps privés** sous le namespace `supplier` :

| Clé | Contenu |
|---|---|
| `supplier.name` | Nom de la boutique AliExpress |
| `supplier.platform` | Plateforme et outil de sync |
| `supplier.cost_eur` | Coût d'achat de la variante de base |
| `supplier.rating` | Note, nombre d'avis, volume de ventes |
| `supplier.shipping` | Frais et délais de livraison |
| `supplier.notes` | Alertes, marges, tarifs dégressifs |
| `supplier.composition` | (packs uniquement) ce qu'il faut mapper dans DSers |

Ces métachamps n'ont **pas** de définition exposée au storefront : ils restent visibles
uniquement dans l'admin Shopify, jamais côté client.
