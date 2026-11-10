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
 const groups=radarGroups.map(g=>({...g,items:g.ids.map(id=>lookup.get(id)).filter(Boolean)})).filter(g=>g.items.length);
 const unique=[...new Map(groups.flatMap(g=>g.items).map(t=>[t.id,t])).values()];
 const total=unique.reduce((n,t)=>n+t.scoped,0);
 return `<section class="radar-report"><div class="radar-intro"><p class="eyebrow">SELECTED PURCHASES · QUESTIONS TO ASK</p><h2>A closer look at the details</h2><p>Furniture, prizes, grills and other purchases whose purpose or cost deserves a closer look. Inclusion is a question, not a finding of waste or a policy violation.</p><div class="radar-total"><strong>${exact(total)}</strong><span>in ${number(unique.length)} selected transactions · ${groups.length} categories</span></div></div>
 <details class="trip-method"><summary>How this list and its totals work</summary><p>This is a curated selection from the FY25 and FY26 snapshot, not every purchase in these categories. Each transaction is counted once. Totals include identified credits and the full amount of mixed baskets; for example, grill purchases include $802.47 bundled with an office table, padlocks and ant killer. Generic credits could not be confidently matched.</p><p>Original notes are available below; itemized receipts have not been imported. Cardholders may purchase for whole teams. FY25 detail is $136,616.98 below its workbook summary, so these records are not a certified complete spending total.</p></details>
 ${!groups.length?'<p class="empty">No Radar purchases match these filters. Reset or widen the filters to see the review list.</p>':groups.map(g=>`<details class="radar-category"><summary><span class="radar-name"><strong>${esc(g.title)}</strong><span>${g.items.length} transactions${g.context?' · More context needed':''}</span></span><strong class="radar-amount">${exact(g.items.reduce((n,t)=>n+t.scoped,0))}</strong></summary><div class="radar-expanded"><p class="radar-question">${esc(g.reason)}</p><ul class="radar-purchases">${g.items.slice().sort((a,b)=>b.scoped-a.scoped).map(t=>`<li><div class="radar-purchase-head"><button class="link" type="button" data-detail="${esc(t.id)}">${esc(t.merchant)}</button><strong>${exact(t.scoped)}</strong></div><p class="fine">${esc(purchaseDateLabel(t.date))} · ${esc(displayName(t.person)||'Cardholder not publicly identified')} · ${esc(t.id)}</p><p class="radar-note">${esc((t.purchaseNotes||purchaseNotes(t.comments)).join(' · ')||'No purchase description in the notes.')}</p></li>`).join('')}</ul></div></details>`).join('')}</section>`;
}
