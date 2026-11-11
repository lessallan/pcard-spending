#!/usr/bin/env python3
"""Read-only merchant-note review. Never rewrites transactions or publishes output.

Usage: python3 tools/review_merchant_notes.py analysis/merchant-cross-card-2026-11-10
Inputs: baseline.json, reviewed-summaries.tsv, connections.json.
Exact merchant groups only. Currency integers are cents. Any future baseline needs
fresh review: the output fingerprints all connection anchors to prevent ID reuse.
"""
import collections, csv, hashlib, html, json, pathlib, re, sys
root = pathlib.Path(sys.argv[1])
raw = (root/'baseline.json').read_bytes()
data = json.loads(raw)
transactions = data['transactions']
by_id = {t['id']:t for t in transactions}
assert len(by_id) == len(transactions), 'Duplicate source transaction IDs'
sha = hashlib.sha256(raw).hexdigest()
expected = (root/'reviewed-baseline.sha256').read_text().strip()
assert sha == expected, 'Baseline changed: re-review summaries and connection anchors before applying this catalog'
groups = collections.defaultdict(list)
for t in transactions:
    assert isinstance(t['amount'], int), 'Expected integer cents'
    groups[t['merchant']].append(t)

# Administrative/generic notes stay in the full record, but do not establish goods.
admin = re.compile(r'^(?:multiple invoices?\b|.*\bbatch\b|(?:all )?(?:verified|approved|completed|ompleted|corrected|done|okay|ok)\s*$|(?:please|receipt|invoice|flag(?:ged)?|added|uploaded|allocated|allocation|the receipt|the invoice|i have uploaded|i added|working with|requested from)\b|(?:k\s*peterson|angie bates)\s*(?:p\s*card.*)?$)', re.I)
generic = re.compile(r'^(?:(?:miscellaneous|misc\.?|various|operating|maintenance|repair|equipment|ofice|office)\s+)*(?:supplies|items|parts|maintenance|repair(?:s)?|repair\s*[&/]\s*maintenance|training|conference|hotel|travel/training)\s*[.!]*$', re.I)
def useful(note):
    note=note.strip()
    return bool(len(note)>3 and not admin.search(note) and not generic.search(note))
def money(n): return f'${n/100:,.2f}'
def record(t):
    return {k:t.get(k) for k in ('id','fy','date','person','merchant','raw','amount','purchaseNotes','comments','allocations','source','sheet','rows')}
def fingerprint(t):
    return hashlib.sha256(json.dumps(record(t),sort_keys=True,ensure_ascii=False).encode()).hexdigest()

reviewed={}
with (root/'reviewed-summaries.tsv').open() as f:
    for r in csv.DictReader(f,delimiter='\t'):
        assert r['merchant'] in groups, r['merchant']
        evidence=[]
        for anchor in r['anchors'].split('|'):
            matches=[{'id':t['id'],'person':t['person'],'note':n} for t in groups[r['merchant']] for n in t.get('purchaseNotes',[]) if anchor.lower() in n.lower()]
            assert matches, (r['merchant'],anchor)
            evidence.extend(matches)
        reviewed[r['merchant']]={'summary':r['summary'],'evidence':list({(e['id'],e['note']):e for e in evidence}.values())}
connections=json.loads((root/'connections.json').read_text())
for i,c in enumerate(connections,1):
    c['id']=f'MC-{i:03d}'
    ids=c['targets']+c['support']
    assert all(i in by_id for i in ids), c
    c['source_fingerprints']={i:fingerprint(by_id[i]) for i in ids}
    c['records']=[record(by_id[i]) for i in ids]
    c['publication_status']='Local research only'

# Exhaustive comparison candidates, never auto-confirmed. A price match is a lead.
keys=collections.defaultdict(list)
for t in transactions:
    if t['amount']>0 and t['date']:
        keys[(t['merchant'],t['date'],t['amount'])].append(t)
