---
name: pcards-data-review
description: Import or refresh Penny Ping purchase data, research merchant and travel associations, explain unresolved charges, and verify authorized publication. Use for PCards data-review work; not unrelated UI changes.
---

# PCards data review

Turn source purchase records into traceable, reviewable associations without rewriting the original evidence. Apply the relevant phase; a request for analysis does not automatically require ingestion, code changes or publication.

## Choose the phase

- New files, additional fiscal years, replacement extracts, or refreshed data: read [intake](references/intake.md).
- Merchant identification, trip grouping, cross-card notes, or biggest ungrouped purchases: read [research](references/research.md).
- Regression checks, integrating with the current application, or an authorized release: read [validation and release](references/validation-release.md).

## Working contract

1. Establish the current dataset and implementation before editing. The working directory may contain unpublished research while the latest remote has a different production architecture.
2. Keep source dates, descriptors, cardholders, comments, amounts, credits and allocation rows intact. Store interpretations separately with supporting transaction IDs and a reason.
3. Distinguish merchant/service identity, possible location, event association, traveler identity, membership in a trip and confirmed attendance. Evidence for one does not establish the others.
4. Research across all relevant cardholders. Repeated merchant descriptors and other people’s notes are useful evidence, especially with matching dates, amounts, explicit event wording or named recipients. Do not restrict research to one person’s notes.
5. Apply defensible inferences as labeled suggestions; retain competing evidence and unresolved cases. Do not repeatedly ask Allan to decide routine research choices. Request input only when a material ambiguity or authorization actually blocks the requested action.
6. Report what changed, what remains unresolved, and the evidence required next. Separate new multi-purchase connections from standalone event/place clues. Report net amounts after credits and avoid claiming complete trip costs.
7. Preserve distinct local, committed, pushed, deployed and live-verified states. Publication requires authorization covering the current changes and dataset.

## Durable outputs

Use the owning research catalog/engine and existing audit tools rather than copying findings into disconnected notes alone. Keep a dated local baseline and reproducible disposition report. Update this skill when an approved workflow changes; put changing counts and individual findings in audit artifacts, not permanent rules. Never automatically transfer a reviewed transaction ID to a new dataset without checking that the same source record still exists and means the same thing.
