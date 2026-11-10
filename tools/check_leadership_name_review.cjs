const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const fixture=require('../docs/data.json'),associations=require('../docs/leadership-associations.json'),{applyNameReview}=require('./leadership-name-review.cjs');
const ctx=vm.createContext({fixture,associations});vm.runInContext(fs.readFileSync('app/merchant-context.js','utf8'),ctx);const code=fs.readFileSync('app/app.js','utf8');vm.runInContext(code.slice(0,code.indexOf("$('content').addEventListener")),ctx);vm.runInContext('data=fixture;leadershipAssociations=associations;',ctx);
const totals={};for(const name of ['Janice Lucas','Jonathan Hayes','Brian Grainger','Josh Street','David Collier','Allan Branch','Robbie Hughes','Jared Jones','Brandy Waldron']){const rows=ctx.leadershipRecords(name);totals[name]={count:rows.length,total:Math.round(rows.reduce((n,t)=>n+ctx.leadershipShare(t,name,t.amount),0))/100};}
for(const [name,total] of Object.entries({'Janice Lucas':34077.69,'Jonathan Hayes':60903.88,'Brian Grainger':10890.95,'Josh Street':8622.61,'David Collier':3356.20,'Jared Jones':15475.52,'Brandy Waldron':9699.91,'Allan Branch':8600.04,'Robbie Hughes':3591.48}))assert.equal(totals[name].total,total,name);
const tx=id=>fixture.transactions.find(t=>t.id===id);
assert.equal(ctx.leadershipShare(tx('TXN00042578'),'Jonathan Hayes')+ctx.leadershipShare(tx('TXN00044362'),'Jonathan Hayes'),0);
for(const [id,people] of Object.entries(associations.reviewedParticipants))assert.equal(people.reduce((sum,n)=>sum+ctx.leadershipShare(tx(id),n),0),tx(id).amount);
assert.equal(associations.reviewFlags.length,5);
for(const f of associations.reviewFlags)assert(!ctx.leadershipMatches(tx(f.id),f.name),'Flag must not enter totals '+f.id);
assert(!ctx.leadershipMatches(tx('TXN00047886'),'Josh Street'));
assert(!ctx.leadershipMatches(tx('TXN00053677'),'Robbie Hughes'));
assert.equal(ctx.leadershipPayer(tx('TXN00041737')),'MULLANEY, VICTORIA A');
assert.equal(ctx.leadershipShare(tx('TXN00047744'),'Allan Branch'),280000);
const rebuilt=applyNameReview(JSON.parse(JSON.stringify(associations)),fixture.transactions);assert.deepEqual(rebuilt,associations,'Review is idempotent');
const changed=JSON.parse(JSON.stringify(fixture.transactions));changed.find(t=>t.id==='TXN00041737').purchaseNotes=[];assert.throws(()=>applyNameReview(JSON.parse(JSON.stringify(associations)),changed),/evidence changed/);
console.log('PASS: reviewed totals, shared charge conservation, cancellation pair, payer preservation, likely exclusions, surname collisions, anchor validation and idempotence.');console.log(JSON.stringify(totals,null,2));

assert.deepEqual(associations.reviewFlags.map(f=>f.id).sort(),['TXN00048450','TXN00048758','TXN00051850','TXN00052022','TXN00052672'].sort());
for(const item of require('./leadership-name-review.json').items.filter(i=>i.identity_confirmation)){const t=tx(item.id);assert(ctx.leadershipMatches(t,item.name));assert.equal(ctx.leadershipShare(t,item.name),t.amount);assert.equal(ctx.leadershipPayer(t),item.expected.person);}
console.log('PASS: eight user-confirmed recipients receive full charges; three mixed supplies and two Collier records remain excluded.');
