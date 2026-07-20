# Fence Material Pricing Database

**Status:** implementation specification and starter market snapshot  
**Snapshot date:** 2026-07-19  
**Scope:** North American fence materials, materials-only planning estimates  
**Currencies:** USD and CAD are stored and reported separately

## 1. Product decision

Fence Planner should not store one national "price per foot." It should store dated, location-specific product observations and calculate a low / typical / high material total from the exact shopping-list quantities.

The estimator should be described as:

> Indicative materials estimate, not a retailer quote. Prices vary by store, region, species, grade, treatment, package size, promotion, delivery method, and availability. Tax, delivery, tool rental, removal, labor, permits, and site work are excluded unless the user adds them.

This design fits the existing calculator because it already produces separate material lines for posts, panels, boards, rails, concrete, chain-link fabric, top rail, fittings, gate hardware, trim, and fasteners.

The starter seed now gives every current calculator material line either a Canadian observation, a Canadian substitute, or an explicitly labeled converted / allowance fallback. The pricing interface therefore does not need to show a blank cost merely because an exact local SKU is unavailable.

## 2. Why one price is not enough

A price only makes sense when all of the following are known:

- exact product specification;
- package size and sale unit;
- currency;
- country and store market;
- retailer and store;
- regular, sale, or bulk tier;
- stock status;
- observation date;
- source URL;
- whether tax and delivery are included.

For example, a nominal 4x4x8 pressure-treated post can be southern yellow pine in one U.S. market, hem-fir in another, and brown-treated SPF in Canada. Those are useful substitutes for the same calculator line, but they are not identical products and should not be silently pooled as though they were.

## 3. Recommended database model

Use five logical tables. They can begin as local JSON and later move unchanged in concept to SQLite, Postgres, or another database.

### 3.1 `material_specs`

One record for each canonical item the calculator knows how to price.

| Field | Purpose |
|---|---|
| `id` | Stable pricing key, such as `wood.post.pt.4x4.8.ground` |
| `calculator_line_ids` | Existing result line IDs that can use the item, such as `posts_buy` |
| `category` | Post, rail, picket, panel, concrete, fastener, gate hardware, fabric, fitting, or accessory |
| `fence_system` | Wood, panel, chain-link, or shared |
| `name` | Plain-language item name |
| `nominal_size` | Retail wording, such as `4x4 x 8 ft` |
| `actual_dimensions` | Actual dimensions where relevant |
| `length_ft` / `height_ft` | Searchable dimensions rather than text only |
| `material` | PT pine, cedar, galvanized steel, concrete mix, and so on |
| `species` | Species or species group when known |
| `grade` | Lumber grade or wire gauge |
| `treatment` | Ground-contact, above-ground, untreated, or not applicable |
| `coating` | Galvanized, black vinyl-coated, polymer-coated, stainless, and so on |
| `base_unit` | Each, bag, box, roll, kit, or panel |
| `coverage_or_yield` | Concrete cubic-foot yield, roll length, or package count |
| `substitution_group` | Broader group allowed only for approximate regional bands |

The canonical match must include the characteristics that materially change price. Do not combine cedar with treated pine, 4x4x8 with 4x4x10, basic privacy panels with lattice-top panels, or 11.5-gauge fabric with 9-gauge fabric.

### 3.2 `retailer_products`

This maps a retailer SKU to one canonical material specification.

| Field | Purpose |
|---|---|
| `id` | Internal product identifier |
| `material_spec_id` | Canonical material being sold |
| `retailer` | Retailer name |
| `retailer_sku` / `model` | Store SKU, article number, or model |
| `title` | Retailer product title as observed |
| `product_url` | Direct product or category URL |
| `package_quantity` | Pieces in the priced package |
| `package_unit` | Each, bag, box, roll, or kit |
| `active` | Whether the product should still be sampled |

### 3.3 `price_observations`

Never overwrite an old price. Append a new observation so the project can report freshness and eventually show price trends.

