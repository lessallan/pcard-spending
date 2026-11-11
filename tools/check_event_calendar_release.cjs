const assert=require('node:assert/strict'),cp=require('node:child_process');
const data=require('../docs/data.json'),snapshot=require('../docs/travel.json'),engine=require('./travel-research-engine.cjs');
const before=JSON.parse(cp.execFileSync('git',['show','5db557a69ea6ea4353ab9e2d5c584714817dafaf:docs/travel.json'],{encoding:'utf8',maxBuffer:40*1024*1024}));
const originalData=JSON.parse(cp.execFileSync('git',['show','5db557a69ea6ea4353ab9e2d5c584714817dafaf:docs/data.json'],{encoding:'utf8',maxBuffer:40*1024*1024}));
assert.deepEqual(data,originalData,'Source data or amounts changed');
const proposals=require('./event-calendar-connections.json'),apply=require('./apply_event_calendar.cjs').applyEventCalendar;
assert.equal(proposals.length,9);assert.equal(new Set(proposals.map(p=>p.id)).size,9);
const delta=Object.entries(snapshot.records).filter(([id,r])=>r.group&&!before.records[id]?.group).map(([id])=>id).sort();
const reviewed=new Set(require('./reviewed-travel-changes.json').operations.map(p=>p.id));
assert.deepEqual(delta.filter(id=>!reviewed.has(id)),proposals.map(p=>p.id).filter(id=>!reviewed.has(id)).sort());
for(const p of proposals){const r=snapshot.records[p.id];assert.match(r.reason,/Likely/);assert.equal(r.group,snapshot.records[p.supporting_ids[0]].group);assert.deepEqual(r.range,before.records[p.id].range);}
const copy=structuredClone(snapshot.records);apply(data.transactions,copy);assert.deepEqual(copy,snapshot.records,'Overlay must be idempotent');
const changed=structuredClone(data.transactions);changed.find(t=>t.id===proposals[0].id).amount++;assert.throws(()=>apply(changed,structuredClone(snapshot.records)),/Changed source/);
assert.throws(()=>apply(data.transactions.filter(t=>t.id!==proposals[0].supporting_ids[0]),structuredClone(snapshot.records)),/Missing event evidence/);
for(const t of data.transactions.filter(t=>t.amount<0)){const r=snapshot.records[t.id];if(r){if(!reviewed.has(t.id))assert.equal(r.group,before.records[t.id]?.group);assert.equal(r.range,null);}}
const nc=data.transactions.find(t=>t.id==='TXN00054981');assert(engine.transactionTravelAnalysis(nc).destinations.includes('Fayetteville, NC'));
assert(!engine.transactionTravelAnalysis(nc).destinations.includes('Fayetteville, AR'));
const raw={...nc,purchaseNotes:undefined,comments:['(Terry, Lindsey, 05/14/26 13:04) Springhill Folio Fayetteville NC']};assert.deepEqual(engine.transactionTravelAnalysis(nc),engine.transactionTravelAnalysis(raw));
assert.notEqual(snapshot.records.TXN00047571.group,snapshot.records.TXN00055413.group);
assert.equal(snapshot.records.TXN00057720.group,before.records.TXN00057720.group,'DC/Houston conflict must stay untouched');
console.log('PASS: nine original connections retained; additional changes allowlisted; unchanged dataset/amounts/stay dates, independent anchors, drift rejection, idempotence, notes compatibility and annual/conflicting-location boundaries');
