#!/usr/bin/env python3
"""Behavior checks for carry-forward safety, source reconciliation and history."""
import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('ledger', Path(__file__).with_name('expense_ledger.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class LedgerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.old = self.root / 'old.json'
        self.new = self.root / 'new.json'
        self.ledger = self.root / 'decisions.jsonl'
        self.rows = [dict(id='charge', amount=10000, fy='FY26', purchaseNotes=['Training'],
                          allocations=[{'amount': 10000}]),
                     dict(id='credit', amount=-10000, fy='FY26', purchaseNotes=['Canceled flight'],
                          allocations=[{'amount': -10000}])]
        self.write(self.old, self.rows)
        self.proposal = dict(decision_id='refund-1', kind='refund', status='likely', scope_ids=['charge'],
                             supporting_ids=['credit'], conclusion='Likely cancellation; net zero, no trip',
                             rationale='Named cancellation credit; reference confirmation needed',
                             reviewed_at='2026-11-11', provenance='Synthetic test', next_evidence='Ticket receipt')
        m.append(self.ledger, self.old, 'test-city', self.proposal)

    def write(self, path, rows):
        path.write_text(json.dumps({'transactions': rows}))

    def check(self, rows):
        self.write(self.new, rows)
        return m.compare(self.ledger, self.new, self.old, 'test-city')

    def test_same_sources_preserve_likely_and_reconcile_credit(self):
        report = self.check(list(reversed(self.rows)))
        self.assertEqual(report['decision_counts'], {'eligible_reference': 1})
        self.assertEqual(report['decisions'][0]['status'], 'likely')
        self.assertEqual(report['candidate']['years']['FY26']['net_cents'], 0)
        self.assertEqual(report['candidate']['allocation_issues'], [])

    def test_changed_note_and_missing_support_suspend_reuse(self):
        changed = copy.deepcopy(self.rows)
        changed[1]['purchaseNotes'] = ['Different conference']
        report = self.check(changed)
        self.assertEqual(report['changed'], [{'id': 'credit', 'fields': ['purchaseNotes']}])
        self.assertEqual(report['decisions'][0]['stale_dependencies'], ['credit'])
        report = self.check(self.rows[:1])
        self.assertEqual(report['missing'], ['credit'])
        self.assertEqual(report['decisions'][0]['result'], 'needs_evidence_review')

    def test_new_context_does_not_silently_reuse_matching_anchors(self):
        report = self.check(self.rows + [dict(id='another-original', amount=10000, fy='FY26', allocations=[{'amount': 10000}])])
        self.assertEqual(report['decision_counts'], {'needs_context_review': 1})
        self.assertEqual(report['new'], ['another-original'])

    def test_revision_history_and_holds(self):
        revised = dict(self.proposal, expected_revision=1, status='unresolved', conclusion='Competing originals')
        m.append(self.ledger, self.old, 'test-city', revised)
        with self.ledger.open() as f:
            events, latest = m.read_ledger(f)
        self.assertEqual(len(events), 2)
        self.assertEqual(events[0]['status'], 'likely')
        self.assertEqual(latest['refund-1']['supersedes'], events[0]['event_hash'])
        self.assertEqual(self.check(self.rows)['decision_counts'], {'hold': 1})
        before = self.ledger.read_bytes()
        with self.assertRaisesRegex(ValueError, 'expected_revision'):
            m.append(self.ledger, self.old, 'test-city', revised)
        self.assertEqual(before, self.ledger.read_bytes())

    def test_duplicate_ids_invalid_money_namespace_and_tampering(self):
        with self.assertRaisesRegex(ValueError, 'Duplicate source ID'):
            self.check(self.rows + [self.rows[0]])
        changed = copy.deepcopy(self.rows)
        changed[0]['amount'] = 100.0
        with self.assertRaisesRegex(ValueError, 'integer cents'):
            self.check(changed)
        with self.assertRaisesRegex(ValueError, 'namespace'):
            m.compare(self.ledger, self.old, self.old, 'other-city')
        self.ledger.write_text(self.ledger.read_text().replace('Training', 'Other') if 'Training' in self.ledger.read_text()
                               else self.ledger.read_text().replace('likely', 'confirmed'))
        with self.ledger.open() as f, self.assertRaisesRegex(ValueError, 'integrity'):
            m.read_ledger(f)

    def test_missing_vs_empty_and_allocation_mismatch(self):
        changed = copy.deepcopy(self.rows)
        del changed[0]['purchaseNotes']
        changed[0]['allocations'][0]['amount'] = 1
        report = self.check(changed)
        self.assertEqual(report['decisions'][0]['result'], 'needs_evidence_review')
        self.assertEqual(report['candidate']['allocation_issues'][0]['id'], 'charge')

    def test_failed_batch_does_not_partially_append(self):
        before = self.ledger.read_bytes()
        good = dict(self.proposal, decision_id='other')
        bad = dict(self.proposal, decision_id='invalid', supporting_ids=['absent'])
        with self.assertRaisesRegex(ValueError, 'Missing source'):
            m.append(self.ledger, self.old, 'test-city', [good, bad])
        self.assertEqual(self.ledger.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()
