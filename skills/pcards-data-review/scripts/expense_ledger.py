#!/usr/bin/env python3
"""Append-only expense decisions and conservative import comparison. Never publishes."""
import argparse
import collections
import datetime
import fcntl
import hashlib
import json
from pathlib import Path

KINDS = {'travel', 'refund', 'asset', 'merchant', 'person', 'exclusion', 'hold'}
STATUSES = {'likely', 'confirmed', 'unresolved', 'rejected'}


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False).encode()).hexdigest()


def dataset(path):
    doc = json.loads(Path(path).read_text())
    rows = doc['transactions']
    by = {}
    for row in rows:
        if not isinstance(row.get('id'), str) or not row['id']:
            raise ValueError('Every transaction needs a nonempty source ID')
        if row['id'] in by:
            raise ValueError('Duplicate source ID: ' + row['id'])
        if type(row.get('amount')) is not int:
            raise ValueError('Amounts must be integer cents: ' + row['id'])
        by[row['id']] = row
    return by


def dataset_digest(by):
    return digest({key: digest(value) for key, value in sorted(by.items())})


def read_ledger(stream):
    events, latest, previous = [], {}, None
    for number, line in enumerate(stream, 1):
        if not line.strip():
            raise ValueError(f'Empty ledger line {number}')
        event = json.loads(line)
        payload = {k: v for k, v in event.items() if k != 'event_hash'}
        if event.get('event_hash') != digest(payload) or event.get('previous_event_hash') != previous:
            raise ValueError(f'Ledger integrity failure at line {number}')
        old = latest.get(event['decision_id'])
        if event['revision'] != (old['revision'] + 1 if old else 1):
            raise ValueError('Invalid revision sequence')
        if event.get('supersedes') != (old['event_hash'] if old else None):
            raise ValueError('Invalid superseded revision')
        events.append(event)
        latest[event['decision_id']] = event
        previous = event['event_hash']
    return events, latest


def append(ledger, source, namespace, proposals):
    by = dataset(source)
    source_digest = dataset_digest(by)
    if not namespace.strip():
        raise ValueError('Dataset namespace required')
    if isinstance(proposals, dict):
        proposals = [proposals]
    if not isinstance(proposals, list) or not proposals:
        raise ValueError('Provide one or more decisions')
    ledger = Path(ledger)
    ledger.parent.mkdir(parents=True, exist_ok=True)
    with ledger.open('a+', encoding='utf-8') as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        f.seek(0)
        events, latest = read_ledger(f)
        if any(e['namespace'] != namespace for e in events):
            raise ValueError('Ledger namespace differs from import')
        pending = []
        previous = events[-1]['event_hash'] if events else None
        for proposal in proposals:
            for key in ['decision_id', 'kind', 'status', 'conclusion', 'rationale', 'reviewed_at', 'provenance', 'next_evidence']:
                if not isinstance(proposal.get(key), str) or not proposal[key].strip():
                    raise ValueError('Missing decision field: ' + key)
            datetime.date.fromisoformat(proposal['reviewed_at'])
            if proposal['kind'] not in KINDS or proposal['status'] not in STATUSES:
                raise ValueError('Invalid decision kind/status')
            ids = proposal.get('scope_ids')
            anchors = proposal.get('supporting_ids', [])
            if not isinstance(ids, list) or not ids or not isinstance(anchors, list):
                raise ValueError('scope_ids must be nonempty and supporting_ids must be a list')
            if len(set(ids)) != len(ids) or len(set(anchors)) != len(anchors):
                raise ValueError('Duplicate decision IDs')
            dependencies = sorted(set(ids + anchors))
            if any(key not in by for key in dependencies):
                raise ValueError('Missing source/supporting record')
            old = latest.get(proposal['decision_id'])
            if proposal.get('expected_revision', 0) != (old['revision'] if old else 0):
                raise ValueError('Stale or missing expected_revision: ' + proposal['decision_id'])
            evidence = proposal.get('external_sources', [])
            if not isinstance(evidence, list):
                raise ValueError('external_sources must be a list')
            event = {key: proposal[key] for key in ['decision_id', 'kind', 'status', 'conclusion', 'rationale', 'reviewed_at', 'provenance', 'next_evidence']}
            event.update(schema_version=1, namespace=namespace, revision=old['revision'] + 1 if old else 1,
                         supersedes=old['event_hash'] if old else None, previous_event_hash=previous,
                         scope_ids=ids, supporting_ids=anchors, external_sources=evidence,
                         dataset_digest=source_digest, dependencies={key: digest(by[key]) for key in dependencies},
                         recorded_at=datetime.datetime.now(datetime.timezone.utc).isoformat())
            event['event_hash'] = digest(event)
            pending.append(event)
            latest[event['decision_id']] = event
            previous = event['event_hash']
        # Validate the entire batch before writing any event. Lock prevents interleaved writers.
        f.write(''.join(json.dumps(e, ensure_ascii=False, sort_keys=True) + '\n' for e in pending))
        f.flush()
        import os
        os.fsync(f.fileno())
    return {'appended': len(pending), 'latest_decisions': len(latest)}


