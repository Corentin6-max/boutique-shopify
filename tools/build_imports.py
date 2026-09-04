#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate import/collections.csv and import/redirects.csv."""
import csv
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import catalog  # noqa: E402

IMPORT_DIR = pathlib.Path(__file__).resolve().parent.parent / "import"

# Shopify has NO native collection CSV import (see SETUP.md). This file follows
# the Matrixify "Collections" sheet layout, which is the format every import app
# understands — and it doubles as the copy source for creating them by hand.
COLLECTION_HEADERS = [
    "Handle", "Title", "Body HTML", "Sort Order", "Published", "Published Scope",
    "Template Suffix", "Collection Type", "Product Handles",
    "Metafield: title_tag [string]", "Metafield: description_tag [string]",
]

REDIRECTS = [
    # Handles a French shopper is likely to type or that ad copy may point at.
    ("/products/fontaine", "/products/fontaine-eau-velluno-7l-inox"),
    ("/products/fontaine-a-eau", "/products/fontaine-eau-velluno-7l-inox"),
    ("/products/fontaine-7l", "/products/fontaine-eau-velluno-7l-inox"),
    ("/products/source-7l", "/products/fontaine-eau-velluno-7l-inox"),
    ("/products/filtres", "/products/filtres-rechange-velluno-source"),
    ("/products/filtre", "/products/filtres-rechange-velluno-source"),
    ("/products/tapis", "/products/tapis-gamelle-silicone-velluno"),
    ("/products/tapis-gamelle", "/products/tapis-gamelle-silicone-velluno"),
    ("/products/os-a-macher", "/products/os-a-macher-dentaire-velluno"),
    ("/products/chew", "/products/os-a-macher-dentaire-velluno"),
    ("/collections/fontaines", "/collections/hydratation"),
    ("/collections/filtres", "/collections/rechanges"),
    ("/collections/all", "/collections/best-sellers"),
    ("/collections/tous-les-produits", "/collections/best-sellers"),
    # Legal / service pages, in the wordings customers and mail clients use.
    ("/pages/livraison-et-suivi", "/pages/livraison"),
    ("/pages/shipping", "/pages/livraison"),
    ("/pages/retours", "/pages/retours-et-remboursements"),
    ("/pages/returns", "/pages/retours-et-remboursements"),
    ("/pages/faq-livraison", "/pages/faq"),
    ("/pages/about", "/pages/a-propos"),
    ("/pages/qui-sommes-nous", "/pages/a-propos"),
    ("/pages/cgv-cgu", "/pages/cgv"),
    ("/pages/conditions-generales", "/pages/cgv"),
    ("/pages/mentions-legales-velluno", "/pages/mentions-legales"),
    ("/pages/confidentialite", "/pages/politique-de-confidentialite"),
    ("/pages/privacy", "/pages/politique-de-confidentialite"),
    ("/pages/cookie", "/pages/cookies"),
    ("/pages/nous-contacter", "/pages/contact"),
    ("/pages/support", "/pages/contact"),
]


def main():
    IMPORT_DIR.mkdir(parents=True, exist_ok=True)

    collections_path = IMPORT_DIR / "collections.csv"
    with collections_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=COLLECTION_HEADERS)
        writer.writeheader()
        for collection in catalog.COLLECTIONS:
            writer.writerow({
                "Handle": collection["handle"],
                "Title": collection["title"],
                "Body HTML": collection["description"],
                "Sort Order": "manual",
                "Published": "TRUE",
                "Published Scope": "web",
                "Template Suffix": "",
                "Collection Type": "Custom",       # manual, per the brief
                "Product Handles": ";".join(collection["products"]),
                "Metafield: title_tag [string]": collection["seo_title"],
                "Metafield: description_tag [string]": collection["seo_description"],
            })
    print(f"Wrote import/collections.csv — {len(catalog.COLLECTIONS)} collections")

    redirects_path = IMPORT_DIR / "redirects.csv"
    with redirects_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["Redirect from", "Redirect to"])   # Shopify's native format
        writer.writerows(REDIRECTS)
    print(f"Wrote import/redirects.csv — {len(REDIRECTS)} redirections")

    # Sanity: every redirect target must be a real handle or a page we ship.
    known = {f"/products/{p['handle']}" for p in catalog.PRODUCTS}
    known |= {f"/collections/{c['handle']}" for c in catalog.COLLECTIONS}
    known |= {
        "/pages/livraison", "/pages/retours-et-remboursements", "/pages/faq",
        "/pages/a-propos", "/pages/cgv", "/pages/mentions-legales",
        "/pages/politique-de-confidentialite", "/pages/cookies", "/pages/contact",
    }
    unknown = sorted({to for _, to in REDIRECTS if to not in known})
    print("Cibles inconnues :", unknown or "aucune")
    sources = [src for src, _ in REDIRECTS]
    dupes = sorted({s for s in sources if sources.count(s) > 1})
    print("Sources en doublon :", dupes or "aucune")
    return 1 if unknown or dupes else 0


if __name__ == "__main__":
    sys.exit(main())
