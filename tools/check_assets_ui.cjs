const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('/Users/allanbranch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.BASE_URL||'http://127.0.0.1:4341/';
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{
const p=await b.newPage(),errors=[],bad=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)bad.push([r.status(),r.url()])});
for(const width of [390,1440])for(const route of ['parks','vehicles','fire-stations']){
 await p.setViewportSize({width,height:900});await p.goto(base+'#'+route);await p.waitForSelector('.asset-row');assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 const expected={parks:30,vehicles:209,'fire-stations':5};assert.equal(await p.locator('.asset-row').count(),expected[route]);
 await p.locator('.asset-row>summary').first().click();await p.waitForSelector('.asset-row[open] .transaction-table');assert(await p.locator('.asset-row[open] .purchase-note-preview').count()>0);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await p.locator('#title').scrollIntoViewIfNeeded();await p.screenshot({path:'/Users/allanbranch/local-apps/PCards/analysis/assets-travel-release-20261111/'+route+'-'+width+'.png'});
}
await p.goto(base+'#parks');await p.waitForSelector('.asset-row');await p.locator('#asset-search').fill('Robert & Mary');assert.equal(await p.locator('.asset-row').count(),1);assert.match(await p.locator('.asset-row').innerText(),/3,438.23/);await p.locator('.asset-row>summary').click();await p.waitForSelector('.asset-row[open] .purchase-note-preview');assert.match(await p.locator('.asset-row').innerText(),/Water Fountain/);await p.locator('.asset-row [data-detail]').click();await p.waitForSelector('#detail[open]');assert.match(await p.locator('#detail').innerText(),/TXN00058179/);await p.locator('#close-detail').click();
await p.locator('#asset-search').fill('no-match-xyz');assert.equal(await p.locator('.asset-row').count(),0);assert.match(await p.locator('#asset-results').innerText(),/Clear the search/);await p.locator('#asset-reset').click();assert.equal(await p.locator('.asset-row').count(),30);
await p.goto(base+'#vehicles?asset=unit-386');await p.waitForSelector('.asset-row[open]');assert.equal(await p.locator('.asset-row[open]').getAttribute('data-asset'),'unit-386');assert.match(await p.locator('.asset-row[open]').innerText(),/10,045.00/);assert.match(await p.locator('.asset-row[open]').innerText(),/Likely/);
await p.locator('#asset-search').fill('unit 386');await p.locator('input[name=fy][value=FY26]').check();await p.waitForTimeout(250);assert.match(await p.locator('.asset-row').innerText(),/4,040.00/);await p.locator('input[name=fy][value=""]').check();await p.waitForTimeout(250);
const totals=await p.evaluate(()=>{assetSearch='';const g=assetMatches();return {unique:new Set(g.flatMap(g=>g.members.map(m=>m.id))).size,net:[...new Map(g.flatMap(g=>g.members.map(m=>[m.id,m.t]))).values()].reduce((s,t)=>s+t.amount,0)}});assert(totals.unique>0);
await p.locator('#asset-search').fill('unit 389');await p.locator('#asset-shared').selectOption('hide');assert(await p.evaluate(()=>assetMatches().every(g=>g.members.every(m=>!m.shared))));
assert.deepEqual(errors,[]);assert.deepEqual(bad,[]);console.log('PASS '+base+': 244 groups, original notes, source transaction dialog, search/empty/reset, deep links, yearly totals, likely/shared flags, no overflow at 390/1440, no browser or HTTP errors');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
