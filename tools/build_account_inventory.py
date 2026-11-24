"""Build review inventory from adopted expense rows; never infer actual vendor payments."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
snapshot=json.loads((ROOT/'analysis/account-inventory/adopted-rows.json').read_text())
assert all(c['total']==c['rowsTotal'] for c in snapshot['checks'])
assert sum(r['budget2027'] for r in snapshot['rows'])==150263913
priority=['410-3620-53400','410-3640-54600','410-3630-55200','440-3420-53400']
notes={
priority[0]:dict(summary='The supporting budget lists $5,750,000 for water purchased from Bay County. This appears to explain most of this line, but the account mapping is not confirmed.',components=[['Water purchased from Bay County',5750000]],gap=663350,missing='Confirm the water-purchase account mapping and itemize the remaining $663,350, including vendors, services and the reason for the increase.',supportPage=81),
priority[1]:dict(summary='Supporting detail separates lift-station maintenance from vehicle and equipment maintenance. Those amounts do not fully reconcile to this adopted account.',components=[['Lift-station repairs and maintenance',525000],['Vehicle and equipment maintenance',463000]],gap=15000,missing='Confirm which work belongs to this account, explain the $15,000 difference, and identify locations, equipment, vendors and planned work.',supportPage=74),
priority[2]:dict(summary='Supporting detail mentions utility repair supplies, meters and road materials. It does not provide a verified crosswalk to this operating-supplies account.',components=[],gap=975200,missing='Provide the account-level list of supplies, quantities and expected vendors. The full $975,200 still needs a verified breakdown.',supportPage=72),
priority[3]:dict(summary='Supporting detail lists tipping fees, meaning charges to dispose of collected garbage, and a smaller contracted-services amount. These are provisional leads, not verified account components.',components=[['Tipping fees (disposal charges)',630000],['Contracted services',18440]],gap=5760,missing='Confirm the disposal operator and account mapping, identify the contracted services, and reconcile the remaining $5,760. Actual payments have not been verified.',supportPage=86)
}
rows=[]
for source in snapshot['rows']:
 r=dict(source);code=r['code'];tags=[]
 if r['budget2027']>500000:tags.append('Over $500,000')
 if code.startswith(('531','532','534','544')) or 'contract' in r['name'].lower():tags.append('Contracts & services')
 if code.startswith('591') or 'transfer' in r['name'].lower():tags.append('Transfers')
 if not tags:continue
 r.update(tags=tags,priority=priority.index(r['id'])+1 if r['id'] in priority else None,source=snapshot['source']+'#page='+str(r['page']),status='Breakdown unverified',summary='The adopted budget verifies this account amount, but not the individual purchases, projects or payments behind it.',missing='Account-level detail, recipients or vendors where applicable, and the explanation for any change have not been verified.')
 if code.startswith('51'):r['summary']='Budgeted wages, overtime or special pay. This is a planned expense, not payroll actually paid.';r['missing']='Reconcile staffing, pay rates, vacancies and any overtime assumptions to this account. Actual payroll payments and the reason for changes are not verified here.'
 if code.startswith('52'):r['summary']='Budgeted employer payroll taxes, retirement or employee benefits. This account is not an individual employee salary.'
 if code.startswith('56'):r['summary']='Budgeted equipment, construction or other capital work. A budget does not prove a contract was awarded or money was spent.';r['missing']='Verify the project or equipment list, quantities, funding, carryovers, selected contractors and payment records.'
 if code.startswith('57'):r['summary']='Budgeted debt principal or interest. This is separate from transfers used to fund debt payments.';r['missing']='Match the amount to loans, repayment schedules, funded projects and current lenders. Actual payments are unverified.'
 if 'Contracts & services' in tags:r['missing']='Verify the services, contract or lease terms, vendors, budget calculation and actual payments. This is an account inventory, not a complete contract register.'
 if 'Transfers' in tags:
  r['status']='Destination named; use unverified' if code!='59129' else 'Destination unverified'
  r['summary']='Budget destination as recorded: '+r['name']+'. This moves money between funds; it is not proof of a payment to an outside vendor.'
  r['missing']='Verify the receiving-fund entries, purpose, eventual use and actual transfers. Do not count this transfer again when adding the receiving fund’s spending.'
 if r['id'] in notes:
  r.update(notes[r['id']]);r['status']='Partial supporting detail' if r['components'] else 'Breakdown unverified';r['support']='https://panamacity.gov/Archive/ViewFile/Item/1582#page='+str(r['supportPage'])
 r['change']=r['budget2027']-r['budget2026']
 rows.append(r)
rows.sort(key=lambda r:(r['priority'] or 999,-r['budget2027'],r['id']))
result=dict(year=2027,source=snapshot['source'],sourceSha256=snapshot['sourceSha256'],scope='FY2027 adopted expense accounts: amounts strictly over $500,000, all professional/audit/contractual-services and rental/lease accounts, and all outgoing transfer accounts, including $0 budgets. Incoming transfers are not repeated. This is not a register of individual contracts or actual payments.',reconciliation=dict(accountCount=len(snapshot['checks']),expenseRowCount=len(snapshot['rows']),total=150263913),rows=rows)
(ROOT/'docs/account-inventory.json').write_text(json.dumps(result,indent=2)+'\n')
print(f'{len(rows)} accounts; {sum(r["budget2027"]>500000 for r in rows)} over $500,000; all expense rows reconcile')
