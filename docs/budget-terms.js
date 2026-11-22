/* Plain-language definitions shared by the two budget pages. */
(() => {
  'use strict';
  const entries = [
  {
    "title": "Revenue and receipts",
    "terms": [
      "revenue",
      "cash receipts"
    ],
    "definition": "Revenue is money earned or collected from sources such as taxes and fees. Receipts are money actually received; the timing can differ from when revenue is recorded.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Fund and General Fund",
    "terms": [
      "General Fund"
    ],
    "definition": "A fund tracks money set aside for a purpose. The General Fund pays for everyday city services. Fund numbers, such as 150 or 190, identify accounts; they are not rankings.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Adopted, amended and actual",
    "terms": [
      "adopted budget",
      "amended budget",
      "actual spending"
    ],
    "definition": "Adopted is the approved spending plan. Amended is that plan after approved changes. Actual is the amount recorded, rather than planned.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Fiscal year (FY) and year to date (YTD)",
    "terms": [
      "fiscal year",
      "year to date",
      "YTD"
    ],
    "definition": "A fiscal year is an organization’s 12-month accounting period. Year to date runs from the start of that period through the report date.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Appropriation",
    "terms": [
      "appropriation",
      "unspent appropriation"
    ],
    "definition": "Permission in the budget to spend up to a stated amount for a purpose. An unspent appropriation is unused spending authority, not proof that the same amount is available in the bank.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Reserves and fund balance",
    "terms": [
      "reserves",
      "reserve adjustments",
      "fund balance"
    ],
    "definition": "Reserves are resources held for future needs. Fund balance is an accounting measure of resources remaining after liabilities and certain timing adjustments. Neither term automatically means cash free to spend on anything.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Restricted, committed and available",
    "terms": [
      "restricted funds",
      "committed funds",
      "available funds"
    ],
    "definition": "Restricted money has limits imposed by law or an outside source. Committed money has been set aside by formal government action. Available money can be used for the stated purpose after applicable limits and obligations are considered.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Encumbered",
    "terms": [
      "encumbered"
    ],
    "definition": "Money reserved in the accounts for an order or contract that has not yet been fully paid. It may still be in the bank, but it is already spoken for.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Administration and nondepartmental expenses",
    "terms": [
      "administration",
      "nondepartmental expenses"
    ],
    "definition": "Administration pays for managing a program, including staff and paperwork. Nondepartmental costs are recorded outside a single service department; the label alone does not tell you what was purchased.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Budgeted position and vacancy",
    "terms": [
      "budgeted position",
      "budgeted positions",
      "vacancies"
    ],
    "definition": "A budgeted position is a job included in the spending plan. A vacancy is an unfilled job. A cost per budgeted position is not necessarily the cost per employee actually working or enrolled in insurance.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Assessed value",
    "terms": [
      "assessed value"
    ],
    "definition": "The property value used in the tax calculation before exemptions, after applicable assessment limits. It can differ from a likely selling price.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Taxable value and exemption",
    "terms": [
      "taxable value",
      "exemption",
      "exemptions"
    ],
    "definition": "An exemption removes eligible value from taxation. Taxable value is what remains for that tax after exemptions. An exemption reduces the value taxed, not the bill dollar for dollar.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Homestead",
    "terms": [
      "homestead",
      "homestead exemption"
    ],
    "definition": "A qualifying permanent home. Owners must meet eligibility and application rules to receive the homestead exemption.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Millage and mill",
    "terms": [
      "millage",
      "mill",
      "mills"
    ],
    "definition": "The property-tax rate. One mill means $1 of tax for every $1,000 of taxable value. For example, 5 mills on $100,000 of taxable value equals $500.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Levy and ad valorem",
    "terms": [
      "levy",
      "levies",
      "ad valorem"
    ],
    "definition": "A levy is a tax imposed by a government. Ad valorem means based on value, as with property tax.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "TRIM notice",
    "terms": [
      "TRIM notice",
      "notice of proposed property taxes"
    ],
    "definition": "The Notice of Proposed Property Taxes explains proposed taxes, values and hearing information. TRIM stands for Truth in Millage. It is not the final tax bill.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Baseline and estimate",
    "terms": [
      "baseline"
    ],
    "definition": "A baseline is the starting point used for comparison. An estimate is a calculation based on stated assumptions, not a promise of a future bill.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Infrastructure and capital improvement",
    "terms": [
      "infrastructure",
      "capital improvement",
      "capital improvements"
    ],
    "definition": "Long-lasting public systems and facilities, such as roads, pipes and drainage. A capital improvement builds or substantially improves them.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Grant, award and allocation",
    "terms": [
      "grant",
      "grants",
      "grant funding"
    ],
    "definition": "A grant provides funding under conditions. An award approves funding or a contract; an allocation assigns an amount to a purpose. Neither alone proves money has been received or spent.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Reimbursement and local match",
    "terms": [
      "reimbursement",
      "reimbursements",
      "local match",
      "city match"
    ],
    "definition": "A reimbursement repays eligible costs already paid. A local match is the contribution the city must provide alongside a grant; allowable contributions depend on the agreement.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Approved award, change order and revised contract",
    "terms": [
      "approved award",
      "change orders",
      "change order",
      "revised contract"
    ],
    "definition": "The approved award is the original contract amount. A change order formally changes work, price or timing. The revised contract reflects approved changes.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Paid to date",
    "terms": [
      "paid to date"
    ],
    "definition": "Payments recorded through the report date. This can be less than the approved contract because work or payment is still pending.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Business-type activities",
    "terms": [
      "business-type activities"
    ],
    "definition": "City services accounted for much like a business because customers pay fees, such as utilities. This is an accounting category, not a statement that the service is privately owned.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "SHIP",
    "terms": [
      "SHIP"
    ],
    "definition": "State Housing Initiatives Partnership, Florida funding used locally for eligible home purchases, repairs and housing assistance.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "HUD, CDBG and NSP",
    "terms": [
      "HUD",
      "CDBG",
      "NSP",
      "NSP1"
    ],
    "definition": "HUD is the U.S. Department of Housing and Urban Development. CDBG means Community Development Block Grant, which funds eligible community needs. NSP means Neighborhood Stabilization Program, created to help communities affected by foreclosures and abandoned homes.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Documentary stamp tax",
    "terms": [
      "documentary stamp tax",
      "documentary stamp taxes"
    ],
    "definition": "A Florida tax on certain documents, including property deeds and some loan documents. Part of its revenue supports housing programs.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Owner-occupied rehabilitation",
    "terms": [
      "owner-occupied rehabilitation",
      "rehabilitation"
    ],
    "definition": "Repairs or improvements to a home lived in by its owner. It does not mean building an additional home.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Infill and demolition/reconstruction",
    "terms": [
      "infill",
      "demolition/reconstruction"
    ],
    "definition": "Infill adds buildings on vacant or underused land within an existing community. Demolition/reconstruction removes a building and replaces it. A replacement home does not necessarily increase the number of homes.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Impact-fee assistance",
    "terms": [
      "impact-fee assistance",
      "impact fees",
      "water impact fees",
      "sewer impact fees"
    ],
    "definition": "Help paying fees intended to cover added demand on public systems from development, such as water and sewer capacity.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Second mortgage",
    "terms": [
      "second mortgage",
      "second mortgages"
    ],
    "definition": "An additional loan secured by the home, behind the first mortgage in payment priority. Housing assistance may use this arrangement; repayment or forgiveness depends on the program’s terms.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Low- and moderate-income",
    "terms": [
      "low- and moderate-income",
      "low/moderate-income"
    ],
    "definition": "Program eligibility categories based on household income and size. The applicable program sets the limits; the labels do not mean one fixed income for everyone.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Housing Choice Voucher and HUD-VASH",
    "terms": [
      "Housing Choice Vouchers",
      "Housing Choice Voucher",
      "VASH vouchers",
      "HUD-VASH"
    ],
    "definition": "A voucher helps an eligible household pay rent. HUD-VASH combines rental help for eligible homeless veterans with support services through Veterans Affairs.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Funding cycle and units assisted",
    "terms": [
      "funding cycle",
      "units assisted"
    ],
    "definition": "A funding cycle identifies the period or batch of funding being reported. Units assisted counts housing receiving help under the report’s rules; it is not automatically a count of new homes completed that year.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Net homes added",
    "terms": [
      "net units added"
    ],
    "definition": "New homes minus homes removed within the same area and period. Repairs to existing homes do not add to the count.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Ledger, account and allocation",
    "terms": [
      "ledger",
      "allocations"
    ],
    "definition": "A ledger lists accounting entries. An account groups entries by purpose or type. An allocation assigns some or all of a charge to an account. One purchase can produce several entries.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Vendor, invoice and receipt",
    "terms": [
      "vendor",
      "vendors",
      "invoice",
      "invoices"
    ],
    "definition": "A vendor sells goods or services. An invoice requests payment. A receipt documents a payment or purchase. A linked document still needs to be checked against the transaction.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Gross, net and credits",
    "terms": [
      "net after credits",
      "net amount",
      "credits",
      "gross"
    ],
    "definition": "Gross is the amount before deductions. Net is after specified deductions. On the card pages, credits reduce spending. For example, a $100 charge and a $20 credit produce $80 net spending.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Journal adjustment and posting date",
    "terms": [
      "journal adjustment",
      "journal adjustments",
      "posting date",
      "posting period"
    ],
    "definition": "A journal adjustment changes the accounting records and may move a cost between accounts without a new purchase. The posting date is when an entry is recorded; it can differ from the purchase date.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Opening balance and reconciliation",
    "terms": [
      "opening balance",
      "reconciliation"
    ],
    "definition": "An opening balance is the amount already in an account when a period starts. Reconciliation compares records and explains differences. An unexplained difference is a question to resolve, not proof of wrongdoing.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Balance sheet, assets and liabilities",
    "terms": [
      "balance sheet",
      "balance-sheet",
      "assets",
      "liabilities"
    ],
    "definition": "A balance sheet shows what an organization has and owes at a date. Assets are resources it owns or controls. Liabilities are obligations it must settle.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Net income, net loss and cash flow",
    "terms": [
      "net income",
      "net loss",
      "cash flow"
    ],
    "definition": "Income or loss compares revenue with expenses under the report’s accounting rules. Cash flow tracks money moving in and out. A reported loss is not necessarily the same as cash leaving the bank.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Depreciation and impairment",
    "terms": [
      "depreciation",
      "impairment"
    ],
    "definition": "Depreciation spreads an asset’s cost over its useful life. Impairment records a significant, unexpected loss of an asset’s ability to provide service. These entries do not themselves mean a new purchase or payment occurred.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Audited, unaudited and provisional",
    "terms": [
      "audited",
      "unaudited",
      "provisional"
    ],
    "definition": "Audited statements have been examined by an independent auditor. Unaudited figures have not completed that process. Provisional findings can change as evidence improves. An audit is not proof that every purchase was individually checked.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Not additive",
    "terms": [
      "not additive"
    ],
    "definition": "The displayed amounts should not simply be added together. A purchase, the payment of its bill and transfers between accounts may describe overlapping parts of the same activity.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Likely and unresolved",
    "terms": [
      "Likely",
      "unresolved"
    ],
    "definition": "On this site, Likely marks an inference supported by clues rather than confirmation. Unresolved means the evidence does not yet settle the question.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "F.O.G.",
    "terms": [
      "F.O.G.",
      "F.O.G",
      "FOG"
    ],
    "definition": "Fats, oils and grease. The city’s program charges covered establishments and helps prevent grease from blocking sewer pipes.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Refuse and CNG",
    "terms": [
      "refuse",
      "CNG"
    ],
    "definition": "Refuse means garbage. CNG means compressed natural gas, a vehicle fuel.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Interfund and debt proceeds",
    "terms": [
      "interfund transfers",
      "interfund",
      "debt proceeds",
      "borrowing proceeds"
    ],
    "definition": "Interfund means between city funds. Debt proceeds are money received from borrowing, which creates a repayment obligation.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "CIP and refunding",
    "terms": [
      "CIP",
      "refunding"
    ],
    "definition": "CIP commonly means capital improvement program or plan. Refunding means replacing earlier debt with new borrowing. Years in debt-fund names identify financing issues, not necessarily the year of current spending.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Miscellaneous N.O.C.",
    "terms": [
      "Miscellaneous N.O.C.",
      "N.O.C."
    ],
    "definition": "A catch-all revenue label for items not otherwise classified. The label alone does not identify who paid or what each receipt was for.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Gross accounting basis",
    "terms": [
      "gross accounting basis"
    ],
    "definition": "Totals include internal movements such as transfers between funds. The same outside dollar can appear in more than one fund, so the combined spending budget is not a count of unique dollars collected from the public.",
    "url": "/#budget-words",
    "link": "Read the glossary and sources"
  },
  {
    "title": "Debt service",
    "terms": [
      "debt service",
      "annual debt payments"
    ],
    "definition": "Payments due on borrowed money during the year: principal pays back the loan, and interest is the cost of borrowing. This is different from the total balance still owed.",
    "url": "https://panamacity.gov/Archive/ViewFile/Item/1581#page=5",
    "link": "Read more from the source"
  },
  {
    "title": "Capital outlay",
    "terms": [
      "capital outlay"
    ],
    "definition": "Spending to buy, build or substantially improve things the city will use for years, such as vehicles, buildings and equipment.",
    "url": "https://panamacity.gov/Archive/ViewFile/Item/1581#page=6",
    "link": "Read more from the source"
  },
  {
    "title": "Operating expenses",
    "terms": [
      "operating expenses",
      "operating expenditures",
      "operating costs"
    ],
    "definition": "Everyday costs of running city services, such as electricity, supplies, fuel, repairs and contracted work.",
    "url": "https://panamacity.gov/Archive/ViewFile/Item/1581#page=30",
    "link": "Read more from the source"
  },
  {
    "title": "Pension contributions",
    "terms": [
      "pension contributions",
      "retirement contributions",
      "pension contribution"
    ],
    "definition": "Money paid into a retirement plan to help fund benefits. The annual contribution is different from the estimated benefits owed over many years.",
    "url": "https://www.panamacity.gov/491/Pension-Disclosures",
    "link": "Read more from the source"
  },
  {
    "title": "Pension liability",
    "terms": [
      "pension liability",
      "pension liabilities"
    ],
    "definition": "The estimated value today of retirement benefits employees have already earned, to be paid over many years. This is not a bill due all at once.",
    "url": "https://www.panamacity.gov/491/Pension-Disclosures",
    "link": "Read more from the source"
  },
  {
    "title": "Unfunded actuarial liability",
    "terms": [
      "unfunded actuarial liability"
    ],
    "definition": "The gap between estimated pension obligations and the assets counted in the funding study. It is a long-term funding shortfall, not an extra bill due this year.",
    "url": "https://www.nasra.org/amortization",
    "link": "Read more from the source"
  },
  {
    "title": "Funded ratio",
    "terms": [
      "funded ratio"
    ],
    "definition": "Pension assets divided by estimated pension obligations. For example, 76.1% means about $76.10 in assets per $100 of estimated benefits. It does not mean retirees receive only 76.1% of their pensions.",
    "url": "https://www.panamacity.gov/491/Pension-Disclosures",
    "link": "Read more from the source"
  },
  {
    "title": "Actuarial valuation",
    "terms": [
      "actuarial valuation",
      "actuarial valuations"
    ],
    "definition": "A financial study that estimates future benefit costs and compares them with a pension plan’s assets. It uses assumptions about factors such as investment returns and how long people live.",
    "url": "https://www.panamacity.gov/491/Pension-Disclosures",
    "link": "Read more from the source"
  },
  {
    "title": "Principal",
    "terms": [
      "principal",
      "outstanding principal"
    ],
    "definition": "The amount borrowed that has not yet been repaid. Interest is a separate charge for borrowing; paying interest does not reduce the principal.",
    "url": "https://panamacity.gov/Archive/ViewFile/Item/1581#page=89",
    "link": "Read more from the source"
  },
  {
    "title": "Maturity date",
    "terms": [
      "maturity date"
    ],
    "definition": "The date when the final principal payment is due under a borrowing agreement.",
    "url": "https://panamacity.gov/Archive/ViewFile/Item/1581#page=89",
    "link": "Read more from the source"
  },
  {
    "title": "Refinancing",
    "terms": [
      "refinancing",
      "refinanced"
    ],
    "definition": "Replacing earlier borrowing with new borrowing. It can change payment dates and terms; it does not automatically erase debt or save money.",
    "url": "https://panamacity.gov/Archive/ViewFile/Item/1581#page=89",
    "link": "Read more from the source"
  },
  {
    "title": "Electric utility service tax",
    "terms": [
      "electric utility service tax"
    ],
    "definition": "A local tax on electricity purchases. The electric company collects it through customer bills and passes the city tax money to the city.",
    "url": "https://www.floridarevenue.com/taxes/governments/Pages/mpst.aspx",
    "link": "Read more from the source"
  },
  {
    "title": "Half-cent sales tax distribution",
    "terms": [
      "half cent sales tax distribution",
      "half-cent sales tax"
    ],
    "definition": "Florida shares part of its state sales-tax collections with local governments. This budget entry is Panama City’s share; it is separate from Bay County’s infrastructure surtax.",
    "url": "https://www.flsenate.gov/Laws/Statutes/2025/Chapter218/All",
    "link": "Read more from the source"
  },
  {
    "title": "Local option fuel tax",
    "terms": [
      "local option fuel tax"
    ],
    "definition": "A cents-per-gallon tax included in fuel prices. State law lets counties impose it, and the city receives a share for allowed transportation costs.",
    "url": "https://www.floridarevenue.com/taxes/taxesfees/Pages/local_option.aspx",
    "link": "Read more from the source"
  },
  {
    "title": "Communications services tax",
    "terms": [
      "communications services tax"
    ],
    "definition": "A tax on services such as phone plans, cable TV and streaming. Providers collect it from customers; internet access itself is exempt.",
    "url": "https://floridarevenue.com/taxes/taxesfees/Pages/cst.aspx",
    "link": "Read more from the source"
  },
  {
    "title": "Infrastructure sales surtax",
    "terms": [
      "infrastructure sales surtax",
      "infrastructure surtax"
    ],
    "definition": "An extra sales tax for public improvements. Bay County’s half-cent rate is 50 cents on a $100 taxable purchase. It is separate from the state half-cent revenue-sharing program.",
    "url": "https://floridarevenue.com/taxes/tips/Documents/TIP_24A01-21.pdf",
    "link": "Read more from the source"
  },
  {
    "title": "State revenue sharing",
    "terms": [
      "state revenue sharing"
    ],
    "definition": "Florida sends eligible cities part of state tax collections under a formula set by law, with rules about how the money may be used.",
    "url": "https://www.floridarevenue.com/taxes/governments/Pages/revenue_sharing.aspx",
    "link": "Read more from the source"
  },
  {
    "title": "Fire assessment",
    "terms": [
      "fire assessment",
      "fire service assessment"
    ],
    "definition": "A separate charge on eligible properties to help pay for fire protection, calculated under the city’s assessment rules rather than as a percentage of property value.",
    "url": "https://www.panamacity.gov/m/newsflash/Home/Detail/702",
    "link": "Read more from the source"
  },
  {
    "title": "Merchant fee",
    "terms": [
      "merchant fee"
    ],
    "definition": "A city fee equal to 1% of retail sales under the city’s rules. Merchants pay it to the city and may pass the charge to customers.",
    "url": "https://www.panamacity.gov/779/Merchant-Local-Business-Tax-Return-1-Fee",
    "link": "Read more from the source"
  },
  {
    "title": "CRA",
    "terms": [
      "CRA",
      "CRAs",
      "Community Redevelopment Agency"
    ],
    "definition": "Community Redevelopment Agency: a public agency that supports improvements in designated neighborhoods, using dedicated funding.",
    "url": "https://www.panamacity.gov/854/About-CRA",
    "link": "Read more from the source"
  },
  {
    "title": "Tax increment financing",
    "terms": [
      "tax increment financing"
    ],
    "definition": "A method that directs property-tax revenue tied to growth in taxable value above a base year toward improvements in a designated redevelopment area.",
    "url": "https://www.panamacity.gov/854/About-CRA",
    "link": "Read more from the source"
  },
  {
    "title": "Other uses",
    "terms": [
      "other uses"
    ],
    "definition": "In this General Fund budget, money transferred to other city funds that make debt payments. The transfer moves money between city accounts.",
    "url": "https://panamacity.gov/Archive/ViewFile/Item/1581#page=45",
    "link": "Read more from the source"
  },
  {
    "title": "Grants and aid",
    "terms": [
      "grants and aid"
    ],
    "definition": "City funding for other public programs. Here it supports the Community Redevelopment Agency and Bay County Transportation.",
    "url": "https://panamacity.gov/Archive/ViewFile/Item/1581#page=31",
    "link": "Read more from the source"
  },
  {
    "title": "Medical self insurance",
    "terms": [
      "medical self insurance"
    ],
    "definition": "The plan uses its funds to pay covered medical claims instead of shifting all claim costs to an insurance company.",
    "url": "https://panamacity.gov/Archive/ViewFile/Item/1581#page=119",
    "link": "Read more from the source"
  }
];
  const main = document.querySelector('main');
  if (!main) return;
  const aliases = new Map();
  entries.forEach((entry, index) => entry.terms.forEach(term => aliases.set(term.toLowerCase(), index)));
  const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp('(?<![\\p{L}\\p{N}])(' + [...aliases.keys()].sort((a, b) => b.length - a.length).map(escape).join('|') + ')(?![\\p{L}\\p{N}])', 'giu');
  const excluded = 'a,button,input,select,textarea,label,form,nav,summary,script,style,#budget-words,.expense-terms,.expense-definition,.funding-definition,[data-budget-term],[aria-hidden="true"]';
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return node.parentElement && !node.parentElement.closest(excluded) && node.textContent.trim()
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const text = node.textContent;
    pattern.lastIndex = 0;
    const matches = [...text.matchAll(pattern)];
    if (!matches.length) continue;
    const fragment = document.createDocumentFragment();
    let offset = 0;
    for (const match of matches) {
      fragment.append(document.createTextNode(text.slice(offset, match.index)));
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'budget-term';
      button.dataset.budgetTerm = aliases.get(match[0].toLowerCase());
      button.textContent = match[0];
      button.setAttribute('aria-label', match[0]);
      button.setAttribute('aria-description', 'Show a simple definition');
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', 'budget-term-definition');
      fragment.append(button);
      offset = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(text.slice(offset)));
    node.replaceWith(fragment);
  }
  if (!main.querySelector('.budget-term')) return;
  const hint = document.createElement('p');
  hint.className = 'budget-term-hint';
  hint.textContent = 'Tap or click a dotted-underlined term for a quick definition.';
  main.prepend(hint);

  const popup = document.createElement('div');
  popup.id = 'budget-term-definition';
  popup.className = 'budget-definition';
  popup.hidden = true;
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-labelledby', 'budget-definition-title');
  popup.setAttribute('aria-describedby', 'budget-definition-text');
  const nativePopover = typeof popup.showPopover === 'function';
  if (nativePopover) popup.setAttribute('popover', 'manual');
  const heading = document.createElement('h2');
  heading.id = 'budget-definition-title';
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'budget-definition-close';
  closeButton.textContent = 'Close';
  closeButton.setAttribute('aria-label', 'Close definition');
  const header = document.createElement('div');
  header.className = 'budget-definition-header';
  header.append(heading, closeButton);
  const description = document.createElement('p');
  description.id = 'budget-definition-text';
  const more = document.createElement('a');
  more.className = 'budget-definition-source';
  popup.append(header, description, more);
  document.body.append(popup);
  let active = null;

  function close(restoreFocus = false) {
    if (!active) return;
    const previous = active;
    active = null;
    previous.setAttribute('aria-expanded', 'false');
    if (nativePopover && popup.matches(':popover-open')) popup.hidePopover();
    popup.hidden = true;
    if (restoreFocus && previous.isConnected) previous.focus({preventScroll: true});
  }
  function position() {
    if (!active) return;
    const viewport = window.visualViewport;
    const left = viewport?.offsetLeft || 0;
    const top = viewport?.offsetTop || 0;
    const width = viewport?.width || document.documentElement.clientWidth;
    const height = viewport?.height || window.innerHeight;
    const rect = active.getBoundingClientRect();
    if (rect.bottom < top || rect.top > top + height) { close(false); return; }
    const margin = 12;
    popup.style.width = Math.min(360, width - margin * 2) + 'px';
    popup.style.maxHeight = Math.max(120, height - margin * 2) + 'px';
    const box = popup.getBoundingClientRect();
    const x = Math.max(left + margin, Math.min(rect.left, left + width - box.width - margin));
    let y = rect.bottom + 8;
    if (y + box.height > top + height - margin) y = rect.top - box.height - 8;
    y = Math.max(top + margin, Math.min(y, top + height - box.height - margin));
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
  }
  main.addEventListener('click', event => {
    const trigger = event.target.closest('[data-budget-term]');
    if (!trigger) return;
    if (active === trigger) { close(true); return; }
    close(false);
    const entry = entries[Number(trigger.dataset.budgetTerm)];
    heading.textContent = entry.title;
    description.textContent = entry.definition;
    more.href = entry.url;
    more.textContent = entry.link;
    active = trigger;
    active.setAttribute('aria-expanded', 'true');
    popup.hidden = false;
    if (nativePopover) popup.showPopover();
    position();
    closeButton.focus({preventScroll: true});
  });
  closeButton.addEventListener('click', () => close(true));
  document.addEventListener('keydown', event => {
    if (active && event.key === 'Escape') { event.preventDefault(); close(true); }
  });
  document.addEventListener('pointerdown', event => {
    if (active && !popup.contains(event.target) && !active.contains(event.target)) close(false);
  });
  document.addEventListener('focusin', event => {
    if (active && !popup.contains(event.target) && event.target !== active) close(false);
  });
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position, {passive: true, capture: true});
  window.visualViewport?.addEventListener('resize', position);
  window.visualViewport?.addEventListener('scroll', position);
})();
