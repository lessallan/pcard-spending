const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || '/Users/allanbranch/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.env.PCARDS_TEST_URL || 'http://127.0.0.1:4398/';
function pages(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?pages(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]); }
async function check(p, label) {
  const result = await p.evaluate(()=>({page:document.documentElement.scrollWidth>innerWidth+1,containers:[...document.querySelectorAll('*')].filter(e=>e.clientWidth>0&&e.scrollWidth>e.clientWidth+2&&['auto','scroll'].includes(getComputedStyle(e).overflowX)).map(e=>e.id||e.className||e.tagName)}));
  assert.deepEqual(result,{page:false,containers:[]},label);
}
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
const p=await browser.newPage(), errors=[];p.on('pageerror',e=>errors.push(e.message));
const paths=pages(path.join(__dirname,'../docs')).map(x=>path.relative(path.join(__dirname,'../docs'),x));
for(const width of [320,390,768,1280]) {
 await p.setViewportSize({width,height:900});
 for(const route of paths){await p.goto(new URL(route,base).href);if(route==='review/reports/merchant-review.html')await p.waitForURL(new URL('./',base).href);if(route.endsWith('vendors.html'))await p.waitForFunction(()=>document.querySelector('#total')?.textContent.startsWith('$'));if(/dpc\/index.html$/.test(route))await p.waitForSelector('#body tr');if(route==='review/index.html')await p.waitForFunction(()=>document.querySelector('#loading')?.hidden);await p.locator('details').evaluateAll(es=>es.forEach(e=>e.open=true));await check(p,route+' '+width);}
 for(const tab of ['overview','travel','staff','radar','parks','centers','transactions']){await p.goto(new URL('review/#'+tab,base).href);await p.waitForFunction(()=>document.querySelector('#loading')?.hidden);await p.locator('details').evaluateAll(es=>es.forEach(e=>e.open=true));await check(p,'City '+tab+' '+width);}
 console.log(`PASS ${paths.length} public pages and seven City tabs at ${width}px`);
}
assert.deepEqual(errors,[]);console.log('PASS no browser errors');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
