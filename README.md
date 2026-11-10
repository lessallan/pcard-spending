# Spending Blaze

[Explore City spending](https://lessallan.github.io/pcard-spending/)

A public transparency app for City of Panama City FY25 and FY26 P-card spending, grouped by merchant, accounting area, and time. It does not rank employees or provide compliance decisions or receipt-request workflows.

The public dataset excludes cardholder identities, staff profiles, original free-text comments, and automated review flags. Original workbooks and the private `app/data.json` remain local. The build uses an explicit field allowlist; never copy the private dataset directly into `docs/`.

FY25 detail totals differ from the workbook summary by $136,616.98; FY26 reconciles. The app describes supplied records, not certified complete City spending.

## Build and publish

Run `python3 tools/build_pages.py`, then `python3 tools/test_public_data.py`. GitHub Pages serves `docs/` from `main`. Prior review-report URLs redirect to the transparency app. Historical research files are not part of the public app.

Previously published versions may remain in Git history or external caches; this change does not erase those copies.
