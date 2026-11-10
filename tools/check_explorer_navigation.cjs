const assert=require('node:assert/strict');
const {chromium}=require('/Users/allanbranch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
 const p=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 const base=process.env.BASE_URL||'http://127.0.0.1:4338/';
 await p.goto(base+'#transactions');await p.waitForSelector('#merchant option[value="Amazon"]',{state:'attached'});
 await p.locator('#merchant').selectOption('Amazon');await p.waitForFunction(()=>rows.length>0&&rows.every(t=>t.merchant==='Amazon'));
 await p.locator('input[name=fy][value=FY26]').focus();await p.keyboard.press('Space');await p.waitForFunction(()=>rows.every(t=>t.fy==='FY26'));
 await p.locator('#search').fill('no-match-xyz');await p.waitForFunction(()=>rows.length===0);
 await p.locator('#reset').click();await p.waitForFunction(()=>rows.length>0);assert.equal(await p.locator('input[name=fy]:checked').inputValue(),'FY26');
 await p.locator('#from').fill('2026-10-01');await p.locator('#to').fill('2025-01-01');await p.waitForFunction(()=>document.getElementById('filter-error').textContent.includes('end date'));assert.equal(await p.evaluate(()=>rows.length),0);
 await p.locator('nav a[href="#overview"]').press('Enter');await p.waitForFunction(()=>view==='overview');assert(!(await p.locator('#transaction-filters').isVisible()));
 const link=p.locator('.chart-row .transaction-filter-link').first();const params=new URLSearchParams((await link.getAttribute('href')).split('?')[1]);await link.press('Enter');await p.waitForFunction(()=>view==='transactions');assert.equal(await p.locator('#center').inputValue(),params.get('center'));assert.equal(await p.locator('#from').inputValue(),'');
 assert(await p.evaluate(()=>rows.length>0&&rows.every(t=>t.fy==='FY26'&&t.allocations.every(a=>a.center===filters().center)&&t.scoped===t.allocations.reduce((n,a)=>n+a.amount,0))));
 await p.locator('nav a[href="#travel"]').press('Enter');await p.waitForFunction(()=>view==='travel');
 await p.locator('#travel-breakdown .transaction-filter-link').first().press('Enter');await p.waitForFunction(()=>view==='transactions');assert.equal(await p.locator('#scope').inputValue(),'travel');assert(await p.evaluate(()=>rows.length>0&&rows.every(t=>t.travel!=='Not identified as travel'&&t.merchant===filters().merchant)));
 await p.reload();await p.waitForSelector('.transactions');assert.equal(await p.locator('#scope').inputValue(),'travel');
 await p.locator('.transaction-title').first().press('Enter');await p.locator('#detail .transaction-filter-link').first().press('Enter');await p.waitForFunction(()=>!document.getElementById('detail').open);assert.equal(await p.locator('#scope').inputValue(),'');
 await p.locator('nav a[href="#staff"]').press('Enter');await p.waitForFunction(()=>view==='staff');
 await p.locator('input[name=fy][value=""]').focus();await p.keyboard.press('Space');await p.waitForTimeout(250);
 const audit=await p.evaluate(()=>({expected:[...new Set(data.transactions.map(t=>t.person))].sort(),actual:[...document.querySelectorAll('[data-cardholder]')].map(x=>x.dataset.cardholder).sort()}));assert.equal(audit.expected.length,275);assert.deepEqual(audit.actual,audit.expected);
 assert.equal(await p.locator('[aria-labelledby="city-leadership-heading"] .staff-person').count(),5);assert.equal(await p.locator('[aria-labelledby="city-staff-heading"] [data-person-name="Allan Branch"]').count(),0);assert(await p.locator('[data-person-name="Jonathan Hayes"] img').count());
 const card=p.locator('[aria-labelledby="city-staff-heading"] [data-cardholder]').last(),raw=await card.getAttribute('data-cardholder');const total=await p.evaluate(raw=>data.transactions.filter(t=>t.person===raw).reduce((n,t)=>n+t.amount,0),raw);assert((await card.innerText()).includes(new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(total/100)));
 await card.locator('a.transaction-filter-link').first().press('Enter');await p.waitForFunction(()=>view==='transactions');assert.equal(await p.locator('#person').inputValue(),raw);assert(await p.evaluate(()=>rows.length>0&&rows.every(t=>t.person===filters().person)));
 for(const route of ['staff','transactions','overview']){await p.setViewportSize({width:390,height:844});await p.locator(`nav a[href="#${route}"]`).press('Enter');await p.waitForFunction(r=>view===r,route);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 assert.deepEqual(errors,[]);console.log('PASS: filters, reset/year, invalid dates, scoped links and allocations, reloads, dialogs, 275 unique cardholders, leadership/staff split, totals, photos, mobile layouts');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
