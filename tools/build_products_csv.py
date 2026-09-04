#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate import/products_velluno.csv in Shopify's native products_export format.

Rules applied (they are what the Shopify importer expects):
  * one row per variant, Handle repeated on every row;
  * only the FIRST row of a product carries Title, Body (HTML), Vendor, Type,
    Tags, Published, SEO and Google Shopping fields;
  * prices use a decimal POINT, never a comma;
  * Image Src is left empty on purpose — Shopify can only fetch public URLs,
    see import/images_TODO.md — but Image Alt Text is pre-filled in French.
"""
import csv
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import catalog  # noqa: E402

OUT = pathlib.Path(__file__).resolve().parent.parent / "import" / "products_velluno.csv"

HEADERS = [
    "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags",
    "Published", "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value",
    "Option3 Name", "Option3 Value", "Variant SKU", "Variant Grams",
    "Variant Inventory Tracker", "Variant Inventory Qty", "Variant Inventory Policy",
    "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price",
    "Variant Requires Shipping", "Variant Taxable", "Variant Barcode", "Image Src",
    "Image Position", "Image Alt Text", "Gift Card", "SEO Title", "SEO Description",
    "Google Shopping / Google Product Category", "Google Shopping / Gender",
    "Google Shopping / Age Group", "Google Shopping / MPN",
    "Google Shopping / Condition", "Google Shopping / Custom Product",
    "Variant Image", "Variant Weight Unit", "Variant Tax Code", "Cost per item",
    "Included / France", "Price / France", "Compare At Price / France", "Status",
]


def build_rows():
    rows = []
    for product in catalog.PRODUCTS:
        option_names = product["option_names"]
        for index, variant in enumerate(product["variants"]):
            first = index == 0
            row = {header: "" for header in HEADERS}
            row["Handle"] = product["handle"]

            # Product-level columns: first row only.
            if first:
                row["Title"] = product["title"]
                row["Body (HTML)"] = product["body"]
                row["Vendor"] = catalog.VENDOR
                row["Product Category"] = catalog.GOOGLE_CATEGORY
                row["Type"] = product["type"]
                row["Tags"] = ", ".join(product["tags"])
                row["Published"] = "TRUE"
                row["SEO Title"] = product["seo_title"]
                row["SEO Description"] = product["seo_description"]
                row["Google Shopping / Google Product Category"] = catalog.GOOGLE_CATEGORY
                row["Google Shopping / Condition"] = "new"
                row["Google Shopping / Custom Product"] = "FALSE"
                row["Gift Card"] = "FALSE"
                row["Status"] = "active"

            # Option names repeat on every row; Shopify tolerates it and it makes
            # the file readable in a spreadsheet.
            for position, name in enumerate(option_names, start=1):
                row[f"Option{position} Name"] = name
                row[f"Option{position} Value"] = variant["options"][position - 1]

            row["Variant SKU"] = variant["sku"]
            row["Variant Grams"] = str(variant["grams"])
            row["Variant Inventory Tracker"] = ""          # untracked → always purchasable
            row["Variant Inventory Qty"] = ""
            row["Variant Inventory Policy"] = "continue"
            row["Variant Fulfillment Service"] = "manual"
            row["Variant Price"] = variant["price"]
            row["Variant Compare At Price"] = variant["compare"]
            row["Variant Requires Shipping"] = "TRUE"
            row["Variant Taxable"] = "TRUE"
            row["Variant Weight Unit"] = "g"
            row["Included / France"] = "TRUE"

            # Alt text for the images that will be attached at position 1..n.
            images = product["images"]
            if index < len(images):
                row["Image Position"] = str(index + 1)
                row["Image Alt Text"] = images[index]

            rows.append(row)
    return rows


def main():
    rows = build_rows()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    # UTF-8 without BOM, CRLF line endings (what Shopify's exporter produces).
    with OUT.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=HEADERS, quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote {OUT.relative_to(OUT.parent.parent)} — {len(rows)} variant rows, {len(HEADERS)} columns")


if __name__ == "__main__":
    main()
