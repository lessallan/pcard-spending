"""Build the public dashboard with only approved leadership identities."""
from pathlib import Path
import json
import shutil
import subprocess
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs'
OUT.mkdir(exist_ok=True)
for name in ('index.html', 'style.css', 'app.js', 'merchant-context.js', 'penny-ping-logo.png', 'porchping-logo.svg'):
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
    photo = leadership.get('photos', {}).get(name)
    if photo:
        if Path(photo).name != photo:
            raise ValueError('Leadership photo must be a filename')
        (OUT / 'photos').mkdir(exist_ok=True)
        shutil.copyfile(ROOT / 'assets/leadership' / photo, OUT / 'photos' / photo)
        public['staff'][-1]['photo_file'] = 'photos/' + photo
# Explicitly approved: extracted purchase notes may contain names/details from comments.
# Raw histories, flags, cardholder identity allowlist and accounting fields stay unchanged.
notes_by_id = json.loads(subprocess.check_output(['node', '-e', "const fs=require('fs');const {purchaseNotes}=require('./app/merchant-context.js');const d=JSON.parse(fs.readFileSync('app/data.json'));process.stdout.write(JSON.stringify(Object.fromEntries(d.transactions.map(t=>[t.id,purchaseNotes(t.comments)]))));"], cwd=ROOT))
public['transactions'] = []
for original in private['transactions']:
    transaction = {key: original[key] for key in fields}
    transaction.update(person=original['person'] if original['person'] in allowed_names else '', comments=[], flags=[])
    if transaction['category'] == 'Outside first-pass scope':
        transaction['category'] = 'Other purchases'
    transaction['purchaseNotes'] = notes_by_id[original['id']]
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
print('Built public dashboard: approved leadership only; cardholder identities restricted; extracted purchase notes included; raw comments and flags excluded.')

subprocess.run(['node', 'tools/build_travel.cjs'], cwd=ROOT, check=True)

subprocess.run(['node', 'tools/build_leadership_associations.cjs'], cwd=ROOT, check=True)