| Field | Purpose |
|---|---|
| `product_id` | Retail product observed |
| `observed_at` | ISO date and time |
| `country` / `region` | Market geography |
| `postal_code` / `store_id` | Store selector used for the price |
| `currency` | `USD` or `CAD` |
| `regular_price` | Current regular package price |
| `sale_price` | Active promotional price, if any |
| `bulk_price` | Per-package bulk price, if shown |
| `bulk_min_quantity` | Quantity needed for bulk price |
| `normalized_unit_price` | Package price divided by package count or coverage |
| `stock_status` | In stock, out of stock, orderable, unavailable, or unknown |
| `tax_included` | Normally false for these listings |
| `delivery_included` | Normally false |
| `source_url` | Evidence for the observation |
| `collection_method` | Manual, retailer feed, or approved crawler |
| `confidence` | High, medium, or low |

### 3.4 `price_bands`

This is a cache of calculated results, not the source of truth.

| Field | Purpose |
|---|---|
| `material_spec_id` | Exact specification being summarized |
| `country` / `region` | Area represented |
| `currency` | Never mix or silently convert currencies |
| `as_of` | Calculation date |
| `low` / `typical` / `high` | Observed price band |
| `sample_count` / `source_count` | Evidence behind the band |
| `method` | P20 / median / P80, min / median / max, or single-source reference |
| `freshness` | Fresh, indicative, or stale |

### 3.5 `project_price_overrides`

Users should always be able to replace a suggested price with a local quote or the shelf price they found.

Store the project ID, material-line ID, selected pricing key, user unit price, currency, package quantity, source note, and update date. A user override should take precedence over every suggested band.

## 4. Price collection procedure

### Initial market coverage

For a useful North American baseline, sample at least two stores in each broad region:

- United States: Northeast, South, Midwest, Mountain, and Pacific;
- Canada: Atlantic, Quebec, Ontario, Prairies, and British Columbia.

Use two or three retailers per region where possible. A practical starting set is Home Depot and Lowe's in the U.S.; Home Depot Canada, RONA, and a regional building supplier in Canada. Local lumberyards are especially important for cedar.

### Collection checklist

1. Set the retailer site to an explicit store or postal / ZIP code.
2. Search by exact material specification, not only by product name.
3. Record the package price and package quantity.
4. Record regular, sale, and bulk prices separately.
5. Record stock status. Do not use an unavailable product as the market's typical price.
6. Save the source URL and observation time.
7. Normalize the price, but preserve the original package price.
8. Recheck obvious outliers before accepting them.

Refresh high-impact materials—posts, rails, boards, panels, concrete, and chain-link fabric—monthly during the building season and at least quarterly otherwise. Hardware and accessories can be refreshed quarterly.

### Freshness labels

- **Fresh:** 0–30 days old.
- **Indicative:** 31–90 days old.
- **Stale:** more than 90 days old; do not use silently.

## 5. Band calculation

Only eligible observations should enter a band:

- exact material-spec match;
- same currency and geographic scope;
- currently available or orderable;
- not stale;
- not an obvious data or package-size error.

Recommended calculation:

- five or more observations: low = 20th percentile, typical = median, high = 80th percentile;
- two to four observations: low = minimum, typical = median, high = maximum;
- one observation: show **single-store reference**, not a market range;
- no exact local observation: use the fallback hierarchy below so the estimate is not blank, while still allowing the user to replace it.

Bulk price can be used only when the project quantity reaches the published minimum. A promotional price can be displayed, but the regular price is the safer default for a future project.

For a broader substitution group, such as any regionally normal 4x4x8 ground-contact post, label the result **approximate substitute band**. Never present it as an exact-product band.

### Never-blank fallback hierarchy

The application should choose the first available value in this order:

1. user-entered local price;
2. current exact Canadian product observation;
3. current Canadian substitute with the dimensional or gauge difference shown;
4. current Canadian catalog price even when the product is not presently stocked online;
5. current U.S. regular price converted to CAD;
6. category allowance with low confidence.

For the 2026-07-19 snapshot, the most recent Bank of Canada business-day rate was **1 USD = 1.4014 CAD** on 2026-07-17. A converted fallback is calculated as:

```text
converted CAD reference = U.S. regular price × 1.4014
fallback low             = converted reference × 0.90
fallback high            = converted reference × 1.20
```

The 0.90–1.20 multipliers are uncertainty allowances, not exchange-rate forecasts. Every converted result must carry `source_type = converted_us_reference`, the rate date, and a low-confidence label. It must be replaced automatically when a Canadian observation becomes available.

