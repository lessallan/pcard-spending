'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(c/100);
const exact=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
const number=n=>n.toLocaleString('en-US');
let data, rows=[], page=0, view='overview', rankMetric='spend', selectedId=null, selectedLeader=null, selectedTravelPerson=null;
const titles={radar:['Radar','Explore projects, programs, events and selected purchases through their recorded notes.'],transactions:['Explore transactions','Explore City P-card purchases across all years or one fiscal year.'],leader:['Associated card charges','Recorded cardholder transactions, not personal spending.'],overview:['Your city’s P-card spending','Understand how public money supports everyday City work.'],travel:['Travel & lodging','Explore travel charges by merchant and spending area.'],centers:['Spending by area','Understand the accounting areas charged for City purchases.'],staff:['City leadership & staff','Elected officials, city staff, and everyone with recorded cardholder purchases.']};
// Reference labels: FY25/FY26 budget books, supplemented by Brandy Waldron’s November 10, 2026 definitions.
// Additional evidence: analysis/cost-center-expanded-search.md (private research, not published).
// Not a verified FY26 chart of accounts or proof of an employee's department.
const centerNames={"4150": "Street Paving", "7300": "MLK Rec Center", "1100": "City Commission", "1200": "City Manager", "1310": "City Clerk Treasurer", "1330": "Purchasing", "1340": "Human Resources", "1350": "Information Technology", "1360": "Logistics", "1400": "City Attorneys", "1610": "Land Use (FY25)", "1620": "Engineering", "1710": "Public Works Administration", "1720": "Facility Maintenance", "2100": "Police", "2200": "Fire", "4110": "Street Maintenance", "4120": "Street Drainage", "4130": "Street Signs and Markings", "4140": "Street Sweeping Operations", "7200": "Quality of Life (FY25)", "3410": "Environmental Services Administration", "3420": "Residential Garbage", "3430": "Commercial Garbage", "3440": "Residential Trash", "3450": "CNG Station", "3610": "Utilities Administration", "3620": "Billing and Customer Service", "3630": "Underground Utilities", "3640": "Lift Stations", "3650": "Wastewater Treatment Operations", "3651": "St. Andrews Wastewater Treatment Plant", "3652": "Millville Wastewater Treatment Plant", "3720": "F.O.G. Program", "7500": "Panama City Marina", "7600": "St. Andrew Marina", "8930": "Equipment Maintenance", "5512": "St. Andrews CRA", "5513": "Downtown CRA", "5514": "Downtown North CRA", "5518": "Millville CRA", "5901": "A.D. Harris Campus", "8181": "Housing General Administration", "8800": "Non-departmental Expenses", "1615": "Building Services (FY26)", "3653": "Laboratory (FY26)", "5410": "City SHIP Funds", "5415": "Neighborhood Stabilization Program City", "5421": "City SHIP-HHRP", "5426": "County NSP Properties", "8008": "PC Center for Arts", "8110": "City Hall", "8131": "Public Service", "8520": "Business Recruitment", "8752": "PCM Mall Area", "2210": "Fire department capital projects", "7210": "PCR department capital projects (confirmed in Fund 370)", "8000": "Inventory Purchases", "8018": "American Rescue Plan (ARPA)", "8022": "CDBG-DR Beck Ave Facade project", "8032": "CDBG-DR Restore Area AO project", "8135": "FEMA project expenses (project-specific funds)", "8152": "Non-reimbursable capital project expenses", "8213": "FDEP Kings Point/Pretty Bayou project"};
function centerLabel(code){return centerNames[code]?`${code} · ${centerNames[code]}`:code}
const centerSource='<a href="https://www.panamacity.gov/DocumentCenter/View/8951/Tentative-Budget-FY25---Digital-Book" target="_blank" rel="noopener">FY25 tentative budget ↗</a> and <a href="https://www.panamacity.gov/DocumentCenter/View/10236/Tentative-Budget-FY-26---Digital-book" target="_blank" rel="noopener">FY26 proposed budget ↗</a>';
function personContext(name){const codes=[...new Set(rows.filter(t=>t.person===name).flatMap(t=>t.allocations.map(a=>a.center)))];return '<span class="fine">Recorded cost centers (reference names): '+codes.map(c=>filterLink('center',c,centerLabel(c))).join('; ')+'</span>'}
// Allan confirmed source cardholder JONES, BEAU J is Jared Jones.
function displayName(s){if(s&&s.trim().toUpperCase()==='JONES, BEAU J')return 'Jared Jones';if(!s)return 'Not publicly identified';if(s.includes(',')){let [last,...first]=s.split(',');return `${first.join(' ').trim()} ${last}`.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}
function fillSelect(id,values,label){$(id).innerHTML=`<option value="">${label}</option>`+[...new Set(values)].sort().map(v=>`<option value="${esc(v)}">${esc(id==='person'?displayName(v):id==='center'?centerLabel(v):v)}</option>`).join('')}
function filters(){return Object.fromEntries(new FormData($('filters')))}
function filterLink(type,value,label,context={}){
 const query=new URLSearchParams({fy:filters().fy||'',...context,[type]:value});
 if(!query.has('scope')&&view==='travel')query.set('scope','travel');
 if(view==='travel'&&travelYear)query.set('fy',travelYear);
 return `<a class="transaction-filter-link" href="#transactions?${esc(query.toString())}">${esc(label)}</a>`;
}
function applyTransactionRoute(){
 const [route,query]=location.hash.slice(1).split('?');
 if(route!=='transactions'||query===undefined)return;
 const params=new URLSearchParams(query);
 for(const control of $('transaction-filters').querySelectorAll('input,select'))control.value=params.get(control.name)||'';
 const fy=params.get('fy')||'';
 for(const radio of document.querySelectorAll('input[name="fy"]'))radio.checked=radio.value===(['FY25','FY26'].includes(fy)?fy:'');
}

let appliedTransactionRoute=null, travelYear='', overviewRetailers=false;
function transactionLink(){return '#transactions'}
function matchingTransactionsLink(context={}){return '<p>'+filterLink('scope',context.purchaseType==='travel'?'travel':context.purchaseType==='retailers'?'retail':'','View transactions →',{fy:context.fy||filters().fy||''})+'</p>'}
function status(t){return t.hasSourceContext||t.flags.length?'needs':t.historical?'historical':'none'}
function filtered(){
 const f=filters(),result=[];
 const invalidDates=f.from&&f.to&&f.from>f.to;
 const invalidMinimum=f.minimum&&(!Number.isFinite(Number(f.minimum))||Number(f.minimum)<0);
 $('from').setAttribute('aria-invalid',String(!!invalidDates));$('to').setAttribute('aria-invalid',String(!!invalidDates));
 $('minimum').setAttribute('aria-invalid',String(!!invalidMinimum));
 $('filter-error').textContent=invalidDates?'Choose an end date on or after the start date.':invalidMinimum?'Enter a minimum charge of $0 or more.':'';
 if(invalidDates||invalidMinimum)return result;
 for(const t of data.transactions){
  if(f.fy&&t.fy!==f.fy||f.person&&t.person!==f.person||f.merchant&&t.merchant!==f.merchant||f.from&&(!t.date||t.date<f.from)||f.to&&(!t.date||t.date>f.to)||f.minimum&&t.amount<Math.round(Number(f.minimum)*100)||f.status&&status(t)!==f.status)continue;
  if(f.scope==='travel'&&t.travel==='Not identified as travel'||f.scope==='retail'&&!t.mixed)continue;
  if(f.search&&!`${t.id} ${t.person} ${displayName(t.person)} ${t.merchant} ${t.raw} ${(t.purchaseNotes||t.comments).join(' ')}`.toLowerCase().includes(f.search.trim().toLowerCase()))continue;
  const allocations=t.allocations.filter(a=>(!f.fund||a.fund===f.fund)&&(!f.center||a.center===f.center));
  if(!allocations.length)continue;
  result.push({...t,allocations,scoped:allocations.reduce((n,a)=>n+a.amount,0)});
 }
 return result;
}
function aggregate(ts,key,allocated=false){
 const groups=new Map();
 for(const t of ts){const items=allocated?t.allocations.map(a=>[a.center,a.amount]):[[t[key],t.scoped]];
  for(const [name,amount] of items){if(!groups.has(name))groups.set(name,{name,net:0,ids:new Set(),purchases:new Set(),travel:new Set()});const g=groups.get(name);g.net+=amount;g.ids.add(t.id);if(t.amount>0)g.purchases.add(t.id);if(t.travel!=='Not identified as travel'&&t.amount>0)g.travel.add(t.id)}
 }
 return [...groups.values()].sort((a,b)=>rankMetric==='count'?b.purchases.size-a.purchases.size:b.net-a.net);
}
function stat(label,value,note=''){return `<div class="stat"><small>${label}</small><strong>${value}</strong><span class="fine">${note}</span></div>`}
function stats(ts,associated=false){const net=ts.reduce((n,t)=>n+t.scoped,0),gross=ts.reduce((n,t)=>n+Math.max(t.scoped,0),0),credits=-ts.reduce((n,t)=>n+Math.min(t.scoped,0),0);return `<div class="stats">${stat(associated?'Net associated charges':'Net recorded amount',associated?exact(net):money(net),'After negative entries')}${stat('Positive charges',associated?exact(gross):money(gross),number(ts.filter(t=>t.amount>0).length)+' purchases')}${stat('Credits / adjustments',associated?exact(credits):money(credits),'Includes unresolved entries')}${stat('Transactions',number(ts.length),'Unique transaction IDs')}</div>`}
function bars(groups,type,limit=8,context={}){
 const gs=groups.filter(g=>rankMetric==='count'?g.purchases.size>0:g.net>0).slice(0,limit),value=g=>rankMetric==='count'?g.purchases.size:g.net,max=Math.max(...gs.map(value),1);
 if(!gs.length)return '<p class="empty">No positive values in this selection. Widen the filters to see a comparison.</p>';
 return `<div role="group" aria-label="${esc(rankMetric==='count'?'Purchase count ranking':'Positive net spending ranking')}">${gs.map(g=>`<div class="chart-row">${filterLink(type,g.name,type==='person'?displayName(g.name):type==='center'?centerLabel(g.name):g.name,context)}<div class="track" title="${esc(g.name)}: ${rankMetric==='count'?number(value(g)):exact(value(g))}"><div class="bar" style="width:${value(g)/max*100}%"></div></div><span class="chart-value">${rankMetric==='count'?number(value(g)):money(value(g))}</span></div>`).join('')}</div>`;
}
function timeline(ts){
 const months=new Map();
 for(const t of ts){const m=t.post.slice(0,7);months.set(m,(months.get(m)||0)+t.scoped)}
 const sorted=[...months].sort();
 if(!sorted.length)return '<p class="empty">No monthly amounts match these filters.</p>';
 const values=sorted.map(x=>x[1]),low=Math.min(0,...values),high=Math.max(0,...values);
 const raw=(high-low||100)/4,base=10**Math.floor(Math.log10(raw));
 const step=([1,2,5,10].find(n=>n*base>=raw)||10)*base;
 const min=Math.floor(low/step)*step,max=Math.ceil(high/step)*step||step,range=max-min;
 const pct=n=>(max-n)/range*100;
 const ticks=[];for(let n=min;n<=max;n+=step)ticks.push(n);
 return `<div class="monthly-scroll"><div class="monthly-chart" style="--months:${sorted.length}"><div class="monthly-axis" aria-hidden="true">${ticks.map(n=>`<span style="top:${pct(n)}%">${exact(n)}</span>`).join('')}</div><div class="monthly-plot"><div class="monthly-grid" aria-hidden="true">${ticks.map(n=>`<i class="${n===0?'zero':''}" style="top:${pct(n)}%"></i>`).join('')}</div><div class="monthly-bars">${sorted.map(([m,n])=>`<button type="button" class="monthly-month ${n<0?'negative':''}" aria-label="${m}: ${exact(n)}"><span class="monthly-bar" style="top:${pct(Math.max(0,n))}%;height:${Math.abs(n)/range*100}%"></span><span class="monthly-value">${m}<br><strong>${exact(n)}</strong></span><span class="monthly-label">${m}</span></button>`).join('')}</div></div></div></div><p class="fine">Net recorded dollars by posting month. Hover, tap, or focus a bar for its exact amount. Negative amounts extend below $0.</p><details class="monthly-data"><summary>View monthly amounts</summary><div class="table-wrap"><table><thead><tr><th>Posting month</th><th class="num">Net amount</th></tr></thead><tbody>${sorted.map(([m,n])=>`<tr><th scope="row">${m}</th><td class="num">${exact(n)}</td></tr>`).join('')}</tbody></table></div></details>`;
}
function board(title,note,body,full=false){return `<section class="board ${full?'full':''}"><div class="board-head"><div><h2>${title}</h2><p class="sub">${note}</p></div></div>${body}</section>`}
function rankingControls(){return `<div class="controls-row"><label>Rank by<select id="rank-metric"><option value="spend" ${rankMetric==='spend'?'selected':''}>Net spending</option><option value="count" ${rankMetric==='count'?'selected':''}>Purchase count</option></select></label></div>`}
// Labels describe the recorded charge, never the items bought or who benefited.
// Exact recorded descriptors matched to official store directories, checked 2026-11-09.
// Current directory addresses are context, not proof of historical location or a visit.
const merchantLocations = {
  "CHEVRON 0309488": {
    "name": "Chevron #0309488",
    "city": "College Park, GA",
    "address": "5631 W Fayetteville Rd, College Park, GA 30349-7542",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/5631-W-FAYETTEVILLE-RD-COLLEGE-PARK-GA-30349-7542-id309488"
  },
  "LOWES #00448": {
    "name": "Lowe’s #448",
    "city": "Panama City, FL",
    "address": "300 East 23rd St, Panama City, FL 32405",
    "source": "https://www.lowes.com/store/FL-Panama-City/0448"
  },
  "O'REILLY 1160": {
    "name": "O’Reilly Auto Parts #1160",
    "city": "Panama City, FL",
    "address": "1345 West 15th Street, Panama City, FL 32401",
    "source": "https://locations.oreillyauto.com/en-us/fl/panamacity/autoparts-1160.html"
  },
  "SAMS CLUB #8151": {
    "name": "Sam’s Club #8151",
    "city": "Panama City, FL",
    "address": "1707 W 23rd St, Panama City, FL 32405",
    "source": "https://www.samsclub.com/club/8151-panama-city-fl"
  },
  "SAMSCLUB #8151": {
    "name": "Sam’s Club #8151",
    "city": "Panama City, FL",
    "address": "1707 W 23rd St, Panama City, FL 32405",
    "source": "https://www.samsclub.com/club/8151-panama-city-fl"
  },
  "SAMS CLUB#8151": {
    "name": "Sam’s Club #8151",
    "city": "Panama City, FL",
    "address": "1707 W 23rd St, Panama City, FL 32405",
    "source": "https://www.samsclub.com/club/8151-panama-city-fl"
  },
  "WAL-MART #3075": {
    "name": "Walmart #3075",
    "city": "Panama City, FL",
    "address": "513 W 23rd St, Panama City, FL 32405",
    "source": "https://www.walmart.com/store/3075-panama-city-fl"
  },
  "PUBLIX #481": {
    "name": "Publix #481",
    "city": "Panama City, FL",
    "address": "650 W 23rd St, Panama City, FL 32405-3921",
    "source": "https://www.publix.com/locations/481-23rd-street-plaza"
  },
  "HOBBY LOBBY #339": {
    "name": "Hobby Lobby #339",
    "city": "Panama City, FL",
    "address": "530 Hawkins Ave, Panama City, FL 32405",
    "source": "https://www.hobbylobby.com/stores/search/339"
  },
  "CHEVRON 0042081": {
    "name": "Chevron #0042081",
    "city": "Lake City, FL",
    "address": "128 W Duval St, Lake City, FL 32055-3977",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/128-W-Duval-St-Lake-City-FL-32055-3977-id42081"
  },
  "CHEVRON 0042097": {
    "name": "Chevron #0042097",
    "city": "Live Oak, FL",
    "address": "6647 US HWY 129, Live Oak, FL 32060-8459",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/6647-US-HWY-129-Live-Oak-FL-32060-8459-id42097"
  },
  "CHEVRON 0200464": {
    "name": "Chevron #0200464",
    "city": "Doral, FL",
    "address": "2498 NW 87TH AVE, Doral, FL 33172-2410",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/2498-NW-87TH-AVE-Doral-FL-33172-2410-id200464"
  },
  "CHEVRON 0202466": {
    "name": "Chevron #0202466",
    "city": "Panama City, FL",
    "address": "3534 18TH ST, Panama City, FL 32401",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/3534-18TH-ST-Panama-City-FL-32401-id202466"
  },
  "CHEVRON 0207484": {
    "name": "Chevron #0207484",
    "city": "Marianna, FL",
    "address": "4153 LAFAYETTE ST, Marianna, FL 32446-8247",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/4153-LAFAYETTE-ST-Marianna-FL-32446-8247-id207484"
  },
  "CHEVRON 0209169": {
    "name": "Chevron #0209169",
    "city": "Lucedale, MS",
    "address": "6239 HWY 98, Lucedale, MS 39452-3981",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/6239-HWY-98-Lucedale-MS-39452-3981-id209169"
  },
  "CHEVRON 0301151": {
    "name": "Chevron #0301151",
    "city": "Montgomery, AL",
    "address": "2682 ZELDA ROAD, Montgomery, AL 36101",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/2682-ZELDA-ROAD-Montgomery-AL-36101-id301151"
  },
  "CHEVRON 0302416": {
    "name": "Chevron #0302416",
    "city": "Orlando, FL",
    "address": "6932 S. KIRKMAN RD., Orlando, FL 32819",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/6932-S-KIRKMAN-RD-Orlando-FL-32819-id302416"
  },
  "CHEVRON 0305725": {
    "name": "Chevron #0305725",
    "city": "Panama City, FL",
    "address": "1136 BECK AVENUE, Panama City, FL 32401-1468",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/1136-BECK-AVENUE-Panama-City-FL-32401-1468-id305725"
  },
  "CHEVRON 0309334": {
    "name": "Chevron #0309334",
    "city": "Brewton, AL",
    "address": "13315  HWY 113, Brewton, AL 36426",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/13315--HWY-113-Brewton-AL-36426-id309334"
  },
  "CHEVRON 0359421": {
    "name": "Chevron #0359421",
    "city": "Panama City, FL",
    "address": "1409 N. HWY. 231, Panama City, FL 32405",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/1409-N-HWY-231-Panama-City-FL-32405-id359421"
  },
  "CHEVRON 0377344": {
    "name": "Chevron #0377344",
    "city": "Vienna, GA",
    "address": "1525  EAST UNION ST., Vienna, GA 31092",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/1525--EAST-UNION-ST-Vienna-GA-31092-id377344"
  },
  "CHEVRON 0379629": {
    "name": "Chevron #0379629",
    "city": "Salt Lake City, UT",
    "address": "375 N TERMINAL DRIVE, Salt Lake City, UT 84104",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/375-N-TERMINAL-DRIVE-Salt-Lake-City-UT-84104-id379629"
  },
  "CHEVRON 0388420": {
    "name": "Chevron #0388420",
    "city": "Headland, AL",
    "address": "17909 US HIGHWAY 431 N, Headland, AL 36345-8211",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/17909-US-HIGHWAY-431-N-Headland-AL-36345-8211-id388420"
  },
  "TEXACO 0305573": {
    "name": "Texaco #0305573",
    "city": "Prattville, AL",
    "address": "203 INTERSTATE PARK LOOP, Prattville, AL 36066-7330",
    "source": "https://www.chevronwithtechron.com/en_us/home/gas-station-near-me.html?/station/203-INTERSTATE-PARK-LOOP-Prattville-AL-36066-7330-id305573"
  },
  "BAKER DISTRIBUTING#280": {
    "name": "Baker Distributing #280",
    "city": "Panama City, FL",
    "address": "1252 W 17th St, Panama City, FL 32405",
    "source": "https://www.bakerdist.com/express-stores"
  },
  "SHERWIN-WILLIAMS702024": {
    "name": "Sherwin-Williams #702024",
    "city": "Panama City, FL",
    "address": "742 W 15th St, Panama City, FL 32401-2266",
    "source": "https://www.sherwin-williams.com/en-us/store-listings"
  },
  "SHERWIN-WILLIAMS723891": {
    "name": "Sherwin-Williams #723891",
    "city": "Lynn Haven, FL",
    "address": "1220 Ohio Ave, Lynn Haven, FL 32444-2557",
    "source": "https://www.sherwin-williams.com/en-us/store-listings"
  },
  "SHERWIN-WILLIAMS727645": {
    "name": "Sherwin-Williams #727645",
    "city": "Panama City, FL",
    "address": "3407 US Hwy 98, Panama City, FL 32401",
    "source": "https://www.sherwin-williams.com/store-locator/commercial-paint-store/panama-city/fl/727645"
  },
  "AUTOZONE #0147": {
    "name": "AutoZone #147",
    "city": "Panama City, FL",
    "address": "1301 W 15th St, Panama City, FL 32401",
    "source": "https://www.autozone.com/locations/fl/panama-city/1301-w-15th-st.html"
  },
  "AUTOZONE #5150": {
    "name": "AutoZone #5150",
    "city": "Panama City, FL",
    "address": "2329 Dr. MLK Jr Blvd, Panama City, FL 32405",
    "source": "https://www.autozone.com/locations/fl/panama-city/2329-dr-mlk-jr-blvd"
  },
  "AUTOZONE 05150": {
    "name": "AutoZone #5150",
    "city": "Panama City, FL",
    "address": "2329 Dr. MLK Jr Blvd, Panama City, FL 32405",
    "source": "https://www.autozone.com/locations/fl/panama-city/2329-dr-mlk-jr-blvd"
  },
  "O'REILLY 2368": {
    "name": "O’Reilly Auto Parts #2368",
    "city": "Lynn Haven, FL",
    "address": "1602 Ohio Avenue, Lynn Haven, FL",
    "source": "https://locations.oreillyauto.com/en-us/fl/lynnhaven/autoparts-2368.html"
  },
  "WAL-MART #1207": {
    "name": "Walmart #1207",
    "city": "Callaway, FL",
    "address": "725 N Tyndall Pkwy, Callaway, FL 32404",
    "source": "https://www.walmart.com/store/1207-callaway-fl"
  },
  "WAL-MART #1032": {
    "name": "Walmart #1032",
    "city": "Lynn Haven, FL",
    "address": "2101 S Highway 77, Lynn Haven, FL 32444",
    "source": "https://www.walmart.com/store/1032-lynn-haven-fl"
  },
  "WAL-MART #0818": {
    "name": "Walmart #818",
    "city": "Panama City Beach, FL",
    "address": "10270 Front Beach Rd, Panama City Beach, FL 32407",
    "source": "https://www.walmart.com/store/818-panama-city-beach-fl"
  },
  "LOWES #02367": {
    "name": "Lowe’s #2367",
    "city": "Panama City Beach, FL",
    "address": "11751 Panama City Beach Pkwy, Panama City Beach, FL 32407",
    "source": "https://www.lowes.com/store/2367-panama-city-beach-fl/paint-store"
  },
  "LOWES #01843": {
    "name": "Lowe’s #1843",
    "city": "Bradenton, FL",
    "address": "4012 14th Street West, Bradenton, FL 34205",
    "source": "https://www.lowes.com/store/FL-Bradenton/1843"
  },
  "LOWES #00441": {
    "name": "Lowe’s #441",
    "city": "Montgomery, AL",
    "address": "1950 Eastern Blvd, Montgomery, AL 36117",
    "source": "https://www.lowes.com/store/0441-montgomery-al/hardware-store"
  },
  "PUBLIX #823": {
    "name": "Publix #823",
    "city": "Lynn Haven, FL",
    "address": "2310 S Highway 77, Lynn Haven, FL 32444-4616",
    "source": "https://www.publix.com/locations/823-lynn-haven-center"
  },
  "PUBLIX #681": {
    "name": "Publix #681",
    "city": "Holmes Beach, FL",
    "address": "3900 E Bay Dr, Holmes Beach, FL 34217-1983",
    "source": "https://www.publix.com/locations/681-publix-at-holmes-beach"
  },
  "PUBLIX #2034": {
    "name": "Publix #2034",
    "city": "Panama City, FL",
    "address": "3213 W Hwy 390, Panama City, FL 32405-2734",
    "source": "https://www.publix.com/locations/2034-sweetbay-town-center"
  },
  "PUBLIX #1875": {
    "name": "Publix #1875",
    "city": "Panama City, FL",
    "address": "4601 Lindsey Crossing, Panama City, FL 32404-9325",
    "source": "https://www.publix.com/locations/1875-panama-city-centre"
  },
  "SAMS CLUB #8201": {
    "name": "Sam’s Club #8201",
    "city": "Bradenton, FL",
    "address": "5300 30th St E, Bradenton, FL 34203",
    "source": "https://www.samsclub.com/club/8201-bradenton-fl"
  },
  "SAMS CLUB#8201": {
    "name": "Sam’s Club #8201",
    "city": "Bradenton, FL",
    "address": "5300 30th St E, Bradenton, FL 34203",
    "source": "https://www.samsclub.com/club/8201-bradenton-fl"
  },
  "SAMS CLUB #8253": {
    "name": "Sam’s Club #8253",
    "city": "Jacksonville, FL",
    "address": "300 Busch Dr, Jacksonville, FL 32218",
    "source": "https://www.samsclub.com/club/8253-jacksonville-fl"
  },
  "LOVE'S #0379 INSIDE": {
    "name": "Love’s #379",
    "city": "Lee, FL",
    "address": "3204 SE County Road 255, Lee, FL 32059",
    "source": "https://www.loves.com/locations/379"
  },
  "LOVE'S #0379 OUTSIDE": {
    "name": "Love’s #379",
    "city": "Lee, FL",
    "address": "3204 SE County Road 255, Lee, FL 32059",
    "source": "https://www.loves.com/locations/379"
  },
  "LOVE'S #0802 OUTSIDE": {
    "name": "Love’s #802",
    "city": "Milton, FL",
    "address": "3840 Garcon Point Rd, Milton, FL 32583",
    "source": "https://www.loves.com/locations/802"
  },
  "LOVE'S #0453 INSIDE": {
    "name": "Love’s #453",
    "city": "Cottondale, FL",
    "address": "2510 Highway 231, Cottondale, FL 32431",
    "source": "https://www.loves.com/locations/453"
  },
  "LOVE'S #0453 OUTSIDE": {
    "name": "Love’s #453",
    "city": "Cottondale, FL",
    "address": "2510 Highway 231, Cottondale, FL 32431",
    "source": "https://www.loves.com/locations/453"
  },
  "LOVE'S #0724 INSIDE": {
    "name": "Love’s #724",
    "city": "Lake City, FL",
    "address": "13700 S US Highway 441, Lake City, FL 32025",
    "source": "https://www.loves.com/locations/724"
  },
  "LOVE'S #0724 OUTSIDE": {
    "name": "Love’s #724",
    "city": "Lake City, FL",
    "address": "13700 S US Highway 441, Lake City, FL 32025",
    "source": "https://www.loves.com/locations/724"
  },
  "LOVE'S #0363 INSIDE": {
    "name": "Love’s #363",
    "city": "Ocala, FL",
    "address": "7791 NW 47th Avenue, Ocala, FL 34482",
    "source": "https://www.loves.com/locations/363"
  },
  "LOVE'S #0363 OUTSIDE": {
    "name": "Love’s #363",
    "city": "Ocala, FL",
    "address": "7791 NW 47th Avenue, Ocala, FL 34482",
    "source": "https://www.loves.com/locations/363"
  },
  "LOVE'S #0868 OUTSIDE": {
    "name": "Love’s #868",
    "city": "Mims, FL",
    "address": "4440 Hwy 46, Mims, FL 32754",
    "source": "https://www.loves.com/locations/868"
  },
  "LOVE'S #0561 OUTSIDE": {
    "name": "Love’s #561",
    "city": "Mossy Head, FL",
    "address": "17750 Hwy 285 Drive S, Mossy Head, FL 32435",
    "source": "https://www.loves.com/locations/561"
  },
  "LOVE'S #0708 OUTSIDE": {
    "name": "Love’s #708",
    "city": "Bushnell, FL",
    "address": "2615 W C-48, Bushnell, FL 33513",
    "source": "https://www.loves.com/locations/708"
  },
  "LOVE'S #0964 OUTSIDE": {
    "name": "Love’s #964",
    "city": "Gretna, FL",
    "address": "265 Opportunity Way, Gretna, FL 32332",
    "source": "https://www.loves.com/locations/964"
  }
};
function merchantLocation(t){return merchantLocations[(t.raw||'').trim().toUpperCase()]||null}
function merchantLocationDetail(t){
 const m=merchantLocation(t);if(!m)return '';
 return `<div class="budget-note"><h3>Merchant location</h3><p>${esc(m.name)} · ${esc(m.address)}</p><p><a href="${esc(m.source)}" target="_blank" rel="noopener">Official store directory ↗</a></p><p class="fine">Matched by the recorded store number. Directory checked November 9, 2026; this is a current listing, not confirmation of its address on the purchase date or an in-person visit.</p></div>`;
}
function transactionTitle(t){
 const location=merchantLocation(t);
 if(location)return (t.amount<0?'Credit / adjustment · ':t.amount===0?'Zero-amount entry · ':'')+location.name+' — '+location.city;
 const names={'HERC RENTALS':'Herc Rentals','ENTERPRISE RENT-A-CAR':'Enterprise Rent-A-Car','EMBASSY SUITES':'Embassy Suites','HILTON CONVENTION CTR':'Hilton Convention Center'};
 const recorded=(t.merchant||'').trim();
 const merchant=names[recorded]||recorded;
 const known=merchant&&!/^(unknown|unassigned|unknown merchant|merchant not provided)$/i.test(merchant);
 if(t.amount<0)return known?'Credit / adjustment · '+merchant:'Credit / adjustment · merchant not identified';
 if(t.amount===0)return known?'Zero-amount entry · '+merchant:'Zero-amount entry · merchant not identified';
 return known?'Purchase at '+merchant:'Purchase · merchant not identified';
}
function purchaseDateLabel(date){return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z'))}
function companyDescription(name,compact=false){
 const p=merchantProfile(name);
 if(!p)return compact?'':'<p class="fine">Company description not yet available.</p>';
 return `<div class="company-description"><p>${esc(p.description)}</p><a href="${esc(p.url)}" target="_blank" rel="noopener">Company source ↗</a>${compact?'':`<span class="fine">Reviewed ${p.reviewed}. Describes the company, not the items in this transaction.</span>`}</div>`;
}
function purchaseExplanation(t,compact=false){
 const notes=(t.purchaseNotes||[]);
 if(!notes.length)return '<p class="fine">Purchase details not specified in the comments.</p>';
 if(compact)return `<span class="fine purchase-note-preview">Recorded note: ${esc(notes.join(' · '))}</span>`;
 return `<p class="fine">From recorded comments; wording retained. These notes are not independently verified receipts.</p><ul class="purchase-notes">${notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`;
}
function transactionRow(t,{evidence=null,alsoIn=[],travel=false}={}){
 const amount=travel?t.amount:(t.scoped??t.amount),full=t.fullAmount??t.amount;
 const notes=t.purchaseNotes??evidence??[];
 return `<tr class="transaction-row"><td data-label="Transaction / purchase date"><button type="button" class="link transaction-title" data-detail="${esc(t.id)}">${esc(transactionTitle(t))}</button><span class="fine">${esc(purchaseDateLabel(t.date))} · ${esc(t.id)}</span>${full<0?'<span class="fine">Credit / refund</span>':''}</td><td data-label="Cardholder">${filterLink('person',selectedLeader?leadershipPayer(t):t.person,displayName(selectedLeader?leadershipPayer(t):t.person))}${selectedLeader?leadershipEvidence(t,selectedLeader):purchaseAllocationSummary(t.fullAmount===undefined?t:{...t,amount:t.fullAmount})}<span class="fine">${[...new Set((t.allocations||[]).map(a=>a.center))].map(c=>filterLink('center',c,centerLabel(c))).join(', ')}</span></td><td data-label="Recorded merchant">${filterLink('merchant',t.merchant,t.merchant||t.raw)}<span class="fine">${esc(t.travel==='Not identified as travel'?t.category:t.travel||t.category||'')}</span>${notes.length?notes.map(note=>`<span class="fine purchase-note-preview ${evidence?'radar-note':''}">Recorded note: ${esc(note)}</span>`).join(''):'<span class="fine">Purchase details not specified in the comments.</span>'}${alsoIn.length?`<span class="fine">Also included in: ${alsoIn.map(esc).join('; ')}. The overall Radar total counts this purchase once.</span>`:''}${travel?`<span class="fine">${esc(transactionTravelAnalysis(t)?.kind||'Purpose not identified')} · ${esc(t.tripStatus||'Ungrouped')}</span>`:''}</td><td class="num" data-label="Amount">${exact(amount)}${amount!==full||t.fullAmount!==undefined?`<span class="fine">${exact(full)} full charge${t.fullAmount!==undefined?' · estimated share':''}</span>`:''}</td></tr>`;
}
function transactionTable(items,{travel=false,radar=false}={}){
 return `<div class="table-wrap ${radar?'radar-purchases':''}"><table class="transaction-table"><thead><tr><th scope="col">Transaction / purchase date</th><th scope="col">Cardholder</th><th scope="col">Recorded merchant</th><th scope="col" class="num">Amount</th></tr></thead><tbody>${items.map(item=>radar?transactionRow(item.t,{evidence:item.evidence,alsoIn:item.alsoIn}):transactionRow(item,{travel})).join('')}</tbody></table></div>`;
}
function table(ts){const showAll=!!selectedLeader,start=showAll?0:page*30,shown=showAll?ts:ts.slice(start,start+30);return transactionTable(shown)+`${!ts.length?'<p class="empty">No matching transactions. Reset or widen the filters to continue.</p>':''}${showAll?`<p class="fine">Showing all ${number(ts.length)} matching transactions.</p>`:`<div class="pagination"><span>${ts.length?`${start+1}–${Math.min(start+30,ts.length)} of ${number(ts.length)}`:'0 transactions'}</span><button type="button" id="prev" ${page===0?'disabled':''}>Previous</button><button type="button" id="next" ${start+30>=ts.length?'disabled':''}>Next</button></div>`}`}

function rankingTable(groups,type,context={}){return `<div class="table-wrap"><table><thead><tr><th>${type==='center'?'Cost center':type==='person'?'Cardholder':'Merchant'}</th><th class="num">Net amount</th><th class="num">Purchases</th><th class="num">All transactions</th></tr></thead><tbody>${groups.map(g=>`<tr><td>${filterLink(type,g.name,type==='person'?displayName(g.name):type==='center'?centerLabel(g.name):g.name,context)}${type==='person'?personContext(g.name):type==='merchant'?companyDescription(g.name,true):''}</td><td class="num">${exact(g.net)}</td><td class="num">${number(g.purchases.size)}</td><td class="num">${number(g.ids.size)}</td></tr>`).join('')}</tbody></table></div><p class="fine">Showing all ${groups.length} groups.</p>`}
// Approved leadership selection, in the reviewed order; retain one profile per person.
const leadershipProfiles=[["Allan Branch", "Mayor"], ["Robbie Hughes", "Commissioner, Ward 1"], ["Janice Lucas", "Commissioner Ward 2"], ["Brian Grainger", "Commissioner Ward 3"], ["Josh Street", "Commissioner Ward 4"], ["Jonathan Hayes", "City Manager"], ["Leslie Glaze", "City Clerk-Treasurer"], ["Nevin J. Zimmerman", "City Attorney"], ["Michael Fuller", "Development Services Director"], ["David Collier", "Fire Chief"], ["Mark Smith", "Chief of Police"], ["Sheila Ware", "Director"], ["Vickie Lewis", "Director"], ["Shawn Selph", "Director of Logistics"], ["Clint Murphy", "Public Works Director"], ["Keith Meyerl", "Director of Parks, Culture & Recreation"], ["Brandy Waldron", "Assistant City Manager"], ["Jared Jones", "Assistant City Manager"], ["Stacy Rausch, P.E.", "Assistant Public Works Director / City Engineer"], ["Trent Massey", "Chief Building Official"], ["Cody Klingelhoets", "IT Senior Manager"], ["Gia Del Pozzo", "Purchasing Manager"], ["Samantha Perman", "Budget Manager"], ["Kristen Kennedy", "Public Affairs Manager"]];
// Observed name matches plus explicitly confirmed alternate names. No department attribution.
const leadershipCardholders={"Jared Jones": "JONES, BEAU J", "Allan Branch": "BRANCH , ALLAN", "Robbie Hughes": "HUGHES, ROBBIE", "Janice Lucas": "LUCAS, JANICE L", "Brian Grainger": "GRAINGER, BRIAN R", "Josh Street": "STREET, JOSH", "Jonathan Hayes": "HAYES, JONATHAN H", "Leslie Glaze": "GLAZE, LESLIE", "David Collier": "COLLIER, DAVID W", "Mark Smith": "SMITH, MARK E", "Sheila Ware": "WARE, SHEILA S", "Shawn Selph": "SELPH, SHAWN E", "Clint Murphy": "MURPHY, CLINT", "Keith Meyerl": "MEYERL, KEITH", "Brandy Waldron": "WALDRON, BRANDY L", "Stacy Rausch, P.E.": "RAUSCH, STACY L", "Cody Klingelhoets": "KLINGELHOETS, CODY", "Samantha Perman": "PERMAN, SAMANTHA", "Kristen Kennedy": "KENNEDY, KRISTEN P.", "Michael Fuller": "FULLER, JAMES MICHAEL", "Vickie Lewis": "LEWIS, VICTORIA M", "Gia Del Pozzo": "DEL POZZO, GIOVANNA"};
// Allan confirmed Fuller, Lewis, and Del Pozzo's alternate names in this chat.
const unconfirmedLeadershipNames=new Set();
function leadershipId(name){return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}
let leadershipAssociations={records:{}};
// Reviewed purchase participant lists from recorded notes, across all expense types.
// Full rosters override partial name matching. Card-payment contacts and refund processors are not beneficiaries.
const purchaseParticipants={
  "TXN00042630": [
    "A. Calasso",
    "M. Kelly"
  ],
  "TXN00043634": [
    "B. McCloy",
    "T. Casey"
  ],
  "TXN00043907": [
    "Jonathan Hayes",
    "Brandy Waldron",
    "Lena Webb",
    "Michelle Zirkle",
    "Ashley Gary",
    "Lori Sagehorn",
    "Joy Masters"
  ],
  "TXN00045158": [
    "Kristen Kennedy",
    "Jonathan Hayes",
    "Brian Grainger",
    "Keith Meyerl"
  ],
  "TXN00047408": [
    "Jonathan Hayes",
    "Brian Grainger",
    "Janice Lucas",
    "Allan Branch"
  ],
  "TXN00047799": [
    "Jonathan Hayes",
    "Robbie Hughes"
  ],
  "TXN00047815": [
    "Allan Branch",
    "Brian Grainger",
    "Janice Lucas",
    "Josh Street"
  ],
  "TXN00047915": [
    "Josh Street",
    "Jonathan Hayes",
    "Brandy Waldron",
    "Jared Jones",
    "Michael Fuller",
    "Mike Burke",
    "Natalie McSwane"
  ],
  "TXN00048592": [
    "Jonathan Hayes",
    "Brandy Waldron",
    "Jared Jones",
    "Jan Smith",
    "Natalie McSwane",
    "Nevin J. Zimmerman",
    "Josh Street"
  ],
  "TXN00048381": [
    "Rodney Bland",
    "Scott Colyer"
  ],
  "TXN00048834": [
    "Jonathan Hayes",
    "Jared Jones",
    "Brandy Waldron",
    "Nevin J. Zimmerman",
    "Jan Smith",
    "Kristen Kennedy",
    "Caroline Smith",
    "Brandon Burg",
    "Brandon Henderson",
    "Cecile Scoon",
    "JP Ferreira",
    "Ron Danzey"
  ],
  "TXN00049105": [
    "Bob Majka",
    "Samar Mazloum",
    "Stacy Rausch, P.E.",
    "Matt DeVito",
    "Nevin J. Zimmerman",
    "Michael Fuller",
    "Kevin Kennoy",
    "Heath Roberty",
    "Cale Madden",
    "Joel Schubert",
    "Jared Jones",
    "Clint Murphy",
    "Keith Bryant",
    "Donall Hamm",
    "Brian Leebrick",
    "Ian Crelling",
    "Jonathan Hayes"
  ],
  "TXN00049618": [
    "Brandon Burg",
    "Brandon Henderson-Jansenius",
    "JP Ferreira",
    "Cecila Scoon",
    "Ron Danzey",
    "Jonathan Hayes",
    "Nevin J. Zimmerman",
    "Jan Smith",
    "Caroline Smith"
  ],
  "TXN00050136": [
    "Carlos Sanchez",
    "Jared Jones",
    "Mark Smith",
    "Shawn Selph"
  ],
  "TXN00050388": [
    "Sheila Ware",
    "Jonathan Hayes",
    "Joe Garner",
    "Amber Tubbs",
    "Terri Gainer",
    "Karlene Dempter"
  ],
  "TXN00050793": [
    "Brandon Burg",
    "Brandon Henderson",
    "Ron Danzey",
    "JP Ferreira",
    "Cecile Scoon",
    "Jonathan Hayes",
    "Caroline Smith",
    "Jan Smith"
  ],
  "TXN00051197": [
    "Carlos Sanchez",
    "Chris Forehand",
    "Jared Jones",
    "Jonathan Hayes",
    "Mike Burke",
    "Nevin J. Zimmerman",
    "Robbie Hughes",
    "Shawn Selph"
  ],
  "TXN00051365": [
    "Jonathan Hayes",
    "Stacy Rausch, P.E.",
    "Matt DeVito",
    "Jared Jones",
    "Nevin J. Zimmerman",
    "Michael Fuller",
    "Kevin Kennoy",
    "Cale Madden",
    "Bob Majka",
    "Joel Schubert",
    "Clint Murphy",
    "Ian Crelling",
    "Heath Roberts",
    "Jiwuan Haley"
  ],
  "TXN00051897": [
    "Keith Meyerl",
    "Vickie Lewis",
    "Jared Jones"
  ],
  "TXN00051988": [
    "Joseph Sullivan",
    "Marcus Hodge"
  ],
  "TXN00052329": [
    "Brandon Burg",
    "Brandon Henderson",
    "Ron Danzey",
    "JP Denzey",
    "Cecile Scoon",
    "Jonathan Hayes",
    "Nevin J. Zimmerman",
    "Caroline Smith",
    "Jan Smith"
  ],
  "TXN00052673": [
    "Jonathan Hayes",
    "Kristen Kennedy"
  ],
  "TXN00053250": [
    "Brandy Waldron",
    "Jan Lohse",
    "Jared Jones",
    "Priscilla Hagler",
    "Samantha Perman",
    "Shawn Selph"
  ],
  "TXN00053251": [
    "Brandy Waldron",
    "Jan Lohse",
    "Jared Jones",
    "Priscilla Hagler",
    "Samantha Perman",
    "Shawn Selph"
  ],
  "TXN00053254": [
    "Brandy Waldron",
    "Jan Lohse",
    "Jared Jones",
    "Priscilla Hagler",
    "Samantha Perman",
    "Shawn Selph"
  ],
  "TXN00053260": [
    "Brandy Waldron",
    "Jan Lohse",
    "Jared Jones",
    "Priscilla Hagler",
    "Samantha Perman",
    "Shawn Selph"
  ],
  "TXN00053269": [
    "Brandy Waldron",
    "Jan Lohse",
    "Jared Jones",
    "Priscilla Hagler",
    "Samantha Perman",
    "Shawn Selph"
  ],
  "TXN00053280": [
    "Brandy Waldron",
    "Jan Lohse",
    "Jared Jones",
    "Priscilla Hagler",
    "Samantha Perman",
    "Shawn Selph"
  ],
  "TXN00053282": [
    "Brandy Waldron",
    "Jan Lohse",
    "Jared Jones",
    "Priscilla Hagler",
    "Samantha Perman",
    "Shawn Selph"
  ],
  "TXN00053288": [
    "Brandy Waldron",
    "Jan Lohse",
    "Jared Jones",
    "Priscilla Hagler",
    "Samantha Perman",
    "Shawn Selph"
  ],
  "TXN00053291": [
    "Brandy Waldron",
    "Jan Lohse",
    "Jared Jones",
    "Priscilla Hagler",
    "Samantha Perman",
    "Shawn Selph"
  ],
  "TXN00053376": [
    "Brandon Burg",
    "Brandon Henderson",
    "Caroline Smith",
    "Cecile Scoon",
    "Janette Smith",
    "Jonathan Hayes",
    "JP Ferreira",
    "Nevin J. Zimmerman",
    "Ron Danzey"
  ],
  "TXN00053528": [
    "Carla Cloud",
    "Cody Klingelhoets"
  ],
  "TXN00053690": [
    "Nathan Hedden",
    "Scott Colyer"
  ],
  "TXN00053704": [
    "Brandon Burg",
    "Brandon Henderson",
    "Ron Danzey",
    "JP Ferreira",
    "Cecile Scoon",
    "Jonathan Hayes",
    "Doreen Geldert",
    "Brandy Waldron",
    "Caroline Smith",
    "Nevin J. Zimmerman"
  ],
  "TXN00053838": [
    "Robbie Hughes",
    "Jonathan Hayes",
    "Jared Jones",
    "Brandy Waldron",
    "Nevin J. Zimmerman",
    "Shawn Selph",
    "Keith Meyerl"
  ],
  "TXN00053997": [
    "Amanda Encinias",
    "Lesli McDade"
  ],
  "TXN00054000": [
    "Amanda Encinias",
    "Lesli McDade"
  ],
  "TXN00054059": [
    "Brandy Waldron",
    "Jared Jones",
    "Samantha Perman"
  ],
  "TXN00054293": [
    "Michelle Zirkle",
    "Jonathan Hayes",
    "Nancy Anne",
    "Nancy\u2019s co-worker"
  ],
  "TXN00054357": [
    "Brandon Burg",
    "Brandon Henderson",
    "Ron Danzey",
    "JP Ferreira",
    "Cecile Scoon",
    "Jonathan Hayes",
    "Jared Jones",
    "Jan Smith",
    "Nevin J. Zimmerman",
    "Caroline Smith"
  ],
  "TXN00054451": [
    "Allan Branch",
    "Jonathan Hayes",
    "Josh Street"
  ],
  "TXN00054488": [
    "Jonathan Hayes",
    "Brandy Waldron",
    "Jared Jones",
    "Michelle Zirkle",
    "Lena Webb",
    "Keith Meyerl",
    "Shawn Selph",
    "Clint Murphy",
    "Stacy Rausch, P.E.",
    "Matt DeVito",
    "Clair Williams",
    "Nevin J. Zimmerman",
    "Joy Marler"
  ],
  "TXN00055160": [
    "Vickie Lewis"
  ],
  "TXN00055452": [
    "Michael Fuller",
    "Brandy Waldron",
    "Stacy Rausch, P.E.",
    "Ali Yuncuoglu",
    "Mike Allen",
    "Matt DeVito",
    "Jiwuan Haley",
    "Raymond Nolind",
    "Ian Crelling",
    "Bob Majka",
    "Joel Schubert",
    "Jared Jones",
    "Donald Hamm",
    "Carlos Sanchez",
    "Clint Murphy"
  ],
  "TXN00055663": [
    "Robbie Hughes"
  ],
  "TXN00055770": [
    "C. R. Smith"
  ],
  "TXN00056041": [
    "Brandon Burg",
    "Brandon Henderson",
    "Cecile Scoon",
    "JP Ferreira",
    "Ron Danzey",
    "Jonathan Hayes",
    "Jared Jones",
    "Brandy Waldron",
    "Nevin J. Zimmerman",
    "Caroline Smith",
    "Doreen Geldert"
  ],
  "TXN00058008": [
    "Lisa Roberts",
    "Nadia Dawson"
  ],
  "TXN00058015": [
    "Amanda Scoggin"
  ],
  "TXN00058016": [
    "Amanda Scoggin"
  ],
  "TXN00048339": [
    "Allan Branch",
    "Janice Lucas",
    "Brian Grainger",
    "Jonathan Hayes"
  ],
  "TXN00049491": [
    "Jared Jones",
    "Brandy Waldron",
    "Jan Smith",
    "Nevin J. Zimmerman",
    "Shawn Selph",
    "Jonathan Hayes",
    "Natalie McSwane"
  ],
  "TXN00044103": [
    "Janice Lucas",
    "Brian Grainger"
  ]
};
function purchaseParticipantsFor(t){return leadershipAssociations.reviewedParticipants?.[t.id]||purchaseParticipants[t.id]}
function leadershipShare(t,name,amount=t.scoped??t.amount){const attendees=purchaseParticipantsFor(t);return attendees?(attendees.includes(name)?amount/attendees.length:0):amount}
function purchaseShareLabel(t,name){const attendees=purchaseParticipantsFor(t);if(!attendees)return '';return `<span class="fine meal-share"><strong>${attendees.includes(name)?'Estimated allocated share: 1 of '+attendees.length+' people ('+(100/attendees.length).toFixed(2)+'%)':'Payment / note reference only: not a listed recipient'}</strong> · ${exact(t.amount)} full charge. Equal split among the people associated with this purchase; actual individual costs are not recorded.</span>`}
function purchaseAllocationSummary(t){const people=purchaseParticipantsFor(t);if(!people||people.length<2)return '';return `<span class="fine purchase-allocation"><strong>Shared purchase · ${people.length} people · ${exact(t.amount/people.length)} each (estimated)</strong><br>${people.map(esc).join(' · ')}. Full recorded charge: ${exact(t.amount)}.</span>`}
function leadershipAssociation(t,name){return leadershipAssociations.records[t.id]?.associations.find(a=>a.name===name)}
function leadershipPayer(t){return leadershipAssociations.records[t.id]?.cardholder||t.person}
function leadershipMatches(t,name){return t.person===leadershipCardholders[name]||!!leadershipAssociation(t,name)||!!purchaseParticipantsFor(t)?.includes(name)}
function leadershipRecords(name){return data.transactions.filter(t=>leadershipMatches(t,name))}
function leadershipEvidence(t,name){
 const a=leadershipAssociation(t,name);const own=leadershipPayer(t)===leadershipCardholders[name];
 return purchaseShareLabel(t,name)+`<span class="fine association-label">${own?'Paid on their card':'Paid on another person’s card'}${a?' · '+esc(a.relationship):''}</span>${a?`<span class="fine association-evidence">Recorded note: ${esc(a.evidence)}</span>`:''}`;
}
function leadershipTotals(name,ts){
 const own=ts.filter(t=>leadershipPayer(t)===leadershipCardholders[name]),other=ts.filter(t=>leadershipPayer(t)!==leadershipCardholders[name]);
 const sum=items=>exact(items.reduce((n,t)=>n+(t.scoped??t.amount),0));
 return `<div class="stats">${stat('All associated charges',sum(ts),ts.length+' unique transactions')}${stat('Paid on their card',sum(own),own.length+' transactions')}${stat('Paid on other cards',sum(other),other.length+' transactions naming this leader')}</div>`;
}
function leadershipSummary(name){
 const records=leadershipRecords(name).filter(t=>!filters().fy||t.fy===filters().fy);
 return records.length?`${exact(records.reduce((n,t)=>n+leadershipShare(t,name,t.amount),0))} net associated charges · ${number(records.length)} transactions`:
 unconfirmedLeadershipNames.has(name)?'Cardholder name match needs confirmation':'No associated transactions found';
}
const reimbursementNotice='<p class="notice"><strong>P-card transactions only.</strong> These records do not include expense reimbursements. Some officials and employees may have paid expenses personally and received reimbursement separately. Those amounts are not shown here, so these totals are not a complete picture of expenses associated with a person.</p>';
function leadershipReviewNotes(name){
 const year=filters().fy;
 const flags=(leadershipAssociations.reviewFlags||[]).filter(f=>f.name===name).map(f=>({f,t:data.transactions.find(t=>t.id===f.id)})).filter(({t})=>t&&(!year||t.fy===year));
 if(!flags.length)return '';
 return `<details class="notice leadership-review"><summary>${flags.length} likely or unresolved matches — excluded from totals</summary><p>These notes may refer to this person. Identity, purpose or the individual amount still needs confirmation.</p>${flags.map(({f,t})=>`<p><strong>${f.status==='likely'?'Likely match':'Unresolved'}</strong> · <button type="button" class="link" data-detail="${esc(t.id)}">${esc(t.merchant)} · ${exact(t.amount)} full charge</button><br>${esc(t.date)} · Paid by ${esc(displayName(t.person))}<br>Recorded note: ${esc((t.purchaseNotes||[]).join(' · '))}<br>${esc(f.reason)}</p>`).join('')}</details>`;
}
function leadershipIntro(name){
 const profile=data.staff.find(s=>s.name===name);
 const source=profile?` · <a href="${esc(profile.source_url)}" target="_blank" rel="noopener">Official City profile ↗</a>`:'';
 return `<p class="section-note">${esc(leadershipProfiles.find(p=>p[0]===name)[1])}${source}</p><aside class="notice profile-notice" aria-label="About these totals"><h3>A quick note about these totals</h3><p>These are City P-card purchases connected to this person—not a record of personal spending. Expense reimbursements aren’t included, so this isn’t a complete picture of their associated costs.</p><p>Shared purchases with reviewed participant lists use an estimated equal share. You can still see the full charge and recorded notes on each transaction.</p><details><summary>How amounts are associated</summary><p>Includes purchases on this person’s card and purchases naming them in the notes, including those paid on another card. Each transaction appears once on this profile. Reviewed shares include people without profiles; payment contacts and refund processors receive no share simply for being mentioned. Other purchases retain their recorded associated charge, so totals across profiles should not be added together.</p></details></aside>${leadershipReviewNotes(name)}`;
}

let staffSearch='';
function applyStaffSearch(){
 const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 const terms=normalize(staffSearch).split(' ').filter(Boolean);
 for(const section of document.querySelectorAll('.people-section')){
  const cards=[...section.querySelectorAll('.staff-person')];
  for(const card of cards){const name=normalize(card.dataset.personName||'');card.hidden=!terms.every(term=>name.includes(term))}
  const shown=cards.filter(card=>!card.hidden).length;
  section.querySelector('.people-result-count').textContent=`${shown} of ${cards.length} people`;
  section.querySelector('.people-empty').hidden=shown!==0;
 }
}
function staffPlaceholder(name){
 const parts=name.trim().split(/\s+/).filter(Boolean);
 const initials=parts.length>1?parts[0][0]+parts[parts.length-1][0]:parts[0]?.[0]||'?';
 return `<span class="avatar avatar-placeholder" aria-hidden="true">${esc(initials.toUpperCase())}</span>`;
}
function staffView(){
 const elected=leadershipProfiles.filter(([,title])=>title==='Mayor'||title.startsWith('Commissioner'));
 const electedNames=new Set(elected.map(([name])=>name));
 const year=filters().fy;
 const records=data.transactions.filter(t=>!year||t.fy===year);
 const holders=new Map();
 for(const t of records){if(!holders.has(t.person))holders.set(t.person,{raw:t.person,net:0,count:0,areas:new Map()});const h=holders.get(t.person);h.net+=t.amount;h.count++;for(const a of t.allocations)h.areas.set(a.center,(h.areas.get(a.center)||0)+Math.max(0,a.amount))}
 const spendingArea=holder=>{
  if(!holder?.areas.size)return '';
  const areas=[...holder.areas].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
  const code=areas[0][0],label=centerNames[code]||`Area ${code}`;
  return `<p class="staff-department">${esc(label)}</p>`;
 };
 const cardMetric=holder=>holder?`<strong class="staff-amount">${filterLink('person',holder.raw,exact(holder.net))}</strong>`:'<span class="staff-empty">No card purchases</span>';
 const associatedMetric=name=>{
  const matches=leadershipRecords(name).filter(t=>!year||t.fy===year);
  return matches.length?`<strong class="staff-amount">${exact(matches.reduce((sum,t)=>sum+leadershipShare(t,name,t.amount),0))}</strong>`:`<span class="staff-empty">${unconfirmedLeadershipNames.has(name)?'Name match unconfirmed':'No purchases found'}</span>`;
 };
 elected.sort((a,b)=>(holders.get(leadershipCardholders[b[0]])?.net??-Infinity)-(holders.get(leadershipCardholders[a[0]])?.net??-Infinity)||a[0].localeCompare(b[0]));
 const profileCard=([name,title])=>{
  const profile=data.staff.find(s=>s.name===name&&s.title===title);
  const raw=leadershipCardholders[name],holder=holders.get(raw);
  const displayTitle=title==='Mayor'?`Mayor ${name}`:title.startsWith('Commissioner')?`Commissioner ${name}`:name;
  const department=electedNames.has(name)?'':profile?.departments?.length?`<p class="staff-department">${esc(profile.departments.join(' · '))}</p>`:spendingArea(holder);
  return `<article class="staff-person" data-person-name="${esc(name)}" ${holder?`data-cardholder="${esc(raw)}"`:''}><div class="staff-top">${profile?.photo_file?`<img class="avatar" src="./${esc(profile.photo_file)}" alt="" loading="lazy">`:staffPlaceholder(name)}<div><h3><a href="#leader/${leadershipId(name)}">${esc(displayTitle)}</a></h3>${department}${profile?.email?`<a class="staff-email" href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>`:''}</div></div><p class="leadership-total"><span class="staff-column-label">Associated (est.)</span>${associatedMetric(name)}</p><p class="cardholder-total"><span class="staff-column-label">Card spending</span>${cardMetric(holder)}</p></article>`;
 };
 const knownStaff=leadershipProfiles.filter(([name])=>!electedNames.has(name));
 const represented=new Set(leadershipProfiles.map(([name])=>leadershipCardholders[name]).filter(Boolean));
 const remaining=[...holders.values()].filter(h=>!represented.has(h.raw)).sort((a,b)=>displayName(a.raw).localeCompare(displayName(b.raw)));
 const entries=[...knownStaff.map(profile=>({profile,name:profile[0],net:holders.get(leadershipCardholders[profile[0]])?.net??-Infinity})),...remaining.map(holder=>({holder,name:displayName(holder.raw),net:holder.net}))].sort((a,b)=>b.net-a.net||a.name.localeCompare(b.name));
 const staffCards=entries.map(entry=>entry.profile?profileCard(entry.profile):((h)=>`<article class="staff-person" data-person-name="${esc(displayName(h.raw))}" data-cardholder="${esc(h.raw)}"><div class="staff-top">${staffPlaceholder(displayName(h.raw))}<div><h3>${filterLink('person',h.raw,displayName(h.raw))}</h3>${spendingArea(h)}</div></div><p class="leadership-total"><span class="staff-column-label">Associated (est.)</span><span aria-label="No staff profile association available">—</span></p><p class="cardholder-total"><span class="staff-column-label">Card spending</span>${cardMetric(h)}</p></article>`)(entry.holder)).join('');
 return `<div class="staff-search"><label for="staff-search">Find a person</label><input id="staff-search" type="search" value="${esc(staffSearch)}" placeholder="Search by name" autocomplete="off" aria-controls="people-directory"></div><p class="section-note">Net P-card spending after credits. Associated amounts are estimates, not personal expenses.</p><details class="staff-notes"><summary>About these totals</summary>${reimbursementNotice}<p class="section-note">Every recorded cardholder is included, with no minimum spending amount. Cardholders may buy for a department or other people; these totals are not personal expenses. Departments come from existing City profiles where available. Otherwise, spending areas come from the recorded accounting allocations; the main area has the most positive charges in the selected years and is not a confirmed employee department.</p><p class="section-note">Associated estimates include purchases on a person’s card and purchases naming them in the notes. Reviewed shared purchases use estimated equal shares. Other purchases retain their recorded associated charge; totals across people should not be added together.</p></details><div id="people-directory"><section class="people-section" aria-labelledby="city-leadership-heading"><h2 id="city-leadership-heading">City leadership</h2><p class="sub">Mayor and city commissioners · highest card spending first</p><div class="staff-list"><div class="staff-list-heading" aria-hidden="true"><span>Name &amp; department</span><span>Associated (est.)</span><span>Card spending</span></div>${elected.map(profileCard).join('')}</div><p class="people-result-count fine" aria-live="polite"></p><p class="people-empty" hidden>No matching people.</p></section><section class="people-section" aria-labelledby="city-staff-heading"><h2 id="city-staff-heading">City staff</h2><p class="sub">Highest card spending first · ${number(holders.size)} cardholders total</p><div class="staff-list"><div class="staff-list-heading" aria-hidden="true"><span>Name &amp; department</span><span>Associated (est.)</span><span>Card spending</span></div>${staffCards}</div><p class="people-result-count fine" aria-live="polite"></p><p class="people-empty" hidden>No matching people.</p></section></div>`;
}

function isHotel(t){return t.travel==='Hotels & lodging'}
function travelBreakdown(ts){
 const selected=ts,hotels=selected.filter(isHotel);
 return `<section id="travel-breakdown"><h2>Recorded travel spending</h2>${rankingControls()}<div class="annual-totals">${stat('Net travel-related',exact(selected.reduce((n,t)=>n+t.scoped,0)))}${stat('Included hotel merchants',exact(hotels.reduce((n,t)=>n+t.scoped,0)))}</div><div class="boards">${board('Travel merchants','Net recorded charges, including credits.',bars(aggregate(selected,'merchant'),'merchant',10)+'<details><summary>View all travel merchants</summary>'+rankingTable(aggregate(selected,'merchant'),'merchant')+'</details>')}${board('Travel spending by area','Allocated recorded charges; a purchase may span multiple spending areas.',bars(aggregate(selected,'center',true),'center',12)+'<details><summary>View all spending areas</summary>'+rankingTable(aggregate(selected,'center',true),'center')+'</details>')}${board('Travel through the year','Net recorded amounts by posting month.',timeline(selected),true)}</div>${matchingTransactionsLink({purchaseType:'travel',fy:travelYear},selected.length)}<details class="trip-method"><summary>About recorded travel spending</summary><p>Travel is identified from merchant names and travel account 54000. Some charges may be unrelated, and others may be missed. Hotel charges can include meals, tuition and incidentals. These are purchase counts, not trips or nights. Budget allocations and expense reimbursements are not included, so these records cannot establish remaining budget or overspending.</p></details></section>`;
}
let merchantScope='all';
let retailerScope='all';
function retailerMatches(t){return t.mixed&&(retailerScope==='all'||retailerScope==='amazon-walmart'&&['Amazon','Walmart'].includes(t.merchant)||t.category===retailerScope)}
function retailerReport(ts){
 let out='<p class="section-note">Scope uses the reviewed merchant groupings: marketplaces, hardware/tools, office/industrial catalogs, grocery/pharmacy and other mixed-category retailers. This is an initial identified set, not every possible retailer. Net spending includes credits. Cost centers use actual accounting allocations; department names remain unverified. Split accounting rows are not receipt line items.</p>'+rankingControls();
 out+='<div class="boards">';
 for(const fy of ['FY25','FY26'].filter(fy=>!filters().fy||filters().fy===fy)){
  const year=ts.filter(t=>t.fy===fy);const mg=aggregate(year,'merchant'),cg=aggregate(year,'center',true);
  out+=board(fy+' · Retailers',exact(year.reduce((n,t)=>n+t.scoped,0))+' net · '+year.length+' transactions · '+(fy==='FY25'?'Oct 2024–Sep 2025':'Oct 2025–Sep 2026')+' postings',bars(mg,'merchant',10,{fy})+'<details><summary>View retailer totals</summary>'+rankingTable(mg,'merchant',{fy})+'</details>');
  out+=board(fy+' · Spending areas','Allocated net spending · reference names; a purchase can span several centers.',bars(cg,'center',10,{fy})+'<details><summary>View spending areas</summary>'+rankingTable(cg,'center',{fy})+'</details>');
 }
 out+=board('Retailer spending','Current filters · net after credits.',bars(aggregate(ts,'merchant'),'merchant',10),true)+'</div>';
 return out;
}
let travelSnapshot={records:{}};
// Trip membership is independent of policy reviews. Suggestions are never confirmations.
let tripReviews={};
try{const saved=JSON.parse(localStorage.getItem('pcard-trips-v1')||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))tripReviews=saved}catch{}
function travelTransaction(t){return {...t,person:travelSnapshot.records[t.id]?.person||t.person,tripRange:travelSnapshot.records[t.id]?.range||null}}
function suggestedTrips(transactions){return new Map(transactions.filter(t=>travelSnapshot.records[t.id]?.group).map(t=>[t.id,{label:travelSnapshot.records[t.id].group,reason:travelSnapshot.records[t.id].reason,name:travelSnapshot.records[t.id].groupName}]))}
function tripGroups(){
 const suggestions=suggestedTrips(data.transactions),groups=new Map();
 for(const original of data.transactions){
  const t=travelTransaction(original);
  const saved=tripReviews[t.id],suggestion=suggestions.get(t.id);
  const label=typeof saved?.group==='string'&&saved.group.trim()?saved.group:suggestion?.label;
  if(!label)continue;
  if(!groups.has(label))groups.set(label,{label,name:label===suggestion?.label?suggestion.name:null,items:[]});
  groups.get(label).items.push({...t,tripStatus:['confirmed','excluded'].includes(saved?.status)?saved.status:'suggested',tripReason:saved?.note||suggestion?.reason||'Manually assigned; review supporting records.'});
 }
 const identifiedCost=g=>g.items.reduce((sum,t)=>sum+(t.tripStatus==='excluded'?0:t.amount),0);
 return [...groups.values()].filter(g=>g.items.some(t=>t.amount>0&&t.tripStatus!=='excluded')).sort((a,b)=>identifiedCost(b)-identifiedCost(a)||a.label.localeCompare(b.label));
}
// Dates come only from explicit ranges in travel comments, never review timestamps.
function tripDateRange(t){return t.tripRange||null}
function transactionTravelAnalysis(t){return travelSnapshot.records[t.id]?.analysis||null}
function travelAnalysisHtml(t){
 const a=transactionTravelAnalysis(t);if(!a)return "";
 return `<div class="fine travel-analysis"><strong>${esc(a.kind)}</strong>${a.destinations.length?`<span class="fine">Location clues: ${a.destinations.map(x=>esc(tripDestinationLabel(x))).join(" / ")}</span>`:""}${a.evidence.map(e=>`<span class="fine">${esc(e.text)}${e.url?` <a href="${esc(e.url)}" target="_blank" rel="noopener">Source ↗</a>`:''}</span>`).join('')}</div>`;
}
function tripDestination(t){return transactionTravelAnalysis(t)?.destinations[0]||null}
function tripDestinationLabel(value){
 const cities={'Atlanta':'Georgia','Boston':'Massachusetts','Chicago':'Illinois','Denver':'Colorado','Salt Lake City':'Utah','Orlando':'Florida','Tampa':'Florida','Jacksonville':'Florida','Tallahassee':'Florida','Pensacola':'Florida','Miami':'Florida'};
 const states={FL:'Florida',MA:'Massachusetts',GA:'Georgia',DC:'District of Columbia',NV:'Nevada',TX:'Texas',NY:'New York'};
 const clean=value.replace(/ \(hotel clue\)$/,'');
 if(cities[clean])return clean+', '+cities[clean];
 return clean.replace(/, (FL|MA|GA|DC|NV|TX|NY)$/,(_,state)=>', '+states[state]);
}
function tripFacts(g){
 const included=g.items.filter(t=>t.tripStatus!=='excluded');
 const dates=included.filter(t=>t.amount>0).map(t=>t.date).sort();
 const ranges=included.filter(t=>t.amount>0).map(tripDateRange).filter(Boolean);
 const unique=[...new Map(ranges.map(r=>[r.start+'/'+r.end,r])).values()];
 const range=unique.length===1?{...unique[0],inferred:ranges.some(r=>r.inferred)}:null;
 return {included,range,conflict:unique.length>1,start:dates[0],end:dates.at(-1),destinations:[...new Set(included.filter(t=>t.amount>0).flatMap(t=>transactionTravelAnalysis(t)?.destinations||[]))]};
}
function tripDateLabel(date){return new Date(date+'T00:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'})}
function tripDateSpan(a,b){return a===b?tripDateLabel(a):tripDateLabel(a)+' – '+tripDateLabel(b)}
function travelRecipients(t){if(travelSnapshot.records[t.id]?.recipientOverride)return travelSnapshot.records[t.id].recipients;const participants=purchaseParticipantsFor(t);if(participants)return participants.map(name=>leadershipCardholders[name]||name);const r=travelSnapshot.records[t.id];if(r?.recipients?.length)return r.recipients;const reviewed=travelFeeClassification(t)?(leadershipAssociations.records[t.id]?.associations||[]).filter(a=>['Named recipient in reviewed purchase notes','For / on behalf of'].includes(a.relationship)).map(a=>leadershipCardholders[a.name]).filter(Boolean):[];return reviewed.length?[...new Set(reviewed)]:[t.person].filter(Boolean)}
function travelShare(t,person){const names=[...new Set(travelRecipients(t))].sort();const i=names.indexOf(person);if(i<0)return 0;const n=Math.abs(t.amount);return Math.sign(t.amount)*(Math.floor(n/names.length)+(i<n%names.length?1:0))}
function travelForPerson(t,person){return {...t,fullAmount:t.amount,amount:travelShare(t,person)}}
// Fee amounts are only inferred for separately described charges. Source records stay intact.
function travelFeeClassification(t){
 const notes=(t.purchaseNotes||[]).join(' · '),text=t.merchant+' '+notes;
 const travel=t.travel!=='Not identified as travel'||!!travelSnapshot.records[t.id]?.group;
 if(!travel)return null;
 // This hotel note explicitly subtracts the separately charged service fee.
 if(/hotel stay.*\d.*-.*service fee.*=/i.test(notes))return null;
 const uncertain=reason=>({category:'Amount needs review',uncertain:true,reason});
 if(/refund; cancellation fee/i.test(notes))return uncertain('Refund mentions a cancellation fee without itemizing the fee retained.');
 // Merchant evidence separates copied multi-purchase notes into their actual services.
 if(/^(?:ALLIANZ TRAVEL INS|TRAVEL GUARD GROUP INC)$/i.test(t.merchant))return {category:'Travel insurance & protection'};
 if(travelSnapshot.records[t.id]?.analysis?.kind==='Likely conference registration')return null;
 if(/registration.*\band\b.*insurance/i.test(notes))return uncertain('Notes combine registration and insurance; the separate insurance amount is not established.');
 const bag=/baggage|luggage|EXCS_BAG/i.test(text),seat=/\bseat(?:s|ing)?\b|\bupgrade\b|CMFT SEG Upsell/i.test(text);
 if(bag&&seat)return {category:'Combined baggage & seating'};
 if(bag)return {category:'Baggage'};
 if(seat)return {category:/upgrade|upsell/i.test(text)?'Seat upgrades':'Seat selection & changes'};
 if(/flight change/i.test(notes))return {category:'Flight changes (may include fare difference)'};
 if(/insurance|(?:trip|flight) protection|rental (?:car )?protection|car rental protection/i.test(text))return {category:'Travel insurance & protection'};
 if(/taxes and fees/i.test(notes))return {category:'Combined travel taxes & fees'};
 if(/(?:cancel[al]*ation|cancelation) (?:service )?fee/i.test(notes))return {category:'Cancellation fees'};
 if(/booking fee|service fee|SERVFEE/i.test(text)){
  if(/hotel stay|room charge|airfare/i.test(notes))return uncertain('Booking and fee may be bundled; an itemized receipt is needed.');
  return {category:'Booking & service fees'};
 }
 if(/resort fee|destination fee/i.test(notes))return uncertain('A fee is mentioned; verify its separate amount on the hotel folio.');
 if(/parking|\btoll(?:s| fee)?\b|ETOLL/i.test(text)){
  const separateParking=/^hotel parking(?:$| for\b)/i.test(notes)||/parking was charged separately from the hotel/i.test(notes);
  if(!separateParking&&/hotel|lodging|room|rental/i.test(notes)&&!/^(?:parking|toll)/i.test(notes))return uncertain('Parking or tolls may be bundled with another travel purchase.');
  return {category:/toll|ETOLL/i.test(text)?'Tolls':'Parking'};
 }
 return null;
}
function travelFeeData(items){
 const categories=new Map(),uncertain=[];let charges=0,credits=0;
 for(const t of new Map(items.filter(t=>t.tripStatus!=='excluded').map(t=>[t.id,t])).values()){
  const fee=travelFeeClassification(t);if(!fee)continue;
  if(fee.uncertain){uncertain.push({t,...fee});continue;}
  if(!categories.has(fee.category))categories.set(fee.category,{category:fee.category,items:[],charges:0,credits:0});
  const row=categories.get(fee.category);row.items.push(t);
  if(t.amount>=0){row.charges+=t.amount;charges+=t.amount}else{row.credits+=t.amount;credits+=t.amount}
 }
 return {categories:[...categories.values()].sort((a,b)=>a.category.localeCompare(b.category)),uncertain,charges,credits,net:charges+credits};
}
function travelFeesHtml(included,ungrouped=[]){
 const f=travelFeeData([...included,...ungrouped]);
 return `<section class="travel-fees"><h3>Travel fees & extras</h3><div class="stats">${stat('Net identified extras',exact(f.net),'After fee credits; not an additional charge to add to travel totals')}${stat('Charges',exact(f.charges))}${stat('Credits',exact(f.credits))}</div>${f.categories.length?'<div class="fee-columns" aria-hidden="true"><span>Fee type</span><span>Net amount</span></div>':''}${f.categories.map(r=>`<details class="trip-group fee-row"><summary><span class="fee-label"><strong>${esc(r.category.replace(' (may include fare difference)',''))}</strong>${r.category.includes('fare difference')?'<span class="fee-note">May include fare difference</span>':''}</span><span class="fee-value"><strong>${exact(r.charges+r.credits)}</strong><em>${r.items.length} purchase${r.items.length===1?'':'s'}</em></span></summary>${transactionTable(r.items,{travel:true})}</details>`).join('')||'<p>No separately identified fees or extras in this selection.</p>'}${f.uncertain.length?`<details class="trip-group fee-row fee-unresolved"><summary><span class="fee-label"><strong>Fee amount unresolved</strong><span class="fee-note">Excluded from fee totals</span></span><span class="fee-value"><span>Not determined</span><em>${f.uncertain.length} purchases</em></span></summary>${f.uncertain.map(r=>`<p>${esc(r.reason)}</p>${transactionTable([r.t],{travel:true})}`).join('')}</details>`:''}</section>`;
}
function travelSummaryData(groups,transactions){
 const people=new Map(),destinations=new Map();let dated=0;
 const ensure=person=>{if(!people.has(person))people.set(person,{person,groups:0,days:new Set(),dated:0,identified:0,ownCard:0,otherCards:0});return people.get(person)};
 for(const t of transactions.filter(t=>t.travel!=='Not identified as travel'))for(const person of travelRecipients(t))ensure(person);
 for(const g of groups){const f=tripFacts(g),positive=f.included.filter(t=>t.amount>0);if(f.range)dated++;
  for(const t of f.included)for(const person of travelRecipients(t)){const r=ensure(person),share=travelShare(t,person);r.identified+=share;r[t.person===person?'ownCard':'otherCards']+=share}
  for(const person of new Set(positive.flatMap(travelRecipients))){const r=ensure(person);r.groups++;if(f.range&&positive.every(t=>travelRecipients(t).includes(person))){r.dated++;for(let d=Date.parse(f.range.start);d<=Date.parse(f.range.end);d+=86400000)r.days.add(d)}}
  for(const city of new Set(positive.map(tripDestination).filter(Boolean)))destinations.set(city,(destinations.get(city)||0)+1);
 }
 const groupedIds=new Set(groups.flatMap(g=>g.items.map(t=>t.id)));
 for(const r of people.values()){const items=[...groups.flatMap(g=>tripFacts(g).included),...transactions.filter(t=>!groupedIds.has(t.id)&&tripReviews[t.id]?.status!=='excluded')].filter(t=>travelRecipients(t).includes(r.person)).map(t=>travelForPerson(t,r.person));r.fees=travelFeeData(items);}
 const values=[...people.values()],byName=(a,b)=>travelName(a.person).localeCompare(travelName(b.person));
 return {counts:values.slice().sort((a,b)=>b.groups-a.groups||byName(a,b)),days:values.slice().sort((a,b)=>b.days.size-a.days.size||byName(a,b)),spending:values.map(r=>({...r,amount:r.identified})).sort((a,b)=>b.identified-a.identified||byName(a,b)),destinations:[...destinations].sort((a,b)=>b[1]-a[1]),dated};
}
let travelSort='cost';
function travelName(person){
 if(!person)return 'Not publicly identified';
 const title=s=>s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
 if(person.includes(',')){
  const [last,given]=person.split(',').map(s=>s.trim()),parts=given.split(/\s+/).filter(Boolean);
  if(person.trim().toUpperCase()==='JONES, BEAU J')parts[0]='Jared';
  return title(last)+', '+title(parts[0]||'')+(parts.length>1?' '+parts.slice(1).map(s=>s[0].toUpperCase()+'.').join(' '):'');
 }
 const parts=person.trim().split(/\s+/);return parts.length>1?title(parts.pop())+', '+title(parts.shift())+(parts.length?' '+parts.map(s=>s[0].toUpperCase()+'.').join(' '):''):title(person);
}
function sortedTravelPeople(m){
 const byName=(a,b)=>travelName(a.person).localeCompare(travelName(b.person));
 return [...m.spending].sort((a,b)=>travelSort==='name'?byName(a,b):travelSort==='trips'?b.groups-a.groups||byName(a,b):travelSort==='days'?Number(!!b.dated)-Number(!!a.dated)||b.days.size-a.days.size||byName(a,b):b.identified-a.identified||byName(a,b));
}
function travelPeopleRanking(m){
 const options=[['cost','Highest cost'],['trips','Most trip groups'],['days','Most days associated with travel'],['name','Name · A–Z']];
 return `<article class="travel-people-ranking"><h3>Travel by person</h3><div class="controls-row"><label for="travel-sort">Sort people by<select id="travel-sort">${options.map(([v,label])=>`<option value="${v}" ${travelSort===v?'selected':''}>${label}</option>`).join('')}</select></label></div><ol class="travel-summary-list">${sortedTravelPeople(m).map(r=>`<li>${travelPersonLink(r.person)}<span class="travel-person-cost"><strong>${exact(r.identified)} estimated cost</strong><span>${exact(r.fees.net)} fees &amp; extras${r.fees.uncertain.length?` · ${r.fees.uncertain.length} fee amounts unresolved`:""}</span><span class="travel-payment-split"><span>Own card <span>${exact(r.ownCard)}</span></span><span>Other cards <span>${exact(r.otherCards)}</span></span></span><span>${r.groups} trip groups · ${r.dated?r.days.size+' days':'Days unknown'}</span></span></li>`).join('')}</ol><p class="section-note">Fee totals include grouped and ungrouped purchases. Trip counts are suggested groups, not confirmed trips taken. Costs include grouped purchases on their own card and purchases naming them on other cards, after credits. Shared charges use estimated equal shares; they are not recorded individual prices. Days count distinct dates in recorded ranges; unknown days sort last. ${m.dated} groups have usable dates. Cardholders may book for others.</p></article>`;
}
function travelPersonLink(person){return `<a href="#travel/person/${encodeURIComponent(person)}">${esc(travelName(person))}</a>`}
function travelSummaries(groups,transactions){
 const m=travelSummaryData(groups,transactions),visible=new Set(transactions.map(t=>t.id));
 const list=(items,render)=>items.length?`<ol class="travel-summary-list">${items.map(render).join('')}</ol>`:'<p class="section-note">No matching records in this selection.</p>';
 const personRow=(r,value)=>`<li>${travelPersonLink(r.person)}<span class="travel-person-cost"><strong>${exact(r.identified)} identified</strong><span>${value}</span></span></li>`;
 // Reviewed examples are tied to source IDs and disappear when excluded or outside the selection.
 const examples=[
  {ids:['TXN00042729','TXN00042757','TXN00042769'],title:'Atlanta · November 2024',names:'Corey Mesko, Sean Hellings and Johnathan Crutchfield',evidence:'Three Hampton Inn charges dated November 15 name these guests in their comments. All were booked on Jonathan Crutchfield’s card. Shared stay dates are not confirmed.'},
  {ids:['TXN00042284','TXN00042221','TXN00042348'],title:'IEMO II · October 2024',names:'Brian Grainger and Janice Lucas',evidence:'Comments connect both to IEMO II, with hotel and parking purchases October 27–28. Victoria Mullaney’s hotel booking names Lucas; it does not establish that Mullaney traveled.'}
 ];
 const shared=examples.filter(e=>e.ids.every(id=>data.transactions.some(t=>t.id===id)&&tripReviews[id]?.status!=='excluded')&&e.ids.some(id=>visible.has(id)));
 return `<section class="travel-summary" aria-labelledby="travel-summary-title"><h2 id="travel-summary-title">Travel at a glance</h2><p>Travel costs by person, after credits. P-card purchases only; reimbursements are not included.</p><details class="travel-method-summary"><summary>How travel totals work</summary><p>For the selected fiscal year. Cardholders may book for other people; suggested groups are not verified trips taken. People named in travel notes are included even when someone else paid. The cardholder is the fallback when no person is identified in the notes. Identified costs match the person’s trip view; $0 means no included grouped cost, not no travel spending.</p></details><div class="travel-summary-grid">
 ${travelPeopleRanking(m)}
 <article><span class="estimate-label">Destination clues</span><h3>Common destinations</h3>${list(m.destinations,([city,count])=>`<li><span>${esc(tripDestinationLabel(city))}</span><strong>${count} groups</strong></li>`)}<p class="section-note">Cities named in hotel descriptions, counted once per associated group. These are clues, not a complete destination ranking.</p></article>
 <article class="shared-travel"><span class="estimate-label">Possible shared travel · needs confirmation</span><h3>Who may have traveled together</h3>${shared.length?shared.map(e=>`<div class="shared-travel-example"><h4>${esc(e.title)}</h4><p><strong>${esc(e.names)}</strong></p><p>${esc(e.evidence)}</p><details><summary>View supporting purchases</summary>${transactionTable(e.ids.map(id=>data.transactions.find(t=>t.id===id)).filter(Boolean))}</details></div>`).join(''):'<p>No reviewed shared-travel examples match this selection.</p>'}<p class="section-note">Selected examples, not a complete list. Related purchases may fall outside the filters. Similar purchase dates alone do not prove shared travel.</p></article>
 </div></section>`;
}
function tripReport(person=null){
 const visible=new Set(filtered().map(t=>t.id));
 const all=tripGroups(),groups=all.map(g=>person?{...g,items:g.items.filter(t=>travelRecipients(t).includes(person)).map(t=>travelForPerson(t,person))}:g).filter(g=>g.items.some(t=>t.amount>0&&t.tripStatus!=='excluded')&&g.items.some(t=>visible.has(t.id)));
 if(person)groups.sort((a,b)=>tripFacts(b).included.reduce((n,t)=>n+t.amount,0)-tripFacts(a).included.reduce((n,t)=>n+t.amount,0)||a.label.localeCompare(b.label));
 const known=new Set(all.flatMap(g=>g.items.map(t=>t.id)));
 const ungrouped=data.transactions.filter(t=>visible.has(t.id)&&(t.travel!=='Not identified as travel'||travelSnapshot.records[t.id]?.reason?.startsWith('Unmatched refund'))&&!known.has(t.id)).map(travelTransaction).filter(t=>!person||travelRecipients(t).includes(person)).map(t=>person?travelForPerson(t,person):t);
 const unmatchedCredits=ungrouped.filter(t=>t.amount<0),ungroupedPurchases=ungrouped.filter(t=>t.amount>0);
 const table=items=>transactionTable(items,{travel:true});
 const included=groups.flatMap(g=>tripFacts(g).included),total=included.reduce((n,t)=>n+t.amount,0),confirmed=included.filter(t=>t.tripStatus==='confirmed').reduce((n,t)=>n+t.amount,0);
 const intro=person?`<section class="travel-person-summary"><h2>${esc(travelName(person))} · Associated trips</h2><div class="stats">${stat('Total identified cost',exact(total),'Suggested and confirmed charges in these groups')}${stat('Confirmed identified cost',exact(confirmed),'Charges confirmed in this browser')}${stat('Suggested trip groups',number(groups.length),'Not verified trips taken')}${stat('Ungrouped travel charges',exact(ungroupedPurchases.reduce((n,t)=>n+t.amount,0)),ungroupedPurchases.length+' purchases · excluded from trip total')}</div><p class="travel-summary-note">Travel linked to this person, even when someone else paid. Shared costs are split equally as an estimate. Totals subtract credits and leave out excluded charges and reimbursements.</p></section>`:travelSummaries(groups,filtered().map(travelTransaction));
 return `${intro}${person?travelFeesHtml(included,ungrouped):''}<section id="trip-report" class="trip-report"><div class="trip-heading"><h2>Suggested trips</h2><span>${groups.length} groups</span></div><p>P-card purchases only — reimbursements are not included. The cardholder is shown first and may be the traveler or may have booked for someone else. Open a purchase to confirm or adjust its membership.</p><details class="trip-method"><summary>How estimates work</summary><p>Destinations combine recorded wording with researched hotel properties, dated conference editions and related purchases. Open a purchase for purpose, location clues and source links. Reviewed associations cite supporting transaction IDs and remain suggestions. Some groups describe canceled bookings or unknown destinations. Conflicting clues remain visible; conference dates do not establish travel dates. Travel dates use explicit ranges in comments; an omitted year is estimated from the purchase year. Days include both endpoints, not nights. Without a range, only purchase dates are shown. Conflicting ranges need review.</p><p>Filters find groups with matching charges; totals include full charges in each group. Excluded charges do not count. Credits reduce costs. Missing purchases and reimbursements mean these are not complete trip costs. Reviews stay in this browser. Confirming membership does not verify policy compliance.</p></details>${groups.length?groups.map(g=>{
 const f=tripFacts(g),sum=status=>g.items.filter(t=>t.tripStatus===status).reduce((n,t)=>n+t.amount,0),confirmed=g.items.filter(t=>t.tripStatus==='confirmed').length;
 const title=g.name||g.label.split(' · ')[0],people=[...new Set(g.items.map(t=>displayName(t.person)))].join(', ');
 const destination=f.destinations.length?f.destinations.map(tripDestinationLabel).join(' / '):/, [A-Z]{2}$/.test(title)?tripDestinationLabel(title):'Destination not identified';
 const when=f.range?`Estimated travel · ${tripDateSpan(f.range.start,f.range.end)}`:f.start?`Purchases · ${tripDateSpan(f.start,f.end)}`:'All charges excluded';
 const length=f.range?`${f.range.days} estimated days`:f.conflict?'Dates need review':'';
 return `<details class="trip-group trip-card"><summary><span class="trip-identity"><strong>${esc(people)}</strong><span class="trip-destination">${esc(destination)}</span><span class="trip-dates">${esc(when)}</span>${!/, [A-Z]{2}$/.test(title)&&!title.endsWith(' (hotel clue)')?`<span>${esc(title)}</span>`:''}</span><span class="trip-cost">${length?`<span class="trip-duration">${length}</span>`:''}<strong>${exact(sum('suggested')+sum('confirmed'))}</strong></span></summary><div class="trip-expanded"><p>${f.range?`Estimated day 1: ${tripDateLabel(f.range.start)} · End: ${tripDateLabel(f.range.end)}.${f.range.inferred?' Year inferred from purchase date.':''}`:f.conflict?'Comments contain different date ranges. Review the purchases before estimating trip length.':'Stay dates are not recorded as a range. The purchase window is not the trip duration.'} ${g.items.some(t=>t.tripStatus==='excluded')?`${g.items.filter(t=>t.tripStatus==='excluded').length} excluded.`:''}</p>${table(g.items)}<p class="fine">Select a purchase for its accounting details and trip confirmation.</p></div></details>`;
 }).join(''):'<p>No suggested trips match. Clear filters or assign a trip from a purchase.</p>'}<details class="trip-group"><summary>Ungrouped travel purchases (${ungroupedPurchases.length})</summary>${table(ungroupedPurchases)}</details>${unmatchedCredits.length?`<details class="trip-group"><summary>Unmatched refunds &amp; credits (${unmatchedCredits.length}) · ${exact(unmatchedCredits.reduce((n,t)=>n+t.amount,0))}</summary><p class="fine">Money returned. These records do not count as trips or establish travel dates.</p>${table(unmatchedCredits)}</details>`:''}</section>`;
}
function tripReviewForm(t){
 const suggestion=suggestedTrips(data.transactions).get(t.id),r=tripReviews[t.id]||{};
 return `<form id="trip-form" class="review-form"><h3>Review trip membership</h3><p>Use the same trip name to combine charges across cardholders. Give separate trips distinct names. Confirm only the portion represented by this full charge; split-purpose charges should remain suggested until clarified.</p><label>Trip name<input name="group" maxlength="200" list="trip-names" value="${esc(r.group||suggestion?.label||'')}" required></label><datalist id="trip-names">${tripGroups().map(g=>`<option value="${esc(g.label)}"></option>`).join('')}</datalist><label>Membership<select name="status">${[['suggested','Suggested — needs review'],['confirmed','Confirmed for this trip'],['excluded','Excluded from this trip']].map(([v,l])=>`<option value="${v}" ${r.status===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Evidence / review note<textarea name="note" maxlength="2000">${esc(r.note||'')}</textarea></label><p class="fine">Confirmation and exclusion require a note explaining the evidence. This does not change policy-review status.</p><button type="submit">Save trip review</button><button type="button" id="reset-trip">Restore suggestion</button><p id="trip-feedback" role="status"></p></form>`;
}
function bindTripReview(t){
 $('trip-form').addEventListener('submit',e=>{
  e.preventDefault();const r=Object.fromEntries(new FormData(e.target));r.group=r.group.trim();r.note=r.note.trim();
  if(!r.group||r.status!=='suggested'&&!r.note){$('trip-feedback').textContent='Enter a trip name and an evidence note for confirmed or excluded charges.';return}
  save({...tripReviews,[t.id]:{...r,updatedAt:new Date().toISOString()}},'Trip review saved in this browser.');
 });
 $('reset-trip').addEventListener('click',()=>{const next={...tripReviews};delete next[t.id];if(save(next,'Suggestion restored.')){openDetail(t.id);$('trip-feedback').textContent='Suggestion restored.'}});
 function save(next,message){try{localStorage.setItem('pcard-trips-v1',JSON.stringify(next));tripReviews=next;render();$('trip-feedback').textContent=message;return true}catch{$('trip-feedback').textContent='Could not save. Browser storage may be full or unavailable. Your entries are still here.'}}
}

function render(){
 if(!data)return;
 const rawRoute=location.hash.slice(1)||'overview';
 let route=rawRoute.split('?')[0];
 selectedTravelPerson=null;if(route.startsWith('travel/person/')){try{selectedTravelPerson=decodeURIComponent(route.slice(14))}catch{selectedTravelPerson='Unknown cardholder'}}
 selectedLeader=route.startsWith('leader/')?leadershipProfiles.find(([name])=>leadershipId(name)===route.slice(7))?.[0]||null:null;
 view=selectedTravelPerson?'travel':selectedLeader?'leader':titles[route]&&route!=='leader'?route:'overview';
 document.querySelector('.resident-guide').hidden=view!=='overview';
 $('title').textContent=selectedTravelPerson?travelName(selectedTravelPerson)+' · Travel':selectedLeader||titles[view][0];$('subtitle').textContent=titles[view][1];document.title=(selectedTravelPerson?travelName(selectedTravelPerson)+' · Travel':selectedLeader||titles[view][0])+' · Penny Ping';
 document.querySelectorAll('nav a').forEach(a=>{a.classList.toggle('active',a.hash==='#'+(selectedLeader?'staff':view));a.setAttribute('aria-current',a.hash==='#'+(selectedLeader?'staff':view)?'page':'false')});
 const staff=view==='staff';
 $('transaction-filters').hidden=view!=='transactions';$('transaction-filters').disabled=view!=='transactions';
 $('title').setAttribute('role','heading');$('title').setAttribute('aria-level',view==='overview'?'2':'1');
 if(staff){$('content').innerHTML=staffView();applyStaffSearch();return}
 rows=filtered();
 if(view==='radar'){$('content').innerHTML=radarReport(rows);return}
 if(selectedTravelPerson){$('content').innerHTML=tripReport(selectedTravelPerson);return}
 if(selectedLeader){
  rows=rows.filter(t=>leadershipMatches(t,selectedLeader)).map(t=>({...t,scoped:leadershipShare(t,selectedLeader)}));
  if(!leadershipRecords(selectedLeader).length){
   $('content').innerHTML=leadershipIntro(selectedLeader)+`<h2>${unconfirmedLeadershipNames.has(selectedLeader)?'Name match needs confirmation':'No associated transactions found'}</h2><p>Associated charges are unavailable for this profile. This does not mean $0 in costs: purchases may have been processed by another cardholder or recorded under a different name.</p><p>Browse <a href="#centers">spending areas</a> to explore recorded accounting allocations without attributing them to this person.</p>`;
   return;
  }
 }
 if(view==='merchants'&&merchantScope==='retailers')rows=rows.filter(retailerMatches);if(view==='travel')rows=rows.filter(t=>t.travel!=='Not identified as travel');
 rows.sort((a,b)=>b.scoped-a.scoped);
 let out=(selectedLeader?leadershipIntro(selectedLeader)+leadershipTotals(selectedLeader,rows):'')+(view==='transactions'?stats(rows):'');const centered=aggregate(rows,'center',true),people=aggregate(rows,'person'),merchants=aggregate(rows,'merchant');
 if(view!=='overview'&&(filters().fund||filters().center))out+='<p class="section-note">Amounts reflect only the selected accounting allocations. Transaction counts remain unique IDs; minimum-charge and policy checks use the full original charge.</p>';
 if(view==='overview'){
  const travelRows=rows.filter(t=>t.travel!=='Not identified as travel');
  out+='<div class="boards overview-boards"><div class="overview-primary">'+board('By spending area','The largest accounting areas for City P-card purchases.',bars(centered,'center',12),true)+'</div>'+board('Where spending lands','Businesses the City buys from. ',bars(overviewRetailers?aggregate(rows.filter(t=>t.mixed),'merchant'):merchants,'merchant',50))+board('Travel & lodging by spending area','Accounting areas with the most recorded travel spending. Purchases may support several people or services.','<div data-destination="travel">'+bars(aggregate(travelRows,'center',true),'center',8,{scope:'travel'})+'</div><p><a href="#travel">Explore travel &amp; lodging →</a></p>',true)+'</div>';

 }else if(view==='travel'){
  out+=tripReport()+travelBreakdown(rows);
 }else if(view==='centers'){
  const type='center',gs=centered;
  out+=rankingControls()+(view==='people'?'<p class="section-note">A cardholder is the employee named on the payment card, not necessarily the person using the goods or taking the trip. One employee may purchase for a whole team. The table shows recorded cost centers, not a verified job title. <a href="#staff">Browse City leadership</a> for current published roles; identities and historical roles still need confirmation.</p>':'')+(view==='centers'?'<p class="section-note">A cost center is an accounting code used to group spending by a City function or service. Names come from City budget references and definitions supplied by Assistant City Manager Brandy Waldron on November 10, 2026. Year-specific labels are marked. Her definition of 7210 applies to Fund 370; the export also contains Fund 001 entries that need confirmation. Codes awaiting confirmation remain as recorded. Split purchases can appear in multiple centers. Source: '+centerSource+'</p>':'');
  out+=board(rankMetric==='count'?'Purchases by group':'Recorded spending by group','Top positive groups · complete signed amounts in the table below.',bars(gs,type,20));out+=rankingTable(gs,type);

 }
 if(view==='merchants'||view==='centers')out+=matchingTransactionsLink(view==='merchants'&&merchantScope==='retailers'?{purchaseType:'retailers',retailerGroup:retailerScope==='all'?'':retailerScope}:{},rows.length);
 if(view==='transactions'||selectedLeader)out+=`<section class="transactions"><div class="board-head" style="margin-top:30px"><div><h2>Explore transactions</h2><p class="sub">${number(rows.length)} matching records · largest amounts first · select a purchase for details</p></div></div>${table(rows)}</section>`;
 $('content').innerHTML=out;
 $('prev')?.addEventListener('click',()=>{page--;render()});$('next')?.addEventListener('click',()=>{page++;render()});
 if($('merchant-scope')){$('merchant-scope').value=merchantScope;$('merchant-scope').addEventListener('change',e=>{merchantScope=e.target.value;page=0;render();$('merchant-scope').focus({preventScroll:true})})}
 if($('travel-year')){$('travel-year').value=travelYear;$('travel-year').addEventListener('change',e=>{travelYear=e.target.value;render();$('travel-year').focus({preventScroll:true})})}
 if($('overview-merchants')){$('overview-merchants').value=overviewRetailers?'retailers':'all';$('overview-merchants').addEventListener('change',e=>{overviewRetailers=e.target.value==='retailers';render();$('overview-merchants').focus({preventScroll:true})})}
 $('travel-sort')?.addEventListener('change',e=>{travelSort=e.target.value;render();$('travel-sort')?.focus({preventScroll:true})});
 $('rank-metric')?.addEventListener('change',e=>{rankMetric=e.target.value;render()});
}
function openDetail(id){
 const original=data.transactions.find(t=>t.id===id);if(!original)return;const t=view==='travel'?travelTransaction(original):original;selectedId=id;
 $('detail-title').textContent=transactionTitle(t);
 $('detail-body').innerHTML=`<p class="transaction-meta">${esc(purchaseDateLabel(t.date))} · <strong>${exact(t.amount)}</strong> · ${esc(t.id)}</p>${merchantLocationDetail(t)}${selectedLeader?leadershipEvidence(t,selectedLeader):''}${purchaseAllocationSummary(t)}${travelAnalysisHtml(t)}<dl class="detail-grid"><div><dt>Recorded merchant</dt><dd>${filterLink('merchant',t.merchant,t.raw)}</dd></div><div><dt>Cardholder</dt><dd>${filterLink('person',selectedLeader?leadershipPayer(t):t.person,displayName(selectedLeader?leadershipPayer(t):t.person))}</dd></div><div><dt>Purchase / posted</dt><dd>${t.date} / ${t.post}</dd></div><div><dt>Source</dt><dd>${esc(t.source)} · ${esc(t.sheet)} · rows ${t.rows.join(', ')}</dd></div></dl><section class="purchase-context"><h3>About the company</h3>${companyDescription(t.merchant)}<h3>Purchase details from comments</h3>${purchaseExplanation(t)}</section><p class="section-note">P-card transactions only; separate expense reimbursements are not included. Cardholders may purchase for others.</p><h3>Accounting allocations</h3><div class="table-wrap"><table><thead><tr><th>Fund</th><th>Spending area</th><th>Account</th><th class="num">Amount</th></tr></thead><tbody>${t.allocations.map(a=>`<tr><td>${filterLink('fund',a.fund,a.fund)}</td><td>${filterLink('center',a.center,centerLabel(a.center))}</td><td>${esc(a.account)}</td><td class="num">${exact(a.amount)}</td></tr>`).join('')}</tbody></table></div>`;
 if(view==='travel'){ $('detail-body').innerHTML+=tripReviewForm(t);bindTripReview(t) }
 $('detail').showModal();
}
$('content').addEventListener('click',e=>{const detail=e.target.closest('[data-detail]');if(detail)openDetail(detail.dataset.detail)});
$('content').addEventListener('input',e=>{if(e.target.id==='staff-search'){staffSearch=e.target.value;applyStaffSearch()}});
$('close-detail').addEventListener('click',()=>$('detail').close());
function scrollToReportStart(){
 if(view!=='transactions'){window.scrollTo(0,0);return;}
 const heading=$('title');
 heading.setAttribute('tabindex','-1');
 heading.focus({preventScroll:true});
 window.scrollTo({top:Math.max(0,window.scrollY+heading.getBoundingClientRect().top-16),behavior:'instant'});
}
document.addEventListener('click',e=>{const link=e.target.closest('a.transaction-filter-link');if(link&&link.hash===location.hash&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();applyTransactionRoute();page=0;if($('detail').open)$('detail').close();render();scrollToReportStart()}});
$('filters').addEventListener('submit',e=>e.preventDefault());
$('reset').addEventListener('click',()=>{for(const control of $('transaction-filters').querySelectorAll('input,select'))control.value='';page=0;render()});
let timer;$('filters').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{page=0;render()},180)});
window.addEventListener('hashchange',()=>{if($('detail').open)$('detail').close();applyTransactionRoute();page=0;rankMetric='spend';$('nav').classList.remove('open');document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');render();scrollToReportStart()});
document.querySelector('.mobile-menu').addEventListener('click',e=>{const open=$('nav').classList.toggle('open');e.target.setAttribute('aria-expanded',String(open))});
function loadDataset(d){
 const strings=['id','fy','date','post','person','merchant','raw','category','source','sheet','travel'];
 if(!d||!Array.isArray(d.transactions)||!Array.isArray(d.staff)||!d.transactions.every(t=>t&&strings.every(k=>typeof t[k]==='string')&&Number.isFinite(t.amount)&&Array.isArray(t.allocations)&&t.allocations.every(a=>a&&['fund','center','account'].every(k=>typeof a[k]==='string'&&/^[\w .-]*$/.test(a[k]))&&Number.isFinite(a.amount))&&['comments','flags'].every(k=>Array.isArray(t[k])&&t[k].every(v=>typeof v==='string'))&&Array.isArray(t.rows)&&t.rows.every(Number.isInteger)&&/^[\w.-]+$/.test(t.id))||!d.staff.every(s=>s&&['name','source_url'].every(k=>typeof s[k]==='string')&&['title','email'].every(k=>s[k]===null||typeof s[k]==='string')&&Array.isArray(s.departments)&&s.departments.every(v=>typeof v==='string')&&/^https?:\/\//.test(s.source_url)))throw Error('Spending records could not be read.');
 data=d;page=0;HTMLFormElement.prototype.reset.call($('filters'));
 for(const transaction of d.transactions)if(!Array.isArray(transaction.purchaseNotes))transaction.purchaseNotes=[];
 for(const [id,values,label] of [['fund',d.transactions.flatMap(t=>t.allocations.map(a=>a.fund)),'All funds'],['center',d.transactions.flatMap(t=>t.allocations.map(a=>a.center)),'All spending areas'],['person',d.transactions.map(t=>t.person),'All cardholders'],['merchant',d.transactions.map(t=>t.merchant),'All merchants']])fillSelect(id,values,label);
 applyTransactionRoute();$('loading').hidden=true;render();if(view==='transactions')scrollToReportStart();
}
Promise.all(['./data.json?v=staff-filters-20261110','./travel.json?v=trip-grouping-20261111','./leadership-associations.json?v=name-confirmed-20261110'].map(url=>fetch(url).then(r=>{if(!r.ok)throw Error();return r.json()}))).then(([d,t,a])=>{if(a.version!==1||!a.records)throw Error('Invalid leadership associations');leadershipAssociations=a;if(t.version!==1||!t.records)throw Error('Invalid travel snapshot');travelSnapshot=t;loadDataset(d)}).catch(()=>{$('loading').hidden=false;$('loading').textContent='Spending records could not load. Reload this page to try again.'});
