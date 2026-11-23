const assert=require('node:assert/strict');
const data=require('../docs/finance-dashboard.json');
const {chromium}=require('/Users/allanbranch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
assert.equal(Object.keys(data.personnelBudget).length,50);
for(const [id,b] of Object.entries(data.personnelBudget)){
 assert.equal(b.total,data.departments.find(x=>x.id===id).points.find(x=>x.year===2027).value);
 assert.equal(b.pay+b.retirement+b.benefits+b.other,b.total);
 assert.equal(b.rows.reduce((s,r)=>s+r.amount,0),b.pay+b.retirement+b.benefits);
 assert.equal(b.pay,b.rows.filter(r=>r.code.startsWith('51')).reduce((s,r)=>s+r.amount,0));
 assert.equal(b.retirement,b.rows.filter(r=>['52201','52202','52203','52204','52205'].includes(r.code)).reduce((s,r)=>s+r.amount,0));
}
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));for(const route of ['','public-safety-preview.html']){
 await p.goto((process.env.PCARDS_TEST_URL||'http://127.0.0.1:4402/')+route);await p.locator('.finance-budget-share').first().waitFor();assert.equal(await p.locator('.finance-budget-share').count(),50);
 for(const [id,b] of Object.entries(data.personnelBudget)){const panel=p.locator(`[data-comparison-id="${id}"] .finance-budget-share`);if(b.total){assert.equal(await panel.locator('.finance-budget-row').count(),4);assert((await panel.innerText()).includes(((b.pay+b.retirement)/b.total*100).toFixed(1)+'%'));}else assert((await panel.innerText()).includes('No spending budgeted'));}
 for(const width of [320,390,768,1280]){await p.setViewportSize({width,height:1000});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 console.log('PASS',route||'home','50 reconciled budget shares and four screen widths');
}assert.deepEqual(errors,[]);}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
