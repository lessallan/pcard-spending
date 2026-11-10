// Public travel snapshot authorized for publication November 9, 2026.
// Inputs stay local. Output includes scoped cardholder names, grouping labels and date estimates, not comments.
const fs=require('node:fs');
const data=JSON.parse(fs.readFileSync('app/data.json','utf8')),tripReviews={};
function displayName(s){if(s.includes(',')){let [last,...first]=s.split(',');return `${first.join(' ').trim()} ${last}`.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}
const {tripClue,tripDateRange,transactionTravelAnalysis,travelNonTrip}=require('./travel-research-engine.cjs');
function suggestedTrips(transactions){
 const groups=[],assigned=new Map();
 for(const t of [...transactions].sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id))){
  const clue=tripClue(t);if(!clue)continue;
  let g=groups.find(g=>g.person===t.person&&g.clue===clue.name&&Math.abs(Date.parse(t.date)-Date.parse(g.start))<=clue.days*86400000);
  if(!g){g={person:t.person,clue:clue.name,start:t.date,label:`${clue.name} · ${displayName(t.person)} · purchases from ${t.date}`,reason:clue.reason};groups.push(g)}
  assigned.set(t.id,g);
 }
 return assigned;
}
const suggestions=suggestedTrips(data.transactions);
const records={};
for(const t of data.transactions){
 const g=suggestions.get(t.id);
 if(!g&&!require('./travel-research-catalog.cjs').nonTrip[t.id]&&t.travel==='Not identified as travel'&&!/conference|IEMO|FGFOA|SHRUG|lodging|folio|hotel|\bFLC\b|\bNLC\b/i.test(t.comments.join(' ')))continue;
 records[t.id]={person:g||t.travel!=='Not identified as travel'?t.person:'',group:g?.label||null,reason:g?.reason||null,range:tripDateRange(t),analysis:transactionTravelAnalysis(t),nonTrip:!!travelNonTrip(t)};
}
fs.writeFileSync('docs/travel.json',JSON.stringify({version:1,records}));
console.log('Built travel snapshot: '+Object.keys(records).length+' scoped records, no raw comments.');
