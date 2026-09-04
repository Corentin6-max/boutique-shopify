#!/usr/bin/env bash
#
# VELLUNO — build the importable theme archive.
#
#   ./build.sh
#
# Steps: sync the icon sprite → optimise images → validate → zip → check size.
# Fails loudly (exit 1) if the archive would be rejected by Shopify.
#
# This script NEVER contacts a Shopify store. It does not log in, push, publish
# or deploy anything. It only produces velluno-theme.zip in this folder.

set -euo pipefail

THEME_DIR="velluno-theme"
ZIP_NAME="velluno-theme.zip"
MAX_BYTES=$((50 * 1024 * 1024))   # Shopify's hard limit for a theme upload
WARN_BYTES=$((8 * 1024 * 1024))   # our own target
MAX_FILE_BYTES=$((20 * 1024 * 1024))

RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; BOLD=$'\033[1m'; OFF=$'\033[0m'
fail()  { printf '%s✗ %s%s\n' "$RED" "$1" "$OFF" >&2; exit 1; }
ok()    { printf '%s✓%s %s\n' "$GREEN" "$OFF" "$1"; }
warn()  { printf '%s!%s %s\n' "$YELLOW" "$OFF" "$1"; }
step()  { printf '\n%s%s%s\n' "$BOLD" "$1" "$OFF"; }

human() { numfmt --to=iec-i --suffix=B "$1" 2>/dev/null || echo "$1 bytes"; }

[ -d "$THEME_DIR" ] || fail "Dossier $THEME_DIR introuvable. Lancez ce script depuis la racine du projet."

# ---------------------------------------------------------------------------
step "1/7  Synchronisation du sprite d'icônes"
# ---------------------------------------------------------------------------
# snippets/icon-sprite.liquid is the single source of truth (Safari does not
# support external <use href> references, so the sprite must be inlined).
# assets/icons.svg is regenerated from it for design/reference use.
sed '/^{%-* *comment/,/^{%-* *endcomment.*%}/d' "$THEME_DIR/snippets/icon-sprite.liquid" \
  | sed '/^[[:space:]]*$/d' > "$THEME_DIR/assets/icons.svg"
ok "assets/icons.svg régénéré depuis snippets/icon-sprite.liquid"

