# -*- coding: utf-8 -*-
"""Single source of truth for the VELLUNO catalogue.

Product names, handles, options, SKUs and prices are taken verbatim from the
brief. Nothing here is generated or guessed: edit this file, re-run
build_products_csv.py, and the CSV follows.
"""

VENDOR = "VELLUNO"
GOOGLE_CATEGORY = "Animals & Pet Supplies > Pet Supplies"

# --------------------------------------------------------------------------
# 1. VELLUNO Source 7L — hero product
# --------------------------------------------------------------------------
FOUNTAIN_BODY = """<p>Une gamelle d'eau, on la remplit le matin et on l'oublie. À midi elle est tiède, le soir elle a pris la poussière, et le chat, lui, a décidé de boire dans le lavabo. La <strong>Source 7L</strong> règle le problème en amont : sept litres d'eau filtrée, en mouvement, renouvelée en continu.</p>

<h2>Sept litres, soit deux semaines sans y penser</h2>
<p>Sept litres, c'est environ <strong>deux semaines d'autonomie pour un chat</strong> et <strong>cinq jours pour un grand chien</strong>. De quoi partir en week-end sereinement, ou couvrir un foyer à plusieurs animaux sans refaire le plein tous les matins. Une fenêtre de niveau sur le côté et un témoin lumineux indiquent quand il est temps de recharger : plus besoin de soulever la cuve pour vérifier.</p>

<h2>De l'inox 304, parce que le plastique retient tout</h2>
<p>Une cuve en plastique se raye à l'usage, et chaque rayure devient un refuge à bactéries — c'est aussi ce qui explique les odeurs tenaces au bout de quelques mois. L'<strong>inox 304</strong> ne se raye pas dans un usage normal, ne retient ni odeur ni dépôt gras, ne jaunit pas, et passe au lave-vaisselle. Le socle en ABS reste, lui, à l'extérieur du bac.</p>

<h2>Aucun câble dans l'eau</h2>
<p>L'électronique est déportée dans un <strong>module d'alimentation magnétique</strong> qui se fixe sous le socle. Résultat : aucun fil ne traverse le bac, rien ne traîne à portée de dents, et le nettoyage se fait sans démêler quoi que ce soit. Le câble USB-C fourni ne relie que le module à la prise.</p>

<h2>Moins de 30 dB : on l'oublie</h2>
<p>La pompe fonctionne <strong>sous les 30 décibels</strong>, soit le niveau sonore d'une pièce calme. Elle a sa place dans un salon comme dans une chambre. Si un ronronnement apparaît, c'est presque toujours que le niveau d'eau est passé sous le repère minimum et que la pompe aspire de l'air : refaites le plein, le bruit disparaît.</p>

<h2>Une filtration en quatre étages</h2>
<p>Chaque filtre combine <strong>coton, charbon actif, résine échangeuse d'ions et mousse fine</strong>. Ensemble, ils retiennent les poils et les poussières, atténuent le goût de chlore et limitent les dépôts de calcaire dans la cuve. Comptez un filtre toutes les 3 à 4 semaines ; un lot de 10 couvre environ six mois.</p>

<h2>De l'eau en mouvement</h2>
<p>L'eau qui circule est plus fraîche, mieux oxygénée, et attire davantage l'attention des animaux. C'est une piste <strong>souvent recommandée par les vétérinaires pour encourager la prise de boisson</strong> chez les chats qui boivent peu. Une fontaine reste toutefois un objet du quotidien, pas un dispositif de soin : si votre animal boit anormalement peu ou beaucoup, parlez-en à votre vétérinaire.</p>

<h2>Dans la boîte</h2>
<ul>
<li>1 fontaine Source 7L : cuve en inox 304 et socle</li>
<li>1 module d'alimentation magnétique</li>
<li>1 câble USB-C</li>
<li>1 filtre 4 étages, déjà installé</li>
<li>1 notice en français</li>
</ul>

<h2>Caractéristiques techniques</h2>
<table>
<tr><th>Capacité</th><td>7 litres</td></tr>
<tr><th>Matériaux</th><td>Cuve en inox 304, socle ABS</td></tr>
<tr><th>Dimensions</th><td>Environ 24 × 24 × 16 cm</td></tr>
<tr><th>Alimentation</th><td>5 V / 2 A, module magnétique, câble USB-C</td></tr>
<tr><th>Niveau sonore</th><td>Moins de 30 dB</td></tr>
<tr><th>Filtration</th><td>4 étages : coton, charbon actif, résine, mousse fine</td></tr>
<tr><th>Entretien</th><td>Nettoyage complet toutes les 2 semaines</td></tr>
<tr><th>Filtre</th><td>À changer toutes les 3 à 4 semaines</td></tr>
</table>

<p><em>Livraison offerte sur cette fontaine, quel que soit le montant de la commande. Retour gratuit sous 90 jours.</em></p>"""

