"""Build the public site from the reviewed Markdown and aggregate CSV only.
Run: python3 scripts/build-site.py. No third-party dependencies or network needed.
"""
from pathlib import Path
import csv, html, re, shutil
from decimal import Decimal
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs/review"
for directory in (OUT, OUT/"reports", OUT/"policies/panama-city", OUT/"assets"):
    directory.mkdir(parents=True, exist_ok=True)
def esc(s): return html.escape(str(s), quote=True)
def inline(s):
    s = esc(s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    return re.sub(r'\[([^]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)
def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
def markdown(source):
    # This deliberately small renderer supports the reviewed reports' headings,
    # paragraphs, unordered lists, inline links/emphasis/code, and pipe tables.
    lines=source.splitlines(); result=[]; i=0
    while i<len(lines):
        line=lines[i]
        if not line.strip(): i+=1; continue
        if line.startswith('#'):
            marks,title=line.split(' ',1); result.append(f'<h{len(marks)} id="{slug(title)}">{inline(title)}</h{len(marks)}>'); i+=1
        elif line.startswith('|'):
            rows=[]
            while i<len(lines) and lines[i].startswith('|'):
                rows.append([s.strip() for s in lines[i].strip('|').split('|')]); i+=1
            result.append('<div class="table-scroll" role="region" aria-label="Report data table" tabindex="0"><table><thead><tr>'+''.join('<th scope="col">'+inline(v)+'</th>' for v in rows[0])+'</tr></thead><tbody>')
            for row in rows[2:]: result.append('<tr>'+''.join('<td>'+inline(v)+'</td>' for v in row)+'</tr>')
            result.append('</tbody></table></div>')
        elif line.startswith('- '):
            result.append('<ul>')
            while i<len(lines) and lines[i].startswith('- '): result.append('<li>'+inline(lines[i][2:])+'</li>'); i+=1
            result.append('</ul>')
        else:
            p=[]
            while i<len(lines) and lines[i].strip(): p.append(lines[i]); i+=1
            result.append('<p>'+inline(' '.join(p))+'</p>')
    return '\n'.join(result)
def page(title, content, active, prefix=''):
    nav=[('Overview',prefix+'index.html','overview'),('Spending report',prefix+'reports/merchant-review.html','report'),('Documents <span>4</span>',prefix+'policies/panama-city/index.html','docs')]
    links=''.join(f'<a href="{url}"'+(' aria-current="page"' if key==active else '')+f'>{label}</a>' for label,url,key in nav)
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)} | Spending Blaze</title><meta name="description" content="Explore Panama City purchasing-card spending for FY25 and FY26, with aggregate merchant data, methodology, and source documents."><link rel="stylesheet" href="{prefix}assets/site.css"><script src="{prefix}assets/site.js" defer></script></head>
<body><a class="skip" href="#main">Skip to content</a><div class="topline"><div class="wrap">Independent public-records review <span>Panama City, Florida · FY25–FY26</span></div></div>
<header><div class="wrap header-inner"><a class="brand" href="{prefix}index.html">Spending<span>Blaze</span><small>Follow the spending. Read the sources.</small></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" hidden>Menu</button><nav id="navigation" aria-label="Main navigation">{links}</nav></div></header>
<main id="main">{content}</main><footer><div class="wrap footer-inner"><div><strong>Spending Blaze</strong><p>Independent analysis. Public sources. Open questions.</p><p>Not an official City of Panama City website.</p></div><div><a href="{prefix}reports/merchant-summary.csv" download>Download merchant data (CSV)</a><a href="{prefix}reports/merchant-review.html#scope-and-method">Methodology &amp; limitations</a><span>Analysis updated November 9, 2026</span></div></div></footer></body></html>'''
rows=list(csv.DictReader((ROOT/'reports/merchant-summary.csv').open()))
money=lambda v: '${:,.2f}'.format(Decimal(v))
net=sum(Decimal(r['net']) for r in rows); count=sum(int(r['transactions']) for r in rows)
assert net==Decimal('1364397.35') and count==7477
categories=sorted({r['category'] for r in rows})
trs=[]
for r in rows:
    trs.append(f'''<tr data-merchant="{esc(r['merchant'])}" data-category="{esc(r['category'])}" data-net="{r['net']}" data-fy25="{r['FY25_net']}" data-fy26="{r['FY26_net']}" data-count="{r['transactions']}" data-count25="{r['FY25_transactions']}" data-count26="{r['FY26_transactions']}"><th scope="row">{esc(r['merchant'])}<small>{esc(r['category'])}</small></th><td>{money(r['FY25_net'])}</td><td>{money(r['FY26_net'])}</td><td class="net"><strong>{money(r['net'])}</strong></td><td class="count">{int(r['transactions']):,}</td></tr>''')
bars=''.join(f'<div class="bar-row"><div><span>{esc(r["merchant"])}</span><strong>{money(r["net"])}</strong></div><div class="bar-track"><span style="width:{float(r["net"])/float(rows[0]["net"])*100:.2f}%"></span></div></div>' for r in rows[:5])
content=f'''<section class="hero"><div class="wrap hero-grid"><div><p class="eyebrow">PANAMA CITY P-CARD REVIEW / 2024–2026</p><h1>A clearer view of<br>public spending.</h1><p class="lede">Explore purchasing-card spending at selected merchants, understand what the records show, and read the documents behind the review.</p><div class="actions"><a class="button primary" href="#merchants">Explore merchant spending <span aria-hidden="true">↗</span></a><a class="text-link" href="reports/merchant-review.html">Read the full report →</a></div><p class="fine">A starting point for itemized-receipt review—not a finding of waste or improper spending.</p></div><div class="hero-art"><img src="assets/spending-blaze-logo.png" width="1536" height="1024" alt="Spending Blaze orange dragon logo"><span>PUBLIC RECORDS. A CLOSER LOOK.</span></div></div></section>
<section class="metrics"><div class="wrap stats"><div><span>Selected merchant net spending</span><strong>{money(net)}</strong><small>Purchases minus credits · both fiscal years</small></div><div><span>Transactions reviewed</span><strong>{count:,}</strong><small>Includes 315 credits</small></div><div><span>Selected merchants</span><strong>{len(rows)}</strong><small>Across five retail groups</small></div></div></section>
<div class="wrap"><aside class="notice"><strong>Read the numbers with context</strong><p>FY25 detail is $136,616.98 below the workbook summary. The difference remains unresolved; FY26 reconciles. These are selected merchant totals, not total city spending. <a href="reports/merchant-review.html#reconciliation-limitation">Read the limitation →</a></p></aside></div>
<section class="section"><div class="wrap split"><div><p class="eyebrow">01 / AT A GLANCE</p><h2>Where the selected<br>spending goes</h2><p>The five largest merchants in this review, ranked by combined net spending for FY25 and FY26.</p><p class="fine">Merchant names group known name variants. A store name alone does not tell us what was purchased.</p></div><div class="bars">{bars}<p class="fine">Dollar amounts reflect available detailed records.</p></div></div></section>
<section id="merchants" class="section merchant-section"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">02 / EXPLORE THE DATA</p><h2>Merchant spending</h2></div><a class="text-link" href="reports/merchant-summary.csv" download>Download all data (CSV) ↓</a></div><p>Compare fiscal years, search a merchant, or narrow the review by category.</p><div class="filters" hidden><label>Search merchants<input id="search" name="search" type="search" placeholder="Try Amazon or Lowe’s"></label><label>Category<select id="category" name="category"><option value="">All categories</option>{''.join(f'<option>{esc(c)}</option>' for c in categories)}</select></label><label>Sort by<select id="sort" name="sort"><option value="net">Combined spending: high to low</option><option value="fy25">FY25 spending: high to low</option><option value="fy26">FY26 spending: high to low</option><option value="name">Merchant: A–Z</option></select></label><button class="reset" type="button">Reset</button></div><div class="result-line" aria-live="polite" id="result-count">30 merchants · $1,364,397.35 combined net spending</div><p class="fine mobile-hint">Swipe the table to compare both fiscal years.</p><div class="table-scroll" tabindex="0" role="region" aria-label="Merchant spending comparison"><table id="merchant-table"><caption class="sr-only">Selected merchant net spending and transaction counts, FY25 and FY26</caption><thead><tr><th scope="col">Merchant</th><th scope="col">FY25 net</th><th scope="col">FY26 net</th><th scope="col">Combined net</th><th scope="col">Transactions</th></tr></thead><tbody>{''.join(trs)}</tbody></table></div><p class="empty" hidden>No merchants match these filters. Try another name or reset the filters.</p><p class="fine">Net spending includes credits. FY25: Oct. 1, 2024–Sept. 30, 2025. FY26: Oct. 1, 2025–Sept. 30, 2026. Posting dates determine fiscal years.</p></div></section>
<section class="section"><div class="wrap resources"><div><p class="eyebrow">03 / FOLLOW THE SOURCES</p><h2>The context behind<br>the numbers</h2><p>Review the method, unresolved questions, and original policy documents before drawing conclusions.</p></div><div class="resource-list"><a href="reports/merchant-review.html"><span class="resource-type">ANALYSIS</span><h3>Read the full spending report <span>↗</span></h3><p>Scope, merchant totals, receipt-review priorities, and limitations.</p></a><a href="policies/panama-city/index.html"><span class="resource-type">4 SOURCE DOCUMENTS</span><h3>Browse purchasing policies <span>↗</span></h3><p>Policy manuals, the adoption resolution, and commission minutes.</p></a></div></div></section>'''
(OUT/'index.html').write_text(page('Panama City spending review',content,'overview'))
report=(ROOT/'reports/merchant-review.md').read_text()
headings=re.findall(r'^## (.+)$',report,re.M)
toc=''.join(f'<a href="#{slug(h)}">{esc(h)}</a>' for h in headings)
reportbody=markdown(report)
reportbody=reportbody.replace('<h1 id="broad-selection-merchant-review-fy25-and-fy26">Broad-selection merchant review — FY25 and FY26</h1>','<p class="eyebrow">THE FULL REPORT / FY25–FY26</p><h1>Merchant spending review</h1>')
(OUT/'reports/merchant-review.html').write_text(page('Full spending report',f'<div class="wrap report-layout"><aside class="contents"><p class="eyebrow">IN THIS REPORT</p>{toc}<a href="merchant-summary.csv" download>Download data (CSV) ↓</a></aside><article class="prose">{reportbody}</article></div>','report','../'))
docs=[('P-Card Policy Manual','purchasing-card-policy-2025-06-24','17 pages · Effective June 24, 2025','The standalone purchasing-card manual adopted by the city commission.','https://www.panamacity.gov/AgendaCenter/ViewFile/Item/14822?fileID=31258'),('Purchasing Policy and Procedures Manual','purchasing-policy-and-procedures','53 pages · Revised October 28, 2025','The broader purchasing manual. Its P-Card section begins on page 42.','https://www.panamacity.gov/DocumentCenter/View/12277'),('Resolution 20250624.2','resolution-20250624-2','1 page · June 24, 2025','Agenda attachment for adoption of the P-Card manual. Signature lines are blank; see the minutes for the recorded vote.','https://www.panamacity.gov/AgendaCenter/ViewFile/Item/14822?fileID=31255'),('Commission meeting minutes','commission-minutes-2025-06-24','Meeting record · June 24, 2025','Item 12.b records approval of the manual and resolution by a 5–0 vote, effective June 24, 2025.','https://www.panamacity.gov/AgendaCenter/ViewFile/Minutes/_06242025-751')]
docrows=''.join(f'<article class="document"><span class="doc-number">0{i}</span><div><p class="eyebrow">{meta}</p><h2>{title}</h2><p>{desc}</p><div class="doc-links"><a class="button" href="{file}.pdf">Open PDF ↗</a><a href="{file}.txt">Read extracted text</a><a href="{url}">Official city source ↗</a></div></div></article>' for i,(title,file,meta,desc,url) in enumerate(docs,1))
notes=(ROOT/'policies/panama-city/README.md').read_text().split('## Use and version notes')[1]
doccontent=f'<section class="page-intro"><div class="wrap"><p class="eyebrow">THE SOURCE LIBRARY / 4 DOCUMENTS</p><h1>Supporting documents</h1><p class="lede">Read the policies and public records behind the review. Every document includes the original PDF, extracted text, and an official city source.</p><p class="fine">Retrieved from the City of Panama City website on November 9, 2026.</p></div></section><section class="section"><div class="wrap document-list">{docrows}<div class="prose version-notes"><h2>Use and version notes</h2>{markdown(notes)}<p><a href="sources.json">View source URLs and file checksums (JSON)</a></p></div></div></section>'
(OUT/'policies/panama-city/index.html').write_text(page('Supporting documents',doccontent,'docs','../../'))
print('Built overview, full report, and source library from reviewed public inputs.')

# Copy only explicitly reviewed public inputs. Never traverse the local dataset.
public_files = ["assets/site.css", "assets/site.js", "assets/spending-blaze-logo.png",
                "reports/merchant-summary.csv", "policies/panama-city/sources.json"]
for _, stem, _, _, _ in docs:
    public_files.extend(f"policies/panama-city/{stem}.{ext}" for ext in ("pdf", "txt"))
for filename in public_files:
    shutil.copyfile(ROOT/filename, OUT/filename)
