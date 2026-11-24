# Revenue context preview, November 24, 2026

Local implementation only. No publication or outreach authorized/performed.

## Scope and evidence

- FY2027 Panama City adopted General Fund ($62,593,981) and all-funds gross budget ($150,263,913). General Fund detailed revenue rows reconcile exactly. The General Fund positive/net funding subtotal before its negative reserve adjustment is $66,327,056; reserve adjustment is −$3,733,075. Do not call all funds consolidated revenue or add internal transfers as new external revenue.
- Official April 1, 2026 EDR/BEBR population: 39,163, including 171 inmates (not the 38,992 adjusted count). This is Panama City, not Panama City Beach or Bay County. Dividing the FY2027 budget by this latest verified estimate is a scale comparison, not an observed FY2027 per-person tax bill.
- Florida DOR 2025 Maximum Millage Compliance report, published January 26, 2026: 393 municipal rows and 67 county rows extracted. Preserve the comparison year and listed operating rates. This population is the report's listed municipal entries, not all Florida municipalities; no zero rates inferred for omitted places. Median 5.1272; Panama City 4.7999; 180 listed municipal rows lower and 212 higher. No weighting by population or taxable value.
- County entries are a separate view. Duval/Jacksonville is consolidated and labeled. No city-versus-county ranking or combined property-tax bill is calculated. One listed rate × $100,000 taxable value / 1,000 is the illustrative tax, rounded to whole dollars.
- Source PDF text loses county-column indentation. The preserved PDFKit line coordinates determine whether a line begins in the county column. Parts on the same page/baseline are merged (Parker's name and values are separate selections). This avoids confusing Bay Harbor Islands, Orange Park, Lake Mary and Palm Beach Shores with county headings. Rebuilding asserts these matches.
- State EDR 2025 Local Government Financial Information Handbook (published February 2026), printed p. 148 / PDF page 156, identifies Panama City and Panama City Beach as the only known Florida local governments levying this merchant gross-receipts license/business tax. Local Panama City page calls it a fee. Do not generalize this to all local business taxes or credit-card merchant fees.
- Dunedin's official 2026 fire-assessment explanation attributes an estimate of approximately 140 municipalities in 2023 to the Florida League of Cities. This is an attributed historical estimate, not independently enumerated current coverage. Its more recent 175–200 estimate mixes cities and counties; it is not used as a current city count. Current municipality-level adoption/collection census remains unverified.
- Official Resolution 20260922.3 verified directly from the PDF: Panama City tax-year 2026 operating rate 4.7999, Downtown Improvement District 3.0000; aggregate 4.8609 is not the city-only rate. The current city rate is noted separately from the 2025 statewide comparison.

## Sources and reproduction

URLs are preserved in docs/revenue-context.json. Text/position snapshots are retained here. Run `python3 tools/build_revenue_context.py` to rebuild. Extract-millage-layout.swift uses macOS PDFKit; input is the original official MillCapComp25.pdf. PDF source files were downloaded to /tmp for reading, with hashes in source-manifest.json.

`node tools/check_revenue_context.cjs` verifies accounting totals, denominator, geographic mapping, all 460 rate rows, search/type/scope switching, visibility when changing tabs, and 320/390/768/1440 layouts. Existing data and inventory remain separate.