candidates=[]
for (merchant,date,amount),ts in keys.items():
    if len({t['person'] for t in ts})<2: continue
    ids={t['id'] for t in ts}
    reviews=[c['id'] for c in connections if len(ids.intersection(c['targets']+c['support']))>=2]
    candidates.append({'merchant':merchant,'date':date,'amount_cents_each':amount,'ids':sorted(ids),'status':'Reviewed — see connection' if reviews else 'Unresolved comparison candidate — same date/amount alone is insufficient','reviews':reviews,'records':[record(t) for t in ts]})

catalog=[]
for merchant,ts in groups.items():
    notes=collections.defaultdict(list)
    for t in ts:
        for n in dict.fromkeys(t.get('purchaseNotes',[])):
            if n.strip(): notes[n].append(t['id'])
    informative=[(n,ids) for n,ids in notes.items() if useful(n)]
    # Show distinct cardholders before filling remaining excerpt slots.
    ordered=sorted(informative,key=lambda p:(-len({by_id[i]['person'] for i in p[1]}),-len(p[1]),len(p[0])))
    excerpts=[];people=set()
    for n,ids in ordered:
        holders={by_id[i]['person'] for i in ids}
        if holders-people and len(excerpts)<8:
            excerpts.append({'note':n,'ids':ids});people.update(holders)
    for n,ids in ordered:
        if len(excerpts)>=8: break
        if not any(e['note']==n for e in excerpts): excerpts.append({'note':n,'ids':ids})
    if merchant in reviewed:
        status='Reviewed note-based summary';summary=reviewed[merchant]['summary'];evidence=reviewed[merchant]['evidence']
    elif excerpts:
        status='Source-note excerpts — no inferred item label'
        summary='Recorded notes include: '+'; '.join('“'+e['note'][:240]+('…' if len(e['note'])>240 else '')+'”' for e in excerpts[:4])
        evidence=[]
    else:
        status='Unresolved purchase details'
        summary='No specific purchase purpose established from the available notes. Generic or administrative notes, if any, remain below.'
        evidence=[]
    years={fy:sum(t['amount'] for t in ts if t['fy']==fy) for fy in sorted({t['fy'] for t in transactions})}
    cardholders=[{'person':p,'net_cents':sum(t['amount'] for t in ts if t['person']==p),'transactions':sum(t['person']==p for t in ts)} for p in sorted({t['person'] for t in ts})]
    links=[c['id'] for c in connections if any(r['merchant']==merchant for r in c['records'])]
    # Flag language for a reader, not an allegation or automatic classification.
    caveats=[{'note':n,'ids':ids} for n,ids in notes.items() if re.search(r'\b(?:correction|fraud|disput\w*|duplicate|overcharg\w*|incorrect|wrong|not a|refund|credit)\b',n,re.I)]
    catalog.append({'merchant':merchant,'status':status,'summary':summary,'net_cents':sum(t['amount'] for t in ts),'positive_cents':sum(max(0,t['amount']) for t in ts),'credit_cents':sum(min(0,t['amount']) for t in ts),'years':years,'transaction_count':len(ts),'cardholders':cardholders,'raw_descriptors':sorted({t.get('raw','') for t in ts}),'specific_note_transaction_count':len({i for n,ids in informative for i in ids}),'transactions_without_notes':sum(not t.get('purchaseNotes') for t in ts),'excerpts':excerpts,'reviewed_summary_evidence':evidence,'connections':links,'caveats':caveats,'notes':[{'note':n,'ids':ids} for n,ids in notes.items()],'transactions':[record(t) for t in sorted(ts,key=lambda t:(t['date'] or '',t['id']))]})
