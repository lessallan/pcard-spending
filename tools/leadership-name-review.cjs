const catalog=require('./leadership-name-review.json');
function applyNameReview(snapshot,transactions){
 const records=new Map(transactions.map(t=>[t.id,t]));
 snapshot.reviewedParticipants={};snapshot.reviewFlags=[];
 for(const item of catalog.items){
  const t=records.get(item.id);
  if(!t||['person','amount','merchant','date'].some(k=>t[k]!==item.expected[k])||!item.expected.purchaseNotes.every(n=>(t.purchaseNotes||[]).includes(n)))throw Error('Name-review evidence changed: '+item.id);
  if(item.status==='supported'){
   const record=snapshot.records[item.id]??={cardholder:t.person,associations:[]};
   if(record.cardholder!==t.person)throw Error('Payer mismatch: '+item.id);
   if(!record.associations.some(a=>a.name===item.name))record.associations.push({name:item.name,relationship:'Named recipient in reviewed purchase notes',evidence:item.expected.purchaseNotes[0]});
   if(item.participants.length>1){
    const previous=snapshot.reviewedParticipants[item.id];
    if(previous&&JSON.stringify(previous)!==JSON.stringify(item.participants))throw Error('Conflicting split: '+item.id);
    snapshot.reviewedParticipants[item.id]=item.participants;
   }
  }else snapshot.reviewFlags.push({id:item.id,name:item.name,status:item.status,reason:item.reason});
 }
 return snapshot;
}
module.exports={applyNameReview};
