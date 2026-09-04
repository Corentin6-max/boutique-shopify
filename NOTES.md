# VELLUNO — build notes, decisions and self-review

Working notes for the person who will import this. English by design (the brief
allows it); every customer-facing string in the deliverable is French.

---

## 0. Rule #1 — no store was touched

No Shopify store was contacted at any point. Specifically:

- No Admin API call, no Storefront API call, no GraphQL query.
- No `shopify theme push / dev / publish`, no `shopify app deploy`, no
  `shopify login`. `build.sh` calls `shopify theme check` **only if the CLI is
  already installed locally**, and treats any failure as a skippable warning —
  it never authenticates.
- No product, collection, page, menu, theme, setting, customer or order was
  created, modified or deleted anywhere.
- No credentials were requested or used.

A Shopify MCP connector was available in this session. It was deliberately not
used. Everything here is a local file.

---

## 1. Tagline

Shipped: **« L'essentiel, pensé pour eux. »** (in `settings_data.json`, the
footer, and the password page).

Four alternatives, if you want to test:

| Alternative | Angle |
|---|---|
| **« Ce dont ils ont besoin, rien de plus. »** | Anti-gadget, closest in spirit to the shipped line |
| **« Bien fait, pour longtemps. »** | Durability first — pairs well with the stainless-steel argument |
| **« L'eau fraîche, tous les jours, sans y penser. »** | Product-led, very concrete; strong on paid acquisition, weaker as a brand line |
| **« Le confort simple, au quotidien. »** | The softest; safe if you widen the range beyond hydration |

The shipped line wins because it does two jobs at once: *l'essentiel* signals a
short, curated range, and *pensé pour eux* keeps the animal at the centre
without being cute.

---

## 2. Decisions I made without asking

| # | Question | Decision | Why |
|---|---|---|---|
| 1 | Icon sprite delivery | `snippets/icon-sprite.liquid` inlined once per page; `assets/icons.svg` **generated from it** by `build.sh` | Safari has never supported external file references in `<use href>`. A CDN-hosted sprite renders **nothing** on iOS — unacceptable for a French D2C store. One source of truth, no drift. |
| 2 | Fonts | `font_picker` with `georgia` / `system` as defaults | The brief forbids bundling font files and forbids Google Fonts. Fraunces and Instrument Serif are only available on some Shopify plans — see §6 TODO. Zero font requests today; swap in the customiser when your plan allows. |
| 3 | Schema labels | Literal French, not `t:` keys | The store is French-only. `t:` indirection would add a second file to keep in sync for zero benefit. `fr.default.schema.json` / `en.schema.json` ship for structure and future use. |
| 4 | Customer templates | JSON templates + 7 dedicated sections | The brief asks for `templates/customers/*.json`. `.liquid` would have been shorter but is the older pattern. |
| 5 | Collection import format | Matrixify-shaped `collections.csv` | **Shopify has no native collection CSV import.** The file is therefore (a) an exact copy source for creating the 5 collections by hand — 10 minutes — or (b) directly importable if you install Matrixify. This is stated in `SETUP.md`. |
| 6 | "Reorder" mechanism | A `featured-collection` section titled « Pensez au rechange » + the D+30 email | The brief forbids a paid app. These two pieces cost nothing and cover both moments: decision time and consumption time. |
| 7 | Prices in the CSV | Compare-at prices exactly as briefed | See the Omnibus warning in §5 — **this is the one thing that can get you fined.** |
| 8 | Product images | `Image Src` empty, `Image Alt Text` pre-filled | Shopify's importer only reads public URLs; it cannot see your disk. Full procedure in `import/images_TODO.md`. |
| 9 | Cart | Drawer by default, `/cart` page fully built too | The drawer converts better; the page is the no-JS fallback and the destination for people who type the URL. |
| 10 | Reviews | Functional, empty, no rating in JSON-LD | Non-negotiable, see §5. |
| 11 | Critical CSS | Hand-written block in `theme.liquid`, full sheet preloaded | The brief asks for < 14 KB inlined. The critical block is ~4 KB and duplicates the tokens on purpose — tokens must exist before anything paints. |
| 12 | Delivery date | Computed in JS, business days, 14:00 cut-off | A server-rendered date goes stale in Shopify's page cache. The fallback ("5 to 12 business days") is rendered in Liquid, so the block still says something useful without JS. |

---

## 3. Performance budgets — measured, not estimated

Run `./build.sh` to reproduce these numbers; it fails the build on the CSS
budget and warns on the JS one.