Currency conversion is useful as a last resort, but the observed comparisons show why it should not outrank a Canadian listing:

| Material | U.S. price converted at 1.4014 | Observed Canadian example |
|---|---:|---:|
| PT 4x4x8 post | about CAD $14.69 | CAD $9.20–$16.25 |
| PT 4x4x10 post | about CAD $22.40 | CAD $11.53 |
| PT 6x6x8 post | about CAD $48.60 | CAD $25.97 |
| Standard gate-kit family | about CAD $24.20–$58.83 | CAD $21.98–$49.97 |

The conversion gives a usable placeholder, but Canadian lumber can be lower as well as higher than the converted U.S. listing.

## 6. Project cost calculation

For an item sold individually:

```text
line cost = required quantity × unit price
```

For an item sold in packages:

```text
packages to buy = ceiling(required quantity ÷ pieces per package)
line cost = packages to buy × package price
```

For every project, run the calculation three times using low, typical, and high prices. Add these items after the material subtotal so the user can see what changed the total:

- sales tax;
- delivery;
- tool rental;
- removal and disposal;
- user-selected contingency;
- labor, only when explicitly enabled.

Do not apply waste twice. Fence Planner already applies its selected waste rules to material quantities; the price layer should multiply the final buy quantities.

Concrete must be priced by the selected bag SKU and its printed yield. Weight alone is not enough. The project already calculates required volume and bags; the pricing layer should match that bag size and yield exactly.

## 7. Starter retail snapshot

These are example observations, not national averages. They demonstrate the range the database must represent. Prices were checked on 2026-07-19 and exclude tax and delivery.

### United States — USD

| Material | Observed reference price | Useful normalized value |
|---|---:|---:|
| PT ground-contact 4x4x8 post | $10.48 regular; $9.43 bulk | per post |
| PT ground-contact 4x4x10 post | $15.98 regular; $14.38 bulk | per post |
| PT ground-contact 6x6x8 post | $34.68 regular; $31.21 bulk | per post |
| PT 2x4x8 rail / stringer | $4.58–$4.78 regular; $4.12–$4.30 bulk | per rail |
| PT pine 1x6x6-class dog-ear picket | $2.18 regular; $1.96 bulk | per picket |
| Cedar 1x6x6-class picket | about $3.48–$3.98 | per picket |
| Basic PT 6x8 privacy panel | about $72.98–$74.98 | $9.12–$9.37 per panel foot |
| PT specialty 6x8 panel | about $79.98–$130 | board-on-board, shadowbox, horizontal, or lattice-top variants |
| QUIKRETE 80 lb concrete mix | $6.47 | about $10.78 per yielded ft³ at 0.60 ft³/bag |
| 2 in exterior screws, 5 lb / approximately 207 | $32.97 | about $0.159 each |
| Standard gate hardware kits | about $17.27–$41.98 | per kit; contents vary |
| Galvanized 11.5 ga chain-link fabric, 4 ft x 50 ft | $119 | $2.38 per linear ft |
| Galvanized 11.5 ga chain-link fabric, 5 ft x 50 ft | $134 | $2.68 per linear ft |
| Galvanized 11.5 ga chain-link fabric, 6 ft x 50 ft | $149 | $2.98 per linear ft |
| Galvanized 1-3/8 in x 10 ft top rail, 17 ga | $24.97 regular; $22.47 bulk | $2.50 or $2.25 per linear ft |
| 1-7/8 in x 6 ft chain-link line posts, 5-pack | $110.44 | about $22.09 each |

Localized Lowe's category listings also showed the same broad 4x4 post family beginning around $10.48 in Houston and $11.28 in Indianapolis, while a hem-fir example in Anaheim began around $17.68. That difference should be modeled as region/species variation, not averaged away.

### Canada — CAD

#### Lumber, panels, and concrete

