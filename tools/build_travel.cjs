// Public travel snapshot authorized for publication November 9, 2026.
// Inputs stay local. Output includes scoped cardholder names, grouping labels and date estimates, not comments.
const fs=require('node:fs');
const data=JSON.parse(fs.readFileSync('app/data.json','utf8')),tripReviews={};
function displayName(s){if(s.includes(',')){let [last,...first]=s.split(',');return `${first.join(' ').trim()} ${last}`.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}
const {tripClue,tripDateRange,transactionTravelAnalysis,travelNonTrip,suggestedTrips}=require('./travel-research-engine.cjs');
const {createPeopleMatcher}=require('./leadership-matcher.cjs');
const leaders=JSON.parse(fs.readFileSync('app/leadership.json'));
const match=createPeopleMatcher(data.transactions,[...leaders.profiles,...data.staff.map(p=>[p.name])]);
const rawByName=new Map(data.transactions.map(t=>[displayName(t.person).split(' ').filter(x=>x.length>1).join(' ').toLowerCase(),t.person]));
for(const [name,raw] of Object.entries(leaders.cardholders))rawByName.set(name.toLowerCase(),raw);
const catalog=require('./travel-research-catalog.cjs');
function recipientsFor(t){const override=catalog.travelers?.[t.id];return override?override.map(n=>rawByName.get(n.toLowerCase())||n):[...new Set(match(t).people.map(p=>rawByName.get(p.name.toLowerCase())||p.name))]}
const suggestions=suggestedTrips(data.transactions,t=>{const names=recipientsFor(t);return names.length?names:[t.person]});
const records={};
for(const t of data.transactions){
 const g=suggestions.get(t.id);
 if(!g&&!require('./travel-research-catalog.cjs').nonTrip[t.id]&&t.travel==='Not identified as travel'&&!/conference|IEMO|FGFOA|SHRUG|lodging|folio|hotel|\bFLC\b|\bNLC\b/i.test(t.comments.join(' ')))continue;
 const recipients=travelNonTrip(t)?[]:recipientsFor(t);
 records[t.id]={recipients,recipientOverride:!!catalog.travelers?.[t.id],groupName:g?.clue||null,person:g||t.travel!=='Not identified as travel'?t.person:'',group:g?.label||null,reason:g?.reason||null,range:tripDateRange(t),analysis:transactionTravelAnalysis(t),nonTrip:!!travelNonTrip(t)};
}
require('./refine_travel_groups.cjs').refineTravelGroups(data.transactions,records);
fs.writeFileSync('docs/travel.json',JSON.stringify({version:1,records}));
console.log('Built travel snapshot: '+Object.keys(records).length+' scoped records, no raw comments.');