| Budget | Limit | Measured | Verdict |
|---|---|---|---|
| ZIP | < 50 MB (Shopify), target 8 MB | **~107 KB** | ✅ far under |
| CSS | < 90 KB | **57 KB** raw / **12 KB** gzip | ✅ |
| JS | < 30 KB | **29.8 KB** raw / **8.8 KB** gzip | ✅ |
| External requests | 0 | **0** | ✅ no CDN, no Google Fonts, no jQuery |

**On the JS figure.** 29.8 KB is the *commented source*. It fits the budget as
written, but the number that reaches a customer is **8.8 KB gzipped** — Shopify
serves assets compressed. If you ever add to these files, judge yourself on the
gzip number and don't strip comments to make a raw byte count look better.

**Lighthouse.** The targets (mobile ≥ 90, LCP < 2.0 s, CLS < 0.05, SEO 100,
a11y ≥ 95) are **not verified** — they cannot be, without a live store and real
images. What is verified is everything under my control:

- every image box has a reserved aspect ratio (`--ratio` on `.media`), so the
  gallery cannot shift → CLS protection is structural, not hopeful;
- the hero image is `loading="eager" fetchpriority="high"`, everything else is
  lazy;
- zero render-blocking third-party requests;
- one H1 per template, clean heading order, visible focus rings, AA contrast.

Measure it yourself once the images are in — see the checklist in `SETUP.md`.

---

## 4. Accessibility

- Full keyboard support on the variant selector (native radios), the cart
  drawer, the nav drawer and the accordions (`<button aria-expanded>` +
  `aria-controls`).
- Focus is trapped in every panel and **returned to the trigger on close**.
- `aria-live` on add-to-cart; `role="alert"` on error states.
- Product cards: the whole card is clickable, but only the title is in the tab
  order — one stop per product, not three.
- `prefers-reduced-motion` kills every animation, including the announcement
  bar rotation and smooth gallery scrolling.
