// Refine published evidence without regenerating private source notes or changing amounts.
const DAY=86400000,day=s=>Date.parse(s)/DAY;
function refineTravelGroups(transactions,records){
 const buckets=new Map(),changes=[];
 const people=(t,r)=>[...new Set(r?.recipients?.length?r.recipients:[t.person])].filter(Boolean).sort();
 // Only specific, published event editions can reunite advance and in-trip purchases.
 // Generic city/organization matches are not sufficient.
 for(const t of transactions){const r=records[t.id];if(!r?.group||r.nonTrip||/reviewed /.test(r.group))continue;
  if(!/20\d{2}/.test(r.groupName||''))continue;
  const key=JSON.stringify([r.groupName,people(t,r)]);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(t);
 }
 const episodes=[];
 for(const members of buckets.values()){
  const first=records[members[0].id],name=first.groupName;
  const events=members.flatMap(t=>records[t.id].analysis?.events||[]).filter(e=>e.name===name);
  const editions=[...new Map(events.map(e=>[e.start+'/'+e.end,e])).values()];
  if(editions.length!==1)continue;
  const event=editions[0],ranges=[...new Set(members.map(t=>records[t.id].range).filter(Boolean).map(r=>r.start+'/'+r.end))];
  if(ranges.length>1||members.some(t=>{const r=records[t.id].range;return r&&(day(r.end)<day(event.start)-3||day(r.start)>day(event.end)+3)}))continue; // Multiple explicit itineraries may represent separate visits.
  const anchors=members.filter(t=>new RegExp(event.pattern,'i').test([...(t.purchaseNotes||[]),...(t.comments||[])].join(' '))&&
   (records[t.id].analysis?.events||[]).some(e=>e.name===name)&&
   /Lodging|Ground transportation|baggage|seat/i.test(records[t.id].analysis?.kind||'')&&
   day(t.date)>=day(event.start)-3&&day(t.date)<=day(event.end)+3);
  // At least two independently event-named, contemporaneous purchases support an episode.
  if(anchors.length<2)continue;
  const recipientNames=people(members[0],first);if(!recipientNames.length)continue;
  const target=members.slice().sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id))[0];
  const targetRecord=records[target.id],label=targetRecord.group;
  const evidence=anchors.map(t=>t.id).sort();
  const reason='Likely same trip: matching traveler and specific event edition, supported by event-named travel purchases '+evidence.join(', ')+'. Advance purchases can precede travel; attendance and exact travel dates remain unverified.';
  for(const t of members){const r=records[t.id];if(r.group!==label){changes.push({id:t.id,before:r.group,after:label,reason,anchors:evidence});r.group=label;r.reason=reason;}}
  episodes.push({name,label,people:recipientNames,event,anchors,evidence,start:Math.min(...anchors.map(t=>day(t.date))),end:Math.max(...anchors.map(t=>day(t.date)))});
 }
 // Freeze anchor episodes before matching fees. Inferred members never become evidence.
 for(const t of transactions){const r=records[t.id];if(r?.group||r?.nonTrip||t.amount<=0)continue;
  const text=t.merchant+' '+[...(t.purchaseNotes||[]),...(t.comments||[])].join(' ');
  if(!/baggage|luggage|EXCS_BAG|\bseat (?:fee|upgrade|change)|CMFT SEG Upsell/i.test(text))continue;
  if(/refund|cancel|registration|deposit/i.test(text))continue;
  const names=people(t,r);if(names.length!==1)continue;
  const candidates=episodes.filter(e=>e.people.length===1&&e.people[0]===names[0]&&day(t.date)>=e.start-1&&day(t.date)<=e.end+1);
  if(candidates.length!==1)continue;
  const e=candidates[0];
  // Another travel group for this person near the fee is competing evidence.
  const competing=transactions.some(x=>{const q=records[x.id];return q?.group&&q.group!==e.label&&!q.nonTrip&&people(x,q).includes(names[0])&&Math.abs(day(x.date)-day(t.date))<=3&&!/registration|insurance/i.test(q.analysis?.kind||'');});
  if(competing)continue;
  const reason='Likely in-trip airline fee: same traveler and purchase date within the event-named ride/hotel travel window. Supporting records: '+e.evidence.join(', ')+'. Missing receipt or itinerary still needs confirmation; purchase date is not a verified service date.';
  records[t.id]={...r,recipients:r?.recipients||[],person:r?.person||t.person,group:e.label,groupName:e.name,reason,range:r?.range||null,nonTrip:false,analysis:r?.analysis||{kind:'Airline baggage / seat fee',destinations:[],events:[],evidence:[]}};
  records[t.id].analysis={...records[t.id].analysis,evidence:[...(records[t.id].analysis.evidence||[]),{text:reason}]};
  changes.push({id:t.id,before:null,after:e.label,reason,anchors:e.evidence});
 }
 return changes;
}
module.exports={refineTravelGroups};
