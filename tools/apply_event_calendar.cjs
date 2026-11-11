// Apply only reviewed, fingerprinted event connections. Event dates never become stay dates.
const assert=require('node:assert/strict');
const calendar=require('./event-calendar.json'),proposals=require('./event-calendar-connections.json');
function applyEventCalendar(transactions,records){
 const by=new Map(transactions.map(t=>[t.id,t])),changes=[];
 // Validate the complete input before making any changes.
 for(const p of proposals)for(const expected of p.expectedRecords){
  const t=by.get(expected.id);assert(t,'Missing event evidence '+expected.id);
  for(const key of ['id','date','person','raw','amount'])assert.deepEqual(t[key],expected[key],'Changed source '+expected.id+' '+key);
  const notes=t.purchaseNotes?.length?t.purchaseNotes:(t.comments||[]).map(n=>n.replace(/^\([^)]*\d{1,2}\/\d{1,2}\/\d{2}[^)]*\)\s*/,'').trim());
  assert.deepEqual(notes,expected.purchaseNotes,'Changed event notes '+expected.id);
  assert(t.amount>0,'Credit cannot anchor a trip '+t.id);
 }
 for(const p of proposals){
  const e=calendar.find(e=>e.id===p.event_id);assert(e?.eligibleForMatching,'Unverified event dates');
  const r=records[p.id];assert(r&&!r.nonTrip,'Missing or excluded target '+p.id);
  const anchors=p.supporting_ids.map(id=>records[id]);assert(anchors.every(a=>a?.group&&!a.nonTrip),'Missing anchor group');
  const labels=[...new Set(anchors.map(a=>a.group))];assert.equal(labels.length,1,'Conflicting anchor groups '+p.id);
  const old=labels[0];assert(!r.group||r.group===old,'Target already assigned elsewhere '+p.id);
  const newLabel=old.replace(anchors[0].groupName,e.name);
  // Rename an existing edition consistently; do not acquire nearby unrelated records.
  for(const a of Object.values(records))if(a.group===old){a.group=newLabel;a.groupName=e.name;}
  const reason='Likely event connection: '+p.reason+' Supporting records: '+p.supporting_ids.join(', ')+'. Confirm with '+p.confirmation_needed+'.';
  r.group=newLabel;r.groupName=e.name;r.reason=reason;
  r.analysis.events=[{...e,editionBasis:'Reviewed likely connection; event dates do not establish attendance or itinerary'}];
  r.analysis.evidence=r.analysis.evidence.filter(x=>!x.text.startsWith('Likely event connection:'));
  r.analysis.evidence.push({text:reason,url:e.url});
  changes.push({id:p.id,event:e.name,amount:by.get(p.id).amount,group:newLabel});
 }
 // Refund posting/comment dates cannot establish the timing of a trip.
 for(const t of transactions)if(t.amount<0&&records[t.id])records[t.id].range=null;
 return changes;
}
module.exports={applyEventCalendar};
if(require.main===module){const fs=require('node:fs'),data=require('../docs/data.json'),snapshot=require('../docs/travel.json');const changes=applyEventCalendar(data.transactions,snapshot.records);fs.writeFileSync('docs/travel.json',JSON.stringify(snapshot));console.log('Applied '+changes.length+' bounded Likely connections; '+changes.reduce((n,c)=>n+c.amount,0)+' cents.');}
