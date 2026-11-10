const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const script=fs.readFileSync(path.join(root,'app/app.js'),'utf8');
const portion=script.slice(script.indexOf('const merchantLocations ='),script.indexOf('function purchaseDateLabel'));
const {locations,lookup,title}=vm.runInNewContext(portion+';({locations:merchantLocations,lookup:merchantLocation,title:transactionTitle})');
assert.equal(fs.readFileSync(path.join(root,'docs/app.js'),'utf8'),script,'published JS must match app source');
const transactions=JSON.parse(fs.readFileSync(path.join(root,'docs/data.json'),'utf8')).transactions;
const descriptors=new Set(transactions.map(t=>t.raw.trim().toUpperCase()));
for(const [raw,m] of Object.entries(locations)){
 assert.ok(descriptors.has(raw),'unexpected descriptor: '+raw);
 assert.ok(m.name && m.city && m.address);
 assert.equal(new URL(m.source).protocol,'https:');
}
assert.equal(lookup({raw:'CHEVRON 0042081'}).city,'Lake City, FL');
assert.equal(lookup({raw:'TEXACO 0305573'}).city,'Prattville, AL');
assert.equal(lookup({raw:'LOWES #01843'}).city,'Bradenton, FL');
assert.equal(lookup({raw:'LOVE\'S #0379 INSIDE'}).address,lookup({raw:'LOVE\'S #0379 OUTSIDE'}).address);
assert.equal(lookup({raw:'AUTOZONE 05150'}).address,lookup({raw:'AUTOZONE #5150'}).address);
for(const raw of ['DELTA AIR 0062357581514','LOWES #00907','SAMSCLUB.COM','CHEVRON 00420810','CHEVRON 9999999','WAWA 5198','WEST MARINE #1320','NAPA STORE 1659049'])assert.equal(lookup({raw}),null,raw+' must remain unverified');
assert.match(title({raw:'LOWES #01843',amount:-100}),/^Credit \/ adjustment/);
assert.match(title({raw:'LOWES #01843',amount:0}),/^Zero-amount entry/);
assert.equal(title({raw:'LOWES #01843',amount:100}),'Lowe’s #1843 — Bradenton, FL');
console.log(`${Object.keys(locations).length} exact descriptors; ${new Set(Object.values(locations).map(m=>m.name)).size} stores; ${transactions.filter(t=>lookup(t)).length} transactions. Exact matching and fallback checks passed.`);
