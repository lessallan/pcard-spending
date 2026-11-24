const assert=require('node:assert/strict'),d=require('../docs/finance-dashboard.json');
assert.equal(Object.keys(d.personnelHistory).length,50);
assert.equal(Object.values(d.personnelHistory).filter(h=>h.pay[0].year===2021).length,44);
for(const [id,h] of Object.entries(d.personnelHistory))for(const key of ['pay','retirement']){assert.equal(h[key].at(-1).value,d.personnelBudget[id][key]);assert.equal(new Set(h[key].map(p=>p.year)).size,h[key].length);for(const p of h[key])if(p.value!==null){assert(p.source);assert.equal(p.basis,p.year<2026?'Actual':'Adopted budget');}}
console.log('PASS 50 sourced histories, 44 starting in 2021, correct actual/budget labels and unchanged 2027 totals');
