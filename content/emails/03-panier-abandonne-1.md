---
notification: Panier abandonné — e-mail 1
emplacement: Paramètres → Notifications → Panier abandonné (ou votre outil d'e-mailing)
declencheur: H+1 après l'abandon
objectif: Lever l'obstacle technique. Ce n'est presque jamais un refus d'achat.
---

## Objet

```
Votre panier vous attend
```

**Variante à tester :** `Vous avez oublié quelque chose`

**Pré-en-tête :**

```
On l'a mis de côté. Il vous suffit d'un clic pour reprendre.
```

---

## Corps de l'e-mail

### Message

Bonjour {{ customer.first_name }},

Votre panier est toujours là, exactement comme vous l'avez laissé.

Neuf fois sur dix, un panier abandonné n'est pas un changement d'avis : c'est un
téléphone qui sonne, une page qui se ferme, un métro qui perd le réseau. Si
c'était le cas, voici le raccourci :

[Reprendre ma commande]({{ url }})

### Récapitulatif

*(Bloc articles du panier — laissé tel quel.)*

### Au cas où la question était ailleurs

- **Livraison** — offerte dès 39 €. En dessous : 4,90 € en Colissimo, 3,90 € en
  point relais. La fontaine Source 7L est **toujours livrée gratuitement**.
- **Délais** — expédition sous 24 à 48 h, réception estimée sous 5 à 12 jours
  ouvrés.
- **90 jours pour changer d'avis** — retour gratuit, remboursement sous 14 jours
  après réception du retour.
- **Paiement en 4 fois sans frais**, sans dossier à monter.

### Pied de page

Une question avant de valider ? Répondez à cet e-mail — un humain lit, et
répond sous 24 h ouvrées.

{{ shop.name }} · [Se désinscrire]({{ unsubscribe_url }})
