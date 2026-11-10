const assert=require('node:assert/strict');
const {merchantProfiles,merchantProfile,purchaseNotes}=require('../app/merchant-context.js');
const stamp='(TEST, PERSON, 01/09/26 12:10) ';
assert.deepEqual(purchaseNotes([stamp+'completed; (BOSS, NAME, 01/30/26 16:57) Approved']),[]);
assert.deepEqual(purchaseNotes([stamp+'operating supplies',stamp+'various supplies - MLK',stamp+'CMW']),[]);
assert.deepEqual(purchaseNotes([stamp+'hot dog roller warmer grill; (BOSS, NAME, 01/30/26 16:57) Approved']),['hot dog roller warmer grill']);
const mixed='portable eye wash station, circuit breakers and popcorn';
assert.deepEqual(purchaseNotes([stamp+mixed,stamp+mixed]),[mixed]);
assert.deepEqual(purchaseNotes([stamp+'office supplies',stamp+'Lab supplies']),['office supplies','Lab supplies']);
assert.deepEqual(purchaseNotes([stamp+'Please attach itemized receipt.',stamp+'added itemized receipt']),[]);
assert.deepEqual(purchaseNotes([stamp+'not a pump; replacement cable only']),['not a pump; replacement cable only']);
assert.equal(merchantProfile('EXXON CRYSTAL CITY'),null);
assert.equal(merchantProfile('TTCO MONTGOMERY'),null);
assert.equal(merchantProfile('Amazon lookalike'),null);
assert.equal(merchantProfile('SQ  CRYSTAL TRACTOR').name,'Crystal Tractor & Equipment');
const aliases=merchantProfiles.flatMap(p=>p.aliases);assert.equal(new Set(aliases).size,aliases.length);
assert.ok(merchantProfiles.every(p=>new URL(p.url).protocol==='https:'));
(async()=>{
 const {chromium}=require('/Users/allanbranch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.PCARDS_TEST_URL||'http://127.0.0.1:4310')+'/#transactions');await page.waitForSelector('[data-detail]');
 await page.evaluate(()=>openDetail('TXN00050092'));
 assert.match(await page.locator('.purchase-context').innerText(),/hot dog roller warmer grill/);
 assert.doesNotMatch(await page.locator('.purchase-context').innerText(),/office electronics/i);
 assert.equal(await page.locator('.purchase-context a').getAttribute('href'),'https://www.aboutamazon.com/what-we-do');
 await page.locator('#close-detail').click();await page.evaluate(()=>openDetail('TXN00056206'));
 assert.match(await page.locator('.purchase-context').innerText(),/Purchase details not specified/);
 await page.locator('#close-detail').click();await page.evaluate(()=>openDetail('TXN00052318'));
 assert.match(await page.locator('.purchase-notes').innerText(),/eye wash station, circuit breakers and popcorn/);
 assert.equal(await page.evaluate(()=>purchaseExplanation({purchaseNotes:['<img src=x onerror=alert(1)>']}).includes('<img')),false);
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'/tmp/pcards-purchase-context-mobile.png'});
 await page.locator('#close-detail').click();await page.goto((process.env.PCARDS_TEST_URL||'http://127.0.0.1:4310')+'/#merchants');await page.waitForSelector('.company-description');
 assert.ok(await page.locator('.company-description').count()>0);assert.deepEqual(errors,[]);
 console.log('PASS: exact vendor matching, administrative and vague notes, mixed items, deduplication, qualification preservation, escaping, source links, dialog, merchant listing and mobile overflow.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