FILTERS_BODY = """<p>Un filtre saturé, c'est un débit qui faiblit, une eau qui reprend le goût du robinet, et une pompe qui force pour rien. Ces <strong>filtres 4 étages</strong> sont ceux de la fontaine Source 7L : mêmes matériaux, même format, vendus en lot pour ne plus avoir à y penser.</p>

<h2>Quatre étages, quatre rôles</h2>
<ul>
<li><strong>Coton</strong> — retient les poils, les miettes et les poussières avant qu'ils n'atteignent la pompe.</li>
<li><strong>Charbon actif</strong> — atténue le goût et l'odeur de chlore de l'eau du robinet.</li>
<li><strong>Résine échangeuse d'ions</strong> — limite les dépôts de calcaire, particulièrement utile en eau dure.</li>
<li><strong>Mousse fine</strong> — dernière barrière avant la sortie d'eau, elle lisse le débit.</li>
</ul>

<h2>Un filtre tient 3 à 4 semaines</h2>
<p>La durée réelle dépend de la dureté de votre eau, du nombre d'animaux et de la quantité de poils. En pratique, comptez <strong>3 à 4 semaines par filtre</strong>, et changez-le plus tôt si le débit faiblit ou si l'eau se trouble. Un <strong>lot de 10 couvre environ six mois</strong>, un lot de 20 une année complète.</p>

<h2>Compatibilité</h2>
<p>Ces filtres sont conçus pour la <strong>fontaine VELLUNO Source 7L</strong>. Ils s'adaptent également aux <strong>fontaines en inox de 2,2 L au format courant</strong>, très répandues en ligne. Si votre fontaine n'est pas une VELLUNO, vérifiez le diamètre du logement à filtre avant de commander — et écrivez-nous en cas de doute, nous répondons sous 24 h ouvrées.</p>

<h2>Mousses de pré-filtration incluses</h2>
<p>Chaque lot comprend les <strong>mousses noires de pré-filtration</strong>, celles qui se placent devant l'entrée de la pompe. On les oublie souvent, et c'est pourtant elles qui empêchent les poils d'aller encrasser le moteur. Rincez-les à l'eau claire une fois par semaine et remplacez-les à chaque changement de cartouche.</p>

<h2>Comment installer un filtre neuf</h2>
<ol>
<li>Débranchez le module d'alimentation et videz la cuve.</li>
<li><strong>Rincez le filtre neuf 30 secondes à l'eau claire</strong> : cela évacue les fines particules de charbon.</li>
<li>Placez-le dans son logement, mousse noire côté pompe.</li>
<li>Remplissez, rebranchez. Le débit se stabilise en une à deux minutes.</li>
</ol>

<h2>Caractéristiques</h2>
<table>
<tr><th>Type</th><td>Filtre 4 étages</td></tr>
<tr><th>Composition</th><td>Coton, charbon actif, résine échangeuse d'ions, mousse fine</td></tr>
<tr><th>Compatibilité</th><td>VELLUNO Source 7L et fontaines inox 2,2 L de format courant</td></tr>
<tr><th>Durée</th><td>3 à 4 semaines par filtre</td></tr>
<tr><th>Inclus</th><td>Mousses noires de pré-filtration</td></tr>
</table>

<p><em>Retour gratuit sous 90 jours. Livraison offerte dès 39 € d'achat.</em></p>"""

