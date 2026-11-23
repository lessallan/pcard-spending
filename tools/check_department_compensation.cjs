const {chromium}=require('/Users/allanbranch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),data=require('../docs/department-compensation.json');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const route of ['','public-safety-preview.html']){
  await p.goto((process.env.PCARDS_TEST_URL||'http://127.0.0.1:4402/')+route);await p.locator('.finance-compensation').first().waitFor();
  assert.equal(await p.locator('.finance-compensation').count(),41);
  assert.equal(await p.locator('.finance-compensation[open]').count(),0);
  assert.equal(await p.locator('[data-mode="staffing"]').count(),0);
  assert.equal(await p.locator('#finance-departments-0 .finance-overview-total').innerText(),'$31,339,833');
  for(const [id,key] of Object.entries(data.accountMap)){
   const panel=p.locator(`[data-comparison-id="${id}"] .finance-compensation`),expected=data.departments[key];
   assert.equal(await panel.getAttribute('data-compensation-department'),key);
   await panel.evaluate(e=>e.open=true);
   assert((await panel.innerText()).includes(`${expected.people} people listed`));assert.equal(await panel.locator('details').count(),0);assert.equal(await panel.locator('.finance-compensation-allowance').count(),expected.allowances?1:0);const ordered=await panel.locator('li[data-annual-max-cents]').evaluateAll(es=>es.map(e=>+e.dataset.annualMaxCents));assert.deepEqual(ordered,[...ordered].sort((a,b)=>b-a));
   assert.equal(await panel.locator('.finance-compensation-role-list>li').count(),expected.roles.length);
   const total=await panel.locator('.finance-pay-total').innerText();
   if(expected.annualPayCents===null)assert(total.includes('Annual total under review'));
   else assert(total.includes(new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(expected.annualPayCents/100)));
   if(expected.allowances){const amount=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(expected.allowances.grossCents/100);assert((await panel.locator('.finance-compensation-allowance').innerText()).includes(amount));}
   if(expected.sharedScope)assert((await panel.innerText()).includes('fund split is unavailable'));
  }
  await p.locator('.finance-compensation details').evaluateAll(es=>es.forEach(e=>e.open=true));
  for(const width of [320,390,768,1280]){await p.setViewportSize({width,height:1000});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.equal(await p.locator('.finance-compensation').evaluateAll(es=>es.filter(e=>e.clientWidth&&e.scrollWidth>e.clientWidth+1).length),0);}
  const police=p.locator('[data-comparison-id="001-2100"]');
  await police.locator('.finance-line').first().locator('[data-year="2027"]').focus();assert((await p.locator('#finance-chart-tooltip').innerText()).includes('$17,735,146'));await p.keyboard.press('Escape');
  await p.locator('[data-mode="revenues"]').click();assert.equal(await p.locator('.finance-compensation').count(),0);
  await p.locator('[data-mode="departments"]').click();assert.equal(await p.locator('.finance-compensation[open]').count(),0);
  console.log('PASS',route||'home','41 sourced panels, rates and allowances, Fire hold, shared-fund notes, revenue exclusion, unchanged budgets, no overflow at four widths');
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
