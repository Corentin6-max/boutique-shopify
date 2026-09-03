# Storefront — réassurance, pages et navigation

## Bandeau de réassurance

Un bandeau identique est intégré en haut des **8 fiches produits** (4 produits + 4 packs)
et de la FAQ, juste après l'accroche :

| | | | |
|---|---|---|---|
| **Livraison offerte** | **Retours sous 90 jours** | **Paiement sécurisé** | **Service client français** |
| France, sans minimum d'achat | Satisfait ou remboursé | Transaction cryptée SSL | Réponse sous 24 à 48 h |

Écrit en HTML avec styles en ligne, sans image ni script : il s'affiche quel que soit le
thème. Les couleurs utilisent `currentColor` et `rgba(128,128,128,.28)` pour rester
lisibles aussi bien sur fond clair que sur fond sombre.

Chaque fiche se termine aussi par une ligne de rappel des délais, et les packs précisent
qu'ils peuvent arriver en plusieurs colis.

### Ces promesses sont-elles tenables ?

| Promesse | Vérifié |
|---|---|
| Livraison offerte, sans minimum | ✅ Profil de livraison « France » : tarif 0,00 € actif, aucun seuil |
| Retours 90 jours | ✅ Les 4 fournisseurs AliExpress acceptent les retours sous 90 jours |
| Paiement sécurisé | ✅ Checkout Shopify, SSL, aucune donnée bancaire stockée |
| Réponse 24-48 h | ⚠️ Engagement de service — à tenir côté SAV |

Le délai de 90 jours est une **garantie commerciale** qui s'ajoute aux 14 jours légaux
de rétractation (article L221-18). C'est six fois le minimum légal, et c'est cohérent :
un animal met parfois plusieurs semaines à adopter une fontaine.

---

## Pages réécrites

Le contenu du site décrivait encore une marque de **literie pour chiens** : la FAQ
expliquait comment mesurer un chien pour choisir la taille d'un couchage, et « Notre
histoire » racontait une gamme de lits orthopédiques. Plus rien ne correspondait au
catalogue réel.

| Page | Handle | État |
|---|---|---|
| Questions fréquentes | `faq` | Réécrite — 24 questions sur les 4 produits, livraison, paiement, retours |
| Notre histoire | `notre-histoire` | Réécrite — positionnement hydratation et coin repas |
| Retours & Remboursements | `politique-de-remboursement` | Réécrite — garantie 90 jours, renommée |
| Livraison | `politique-de-livraison` | Réécrite — colis multiples, douane, renommée |
| Conditions générales de vente | `cgv` | Mise à jour (90 j, bon catalogue) — **reste en brouillon** |
| Mentions légales | `mentions-legales` | Inchangée — **reste en brouillon** |

### Pourquoi CGV et Mentions légales restent en brouillon

Elles contiennent des champs à compléter — `[RAISON SOCIALE]`, `[SIRET]`, `[ADRESSE]`,
`[NOM DU MÉDIATEUR]`. Publier des mentions légales avec des informations inventées
n'est pas envisageable : ces deux pages sont **obligatoires** pour un site marchand
français, et leur contenu engage juridiquement.

**À faire :** compléter les crochets avec les informations réelles de l'entreprise, puis
publier. L'adhésion à un médiateur de la consommation est également obligatoire
(article L612-1 du Code de la consommation).

### Pages anglaises dépubliées

Quatre pages en anglais faisaient doublon avec les pages françaises, avec des conditions
différentes : `terms-of-service`, `privacy-policy`, `refund-return-policy`,
`shipping-policy`. Deux politiques de retour contradictoires en ligne, c'est un risque
juridique autant qu'un problème de crédibilité.

Elles sont passées en **brouillon** (réversible en un clic dans l'admin). Plus aucun
menu ne pointait vers elles au moment de la dépublication.

---

## Navigation

**Menu principal**

```
Accueil
Boutique ▾
  ├─ Fontaines & Hydratation
  ├─ Repas & Gamelles
  └─ Jouets & Hygiène Dentaire
Packs & Économies
Questions fréquentes
Contact
```

**Pied de page** — Notre histoire · Questions fréquentes · Livraison ·
Retours & Remboursements · Contact · Politique de confidentialité

Les deux menus anglais du thème (`footer-primary-menu`, `footer-policies-menu`) ont été
traduits et repointés vers les pages françaises.

---

## Le thème : ce qui n'a pas pu être fait

Le thème publié est **Vitals Store Builder**. Shopify **bloque toute écriture de fichier
sur le thème live** via l'API — c'est une protection de la plateforme, pas un problème de
configuration. Le design visuel (couleurs, typographies, sections de la page d'accueil,
bannière de réassurance en en-tête) se règle donc dans **Boutique en ligne → Personnaliser**.

Cinq thèmes non publiés existent par ailleurs dans la boutique, dont `Horizon` et une
`Copie de Vitals Store Builder`. Un thème non publié, lui, peut être modifié par l'API.
