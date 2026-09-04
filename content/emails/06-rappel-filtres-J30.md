---
notification: Rappel de changement de filtre (D+30)
emplacement: Outil d'e-mailing — flux post-achat, déclenché sur l'achat de la fontaine
declencheur: J+30 après la livraison de la fontaine Source 7L
objectif: Le "rebuy" sans application payante — le pendant e-mail du bloc « Pensez au rechange » de la fiche produit.
---

> **Pourquoi cet e-mail existe.** Le brief demande un mécanisme de réachat sans
> application payante. Il repose sur deux pièces : le bloc « Pensez au
> rechange » sur la fiche produit, et **cet e-mail**. Segmentez sur l'achat du
> produit `fontaine-eau-velluno-7l-inox`, et **excluez** les clients ayant
> acheté un pack « + 10 filtres » ou « + 20 filtres » (SKU `VL-SRC-7L-F10` et
> `VL-SRC-7L-F20`) : ils sont déjà couverts pour 6 ou 12 mois.

## Objet

```
C'est le moment de changer le filtre
```

**Pré-en-tête :**

```
Un mois d'utilisation : le filtre arrive en fin de vie.
```

---

## Corps de l'e-mail

### Message

Bonjour {{ customer.first_name }},

Votre fontaine Source 7L tourne depuis environ un mois. C'est la durée de vie
typique d'un filtre : **3 à 4 semaines**.

**Les signes qui ne trompent pas :**

- le débit faiblit, ou le filet d'eau devient irrégulier ;
- l'eau se trouble, ou reprend un goût de robinet ;
- la pompe se fait plus entendre qu'au premier jour.

Si vous constatez l'un des trois, le filtre est saturé.

[Commander des filtres]({{ shop.url }}/products/filtres-rechange-velluno-source)

**Un lot de 10 couvre environ six mois.** C'est le format que prennent la
plupart de nos clients : on y pense une fois, pas tous les mois.

### Pendant que vous y êtes : le nettoyage complet

Toutes les deux semaines, comptez cinq minutes :

1. Débranchez le module et videz la cuve.
2. **Cuve inox** : lave-vaisselle, ou éponge non abrasive.
3. **Socle électronique** : chiffon humide uniquement, jamais immergé.
4. **Rincez le filtre neuf 30 secondes** à l'eau claire avant de l'installer.
5. Remplissez, rebranchez. Le débit se stabilise en une à deux minutes.

Les **mousses noires de pré-filtration** se rincent une fois par semaine et se
remplacent à chaque changement de cartouche — ce sont elles qui empêchent les
poils d'encrasser le moteur.

### Pied de page

Un souci avec votre fontaine ? Répondez à cet e-mail. Réponse sous 24 h
ouvrées, en français.

{{ shop.name }} · [Se désinscrire]({{ unsubscribe_url }})