catalog.sort(key=lambda m:-m['net_cents'])
assert sum(m['net_cents'] for m in catalog)==sum(t['amount'] for t in transactions)
assert sum(m['transaction_count'] for m in catalog)==len(transactions)
counts=dict(collections.Counter(m['status'] for m in catalog))
meta={'review_date':'2026-11-10','source_url':'https://pennyping.app/data.json','source_generated':data.get('generated'),'baseline_sha256':sha,'transactions':len(transactions),'merchants':len(catalog),'multi_card_merchants':sum(len(m['cardholders'])>1 for m in catalog),'net_cents':sum(t['amount'] for t in transactions),'status_counts':counts,'same_day_amount_candidate_groups':len(candidates),'likely_connection_groups':sum(c['label']=='Likely connection' for c in connections),'publication_status':'Local research only; not deployed','scope':'All recorded merchant groups and all cardholders scanned. Reviewed paraphrases are separate from automatically assembled literal-note excerpts. No item identity is inferred solely from merchant name, price, date or accounting code. Merchant totals include unrelated and unresolved purchases; they are not totals for the examples described.'}
(root/'merchant-research.json').write_text(json.dumps({'meta':meta,'merchants':catalog,'connections':connections,'comparison_candidates':candidates},ensure_ascii=False,indent=2))
with (root/'merchant-summary.csv').open('w',newline='') as f:
    w=csv.writer(f);w.writerow(['Merchant','Review status','What notes describe','FY25 net','FY26 net','Net total','Credits','Transactions','Cardholders','Without notes','Connections'])
    for m in catalog:w.writerow([m['merchant'],m['status'],m['summary'],f"{m['years'].get('FY25',0)/100:.2f}",f"{m['years'].get('FY26',0)/100:.2f}",f"{m['net_cents']/100:.2f}",f"{m['credit_cents']/100:.2f}",m['transaction_count'],'; '.join(p['person'] for p in m['cardholders']),m['transactions_without_notes'],'; '.join(m['connections'])])
with (root/'all-transactions.csv').open('w',newline='') as f:
    w=csv.writer(f);w.writerow(['ID','FY','Date','Merchant','Raw descriptor','Cardholder','Amount','Original purchase notes','Review status','Source','Sheet','Rows'])
    statuses={m['merchant']:m['status'] for m in catalog}
    for t in transactions:w.writerow([t['id'],t['fy'],t['date'],t['merchant'],t.get('raw'),t['person'],f"{t['amount']/100:.2f}",' | '.join(t.get('purchaseNotes',[])),statuses[t['merchant']],t.get('source'),t.get('sheet'),t.get('rows')])

E=html.escape
parts=['''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Merchant purchase review</title><style>body{font:16px/1.55 system-ui,sans-serif;color:#24332c;background:#f8f8f4;max-width:1180px;margin:32px auto;padding:0 22px}h1,h2,h3{line-height:1.2}article,section{background:white;padding:20px;margin:18px 0;border:1px solid #d9dfd9;border-radius:6px}input,select{font:inherit;padding:10px;max-width:100%;border:1px solid #888;border-radius:4px}input{width:420px}summary{cursor:pointer;font-weight:600;padding:8px 0}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;vertical-align:top;padding:9px;border-bottom:1px solid #ddd}.scroll{overflow:auto}.muted{color:#58645d}.badge{display:inline-block;background:#eef1e9;border-radius:4px;padding:3px 9px;font-size:13px}.likely{background:#fff1ca}pre{white-space:pre-wrap}a{color:#275740}article[hidden]{display:none}.facts{display:flex;gap:22px;flex-wrap:wrap}details{margin-top:12px}ul{padding-left:24px}.notes{max-width:75ch}nav{display:flex;gap:18px;flex-wrap:wrap}@media(max-width:600px){body{margin:16px auto;padding:0 12px}article,section{padding:14px}input{width:90%}}</style>''']
parts.append(f'<h1>What were we buying?</h1><p>Cross-card merchant review · November 10, 2026 · <strong>Local research, not published</strong></p><p>{len(transactions):,} transactions · {len(catalog):,} merchants · {meta["multi_card_merchants"]:,} merchants used by multiple cardholders.</p><p class="muted">{E(meta["scope"])}</p><nav><a href="#connections">Reviewed connections</a><a href="#directory">All merchants</a><a href="merchant-summary.csv">Summary CSV</a><a href="all-transactions.csv">All transactions CSV</a><a href="merchant-research.json">Evidence catalog</a></nav>')
parts.append('<section id="connections"><h2>Connections and exceptions</h2><p>“Likely” is a suggestion, not a confirmed item, recipient, vehicle, shared trip or duplicate charge. Source transactions and credits remain separate.</p>')
for c in connections:
    parts.append(f'<details id="{c["id"]}"><summary><span class="badge {"likely" if c["label"]=="Likely connection" else ""}">{E(c["label"])}</span> {E(c["title"])}</summary><p>{E(c["reason"])}</p><p><b>To confirm:</b> {E(c["needs"])}</p><div class="scroll"><table><tr><th>ID / date</th><th>Cardholder</th><th>Amount</th><th>Original notes</th></tr>')
    for t in c['records']:parts.append(f'<tr><td>{E(t["id"])}<br>{E(t["date"] or "")}</td><td>{E(t["person"])}</td><td>{money(t["amount"])}</td><td>{E(" | ".join(t["purchaseNotes"] or [])) or "No notes"}</td></tr>')
    parts.append('</table></div></details>')