MAT_BODY = """<p>Le problème n'est jamais la gamelle. C'est le demi-litre d'eau qui finit à côté, les croquettes poussées hors du bol, et le carrelage qu'on éponge deux fois par jour. Le <strong>tapis Base</strong> contient tout ça.</p>

<h2>Un rebord qui retient réellement</h2>
<p>Le pourtour est relevé sur tout le périmètre : l'eau renversée reste <strong>dans</strong> le tapis au lieu de filer sous le meuble, et les croquettes projetées hors de la gamelle restent à portée de museau. C'est un détail de conception, et c'est toute la différence avec un simple set de table en silicone.</p>

<h2>Silicone alimentaire, souple et stable</h2>
<p>Le tapis est en <strong>silicone de qualité alimentaire</strong>, souple sous la main et sans odeur. Sa face inférieure adhère au carrelage comme au parquet : les gamelles ne partent plus en glissade quand un chien mange avec enthousiasme. Aucun rebord rigide, rien qui blesse une patte.</p>

<h2>Il se nettoie en dix secondes</h2>
<p>Passez-le sous l'eau, ou mettez-le au <strong>lave-vaisselle</strong>. Le silicone ne retient ni les odeurs ni les taches de pâtée, et il ne se déforme pas au séchage. Pour les traces de calcaire, un peu de vinaigre blanc suffit.</p>

<h2>Il se roule pour partir avec vous</h2>
<p>Le tapis s'enroule sur lui-même et tient dans un sac de voyage. Chez les parents, au camping, en vacances : votre animal retrouve son coin repas habituel, avec les mêmes repères. Il reprend sa forme à plat immédiatement, sans marquer les plis.</p>

<h2>Cinq coloris pensés pour un intérieur</h2>
<p>Vert sauge, gris ardoise, rose argile, noir, bleu ciel. Des teintes sourdes, qui se fondent dans une cuisine ou une entrée au lieu de crier. Format <strong>environ 48 × 30 cm</strong> : de quoi accueillir deux gamelles côte à côte, ou une gamelle et la fontaine Source 7L.</p>

<h2>Caractéristiques</h2>
<table>
<tr><th>Matériau</th><td>Silicone de qualité alimentaire</td></tr>
<tr><th>Dimensions</th><td>Environ 48 × 30 cm</td></tr>
<tr><th>Rebords</th><td>Relevés sur tout le périmètre</td></tr>
<tr><th>Surface inférieure</th><td>Antidérapante, carrelage et parquet</td></tr>
<tr><th>Entretien</th><td>Eau claire ou lave-vaisselle</td></tr>
<tr><th>Transport</th><td>S'enroule, ne marque pas les plis</td></tr>
<tr><th>Coloris</th><td>Vert sauge, gris ardoise, rose argile, noir, bleu ciel</td></tr>
</table>

<p><em>Retour gratuit sous 90 jours. Livraison offerte dès 39 € d'achat.</em></p>"""

