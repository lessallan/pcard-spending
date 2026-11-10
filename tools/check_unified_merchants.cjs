const assert=require('node:assert/strict');
const {chromium}=require('/Users/allanbranch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const base=process.env.BASE_URL||'http://127.0.0.1:4322/';
  await page.goto(base+'#merchants');await page.locator('#merchant-scope').waitFor();
  assert.equal(await page.locator('#nav a[href="#retail"]').count(),0);
  assert.equal(await page.locator('#nav a[href="#merchants"]').count(),1);
  assert.equal(await page.locator('#title').textContent(),'Merchants');
  assert(await page.evaluate(()=>rows.length===data.transactions.length));
  assert.equal(await page.locator('#rank-metric').count(),1);
  await page.selectOption('#merchant-scope','retailers');
  assert(await page.evaluate(()=>rows.length===data.transactions.filter(t=>t.mixed).length));
  for(const label of ['FY25 · Retailers','FY26 · Retailers','FY25 · Spending areas','FY26 · Spending areas'])assert((await page.locator('#content').innerText()).includes(label));
  assert.equal(await page.locator('#rank-metric').count(),1);
  await page.selectOption('#retailer-scope','amazon-walmart');
  assert(await page.evaluate(()=>rows.length===data.transactions.filter(t=>t.mixed&&['Amazon','Walmart'].includes(t.merchant)).length));
  const category=await page.locator('#retailer-scope option').nth(2).getAttribute('value');
  await page.selectOption('#retailer-scope',category);
  assert(await page.evaluate(c=>rows.length===data.transactions.filter(t=>t.mixed&&t.category===c).length,category));
  await page.locator('.transactions [data-detail]').first().click();assert(await page.locator('#detail').isVisible());await page.locator('#close-detail').click();
  await page.selectOption('#merchant-scope','all');assert(await page.evaluate(()=>rows.length===data.transactions.length));
  await page.goto(base+'#retail');await page.locator('#retailer-scope').waitFor();assert.equal(new URL(page.url()).hash,'#merchants');
  assert.equal(await page.locator('#merchant-scope').inputValue(),'retailers');
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:900});
   await page.selectOption('#merchant-scope','all');await page.selectOption('#merchant-scope','retailers');
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  assert.deepEqual(errors,[]);console.log('PASS unified Merchants: all/retailer/category counts, yearly breakdowns, details, legacy links, desktop/mobile, no browser errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
