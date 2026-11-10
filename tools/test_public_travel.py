"""Guard the explicitly published travel snapshot without releasing source comments."""
import json
from pathlib import Path
from datetime import date
root=Path(__file__).resolve().parents[1]
private=json.loads((root/'app/data.json').read_text())
public=json.loads((root/'docs/travel.json').read_text())
original={t['id']:t for t in private['transactions']}
assert set(public)=={'version','records'} and public['version']==1
assert len(public['records'])==1113
for key,record in public['records'].items():
    assert key in original
    assert set(record)=={'person','group','reason','range'}
    assert record['person']==original[key]['person']
    assert original[key]['travel']!='Not identified as travel' or record['group']
    if record['range']:
        r=record['range'];assert set(r)=={'start','end','days','inferred'}
        assert (date.fromisoformat(r['end'])-date.fromisoformat(r['start'])).days+1==r['days']
        assert 0<r['days']<=60
assert len({r['group'] for r in public['records'].values() if r['group']})==168
assert all(t['id'] in public['records'] for t in private['transactions'] if t['travel']!='Not identified as travel')
print('Passed: travel-only identity scope, 168 suggested groups, date arithmetic, no comment/flag fields, all travel records covered.')
