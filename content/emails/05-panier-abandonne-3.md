---
notification: Panier abandonné — e-mail 3
emplacement: Outil d'e-mailing (Shopify Email, Klaviyo, Omnisend…)
declencheur: J+3
objectif: Dernier rappel. Le risque perçu, puis on s'arrête.
note: Aucun compte à rebours, aucune fausse rareté, aucun stock inventé.
---

## Objet

```
90 jours pour changer d'avis
```

**Variante à tester :** `Le dernier point à régler`

**Pré-en-tête :**

```
Retour gratuit, remboursement sous 14 jours. C'est tout le risque.
```

---

## Corps de l'e-mail

### Message

Bonjour {{ customer.first_name }},

Dernier message à propos de votre panier — ensuite, nous vous laissons
tranquille.

S'il reste une hésitation, elle porte probablement sur le risque. Voici ce
qu'il est, exactement :

- **90 jours pour renvoyer le produit**, non utilisé ou défectueux. Le retour
  est **gratuit** : nous envoyons l'étiquette prépayée.
- **Remboursement sous 14 jours** après réception du retour, sur le moyen de
  paiement d'origine.
- **Ces 90 jours s'ajoutent** à votre droit de rétractation légal de 14 jours ;
  ils ne le remplacent pas.
- **Colis perdu ou endommagé** : réexpédié ou remboursé. Non livré après
  35 jours : remboursement intégral, sur simple demande.
- **Vous pouvez essayer la fontaine** — la remplir, la brancher, l'observer
  quelques jours. Ce n'est pas de l'usure, c'est un essai raisonnable, et il est
  prévu par la loi.

Autrement dit : si elle ne vous convient pas, elle repart sans vous coûter un
centime.

[Finaliser ma commande]({{ url }})

### Et si ce n'est pas le bon moment

C'est très bien aussi. Votre panier reste accessible depuis ce lien, et nous ne
vous relancerons plus à son sujet.

### Pied de page

Une question ? Répondez à cet e-mail — {{ shop.email }}, réponse sous 24 h
ouvrées.

{{ shop.name }} · [Se désinscrire]({{ unsubscribe_url }})