| Material | Home Depot Canada reference | Other Canadian reference / note |
|---|---:|---|
| PT ground-contact 4x4x8 post | $9.20; 10% bulk discount at 78 | RONA example $16.25 |
| PT ground-contact 4x4x10 post | $11.53; $10.38 at 78+ | exact Canadian catalog example |
| PT ground-contact 4x4x12 post | $14.26; $12.83 at 78+ | exact Canadian catalog example |
| PT ground-contact 6x6x8 post | $25.97; $23.37 at 32+ | exact Canadian catalog example |
| PT ground-contact 6x6x10 post | $33.20; $29.88 at 32+ | exact Canadian catalog example |
| PT ground-contact 6x6x12 post | $39.34; $35.41 at 32+ | exact Canadian catalog example |
| PT 2x4x8 rail | $11.20 | RONA example $6.98 |
| PT 2x6x8 cap / kickboard | $17.21 | per board |
| PT 1x4x8 trim | $2.88 | per board |
| PT 2x2x8 batten proxy | $6.87 | conservative proxy for 1x2 / 1x3 stock |
| PT 1x6x6 fence board | $2.68 | RONA example $3.98 |
| Cedar 1x6x6 fence board | about $4.77–$5.68 | profile and grade vary |
| PT 4x8 lattice sheet | $19.20 | confirm opening/profile |
| Galvanized welded wire, 6 ft x 50 ft, 14 ga | $108 | $2.16 per linear ft of roll |
| PT 6x8 privacy panel | about $129 | single-store reference |
| Cedar 6x8 panels | about $88.03–$228 | contractor, solid, and lattice-top products differ |
| QUIKRETE Fence N' Post 30 kg | $11.76 | also $11.76 at RONA; verify printed yield |
| General 30 kg concrete mixes | — | about $6.98–$15.00 at RONA depending on formula |

#### Wood-fence hardware and fasteners

| Material | Canadian example price | Package / interpretation |
|---|---:|---|
| 2 in exterior deck screws | ~$36 / 500-ct (DIY); ~$95 / 2500-ct (contractor) | Estimate uses 500-ct buy unit; band includes bulk $/piece |
| 2-1/2 in exterior deck screws | ~$52.98 / 850-ct | PaulinPRO-class exterior pack |
| 3 in exterior deck screws | ~$52.98 / 1000-ct | Estimate uses 1000-ct buy unit |
| 1-1/4 in galvanized fencing staples | $12.98 / pack | ~80 ct pack — estimate buys whole packs |
| Universal fence-panel brackets | $18.69 / pack | 3-pack — estimate buys whole packs |
| Traditional hinge-and-latch gate kit | $21.98 | basic 3-piece kit |
| All-in-one 90 lb gate kit | $23.28 | 4-piece kit |
| Self-latching deluxe gate kit | $29.38 | 5-piece kit |
| Self-closing gate kit | $39.68 | 3-piece kit |
| Heavy-duty gate bracket kit | $49.97 | gate-frame bracing kit |
| Standard 36 in drop rod | $25.94 | per rod |
| Basic 4x4 post cap | $5.99 | verify actual inside dimensions |
| Wall / structure bracket proxy | $15.39 | 3-pack, $5.13 per bracket |

#### Chain-link materials and hardware

| Material | Canadian example price | Package / interpretation |
|---|---:|---|
| Galvanized fabric, 4 ft x 50 ft | $148 | $2.96 per linear ft |
| Galvanized fabric, 5 ft x 50 ft | $178 | $3.56 per linear ft |
| Galvanized fabric, 6 ft x 50 ft, 12.5 ga substitute | $371.07 | Canadian supplier example; not an exact 11.5 ga match |
| Black top rail, about 1-3/8 in x 10-1/3 ft | $23.75 | about $2.30 per linear ft |
| Black line post, 1-1/2 in x 7-1/2 ft | $17.48 | per post |
| Black main / terminal post, 1-7/8 in x 7-1/2 ft | $21.98 | per post |
| Black fence ties | $8.70 | 50-pack, $0.174 each |
| 46 in tension bar | $2.98 | one 4 ft fence bar |
| 58 in tension bar | $4.60 | one 5 ft fence bar |
| 1-7/8 in tension / brace-band allowance | $0.98 | approximate band substitute |
| Rail-end assembly kit | $2.35 | band and rail cap |
| 100 ft bottom bracing wire | $6.98 | about $0.070 per linear ft |
| Galvanized chain-link gate hardware kit | $24.98 | 2 hinges, fork latch, fasteners |