CHEW_BODY = """<p>Un chien mâche. La question n'est pas de l'en empêcher, mais de lui donner autre chose que le pied du canapé. L'os <strong>VELLUNO Chew</strong> est fait pour ça : assez résistant pour tenir, assez souple pour ne pas abîmer les dents.</p>

<h2>Des picots qui travaillent les gencives</h2>
<p>La surface est couverte de <strong>picots texturés</strong> qui massent les gencives pendant la mastication et <strong>aident à limiter l'accumulation quotidienne de plaque</strong>. C'est un geste d'hygiène du quotidien, à intégrer à la routine — pas un traitement. <strong>Il ne remplace pas un détartrage vétérinaire</strong>, et ne dispense pas d'un contrôle régulier de la dentition.</p>

<h2>Un caoutchouc souple, sans BPA</h2>
<p>Le caoutchouc est <strong>souple et sans BPA</strong>. Il se déforme sous la pression puis reprend sa forme, ce qui absorbe l'effort au lieu de le renvoyer dans la mâchoire. Il convient aux <strong>chiots comme aux chiens adultes de taille moyenne</strong>. Pour un mâcheur très puissant, surveillez l'usure de plus près et remplacez le jouet plus tôt.</p>

<h2>Il flotte, et il se lave</h2>
<p>Jeté dans l'eau, il flotte : parfait pour un jeu de rapport au lac ou dans une piscine. De retour à la maison, il passe sous l'eau savonneuse et sèche en quelques minutes. Aucune odeur ne s'y installe.</p>

<h2>Six couleurs, à l'unité ou par trois</h2>
<p>Bleu, vert, rose, rouge, jaune, noir. Le <strong>lot de 3</strong> est le choix évident si vous avez plusieurs chiens, ou si vous préférez en garder un dans le jardin, un dans la voiture et un à la maison — c'est aussi la meilleure façon de faire tourner les jouets pour maintenir l'intérêt.</p>

<h2>Consigne de sécurité</h2>
<p><strong>Surveillez votre chien pendant le jeu. Remplacez le jouet dès qu'il est endommagé. Ne remplace pas un détartrage vétérinaire.</strong> Aucun jouet à mâcher n'est indestructible : inspectez-le régulièrement et retirez-le dès que des morceaux se détachent.</p>

<h2>Caractéristiques</h2>
<table>
<tr><th>Matériau</th><td>Caoutchouc souple sans BPA</td></tr>
<tr><th>Surface</th><td>Picots texturés</td></tr>
<tr><th>Pour</th><td>Chiots et chiens adultes de taille moyenne</td></tr>
<tr><th>Flottant</th><td>Oui</td></tr>
<tr><th>Entretien</th><td>Eau savonneuse, séchage rapide</td></tr>
<tr><th>Coloris</th><td>Bleu, vert, rose, rouge, jaune, noir</td></tr>
<tr><th>Conditionnement</th><td>1 pièce ou lot de 3</td></tr>
</table>

<p><em>Retour gratuit sous 90 jours. Livraison offerte dès 39 € d'achat.</em></p>"""

CHEW_COLOURS = [
    ("Bleu", "BLE"),
    ("Vert", "VER"),
    ("Rose", "ROS"),
    ("Rouge", "ROU"),
    ("Jaune", "JAU"),
    ("Noir", "NOI"),
]

