"""Check the existing public budget release without reading or rebuilding private data."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import re

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(); self.ids = []; self.links = []; self.assets = []
        self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag in ('script', 'img', 'link'):
            value = a.get('src') or a.get('href')
            if value: self.assets.append(value)

def check_page(path, anchors=True):
    page = Page(path)
    assert len(page.ids) == len(set(page.ids)), f'Duplicate IDs: {path}'
    for value in page.links + page.assets:
        url = urlsplit(value)
        if url.scheme or url.netloc: continue
        target = (path.parent / unquote(url.path)).resolve() if url.path else path
        if target.is_dir(): target /= 'index.html'
        assert target.is_relative_to(DOCS.resolve()), f'Escaping public root: {value}'
        assert target.is_file(), f'Missing local target: {path}: {value}'
        if anchors and url.fragment:
            # The explorer renders these routes in JavaScript, not as HTML IDs.
            if target == (DOCS / 'review/index.html').resolve():
                route = url.fragment.split('?', 1)[0]
                assert route in {'travel', 'radar', 'transactions'}, f'Unknown explorer route: {value}'
            else:
                assert unquote(url.fragment) in Page(target).ids, f'Missing anchor: {value}'
    return page

def amount(text):
    return int(re.sub(r'[^0-9-]', '', text.replace('−', '-')))

for relative in ('index.html','budget/index.html'):
    check_page(DOCS / relative)
check_page(DOCS / 'review/index.html', anchors=False)
home = (DOCS / 'index.html').read_text()
assert 'Preview for review' not in home
assert 'Watch how Panama City’s money flows' in home
assert 'dh4u92jk35' in home
assert all(f'id="{topic}"' in home for topic in ['watch', 'at-a-glance', 'revenue', 'expenses', 'housing', 'budget-words'])
assert 'http-equiv="refresh"' not in (DOCS/'review/index.html').read_text()
funding = (DOCS/'budget/index.html').read_text()
funds = re.findall(r'<details class="fund-detail">(.*?)</details>', funding, re.S)
assert len(funds) == 19
fund_totals = []
for fund in funds:
    total = amount(re.search(r'<summary>.*?<strong>(.*?)</strong>', fund, re.S)[1])
    rows = re.findall(r'<td>(.*?)</td>', fund, re.S)
    values = [amount(v) for v in rows]
    assert sum(values[:-1]) == total == values[-1], 'Fund line items do not reconcile'
    fund_totals.append(total)
assert sum(fund_totals) == 87669932 == 150263913 - 62593981
summary = re.search(r'<table class="complete-funding">(.*?)</table>', funding, re.S)[1]
values = [amount(re.findall(r'<td>(.*?)</td>', row, re.S)[-1]) for row in re.findall(r'<tr[^>]*>(.*?)</tr>', summary, re.S) if '<td>' in row]
assert sum(values[:-1]) == values[-1] == 87669932
public = json.loads((DOCS/'review/data.json').read_text())
assert len(public['transactions']) == 16793
assert len({t['id'] for t in public['transactions']}) == 16793
assert all(t['comments'] == [] and t['flags'] == [] for t in public['transactions'])
for fy, expected in [('FY25',228954946),('FY26',246143299)]:
    assert sum(t['amount'] for t in public['transactions'] if t['fy']==fy) == expected
for name in ('index.html','style.css','app.js','assets.js','merchant-context.js','radar.js'):
    assert (ROOT/'app'/name).read_bytes() == (DOCS/'review'/name).read_bytes(), f'Stale explorer code: {name}'
assert (DOCS/'CNAME').read_text().strip() == 'pennyping.app'
print('PASS: budget/explorer local links, assets, 19 fund totals, funding groups, 16,793 public records, accounting totals, raw-history exclusion, source/build parity and domain.')