Some lumber and chain-link components show a catalog price while also showing no online or local stock for the unresolved store. They remain useful reference prices, but the database records that status and gives them less weight than an in-stock observation.

## 8. Worked materials-only budgeting example

For a long, straight 6 ft site-built pressure-treated privacy fence with approximately one 8 ft bay, use this purchasing model:

- one amortized 4x4x8 post per bay, plus the final end post at project level;
- three 2x4x8 backer rails;
- approximately eighteen 1x6x6-class boards for a solid face;
- three 80 lb U.S. bags or three selected Canadian post-mix bags in this illustration only;
- an allocated share of exterior screws;
- waste added by the calculator's material rules.

Using the snapshot above gives an illustrative long-run material allowance of roughly **USD $13–$15 per linear foot** or **CAD $17–$24 per linear foot**, before gates, tax, delivery, rental, removal, labor, difficult soil, slope work, or code-driven changes. This is a worked database example—not a national installed-price claim. Different post holes can change the concrete count substantially.

For a basic preassembled panel system, the panel + one amortized post + three to four concrete bags is roughly **USD $13–$14 per linear foot before brackets and screws**, or **CAD $22–$24 per linear foot before brackets and screws**, using the same observed products.

## 9. Recommended user interface

Each shopping-list row should show:

- required quantity and retail package quantity;
- low / typical / high unit price;
- calculated line range;
- currency and selected location;
- source count and last-updated date;
- an editable unit-price field;
- a short warning when the match is approximate, unavailable, or stale.

The summary should show:

```text
Materials subtotal       low / typical / high
Waste                    already included in quantities
Delivery                 user entered
Tax                      user entered or local setting
Tools / disposal         user entered
Contingency              optional
Labor                    off by default
Estimated project total  low / typical / high
```

## 10. Source pages for the starter snapshot