# ---------------------------------------------------------------------------
step "2/7  Optimisation des images"
# ---------------------------------------------------------------------------
shopt -s nullglob
raster=("$THEME_DIR"/assets/*.png "$THEME_DIR"/assets/*.jpg "$THEME_DIR"/assets/*.jpeg)
shopt -u nullglob

if [ ${#raster[@]} -eq 0 ]; then
  ok "Aucune image matricielle dans le thème — uniquement des SVG (< 1 Ko chacun)."
  warn "Les visuels produit se téléversent dans Shopify (Contenu → Fichiers), pas dans le ZIP."
  warn "Liste des visuels attendus : import/images_TODO.md"
else
  if command -v cwebp >/dev/null 2>&1; then
    for image in "${raster[@]}"; do
      target="${image%.*}.webp"
      cwebp -quiet -q 82 -resize 1600 0 "$image" -o "$target"
      ok "WebP : $(basename "$target")"
    done
  elif command -v npx >/dev/null 2>&1 && [ -f package.json ]; then
    npx --no-install sharp-cli --input "$THEME_DIR/assets/*.{png,jpg,jpeg}" \
        --output "$THEME_DIR/assets" --format webp --quality 82 --width 1600 2>/dev/null \
      && ok "WebP générés via sharp-cli" \
      || warn "sharp-cli indisponible — images laissées telles quelles."
  else
    warn "Ni cwebp ni sharp installés : les images ne sont pas converties."
    warn "Installez cwebp (paquet webp) pour activer cette étape."
  fi

  for image in "${raster[@]}"; do
    size=$(wc -c < "$image")
    [ "$size" -gt 250000 ] && warn "$(basename "$image") pèse $(human "$size") — au-delà de 250 Ko."
  done
fi

# ---------------------------------------------------------------------------
step "3/7  Validation JSON (schémas de sections, templates, locales, config)"
# ---------------------------------------------------------------------------
python3 - "$THEME_DIR" <<'PY' || fail "Validation JSON échouée."
import json, pathlib, re, sys
theme = pathlib.Path(sys.argv[1])
errors = []

for path in sorted(theme.glob("sections/*.liquid")):
    text = path.read_text(encoding="utf-8")
    match = re.search(r"\{%\s*schema\s*%\}(.*?)\{%\s*endschema\s*%\}", text, re.S)
    if not match:
        errors.append(f"{path.name}: bloc {{% schema %}} absent")
        continue
    try:
        json.loads(match.group(1))
    except json.JSONDecodeError as exc:
        errors.append(f"{path.name}: schéma JSON invalide — {exc}")

for pattern in ("templates/**/*.json", "locales/*.json", "config/*.json"):
    for path in sorted(theme.glob(pattern)):
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"{path.relative_to(theme)}: JSON invalide — {exc}")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"Sections vérifiées : {len(list(theme.glob('sections/*.liquid')))}")
print(f"Templates + locales + config vérifiés : "
      f"{len(list(theme.glob('templates/**/*.json'))) + len(list(theme.glob('locales/*.json'))) + len(list(theme.glob('config/*.json')))}")
PY
ok "Tous les JSON du thème sont valides."

# ---------------------------------------------------------------------------
step "4/8  Templates obligatoires"
# ---------------------------------------------------------------------------
# Shopify REFUSES a theme upload when any of these is missing. This is the
# check that would have caught the first rejected archive.
missing=""
for t in 404 article blog cart collection gift_card index list-collections \
         page password product search; do
  ls "$THEME_DIR/templates/$t".* >/dev/null 2>&1 || missing="$missing templates/$t"
done
for t in account activate_account addresses login order register reset_password; do
  ls "$THEME_DIR/templates/customers/$t".* >/dev/null 2>&1 \
    || missing="$missing templates/customers/$t"
done
[ -n "$missing" ] && fail "Templates obligatoires manquants — Shopify refusera l'import :$missing"
ok "Les 19 templates obligatoires sont présents"

for required in "layout/theme.liquid" "config/settings_schema.json"; do
  [ -f "$THEME_DIR/$required" ] || fail "Fichier obligatoire manquant : $required"
done
ls "$THEME_DIR"/locales/*.default.json >/dev/null 2>&1 || fail "Aucune locale par défaut (*.default.json)."
ok "layout/theme.liquid, config/settings_schema.json et la locale par défaut sont présents"

# ---------------------------------------------------------------------------
step "5/8  Vérification des clés de traduction"
# ---------------------------------------------------------------------------
if [ -f tools/check_translations.py ]; then
  python3 tools/check_translations.py > /tmp/velluno-i18n.txt 2>&1 \
    && ok "Toutes les clés utilisées en Liquid existent dans fr.default.json" \
    || { cat /tmp/velluno-i18n.txt; fail "Clés de traduction manquantes."; }
else
  warn "tools/check_translations.py absent — vérification ignorée."
fi

# ---------------------------------------------------------------------------
step "6/8  Fichiers interdits & appels réseau externes"
# ---------------------------------------------------------------------------
forbidden=$(find "$THEME_DIR" \
  \( -name 'node_modules' -o -name '.git' -o -name '.DS_Store' -o -name '__MACOSX' \) \
  -print 2>/dev/null || true)
[ -n "$forbidden" ] && fail "Fichiers interdits dans le thème :\n$forbidden"
ok "Aucun node_modules / .git / .DS_Store / __MACOSX"

big=$(find "$THEME_DIR" -type f -size +20M -print 2>/dev/null || true)
[ -n "$big" ] && fail "Fichier de plus de 20 Mo :\n$big"
ok "Aucun fichier de plus de 20 Mo"

# Only Shopify's own CDN preconnect and schema.org / legal URLs are allowed.
external=$(grep -rnoE 'https?://[a-zA-Z0-9./-]+' \
             "$THEME_DIR/assets" "$THEME_DIR/sections" "$THEME_DIR/snippets" "$THEME_DIR/layout" 2>/dev/null \
           | grep -vE 'schema\.org|www\.w3\.org|cdn\.shopify\.com|ec\.europa\.eu|velluno\.fr|shopify\.com' || true)
if [ -n "$external" ]; then
  printf '%s\n' "$external"
  fail "Appel réseau externe non autorisé détecté."
fi
ok "Aucune dépendance externe (pas de CDN tiers, pas de Google Fonts)"

# ---------------------------------------------------------------------------
step "7/8  Budgets de performance"
# ---------------------------------------------------------------------------
css_bytes=$(cat "$THEME_DIR"/assets/*.css | wc -c)
js_bytes=$(cat "$THEME_DIR"/assets/*.js | wc -c)
css_gz=$(cat "$THEME_DIR"/assets/*.css | gzip -9 | wc -c)
js_gz=$(cat "$THEME_DIR"/assets/*.js | gzip -9 | wc -c)

printf '  CSS : %-10s (gzip %s) — budget 90 Ko\n' "$(human "$css_bytes")" "$(human "$css_gz")"
printf '  JS  : %-10s (gzip %s) — budget 30 Ko\n' "$(human "$js_bytes")" "$(human "$js_gz")"

[ "$css_bytes" -gt $((90 * 1024)) ] && fail "CSS au-dessus du budget de 90 Ko."
ok "CSS dans le budget"
if [ "$js_bytes" -gt $((30 * 1024)) ]; then
  warn "JS source = $(human "$js_bytes"), au-dessus de 30 Ko avec les commentaires."
  warn "Servi compressé : $(human "$js_gz"). Voir NOTES.md § budgets."
else
  ok "JS dans le budget"
fi

# ---------------------------------------------------------------------------
step "8/8  Construction de l'archive"
# ---------------------------------------------------------------------------
rm -f "$ZIP_NAME"
# -x excludes belt-and-braces; step 5 already guarantees they are absent.
( cd "$THEME_DIR" && zip -r -q -9 "../$ZIP_NAME" \
    assets config layout locales sections snippets templates \
    -x '*.DS_Store' '*__MACOSX*' '*/.git/*' )

[ -f "$ZIP_NAME" ] || fail "L'archive n'a pas été créée."
zip_bytes=$(wc -c < "$ZIP_NAME")

# The archive must contain the seven folders AT ITS ROOT — no wrapper folder.
roots=$(unzip -Z1 "$ZIP_NAME" | awk -F/ '{print $1}' | sort -u)
expected=$'assets\nconfig\nlayout\nlocales\nsections\nsnippets\ntemplates'
[ "$roots" = "$expected" ] || fail "Structure incorrecte à la racine du ZIP :\n$roots"
ok "assets/ config/ layout/ locales/ sections/ snippets/ templates/ à la racine"

if [ "$zip_bytes" -gt "$MAX_BYTES" ]; then
  fail "ZIP = $(human "$zip_bytes") — au-dessus de la limite Shopify de 50 Mo."
fi
[ "$zip_bytes" -gt "$WARN_BYTES" ] && warn "ZIP = $(human "$zip_bytes"), au-dessus de la cible de 8 Mo."

# ---------------------------------------------------------------------------
# Liquid linting via @shopify/theme-check-node. Runs entirely offline and
# needs no authentication. Install once with:
#   npm install @shopify/theme-check-node
# ---------------------------------------------------------------------------
if [ -f tools/theme-check.mjs ] && node -e "require.resolve('@shopify/theme-check-node')" 2>/dev/null; then
  step "Bonus  theme-check (hors ligne, sans authentification)"
  check_output=$(node tools/theme-check.mjs "$THEME_DIR" 2>/dev/null | grep -v Deprecation)
  echo "$check_output" | grep -q "ERROR: 0" \
    && ok "theme-check : 0 erreur" \
    || { echo "$check_output"; fail "theme-check a signalé des erreurs Liquid."; }
else
  warn "theme-check non installé — 'npm install @shopify/theme-check-node' pour l'activer."
fi

printf '\n%s========================================%s\n' "$BOLD" "$OFF"
printf '%sARCHIVE PRÊTE%s  %s  (%s)\n' "$GREEN" "$OFF" "$ZIP_NAME" "$(human "$zip_bytes")"
printf 'Fichiers : %s\n' "$(unzip -Z1 "$ZIP_NAME" | wc -l)"
printf '%s========================================%s\n' "$BOLD" "$OFF"
printf 'Import : Boutique en ligne → Thèmes → Ajouter un thème → Importer un fichier zip\n'
printf 'Ce script ne se connecte à aucune boutique. Voir SETUP.md pour la suite.\n'
