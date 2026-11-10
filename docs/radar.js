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
  },
  {
    "title": "Awards & retirement recognition",
    "reason": "Service and retirement awards, badge holders, and plaques for officials. What items, quantities and recognition policy support these costs?",
    "context": true,
    "ids": [
      "TXN00042328",
      "TXN00041900",
      "TXN00041734",
      "TXN00041583",
      "TXN00041710",
      "TXN00041621",
      "TXN00043002",
      "TXN00043195",
      "TXN00043601",
      "TXN00047193",
      "TXN00047064",
      "TXN00046809",
      "TXN00051126",
      "TXN00051713",
      "TXN00052317",
      "TXN00053678",
      "TXN00055769",
      "TXN00056454",
      "TXN00057345"
    ]
  },
  {
    "title": "Awards purchases needing item details",
    "reason": "Additional purchases at the recorded merchant \u201cEngraving, Awards,\u201d including shipping. Notes do not identify the items; request the itemized invoices before judging the cost.",
    "context": true,
    "ids": [
      "TXN00049214",
      "TXN00049563",
      "TXN00050639",
      "TXN00050821",
      "TXN00057620",
      "TXN00057973"
    ]
  },
  {
    "title": "Employee safety & team-building meals",
    "reason": "Food and supplies across several Environmental Services, Streets and equipment-maintenance luncheons. Attendance counts and per-person costs would explain the expense.",
    "context": true,
    "ids": [
      "TXN00042358",
      "TXN00042335",
      "TXN00042184",
      "TXN00042174",
      "TXN00045847",
      "TXN00045895",
      "TXN00045898",
      "TXN00045916",
      "TXN00045963",
      "TXN00048770",
      "TXN00048787",
      "TXN00050725",
      "TXN00050761",
      "TXN00050826",
      "TXN00050857",
      "TXN00050869"
    ]
  },
  {
    "title": "Public Works Week meals & supplies",
    "reason": "Catering, cake and supplies across FY25 and FY26. Includes $3,782.28 in refunds. What were the attendance counts and approved event budgets?",
    "context": true,
    "ids": [
      "TXN00047236",
      "TXN00047091",
      "TXN00055735",
      "TXN00055738",
      "TXN00055740",
      "TXN00055760",
      "TXN00055762",
      "TXN00056143",
      "TXN00056144",
      "TXN00056162",
      "TXN00056163",
      "TXN00056173",
      "TXN00056186"
    ]
  },
  {
    "title": "Plaque restoration",
    "reason": "Restoration of Police/PCR plaques and a McKenzie House plaque. The condition, restoration work and historic or public purpose would explain these costs.",
    "context": true,
    "ids": [
      "TXN00054789",
      "TXN00056280"
    ]
  },
  {
    "title": "Rotunda displays",
    "reason": "Historical objects, seasonal decorations and display supplies. What public purpose, display plan and budget supported these purchases?",
    "context": true,
    "ids": [
      "TXN00042741",
      "TXN00047365",
      "TXN00047380",
      "TXN00048255",
      "TXN00049976"
    ]
  },
  {
    "title": "Public Works Halloween decorations",
    "reason": "Two Amazon purchases two days apart. What event or workplace purpose and approved budget supported the decorations?",
    "context": true,
    "ids": [
      "TXN00050291",
      "TXN00050305"
    ]
  },
  {
    "title": "Wellness-event prizes",
    "reason": "Five giveaway purchases, including resistance bands and a dehydrator. What items, recipients and health-program purpose supported the prizes?",
    "context": true,
    "ids": [
      "TXN00052769",
      "TXN00052783",
      "TXN00052791",
      "TXN00052803",
      "TXN00052811"
    ]
  },
  {
    "title": "Refrigerators & ice makers",
    "reason": "Two commercial refrigerators, two ice makers and a beverage refrigerator for the Mayor/Commissioners\u2019 office. Locations, replacement reasons and usage would explain the need.",
    "context": true,
    "ids": [
      "TXN00044783",
      "TXN00050190",
      "TXN00050889",
      "TXN00051111",
      "TXN00051479"
    ]
  },
  {
    "title": "Promotional supplies",
    "reason": "Four purchases at Ninja Transfers. One note says the attached invoice does not match the transaction; later notes do not explain the resolution. Item descriptions, quantities and intended events need receipts.",
    "context": true,
    "ids": [
      "TXN00056409",
      "TXN00056420",
      "TXN00056469",
      "TXN00056573"
    ]
  },
  {
    "title": "Selected office desks",
    "reason": "Four desk purchases ranging from $864.74 to $1,499.99. Receipts, specifications and replacement needs would explain the costs. Refunded desk purchases are excluded from this selection.",
    "context": true,
    "ids": [
      "TXN00045063",
      "TXN00044977",
      "TXN00054569",
      "TXN00051319"
    ]
  },
  {
    "title": "Additional City & holiday meals",
    "reason": "City lunches, employee Christmas meals, appreciation coffee and a City Manager\u2019s luncheon. What were the attendance counts, per-person costs and approved purposes? These are selected charges across multiple events.",
    "context": true,
    "ids": [
      "TXN00043449",
      "TXN00043473",
      "TXN00043495",
      "TXN00043538",
      "TXN00043541",
      "TXN00043579",
      "TXN00050224",
      "TXN00051754",
      "TXN00051780",
      "TXN00051802",
      "TXN00051940",
      "TXN00053044",
      "TXN00053456",
      "TXN00053493",
      "TXN00053526",
      "TXN00053556"
    ]
  },
  {
    "title": "World Changers activities",
    "reason": "Includes a $2,450.22 anniversary lunch, plus postcards and labels. Headcount, program purpose and funding would explain the cost. Purchases span FY25 and FY26, not a single confirmed event.",
    "context": true,
    "ids": [
      "TXN00046955",
      "TXN00055231",
      "TXN00055346",
      "TXN00056686"
    ]
  },
  {
    "title": "GoDaddy annual charges",
    "reason": "Two $999.98 charges on February 27 and March 22, 2026. One note says yearly charge; the other says SSL Yearly Renewal. Check invoices, covered services and billing periods. Matching amounts alone do not establish duplication.",
    "context": true,
    "ids": [
      "TXN00053541",
      "TXN00054141"
    ]
  },
  {
    "title": "Vehicle-camera services",
    "reason": "Review covered vehicles, service levels, invoices and billing periods. Includes recurring camera storage, support and subscription charges. Repeated same-day $493 charges and changes in billed amounts need invoice context; matching amounts alone do not establish duplicate billing. Camera hardware and installation purchases are excluded.",
    "context": true,
    "ids": [
      "TXN00054802",
      "TXN00055287",
      "TXN00041704",
      "TXN00041688",
      "TXN00043050",
      "TXN00043474",
      "TXN00044449",
      "TXN00044490",
      "TXN00045115",
      "TXN00046849",
      "TXN00046822",
      "TXN00047677",
      "TXN00048470",
      "TXN00050996",
      "TXN00051817",
      "TXN00053189",
      "TXN00053209",
      "TXN00054118",
      "TXN00055904"
    ]
  },
  {
    "title": "Selected software subscriptions and Plaud device",
    "context": true,
    "reason": "Review active users, license counts, usage and renewal needs for Grammarly, SurveyMonkey, LinkedIn and Plaud. Includes the Plaud device and a $540 Grammarly credit. SurveyMonkey transaction TXN00049523 is included by merchant; it has no recorded purchase note. Annual renewals alone do not establish duplicate billing.",
    "ids": [
      "TXN00043082",
      "TXN00044790",
      "TXN00046143",
      "TXN00047880",
      "TXN00049523",
      "TXN00051922",
      "TXN00054641",
      "TXN00055079",
      "TXN00055186",
      "TXN00055547",
      "TXN00056232",
      "TXN00058079"
    ]
  },
  {
    "title": "Charter Review meals and refreshments",
    "context": true,
    "reason": "Review catering frequency, attendance, per-person costs and receipts. Notes flag a receipt mismatch and a $35 tip not shown on a receipt. The total subtracts a $16.99 card credit. A separate note reports tax refunded in cash without an amount, so that cash refund is not deducted.",
    "ids": [
      "TXN00048834",
      "TXN00049618",
      "TXN00050793",
      "TXN00050797",
      "TXN00051797",
      "TXN00052329",
      "TXN00052748",
      "TXN00053373",
      "TXN00053376",
      "TXN00053576",
      "TXN00053704",
      "TXN00054357",
      "TXN00054621",
      "TXN00054636",
      "TXN00054663",
      "TXN00054989",
      "TXN00055753",
      "TXN00056023",
      "TXN00056041"
    ]
  },
  {
    "title": "Additional health-screening purchases",
    "context": true,
    "reason": "Review itemized receipts, attendance and the split between food and raffle giveaways. The $550 Drury Inns charge carries a health-screening note naming other vendors; its actual purpose needs receipt confirmation. Previously listed wellness prizes are not included in this selection.",
    "ids": [
      "TXN00053414",
      "TXN00053418",
      "TXN00053441",
      "TXN00053464"
    ]
  },
  {
    "title": "Dover Kohl meeting meals",
    "context": true,
    "reason": "Four lunch and dinner charges associated with Dover Kohl meetings. Review attendance, per-person costs and the approved meeting purpose; the notes alone do not establish unnecessary spending.",
    "ids": [
      "TXN00052688",
      "TXN00052723",
      "TXN00054468",
      "TXN00054488"
    ]
  },
  {
    "title": "Christmas decorations and setup",
    "context": true,
    "reason": "Review quantities, reuse, storage and setup costs. Includes $1,486.92 for a scissor lift to remove decorations, $509.82 across three ornament charges and a $179.09 training-room tree. Three recorded credits totaling $42.94 reduce this total. Mixed purchases include headlight bulbs or thumb drives at their full recorded charge; item-level costs are unavailable. This is not a complete holiday budget.",
    "ids": [
      "TXN00042704",
      "TXN00043063",
      "TXN00043040",
      "TXN00043235",
      "TXN00043248",
      "TXN00043289",
      "TXN00043413",
      "TXN00043186",
      "TXN00043255",
      "TXN00043296",
      "TXN00043081",
      "TXN00043149",
      "TXN00043780",
      "TXN00049720",
      "TXN00049738",
      "TXN00049780",
      "TXN00049796",
      "TXN00050436",
      "TXN00050980",
      "TXN00051180",
      "TXN00051545",
      "TXN00051574",
      "TXN00051609",
      "TXN00051645",
      "TXN00051809",
      "TXN00051833",
      "TXN00051920",
      "TXN00052544"
    ]
  },
  {
    "title": "CRA socials: printing and supplies",
    "context": true,
    "reason": "Review print quantities, unit prices and event attendance. Includes $3,792 for maps and $421.25 for signs. A reviewer asked whether the maps were special prints or copies; the response says they were interactive maps for CRA socials. A mixed boxes/snacks purchase is included at its full recorded charge.",
    "ids": [
      "TXN00043957",
      "TXN00044170",
      "TXN00043904",
      "TXN00043953",
      "TXN00043968",
      "TXN00044414",
      "TXN00044436",
      "TXN00053356"
    ]
  },
  {
    "title": "City/County utilities meeting meals",
    "context": true,
    "reason": "Review attendance, per-person costs and meal documentation. These five charges cover four meeting dates. An Olive Garden note requests an itemized receipt after attendee names were provided; the notes do not establish whether that request was subsequently resolved.",
    "ids": [
      "TXN00049055",
      "TXN00049105",
      "TXN00051365",
      "TXN00055452",
      "TXN00057581"
    ]
  }
];
function radarReport(ts){
 const lookup=new Map(ts.map(t=>[t.id,t]));
 const activities=radarActivityGroups(ts).map(g=>({...g,activity:true}));
 const reviews=radarGroups.map((g,i)=>({...g,id:'review-'+i,type:'Review category',items:g.ids.map(id=>lookup.get(id)).filter(Boolean).map(t=>({t,evidence:t.purchaseNotes||purchaseNotes(t.comments||[])}))})).filter(g=>g.items.length);
 const groups=[...activities,...reviews].map(g=>({...g,total:g.items.reduce((n,r)=>n+radarActivityAmount(r.t),0)})).sort((a,b)=>b.total-a.total||a.title.localeCompare(b.title)),unique=[...new Map(groups.flatMap(g=>g.items.map(r=>[r.t.id,r.t]))).values()];
 const memberships=new Map();for(const g of groups)for(const r of g.items){if(!memberships.has(r.t.id))memberships.set(r.t.id,new Set());memberships.get(r.t.id).add(g.title)}
 for(const g of groups)for(const r of g.items)r.alsoIn=[...memberships.get(r.t.id)].filter(title=>title!==g.title);
 return `<section class="radar-report"><div class="radar-intro"><p>Explore connected purchases by project, program, event or review category. Open any group to see its transactions and the notes behind them.</p><p class="section-note"><strong>Highest spending first</strong> · Groups are ordered by net spending in your current selection, after credits and refunds.</p><div class="radar-total"><strong>${exact(unique.reduce((n,t)=>n+radarActivityAmount(t),0))}</strong><span>in ${number(unique.length)} unique transactions · ${groups.length} groups</span></div></div><details class="trip-method"><summary>How groups and totals work</summary><p>Project, program and event groups use explicit wording in purchase notes. Review categories are curated selections. Inclusion does not establish waste or a policy violation, and these are not complete project budgets.</p><p>Credits reduce totals. Mixed purchases include their full recorded charge; no individual share is inferred. A purchase may appear in multiple groups, but the overall total counts it once. Do not add group totals together. Purchase months and posting fiscal years are not verified visit dates or event editions.</p></details>${groups.length?groups.map(g=>`<details class="radar-category ${g.activity?'radar-activity':''}" id="${g.activity?'activity-':''}${g.id}"><summary><span class="radar-name"><strong>${esc(g.title)}</strong><span>${esc(g.type)} · ${g.items.length} transactions${g.context?' · More context needed':''}</span></span><strong class="radar-amount">${exact(g.total)}</strong></summary><div class="radar-expanded">${g.activity?radarActivityContents(g):`<p class="radar-question">${esc(g.reason)}</p>${transactionTable(g.items.sort((a,b)=>radarActivityAmount(b.t)-radarActivityAmount(a.t)),{radar:true})}`}</div></details>`).join(''):'<p class="empty">No Radar purchases match this selection.</p>'}</section>`;
}
// Match purchase descriptions only, never reviewer names or approval histories.
const radarActivities=[
 {id:'backpack-giveaway',title:'Backpack giveaway',type:'Program',pattern:/\bback\s*pack\s+giveaway\b/i,batches:'fy',note:'One purchase note identifies a donations project code. Funding has not been verified; these charges should not be described as taxpayer-funded discretionary spending without that context.'},
 {id:'station-1-kitchen',title:'Station 1 kitchen remodel',type:'Project',pattern:/\bstation\s*1\s*[-–:]?\s*kitchen\s*remodel\b|\bkitchen\s*remodel\s*[-–:]?\s*(?:fire\s+)?station\s*1\b/i,batches:'fy'},
 {id:'asap',title:'ASAP program',type:'Program',pattern:/\b(?:for\s+ASAP|ASAP\s+(?:snacks?|supplies|license|elevator|training|doorbell|building)|Glenwood\s+ASAP|GW\s+ASAP|Book Taco\s+ASAP|NAC Online renewal[^;]*\bASAP)\b/i,batches:'fy'},
 {id:'accreditation',title:'Accreditation',type:'Event / activity',pattern:/\baccreditation\b/i,batches:'month'},
 {id:'milton-deployment',title:'Hurricane Milton deployment',type:'Event',pattern:/\bMilton\s+Deployment\b/i,batches:'fy'},
 {id:'christmas-parade',title:'Christmas parade',type:'Event',pattern:/\bChristmas\s+Parades?\b/i,batches:'fy'}
];
// Reviewed source IDs keep corrections and itemized-note exclusions explicit.
const radarReviewedActivities=[
  {
    "id": "garden-club-building-work",
    "title": "Garden Club building work",
    "type": "Project",
    "batches": "reviewed",
    "scope": "Building/project wording or project 853.18 only. Exclude mailbox repairs, disc golf, routine site-only mentions and explicitly corrected notes. Unidentified Garden Club projects still need confirmation before combining into one capital-project cost.",
    "members": {
      "TXN00042023": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $335.84 LM 10.16.24 for garden club project"
        ]
      },
      "TXN00043744": {
        "period": "FY25 postings",
        "evidence": [
          "Garden club project"
        ]
      },
      "TXN00044312": {
        "period": "FY25 postings",
        "evidence": [
          "For Garden club project"
        ]
      },
      "TXN00044333": {
        "period": "FY25 postings",
        "evidence": [
          "Harbor Freight $16.47 JD 01.31.25 Garden club project"
        ]
      },
      "TXN00044357": {
        "period": "FY25 postings",
        "evidence": [
          "Midsouth lumber $1020.00 JD 02.03.25 Garden club construction",
          "For the Garden club project"
        ]
      },
      "TXN00044419": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $1994.96 JD 02.05.25 garden club building",
          "For the garden club building project"
        ]
      },
      "TXN00044426": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $167.00 JD 02.05.25 Garden club building"
        ]
      },
      "TXN00044580": {
        "period": "FY25 postings",
        "evidence": [
          "Materials for Bay Memorial Garden Club-56500-Construction in progress-project #853.18-AB"
        ]
      },
      "TXN00044929": {
        "period": "FY25 postings",
        "evidence": [
          "Concrete anchors REFUND - Garden Club Project"
        ]
      },
      "TXN00045090": {
        "period": "FY25 postings",
        "evidence": [
          "Mayer $2216.13 JD 03.03.25 for Garden Club Project 853.18"
        ]
      },
      "TXN00045328": {
        "period": "FY25 postings",
        "evidence": [
          "The home Depot $711.44 JD 03.11.25 Garden club building 853.18"
        ]
      },
      "TXN00045511": {
        "period": "FY25 postings",
        "evidence": [
          "The home depot $398.16 JD 03.18.25 Garden club electrical 853.18"
        ]
      },
      "TXN00045528": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $25.96 JD 03.19.25 Garden club project 853.18"
        ]
      },
      "TXN00045458": {
        "period": "FY25 postings",
        "evidence": [
          "Materials for Bay Memorial Garden Club Project - 56500- Construction in progress- #853.18 - AB"
        ]
      },
      "TXN00046493": {
        "period": "FY25 postings",
        "evidence": [
          "White Caulk for Outside of Bay Memorial Garden Club -56500 - Construction in Progress - Project # 853.18 - AB"
        ]
      },
      "TXN00045995": {
        "period": "FY25 postings",
        "evidence": [
          "The Home Depot $371.04 JD 04.04.25 Garden club building electrical"
        ]
      },
      "TXN00046085": {
        "period": "FY25 postings",
        "evidence": [
          "The Home Depot $386.29 JD 04.08.25 Garden club building electrical"
        ]
      },
      "TXN00046504": {
        "period": "FY25 postings",
        "evidence": [
          "The Home Depot $246.09 JD 04.25.25 Garden club project"
        ]
      },
      "TXN00045904": {
        "period": "FY25 postings",
        "evidence": [
          "Electrical Supplies for Bay Memorial Garden Club - 56500-Construction in progress - 853.18 - AB"
        ]
      },
      "TXN00046448": {
        "period": "FY25 postings",
        "evidence": [
          "White Caulk for outside of Bay Memorial Garden Club Project - 56500 - Construction in progress - Project # 853.18 - AB"
        ]
      },
      "TXN00046508": {
        "period": "FY25 postings",
        "evidence": [
          "Supplies and Materials for Bay Memorial Garden Club - 56500 - Construction in Progress - Project Number 853.18 - AB"
        ]
      },
      "TXN00046486": {
        "period": "FY25 postings",
        "evidence": [
          "Mayer $1109.08 JD 04.25.25 Garden club project"
        ]
      },
      "TXN00046576": {
        "period": "FY25 postings",
        "evidence": [
          "Paint for Bay Memorial Garden Club - 56500 - Construction in Progress - AB"
        ]
      },
      "TXN00046594": {
        "period": "FY25 postings",
        "evidence": [
          "The home depot $355.27 JD 04.29.25 Garden club project 853.18"
        ]
      },
      "TXN00046614": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $121.20 JD 04.30.25 Garden club project"
        ]
      },
      "TXN00046784": {
        "period": "FY25 postings",
        "evidence": [
          "The home depot $528.30 JD 05.05.25 Garden Club 853.18"
        ]
      },
      "TXN00046897": {
        "period": "FY25 postings",
        "evidence": [
          "The  home depot $262.10 JD 05.09.25 for Garden club building 853.18"
        ]
      },
      "TXN00046911": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $249.60 JD 05.09.25 Garden club building 853.18"
        ]
      },
      "TXN00047176": {
        "period": "FY25 postings",
        "evidence": [
          "Inline Electric $208.66 JD 05.22.25 for Garden club building 853.18"
        ]
      },
      "TXN00047245": {
        "period": "FY25 postings",
        "evidence": [
          "Inline Electric $1736.92 JD 05.23.25 For Garden club building 853.18"
        ]
      },
      "TXN00047221": {
        "period": "FY25 postings",
        "evidence": [
          "Electrical Supplies for Garden Club - 56500 - Construction in Progress - AB"
        ]
      },
      "TXN00047381": {
        "period": "FY25 postings",
        "evidence": [
          "The home depot $240.97 JD 05.30.25 for Garden club building"
        ]
      },
      "TXN00047389": {
        "period": "FY25 postings",
        "evidence": [
          "The home depot $610.46 JD 05.29.25 for Garden club building"
        ]
      },
      "TXN00047492": {
        "period": "FY25 postings",
        "evidence": [
          "The home depot $730.74 JD 060425 for Garden club building 853.18",
          "The Home Depot $730.74 JD 060425 for Garden club building"
        ]
      },
      "TXN00047505": {
        "period": "FY25 postings",
        "evidence": [
          "Amazon $255.92 Jd 06.05.25 for Garden club building"
        ]
      },
      "TXN00047561": {
        "period": "FY25 postings",
        "evidence": [
          "Amazon $1584.00 JD 06.05.25 Garden club building"
        ]
      },
      "TXN00047572": {
        "period": "FY25 postings",
        "evidence": [
          "The home depot $517.79 JD 06.05.25 Garden club building"
        ]
      },
      "TXN00047750": {
        "period": "FY25 postings",
        "evidence": [
          "The home depot $520.49 JD 06.13.25 Garden club building 853.18"
        ]
      },
      "TXN00047490": {
        "period": "FY25 postings",
        "evidence": [
          "Amazon $269.95 LM06.05.25 for garden club building"
        ]
      },
      "TXN00047507": {
        "period": "FY25 postings",
        "evidence": [
          "Amazon $109.90 LM 06.05.25 Garden club building"
        ]
      },
      "TXN00047533": {
        "period": "FY25 postings",
        "evidence": [
          "Amazon $1911.00 06.05.25 for garden club building"
        ]
      },
      "TXN00047567": {
        "period": "FY25 postings",
        "evidence": [
          "Amazon $778.00 LM 06.06.25 for Garden club building"
        ]
      },
      "TXN00047352": {
        "period": "FY25 postings",
        "evidence": [
          "Materials for Garden Club Building - 56500 - Construction in Progress - AB"
        ]
      },
      "TXN00047867": {
        "period": "FY25 postings",
        "evidence": [
          "Supplies and Materials for Counter top construction at Garden Club - AB"
        ]
      },
      "TXN00048203": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $493.69 JD 07.07.25 Garden club building"
        ]
      },
      "TXN00048261": {
        "period": "FY25 postings",
        "evidence": [
          "Inline Electrical lighting $131.20 JD 07.09.25 for Garden club building"
        ]
      },
      "TXN00048202": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $66.90 JD 07.07.25 for the Garden club building"
        ]
      },
      "TXN00048233": {
        "period": "FY25 postings",
        "evidence": [
          "Inline Electrical lightig $238.01 JD07.08.25 for Garden club building",
          "Inline Electrical lighting $238.01 JD07.08.25 for Garden club building"
        ]
      },
      "TXN00048294": {
        "period": "FY25 postings",
        "evidence": [
          "Inline Electrical lighting $301.76 JD 07.10.25 for garden club building"
        ]
      },
      "TXN00048361": {
        "period": "FY25 postings",
        "evidence": [
          "Inline Electric $37.68 JD 07.14.25 for garden club building"
        ]
      },
      "TXN00048639": {
        "period": "FY25 postings",
        "evidence": [
          "Inline Electric $21.37 Jd 07.24.25 supplies for garden club building"
        ]
      },
      "TXN00048689": {
        "period": "FY25 postings",
        "evidence": [
          "Panhandle key & safe $35.00 JD 07.25.25 for garden club building"
        ]
      },
      "TXN00048674": {
        "period": "FY25 postings",
        "evidence": [
          "The Home Depot $152.65 JD 07.25.25 supplies for garden club building"
        ]
      },
      "TXN00048898": {
        "period": "FY25 postings",
        "evidence": [
          "Siteone $75.19 LM 080525 supplies for garden club building drainage"
        ]
      },
      "TXN00048934": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $170.28 JD 08.06.25 garden club building drainage"
        ]
      },
      "TXN00049450": {
        "period": "FY25 postings",
        "evidence": [
          "The Home Depot $882.53 LM 08.27.25 for bay memorial building garden club"
        ]
      },
      "TXN00050030": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $26.96 JD 09.22.25 Garden club building"
        ]
      },
      "TXN00050244": {
        "period": "FY26 postings",
        "evidence": [
          "Lowes $40.27 DK 10.02.25 garden club building supplies for concrete"
        ]
      },
      "TXN00050247": {
        "period": "FY26 postings",
        "evidence": [
          "Lowes $6.45 DK 10.02.25 Garden club project"
        ]
      }
    }
  },
  {
    "id": "daffin-batting-cages",
    "title": "Daffin batting cages",
    "type": "Project",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00052863": {
        "period": "FY26 postings",
        "evidence": [
          "Earthworks $221.40 DK 01.29.26 Sand for Daffin batting cages 2",
          "Materials for Daffin Batting Cage"
        ]
      },
      "TXN00052882": {
        "period": "FY26 postings",
        "evidence": [
          "Earthworks $221.40 DK 01.29.26 Sand for daffin batting cages",
          "Materials for Daffin Batting Cage"
        ]
      },
      "TXN00053079": {
        "period": "FY26 postings",
        "evidence": [
          "Materials for Daffin Batting Cage"
        ]
      },
      "TXN00053084": {
        "period": "FY26 postings",
        "evidence": [
          "Siteone $65.39 DK 2.3.26 daffin batting cage",
          "Materials for Daffin Batting Cage"
        ]
      },
      "TXN00053113": {
        "period": "FY26 postings",
        "evidence": [
          "Earthworks $282.15 DK 02.06.26 for Daffin batting cage",
          "Materials for Daffin Batting Cage"
        ]
      },
      "TXN00053119": {
        "period": "FY26 postings",
        "evidence": [
          "Earthworks $329.17 DK 02.06.26 for Daffin batting cage",
          "Materials for Daffin Batting Cage"
        ]
      },
      "TXN00053126": {
        "period": "FY26 postings",
        "evidence": [
          "Earthworks $940.50 DK 02.06.26 for Daffin Batting cage",
          "Materials for Daffin Batting Cage"
        ]
      },
      "TXN00053152": {
        "period": "FY26 postings",
        "evidence": [
          "Herc Rentals $90.00 DK 02.09.26 Daffin batting cage",
          "Materials for Daffin Batting Cage"
        ]
      },
      "TXN00053173": {
        "period": "FY26 postings",
        "evidence": [
          "Fastner Services $168.00 JD 2.10.26 Daffin batting cage"
        ]
      }
    }
  },
  {
    "id": "sudduth-batting-cages",
    "title": "Sudduth batting cages",
    "type": "Project",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00044091": {
        "period": "FY25 postings",
        "evidence": [
          "Earthworks $1229.85 JD 01.13.25 for sudduth batting cage",
          "Earthworks $459.00 JD 01.08.25 for sudduth batting cage.",
          "Earthworks $1229.85 JD 01.13.25 for sudduth batting cage LORETTA A MIMMS | 02/03/2025 Earthworks $459.00 JD 01.08.25 for sudduth batting cage. LORETTA A MIMMS | 02/03/2025"
        ]
      },
      "TXN00046728": {
        "period": "FY25 postings",
        "evidence": [
          "Mid south lumber $99.74 JD 05.02.25 Sudduth batting cage"
        ]
      },
      "TXN00047201": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $70.92 JD 05.22.25 for sudduth batting cage"
        ]
      },
      "TXN00047230": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $58.50 JD 05.23.25 Supplies for sudduth batting cage"
        ]
      },
      "TXN00047194": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $58.90 LM 05.22.25 supplies for sudduth batting cage"
        ]
      }
    }
  },
  {
    "id": "oakland-terrace-batting-cages-and-renovation",
    "title": "Oakland Terrace batting cages and renovation",
    "type": "Project",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00045860": {
        "period": "FY25 postings",
        "evidence": [
          "Paint Supplies for Oakland Terrace Sports Complex Renovations - 55200 - Operating Supplies - Materials and Equipment - Project # 853.19-AB"
        ]
      },
      "TXN00047307": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $219.82 JD 05.28.25 OTX batting cage 853.19"
        ]
      },
      "TXN00047253": {
        "period": "FY25 postings",
        "evidence": [
          "Equipment rental for Oakland Terrace Batting Cages - 54400 - Rentals and Leases. - AB"
        ]
      },
      "TXN00047840": {
        "period": "FY25 postings",
        "evidence": [
          "Herc Rentals $90.00 JD 06.18.25 for OTX batting cage"
        ]
      },
      "TXN00047725": {
        "period": "FY25 postings",
        "evidence": [
          "Siteone $107.90 JD 06.13.25 OTX Batting cage 853.19"
        ]
      },
      "TXN00047792": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $87.88 JD 06.17.25 for OTX Batting cage"
        ]
      },
      "TXN00047824": {
        "period": "FY25 postings",
        "evidence": [
          "Siteone $323.40 JD 06.17.25 OT Batting cage"
        ]
      },
      "TXN00047775": {
        "period": "FY25 postings",
        "evidence": [
          "MMC-Bayou $628.30 LM 06.16.25 for OT batting cages"
        ]
      },
      "TXN00047785": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $59.96 LM 06.16.25 for OT batting cages"
        ]
      },
      "TXN00047789": {
        "period": "FY25 postings",
        "evidence": [
          "Fastener Service $431.00 06.18.25 for OT batting cage"
        ]
      },
      "TXN00047559": {
        "period": "FY25 postings",
        "evidence": [
          "Oakland Terrace Batting Cage Supplies - 55200 - Operating Supplies - Athletic/Sport Supplies - AB"
        ]
      }
    }
  },
  {
    "id": "millville-amphitheatre-construction",
    "title": "Millville amphitheatre construction",
    "type": "Project",
    "batches": "reviewed",
    "scope": "Explicit amphitheatre notes only; keep waterfront restrooms, irrigation, pest control and playground work separate.",
    "members": {
      "TXN00044998": {
        "period": "FY25 postings",
        "evidence": [
          "Anchor Bolts/Millville Amphitheater-Engineer Dept."
        ]
      },
      "TXN00046561": {
        "period": "FY25 postings",
        "evidence": [
          "Anchors for Amphitheatre at Millville Waterfront Park - Purchased for CRA Project # 932.1 per Matt Devito - Received GL Coding information from Lori in CRA - AB"
        ]
      },
      "TXN00047615": {
        "period": "FY25 postings",
        "evidence": [
          "Nuts & Washers for Millville Ampitheater Project"
        ]
      },
      "TXN00049991": {
        "period": "FY25 postings",
        "evidence": [
          "Grout & Foam for Millville Amphitheater - CRA Dept"
        ]
      },
      "TXN00050029": {
        "period": "FY25 postings",
        "evidence": [
          "Grout & Foam for Millville Amphitheater- CRA Dept"
        ]
      },
      "TXN00050093": {
        "period": "FY25 postings",
        "evidence": [
          "Rebar brick veneer@Millville Amphitheater-CRA Dept"
        ]
      },
      "TXN00050124": {
        "period": "FY25 postings",
        "evidence": [
          "Grout for Millville Amphitheater - CRA Dept."
        ]
      }
    }
  },
  {
    "id": "daffin-project-936-2-and-related-lighting",
    "title": "Daffin project 936.2 and related lighting",
    "type": "Project",
    "batches": "reviewed",
    "scope": "September 2026 project-number and lighting-work references. Exclude the unrelated March 2025 light-tower battery purchase.",
    "members": {
      "TXN00057760": {
        "period": "FY26 postings",
        "evidence": [
          "Florida Hose & Rubber $186.84 DK 9.1.26 for Daffin Pump Supplies Project 936.2"
        ]
      },
      "TXN00057771": {
        "period": "FY26 postings",
        "evidence": [
          "Harbor Freight $369.97 DK 9.1.26 for Daffin light project 936.2"
        ]
      },
      "TXN00057775": {
        "period": "FY26 postings",
        "evidence": [
          "Florida Hose & Rubber $31.02 DK 9.1.26 for Daffin Pump Supplies Project 936.2"
        ]
      },
      "TXN00057822": {
        "period": "FY26 postings",
        "evidence": [
          "Lowes $551.20 9.3.26 for Daffin light project"
        ]
      },
      "TXN00058167": {
        "period": "FY26 postings",
        "evidence": [
          "Lowes $313.00 JD 9.21.26 For light poles at Daffin proj#936.2"
        ]
      }
    }
  },
  {
    "id": "winter-storm-enzo-response",
    "title": "Winter Storm Enzo response",
    "type": "Event",
    "batches": "reviewed",
    "scope": "January 2025 sand, supplies and crew meals explicitly naming winter storm Enzo or project 962.1.",
    "members": {
      "TXN00044142": {
        "period": "2025-01 storm response purchases",
        "evidence": [
          "Dining during winter storm Enzo Jared Jones"
        ]
      },
      "TXN00044117": {
        "period": "2025-01 storm response purchases",
        "evidence": [
          "Winter storm Enzo Food for over Nite crew"
        ]
      },
      "TXN00044126": {
        "period": "2025-01 storm response purchases",
        "evidence": [
          "winter Storm Enzo 962.1"
        ]
      },
      "TXN00044175": {
        "period": "2025-01 storm response purchases",
        "evidence": [
          "Project 962.1 winter storm snow. Sand for roads"
        ]
      },
      "TXN00044119": {
        "period": "2025-01 storm response purchases",
        "evidence": [
          "Winter storm Enzo supplies for streets drainage"
        ]
      },
      "TXN00044193": {
        "period": "2025-01 storm response purchases",
        "evidence": [
          "Project #962.1 Winter storm snow. Sand for roads"
        ]
      }
    }
  },
  {
    "id": "incdev-workshops-and-meetups",
    "title": "IncDev workshops and meetups",
    "type": "Event",
    "batches": "reviewed",
    "scope": "Separate September 2025 workshop, November activity, February bootcamp and later meetups; advance venue charges belong to the named event date rather than the purchase month when explicit.",
    "members": {
      "TXN00047525": {
        "period": "2025-09-04 workshop · date recorded in notes",
        "evidence": [
          "Bay High Deposit for Inc Dev Training on 09.04.25"
        ]
      },
      "TXN00049056": {
        "period": "2025-09-04 workshop · date recorded in notes",
        "evidence": [
          "Bay High Aud Rental for Inc Dev Workshop 970.1 on Sept 4th"
        ]
      },
      "TXN00049624": {
        "period": "2025-09-04 workshop · date recorded in notes",
        "evidence": [
          "OFFICE DEPOT-Note pad and Hello My name is..IncDev Workshop 970.1"
        ]
      },
      "TXN00051051": {
        "period": "2025-11 purchase batch",
        "evidence": [
          "AMAZON MKTPL--Inc Dev/Office Supplies"
        ]
      },
      "TXN00051064": {
        "period": "2025-11 purchase batch",
        "evidence": [
          "AMAZON - Inc Dev Workshop-Danish"
        ]
      },
      "TXN00051260": {
        "period": "2025-11 purchase batch",
        "evidence": [
          "PUBLIX #481 - Inc Dev--with tax"
        ]
      },
      "TXN00051261": {
        "period": "2025-11 purchase batch",
        "evidence": [
          "THE BAGEL MAKER - for Inc Dev"
        ]
      },
      "TXN00051262": {
        "period": "2025-11 purchase batch",
        "evidence": [
          "PUBLIX #481 - Supplies for Inc Dev"
        ]
      },
      "TXN00051280": {
        "period": "2025-11 purchase batch",
        "evidence": [
          "THE BAGEL MAKER - Inc Dev"
        ]
      },
      "TXN00051317": {
        "period": "2025-11 purchase batch",
        "evidence": [
          "TRIGO S.F. STYLE DELI - Inc Dev Workshop Lunch"
        ]
      },
      "TXN00053330": {
        "period": "2026-02 purchase batch",
        "evidence": [
          "AMAZON - Folders for IncDev BootCamp"
        ]
      },
      "TXN00053909": {
        "period": "2026-03 purchase batch",
        "evidence": [
          "03.12.26 Wal-Mart- -Inc Dev Supplies"
        ]
      },
      "TXN00055292": {
        "period": "2026-05 purchase batch",
        "evidence": [
          "MY SPACE DOWNTOWN - IncDev May Meet up"
        ]
      },
      "TXN00056816": {
        "period": "2026-07 purchase batch",
        "evidence": [
          "Inc Dev Meet-Up"
        ]
      },
      "TXN00057143": {
        "period": "2026-08 purchase batch",
        "evidence": [
          "August IncDev Meet Up"
        ]
      },
      "TXN00057941": {
        "period": "2026-09 purchase batch",
        "evidence": [
          "MY SPACE DOWNTOWN - IncDev Meet-Up"
        ]
      }
    }
  },
  {
    "id": "knifty-krafters",
    "title": "Knifty Krafters",
    "type": "Program",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00041701": {
        "period": "FY25 postings",
        "evidence": [
          "Knifty Crafters supplies"
        ]
      },
      "TXN00044391": {
        "period": "FY25 postings",
        "evidence": [
          "55200 - Operating Supplies - Programming Supplies for Knifty Krafters"
        ]
      },
      "TXN00045146": {
        "period": "FY25 postings",
        "evidence": [
          "Knifty Krafters program supplies - 55200 Operating Supplies - Programming Supplies - AB"
        ]
      },
      "TXN00045881": {
        "period": "FY25 postings",
        "evidence": [
          "Knifty Krafters Program Supplies - 55200 - Operating Supplies - Programming Supplies -AB"
        ]
      },
      "TXN00046950": {
        "period": "FY25 postings",
        "evidence": [
          "Knifty Krafters program supplies - 55200 - Operating Supplies - Program Supplies - AB"
        ]
      },
      "TXN00046686": {
        "period": "FY25 postings",
        "evidence": [
          "Knifty Krafters Program Supplies - 55200 - Operating Supplies - AB"
        ]
      },
      "TXN00054456": {
        "period": "FY26 postings",
        "evidence": [
          "Program Supplies - Knifty Crafters"
        ]
      },
      "TXN00055120": {
        "period": "FY26 postings",
        "evidence": [
          "Program supplies - Knifty Crafters"
        ]
      },
      "TXN00056567": {
        "period": "FY26 postings",
        "evidence": [
          "Hobby Lobby $347.01 LM 7.6.26 for Knifty Crafters"
        ]
      }
    }
  },
  {
    "id": "glenwood-recreation-subscriptions",
    "title": "Glenwood recreation subscriptions",
    "type": "Program",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00044604": {
        "period": "FY25 postings",
        "evidence": [
          "Monthly Xbox Subscription for programs at Glenwood Community Center - Books Memberships, Publications. _AB"
        ]
      },
      "TXN00045325": {
        "period": "FY25 postings",
        "evidence": [
          "Subscription for Programming at Glenwood- 55400 - Books, Memberships, Publications - AB"
        ]
      },
      "TXN00046135": {
        "period": "FY25 postings",
        "evidence": [
          "Monthly Subscription for program at Glenwood- 55400 - Books Memberships Publications - AB"
        ]
      },
      "TXN00046920": {
        "period": "FY25 postings",
        "evidence": [
          "Monthly Subscription For Programming at Glenwood Community Center - 55400 - Books, Publications, Memberships - AB"
        ]
      },
      "TXN00047666": {
        "period": "FY25 postings",
        "evidence": [
          "Monthly Subscription for Programming at Glenwood Community Center - AB"
        ]
      }
    }
  },
  {
    "id": "little-league",
    "title": "Little League",
    "type": "Program",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00044299": {
        "period": "FY25 postings",
        "evidence": [
          "Little League Baseball Charters and Insurance Fees. GL Code-54500"
        ]
      },
      "TXN00044643": {
        "period": "FY25 postings",
        "evidence": [
          "Rule Books for Little League Coaches - Operating Supplies - Athletic/Sports Supplies-AB"
        ]
      },
      "TXN00045079": {
        "period": "FY25 postings",
        "evidence": [
          "Background checks on coaches for Little League Spring Season - 54900 Other Current Charges, BG Checks - AB"
        ]
      },
      "TXN00046203": {
        "period": "FY25 postings",
        "evidence": [
          "Sports Championship Rings for Little League Baseball Season - 54800 Promo Activities - Awards - AB"
        ]
      },
      "TXN00046000": {
        "period": "FY25 postings",
        "evidence": [
          "Little League Jerseys - 55200 - Operating Supplies - Athletic Supplies - AB"
        ]
      },
      "TXN00046244": {
        "period": "FY25 postings",
        "evidence": [
          "Sponsorship Banners for Little League Baseball - 55200 - Operating Supplies - Athletic Supplies - AB"
        ]
      },
      "TXN00046326": {
        "period": "FY25 postings",
        "evidence": [
          "Sponsorship Banners for Little League Baseball - 55200 - Operating Supplies - Athletic/Sports Materials - AB"
        ]
      },
      "TXN00046681": {
        "period": "FY25 postings",
        "evidence": [
          "Little League Patches for Uniforms - 55200 - Operating Supplies - Athletic/Sport Supplies - AB"
        ]
      },
      "TXN00047453": {
        "period": "FY25 postings",
        "evidence": [
          "Youth Little League Tournament Supplies - 54800 - Promo Activity - Tournament - AB"
        ]
      }
    }
  },
  {
    "id": "musically-up-close",
    "title": "Musically Up Close",
    "type": "Event",
    "batches": "reviewed",
    "scope": "TXN00046718 ($178.05) names both events. Its note gives $51.44 PCSO/PCMA and $126.61 event supplies; keep the mixed charge visibly shared until the allocation is verified. Do not sum the full-charge group totals.",
    "members": {
      "TXN00041703": {
        "period": "2024-10 purchase batch",
        "evidence": [
          "Musically up close food"
        ]
      },
      "TXN00041650": {
        "period": "2024-10 purchase batch",
        "evidence": [
          "Musically up Close Food"
        ]
      },
      "TXN00044511": {
        "period": "2025-02 purchase batch",
        "evidence": [
          "Promo Activity - PCSO/PCMA - Musically Up Close Event for Panama City Symphony"
        ]
      },
      "TXN00044534": {
        "period": "2025-02 purchase batch",
        "evidence": [
          "Promo Activity - PCSO/PCMA - Musically Up Close Event"
        ]
      },
      "TXN00045205": {
        "period": "2025-03 purchase batch",
        "evidence": [
          "Musically Up Close Event - 54800-Promo Activity - PCSO/PCMA"
        ]
      },
      "TXN00045980": {
        "period": "2025-04 purchase batch",
        "evidence": [
          "Cookies for Musically Up Close Event - 54800 Promo Activity - PCSO/PCMA - AB"
        ]
      },
      "TXN00047009": {
        "period": "2025-05 purchase batch",
        "evidence": [
          "Police Services for Musically Up Close Event -"
        ]
      },
      "TXN00046718": {
        "period": "2025-05 purchase batch",
        "evidence": [
          "Food and Supplies for Maypole Event and Musically Up Close Event - 54800 - Promo Activities - $51.44 - PCSO/PCMA, $126.61 - Event Supplies - AB"
        ]
      }
    }
  },
  {
    "id": "maypole-event",
    "title": "Maypole event",
    "type": "Event",
    "batches": "reviewed",
    "scope": "TXN00046718 ($178.05) names both events. Its note gives $51.44 PCSO/PCMA and $126.61 event supplies; keep the mixed charge visibly shared until the allocation is verified. Do not sum the full-charge group totals.",
    "members": {
      "TXN00045737": {
        "period": "2025 purchase batch",
        "evidence": [
          "May Pole Event Supplies - 54800 - Promo Activities- Event Supplies - AB"
        ]
      },
      "TXN00046634": {
        "period": "2025 purchase batch",
        "evidence": [
          "Food & Supplies for Maypole Event - 54800 Promo Activities - Event Supplies - AB"
        ]
      },
      "TXN00046718": {
        "period": "2025 purchase batch",
        "evidence": [
          "Food and Supplies for Maypole Event and Musically Up Close Event - 54800 - Promo Activities - $51.44 - PCSO/PCMA, $126.61 - Event Supplies - AB"
        ]
      },
      "TXN00046626": {
        "period": "2025 purchase batch",
        "evidence": [
          "Cake for Maypole Event - 54800 - Promo Activity - Event Supplies - AB"
        ]
      }
    }
  },
  {
    "id": "mother-s-day-event",
    "title": "Mother’s Day event",
    "type": "Event",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00046288": {
        "period": "2025 purchase batch",
        "evidence": [
          "Mother's Day Event Supplies - 54800 - Promo Activity - Event Supplies - AB"
        ]
      },
      "TXN00046888": {
        "period": "2025 purchase batch",
        "evidence": [
          "Food/Supplies for Mother's Day Event - 54800 - Promo Activities - AB"
        ]
      },
      "TXN00046892": {
        "period": "2025 purchase batch",
        "evidence": [
          "Food/Supplies for Mother's Day Event - 54800 - Promo Activity - AB"
        ]
      },
      "TXN00046931": {
        "period": "2025 purchase batch",
        "evidence": [
          "Mother's Day Event Supplies - 54800 - Promo Activities - AB"
        ]
      }
    }
  },
  {
    "id": "this-we-will-defend-event",
    "title": "This We Will Defend event",
    "type": "Event",
    "batches": "reviewed",
    "scope": "Eight exact event-name purchases plus one June 14, 2025 Army birthday/5K DJ charge linked by the same explicit date. Broader generic 5K mentions remain unassigned.",
    "members": {
      "TXN00046255": {
        "period": "2025-06-14 event · date recorded in related notes",
        "evidence": [
          "Trophy name plates for \"This we will defend\" 5K Event - 54800 - Promo Activities - Event Supplies - AB"
        ]
      },
      "TXN00047257": {
        "period": "2025-06-14 event · date recorded in related notes",
        "evidence": [
          "DJ for 5k and Army Bday Event on 6.14.25 - 54800 Promo Activity - AB"
        ]
      },
      "TXN00047270": {
        "period": "2025-06-14 event · date recorded in related notes",
        "evidence": [
          "Tent Rental for We will defend event on 6.14.25. - 54800 - Promo Activity - Event Supplies -AB"
        ]
      },
      "TXN00047801": {
        "period": "2025-06-14 event · date recorded in related notes",
        "evidence": [
          "Stage rental for This We Will Defend Event - AB"
        ]
      },
      "TXN00047628": {
        "period": "2025-06-14 event · date recorded in related notes",
        "evidence": [
          "Printing of programs and tickets for This We Will Defend Event - 54700 - Printing & Binding - AB"
        ]
      },
      "TXN00047636": {
        "period": "2025-06-14 event · date recorded in related notes",
        "evidence": [
          "Facebook Ad Boost for This We Will Defend 5K Event - 54800 - Promo Activity - Ads/Commerical, Facebook, Billboards, Radio - AB"
        ]
      },
      "TXN00047719": {
        "period": "2025-06-14 event · date recorded in related notes",
        "evidence": [
          "Cake for This We Will Defend Event - 54800 - Promo Activity - Food - AB"
        ]
      },
      "TXN00047765": {
        "period": "2025-06-14 event · date recorded in related notes",
        "evidence": [
          "This We Will Defend Facebook Ad Boost - 54800 - Promo Activity - AB"
        ]
      },
      "TXN00047760": {
        "period": "2025-06-14 event · date recorded in related notes",
        "evidence": [
          "This We Will Defend Event Supplies - 54800 - Promo Activity - Event Supplies - AB"
        ]
      }
    }
  },
  {
    "id": "national-night-out",
    "title": "National Night Out",
    "type": "Event",
    "batches": "reviewed",
    "scope": "Keep 2025 and 2026 purchase batches separate; do not present them as one event.",
    "members": {
      "TXN00050347": {
        "period": "2025 purchase batch",
        "evidence": [
          "National Night Out: buns"
        ]
      },
      "TXN00057212": {
        "period": "2026 purchase batch",
        "evidence": [
          "Amazon $191.96 LM 8.9.26 promotional supplies for national night out"
        ]
      },
      "TXN00057324": {
        "period": "2026 purchase batch",
        "evidence": [
          "Amazon $125.00 LM 8.13.26 promotional national night out"
        ]
      }
    }
  },
  {
    "id": "school-speed-zone-campaign",
    "title": "School speed zone campaign",
    "type": "Program",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00054201": {
        "period": "FY26 postings",
        "evidence": [
          "Facebook Ad Automated School Zone Speed",
          "Facebook ads for school speed zones."
        ]
      },
      "TXN00054213": {
        "period": "FY26 postings",
        "evidence": [
          "Facebook Ad #2 Automated School Zone Speed",
          "Facebook ads for school speed zones."
        ]
      },
      "TXN00054214": {
        "period": "FY26 postings",
        "evidence": [
          "Facebook Ad #3 School Zone Speed",
          "Facebook ads for school speed zones."
        ]
      },
      "TXN00054225": {
        "period": "FY26 postings",
        "evidence": [
          "Facebook Ad #4 School Zone Speed",
          "Facebook ads for school speed zones."
        ]
      },
      "TXN00054230": {
        "period": "FY26 postings",
        "evidence": [
          "Facebook ad #5 School Zone Speed",
          "Facebook ads for school speed zones."
        ]
      },
      "TXN00054234": {
        "period": "FY26 postings",
        "evidence": [
          "Facebook Ad#6 Automated School Speed Zone",
          "Facebook ads for school speed zones."
        ]
      },
      "TXN00054235": {
        "period": "FY26 postings",
        "evidence": [
          "Facebook Ad #7 Automated School Speed Zone",
          "Facebook ads for school speed zones."
        ]
      }
    }
  },
  {
    "id": "dispatch-appreciation-week",
    "title": "Dispatch appreciation week",
    "type": "Event",
    "batches": "reviewed",
    "scope": "Keep 2025 and 2026 purchase batches separate; do not present them as one event.",
    "members": {
      "TXN00045621": {
        "period": "2025 purchase batch",
        "evidence": [
          "Dispatch week giveaways"
        ]
      },
      "TXN00054193": {
        "period": "2026 purchase batch",
        "evidence": [
          "Dispatch week items"
        ]
      },
      "TXN00054199": {
        "period": "2026 purchase batch",
        "evidence": [
          "Dispatch week items"
        ]
      },
      "TXN00054221": {
        "period": "2026 purchase batch",
        "evidence": [
          "Dispatch week items"
        ]
      },
      "TXN00054681": {
        "period": "2026 purchase batch",
        "evidence": [
          "Dispatch week items"
        ]
      },
      "TXN00054690": {
        "period": "2026 purchase batch",
        "evidence": [
          "Dispatch week items"
        ]
      },
      "TXN00054726": {
        "period": "2026 purchase batch",
        "evidence": [
          "Dispatch week items"
        ]
      },
      "TXN00054729": {
        "period": "2026 purchase batch",
        "evidence": [
          "Dispatch week items"
        ]
      },
      "TXN00054845": {
        "period": "2026 purchase batch",
        "evidence": [
          "Dispatch week items"
        ]
      }
    }
  },
  {
    "id": "team-wellness-events",
    "title": "Team wellness events",
    "type": "Event",
    "batches": "reviewed",
    "scope": "Separate February 2025, January/February 2026 and September 2026 batches. Four charges repeat an itemized note, but only TXN00052942 ($112.71) matches the wellness portion. Exclude the other three totaling $208.30.",
    "members": {
      "TXN00044402": {
        "period": "2025-02 wellness purchases",
        "evidence": [
          "Wellness Event"
        ]
      },
      "TXN00044555": {
        "period": "2025-02 wellness purchases",
        "evidence": [
          "Wellness Event"
        ]
      },
      "TXN00044630": {
        "period": "2025-02 wellness purchases",
        "evidence": [
          "Wellness Event (12 nursing team, 2 Better You Strides, 1 HUb, 8 Volunteers)"
        ]
      },
      "TXN00044678": {
        "period": "2025-02 wellness purchases",
        "evidence": [
          "Wellness event.  Additional snack items."
        ]
      },
      "TXN00044685": {
        "period": "2025-02 wellness purchases",
        "evidence": [
          "Wellness Event.  Nursing team, Better You Strides, HUB, Volunteers"
        ]
      },
      "TXN00052769": {
        "period": "2026-01–02 wellness purchases",
        "evidence": [
          "Wellness event give aways"
        ]
      },
      "TXN00052783": {
        "period": "2026-01–02 wellness purchases",
        "evidence": [
          "Wellness event give aways"
        ]
      },
      "TXN00052791": {
        "period": "2026-01–02 wellness purchases",
        "evidence": [
          "Wellness Event prizes - Resistance Bands, Dehydrator"
        ]
      },
      "TXN00052803": {
        "period": "2026-01–02 wellness purchases",
        "evidence": [
          "Wellness event - Target purchase give aways"
        ]
      },
      "TXN00052811": {
        "period": "2026-01–02 wellness purchases",
        "evidence": [
          "Wellness Event prizes - Resistance Bands, Dehydrator"
        ]
      },
      "TXN00052942": {
        "period": "2026-01–02 wellness purchases",
        "evidence": [
          "2 trash cans, plastic forks, calculator (Kellie) - $127.97 & $69.95  pencils & erasers (MOT) - $10.38  Measure tape, kitchen scale, food containers (Wellness Event) - $112.71"
        ]
      },
      "TXN00058165": {
        "period": "2026-09 health fair purchases",
        "evidence": [
          "Amazon Health Fair 351.20  9.21.26",
          "Team Member Wellness Event"
        ]
      },
      "TXN00058168": {
        "period": "2026-09 health fair purchases",
        "evidence": [
          "Amazon Health Fair  75.98 09.21.26",
          "Health Screening Event Team Members"
        ]
      },
      "TXN00058177": {
        "period": "2026-09 health fair purchases",
        "evidence": [
          "Amazon Health Fair  33.24 09.21.26",
          "Team Member Wellness Event"
        ]
      },
      "TXN00058226": {
        "period": "2026-09 health fair purchases",
        "evidence": [
          "AMAZON health fair 313.62  9.21.26",
          "Health Fair"
        ]
      },
      "TXN00058257": {
        "period": "2026-09 health fair purchases",
        "evidence": [
          "AMAZON health fair 59.99  9.21.26",
          "Health Fair"
        ]
      }
    }
  },
  {
    "id": "public-works-week-luncheon",
    "title": "Public Works Week luncheon",
    "type": "Event",
    "batches": "reviewed",
    "scope": "Separate 2025 and 2026. Include the four June 2026 refunds totaling $3,782.28 and the replacement charges; the initial charges alone overstate net cost.",
    "members": {
      "TXN00047236": {
        "period": "2025 Public Works Week purchases and refunds",
        "evidence": [
          "Nat'l Public Works Week Luncheon-PW Dept."
        ]
      },
      "TXN00047091": {
        "period": "2025 Public Works Week purchases and refunds",
        "evidence": [
          "Cake for Nat'l PW Week Luncheon - PW Dept."
        ]
      },
      "TXN00055735": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "Nat'l Public Works Week - Public Works Dept."
        ]
      },
      "TXN00055738": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "Nat'l Public Works Week - Public Works Dept."
        ]
      },
      "TXN00055740": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "Nat'l Public Works Week - Public Works Dept."
        ]
      },
      "TXN00055760": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "Nat'l Public Works Week - Public Works Dept."
        ]
      },
      "TXN00055762": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "Cake & Supplies for Nat'l PW Week - PW Dept."
        ]
      },
      "TXN00056143": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "REFUND for Nat'l PW Week - Public Works Dept."
        ]
      },
      "TXN00056144": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "REFUND for Nat'l PW Week - Public Works Dept."
        ]
      },
      "TXN00056162": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "REFUND for Nat'l PW Week - Public Works Dept."
        ]
      },
      "TXN00056163": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "REFUND for Nat'l PW Week - Public Works Dept."
        ]
      },
      "TXN00056173": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "Nat'l Public Works Week - Public Works Dept."
        ]
      },
      "TXN00056186": {
        "period": "2026 Public Works Week purchases and refunds",
        "evidence": [
          "Nat'l Public Works Week - Public Works Dept."
        ]
      }
    }
  },
  {
    "id": "touch-a-truck",
    "title": "Touch a Truck",
    "type": "Event",
    "batches": "reviewed",
    "scope": "Overlaps existing Christmas-parade/review groups. Keep shared purchases visibly marked and deduplicate the overall Radar total.",
    "members": {
      "TXN00050659": {
        "period": "2025 purchase batch",
        "evidence": [
          "Recruiting/Touch a Truck Events"
        ]
      },
      "TXN00050987": {
        "period": "2025 purchase batch",
        "evidence": [
          "toy hard hats for Touch a Truck Event"
        ]
      },
      "TXN00051017": {
        "period": "2025 purchase batch",
        "evidence": [
          "Candy stamps bracelets, toy hard hats for Touch a Truck and Christmas Parades"
        ]
      },
      "TXN00051055": {
        "period": "2025 purchase batch",
        "evidence": [
          "toy hard hats for Touch a Truck event"
        ]
      }
    }
  },
  {
    "id": "millville-parade",
    "title": "Millville parade",
    "type": "Event",
    "batches": "reviewed",
    "scope": "Overlaps existing Christmas-parade/review groups. Keep shared purchases visibly marked and deduplicate the overall Radar total.",
    "members": {
      "TXN00051411": {
        "period": "2025 purchase batch",
        "evidence": [
          "Amazon $$1447.16 LM 11.20.25 Candy for Millville parade"
        ]
      },
      "TXN00051541": {
        "period": "2025 purchase batch",
        "evidence": [
          "Amazon $78.34 LM 11.25.26 supplies for Millville parade",
          "Amazon $78.34 LM 11.25.26 supplies for milville parade"
        ]
      },
      "TXN00051662": {
        "period": "2025 purchase batch",
        "evidence": [
          "Christmas decorations for Millville Parade, tinsel, garland, extension cords"
        ]
      },
      "TXN00051699": {
        "period": "2025 purchase batch",
        "evidence": [
          "Christmas decorations for Millville Parade. garland, candy canes, lights"
        ]
      }
    }
  },
  {
    "id": "millville-cemetery-work",
    "title": "Millville cemetery work",
    "type": "Project",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00048603": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $40.82 JD 07.23.25 Millville cemetery",
          "Lowes $40.82 JD 07.23.25 Milvlle cemetery project"
        ]
      },
      "TXN00048650": {
        "period": "FY25 postings",
        "evidence": [
          "Lowes $259.20 JD 07.24.25 supplies for Millville cemetery"
        ]
      },
      "TXN00050516": {
        "period": "FY26 postings",
        "evidence": [
          "MLV Cemetery-Paint Rollers, Trays, Stir Sticks, Trim Trays"
        ]
      },
      "TXN00050537": {
        "period": "FY26 postings",
        "evidence": [
          "MLV Cemetery-Paint/Adhesive Remover"
        ]
      },
      "TXN00050564": {
        "period": "FY26 postings",
        "evidence": [
          "MLV Cemetery-5-gal Black Semi-Gloss Paint(12)"
        ]
      },
      "TXN00050570": {
        "period": "FY26 postings",
        "evidence": [
          "MLV Cemetery-42 Gallon Black Trash Bags"
        ]
      },
      "TXN00050579": {
        "period": "FY26 postings",
        "evidence": [
          "MLV Cemetery-42-gal Disposable Trash Can"
        ]
      },
      "TXN00050587": {
        "period": "FY26 postings",
        "evidence": [
          "MLV Cemetery-Hand Cleaning Wipes"
        ]
      },
      "TXN00050607": {
        "period": "FY26 postings",
        "evidence": [
          "MLV Cemetery-1.5 inch Paint Brushes (2 packs)"
        ]
      },
      "TXN00050715": {
        "period": "FY26 postings",
        "evidence": [
          "SAMS CLUB MLV Cemetery Supplies"
        ]
      },
      "TXN00050775": {
        "period": "FY26 postings",
        "evidence": [
          "THE HOME DEPOT #6303 - MLV Cemetery Clean up"
        ]
      },
      "TXN00050794": {
        "period": "FY26 postings",
        "evidence": [
          "LOWES-Supplies for MLV Cemetery Clean-up"
        ]
      },
      "TXN00051177": {
        "period": "FY26 postings",
        "evidence": [
          "THE HOME DEPOT #6303 - MLV Cemetery - Tax removed"
        ]
      }
    }
  },
  {
    "id": "airport-avenue-project",
    "title": "Airport Avenue project",
    "type": "Project",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00048821": {
        "period": "FY25 postings",
        "evidence": [
          "light TOWER/AIRPORT AVE PROJECT"
        ]
      },
      "TXN00048833": {
        "period": "FY25 postings",
        "evidence": [
          "MESSAGE BOARD/AIRPORT AVE PROJECT"
        ]
      }
    }
  },
  {
    "id": "harrison-project",
    "title": "Harrison project",
    "type": "Project",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00044181": {
        "period": "FY25 postings",
        "evidence": [
          "3/4 CPLG PVC - Harrison Project"
        ]
      },
      "TXN00044196": {
        "period": "FY25 postings",
        "evidence": [
          "3/4 CPLG PVC - Harrison Project"
        ]
      },
      "TXN00044205": {
        "period": "FY25 postings",
        "evidence": [
          "PVC Fittings Harrison Project"
        ]
      }
    }
  },
  {
    "id": "12th-street-construction",
    "title": "12th Street construction",
    "type": "Project",
    "batches": "reviewed",
    "scope": "Keep posting years or purchase batches separate; totals are full associated charges after credits, not a complete project cost.",
    "members": {
      "TXN00056011": {
        "period": "FY26 postings",
        "evidence": [
          "GRADE STAKES FOR 12TH STREET CONSTRUCTION PROJECT"
        ]
      },
      "TXN00056034": {
        "period": "FY26 postings",
        "evidence": [
          "RENTED F550 NON-CDL SMALL DUMP TRUCK FOR 12 ST PROJECT"
        ]
      }
    }
  }
];
function radarActivityGroups(ts){
 const unique=[...new Map(ts.map(t=>[t.id,t])).values()];
 return [...radarActivities,...radarReviewedActivities].map(g=>({...g,items:unique.map(t=>({t,evidence:g.members?(g.members[t.id]?.evidence||[]):(t.purchaseNotes||purchaseNotes(t.comments||[])).filter(note=>g.pattern.test(note)),period:g.members?.[t.id]?.period})).filter(r=>r.evidence.length)})).filter(g=>g.items.length);
}
function radarActivityBatches(g){
 const batches=new Map();
 for(const r of g.items){const key=g.batches==='reviewed'?r.period:g.batches==='month'?r.t.date.slice(0,7):r.t.fy;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(r);}
 return [...batches].sort(([a],[b])=>a.localeCompare(b));
}
function radarActivityAmount(t){return t.scoped??t.amount}
function radarActivityContents(g){
 return `${g.note?`<p class="radar-question">${esc(g.note)}</p>`:''}<p class="section-note">${g.batches==='reviewed'?esc(g.scope)+' Period labels describe purchase batches unless an event date is explicitly marked.':g.batches==='month'?'Shown in purchase-month batches. Room numbers and refunds remain as recorded; other accreditation expenses can appear alongside lodging.':'Shown by posting fiscal year.'} Select a merchant to open the full transaction details and other recorded notes.</p>${radarActivityBatches(g).map(([key,items])=>`<section class="radar-activity-batch"><h3>${g.batches==='reviewed'?esc(key):g.batches==='month'?'Purchases in '+esc(key):esc(key)+' postings'}</h3><p class="fine">${items.length} transactions · ${exact(items.reduce((n,r)=>n+radarActivityAmount(r.t),0))} net</p>${transactionTable(items.sort((a,b)=>a.t.date.localeCompare(b.t.date)||a.t.id.localeCompare(b.t.id)),{radar:true})}</section>`).join('')}`;
}
