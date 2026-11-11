# Validation and authorized release

## Locate the implementation that owns production

Inspect git status, remote history and current public assets. This project has had two implementations:

- Older local prototype: `app/travel-research.js` and travel functions in `app/app.js`, mirrored under `docs/`; audits such as `tools/audit_trip_research.cjs` and `tools/audit_travel_backfill.py`.
- Published architecture: `tools/travel-research-catalog.cjs`, `tools/travel-research-engine.cjs`, and `tools/build_travel.cjs` produce `docs/travel.json`. The app reads that snapshot and preserves browser-saved membership reviews, person views and shared allocations. The public data builder filters fields and identities separately.

Select by actual current files and ownership, not by this list alone. Never replace the current production app wholesale with the older local prototype. An isolated checkout of current remote main can integrate scoped changes while leaving a dirty workspace intact. Temporary release directories are disposable evidence, not canonical project dependencies.

## Meaningful checks

Use existing tests appropriate to the owning implementation; read them before claiming coverage. Known entry points include `check_ungrouped_travel.cjs` / `check_trip_research.cjs` for the prototype and `check_travel_research.cjs` / `check_travel_backfill_release.cjs` for the published engine. Older sliced-function harnesses have become incompatible with changed attribution code; a failed harness is not a pass. Diagnose it or document the exact limitation and cover the relevant behavior with current tests.

Check these invariants for changed behavior:

- Source data and full-charge amounts are unchanged by enrichment; allocations and net totals reconcile.
- Reviewed member IDs exist, have required anchors and are unique across groups. No unrelated members are absorbed. Verify separate annual trips and nearby training episodes remain distinct.
- Named recipients on another person’s card are attributed correctly without changing payer identity. Shared allocations reconcile; reviewers’ names do not become travelers.
- Ambiguous rides, generic chains, conflicting cities and missing anchors remain unresolved. Origin parking does not become the destination. Inferred memberships do not fabricate travel dates.
- Full/partial refunds preserve signs and unexplained balances; same-priced purchases for different travelers do not receive the wrong credit.
- Snapshot/source copies agree with the architecture; published data retains its approved schema and exclusions.

Browser checks should cover changed groups, exact amounts, full cancellation labels, source evidence, person-specific views and mobile overflow. Preserve existing manual membership/confirmation/exclusion overrides. Seed test decisions only in an isolated browser context; remove them afterward. Validate representative unrelated navigation and links to catch integration damage.

## Publish only when authorized

Authorization to research, import, or write this skill does not authorize deployment. Prior publication of one batch is not blanket authorization for later additions. Once the current release is explicitly authorized, proceed without asking again for routine release steps.

Review the concrete diff and allowlist only required source, snapshot and regression files. Keep private inputs and local audits out. Confirm no new remote commits would be overwritten; integrate concurrent changes safely. Do not force-push or disrupt others’ work. Follow the user's branch-ownership rules.

Discover current Pages branch/path and custom domain rather than assuming an old GitHub Pages URL. Historically this is `main:/docs` with `pennyping.app`, but verify before release. No hosting settings need changing for ordinary content updates.

Check representative pages before, during and after cutover; preserve the previous healthy release until the replacement is ready. Monitor the actual deployment for the pushed SHA and verify live content, not only build success or HTTP 200. Investigate transient 404s. If a check fails, state the failure and continue authorized diagnosis; request a decision only when necessary.

Verify live associations, totals/refunds, person views, saved-review precedence, desktop/mobile rendering, homepage video/navigation and report/policy links. Respect any private/authenticated routes if introduced later. Report the real live URL, release identity and verified outcome. Keep unpublished follow-up work clearly separate.

## Ledger boundary

Before an import release, resolve the [ledger comparison](decision-ledger.md) for every reused decision and append reviewed revisions with their evidence. Apply accepted changes through the owning catalog/snapshot; the ledger never mutates the site itself. Keep `analysis/expense-review/`, complete source snapshots and audit outputs outside `docs/` and the public artifact. Save the release SHA and verification report separately so published interpretations can be traced back to their ledger revisions.
