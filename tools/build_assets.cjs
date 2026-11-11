const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const c=require('./asset-research-catalog.json'),bytes=fs.readFileSync('docs/data.json'),d=JSON.parse(bytes),by=new Map(d.transactions.map(t=>[t.id,t]));
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),c.sourceSha256,'Source changed: re-review asset memberships');
const seen=new Set();for(const g of c.groups){assert(!seen.has(g.id),'Duplicate asset');seen.add(g.id);const ids=new Set();for(const m of g.members){assert(by.has(m.id));assert(!ids.has(m.id));ids.add(m.id);assert(['Named','Likely','Needs review'].includes(m.confidence));}}
fs.writeFileSync('docs/assets.json',JSON.stringify(c));console.log('Built '+c.groups.length+' place/asset groups; full charges and notes remain in unchanged source data.');
