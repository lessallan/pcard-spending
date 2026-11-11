# Intake and refresh

## Inspect before running

Find the actual input parser, source files, merchant mapping and publication builder. The older workspace uses `tools/build_dashboard_data.py`, `analysis/merchant-mapping.csv`, and `app/data.json`. These paths are discovery leads, not a guarantee of the current architecture.

The historical parser hard-codes FY25/FY26 file names, worksheet names, expected totals, a generated date and a combined-total assertion. Do not simply run it on a new fiscal year or remove assertions to obtain a passing build. Adapt inputs and checks using independently established totals for the new delivery.

## Preserve evidence and reconcile

- Record source-file hashes, worksheets, original row numbers, covered periods and import time. Save the previous normalized dataset and research baseline before replacement.
- Transaction IDs come from the supplied `Txn Number`, not generated row positions. Multiple rows can be accounting allocations for one charge. Preserve all rows and sum allocation cents once into the full transaction.
- Confirm ID uniqueness across deliveries, overlap and incremental versus replacement semantics. Do not append duplicate files or silently overwrite conflicting records. Identical ID with changed merchant, person, amount, date or note requires explicit reconciliation; compare other source fields too.
- Use integer cents; preserve negative entries. Reconcile source rows, unique transactions, allocation sums, per-source and fiscal-year totals. Purchase dates and posting/fiscal-year dates have different meanings.
- Keep unresolved reconciliation differences visible. Historical FY25 detail/summary discrepancy is evidence about that delivery, not a fixed expectation for every future import.
- Normalize whitespace/case conservatively. Preserve raw merchant names and original cardholder identities. Aliases need explicit source support or user confirmation; a display-name cleanup is not identity verification.

## Carry forward research safely

Compare every referenced record and supporting anchor against the new source. Invalidate or queue stale associations when anchors disappear, fields change, or new notes contradict an old inference. Explicit booking IDs and transaction IDs are not interchangeable. Do not match a refund by amount alone when several originals are plausible.

Recompute candidate coverage across all people, including recognized event registrations outside the travel accounting category. Exclude virtual events, dues-only records, office conference-room purchases and explicitly disputed/error records from trip evidence while preserving their financial records. Classifications can require review when a merchant conflicts with the notes.

New input may contain less information than the prior extract. Preserve the distinction between a genuinely blank note and an omitted/redacted field; do not replace richer evidence with missing values without recording why. Only apply associations supported by the available records.

## Publication boundary

A source import is local analysis authorization. Inspect the latest public builder’s field allowlist, identity handling, extracted-note rules and approved dataset scope before preparing publication. Never copy private `app/data.json`, spreadsheets, staff records, raw comment histories or local audit directories into `docs/` just because an older script did so. New delivery content needs publication review within the user’s authorized scope.

## Import decision report

Run `scripts/expense_ledger.py compare` as described in [the ledger module](decision-ledger.md), with the previous full normalized snapshot and the new candidate snapshot. Compare transaction IDs within the same dataset namespace; reused IDs across organizations must never collide. A missing ID in an incremental extract is not deletion: assemble the complete candidate snapshot with explicit overlap/conflict handling before comparing.

The report is a source-change and decision-evidence audit, not an automatic categorizer. New records can contradict unchanged old anchors, so any changed dataset also requires context review of otherwise matching decisions. Check new notes across cardholders, competing bookings, credits and dated rosters before recording a new revision. Do not overwrite the previous snapshot until the import is reconciled.
