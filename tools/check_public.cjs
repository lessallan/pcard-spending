const assert=require('node:assert/strict');
const fs=require('node:fs');
let chromium;try{({chromium}=require('playwright'))}catch{({chromium}=require('/Users/allanbranch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))}
const base=process.env.BASE_URL||'http://127.0.0.1:4311/';
const dataset=JSON.parse(fs.readFileSync('docs/data.json','utf8'));
const approved=JSON.parse(fs.readFileSync('app/leadership.json','utf8'));
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n/100);
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1500}});const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failed.push([r.status(),r.url()])});
 await page.goto(base);await page.waitForSelector('.stats');
 assert.match(await page.locator('.site-intro').innerText(),/historical snapshot, not a live view/);
 assert.match(await page.locator('.site-intro').innerText(),/August 27, 2024/);
 assert.equal(await page.locator('main .resident-guide').count(),0);
 assert.equal(await page.locator('#export, a[href="#review"], #status').count(),0);
 assert.equal(await page.locator('.brand-logo').evaluate(e=>e.complete&&e.naturalWidth>0),true);
 assert.equal(await page.locator('.stat strong').nth(3).innerText(),'16,793');
 await page.screenshot({path:'/tmp/pcards-public-desktop.png'});
 const remoteData=await (await page.request.get(base+'data.json?v=leadership-20261109')).json();assert.deepEqual(remoteData,dataset);
 for(const route of ['travel','retail','centers','merchants','staff']){
  await page.locator(`nav a[href="#${route}"]`).click();await page.waitForFunction(route=>document.querySelector('nav a[href="#'+route+'"]')?.getAttribute('aria-current')==='page',route);
  assert.doesNotMatch(await page.locator('#content').innerText(),/undefined|Review status|Itemized receipts to request|Suggested trips/);
 }
 assert.equal(await page.locator('.staff-person').count(),24);
 const links=await page.locator('.staff-person h3 a').evaluateAll(es=>es.map(e=>[e.textContent,e.getAttribute('href')]));
 for(const [name,href] of links){
  await page.goto(base+href);await page.waitForFunction(name=>document.getElementById('title').textContent===name,name);
  assert.match(await page.locator('#content').innerText(),/do not include expense reimbursements/);
  const source=approved.cardholders[name];
  if(source){const rows=dataset.transactions.filter(t=>t.person===source);assert.equal(await page.locator('.stat strong').first().innerText(),money(rows.reduce((s,t)=>s+t.amount,0)));assert.equal(await page.locator('.stat strong').nth(3).innerText(),rows.length.toLocaleString('en-US'))}
  else{assert.equal(await page.locator('.stats').count(),0);assert.match(await page.locator('#content').innerText(),/does not mean \$0/)}
 }
 await page.goto(base+'#leader/allan-branch');await page.waitForSelector('.stats');if(!await page.locator('.filter-box').evaluate(e=>e.open))await page.locator('.filter-box>summary').click();
 await page.locator('#fy').selectOption('FY26');await page.waitForTimeout(250);
 assert.equal(await page.locator('.stat strong').first().innerText(),money(dataset.transactions.filter(t=>t.person==='BRANCH , ALLAN'&&t.fy==='FY26').reduce((s,t)=>s+t.amount,0)));
 await page.locator('#reset').click();
 await page.locator('[data-detail]').first().click();assert.equal(await page.locator('#review-form,#trip-form,.comments').count(),0);await page.locator('#close-detail').click();
 await page.goto(base+'#overview');await page.waitForSelector('.stats');
 if(!await page.locator('.filter-box').evaluate(e=>e.open))await page.locator('.filter-box>summary').click();await page.locator('#center').selectOption('2100');await page.waitForTimeout(250);
 const expected=dataset.transactions.flatMap(t=>t.allocations).filter(a=>a.center==='2100').reduce((s,a)=>s+a.amount,0);
 assert.equal(await page.locator('.stat strong').first().innerText(),new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(expected/100));
 await page.locator('#reset').click();await page.locator('#from').fill('2026-09-01');await page.locator('#to').fill('2025-01-01');await page.waitForTimeout(250);assert.match(await page.locator('#filter-error').innerText(),/start date/);await page.locator('#reset').click();
 await page.goto(base+'#review');await page.waitForTimeout(150);assert.equal(await page.locator('#title').innerText(),'Your city’s P-card spending');
 await page.setViewportSize({width:390,height:844});await page.goto(base);await page.waitForSelector('.stats');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/pcards-public-phone.png'});
 await page.locator('.mobile-menu').click();await page.locator('nav a[href="#staff"]').click();await page.waitForSelector('.staff-person');await page.locator('.staff-person h3 a').first().click();await page.waitForSelector('.stats');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('[data-detail]').first().click();assert.ok(await page.locator('#detail').isVisible());await page.locator('#close-detail').click();
 for(const route of ['review/','review/reports/merchant-review.html']){await page.goto(base+route);await page.waitForSelector('.stats');}
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);await browser.close();console.log('PASS: public dataset, all 24 profiles and totals, scope filters, empty states, removed review/export tools, logos, mobile layout/dialog, legacy redirects; no browser errors or failed asset requests.');
})().catch(e=>{console.error(e);process.exit(1)});
