<p align="center">
  <img src="assets/spending-blaze-logo.png" alt="Spending Blaze dragon logo" width="460">
</p>

# Spending Blaze

Public purchasing policies and aggregate analysis for the City of Panama City, Florida.

- [Merchant spending review — FY25 and FY26](reports/merchant-review.md)
- [Aggregate merchant data](reports/merchant-summary.csv)
- [Policy documents and official source links](policies/panama-city/README.md)

This first-pass analysis identifies where itemized purchase documentation would help review spending. It does not establish waste, misconduct, or policy violations.

**FY25 reconciliation remains unresolved:** detailed records total $136,616.98 less than the workbook summary. FY26 reconciles. See the report for methodology and limitations.

App source, branding, reviewed policy sources and aggregate reports are published. Original transaction spreadsheets, dashboard transaction data and employee-level analysis remain local. The Git ignore rules use an explicit publication allowlist; review content before adding new exceptions.

## Local app

Run `python3 app/server.py` from the repository root, then open http://127.0.0.1:4310. The app uses the Spending Blaze logo and name.

The dashboard requires the local `app/data.json` dataset; it is intentionally excluded from GitHub. A fresh clone does not include transaction records or staff photos. This repository publishes source code, not a hosted GitHub Pages app.

Analysis and source retrieval date: November 9, 2026.
