const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {createPeopleMatcher}=require('./leadership-matcher.cjs');
const fixture=require('../docs/data.json'),associations=require('../docs/leadership-associations.json'),leadership=require('../app/leadership.json');
const matcher=createPeopleMatcher([{person:'SMITH, MARK'},{person:'SMITH, MARY'}],leadership.profiles);
assert.equal(matcher({comments:['(Janice Lucas, 1/2/25 9:30) Approved']}).people.length,0);
assert.equal(matcher({comments:['Hotel for M. Smith']}).people.length,0,'Ambiguous initials are not attributed');
assert.equal(matcher({comments:['Hotel for Commissioner Lucas']}).people[0].relationship,'For / on behalf of');
const ctx=vm.createContext({fixture,associations});
vm.runInContext(fs.readFileSync('app/merchant-context.js','utf8'),ctx);
const code=fs.readFileSync('app/app.js','utf8');vm.runInContext(code.slice(0,code.indexOf("$('content').addEventListener")),ctx);vm.runInContext('data=fixture;leadershipAssociations=associations;',ctx);
const lucas=ctx.leadershipRecords('Janice Lucas');assert(lucas.some(t=>t.id==='TXN00042348'));
assert.equal(ctx.leadershipPayer(lucas.find(t=>t.id==='TXN00042348')),'MULLANEY, VICTORIA A');
const branch=ctx.leadershipRecords('Allan Branch');assert(branch.some(t=>t.id==='TXN00047720'));
for(const [name] of leadership.profiles){const records=ctx.leadershipRecords(name);assert.equal(new Set(records.map(t=>t.id)).size,records.length);for(const t of fixture.transactions.filter(t=>t.person===leadership.cardholders[name]))assert(records.some(r=>r.id===t.id));}
const allowed=new Set(leadership.profiles.map(p=>p[0]));
for(const [id,record] of Object.entries(associations.records)){const t=fixture.transactions.find(t=>t.id===id);assert(t);for(const a of record.associations){assert(allowed.has(a.name));assert(t.purchaseNotes.some(note=>note.includes(a.evidence)),'Evidence must be drawn from approved purchase notes');}}
assert.equal(fs.readFileSync('app/app.js','utf8'),fs.readFileSync('docs/app.js','utf8'));
console.log('PASS: cross-card bookings, actual payer, explicit evidence, own-card inclusion, no duplicates, ambiguous names and comment authors excluded');