PRODUCTS = [
    {
        "handle": "fontaine-eau-velluno-7l-inox",
        "title": "VELLUNO Source 7L — Fontaine à eau en inox pour chien et chat",
        "body": FOUNTAIN_BODY,
        "type": "Fontaine à eau",
        "tags": [
            "fontaine à eau", "chat", "chien", "inox", "7 litres",
            "silencieux", "filtration", "hydratation", "best-seller",
        ],
        "seo_title": "Fontaine à eau inox 7L pour chien et chat | VELLUNO",
        "seo_description": (
            "Fontaine 7 L en inox 304, moins de 30 dB, filtration 4 étages, sans câble "
            "dans l'eau. Livraison offerte, retour gratuit 90 jours."
        ),
        "option_names": ["Pack"],
        "variants": [
            {"options": ["Fontaine seule"], "price": "99.90", "compare": "139.90", "sku": "VL-SRC-7L", "grams": 2200},
            {"options": ["Fontaine + 10 filtres (6 mois)"], "price": "109.90", "compare": "152.90", "sku": "VL-SRC-7L-F10", "grams": 2450},
            {"options": ["Fontaine + 20 filtres (12 mois)"], "price": "118.90", "compare": "164.90", "sku": "VL-SRC-7L-F20", "grams": 2700},
        ],
        "images": [
            "Fontaine à eau VELLUNO Source 7L en inox, posée sur un sol clair",
            "Détail de la cuve en inox 304 de la fontaine VELLUNO Source 7L",
            "Module d'alimentation magnétique de la fontaine VELLUNO Source 7L, sans câble dans l'eau",
            "Filtre 4 étages de la fontaine VELLUNO Source 7L, coton et charbon actif",
            "Chat buvant à la fontaine VELLUNO Source 7L dans un salon",
            "Fenêtre de niveau d'eau et témoin lumineux de la fontaine VELLUNO Source 7L",
        ],
    },
    {
        "handle": "filtres-rechange-velluno-source",
        "title": "Filtres de rechange VELLUNO — 4 étages, compatibles Source 7L",
        "body": FILTERS_BODY,
        "type": "Filtre",
        "tags": [
            "filtre", "rechange", "charbon actif", "fontaine à eau",
            "consommable", "chat", "chien", "entretien",
        ],
        "seo_title": "Filtres de rechange 4 étages pour fontaine | VELLUNO",
        "seo_description": (
            "Filtres 4 étages compatibles fontaine VELLUNO Source 7L et fontaines inox "
            "2,2 L. Lots de 10, 20 ou 30. Mousses de pré-filtration incluses."
        ),
        "option_names": ["Quantité"],
        "variants": [
            {"options": ["10 filtres"], "price": "12.90", "compare": "19.90", "sku": "VL-FLT-10", "grams": 250},
            {"options": ["20 filtres"], "price": "21.90", "compare": "32.90", "sku": "VL-FLT-20", "grams": 480},
            {"options": ["30 filtres"], "price": "28.90", "compare": "44.90", "sku": "VL-FLT-30", "grams": 700},
        ],
        "images": [
            "Lot de filtres de rechange VELLUNO 4 étages pour fontaine à eau",
            "Coupe d'un filtre VELLUNO montrant les quatre étages de filtration",
            "Filtre VELLUNO installé dans la fontaine Source 7L",
            "Mousses noires de pré-filtration incluses avec les filtres VELLUNO",
        ],
    },
    {
        "handle": "tapis-gamelle-silicone-velluno",
        "title": "VELLUNO Base — Tapis de gamelle en silicone, rebords anti-débordement",
        "body": MAT_BODY,
        "type": "Tapis de gamelle",
        "tags": [
            "tapis de gamelle", "silicone", "antidérapant", "anti-débordement",
            "chat", "chien", "coin repas", "lavable",
        ],
        "seo_title": "Tapis de gamelle silicone antidérapant 48×30 cm | VELLUNO",
        "seo_description": (
            "Tapis de gamelle en silicone alimentaire, rebords relevés anti-débordement, "
            "antidérapant, lave-vaisselle. 48 × 30 cm, 5 coloris."
        ),
        "option_names": ["Couleur"],
        "variants": [
            {"options": ["Vert sauge"], "price": "11.90", "compare": "17.90", "sku": "VL-BSE-VSA", "grams": 300},
            {"options": ["Gris ardoise"], "price": "11.90", "compare": "17.90", "sku": "VL-BSE-GAR", "grams": 300},
            {"options": ["Rose argile"], "price": "11.90", "compare": "17.90", "sku": "VL-BSE-RAR", "grams": 300},
            {"options": ["Noir"], "price": "11.90", "compare": "17.90", "sku": "VL-BSE-NOI", "grams": 300},
            {"options": ["Bleu ciel"], "price": "11.90", "compare": "17.90", "sku": "VL-BSE-BCI", "grams": 300},
        ],
        "images": [
            "Tapis de gamelle VELLUNO Base en silicone vert sauge avec deux gamelles",
            "Détail du rebord relevé anti-débordement du tapis VELLUNO Base",
            "Les cinq coloris du tapis de gamelle VELLUNO Base",
            "Tapis de gamelle VELLUNO Base enroulé pour le voyage",
            "Tapis VELLUNO Base sous la fontaine Source 7L dans une cuisine",
        ],
    },
    {
        "handle": "os-a-macher-dentaire-velluno",
        "title": "VELLUNO Chew — Os à mâcher dentaire en caoutchouc pour chien",
        "body": CHEW_BODY,
        "type": "Jouet pour chien",
        "tags": [
            "os à mâcher", "jouet pour chien", "hygiène dentaire", "caoutchouc",
            "sans BPA", "chiot", "flottant", "mastication",
        ],
        "seo_title": "Os à mâcher dentaire en caoutchouc sans BPA | VELLUNO",
        "seo_description": (
            "Os à mâcher à picots pour chien : masse les gencives, aide à limiter la "
            "plaque. Caoutchouc souple sans BPA, flottant. 6 coloris, à l'unité ou par 3."
        ),
        "option_names": ["Couleur", "Lot"],
        "variants": [
            v
            for colour, code in CHEW_COLOURS
            for v in (
                {"options": [colour, "1 pièce"], "price": "6.90", "compare": "12.90",
                 "sku": f"VL-CHW-{code}-1", "grams": 90},
                {"options": [colour, "3 pièces"], "price": "11.90", "compare": "21.90",
                 "sku": f"VL-CHW-{code}-3", "grams": 270},
            )
        ],
        "images": [
            "Os à mâcher dentaire VELLUNO Chew en caoutchouc bleu",
            "Détail des picots texturés de l'os à mâcher VELLUNO Chew",
            "Les six coloris de l'os à mâcher VELLUNO Chew",
            "Lot de 3 os à mâcher VELLUNO Chew",
            "Chien jouant avec l'os à mâcher VELLUNO Chew dans un jardin",
        ],
    },
]

