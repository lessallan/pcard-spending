# Saved decision ledger

The project ledger is `analysis/expense-review/decisions.jsonl` (paths below are relative to the repository). It is local audit data, never a public site input. `analysis/expense-review/baseline.json` preserves the source snapshot used for migration; `migration.json` describes coverage and provenance. Source records remain separate from interpretations.

The canonical working copy lives at `/Users/allanbranch/local-apps/PCards/analysis/expense-review/`. From another worktree, pass those absolute ledger/baseline paths. If the ledger is missing, locate or restore the existing audit copy; do not silently initialize an empty replacement. This local ledger is not automatically synchronized to another machine.

## Compare every import

Normalize a complete candidate snapshot to `{ "transactions": [...] }` with stable string IDs, integer-cent amounts, fiscal years and allocation rows. Use the same organization/ID namespace, `panama-city-pcards`; don't mix another city's reused IDs. Combine incremental deliveries deliberately before comparison; missing records are not inferred deletions.

```sh
python3 skills/pcards-data-review/scripts/expense_ledger.py compare \
  --ledger analysis/expense-review/decisions.jsonl \
  --baseline analysis/expense-review/baseline.json \
  --dataset /absolute/path/to/complete-candidate.json \
  --namespace panama-city-pcards \
  --output /absolute/path/to/new-import-review.json
```

The tool rejects duplicate source IDs (including exact duplicates), noninteger amounts, namespace mismatch and broken ledger chains. It reports additions, changed fields, missing IDs, yearly gross/credits/net, and allocation discrepancies. Full transaction fingerprints distinguish absent fields from null/empty values. Importer metadata changes can deliberately cause conservative false alarms; reconcile them rather than disabling evidence checks.

Decision results:
- `eligible_reference`: full dataset and dependency evidence match. Retain its recorded confidence; this is not auto-confirmation.
- `needs_evidence_review`: a member/supporting record changed or disappeared. Suspend reuse until re-reviewed.
- `needs_context_review`: dependencies match but another part of the dataset changed. Check new conflicting notes, alternative originals/refunds, annual editions and rosters before carrying it forward.
- `hold` / `hold_review_new_context`: unresolved or rejected decisions remain unapplied, with new context surfaced for review.

The tool cannot read semantic contradictions or verify external web pages. It conservatively flags dataset drift; an agent reviews the relevant new notes and rechecks dated external sources. Same-data eligibility does not establish external roster freshness. Never turn a previous Likely interpretation into independent proof for a new inference.

## Record a decision or correction

Prepare one JSON object or a list with:
- `decision_id`: stable identity for the interpretation, not its current wording.
- `kind`: travel, refund, asset, merchant, person, exclusion or hold.
- `status`: likely, confirmed, unresolved or rejected. Confirmed requires explicit confirmation evidence, not merely prior publication.
- `scope_ids`: exact transaction IDs affected; `supporting_ids`: independent anchors.
- `conclusion`, `rationale`, `next_evidence`: interpretation, evidence/contradictions, and confirmation or reopening condition.
- `reviewed_at`: ISO date; `provenance`: who/what established it, including user confirmation or source catalog/commit.
- `external_sources`: optional structured citations with URL, retrieval date and archive pointer. Preserve the actual date/coverage; don't invent a fresh lookup.
- `expected_revision`: 0 for new decisions, current revision for a correction. A stale revision is rejected.

```sh
python3 skills/pcards-data-review/scripts/expense_ledger.py record \
  --ledger analysis/expense-review/decisions.jsonl \
  --dataset /absolute/path/to/reviewed-snapshot.json \
  --namespace panama-city-pcards \
  --decisions /absolute/path/to/reviewed-decisions.json
```

Recording fingerprints all members and anchors. Append-only revisions point to the superseded event; the latest revision is current, while the earlier interpretation remains auditable. A hash chain detects alteration or a broken middle; it is not a signed or tamper-proof archive and cannot detect removal of the final events without a separately saved head hash. Back up the ledger and source snapshots together. Keep one ledger per namespace; the writer locks the file and validates a batch before writing.

Accepted decisions still require translation into the owning reviewed catalog/snapshot and relevant regression tests. The ledger does not change accounting, app membership, confidence labels, saved browser reviews or deployment. Publication uses the existing authorization and release workflow. Record excluded and rejected decisions too so new imports don't repeatedly reintroduce them.
