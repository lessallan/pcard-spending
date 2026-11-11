const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),review=require('./reviewed-travel-changes.json');
function applyReviewedTravel(transactions,records){
 const by=new Map(transactions.map(t=>[t.id,t]));
 for(const op of review.operations){const t=by.get(op.id);assert(t&&records[op.id],'Missing reviewed transaction '+op.id);for(const evidence of op.supportingSources||[]){const anchor=by.get(evidence.id);assert(anchor,'Missing supporting source '+evidence.id);for(const [key,value]of Object.entries(evidence))assert.deepEqual(anchor[key],value,'Changed supporting source '+evidence.id);}for(const [key,value]of Object.entries(op.source))assert.deepEqual(t[key],value,'Changed source '+op.id+' '+key);}
 for(const op of review.operations){const r=records[op.id];r.group=op.group;r.groupName=op.groupName;if(op.refundWith)r.refundWith=op.refundWith;r.reason=(op.refundWith?'Likely refund match: ':op.group?'Likely connection: ':'Unresolved connection: ')+op.reason;if(op.recipients){r.recipients=op.recipients;r.recipientOverride=true;}if(!op.group){r.analysis.events=[];if(op.id==='TXN00043996')r.analysis.destinations=[];}r.analysis.evidence=r.analysis.evidence.filter(e=>!e.text.startsWith('Reviewed November 11:'));r.analysis.evidence.push({text:'Reviewed November 11: '+r.reason,...(op.sourceUrl?{url:op.sourceUrl}:{})});if(by.get(op.id).amount<0)r.range=null;}
 return review.operations.length;
}
module.exports={applyReviewedTravel};
