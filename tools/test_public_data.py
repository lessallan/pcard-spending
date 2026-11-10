"""Guard the public publication boundary and preserve accounting totals."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
public = json.loads((root / 'docs/data.json').read_text())
assert public['staff'] == []
allowed = {'id', 'fy', 'date', 'post', 'merchant', 'raw', 'category', 'amount', 'allocations', 'source', 'sheet', 'rows', 'travel', 'mixed', 'historical', 'comments', 'flags'}
for transaction in public['transactions']:
    assert set(transaction) <= allowed
    assert transaction['comments'] == []
    assert transaction['flags'] == []
    assert transaction['category'] != 'Outside first-pass scope'
private_path = root / 'app/data.json'
if private_path.exists():
    private = json.loads(private_path.read_text())
    assert len(private['transactions']) == len(public['transactions'])
    for original, published in zip(private['transactions'], public['transactions']):
        for field in ('id', 'amount', 'allocations', 'date', 'post', 'fy'):
            assert original[field] == published[field]
    payload = json.dumps(public).casefold()
    for name in {t['person'] for t in private['transactions'] if t.get('person') and t['person'] != 'Unassigned'}:
        assert name.casefold() not in payload
print('Public privacy boundary and accounting checks passed.')
