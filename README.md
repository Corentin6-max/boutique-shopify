# VELLUNO — boutique Shopify

Livrable local complet pour la boutique **VELLUNO** (hydratation et confort du
quotidien pour chiens et chats, marché français).

> **Aucun fichier de ce dépôt ne se connecte à une boutique Shopify.**
> Tout s'importe manuellement, en suivant `SETUP.md`.

## Par où commencer

1. **`SETUP.md`** — la procédure d'installation, étape par étape, dans l'ordre.
2. **`NOTES.md`** — les décisions prises, l'auto-revue et les TODO qui vous
   reviennent (dont **65 champs juridiques à compléter**).

## Contenu

| Chemin | Description |
|---|---|
| `velluno-theme.zip` | Thème Shopify OS 2.0, prêt à importer (~108 Ko) |
| `velluno-theme/` | Sources du thème |
| `import/products_velluno.csv` | Catalogue complet — 4 produits, 23 variantes |
| `import/collections.csv` | 5 collections manuelles + SEO |
| `import/redirects.csv` | 29 redirections 301 |
| `import/images_TODO.md` | Visuels attendus + procédure d'upload |
| `content/pages/` | Les 9 pages, rédigées en français |
| `content/navigation.md` | Arborescence des menus |
| `content/emails/` | 6 notifications client |
| `build.sh` | Construit et valide l'archive |
| `tools/` | Générateurs de CSV et scripts de vérification |

## Vérifier

```bash
./build.sh                          # JSON, i18n, dépendances, budgets, ZIP
python3 tools/test_products_csv.py  # 51 contrôles sur le catalogue
python3 tools/check_translations.py # clés de traduction
```
