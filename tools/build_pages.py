"""Build the public app using an explicit file allowlist; never copy datasets."""
from pathlib import Path
import shutil
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs'
OUT.mkdir(exist_ok=True)
for name in ('index.html', 'style.css', 'app.js', 'spending-blaze-logo.png'):
    shutil.copyfile(ROOT / 'app' / name, OUT / name)
policy = Path('policies/panama-city/purchasing-card-policy-2025-06-24.pdf')
(OUT / policy).parent.mkdir(parents=True, exist_ok=True)
shutil.copyfile(ROOT / policy, OUT / policy)
(OUT / '.nojekyll').touch()
print('Built public app without transaction data or staff records.')
