# Penny Ping

[Explore historical Panama City P-card spending](https://pennyping.app/).

The site analyzes supplied FY25 and FY26 purchasing-card records to help citizens understand City spending. Purchase dates run from August 27, 2024, through September 30, 2026. This is a historical snapshot, not live data. Separate expense reimbursements are not included.

Only the 24 approved leadership profiles and 21 matched cardholder names are public. Other cardholders are not publicly identified. Comments, review flags, policy decisions, receipt requests, and trip review tools are excluded. A cardholder may purchase for others; associated charges are not personal spending or complete costs.

`app/leadership.json` records the approved profile names, roles, and cardholder matches. Allan explicitly confirmed the alternate names for Michael Fuller, Vickie Lewis, and Gia Del Pozzo. The three remaining unmatched profiles show unavailable charges, not zero spending.

## Build and publish

The budget guide is authored directly in `docs/index.html` and `docs/budget/index.html`.
The transaction explorer lives at `/review/`; its editable code is in `app/`.
For budget or code-only releases, preserve the reviewed public datasets:

```sh
python3 tools/build_pages.py --code-only
python3 tools/check_budget_release.py
```

Serve `docs/` locally and exercise the homepage, funding breakdown, calculator,
`/review/` and Destination organization navigation on desktop and mobile.
Run explorer browser checks with `BASE_URL=http://127.0.0.1:4397/review/`.
GitHub Pages serves `docs/` from `main`; retain `docs/CNAME`. No hosting change is required.

A purchase-data refresh is a separate reviewed operation. It requires the verified
private `app/data.json`, source portraits, the project data-review workflow and
current publication-boundary tests. The legacy `test_public_data.py` still encodes
an older cardholder allowlist and must be reconciled with the authorized data scope
before a data refresh. Do not weaken it merely to make a new import pass.
The full builder refuses a missing private dataset before writing any files.
Never copy private source records directly into `docs/`. Code-only release checks
validate the retained public artifact; they do not certify a new data import.

FY25 detail totals differ from the workbook summary by $136,616.98; FY26 reconciles. Historical published versions may remain in Git history or external caches; the current publication restrictions do not erase those copies.

## Company descriptions and purchase notes

Company descriptions use explicit merchant aliases and cited sources in `app/merchant-context.js`. Unknown merchants receive no guessed profile. Transaction descriptions quote extracted source notes, preserving mixed items and qualifications while removing common administrative-only text and duplicates. No merchant, department or cardholder-based purchase guesses are generated.

Allan explicitly approved publishing all extracted notes, including any names/details in their text, on November 9, 2026. The builder adds only `purchaseNotes`; raw comments and flags stay empty, existing cardholder anonymity and approved leadership profiles remain unchanged. Notes are not verified receipts. Run the public-data and browser checks before release.

### Published trip research

`tools/travel-research-catalog.cjs` stores sourced hotel and event editions.
`tools/travel-research-engine.cjs` derives purpose, destination clues and explicit date ranges from local records. `tools/build_travel.cjs` publishes these explanations in `docs/travel.json`; raw comments remain excluded and the existing public transaction dataset is unchanged. Event dates are context, not travel dates. Broad organization references do not identify a particular conference.

Validate with `node tools/check_travel_research.cjs`, `python3 tools/test_public_travel.py` and `python3 tools/test_public_data.py` after `python3 tools/build_pages.py`.

### Leadership purchases paid by others

The build derives `docs/leadership-associations.json` from the approved purchase-note extractor, matching selected leaders while checking name ambiguity against the source roster. Profiles combine their card purchases with explicit note matches, retain the recorded payer and supporting note, and deduplicate transaction IDs. A mention and an explicit “for / on behalf of” statement use separate labels. Totals show full associated charges, including credits; shared charges are not an inferred personal allocation. Run `node tools/check_leadership_associations.cjs` after building.
