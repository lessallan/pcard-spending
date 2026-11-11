# Consolidated travel release — ready for publication approval

Prepared November 11, 2026 against main 5db557a69ea6ea4353ab9e2d5c584714817dafaf. Local branch: codex/consolidated-travel-release. Nothing pushed or published.

## Proposed public changes

- Compact fee rows: fee name and right-aligned amount; remove purchase-count subtitles.
- Separate NLC Congressional Conference 2025/2026 editions, including prior-year advance bookings.
- Add exactly nine bounded Likely event connections, moving $4,337.10 from ungrouped charges into supported event groups.
- Label the FACE and FFMA groups with their 2026 event editions.
- Remove one remaining refund date range (TXN00046695); retain the credit and its signed amount.
- Refresh script/stylesheet cache versions.

Already-live staff label removal and comparison-section removal are preserved. The notes-input fix supports both current purchaseNotes and legacy comments. Event-calendar and merchant-research catalogs remain build/research inputs; they are not new public park/asset views.

## Exact scope

Dataset unchanged: 16,793 transactions. Full-charge net total $4,750,982.45. No payer, allocation, note, source amount, exclusion or privacy boundary changes. Travel snapshot remains 1,460 records. 46 records change metadata (annual-edition corrections, nine additions, two anchor labels and one refund range). record-changes.csv lists each record.

## Reviewed connections

| Purchase | Cardholder | Amount | Event |
|---|---|---:|---|
| TXN00051517 | LUCAS, JANICE L | $1,070.00 | NLC Congressional City Conference 2026 — Likely |
| TXN00056114 | BROCK, JOHN T | $546.06 | FACE Annual Educational Conference 2026 — Likely |
| TXN00056106 | ALDRIDGE, JENNIFER S | $890.00 | FFMA Annual Conference 2026 — Likely |
| TXN00051750 | ALDRIDGE, JENNIFER S | $338.00 | FSA Winter Conference 2025 — Likely |
| TXN00051966 | ALDRIDGE, JENNIFER S | $246.04 | FSA Winter Conference 2025 — Likely |
| TXN00048864 | CAIN , BENJAMIN | $554.37 | FRWA Annual Conference 2025 — Likely |
| TXN00047545 | CAIN , BENJAMIN | $185.63 | FRWA Annual Conference 2025 — Likely |
| TXN00057040 | CAIN , BENJAMIN | $316.87 | FRWA Annual Conference 2026 — Likely |
| TXN00055453 | CAIN , BENJAMIN | $190.13 | FRWA Annual Conference 2026 — Likely |

## Validation

- PASS: nine exact added memberships; unchanged source data; no new refund groups; preserved positive stay dates; missing/changed evidence rejected; repeated application produces the same output.
- PASS: Fayetteville NC versus AR; notes/legacy-comments compatibility; annual separation and November advance booking; conflicting DC/Houston candidate untouched.
- PASS: fees, credits, shared allocation rounding, cross-card recipients, insurance classifications and reviewed-purpose guards.
- PASS: 44 prior reviewed groups / 212 bounded memberships and unrelated group invariants.
- PASS: desktop and phone navigation, filters, all 275 cardholders, totals, dialogs, explorer jump, saved exclusions, homepage video, report/policy links; no browser errors or failed assets in the travel suite.
- PASS: 375px, 390px and 1440px compact fee layouts; screenshots saved alongside this file and inspected.
- PASS: FACE example total $1,161.06; FFMA example $1,350.00.

Two old test assumptions were corrected: a mutated comments fixture must also mutate purchaseNotes; a group containing only an excluded charge should remain hidden, while the saved decision persists. The obsolete check_public browser harness was superseded for this release by the current navigation, travel, fee and consolidated-mobile suites.

## Release path and limitation

Use the already-reviewed snapshot and `node tools/build_travel.cjs --reviewed-update`, followed by the release checks. That path is idempotent and preserves all other memberships. A full rebuild was evaluated separately and changes 289 existing records’ group membership sets and removes four scoped records; none of that output is included in this release. Full regeneration needs its own review, and is not the publication command for this bounded update.

Publication approval covers the code and docs snapshot on this release branch, including nine Likely links and annual/fee/refund corrections. Before publishing, re-fetch main and revalidate any intervening changes. Deploy only the reviewed docs assets; do not include local audit snapshots or screenshots. Verify the resulting live SHA, sample totals, phone layout, explorer jump and existing public links.

## Preview

- [Local preview](http://127.0.0.1:4339/#travel/person/LUCAS%2C%20JANICE%20L)
- [Phone screenshot](fees-390.png)
- [Desktop screenshot](fees-1440.png)