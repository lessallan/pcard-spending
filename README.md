<p align="center">
  <img src="assets/spending-blaze-logo.png" alt="Spending Blaze dragon logo" width="460">
</p>

# Spending Blaze

[Browse the public spending report](https://lessallan.github.io/pcard-spending/review/)

Public purchasing policies and aggregate analysis for the City of Panama City, Florida.

- [Merchant spending review — FY25 and FY26](reports/merchant-review.md)
- [Aggregate merchant data](reports/merchant-summary.csv)
- [Policy documents and official source links](policies/panama-city/README.md)

This first-pass analysis identifies where itemized purchase documentation would help review spending. It does not establish waste, misconduct, or policy violations.

**FY25 reconciliation remains unresolved:** detailed records total $136,616.98 less than the workbook summary. FY26 reconciles. See the report for methodology and limitations.

App source, branding, reviewed policy sources and aggregate reports are published. Original transaction spreadsheets, dashboard transaction data and employee-level analysis remain local. The Git ignore rules use an explicit publication allowlist; review content before adding new exceptions.

## Local app

Run `python3 app/server.py` from the repository root, then open http://127.0.0.1:4310. The app uses the Spending Blaze logo and name.

The dashboard requires the local `app/data.json` dataset; it is intentionally excluded from GitHub. A fresh clone does not include transaction records or staff photos. The online app lets you open this dataset directly in your browser without uploading it.

Analysis and source retrieval date: November 9, 2026.

## Online app

Open [Spending Blaze](https://lessallan.github.io/pcard-spending/), then choose your local `app/data.json` file. Records remain in your browser; refresh requires reopening the file. Review decisions are stored in that browser’s local storage. Staff photos remain local.

GitHub Pages serves `docs/` from `main`. After changing app files, run `python3 tools/build_pages.py` and commit the rebuilt files. The build copies only the app, logo and linked public policy; it excludes transaction datasets and staff records.

## Updating the website

Edit the reviewed report Markdown or merchant CSV, then run `python3 scripts/build-site.py` to regenerate the public site under `docs/review/`. Commit the source and generated pages together. The small renderer supports the headings, paragraphs, lists, tables, links, emphasis, and inline code used in these reports.

The public report is published at `/review/`; the dataset-loading dashboard stays at the homepage. The full `tools/build_pages.py` build also rebuilds the public report. Keep the explicit publication allowlist in `.gitignore`; do not add original spreadsheets or employee-level analysis.
