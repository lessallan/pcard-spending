"""Build the public app using an explicit file allowlist; publish the explicitly approved transaction dataset."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs'
OUT.mkdir(exist_ok=True)
for name in ('index.html', 'style.css', 'app.js', 'spending-blaze-logo.png'):
    shutil.copyfile(ROOT / 'app' / name, OUT / name)
# Employee identities and free-text comments stay in the private input only.
import json
private_data = json.loads((ROOT / 'app/data.json').read_text())
public_fields = ('id', 'fy', 'date', 'post', 'merchant', 'raw', 'category', 'amount', 'allocations', 'source', 'sheet', 'rows', 'travel', 'mixed', 'historical')
public_data = {k: private_data[k] for k in ('checks', 'generated', 'policyStart')}
public_data['staff'] = []
public_data['transactions'] = [{**{k: t[k] for k in public_fields}, 'comments': [], 'flags': []} for t in private_data['transactions']]
for transaction in public_data['transactions']:
    if transaction['category'] == 'Outside first-pass scope':
        transaction['category'] = 'Other purchases'
(OUT / 'data.json').write_text(json.dumps(public_data, ensure_ascii=False, separators=(',', ':')))

policy = Path('policies/panama-city/purchasing-card-policy-2025-06-24.pdf')
(OUT / policy).parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(ROOT / policy, OUT / policy)
(OUT / '.nojekyll').touch()
# The public app opens the approved data automatically; no local files required.
import re
html = (OUT / 'index.html').read_text()
html = re.sub(r'<section class="data-picker">.*?</section>', '', html)
html = html.replace('Open a dataset to explore spending.', 'Loading spending records…')
html = html.replace('Browser workspace', 'Public spending dashboard')
(OUT / 'index.html').write_text(html)
js = (OUT / 'app.js').read_text()
js = js.replace("$('dataset-error').textContent='';", '')
js = js[:js.index("$('dataset').addEventListener")]
js += "fetch('./data.json?v=transparency-2').then(r=>{if(!r.ok)throw Error();return r.json()}).then(loadDataset).catch(()=>{$('loading').hidden=false;$('loading').textContent='Spending records could not load. Reload this page to try again.'});\n"
(OUT / 'app.js').write_text(js)
print('Built public app with the approved transaction dataset.')

# Retired review-oriented reports are not part of the public transparency app.
for relative, target in [('review/index.html', '../'), ('review/reports/merchant-review.html', '../../')]:
    legacy = OUT / relative
    legacy.parent.mkdir(parents=True, exist_ok=True)
    legacy.write_text('<!doctype html><html lang="en"><meta charset="utf-8"><title>Spending Blaze</title><meta http-equiv="refresh" content="0;url=' + target + '"><p><a href="' + target + '">Explore City spending</a></p></html>')
