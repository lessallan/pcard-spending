const assert=require('node:assert/strict');
const {chromium}=require('/Users/allanbranch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});try{
const p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const width of [375,390,1440]){
 await p.setViewportSize({width,height:900});await p.goto('http://127.0.0.1:4339/#travel/person/'+encodeURIComponent('LUCAS, JANICE L'));await p.waitForSelector('.fee-row');
 assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 const rows=await p.locator('.fee-row>summary').allTextContents();assert(rows.length);assert(rows.every(x=>! /\d+ purchases?/.test(x)));
 const fee=p.locator('.travel-fees');await fee.scrollIntoViewIfNeeded();await p.screenshot({path:'/Users/allanbranch/local-apps/PCards/analysis/consolidated-release-20261111/fees-'+width+'.png'});
 const facts=await p.evaluate(()=>{const g=tripGroups(),find=id=>g.find(g=>g.items.some(t=>t.id===id));return {lucas:find('TXN00051517').items.some(t=>t.id==='TXN00053981'),face:find('TXN00056114').items.reduce((n,t)=>n+t.amount,0),ffma:find('TXN00056106').items.reduce((n,t)=>n+t.amount,0)}});assert(facts.lucas);assert.equal(facts.face,116106);assert.equal(facts.ffma,135000);
 await p.goto('http://127.0.0.1:4339/#staff');await p.waitForSelector('.staff-person');assert(!(await p.locator('body').innerText()).includes('Main spending area:'));
 await p.locator('.staff-person .transaction-filter-link').first().click();await p.waitForSelector('.transactions');await p.waitForFunction(()=>document.querySelector('#title').getBoundingClientRect().top<250);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
}
assert.deepEqual(errors,[]);console.log('PASS: 375/390/1440px fee rows, no purchase-count subtitles, nine-connection sample totals, staff labels, explorer jump and no browser errors');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
