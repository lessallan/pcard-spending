"""Build the public dashboard with only approved leadership identities."""
from pathlib import Path
import json
import shutil
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs'
OUT.mkdir(exist_ok=True)
for name in ('index.html', 'style.css', 'app.js', 'penny-ping-logo.png', 'porchping-logo.svg'):
    shutil.copyfile(ROOT / 'app' / name, OUT / name)
private = json.loads((ROOT / 'app/data.json').read_text())
leadership = json.loads((ROOT / 'app/leadership.json').read_text())
allowed_names = set(leadership['cardholders'].values())
fields = ('id', 'fy', 'date', 'post', 'merchant', 'raw', 'category', 'amount', 'allocations', 'source', 'sheet', 'rows', 'travel', 'mixed', 'historical')
public = {key: private[key] for key in ('checks', 'generated', 'policyStart')}
public['staff'] = []
for name, title in leadership['profiles']:
    profile = next(p for p in private['staff'] if p['name'] == name and p['title'] == title)
    public['staff'].append({key: profile[key] for key in ('name', 'title', 'departments', 'source_url')})
    public['staff'][-1]['email'] = None
public['transactions'] = []
for original in private['transactions']:
    transaction = {key: original[key] for key in fields}
    transaction.update(person=original['person'] if original['person'] in allowed_names else '', comments=[], flags=[])
    if transaction['category'] == 'Outside first-pass scope':
        transaction['category'] = 'Other purchases'
    public['transactions'].append(transaction)
(OUT / 'data.json').write_text(json.dumps(public, ensure_ascii=False, separators=(',', ':')))
policy = Path('policies/panama-city/purchasing-card-policy-2025-06-24.pdf')
(OUT / policy).parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(ROOT / policy, OUT / policy)
(OUT / '.nojekyll').touch()
# Preserve the existing retirement of review reports and the configured CNAME.
for relative, target in [('review/index.html', '../'), ('review/reports/merchant-review.html', '../../')]:
    legacy = OUT / relative
    legacy.parent.mkdir(parents=True, exist_ok=True)
    legacy.write_text('<!doctype html><html lang="en"><meta charset="utf-8"><title>Penny Ping</title><meta http-equiv="refresh" content="0;url=' + target + '"><p><a href="' + target + '">Explore City spending</a></p></html>')
print('Built public dashboard: approved leadership only; other identities, comments and flags excluded.')
