#!/usr/bin/env bash
# Régénère le ZIP importable du thème Velluno.
set -euo pipefail

cd "$(dirname "$0")"
mkdir -p dist
rm -f dist/velluno-theme.zip

# Shopify attend les dossiers du thème à la racine du ZIP.
cd theme
zip -r -X -q ../dist/velluno-theme.zip \
  assets config layout locales sections snippets templates \
  -x '.*' -x '__MACOSX/*' -x '*/.DS_Store'
cd ..

SIZE=$(du -h dist/velluno-theme.zip | cut -f1)
COUNT=$(unzip -l dist/velluno-theme.zip | tail -1 | awk '{print $2}')
echo "dist/velluno-theme.zip — $SIZE, $COUNT fichiers"