- Contrast: `--velluno-ink-70` (#55554F) and `--velluno-ink-50` (#6E6E67) were
  chosen to stay AA on `--velluno-bone`. **Re-check with a contrast tool if you
  change the palette in the customiser** — the theme cannot enforce this for you.

---

## 5. Commercial honesty — read this section before launch

### ⚠️ The Omnibus rule on struck-through prices

French law (article L.112-1-1 du Code de la consommation, transposing the EU
Omnibus directive) requires that **a struck-through price be the lowest price
you actually applied over the previous 30 days**.

The catalogue ships with the compare-at prices from the brief (139,90 € on the
fountain, etc.). **As of day one you have never sold at those prices**, so
displaying them as struck-through reference prices is, strictly read, a
misleading commercial practice — enforced by the DGCCRF, with real fines.

Three lawful options:

1. **Remove the compare-at prices at launch.** Empty the
   `Variant Compare At Price` column, sell at the normal price, and introduce
   promotions later against a genuine 30-day history. *This is what I'd do.*
2. **Sell at the higher price for 30 days first**, then discount. The
   compare-at price becomes true.
3. **Relabel them as a recommended retail price** — only if a manufacturer's
   RRP genuinely exists and you can document it. The theme already labels this
   string `products.price.compare_at` = « Prix conseillé ».

The theme supports all three without a code change. **The decision is yours and
I have not made it for you** — the CSV keeps the briefed values.

### What is deliberately absent

- **Zero invented reviews, names, photos or testimonials.** `reviews.liquid`
  ships functional and empty, with a « Soyez le premier à donner votre avis »
  state and an `@app` block ready for Judge.me or Loox.
- **No `aggregateRating` in JSON-LD** unless `reviews.rating_count > 0` — i.e.
  until a real review app writes real data. Faking it is a Google manual-action
  risk on top of being dishonest.
- **No countdown timers, no "14 people are viewing", no "only 3 left".** The
  theme has no code for them.
- **Health claims are hedged everywhere**: « aide à », « encourage »,
  « souvent recommandé par les vétérinaires pour encourager la prise de
  boisson ». Never « soigne », « prévient » or « garantit ». The chew toy
  carries the mandatory safety notice on the product page, in the description,
  and in the section schema default.

### Legal pages

`cgv.md`, `mentions-legales.md`, `politique-de-confidentialite.md` and
`cookies.md` ship with **explicit `[[FIELD TO COMPLETE]]` placeholders** —
65 of them. Nothing was invented: no fake SIRET, no fake address, no fake
mediator.

> **A consumer mediator is a legal obligation** for any professional selling to
> consumers in France (article L.612-1). You must sign up with one *before*
> opening, and fill in `[[NOM DU MÉDIATEUR…]]`. Have a lawyer read the CGV.

---

## 6. TODOs left for you — deliberate, not forgotten

### Blocking (do not open the store without these)

1. **Fill every `[[…]]` placeholder** in the four legal pages. Find them with:
   `grep -rn '\[\[' content/pages/`
2. **Sign up with a consumer mediator** and add them to the CGV and the legal
   notice.
3. **Decide on the compare-at prices** (§5). This is a legal exposure, not a
   design choice.
4. **Configure real shipping rates** in Shopify (Settings → Shipping) so they
   match the theme: free over €39, €4.90 Colissimo, €3.90 pickup point, and a
   free-shipping rate for the fountain. *The theme displays a promise; only
   Shopify can charge it.* A mismatch here is the single most likely source of
   customer complaints.
5. **Only enable "pay in 4 instalments"** (`show_installments`) if PayPal Pay or
   Klarna is genuinely active. It is on by default because the brief specifies
   it — turn it off if the payment method is not live, or you are advertising a
   service you do not offer.

### Important

6. **Provide the images** — 20 product visuals + 7 theme visuals. Full brief in
   `import/images_TODO.md`. Placeholders hold the layout until then, with no
   layout shift on replacement.
7. **Fraunces / Instrument Serif.** The brief asks for an editorial serif. Both
   are in Shopify's font library on eligible plans. Go to *Theme settings →
   Typographie → Titres* and pick one; the fallback (Georgia) is already
   correct and needs no code change.
8. **Install a review app** (Judge.me is free to start) and drop its app block
   into the *Avis clients* section. The `aggregateRating` JSON-LD turns itself
   on when real ratings exist.
9. **Run Lighthouse** on the live theme with real images, mobile preset.
10. **Set the D+30 filter reminder** in your email tool, excluding buyers of
    `VL-SRC-7L-F10` and `VL-SRC-7L-F20` — they are already covered for 6 or
    12 months. Details in `content/emails/06-rappel-filtres-J30.md`.

### Nice to have

11. A blog for SEO (« à quelle fréquence changer l'eau d'un chat », « pourquoi
    mon chat boit dans le lavabo »). No blog template ships — it was not in
    scope. `main-page.liquid` is a fine starting point.
12. A mega-menu. The header renders a flat menu (5 desktop entries). With four
    products it is the right call; revisit at ~20 SKUs.
13. Quantity selector on the product page. Deliberately omitted: for a €99
    fountain it adds a decision without adding revenue. It exists in the cart,
    where it belongs.

---

## 7. The €10,000 self-review

I went back through every screen asking *"would a client paying €10,000 accept
this?"*. What follows is honest, including what I changed and what still falls
short.

### Fixed during the review

| Screen | Problem | Fix |
|---|---|---|
| Product page | The sticky mobile bar fired add-to-cart through an inline `onclick` — fragile, and a global leak | Replaced with `<button form="product-form-…">`, native HTML, works without JS |
| Product page | Colour swatches derived their hex from a nonsense filter chain | New `snippets/swatch-color.liquid`: an explicit French-name → hex map, unknown values fall back to sand rather than rendering black |
| Product page | The variant card looked up its price via `forloop.parentloop.index0` — wrong index on multi-option products, so the chew toy would have priced its cards from the wrong variant | Keyed off `option.position` instead |
| Section titles | `{{ setting \| default: 'key' \| t }}` translated the *literal title* → « Translation missing » as soon as a merchant typed one | Capture the default first, then `| default:` |
| Cart / account | Four `{{ 'key' \| t: arg: x \| filter }}` chains — invalid Liquid, would have thrown at render | Assigned before interpolating; added `cart.remove_short`, `cart.update`, `customer.orders.number_heading` |
| Cart page | The "update cart" button was wired to an *error* string | Real label |
| Icons | External sprite would have rendered nothing on Safari/iOS | Inlined via snippet, asset generated at build |
| JS | 33 KB raw, over the 30 KB budget | Trimmed decorative comment rules, dropped a single-entry `SELECTORS` indirection → 29.8 KB, comments intact |

### Screen-by-screen verdict

- **Homepage** — Passes. Editorial hero with real whitespace, a USP bar that
  states actual terms rather than vague reassurance, an inox argument that
  gives a *reason* ("le plastique se raye, et chaque rayure devient un refuge à
  bactéries") instead of an adjective. Not a Dawn reskin: the grid, the type
  scale and the sand/bone alternation are the theme's own.
- **Hero product page** — The strongest screen, and the one that earns the
  budget. Ten sections, each answering a named objection written in a Liquid
  comment above it. Radio cards show price, per-filter cost and saving without
  a click. The comparison table argues on facts and cites its own method in a
  footnote — that footnote is what separates an honest comparison from a
  strawman.
- **Cart drawer** — Passes. Free-shipping progress that knows the fountain
  always ships free, so it never asks someone to spend more for something they
  already have.
- **Collection / search / 404** — Pass. Every empty state offers a route
  forward. The 404 has a search field, not just a "go home" link.
- **Password page** — Passes. A designed two-panel layout with the store
  password tucked into a `<details>`, out of a customer's way.
- **Legal pages** — Pass *as drafts*. Structurally complete, correctly
  cross-referenced, honest about what only you can fill in.

### Where it still falls short — stated plainly

1. **No real photography.** The single biggest gap between this and a delivered
   €10k build. SVG placeholders hold the layout perfectly, but a fountain page
   lives or dies on its images. This is on the critical path, not a detail.
2. **Lighthouse is unmeasured.** Everything structural is right; the number is
   unverified because it cannot be verified locally. Do not quote "90+" to
   anyone until you have run it.
3. **The bundle recomputes but does not discount.** « Le Pack Source » at
   119,90 € instead of 124,70 € needs a **Shopify automatic discount** — the
   theme cannot create one, and I will not touch your store. `SETUP.md` step 9
   has the exact clicks. Until then the bundle adds all three items at full
   price, which is honest but leaves the advertised saving unimplemented.
4. **No blog.** Out of scope, and a real SEO gap for this category.
5. **The predictive-search skeleton** shows three placeholder rows regardless of
   how many results return. Correct, cheap, and slightly less polished than a
   count-aware skeleton.
6. ~~`theme check` was not run.~~ **Resolved.** `@shopify/theme-check-node`
   runs offline inside `build.sh` with no authentication. It found four real
   Liquid syntax errors that had made the first archive unusable — see §7-bis.
   Current state: 0 errors, 0 warnings.

---

## 7-bis. The first archive was rejected by Shopify — what was wrong

The client reported the theme would not import. It was two separate faults,
both mine, and both now covered by a gate in `build.sh`.

**1. Four required templates were missing.** Shopify refuses a theme upload
outright when any of its nineteen required templates is absent. I had shipped
fifteen. Missing: `article`, `blog`, `list-collections`, `gift_card` — none of
which the brief mentioned, because they are Shopify's requirement, not the
client's. Now written, in the theme's own style, and `build.sh` step 4 fails
the build if any of the nineteen goes missing again.

**2. Four Liquid syntax errors.** I had written nested output tags to hand a
placeholder to JavaScript:

```liquid
data-template="{{ 'products.price.installment_html' | t: amount: '{{ amount }}' | escape }}"
```

`{{ … }}` inside `{{ … }}` is a parse error. It appeared in `price.liquid`,
`shipping-estimate.liquid` and twice in `product-bundle.liquid`. Fixed by
assigning a plain token (`%%amount%%`, `%%from%%`, `%%to%%`, `%%count%%`) and
substituting it client-side; the JS was updated to match.

**Why my own checks missed both.** `build.sh` validated every `{% schema %}`
block as JSON and cross-checked every translation key, but it never parsed
Liquid itself, and it never checked which templates Shopify requires. Both
were in NOTES.md §7 as a known gap — "theme check was not run" — which is
exactly the gap that bit. A documented gap is still a gap.

**What changed so it cannot recur.** `@shopify/theme-check-node` is now a dev
dependency and runs inside `build.sh`; it is the real Shopify linter, works
entirely offline and needs no authentication, so Rule #1 is untouched. The
build now fails on any Liquid error. Current state: **0 errors, 0 warnings**.

```bash
npm install          # once
./build.sh           # includes theme-check + the required-template gate
```

## 8. How to verify what I claim

```bash
npm install                         # once — installs theme-check
./build.sh                          # full gate: Liquid lint, required templates,
                                    # JSON, i18n, externals, budgets, ZIP
python3 tools/test_products_csv.py  # 51 checks on the catalogue CSV
python3 tools/check_translations.py # every Liquid key exists in fr.default.json
grep -rn '\[\[' content/pages/      # the placeholders you must fill (65)
unzip -l velluno-theme.zip | head   # archive structure
```

`tools/catalog.py` is the single source of truth for the catalogue. Change a
price there, re-run `build_products_csv.py`, re-run the test. Never hand-edit
the CSV except to paste image URLs.
