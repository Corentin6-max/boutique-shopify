---
notification: Confirmation de commande
emplacement: Paramètres → Notifications → Commandes → Confirmation de commande
declencheur: Immédiat, à la validation du paiement
---

## Objet

```
Commande {{ order.name }} confirmée — merci !
```

**Pré-en-tête** (première ligne visible dans la boîte de réception) :

```
On prépare votre colis. Expédition sous 24 à 48 h.
```

---

## Corps de l'e-mail

> Les variables `{{ … }}` sont celles de Shopify : collez-les telles quelles
> dans l'éditeur de notification. Le bloc récapitulatif des articles
> (`{% for line in order.line_items %}`) est déjà présent dans le modèle
> Shopify — **ne le supprimez pas**, insérez le texte ci-dessous autour.

### En-tête

**VELLUNO**
*L'essentiel, pensé pour eux.*

### Message

Bonjour {{ order.customer.first_name }},

Merci pour votre commande. Elle est bien enregistrée et le paiement est validé.

**Ce qui se passe maintenant :**

1. **Sous 24 à 48 h** — nous préparons votre colis et le remettons au
   transporteur.
2. **Vous recevez un e-mail** avec votre numéro de suivi dès le départ du colis.
3. **Réception estimée sous 5 à 12 jours ouvrés** au total. C'est une
   estimation, pas un engagement contractuel.

[Suivre ma commande]({{ order.status_url }})

### Récapitulatif

*(Bloc articles / totaux Shopify — laissé tel quel.)*

### Bon à savoir

- **Retours gratuits sous 90 jours**, produit non utilisé ou défectueux.
  Remboursement sous 14 jours après réception du retour. Ces 90 jours s'ajoutent
  à votre droit de rétractation légal de 14 jours.
- **Colis perdu ou endommagé** : réexpédié ou remboursé. Non livré après
  35 jours : remboursement intégral sur demande.
- **Une erreur d'adresse ?** Écrivez-nous vite : tant que le colis n'est pas
  parti, nous pouvons corriger.

### Si vous avez commandé la fontaine Source 7L

Un conseil pour le premier jour : **rincez le filtre 30 secondes à l'eau claire**
avant de l'installer. Cela évacue les fines particules de charbon et évite une
eau légèrement grise pendant les premières heures.

### Pied de page

Une question ? Répondez simplement à cet e-mail, ou écrivez à
**{{ shop.email }}**. Nous répondons sous 24 h ouvrées, en français.

[Livraison]({{ shop.url }}/pages/livraison) ·
[Retours]({{ shop.url }}/pages/retours-et-remboursements) ·
[FAQ]({{ shop.url }}/pages/faq) ·
[CGV]({{ shop.url }}/pages/cgv)

{{ shop.name }} — {{ shop.address.summary }}
