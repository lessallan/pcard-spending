"""Reproducible source extraction and arithmetic for the local revenue explainer."""
import json,re,statistics,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];A=ROOT/'analysis/revenue-context'
s=(A/'millage2025-source.txt').read_text();pages={int(n):body for n,body in re.findall(r'PDF PAGE (\d+)\n(.*?)(?=\nPDF PAGE |\Z)',s,re.S)}
pattern=r'^(.*?)\s+(\d+\.\d{4})\s+(\d+\.\d{4})\s+(\d+\.\d{4}|n/a)\s+(\d+\.\d{4})(?:\s+.*)?$'
counties=[]
for line in pages[2].splitlines():
 m=re.match(pattern,line)
 if m:counties.append(dict(name=re.sub(r' County BCC$| BCC$| BOCC$','',m[1]),rate=float(m[5]),page=2))
countyNames=[r['name'].replace('Duval BCC/City Of Jacksonville','Duval') for r in counties]+['Multi-County'];county=None;cities=[]
layout={}
for part in json.loads((A/'millage2025-layout.json').read_text()):
 key=(part['page'],round(part['y'],2));layout.setdefault(key,[]).append(part)
lines=[]
for parts in layout.values():
 parts.sort(key=lambda r:r['x']);lines.append(dict(page=parts[0]['page'],x=parts[0]['x'],text=' '.join(p['text'].strip() for p in parts)))
for line in lines:
 if not 3<=line['page']<=10:continue
 m=re.match(pattern,line['text'])
 if not m:continue
 name=m[1]
 if line['x']<100:
  matches=[c for c in countyNames if name.startswith(c+' ')]
  assert len(matches)==1,(name,matches)
  county=matches[0];name=name[len(county)+1:]
 assert county
 cities.append(dict(name=name.rstrip('*'),county=county,rate=float(m[5]),page=line['page'],newLevy=name.endswith('*')))
assert len(cities)==393 and len(counties)==67
for name,county in [('Panama City','Bay'),('Miami','Miami-Dade'),('Bay Harbor Islands','Miami-Dade'),('Lake Mary','Seminole'),('Palm Beach Shores','Palm Beach'),('Palmetto','Manatee')]:assert next(r for r in cities if r['name']==name)['county']==county
assert len({(r['name'],r['county']) for r in cities})==393
popline=next(l for l in (A/'population2026-source.txt').read_text().splitlines()if l.startswith('Panama City '));population=int(popline.split()[2].replace(',',''));assert population==39163
# Saved verbatim General Fund revenue pages, extracted from the adopted PDF.
budgetPages=json.loads((A/'general-fund-source-pages.json').read_text());fundRows=[]
for page,body in budgetPages.items():
 for line in body.splitlines():
  m=re.match(r'^\s*(\d{3}\.\d{3})\s+(.+?)\s+(-?\$[\d,]+|\(\$[\d,]+\))\s+(-?\$[\d,]+|\(\$[\d,]+\))\s+(-?\$[\d,]+|\(\$[\d,]+\))\s+(-?\$[\d,]+|\(\$[\d,]+\))\s*$',line)
  if m:
   raw=m[6];amount=int(re.sub(r'[$,()]','',raw))*(-1 if raw.startswith('(') else 1);fundRows.append(dict(code=m[1],name=m[2].strip(),amount=amount,page=int(page)))
assert sum(r['amount']for r in fundRows)==62593981
spec=[('Property taxes',lambda c:c.startswith('311.'),'Taxes on taxable property value, including delinquent collections.'),('Merchant fee',lambda c:c.startswith('316.1'),'The city’s merchant gross-sales charge. Businesses and visitors also contribute.'),('Other taxes & franchise fees',lambda c:c.startswith(('312.','314.','315.','323.')),'Fuel, utility-service and communications taxes, plus utility franchise fees.'),('State and other government revenue',lambda c:c.startswith(('331.','333.','334.','335.','337.')),'Shared taxes, grants and other government funding; some uses are restricted.'),('Fire assessment',lambda c:c=='342.904','A dedicated charge for fire services; separate from property-tax millage.'),('Other service charges',lambda c:c.startswith('34') and c!='342.904','Service and administration charges. Some are payments from other city operations.'),('Other licenses & permits',lambda c:c.startswith(('316.2','322.','329.')),'Business receipts, permits and right-of-use fees.'),('Fines',lambda c:c.startswith(('351.','359.')),'Budgeted court and code-enforcement fines.'),('Other income',lambda c:c.startswith(('354.','36')),'Interest, rents and other receipts; not necessarily recurring.'),('Transfers from other funds',lambda c:c.startswith(('381.','384.','385.')),'Internal funding, not new money for the city as a whole.'),('Reserve adjustment',lambda c:c=='370.000','A negative budget adjustment, not a tax or revenue collected from residents.')]
groups=[]
for name,fn,note in spec:
 rows=[r for r in fundRows if fn(r['code'])];groups.append(dict(name=name,amount=sum(r['amount']for r in rows),note=note,codes=[r['code']for r in rows]))
assert sum(g['amount']for g in groups)==62593981
assert sorted(c for g in groups for c in g['codes'])==sorted(r['code']for r in fundRows)
source='https://floridarevenue.com/property/Documents/MillCapComp25.pdf'
data=dict(population=population,populationYear=2026,populationSource='https://www.edr.state.fl.us/Content/population-demographics/data/2026_Pop_Estimates.pdf#page=1',budgetYear=2027,budgetSource='https://panamacity.gov/Archive/ViewFile/Item/1581',generalFund=62593981,allFunds=150263913,allFundGroups=[dict(name=n,amount=a,note=t) for n,a,t in [('Taxes',32961520,'City property, fuel, utility-service and communications taxes and franchise fees.'),('Licenses & permits',15008000,'Includes the merchant fee, business receipts and permits.'),('Government revenue',17013524,'Shared taxes, grants and contributions from other governments.'),('Charges for services',67234634,'Water, sewer, garbage, fire assessments and other charges, including internal-service activity.'),('Fines',200000,'Budgeted fines and forfeitures.'),('Miscellaneous, net',897803,'Other receipts net of budget reserve adjustments.'),('Other funding sources',16948432,'Includes transfers, borrowing and other financing sources. Not all new revenue.')]],generalFundGroups=groups,generalFundRows=fundRows,millage=dict(year=2025,source=source,cities=cities,counties=counties,panamaCity=4.7999,median=statistics.median(r['rate']for r in cities),lower=sum(r['rate']<4.7999 for r in cities),higher=sum(r['rate']>4.7999 for r in cities)),sources=dict(merchant='https://edr.state.fl.us/content/local-government/reports/lgfih25.pdf#page=156',merchantCity='https://www.panamacity.gov/779/Merchant-Local-Business-Tax-Return-1-Fee',fire='https://engage.dunedin.gov/fire-protection-special-assessment',fireTotals='https://floridarevenue.com/property/dataportal/Documents/PTO%20Data%20Portal/Non-Ad%20Valorem%20Reports/2025/2025%20NAV%20by%20Type%20of%20Government.pdf',currentMillage='https://www.panamacity.gov/AgendaCenter/ViewFile/Item/17543?fileID=37529'))
(ROOT/'docs/revenue-context.json').write_text(json.dumps(data,indent=2)+'\n');print('393 city and 67 county rates; 39,163 residents; General Fund groups reconcile to $62,593,981.')
