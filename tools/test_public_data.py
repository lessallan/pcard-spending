"""Guard the approved publication boundary and preserve accounting totals."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
public = json.loads((root / 'docs/data.json').read_text())
private = json.loads((root / 'app/data.json').read_text())
approved = json.loads((root / 'app/leadership.json').read_text())
assert len(approved['profiles']) == len(public['staff']) == 24
assert len(set(p['name'] for p in public['staff'])) == 24
assert [(p['name'], p['title']) for p in public['staff']] == [tuple(p) for p in approved['profiles']]
assert all(set(p) == ({'name','title','departments','source_url','email'} | ({'photo_file'} if p['name'] in approved.get('photos', {}) else set())) and p['email'] is None for p in public['staff'])
cardholders = set(approved['cardholders'].values())
assert len(cardholders) == 21
assert len(private['transactions']) == len(public['transactions']) == 16793
fields = {'id','fy','date','post','merchant','raw','category','amount','allocations','source','sheet','rows','travel','mixed','historical','person','comments','flags'}
for original, published in zip(private['transactions'], public['transactions']):
    assert set(published) == fields
    assert published['person'] == (original['person'] if original['person'] in cardholders else '')
    assert published['comments'] == published['flags'] == []
    assert published['category'] != 'Outside first-pass scope'
    for field in ('id','amount','allocations','date','post','fy'):
        assert original[field] == published[field]
for fy, expected in [('FY25',228954946),('FY26',246143299)]:
    assert sum(t['amount'] for t in public['transactions'] if t['fy']==fy) == expected
payload = json.dumps(public).casefold()
for person in {t['person'] for t in private['transactions']} - cardholders - {'Unassigned'}:
    assert person.casefold() not in payload, 'Non-approved cardholder in public data'
for profile in private['staff']:
    if profile['name'] not in {p['name'] for p in public['staff']}:
        assert profile['name'].casefold() not in payload, 'Non-approved staff profile in public data'
assert min(t['date'] for t in public['transactions']) == '2024-08-27'
assert max(t['date'] for t in public['transactions']) == '2026-09-30'
assert (root/'docs/CNAME').read_text().strip() == 'pennyping.app'
print('Passed: 24 approved profiles, 21 exact cardholder links, no other identities/comments/flags, all accounting records/totals retained, dates and domain preserved.')

for profile in public['staff']:
    photo = approved.get('photos', {}).get(profile['name'])
    if photo:
        assert profile['photo_file'] == 'photos/' + photo
        assert (root/'docs/photos'/photo).read_bytes() == (root/'assets/leadership'/photo).read_bytes()
assert {p.name for p in (root/'docs/photos').iterdir()} == set(approved['photos'].values())
print('Passed: all selected portraits published and no extra photos included.')
