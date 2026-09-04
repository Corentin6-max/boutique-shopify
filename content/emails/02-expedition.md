---
notification: Confirmation d'expédition
emplacement: Paramètres → Notifications → Commandes → Confirmation d'expédition
declencheur: À la création du suivi d'expédition
---

## Objet

```
Votre commande {{ order.name }} est partie
```

**Pré-en-tête :**

```
Numéro de suivi à l'intérieur. Réception estimée sous quelques jours.
```

---

## Corps de l'e-mail

### En-tête

**VELLUNO**
*L'essentiel, pensé pour eux.*

### Message

Bonjour {{ order.customer.first_name }},

Votre colis est parti. Il est entre les mains du transporteur.

**Transporteur :** {{ fulfillment.tracking_company }}
**Numéro de suivi :** {{ fulfillment.tracking_number }}

[Suivre mon colis]({{ fulfillment.tracking_url }})

### Récapitulatif de l'envoi

*(Bloc articles expédiés Shopify — laissé tel quel.)*

### Le suivi ne bouge pas ?

C'est fréquent au début : **le premier scan peut prendre 48 à 72 h**. Le colis
avance, mais il n'a pas encore été enregistré au premier centre de tri.

Si rien ne change pendant **plus de 5 jours ouvrés**, écrivez-nous : nous
ouvrons une enquête auprès du transporteur, et nous ne vous laissons pas la
mener à notre place.

Et si le colis n'était jamais livré : **au-delà de 35 jours, nous remboursons
intégralement**, sur simple demande.

### Livré en point relais ?

Vous recevrez un SMS ou un e-mail du transporteur dès la mise à disposition.
Pensez à une **pièce d'identité** pour le retrait, et vérifiez le délai de garde
du point relais — il est généralement de 10 à 14 jours.

### Pied de page

Une question ? Répondez à cet e-mail ou écrivez à **{{ shop.email }}**.
Réponse sous 24 h ouvrées.

[Livraison]({{ shop.url }}/pages/livraison) ·
[Retours]({{ shop.url }}/pages/retours-et-remboursements) ·
[FAQ]({{ shop.url }}/pages/faq)

{{ shop.name }}
