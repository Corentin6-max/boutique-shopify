#!/usr/bin/env python3
"""Cross-check every translation key used in Liquid against locales/fr.default.json.

Fails (exit 1) if a template references a key the default locale does not define.
Also reports keys defined but never used, as a hint — that is a warning, not a failure.
"""
import json
import pathlib
import re
import sys

THEME = pathlib.Path(__file__).resolve().parent.parent / "velluno-theme"
LOCALE = THEME / "locales" / "fr.default.json"

# {{ 'some.key' | t }} / {{ "some.key" | t: arg: x }} / {%- assign x = 'k' | t -%}
KEY_RE = re.compile(r"""['"]([a-z0-9_]+(?:\.[a-z0-9_]+)+)['"]\s*\|\s*t\b""")


def flatten(node, prefix=""):
    out = set()
    for key, value in node.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            # A pluralisation group ({one, other}) is a leaf, not a namespace.
            if value.keys() <= {"one", "other", "zero", "two", "few", "many"}:
                out.add(path)
            else:
                out |= flatten(value, path)
        else:
            out.add(path)
    return out


def main():
    defined = flatten(json.loads(LOCALE.read_text(encoding="utf-8")))

    used = {}
    for path in sorted(THEME.rglob("*.liquid")):
        for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            for key in KEY_RE.findall(line):
                used.setdefault(key, []).append(f"{path.relative_to(THEME)}:{line_no}")

    missing = {k: v for k, v in used.items() if k not in defined}
    unused = sorted(defined - set(used))

    print(f"Keys defined in fr.default.json : {len(defined)}")
    print(f"Keys referenced in Liquid       : {len(used)}")

    if missing:
        print(f"\nMISSING ({len(missing)}) — referenced in Liquid, absent from the locale:")
        for key, locations in sorted(missing.items()):
            print(f"  {key}\n      {locations[0]}")
    else:
        print("\nMISSING: none — every key used in Liquid exists in fr.default.json.")

    if unused:
        print(f"\nDefined but unused in Liquid ({len(unused)}) — expected for e-mail/CSV copy:")
        print("  " + ", ".join(unused))

    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
