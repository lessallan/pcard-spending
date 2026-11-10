const assert=require('node:assert/strict');
const data=require('../app/data.json'),r=require('./travel-research-engine.cjs');
const t=id=>data.transactions.find(t=>t.id===id),a=id=>r.transactionTravelAnalysis(t(id));
assert(a('TXN00055662').destinations.includes('Fayetteville, AR'));
assert(a('TXN00054981').destinations.includes('Fayetteville, NC'));
assert(!a('TXN00054981').destinations.includes('Fayetteville, AR'));
assert(a('TXN00057821').destinations.includes('Houston, TX'));
assert(a('TXN00049301').destinations.includes('Salt Lake City'));
assert(a('TXN00047075').destinations.includes('Greenville, SC'));
assert(a('TXN00047075').destinations.includes('Greenville, NC'));
assert.equal(a('TXN00050330').kind,'Lodging and tuition — allocation unknown');
assert.equal(a('TXN00045372').kind,'Ground transportation');
assert.equal(a('TXN00054523').kind,'Airline baggage fee');
for(const id of ['TXN00041922','TXN00042363','TXN00041860'])assert.equal(r.tripClue(t(id)),null);
const sample=comments=>({raw:'HOTEL',comments:[comments],date:'2025-03-01'});
assert.equal(r.tripDateRange(sample('09MAR-14MAR25 NLC Congressional Conference')).days,6);
assert.equal(r.tripDateRange(sample('08APR25-11APR25')).start,'2025-04-08');
assert.equal(r.tripDateRange(sample('02.26.24-02.28.25')),null);
assert.equal(r.tripDateRange(sample('02/30/25-03/02/25')),null);
assert.equal(r.tripDateRange(t('TXN00049301')),null);
assert.equal(r.transactionTravelAnalysis({raw:'LYFT RIDE SAT',comments:[],date:'2025-03-01'}).destinations.length,0);
console.log('PASS: researched destinations, conflicting clues, purpose, exclusions, date validation and unknown destinations');
const catalog=require('./travel-research-catalog.cjs'),snapshot=require('../docs/travel.json'),seen=new Set();
for(const g of catalog.reviewedGroups){
 const label=snapshot.records[g.ids[0]].group;
 for(const id of g.ids){assert(!seen.has(id));seen.add(id);assert.equal(snapshot.records[id].group,label)}
 assert.deepEqual(Object.entries(snapshot.records).filter(([,v])=>v.group===label).map(([id])=>id).sort(),g.ids.slice().sort());
}
assert.equal(catalog.reviewedGroups.length,44);assert.equal(seen.size,212);
for(const record of Object.values(snapshot.records)){assert(!('comments' in record));assert(!('amount' in record))}
console.log('PASS: 44 reviewed groups, 212 fixed memberships, no unrelated members and scoped snapshot schema');

const group=id=>snapshot.records[id]?.group;
assert.equal(group('TXN00041854'),group('TXN00041890'));
assert.equal(group('TXN00055663'),group('TXN00055205'));
assert.equal(group('TXN00055570'),group('TXN00055591'));
assert.equal(group('TXN00048265'),group('TXN00048653'));
assert.equal(group('TXN00043389'),group('TXN00043223'));
assert.equal(group('TXN00042701'),group('TXN00045043'));
assert.notEqual(group('TXN00056327'),group('TXN00056328'));
assert.notEqual(group('TXN00048433'),group('TXN00048265'));
assert(snapshot.records.TXN00042483.analysis.evidence.some(e=>e.text.includes('TXN00045157')));
console.log('PASS: cross-card vendor/date/amount evidence, service interpretation and conflicting-location boundaries');
