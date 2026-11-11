const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const fixture=require('../docs/data.json'),snapshot=require('../docs/travel.json'),associations=require('../docs/leadership-associations.json');
const c=vm.createContext({fixture,snapshot,associations,localStorage:{getItem:()=>null}}),code=fs.readFileSync('app/app.js','utf8');
vm.runInContext(code.slice(0,code.indexOf("$('content').addEventListener")),c);
vm.runInContext('data=fixture;travelSnapshot=snapshot;leadershipAssociations=associations;',c);
const tx=id=>fixture.transactions.find(t=>t.id===id),fee=id=>c.travelFeeClassification(tx(id));
assert.equal(fee('TXN00054166'),null,'Hotel balance excludes the separately charged fee');
assert(fee('TXN00042435').uncertain,'Cancellation refund is not the fee amount');
assert.equal(fee('TXN00043996').category,'Travel insurance & protection','Allianz merchant resolves the shared note');
assert.equal(fee('TXN00044010'),null,'Likely registration does not become an insurance fee');
for(const id of ['TXN00041968','TXN00041929','TXN00047713','TXN00056675'])assert.equal(fee(id).category,'Parking');
assert.equal(fee('TXN00054008').category,'Travel insurance & protection');
assert.equal(fee('TXN00046894').category,'Combined baggage & seating');
assert.equal(fee('TXN00043224'),null,'Equipment seat is not travel');
assert.equal(fee('TXN00050649').category,'Seat upgrades');
assert.equal(fee('TXN00044094').category,'Flight changes (may include fare difference)');
const pair=[tx('TXN00048010'),tx('TXN00048178')];assert.equal(c.travelFeeData(pair).net,0);assert.equal(c.travelFeeData([...pair,pair[0]]).net,0);
assert.equal(c.travelFeeData([{...pair[0],tripStatus:'excluded'}]).net,0);
assert.equal(c.travelFeeData([tx('TXN00046894')]).net,12000,'Combined fees counted once');
const lucas=c.travelRecipients(c.travelTransaction(tx('TXN00044094')));assert(lucas.includes('LUCAS, JANICE L'),'Cross-card fee attributed to named traveler');
const originalRecord=snapshot.records.TXN00046894;const shared={...tx('TXN00046894'),amount:101};vm.runInContext("travelSnapshot.records.TXN00046894={recipientOverride:true,recipients:['A','B']}",c);assert.equal(c.travelShare(shared,'A')+c.travelShare(shared,'B'),101);snapshot.records.TXN00046894=originalRecord;
const groups=c.tripGroups(),summary=c.travelSummaryData(groups,fixture.transactions.map(c.travelTransaction));
for(const r of summary.spending){const included=groups.flatMap(g=>c.tripFacts(g).included).filter(t=>c.travelRecipients(t).includes(r.person)).map(t=>c.travelForPerson(t,r.person));const ids=new Set(groups.flatMap(g=>g.items.map(t=>t.id)));const other=fixture.transactions.filter(t=>!ids.has(t.id)&&t.travel!=='Not identified as travel').map(c.travelTransaction).filter(t=>c.travelRecipients(t).includes(r.person)).map(t=>c.travelForPerson(t,r.person));assert.equal(r.fees.net,c.travelFeeData([...included,...other]).net,r.person);}
console.log('PASS: fee refunds, duplicate exclusion, combined fees, exclusions, cross-card attribution, shared rounding, mixed amounts, hotel fee subtraction and summary/detail reconciliation.');
for(const r of summary.spending.filter(r=>/HAYES|LUCAS/.test(r.person))) console.log(r.person,JSON.stringify({net:r.fees.net,categories:r.fees.categories.map(x=>[x.category,x.charges+x.credits]),unresolved:r.fees.uncertain.length}));
for(const fy of ['2025','2026']){const selected=fixture.transactions.filter(t=>String(t.fy).includes(fy));const ids=new Set(selected.map(t=>t.id));const selectedGroups=groups.filter(g=>g.items.some(t=>ids.has(t.id)));const result=c.travelSummaryData(selectedGroups,selected.map(c.travelTransaction));for(const r of result.spending)assert.equal(r.fees.net,r.fees.charges+r.fees.credits);}
// Dataset evidence for a fee must be present; an analysis purpose label alone is insufficient.
assert.equal(c.travelFeeClassification({...tx('TXN00054166'),purchaseNotes:[],merchant:'Hotel'}),null);
console.log('PASS: fiscal-year subsets reconcile; source-free purpose labels do not manufacture fees.');

const engine=require('./travel-research-engine.cjs');
const registration={...tx('TXN00044010'),comments:tx('TXN00044010').purchaseNotes};
assert.equal(engine.transactionTravelAnalysis(registration).kind,'Likely conference registration');
assert.notEqual(engine.transactionTravelAnalysis({...registration,amount:1}).kind,'Likely conference registration','Reviewed purpose requires matching source amount');
assert.notEqual(engine.transactionTravelAnalysis({...registration,comments:['Insurance']}).kind,'Likely conference registration','Reviewed purpose requires matching source note');
for(const id of ['TXN00042134','TXN00048314','TXN00049043'])assert.equal(fee(id).category,'Travel insurance & protection');
assert.equal(fixture.transactions.filter(t=>c.travelFeeClassification(t)?.uncertain).length,1,'Only the non-itemized cancellation refund remains unresolved');
console.log('PASS: reviewed registration source guards, abbreviated insurer notes, and remaining unresolved fee inventory.');
