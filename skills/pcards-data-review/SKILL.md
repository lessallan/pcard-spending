---
name: pcards-data-review
description: Review imported Penny Ping expenses, reconcile changed records, research merchants and travel across cardholders, and preserve evidence-backed decisions across deliveries.
---

# Penny Ping expense review

Use this project workflow for new data, expense cleanup, unresolved charges, or publication of reviewed findings. Existing AGENTS.md routes those tasks here. Research and skill maintenance do not themselves authorize publication.

## Start with the right records

Find the current production implementation and preserve its source snapshot before changing anything. The older dirty workspace is not the live site. Identify whether the delivery replaces a period or adds records; do not infer this from file names.

For every import, read [intake](references/intake.md) and [decision ledger](references/decision-ledger.md). Run the ledger comparison **before** reusing prior decisions. If no new dataset is provided, work with the established snapshot; don't manufacture an import.

## Choose only the modules needed

| Work | Module |
|---|---|
| New delivery, duplicate detection, yearly/row totals | [Import and reconciliation](references/intake.md) |
| What merchants sold, cross-card notes, sources | [Merchant research](references/research.md) |
| Event editions, advance bookings, travel fees | [Travel matching](references/travel.md) |
| Credits, cancellations, partial refunds | [Refund reconciliation](references/refunds.md) |
| Parks, vehicles, fire stations and shared invoices | [Assets and places](references/assets.md) |
| Named recipients, aliases, cardholders and departments | [People and allocations](references/people.md) |
| Largest unresolved items and missing evidence | [Exception review](references/exceptions.md) |
| Save, revise and carry forward interpretations | [Decision ledger](references/decision-ledger.md) |
| Authorized publication and live verification | [Validation and release](references/validation-release.md) |

## Shared rules

- Preserve original notes, identities, dates, signed integer-cent amounts and allocation rows. Interpretations belong in separate metadata.
- Distinguish payer, beneficiary, merchant identity, location, event, trip membership and attendance. One does not prove another.
- Compare all relevant cardholders and periods. Preserve contradictions, annual editions and multiple nearby training sessions.
- Label supported inferences **Likely**. Leave competing matches unresolved. Repeated prices/dates alone do not establish duplicates or shared purchases.
- Credits reduce costs but never create trips, establish attendance or set travel dates. Shared full charges must not inflate aggregate totals.
- Record decisions with evidence and missing confirmation. New evidence can supersede a prior interpretation; never silently erase its history.
- Carry-forward eligibility is not confirmation or publication approval. Keep local, committed, deployed and live-verified states distinct.

## Deliver the import review

Report new/changed/missing records, exact duplicate IDs rejected, source and allocation reconciliation, eligible prior decisions, stale evidence, context review needed, and ranked unresolved positive charges with credits alongside. State which decisions were migrated, manually reviewed or generated as candidates. Save the report and append reviewed decisions to the local ledger; do not place raw inputs or the ledger under `docs/`.
