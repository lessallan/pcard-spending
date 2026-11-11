const assert=require('node:assert/strict');
const {chromium}=require('/Users/allanbranch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:4327/';
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[],failed=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push([r.status(),r.url()])});
await p.goto(base+'#travel');await p.waitForSelector('.trip-card');
const checks=await p.evaluate(()=>{
 const g=tripGroups(),find=id=>g.find(x=>x.items.some(t=>t.id===id));
 return {prima:find('TXN00055934').items.map(t=>t.id),dc:find('TXN00058141').items.reduce((n,t)=>n+t.amount,0),cancel:find('TXN00045501').items.reduce((n,t)=>n+t.amount,0),smith:find('TXN00055953').items.reduce((n,t)=>n+t.amount,0),person:travelRecipients(travelTransaction(data.transactions.find(t=>t.id==='TXN00053923'))),unknown:!!find('TXN00053043'),duplicates:g.flatMap(x=>x.items).length-new Set(g.flatMap(x=>x.items.map(t=>t.id))).size};
});assert.equal(checks.prima.length,13);assert.equal(checks.dc,132334);assert.equal(checks.cancel,0);assert.equal(checks.smith,22500);assert.equal(checks.unknown,false);assert.equal(checks.duplicates,0);assert(checks.person.some(n=>/CRUTCHFIELD|Crutchfield/.test(n)));
const linked=await p.evaluate(()=>{const groups=tripGroups(),g=id=>groups.find(g=>g.items.some(t=>t.id===id));return {bush:g('TXN00041854').items.map(t=>t.id),hughes:g('TXN00055663').items.map(t=>t.id),daugherty:g('TXN00048265').items.map(t=>t.id),taylor:g('TXN00043389').items.map(t=>t.id),street:g('TXN00042701').items.map(t=>t.id),conflict:g('TXN00056327')?.label===g('TXN00056328')?.label}});
assert(linked.bush.includes('TXN00041890'));assert(linked.hughes.includes('TXN00055205'));assert(linked.daugherty.includes('TXN00048653'));assert(linked.taylor.includes('TXN00043223'));assert(linked.street.includes('TXN00045043'));assert.equal(linked.conflict,false);
assert.equal(await p.locator('.trip-card').filter({hasText:'Possible shared WEFTEC hotel booking'}).count(),1);
const prima=p.locator('.trip-card').filter({hasText:'PRIMA conference · June 2026'});assert.equal(await prima.count(),1);await prima.locator('summary').click();assert.match(await prima.innerText(),/TXN00055934/);
const cancel=p.locator('.trip-card').filter({hasText:'Jacob Taylor · Smoke Divers booking / cancellation'});assert.equal(await cancel.count(),1);
await p.evaluate(()=>{location.hash='travel/person/'+encodeURIComponent('CRUTCHFIELD, JONATHAN')});await p.waitForSelector('.travel-person-summary');assert(await p.locator('.trip-card').count()>0);
await p.evaluate(()=>{location.hash='overview'});await p.waitForSelector('#guide-title');assert.match(await p.locator('#guide-title').innerText(),/Watch/);assert(await p.locator('.guide-video').count());
await p.evaluate(()=>{location.hash='transactions'});await p.waitForSelector('.transactions');
for(const width of [1440,390]){await p.setViewportSize({width,height:900});await p.evaluate(()=>{location.hash='travel'});await p.waitForSelector('.trip-card');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
// Saved membership decisions retain priority over newly published suggestions.
await p.evaluate(()=>{localStorage.setItem('pcard-trips-v1',JSON.stringify({TXN00055914:{group:'TEST saved membership',status:'excluded',note:'Test preserved saved review'}}))});await p.reload();await p.waitForSelector('.trip-card');assert(await p.evaluate(()=>tripReviews.TXN00055914.group==='TEST saved membership'&&tripReviews.TXN00055914.status==='excluded'&&!tripGroups().some(g=>g.items.some(t=>t.id==='TXN00055914'))));await p.evaluate(()=>localStorage.removeItem('pcard-trips-v1'));
for(const path of ['review/','review/policies/panama-city/','policies/panama-city/purchasing-card-policy-2025-06-24.pdf']){const r=await p.request.get(base+path);assert.equal(r.status(),200,path)}
assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS '+base+': trip associations, exact totals/refunds, named cross-card recipient, unresolved rides, full titles, person view, preserved video/navigation, saved reviews, desktop/mobile, report/policy links, no HTTP/browser errors');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
