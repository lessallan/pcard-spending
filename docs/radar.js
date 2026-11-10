'use strict';
// Curated FY25/FY26 review selections, keyed by unique source transaction IDs.
const radarGroups=[
  {
    "title": "Grills & repairs",
    "reason": "Multiple grills plus painting, parts and accessories. What equipment was needed, and how often was it used?",
    "context": false,
    "ids": [
      "TXN00044729",
      "TXN00044794",
      "TXN00044808",
      "TXN00044904",
      "TXN00044912",
      "TXN00051269",
      "TXN00051344",
      "TXN00051348",
      "TXN00051566",
      "TXN00051665",
      "TXN00051680",
      "TXN00051686",
      "TXN00052137",
      "TXN00054265",
      "TXN00054450"
    ]
  },
  {
    "title": "Gifts & prizes",
    "reason": "Electronics, appliances and other Christmas gifts. Who received them, and what was the approved purpose?",
    "context": false,
    "ids": [
      "TXN00043440",
      "TXN00043448",
      "TXN00043450",
      "TXN00043543",
      "TXN00043819",
      "TXN00051885",
      "TXN00051896",
      "TXN00051923"
    ]
  },
  {
    "title": "Parade candy & toys",
    "reason": "Repeated candy and toy purchases for parades and events. What was the event budget?",
    "context": false,
    "ids": [
      "TXN00042400",
      "TXN00042413",
      "TXN00042426",
      "TXN00042428",
      "TXN00042442",
      "TXN00042585",
      "TXN00042610",
      "TXN00050972",
      "TXN00051017",
      "TXN00051041",
      "TXN00051050",
      "TXN00051065",
      "TXN00051127",
      "TXN00051139",
      "TXN00051150",
      "TXN00051303",
      "TXN00051411",
      "TXN00051422",
      "TXN00051548",
      "TXN00051683",
      "TXN00051691",
      "TXN00051781"
    ]
  },
  {
    "title": "Event cooking equipment",
    "reason": "A warming cabinet, catering warmers, hot-dog roller and popcorn machine. How frequently is this equipment used?",
    "context": false,
    "ids": [
      "TXN00042345",
      "TXN00050115",
      "TXN00050092",
      "TXN00044801"
    ]
  },
  {
    "title": "Coffee equipment",
    "reason": "Two higher-cost purchases. Receipts would clarify equipment models and quantities.",
    "context": false,
    "ids": [
      "TXN00046056",
      "TXN00053129"
    ]
  },
  {
    "title": "Office & breakroom TVs",
    "reason": "Selected office and breakroom TVs, plus a 98-inch television. What work purpose and size requirement supported each purchase?",
    "context": false,
    "ids": [
      "TXN00041740",
      "TXN00043053",
      "TXN00050790",
      "TXN00042593",
      "TXN00045572",
      "TXN00051427",
      "TXN00057320",
      "TXN00043034"
    ]
  },
  {
    "title": "Office furniture & decor",
    "reason": "Office decor, plants, shelving and tables. Which items were necessary for the space?",
    "context": false,
    "ids": [
      "TXN00042699",
      "TXN00051578"
    ]
  },
  {
    "title": "Conference-room chairs",
    "reason": "Two conference-room chair charges on consecutive days. Quantities and unit prices are needed to assess the cost.",
    "context": true,
    "ids": [
      "TXN00044588",
      "TXN00044629"
    ]
  },
  {
    "title": "Admin clothing",
    "reason": "Three admin clothing orders. Quantities, recipients and uniform requirements would explain the cost.",
    "context": true,
    "ids": [
      "TXN00044219",
      "TXN00044559",
      "TXN00045160"
    ]
  },
  {
    "title": "Event boiler",
    "reason": "The note names appreciation events, safety functions and hurricane preparedness. Emergency use needs context.",
    "context": true,
    "ids": [
      "TXN00044976"
    ]
  },
  {
    "title": "Christmas-lights trip",
    "reason": "Six charges share this trip description. The itinerary and City purpose would explain the travel.",
    "context": true,
    "ids": [
      "TXN00042034",
      "TXN00042025",
      "TXN00042020",
      "TXN00041949",
      "TXN00041932",
      "TXN00041858"
    ]
  }
];
function radarReport(ts){
 const lookup=new Map(ts.map(t=>[t.id,t]));
 const activities=radarActivityGroups(ts).map(g=>({...g,activity:true}));
 const reviews=radarGroups.map((g,i)=>({...g,id:'review-'+i,type:'Review category',items:g.ids.map(id=>lookup.get(id)).filter(Boolean).map(t=>({t,evidence:t.purchaseNotes||purchaseNotes(t.comments||[])}))})).filter(g=>g.items.length);
 const groups=[...activities,...reviews],unique=[...new Map(groups.flatMap(g=>g.items.map(r=>[r.t.id,r.t]))).values()];
 return `<section class="radar-report"><div class="radar-intro"><p>Explore connected purchases by project, program, event or review category. Open any group to see its transactions and the notes behind them.</p><div class="radar-total"><strong>${exact(unique.reduce((n,t)=>n+radarActivityAmount(t),0))}</strong><span>in ${number(unique.length)} unique transactions · ${groups.length} groups</span></div></div><details class="trip-method"><summary>How groups and totals work</summary><p>Project, program and event groups use explicit wording in purchase notes. Review categories are curated selections. Inclusion does not establish waste or a policy violation, and these are not complete project budgets.</p><p>Credits reduce totals. Mixed purchases include their full recorded charge; no individual share is inferred. A purchase may appear in multiple groups, but the overall total counts it once. Do not add group totals together. Purchase months and posting fiscal years are not verified visit dates or event editions.</p></details>${groups.length?groups.map(g=>`<details class="radar-category ${g.activity?'radar-activity':''}" id="${g.activity?'activity-':''}${g.id}"><summary><span class="radar-name"><strong>${esc(g.title)}</strong><span>${esc(g.type)} · ${g.items.length} transactions${g.context?' · More context needed':''}</span></span><strong class="radar-amount">${exact(g.items.reduce((n,r)=>n+radarActivityAmount(r.t),0))}</strong></summary><div class="radar-expanded">${g.activity?radarActivityContents(g):`<p class="radar-question">${esc(g.reason)}</p><ul class="radar-purchases">${g.items.sort((a,b)=>radarActivityAmount(b.t)-radarActivityAmount(a.t)).map(radarActivityPurchase).join('')}</ul>`}</div></details>`).join(''):'<p class="empty">No Radar purchases match this selection.</p>'}</section>`;
}
// Match purchase descriptions only, never reviewer names or approval histories.
const radarActivities=[
 {id:'station-1-kitchen',title:'Station 1 kitchen remodel',type:'Project',pattern:/\bstation\s*1\s*[-–:]?\s*kitchen\s*remodel\b|\bkitchen\s*remodel\s*[-–:]?\s*(?:fire\s+)?station\s*1\b/i,batches:'fy'},
 {id:'asap',title:'ASAP program',type:'Program',pattern:/\b(?:for\s+ASAP|ASAP\s+(?:snacks?|supplies|license|elevator|training|doorbell|building)|Glenwood\s+ASAP|GW\s+ASAP|Book Taco\s+ASAP|NAC Online renewal[^;]*\bASAP)\b/i,batches:'fy'},
 {id:'accreditation',title:'Accreditation',type:'Event / activity',pattern:/\baccreditation\b/i,batches:'month'},
 {id:'milton-deployment',title:'Hurricane Milton deployment',type:'Event',pattern:/\bMilton\s+Deployment\b/i,batches:'fy'},
 {id:'christmas-parade',title:'Christmas parade',type:'Event',pattern:/\bChristmas\s+Parades?\b/i,batches:'fy'}
];
function radarActivityGroups(ts){
 const unique=[...new Map(ts.map(t=>[t.id,t])).values()];
 return radarActivities.map(g=>({...g,items:unique.map(t=>({t,evidence:(t.purchaseNotes||purchaseNotes(t.comments||[])).filter(note=>g.pattern.test(note))})).filter(r=>r.evidence.length)})).filter(g=>g.items.length);
}
function radarActivityBatches(g){
 const batches=new Map();
 for(const r of g.items){const key=g.batches==='month'?r.t.date.slice(0,7):r.t.fy;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(r);}
 return [...batches].sort(([a],[b])=>a.localeCompare(b));
}
function radarActivityAmount(t){return t.scoped??t.amount}
function radarActivityPurchase({t,evidence}){
 return `<li><div class="radar-purchase-head"><button class="link" type="button" data-detail="${esc(t.id)}">${esc(t.raw||t.merchant)}</button><strong>${exact(radarActivityAmount(t))}</strong></div><p class="fine">${esc(purchaseDateLabel(t.date))} · ${esc(displayName(t.person))} · ${esc(t.id)}${t.amount<0?' · Credit / refund':''}</p><p class="fine">Recorded purchase notes</p>${evidence.map(note=>`<p class="radar-note">${esc(note)}</p>`).join('')}${radarActivityAmount(t)!==t.amount?`<p class="fine">${exact(t.amount)} full charge</p>`:''}</li>`;
}
function radarActivityContents(g){
 return `<p class="section-note">${g.batches==='month'?'Shown in purchase-month batches. Room numbers and refunds remain as recorded; other accreditation expenses can appear alongside lodging.':'Shown by posting fiscal year.'} Select a merchant to open the full transaction details and other recorded notes.</p>${radarActivityBatches(g).map(([key,items])=>`<section class="radar-activity-batch"><h3>${g.batches==='month'?'Purchases in '+esc(key):esc(key)+' postings'}</h3><p class="fine">${items.length} transactions · ${exact(items.reduce((n,r)=>n+radarActivityAmount(r.t),0))} net</p><ul class="radar-purchases">${items.sort((a,b)=>a.t.date.localeCompare(b.t.date)||a.t.id.localeCompare(b.t.id)).map(radarActivityPurchase).join('')}</ul></section>`).join('')}`;
}