parts.append('</section><h2 id="directory">All merchants</h2><label for="search">Search merchant, note, cardholder or unit</label><br><input id="search" type="search" placeholder="Try truck 200, cameras, or a name"><label for="mode"> Show </label><select id="mode"><option value="all">All merchants</option><option value="multi">Multiple cardholders</option><option value="reviewed">Reviewed summaries</option><option value="likely">Likely connections</option><option value="unresolved">Unresolved details</option></select><p id="count" role="status"></p>')
for ix,m in enumerate(catalog):
    search=' '.join([m['merchant'],m['summary']]+[p['person'] for p in m['cardholders']]+[n['note'] for n in m['notes']]).lower()
    likely=any(c['label']=='Likely connection' and c['id'] in m['connections'] for c in connections)
    parts.append(f'<article data-search="{E(search,quote=True)}" data-multi="{int(len(m["cardholders"])>1)}" data-reviewed="{int(m["merchant"] in reviewed)}" data-likely="{int(likely)}" data-unresolved="{int(m["status"]=="Unresolved purchase details")}"><h3>{E(m["merchant"])}</h3><span class="badge">{E(m["status"])}</span><p class="notes">{E(m["summary"])}</p><div class="facts"><span><b>FY25:</b> {money(m["years"].get("FY25",0))}</span><span><b>FY26:</b> {money(m["years"].get("FY26",0))}</span><span><b>Net:</b> {money(m["net_cents"])}</span><span>{m["transaction_count"]} transactions · {len(m["cardholders"])} cardholders</span></div><p class="muted">{m["transactions_without_notes"]} transactions have no notes. Credits: {money(m["credit_cents"])}. Totals cover every purchase at this merchant, not just the described items.</p>')
    if m['connections']:parts.append('<p>Connections: '+' · '.join(f'<a href="#{c}">{c}</a>' for c in m['connections'])+'</p>')
    if m['caveats']:parts.append(f'<p class="muted">{len(m["caveats"])} note(s) mention a correction, credit, dispute or similar qualification. Read the originals below before drawing a conclusion.</p>')
    parts.append('<details><summary>Cardholders and totals</summary><ul>'+''.join(f'<li>{E(p["person"])} — {money(p["net_cents"])} · {p["transactions"]} transactions</li>' for p in m['cardholders'])+'</ul></details>')
    top=sorted([t for t in m['transactions'] if t['amount']>0],key=lambda t:-t['amount'])[:3]
    parts.append('<details><summary>Biggest purchases</summary><ul>'+''.join(f'<li>{money(t["amount"])} — {E(t["date"] or "")} · {E(t["person"])} · {E(t["id"])}<br>{E(" | ".join(t["purchaseNotes"] or [])) or "No notes"}</li>' for t in top)+'</ul></details>')
    if m['reviewed_summary_evidence']:
        parts.append('<details><summary>Evidence for the summary</summary><ul>'+''.join(f'<li>{E(e["id"])} · {E(e["person"])} — {E(e["note"])}</li>' for e in m['reviewed_summary_evidence'])+'</ul></details>')
    parts.append('<details><summary>All transactions and original notes</summary><div class="scroll"><table><tr><th>ID / date</th><th>Cardholder</th><th>Amount</th><th>Notes</th></tr>')
    for t in m['transactions']:parts.append(f'<tr><td>{E(t["id"])}<br>{E(t["date"] or "")}<br>{E(t["fy"])}</td><td>{E(t["person"])}</td><td>{money(t["amount"])}</td><td>{E(" | ".join(t["purchaseNotes"] or [])) or "No notes"}</td></tr>')
    parts.append('</table></div></details></article>')
