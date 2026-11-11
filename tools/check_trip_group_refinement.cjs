const assert=require('node:assert/strict'),fs=require('fs');
const {refineTravelGroups}=require('./refine_travel_groups.cjs');
const d=require('../docs/data.json'),baseline=require('./fixtures/grouping-baseline.json');
const source=JSON.stringify(d),s=structuredClone(baseline),changes=refineTravelGroups(d.transactions,s.records);
assert.equal(JSON.stringify(d),source);assert.equal(changes.length,32);
for(const t of d.transactions){const before=baseline.records[t.id],after=s.records[t.id];if(!before)continue;for(const k of ['recipients','recipientOverride','person','range','nonTrip'])assert.deepEqual(after?.[k],before[k],t.id+' '+k);}
const ids=['TXN00057313','TXN00057350','TXN00057351','TXN00057369','TXN00057392','TXN00057405'];assert.equal(new Set(ids.map(id=>s.records[id].group)).size,1);
assert.match(s.records.TXN00057351.reason,/Likely/);
assert.equal(s.records.TXN00046894.group,s.records.TXN00048867.group);
assert.equal(s.records.TXN00048872.group,s.records.TXN00049046.group);
assert.notEqual(s.records.TXN00048872.group,s.records.TXN00048867.group,'Separate travelers remain separate');
assert.equal(refineTravelGroups(d.transactions,s.records).length,0,'Idempotent');
// Ambiguous trips, another person, refunds, missing anchors and competing groups block fee linking.
function candidate(change){const copy=structuredClone(baseline),tx=structuredClone(d.transactions);change(tx,copy.records);refineTravelGroups(tx,copy.records);return copy.records.TXN00057351.group;}
assert.equal(candidate(tx=>{tx.find(t=>t.id==='TXN00057351').amount=-4500}),null);
assert.equal(candidate(tx=>{tx.find(t=>t.id==='TXN00057351').person='SOMEONE ELSE'}),null);
assert.equal(candidate((tx,r)=>{delete r.TXN00057405}),null);
assert.equal(candidate((tx,r)=>{const x={...tx.find(t=>t.id==='TXN00057351'),id:'COMPETING',merchant:'HOTEL',purchaseNotes:['Other trip'],raw:'HOTEL'};tx.push(x);r.COMPETING={person:x.person,recipients:[x.person],group:'Another trip',groupName:'Another trip',analysis:{kind:'Lodging'}}}),null);
assert.equal(candidate((tx,r)=>{r.TXN00056721.range={start:'2026-07-13',end:'2026-07-15'}}),null,'Conflicting explicit itinerary must not merge');
const beforeGroups=new Set(Object.values(baseline.records).map(r=>r.group).filter(Boolean)).size,afterGroups=new Set(Object.values(s.records).map(r=>r.group).filter(Boolean)).size;
console.log('PASS: source/recipient/date preservation, multi-person regrouping, unique membership, idempotence, refunds, competing trips, missing anchors and conflicting itineraries. Groups:',beforeGroups,'→',afterGroups);
