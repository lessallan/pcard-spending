# FY2027 account explanation inventory (local preview)

Base: published homepage matched byte-for-byte to commit 3a3aba8 in the clean dashboard checkout on November 24, 2026. No publication performed.

Source: City of Panama City FY2027 Adopted Budget, https://panamacity.gov/Archive/ViewFile/Item/1581. PDF hash is stored in adopted-rows.json. Source layout text was read from /Users/allanbranch/local-apps/MuniFin/analysis/baycounty-reconciliation-2026-11-22/text/budget27.json. The department-budget.json page map identifies all 92 expense schedules, including fund-wide schedules with revenue and expenses on the same page. Only five-digit expense-object rows were extracted, retaining all four year columns, signs, names and page numbers. Revenue rows have dotted codes and are excluded.

All 1,512 extracted expense rows sum to $150,263,913 for FY2027. Each of the 92 schedules also reconciles individually. No rounding adjustment or balancing row was inserted. This gross budget total includes internal transfers and charges; it is not consolidated external spending.

Rebuild: python3 tools/build_account_inventory.py. The saved row snapshot preserves the population, so rebuilding does not depend on a remote API. The filter selects FY2027 amounts strictly greater than $500,000; professional services, audits, contractual services and rentals/leases (531/532/534/544); contract-named accounts; and outgoing transfers (591 or transfer-named accounts). Zero current budgets remain included in the contract/transfer population. Incoming transfers are not duplicated. Categories overlap: do not add category counts or amounts. This is a budget-account inventory, not a procurement-contract register.

Four priority notes use the tentative supporting budget, Item/1582. Its component amounts are explicitly provisional and are not substituted for adopted totals. Residual arithmetic is not evidence that the other dollars are verified. Explanations of increases, vendor payments and reconciliation remain unresolved.

Maintenance/drainage retains separate source records and groups their cards, with combined FY2024–2027 amounts. No sums are added to dashboard totals. Combined-reference table hides when either member is excluded from the overview. Sweeping remains separate with its fund-move note.

Browser check: node tools/check_account_inventory.cjs (local server port 4428). Existing check_budget_controls.cjs passed for both routes and four viewport widths. No email sent, commit created or deployment performed.

Design revision: inventory moved to account-explanations.html. Homepage starts with its original dashboard again. Relevant department cards link to a department-filtered inventory, and qualifying Everything else items link to the exact explanation. Coverage and amounts are unchanged.
