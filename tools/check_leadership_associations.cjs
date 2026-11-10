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
const olive=fixture.transactions.find(t=>t.id==='TXN00049105'),granny=fixture.transactions.find(t=>t.id==='TXN00054488');
assert.equal(ctx.leadershipShare(olive,'Jonathan Hayes'),40597/17);
assert.equal(ctx.leadershipShare(granny,'Jonathan Hayes'),40784/13);
assert.equal(ctx.leadershipShare({...olive,scoped:1700},'Jonathan Hayes'),100);
assert.equal(ctx.leadershipShare(olive,'Allan Branch'),0);
const rosters=vm.runInContext('purchaseParticipants',ctx);
for(const [id,attendees]of Object.entries(rosters)){assert.equal(new Set(attendees).size,attendees.length);const t=fixture.transactions.find(t=>t.id===id);assert(t);assert(Math.abs(attendees.reduce((sum,name)=>sum+ctx.leadershipShare(t,name,t.amount),0)-t.amount)<0.00001);}
assert.match(ctx.leadershipEvidence(olive,'Jonathan Hayes'),/1 of 17 people/);
console.log('PASS: meal shares include non-profile attendees, conserve charges, respect filtered allocations and exclude non-attendee payers');

const conference=fixture.transactions.find(t=>t.id==='TXN00047815');
for(const person of ['Allan Branch','Brian Grainger','Janice Lucas','Josh Street']){assert.equal(ctx.leadershipShare(conference,person),65000);assert(ctx.leadershipMatches(conference,person));}
for(const id of ['TXN00047799','TXN00052673','TXN00053528','TXN00054451','TXN00048381'])assert(vm.runInContext('purchaseParticipants["'+id+'"].length',ctx)>1);
const hotel=fixture.transactions.find(t=>t.id==='TXN00055663');assert.equal(ctx.leadershipShare(hotel,'Robbie Hughes'),hotel.amount);assert.equal(ctx.leadershipShare(hotel,'Lindsey Terry'),0);
const credit=fixture.transactions.find(t=>t.id==='TXN00058015');assert.equal(ctx.leadershipShare(credit,'Amanda Scoggin'),credit.amount);assert.equal(ctx.leadershipShare(credit,'Donita Peters'),0);
assert.equal(ctx.travelShare(conference,'GRAINGER, BRIAN R'),65000);
console.log('PASS: shared registrations, travel, equipment and supplies; payment contacts excluded; credit signs and full charges preserved');
