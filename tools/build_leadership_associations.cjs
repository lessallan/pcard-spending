const fs=require('node:fs');
const {createPeopleMatcher}=require('./leadership-matcher.cjs');
const {purchaseNotes}=require('../app/merchant-context.js');
const data=JSON.parse(fs.readFileSync('app/data.json')),leaders=JSON.parse(fs.readFileSync('app/leadership.json'));
const allowed=new Set(leaders.profiles.map(p=>p[0]));
const match=createPeopleMatcher(data.transactions,[...leaders.profiles,...data.staff.map(p=>[p.name])]);
const records={};
for(const t of data.transactions){
 const associations=match({...t,comments:purchaseNotes(t.comments)}).people.filter(p=>allowed.has(p.name));
 if(associations.length)records[t.id]={cardholder:t.person,associations};
}
fs.writeFileSync('docs/leadership-associations.json',JSON.stringify({version:1,records}));
console.log('Built leadership associations for '+Object.keys(records).length+' purchases.');
