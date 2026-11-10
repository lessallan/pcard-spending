# Merchant location verification — November 9, 2026

Locations in `app/app.js` are keyed by exact recorded merchant descriptor. Every
entry has an official directory source URL, readable store name, locality and
address. Only trim/case normalization is allowed; no substring or chain-wide
location matching. `docs/app.js` is the deployed copy.

This pass adds 43 stores / 49 observed descriptor aliases / 280 transactions,
bringing coverage to 50 stores and 2,420 transactions. Transaction data, amounts,
merchant grouping, cardholders and purchase notes are unchanged.

## Verification

- Chevron/Texaco: queried the official station finder endpoint
  `https://apis.chevron.com/api/StationFinder/nearby` with the public locator's
  client ID and `address=stn<recorded number>`. All 16 recorded station numbers
  returned exactly one same-ID, same-brand station (leading zeroes ignored only
  to compare directory IDs). Fifteen are new; Chevron 0309488 was already added.
  The UI links directly to each station in the official locator.
- Baker #280: official Baker Express participating-store directory.
- Sherwin-Williams #702024 and #723891: official US store listings; #727645:
  official commercial store page.
- AutoZone #147 and #5150, O’Reilly #2368, Walmart #1207/#1032/#818,
  Lowe’s #2367/#1843/#441, Publix #823/#681/#2034/#1875,
  Sam’s Club #8201/#8253: official store pages explicitly identifying the branch.
- Love’s #379/#802/#453/#724/#363/#868/#561/#708/#964: official numbered
  location routes, including only the INSIDE/OUTSIDE aliases observed in records.

## Deliberately unresolved

- West Marine #1320: its official page identifies Panama City but lists both
  427 E 23rd St and 1001 E 23rd St. No street address published pending resolution.
- Lowe’s #907: not treated as a physical branch. Earlier directory evidence
  indicates e-commerce; no physical shopping location inferred.
- USPS 1172620051/1172640054, CES 64, NAPA 1659049, Mayer 302, PPG/PPC 9736:
  research did not establish a sufficiently clear exact-store official match.
- White Cap #238 and Wawa #5198: directory fetches unavailable; third-party
  listings alone were not used for this pass.
- Publix #1004: current official page timed out. Historical directory evidence
  was not substituted for the current-directory claim in the UI.
- Generic chain names, online orders, airline tickets, invoice numbers and
  account numbers do not identify physical stores and remain unchanged.

The existing detail note distinguishes a current directory address from proof of
its historical address or an in-person visit. Do not use locations to infer what
was bought, who attended, or who benefited from the charge.

Run `node tools/check_merchant_locations.cjs` to check matching and fallbacks.
