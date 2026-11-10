"""Guard the explicitly published travel snapshot without releasing source comments."""
import json
from pathlib import Path
from datetime import date
root=Path(__file__).resolve().parents[1]
private=json.loads((root/'app/data.json').read_text())
public=json.loads((root/'docs/travel.json').read_text())
original={t['id']:t for t in private['transactions']}
assert set(public)=={'version','records'} and public['version']==1
assert len(public['records'])>=1446
for key,record in public['records'].items():
    assert key in original
    assert set(record)=={'person','group','reason','range','analysis','nonTrip'}
    assert record['person']==(original[key]['person'] if record['group'] or original[key]['travel']!='Not identified as travel' else '')
    assert set(record['analysis'])=={'kind','destinations','evidence','events'}
    assert not record['nonTrip'] or not record['group']
    assert all(not e.get('url') or e['url'].startswith('https://') for e in record['analysis']['evidence'])
    if record['range']:
        r=record['range'];assert set(r)=={'start','end','days','inferred'}
        assert (date.fromisoformat(r['end'])-date.fromisoformat(r['start'])).days+1==r['days']
        assert 0<r['days']<=60
assert len({r['group'] for r in public['records'].values() if r['group']})>168
assert public['records']['TXN00055662']['analysis']['destinations']==['Fayetteville, AR']
assert 'Salt Lake City' in public['records']['TXN00049301']['analysis']['destinations']
assert public['records']['TXN00041922']['nonTrip']
assert all(t['id'] in public['records'] for t in private['transactions'] if t['travel']!='Not identified as travel')
print('Passed: travel-only identity scope, researched groups, date arithmetic, no comment/flag fields, all travel records covered.')