parts.append('''<script>const search=document.getElementById('search'),mode=document.getElementById('mode'),cards=[...document.querySelectorAll('article')];function apply(){const q=search.value.toLowerCase().trim(),m=mode.value;let n=0;for(const card of cards){const yes=card.dataset.search.includes(q)&&(m==='all'||card.dataset[m]==='1');card.hidden=!yes;if(yes)n++;}document.getElementById('count').textContent=n+' merchants shown';}search.addEventListener('input',apply);mode.addEventListener('change',apply);apply();document.querySelectorAll('a[href^="#MC-"]').forEach(a=>a.addEventListener('click',()=>{document.getElementById(a.hash.slice(1)).open=true}));</script></html>''')
(root/'review.html').write_text('\n'.join(parts))
report=['# Merchant purchase review — November 10, 2026','',f'Scanned all **{len(transactions):,} transactions / {len(catalog):,} merchants**, including **{meta["multi_card_merchants"]} multi-cardholder merchants**, using the live dataset. No data or website changes were published.','',meta['scope'],'','## Coverage','']
for k,v in counts.items():report.append(f'- {k}: **{v:,} merchants**.')
report += ['',f'- {len(candidates)} same-merchant/date/amount comparison groups retained as leads; unreviewed matches are explicitly unresolved.',f'- {meta["likely_connection_groups"]} reviewed likely connections.','', '## What stood out','', '| Merchant | What the notes support |', '|---|---|']
for name in ['GLOBAL AEROSPACE,','IN  SOUTHWINDS GPS','SQ  BLOWING STEAM','ALMEGA SPORTS','SUN MARKETING GROUP','SQ  PRO FLOORS PLUS LLC','CUMMINS INC -','BOUND TREE MEDICAL LLC']:
    report.append(f'| {name} | {reviewed[name]["summary"]} |')
report += ['', '## Reviewed connections and exceptions','']
for c in connections:report += [f'### {c["id"]}: {c["title"]}',f'**{c["label"]}.** {c["reason"]}',f'Source IDs: {", ".join(c["targets"]+c["support"])}.',f'To confirm: {c["needs"]}','']
report += ['## Files','','- `review.html`: searchable merchant directory, yearly totals, cardholders, biggest charges and every original note.','- `merchant-summary.csv`: one row per merchant, including all unresolved merchants.','- `all-transactions.csv`: all source transactions and notes.','- `merchant-research.json`: structured catalog, supporting IDs, source fingerprints and comparison dispositions.','',f'Baseline SHA-256: `{sha}`.', 'Reproduce: `python3 tools/review_merchant_notes.py analysis/merchant-cross-card-2026-11-10`.']
(root/'README.md').write_text('\n'.join(report)+'\n')
print(json.dumps(meta,indent=2))