COLLECTIONS = [
    {
        "handle": "hydratation",
        "title": "Hydratation",
        "products": ["fontaine-eau-velluno-7l-inox", "filtres-rechange-velluno-source"],
        "description": (
            "<p>De l'eau fraîche, filtrée et en mouvement, toute la journée. La fontaine "
            "Source 7L en inox et ses filtres 4 étages : sept litres d'autonomie, moins "
            "de 30 dB, et aucun câble dans le bac.</p>"
        ),
        "seo_title": "Fontaines à eau et filtres pour chien et chat | VELLUNO",
        "seo_description": (
            "Fontaine à eau 7 L en inox et filtres 4 étages. Eau filtrée en continu, "
            "moins de 30 dB. Livraison offerte dès 39 €, retour gratuit 90 jours."
        ),
    },
    {
        "handle": "coin-repas",
        "title": "Coin repas",
        "products": ["tapis-gamelle-silicone-velluno", "fontaine-eau-velluno-7l-inox"],
        "description": (
            "<p>Le tapis qui contient l'eau renversée et les croquettes projetées, la "
            "fontaine qui ne se renverse pas. De quoi installer un coin repas propre, "
            "stable, et qu'on nettoie en dix secondes.</p>"
        ),
        "seo_title": "Coin repas : tapis de gamelle et fontaine | VELLUNO",
        "seo_description": (
            "Tapis de gamelle en silicone à rebords relevés et fontaine à eau en inox. "
            "Un coin repas propre, antidérapant, lavable au lave-vaisselle."
        ),
    },
    {
        "handle": "jeu-mastication",
        "title": "Jeu & mastication",
        "products": ["os-a-macher-dentaire-velluno"],
        "description": (
            "<p>De quoi occuper les mâchoires autrement que sur le pied du canapé. "
            "Caoutchouc souple sans BPA, picots qui massent les gencives, et un jouet "
            "qui flotte.</p>"
        ),
        "seo_title": "Jouets à mâcher et hygiène dentaire pour chien | VELLUNO",
        "seo_description": (
            "Os à mâcher à picots en caoutchouc souple sans BPA. Masse les gencives, "
            "aide à limiter la plaque, flotte. Chiots et chiens adultes."
        ),
    },
    {
        "handle": "rechanges",
        "title": "Consommables & rechanges",
        "products": ["filtres-rechange-velluno-source"],
        "description": (
            "<p>Un filtre tient 3 à 4 semaines. Les lots de 10, 20 ou 30 couvrent six "
            "mois, un an, dix-huit mois — et évitent la commande de dernière minute un "
            "dimanche soir.</p>"
        ),
        "seo_title": "Filtres et consommables pour fontaine à eau | VELLUNO",
        "seo_description": (
            "Filtres de rechange 4 étages en lots de 10, 20 ou 30. Compatibles VELLUNO "
            "Source 7L et fontaines inox 2,2 L. Mousses de pré-filtration incluses."
        ),
    },
    {
        "handle": "best-sellers",
        "title": "Best-sellers",
        "products": [
            "fontaine-eau-velluno-7l-inox",
            "filtres-rechange-velluno-source",
            "tapis-gamelle-silicone-velluno",
            "os-a-macher-dentaire-velluno",
        ],
        "description": (
            "<p>Quatre objets, pensés pour durer : une fontaine en inox, ses filtres, un "
            "tapis qui contient les débordements, et de quoi occuper les mâchoires.</p>"
        ),
        "seo_title": "Best-sellers VELLUNO — hydratation et confort du quotidien",
        "seo_description": (
            "Les quatre essentiels VELLUNO : fontaine inox 7 L, filtres 4 étages, tapis "
            "de gamelle silicone et os à mâcher dentaire."
        ),
    },
]