def totals(by):
    years = collections.defaultdict(lambda: {'count': 0, 'positive_cents': 0, 'credit_cents': 0, 'net_cents': 0})
    allocation_issues = []
    for row in by.values():
        year = years[row.get('fy') or 'Unknown']
        year['count'] += 1
        year['net_cents'] += row['amount']
        year['positive_cents' if row['amount'] >= 0 else 'credit_cents'] += row['amount']
        allocations = row.get('allocations')
        if not isinstance(allocations, list) or any(type(a.get('amount')) is not int for a in allocations):
            allocation_issues.append({'id': row['id'], 'issue': 'missing or invalid allocations'})
        elif sum(a['amount'] for a in allocations) != row['amount']:
            allocation_issues.append({'id': row['id'], 'issue': 'allocation sum differs from full charge'})
    return {'transaction_count': len(by), 'years': dict(years), 'allocation_issues': allocation_issues}


def compare(ledger, source, baseline, namespace):
    current, prior = dataset(source), dataset(baseline)
    with Path(ledger).open() as f:
        events, latest = read_ledger(f)
    if any(e['namespace'] != namespace for e in events):
        raise ValueError('Ledger namespace differs from import')
    new, missing = sorted(current.keys() - prior.keys()), sorted(prior.keys() - current.keys())
    changed = []
    for key in sorted(current.keys() & prior.keys()):
        if digest(current[key]) != digest(prior[key]):
            fields = [field for field in sorted(current[key].keys() | prior[key].keys())
                      if (field in current[key]) != (field in prior[key]) or current[key].get(field) != prior[key].get(field)]
            changed.append({'id': key, 'fields': fields})
    decisions = []
    current_digest = dataset_digest(current)
    for event in latest.values():
        stale = [key for key, sha in event['dependencies'].items() if key not in current or digest(current[key]) != sha]
        if stale:
            result = 'needs_evidence_review'
        elif event['status'] in {'unresolved', 'rejected'}:
            result = 'hold' if event['dataset_digest'] == current_digest else 'hold_review_new_context'
        elif event['dataset_digest'] != current_digest:
            result = 'needs_context_review'
        else:
            result = 'eligible_reference'
        decisions.append({'decision_id': event['decision_id'], 'revision': event['revision'], 'status': event['status'],
                          'result': result, 'stale_dependencies': stale, 'scope_ids': event['scope_ids'],
                          'next_evidence': event['next_evidence']})
    return {'namespace': namespace, 'baseline_digest': dataset_digest(prior), 'candidate_digest': current_digest,
            'baseline': totals(prior), 'candidate': totals(current),
            'new': new, 'missing': missing, 'changed': changed,
            'unchanged_count': len(current.keys() & prior.keys()) - len(changed),
            'decision_counts': dict(collections.Counter(d['result'] for d in decisions)), 'decisions': decisions,
            'limitation': 'Evidence comparison only. No automatic categorization, semantic contradiction detection, decision application, or publication.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    record = sub.add_parser('record')
    record.add_argument('--decisions', required=True)
    check = sub.add_parser('compare')
    check.add_argument('--baseline', required=True)
    check.add_argument('--output', required=True)
    for command in [record, check]:
        command.add_argument('--ledger', required=True)
        command.add_argument('--dataset', required=True)
        command.add_argument('--namespace', required=True)
    args = parser.parse_args()
    try:
        if args.command == 'record':
            print(json.dumps(append(args.ledger, args.dataset, args.namespace, json.loads(Path(args.decisions).read_text()))))
        else:
            # Prevent an output path from overwriting inputs or an earlier review artifact.
            result = compare(args.ledger, args.dataset, args.baseline, args.namespace)
            with Path(args.output).open('x') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
                f.write('\n')
            print(json.dumps({'output': args.output, 'new': len(result['new']), 'changed': len(result['changed']),
                              'missing': len(result['missing']), 'decisions': result['decision_counts']}))
    except (ValueError, KeyError, TypeError, OSError) as exc:
        parser.exit(1, str(exc) + '\n')


if __name__ == '__main__':
    main()
