"""Build the public app using an explicit file allowlist; publish the explicitly approved transaction dataset."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs'
OUT.mkdir(exist_ok=True)
for name in ('index.html', 'style.css', 'app.js', 'spending-blaze-logo.png', 'data.json'):
    shutil.copyfile(ROOT / 'app' / name, OUT / name)
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
js += "fetch('./data.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(loadDataset).catch(()=>{$('loading').hidden=false;$('loading').textContent='Spending records could not load. Reload this page to try again.'});\n"
(OUT / 'app.js').write_text(js)
print('Built public app with the approved transaction dataset.')

# Preserve the independent public report alongside the browser workspace.
import runpy
runpy.run_path(str(ROOT / "scripts/build-site.py"), run_name="__main__")
