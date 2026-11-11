const fs=require('node:fs'),a=require('node:assert/strict'),cp=require('node:child_process');
const before=require('./fixtures/travel-reviewed-baseline-20261111.json'),after=require('../docs/travel.json'),ops=require('./reviewed-travel-changes.json').operations,data=require('../docs/data.json');
a.equal(ops.length,47);a.deepEqual(Object.keys(before.records),Object.keys(after.records));
const changed=Object.keys(after.records).filter(id=>JSON.stringify(before.records[id])!==JSON.stringify(after.records[id]));a.deepEqual(changed.sort(),ops.map(o=>o.id).sort());
for(const t of data.transactions.filter(t=>t.amount<0)){if(after.records[t.id])a.equal(after.records[t.id].range,null);}
for(const id of ['TXN00043996','TXN00051219','TXN00057720'])a(!after.records[id].group);
a.deepEqual(after.records.TXN00046136.recipients,['HAYES, JONATHAN H','Matt DeVito, P.E.']);
a.notEqual(after.records.TXN00053513.group,after.records.TXN00053826.group);
a.notEqual(after.records.TXN00056346.group,after.records.TXN00056646.group);
const bytes=fs.readFileSync('docs/travel.json');cp.execFileSync('node',['tools/build_travel.cjs']);a.deepEqual(fs.readFileSync('docs/travel.json'),bytes);
const assets=require('../docs/assets.json');a.equal(assets.groups.length,244);a.equal(new Set(assets.groups.flatMap(g=>g.members.map(m=>m.id))).size,1002);
for(const g of assets.groups.filter(g=>g.kind==='vehicles'))a(g.members.every(m=>m.confidence!=='Named'));
console.log('PASS: exactly 47 reviewed changes, 1460 records retained, credits undated, named travelers and separate episodes, reproducible build, 244 asset groups/1002 source transactions');
