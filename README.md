# Penny Ping

[Explore historical Panama City P-card spending](https://pennyping.app/).

The site analyzes supplied FY25 and FY26 purchasing-card records to help citizens understand City spending. Purchase dates run from August 27, 2024, through September 30, 2026. This is a historical snapshot, not live data. Separate expense reimbursements are not included.

Only the 24 approved leadership profiles and 21 matched cardholder names are public. Other cardholders are not publicly identified. Comments, review flags, policy decisions, receipt requests, and trip review tools are excluded. A cardholder may purchase for others; associated charges are not personal spending or complete costs.

`app/leadership.json` records the approved profile names, roles, and cardholder matches. Allan explicitly confirmed the alternate names for Michael Fuller, Vickie Lewis, and Gia Del Pozzo. The three remaining unmatched profiles show unavailable charges, not zero spending.

## Build and publish

The private source `app/data.json` remains local and ignored. Never copy it directly into `docs/`. Run `python3 tools/build_pages.py`, then `python3 tools/test_public_data.py`. The builder uses an explicit field and identity allowlist. Update the displayed purchase-date range if new source records are approved.

Serve `docs/` locally and run `node tools/check_public.cjs` to verify the rendered public artifact. Set `BASE_URL` for a different local or live URL. GitHub Pages serves `docs/` from `main`; retain `docs/CNAME`. Retired review URLs redirect to the dashboard. No hosting setting change is required.

FY25 detail totals differ from the workbook summary by $136,616.98; FY26 reconciles. Historical published versions may remain in Git history or external caches; the current publication restrictions do not erase those copies.
