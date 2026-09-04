#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Acceptance test for import/products_velluno.csv (brief §3-bis).

Checks, in order:
  1. exactly 23 variant rows across 4 handles (3 + 3 + 5 + 12)
  2. headers match Shopify's products_export format exactly, in order
  3. Handle repeated correctly; only the first row of each product carries
     Title, Body (HTML), Vendor, Type, Tags
  4. no empty Variant Price, no duplicate SKU, decimal point not comma
  5. UTF-8 without BOM, accents survive a round trip
  6. product names, handles, options, SKUs and prices match the brief verbatim
Exit code 0 = all green.
"""
import csv
import io
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import build_products_csv as builder  # noqa: E402
import catalog  # noqa: E402

CSV_PATH = pathlib.Path(__file__).resolve().parent.parent / "import" / "products_velluno.csv"

EXPECTED_COUNTS = {
    "fontaine-eau-velluno-7l-inox": 3,
    "filtres-rechange-velluno-source": 3,
    "tapis-gamelle-silicone-velluno": 5,
    "os-a-macher-dentaire-velluno": 12,
}
EXPECTED_TITLES = {
    "fontaine-eau-velluno-7l-inox": "VELLUNO Source 7L — Fontaine à eau en inox pour chien et chat",
    "filtres-rechange-velluno-source": "Filtres de rechange VELLUNO — 4 étages, compatibles Source 7L",
    "tapis-gamelle-silicone-velluno": "VELLUNO Base — Tapis de gamelle en silicone, rebords anti-débordement",
    "os-a-macher-dentaire-velluno": "VELLUNO Chew — Os à mâcher dentaire en caoutchouc pour chien",
}
FIRST_ROW_ONLY = ["Title", "Body (HTML)", "Vendor", "Type", "Tags"]

results = []


def check(label, condition, detail=""):
    results.append((label, bool(condition), detail))


def main():
    raw = CSV_PATH.read_bytes()

    # --- 5a. Encoding -------------------------------------------------------
    check("UTF-8 sans BOM", not raw.startswith(b"\xef\xbb\xbf"),
          "le fichier commence par un BOM" if raw.startswith(b"\xef\xbb\xbf") else "")
    try:
        text = raw.decode("utf-8")
        decoded = True
    except UnicodeDecodeError as exc:
        text, decoded = "", False
        check("Décodage UTF-8", False, str(exc))
    if not decoded:
        return report()
    check("Décodage UTF-8", True)

    rows = list(csv.DictReader(io.StringIO(text)))
    headers = list(csv.reader(io.StringIO(text)).__next__())

    # --- 2. Headers ---------------------------------------------------------
    check("En-têtes conformes au format products_export.csv, dans l'ordre",
          headers == builder.HEADERS,
          f"attendu {len(builder.HEADERS)} colonnes, trouvé {len(headers)}")

    # --- 1. Row counts ------------------------------------------------------
    check("23 lignes de variantes au total", len(rows) == 23, f"trouvé {len(rows)}")
    handles = [r["Handle"] for r in rows]
    check("4 handles distincts", len(set(handles)) == 4, f"trouvé {sorted(set(handles))}")
    for handle, expected in EXPECTED_COUNTS.items():
        got = handles.count(handle)
        check(f"{handle} → {expected} variantes", got == expected, f"trouvé {got}")

    # --- 3. Handle grouping and first-row-only columns ----------------------
    grouped = all(
        handles.index(h) + handles.count(h) == len(handles) - handles[::-1].index(h)
        for h in set(handles)
    )
    check("Lignes d'un même handle contiguës", grouped)

    seen = set()
    first_row_ok, extra_row_ok = True, True
    for row in rows:
        handle = row["Handle"]
        if handle not in seen:
            seen.add(handle)
            if any(not row[col].strip() for col in FIRST_ROW_ONLY):
                first_row_ok = False
        elif any(row[col].strip() for col in FIRST_ROW_ONLY):
            extra_row_ok = False
    check("Première ligne de chaque produit : Title, Body, Vendor, Type, Tags remplis", first_row_ok)
    check("Lignes suivantes : ces colonnes vides", extra_row_ok)

    # --- 4. Prices and SKUs -------------------------------------------------
    check("Aucun Variant Price vide", all(r["Variant Price"].strip() for r in rows))
    bad_decimal = [r["Variant Price"] for r in rows if "," in r["Variant Price"]]
    bad_decimal += [r["Variant Compare At Price"] for r in rows if "," in r["Variant Compare At Price"]]
    check("Décimales avec un point, pas une virgule", not bad_decimal, str(bad_decimal[:3]))
    check("Tous les prix au format 0.00",
          all(re.fullmatch(r"\d+\.\d{2}", r["Variant Price"]) for r in rows))

    skus = [r["Variant SKU"] for r in rows]
    duplicates = {s for s in skus if skus.count(s) > 1}
    check("Aucun SKU en doublon", not duplicates, str(sorted(duplicates)))
    check("Aucun SKU vide", all(s.strip() for s in skus))

    # --- 6. Verbatim match against the brief --------------------------------
    titles = {r["Handle"]: r["Title"] for r in rows if r["Title"].strip()}
    check("Noms de produits identiques au brief", titles == EXPECTED_TITLES,
          str({k: v for k, v in titles.items() if EXPECTED_TITLES.get(k) != v}))

    catalogue_skus = {v["sku"] for p in catalog.PRODUCTS for v in p["variants"]}
    check("SKUs identiques au catalogue de référence", set(skus) == catalogue_skus,
          str(catalogue_skus.symmetric_difference(skus)))

    catalogue_prices = {v["sku"]: v["price"] for p in catalog.PRODUCTS for v in p["variants"]}
    price_mismatch = {r["Variant SKU"]: r["Variant Price"]
                      for r in rows if catalogue_prices[r["Variant SKU"]] != r["Variant Price"]}
    check("Prix identiques au catalogue de référence", not price_mismatch, str(price_mismatch))

    # --- Descriptions -------------------------------------------------------
    empty_body = [r["Handle"] for r in rows if r["Title"].strip() and len(r["Body (HTML)"]) < 800]
    check("Aucune description vide ou tronquée (>800 caractères)", not empty_body, str(empty_body))

    for row in rows:
        if not row["Title"].strip():
            continue
        words = len(re.sub(r"<[^>]+>", " ", row["Body (HTML)"]).split())
        check(f"{row['Handle']} : description de 350 à 600 mots", 350 <= words <= 600, f"{words} mots")

    # --- SEO ----------------------------------------------------------------
    for row in rows:
        if not row["Title"].strip():
            continue
        check(f"{row['Handle']} : SEO Title ≤ 60 caractères",
              len(row["SEO Title"]) <= 60, f"{len(row['SEO Title'])}")
        check(f"{row['Handle']} : SEO Description ≤ 155 caractères",
              len(row["SEO Description"]) <= 155, f"{len(row['SEO Description'])}")
        tag_count = len([t for t in row["Tags"].split(",") if t.strip()])
        check(f"{row['Handle']} : 6 à 10 tags", 6 <= tag_count <= 10, f"{tag_count} tags")

    # --- 5b. Accents survive the round trip ---------------------------------
    accented = [t for t in EXPECTED_TITLES.values() if "à" in t or "â" in t or "é" in t]
    check("Accents préservés après aller-retour",
          all(any(t == r["Title"] for r in rows) for t in accented))

    # --- Constant columns ---------------------------------------------------
    constants = {
        "Vendor": "VELLUNO", "Published": "TRUE", "Status": "active",
        "Variant Inventory Policy": "continue", "Variant Fulfillment Service": "manual",
        "Variant Requires Shipping": "TRUE", "Variant Taxable": "TRUE",
        "Variant Weight Unit": "g", "Gift Card": "FALSE", "Included / France": "TRUE",
    }
    for column, value in constants.items():
        relevant = [r for r in rows if r["Handle"] not in ("",)]
        if column in ("Vendor", "Published", "Status", "Gift Card"):
            relevant = [r for r in rows if r["Title"].strip()]  # first row only
        check(f"{column} = {value} partout",
              all(r[column] == value for r in relevant),
              str({r["Variant SKU"]: r[column] for r in relevant if r[column] != value}))

    check("Variant Inventory Tracker vide (stock non suivi)",
          all(r["Variant Inventory Tracker"] == "" for r in rows))
    check("Image Src vide (URLs à coller après upload, voir images_TODO.md)",
          all(r["Image Src"] == "" for r in rows))
    check("Image Alt Text renseigné en français sur les lignes concernées",
          all(r["Image Alt Text"].strip() for r in rows if r["Image Position"].strip()))

    return report()


def report():
    width = max(len(label) for label, _, _ in results) + 2
    passed = 0
    print("=" * (width + 10))
    print("TEST D'ACCEPTATION — import/products_velluno.csv")
    print("=" * (width + 10))
    for label, ok, detail in results:
        mark = "PASS" if ok else "FAIL"
        passed += ok
        print(f"[{mark}] {label.ljust(width)}{'' if ok else '  → ' + detail}")
    print("-" * (width + 10))
    print(f"{passed}/{len(results)} vérifications passées")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    sys.exit(main())
