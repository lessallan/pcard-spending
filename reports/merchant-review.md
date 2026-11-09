# Broad-selection merchant review — FY25 and FY26

Analysis date: November 9, 2026. First-pass merchant selection for itemized-receipt review, not a finding of waste or improper spending.

## Scope and method

- Source: `FY25 P-Card Transactions.xlsx`, `Original` tab; `FY26 P-Card Transactions.xlsx`, `Sheet1` tab. Other FY25 tabs are alternate views and were excluded to avoid double counting.
- Posting dates: October 1, 2024–September 30, 2025 and October 1, 2025–September 30, 2026. Purchase dates can precede these periods.
- Count unique transaction IDs, summing all associated accounting rows. Do not treat an accounting allocation as a receipt item. FY25 has 9,230 detail rows / 8,584 IDs; FY26 has 8,906 detail rows / 8,209 IDs.
- Net spending = positive transaction amounts minus negative transaction amounts. Counts include purchases and credits. Gross and credits are provided separately in merchant-summary.csv.
- Group merchant-name variants using a locally retained explicit merchant mapping. General merchandise, hardware/tools, office/industrial catalogs, home/craft/electronics/sporting goods, and grocery/pharmacy are separate review groups.
- This is a first-pass list of identifiable broad-selection sellers, not an exhaustive classification of all suppliers. Specialized suppliers may also require line-item documentation. Membership descriptors (Amazon Prime and Sam’s renewal) are excluded; memberships embedded under generic store names cannot be separated without receipts. Walmart-associated fuel merchant is excluded.

## Reconciliation limitation

**FY25 detailed records do not reconcile to the workbook summary.** Detail totals $2,289,549.46 versus summary $2,426,166.44, a $136,616.98 shortfall. Monthly differences are October 2024: -$33.57; February 2025: -$136,570.95; August 2025: -$12.46. The cause remains unresolved. No records or amounts were corrected. FY26 detail and summary both total $2,461,432.99. Merchant figures below are amounts present in the detail, not a certified complete expenditure total.

## Results

Selected merchants: 7,477 transactions (7,162 purchases; 315 credits). Gross purchases $1,401,429.34; credits $37,031.99; net $1,364,397.35.

| Group | Transactions incl. credits | Net spending |
|---|---:|---:|
| General merchandise / marketplaces | 4,169 | $738,419.70 |
| Grocery / pharmacy | 85 | $7,133.20 |
| Hardware / tools / farm | 2,781 | $500,600.05 |
| Office / industrial catalogs | 339 | $85,236.47 |
| Other mixed-category retailers | 103 | $33,007.93 |

| Merchant | FY25 net | FY26 net | Combined net | Transactions incl. credits | Purchases ≥ $1,000 |
|---|---:|---:|---:|---:|---:|
| Amazon | $351,587.55 | $280,778.03 | $632,365.58 | 3,467 | 115 |
| Lowe's | $130,112.37 | $130,670.22 | $260,782.59 | 1,650 | 25 |
| Home Depot | $60,289.54 | $58,651.55 | $118,941.09 | 594 | 18 |
| Sam's Club | $37,117.35 | $34,807.55 | $71,924.90 | 307 | 7 |
| Harbor Freight | $29,494.60 | $24,513.24 | $54,007.84 | 310 | 3 |
| Uline | $16,720.01 | $24,752.29 | $41,472.30 | 56 | 16 |
| Tractor Supply | $21,949.94 | $17,590.48 | $39,540.42 | 146 | 8 |
| Office Depot / ODP | $20,831.76 | $14,916.48 | $35,748.24 | 255 | 4 |
| Walmart | $15,844.68 | $11,219.64 | $27,064.32 | 256 | 1 |
| Ace hardware stores | $14,367.21 | $9,641.46 | $24,008.67 | 79 | 8 |
| Hobby Lobby | $6,492.04 | $3,525.02 | $10,017.06 | 66 | 0 |
| Wayfair / Joss & Main | $4,708.90 | $4,416.90 | $9,125.80 | 9 | 4 |
| Best Buy | $3,634.21 | $4,060.78 | $7,694.99 | 17 | 2 |
| Publix | $2,963.88 | $3,512.44 | $6,476.32 | 70 | 0 |
| Academy Sports | $5,742.35 | $427.73 | $6,170.08 | 11 | 1 |
| Grainger | $2,724.60 | $1,495.64 | $4,220.24 | 20 | 0 |
| Dollar General | $1,944.95 | $1,379.66 | $3,324.61 | 97 | 0 |
| Northern Tool | $2,869.49 | $449.95 | $3,319.44 | 2 | 1 |
| Global Industrial | $621.27 | $2,311.44 | $2,932.71 | 5 | 1 |
| eBay | $1,415.11 | $0.00 | $1,415.11 | 3 | 1 |
| Alibaba | $947.51 | $0.00 | $947.51 | 1 | 0 |
| Zoro | $862.98 | $0.00 | $862.98 | 3 | 0 |
| Dollar Tree | $326.24 | $309.25 | $635.49 | 24 | 0 |
| Target | $91.98 | $366.96 | $458.94 | 9 | 0 |
| Winn-Dixie | $238.20 | $34.97 | $273.17 | 5 | 0 |
| Walgreens | $196.90 | $0.00 | $196.90 | 5 | 0 |
| Aldi | $176.43 | $0.00 | $176.43 | 3 | 0 |
| Family Dollar | $6.00 | $159.75 | $165.75 | 4 | 0 |
| Costco | $0.00 | $117.49 | $117.49 | 1 | 0 |
| CVS | $4.99 | $5.39 | $10.38 | 2 | 0 |

## Large-purchase starting point

Use $1,000 as an analytical review threshold, not a policy limit or violation test. There are 215 purchases of at least $1,000 at selected merchants, totaling $367,515.37; 27 are at least $2,500. Across all merchants, 1,222 purchases are at least $1,000, totaling $2,129,418.14.

## Itemization gap and proposed collection fields

The exports have transaction IDs, dates, merchant names, accounting allocations, amounts, and free-text comments. They do not have dedicated SKU/item, quantity, or unit-price columns. Comments sometimes describe purchases, and may reference receipts stored elsewhere; absence from these exports does not prove a receipt was never collected.

For review, obtain the actual itemized receipt/order invoice and record each item’s description, quantity, unit price, line total, business purpose, department/project or location, and receiving confirmation. Reconcile item totals plus tax/shipping/discounts to the transaction. Retain approval and refund links. A single-item purchase still needs a specific description and purpose.

Recommended first review: Amazon, Lowe’s, Home Depot, Sam’s Club and Walmart; prioritize the selected purchases ≥ $1,000, then a sample of smaller baskets. Resolve the FY25 reconciliation before reporting citywide shares or definitive annual totals.

## Published files

- [Merchant summary CSV](merchant-summary.csv): aggregate merchant totals, gross purchases, credits, fiscal-year breakdowns, and large-purchase counts.
- Source spreadsheets, transaction-level records, employee names/comments, and detailed mappings remain local and are not included in this repository.
