// Public travel snapshot authorized for publication November 9, 2026.
// Inputs stay local. Output includes scoped cardholder names, grouping labels and date estimates, not comments.
const fs=require('node:fs');
const data=JSON.parse(fs.readFileSync('app/data.json','utf8')),tripReviews={};
function displayName(s){if(s.includes(',')){let [last,...first]=s.split(',');return `${first.join(' ').trim()} ${last}`.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}
function tripClue(t){
 const text=t.comments.join(' ').replace(/\([^)]*\d{1,2}\/\d{1,2}\/\d{2}[^)]*\)/g,' ');
 const events=[['IEMO II',/\bIEMO\s*(?:II|2)\b/i],['IEMO',/\bIEMO\b/i],['NLC City Summit',/\b(?:NLC|city summitt?)\b/i],['FGCU budget training',/\bFGCU\b|budget training/i],['FGFOA',/\bFGFOA\b/i],['FLC',/\bFLC\b/i],['SHRUG',/\bSHRUG\b/i]];
 const found=events.find(([,pattern])=>pattern.test(text));
 if(found)return {name:found[0],days:120,reason:'Shared event wording in comments; purchases within 120 days of the first charge. Event editions and travelers need review.'};
 const city=text.match(/\b([A-Z][a-z]+(?: [A-Z][a-z]+){0,2}),\s*(FL|MA|GA|DC|NV|TX|NY)\b/);
 if(city&&(t.travel&&t.travel!=='Not identified as travel'||/\b(?:travel|training|conference|lodging|hotel|flight)\b/i.test(text)))return {name:city[0],days:21,reason:'Shared destination wording and cardholder; purchases within 21 days of the first charge. Separate visits may be mixed.'};
 const hotel=tripDestination(t);if(hotel)return {name:hotel+' (hotel clue)',days:21,reason:'City named in hotel descriptor; purchases within 21 days. Destination and separate stays need review.'};
 return null;
}
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
function tripGroups(){
 const suggestions=suggestedTrips(data.transactions),groups=new Map();
 for(const t of data.transactions){
  const saved=tripReviews[t.id],suggestion=suggestions.get(t.id);
  const label=typeof saved?.group==='string'&&saved.group.trim()?saved.group:suggestion?.label;
  if(!label)continue;
  if(!groups.has(label))groups.set(label,{label,items:[]});
  groups.get(label).items.push({...t,tripStatus:['confirmed','excluded'].includes(saved?.status)?saved.status:'suggested',tripReason:saved?.note||suggestion?.reason||'Manually assigned; review supporting records.'});
 }
 return [...groups.values()].sort((a,b)=>a.label.localeCompare(b.label));
}
// Dates come only from explicit ranges in travel comments, never review timestamps.
function tripComment(t){return (t.comments||[]).join(' ').replace(/\([^)]*\d{1,2}\/\d{1,2}\/\d{2}[^)]*\)/g,' ')}
function tripDateRange(t){
 const text=tripComment(t),ranges=[];
 const pattern=/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{4}|\d{2}))?\s*[-–]\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{4}|\d{2})|,\s*(\d{4}))?\b/g;
 const year=v=>v?(+v<100?2000+(+v):+v):null;
 const iso=(y,m,d)=>{const x=new Date(Date.UTC(y,m-1,d));return x.getUTCFullYear()===y&&x.getUTCMonth()===m-1&&x.getUTCDate()===d?x.toISOString().slice(0,10):null};
 for(const m of text.matchAll(pattern)){
  let y1=year(m[3]),y2=year(m[6]||m[7]);const inferred=!y1&&!y2;
  y1=y1||y2||+t.date.slice(0,4);y2=y2||y1;
  if(+m[4]<+m[1]&&!m[6]&&!m[7])y2++;
  const start=iso(y1,+m[1],+m[2]),end=iso(y2,+m[4],+m[5]);
  if(!start||!end)continue;
  const days=(Date.parse(end)-Date.parse(start))/86400000+1;
  if(days>0&&days<=60)ranges.push({start,end,days,inferred});
 }
 const unique=[...new Map(ranges.map(r=>[r.start+'/'+r.end,r])).values()];
 return unique.length===1?unique[0]:null;
}
function tripDestination(t){
 // Literal city names in hotel descriptors are clues, not geocoded itineraries.
 const raw=t.raw||'';
 if(!/hotel|suites|sheraton|marriott|hyatt|hampton|hilton|marquis|resort/i.test(raw))return null;
 return ['Salt Lake City','Boston','Chicago','Denver','Orlando','Atlanta','Tampa','Jacksonville','Tallahassee','Pensacola','Miami'].find(city=>raw.toLowerCase().includes(city.toLowerCase()))||null;
}
function tripDestinationLabel(value){
 const cities={'Atlanta':'Georgia','Boston':'Massachusetts','Chicago':'Illinois','Denver':'Colorado','Salt Lake City':'Utah','Orlando':'Florida','Tampa':'Florida','Jacksonville':'Florida','Tallahassee':'Florida','Pensacola':'Florida','Miami':'Florida'};
 const states={FL:'Florida',MA:'Massachusetts',GA:'Georgia',DC:'District of Columbia',NV:'Nevada',TX:'Texas',NY:'New York'};
 const clean=value.replace(/ \(hotel clue\)$/,'');
 if(cities[clean])return clean+', '+cities[clean];
 return clean.replace(/, (FL|MA|GA|DC|NV|TX|NY)$/,(_,state)=>', '+states[state]);
}
function tripFacts(g){
 const included=g.items.filter(t=>t.tripStatus!=='excluded');
 const dates=included.map(t=>t.date).sort();
 const ranges=included.filter(t=>t.amount>0).map(tripDateRange).filter(Boolean);
 const unique=[...new Map(ranges.map(r=>[r.start+'/'+r.end,r])).values()];
 const range=unique.length===1?{...unique[0],inferred:ranges.some(r=>r.inferred)}:null;
 return {included,range,conflict:unique.length>1,start:dates[0],end:dates.at(-1),destinations:[...new Set(included.map(tripDestination).filter(Boolean))]};
}
function tripDateLabel(date){return new Date(date+'T00:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})}
function tripDateSpan(a,b){return a===b?tripDateLabel(a):tripDateLabel(a)+' – '+tripDateLabel(b)}

const suggestions=suggestedTrips(data.transactions);
const records={};
for(const t of data.transactions){
 const g=suggestions.get(t.id);
 if(!g&&t.travel==='Not identified as travel')continue;
 records[t.id]={person:t.person,group:g?.label||null,reason:g?.reason||null,range:tripDateRange(t)};
}
fs.writeFileSync('docs/travel.json',JSON.stringify({version:1,records}));
console.log('Built travel snapshot: '+Object.keys(records).length+' scoped records, no raw comments.');
