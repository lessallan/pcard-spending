const assert=require('node:assert/strict'),engine=require('./travel-research-engine.cjs'),snapshot=require('../docs/travel.json');
const make=(id,date,note)=>({id,date,person:'TRAVELER',amount:100,raw:'DELTA AIR',comments:[note]});
const records=[make('old','2025-03-10','NLC Congressional Conference 2025'),make('advance','2025-11-26','NLC Congressional Conference flight'),make('new','2026-03-16','NLC Congressional Conference 2026')];
const groups=engine.suggestedTrips(records);
assert.notEqual(groups.get('old').label,groups.get('new').label);
assert.equal(groups.get('advance').label,groups.get('new').label);
assert.equal(engine.transactionTravelAnalysis(make('conflict','2026-03-16','NLC Congressional Conference 2025')).events.length,0);
for(const id of ['TXN00051544','TXN00051553','TXN00053981','TXN00054126'])assert.equal(snapshot.records[id].groupName,'NLC Congressional City Conference 2026');
console.log('PASS: distinct annual editions, prior-year advance booking, contradictory year rejection, screenshot records labeled 2026.');