- [Home Depot U.S. wood fence posts](https://www.homedepot.com/b/Lumber-Composites-Fencing-Gates-Wood-Fencing-Wood-Fence-Posts/N-5yc1vZc3mj)
- [Home Depot U.S. pressure-treated 2x4 lumber](https://www.homedepot.com/b/Lumber-Composites-Pressure-Treated-Lumber/Pressure-Treated/2-in-x-4-in/N-5yc1vZc3srZ1z0n5miZ1z1c7kp)
- [Home Depot U.S. wood fence pickets](https://www.homedepot.com/b/Lumber-Composites-Fencing-Gates-Wood-Fencing-Wood-Fence-Pickets/N-5yc1vZc3mo)
- [Home Depot U.S. wood fence panels](https://www.homedepot.com/b/Lumber-Composites-Fencing-Gates-Wood-Fencing-Wood-Fence-Panels/Pressure-Treated/6-ft/8-ft/N-5yc1vZc3pkZ1z0n5miZ1z1u8gwZ1z1u9hw)
- [Home Depot U.S. 80 lb concrete mix](https://www.homedepot.com/p/100318511)
- [Home Depot U.S. 2 in exterior screws](https://www.homedepot.com/b/Hardware-Fasteners-Screws-Deck-Screws/Exterior/2-in/N-5yc1vZc9n0Z1z0sg14Z1z17e31)
- [Home Depot U.S. gate kits](https://www.homedepot.com/b/Hardware-Gate-Hardware-Gate-Kits/N-5yc1vZc2bb)
- [Home Depot U.S. chain-link fabric](https://www.homedepot.com/b/Lumber-Composites-Fencing-Gates-Chain-Link-Fencing-Chain-Link-Fence-Fabric/N-5yc1vZc3n3)
- [Home Depot U.S. chain-link top rail](https://www.homedepot.com/p/312373065)
- [Lowe's Houston pressure-treated lumber market](https://www.lowes.com/pl/lumber-composites/pressure-treated-lumber/4013895981?city=Houston&inStock=1&rollUpVariants=0&state=TX&storeId=0681)
- [Lowe's Indianapolis pressure-treated lumber market](https://www.lowes.com/pl/lumber-composites/pressure-treated-lumber/4013895981?city=Indianapolis&inStock=1&rollUpVariants=0&state=IN&storeId=0275)
- [Lowe's Anaheim pressure-treated lumber market](https://www.lowes.com/pl/lumber-composites/pressure-treated-lumber/4013895981?city=Anaheim&inStock=1&rollUpVariants=0&state=CA&storeId=1030)
- [Home Depot Canada pressure-treated lumber catalog](https://www.homedepot.ca/s/en/home/categories/building-materials/lumber-and-composites/pressure-treated-fence-board)
- [Home Depot Canada 4x4 pressure-treated posts](https://www.homedepot.ca/en/home/categories/building-materials/lumber-and-composites/pressure-treated-lumber/f/4-x-4/r88-nq4)
- [Home Depot Canada 4x4x10 ground-contact post](https://www.homedepot.ca/product/pressure-treated-4-x-4-x-10-premium-wood-post-suitable-for-ground-contact-/1000790080)
- [Home Depot Canada 6x6 pressure-treated posts](https://www.homedepot.ca/s/en/home/categories/building-materials/lumber-and-composites/6-by-6-treated)
- [Home Depot Canada wood fence pickets](https://www.homedepot.ca/en/home/categories/building-materials/fencing-and-gates/wood-fencing/wood-fence-pickets.html)
- [Home Depot Canada fence boards and panels](https://www.homedepot.ca/en/home/categories/all/collections/deck-and-fence/fence-boards.html)
- [Home Depot Canada Fence N' Post concrete](https://www.homedepot.ca/s/en/home/categories/building-materials/lumber-and-composites/fence-n-post)
- [Home Depot Canada gate kits](https://www.homedepot.ca/en/home/categories/building-materials/hardware/gate-hardware/gate-kits.html)
- [Home Depot Canada fence-panel brackets](https://www.homedepot.ca/s/en/home/categories/building-materials/decking/nuvo-iron-brackets)
- [Home Depot Canada 2 in exterior screws](https://www.homedepot.ca/product/starborn-8-2-inch-micropro-sienna-exterior-deck-screws-5lb-pack-630pcs/1001830574)
- [Home Depot Canada 2-1/2 in exterior screws](https://www.homedepot.ca/product/starborn-9-2-1-2-inch-micropro-sienna-exterior-deck-screws-5lb-pack-430pcs/1001830575)
- [Home Depot Canada 3 in exterior screws](https://www.homedepot.ca/product/starborn-9-3-inch-micropro-sienna-exterior-deck-screws-5lb-pack-370pcs/1001830576)
- [Home Depot Canada standard gate drop rod](https://www.homedepot.ca/product/barrette-outdoor-living-36-standard-fence-gate-drop-rod-black/1001848072)
- [Home Depot Canada chain-link fabric](https://www.homedepot.ca/en/home/categories/building-materials/fencing-and-gates/chain-link-fencing/chain-link-fence-fabric/f/peak-chain-link-fencing/chb-3sk5)
- [Home Depot Canada chain-link parts and hardware](https://www.homedepot.ca/s/en/home/categories/building-materials/fencing-and-gates/chain-link-fence-tension-bands)
- [ALEKO Canada 6x50 chain-link fabric](https://www.alekoproducts.ca/product-p/clf125g6x50-ac.htm)
- [Bank of Canada daily exchange rates](https://www.bankofcanada.ca/rates/exchange/daily-exchange-rates/)
- [RONA pressure-treated lumber](https://www.rona.ca/en/building-supplies/lumber-and-composites/pressure-treated-lumber)
- [RONA 4x4x8 treated post](https://www.rona.ca/en/product/4-in-x-4-in-x-8-ft-brown-pressure-treated-wood-761-62880-84895043)
- [RONA 2x4x8 treated lumber](https://www.rona.ca/en/product/2-in-x-4-in-x-8-ft-brown-pressure-treated-wood-761-62389-84895021)
- [RONA concrete mixes](https://www.rona.ca/en/building-supplies/cement-concrete-and-masonry/cement-concrete-and-mortar-mixes)

## 11. Implementation order

1. Import the starter observations and validate every pricing key against a calculator material line.
2. Add location, currency, and price-source settings.
3. Add editable unit prices to the shopping list and store them locally with the project.
4. Calculate low / typical / high totals using final buy quantities.
5. Add freshness, source count, availability, and estimate disclaimers.
6. Only then automate retailer collection; retailer terms and approved access methods must be reviewed before using crawlers or APIs.
