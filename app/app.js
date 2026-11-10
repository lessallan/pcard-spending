'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(c/100);
const exact=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
const number=n=>n.toLocaleString('en-US');
let data, rows=[], page=0, view='overview', rankMetric='spend', selectedId=null, selectedLeader=null;
const titles={transactions:['Explore transactions','Search and filter individual City P-card purchases.'],leader:['Associated card charges','Recorded cardholder transactions, not personal spending.'],retail:['Amazon, Walmart & similar stores','Explore purchases at stores that sell many kinds of goods; itemized receipts explain what was bought.'],overview:['Your city’s P-card spending','Understand how public money supports everyday City work.'],travel:['Travel & lodging','Explore travel charges by merchant and spending area.'],centers:['Spending by area','Understand the accounting areas charged for City purchases.'],merchants:['Where the money goes','Explore merchants, purchase volume, and broad-selection retailers.'],staff:['City leadership','Elected officials, city management, and department leadership.']};
// Published reference labels: FY25/FY26 budget books; 4150 identified in June 29, 2026 budget workshop.
// Additional evidence: analysis/cost-center-expanded-search.md (private research, not published).
// Not a verified FY26 chart of accounts or proof of an employee's department.
const centerNames={"4150":"Internal paving crew","7300":"MLK Recreation Campus","1100":"City Commission","1200":"City Manager","1310":"City Clerk Treasurer","1330":"Purchasing","1340":"Human Resources","1350":"Information Technology","1360":"Logistics","1400":"City Attorneys","1610":"Land Use (FY25)","1620":"Engineering","1710":"Public Works Administration","1720":"Facility Maintenance","2100":"Police","2200":"Fire","4110":"Street Maintenance","4120":"Street Drainage","4130":"Street Signs and Markings","4140":"Street Sweeping Operations","7200":"Quality of Life (FY25)","3410":"Environmental Services Administration","3420":"Residential Garbage","3430":"Commercial Garbage","3440":"Residential Trash","3450":"CNG Station","3610":"Utilities Administration","3620":"Billing and Customer Service","3630":"Underground Utilities","3640":"Lift Stations","3650":"Wastewater Treatment Operations","3651":"St. Andrews Wastewater Treatment Plant","3652":"Millville Wastewater Treatment Plant","3720":"F.O.G. Program","7500":"Panama City Marina","7600":"St. Andrew Marina","8930":"Equipment Maintenance","5512":"St. Andrews CRA","5513":"Downtown CRA","5514":"Downtown North CRA","5518":"Millville CRA","5901":"A.D. Harris Campus","8181":"Housing General Administration","8800":"Non-departmental Expenses","1615":"Building Services (FY26)","3653":"Laboratory (FY26)","5410":"City SHIP Funds","5415":"Neighborhood Stabilization Program City","5421":"City SHIP-HHRP","5426":"County NSP Properties","8008":"PC Center for Arts","8110":"City Hall","8131":"Public Service","8520":"Business Recruitment","8752":"PCM Mall Area"};
function centerLabel(code){return centerNames[code]?`${code} · ${centerNames[code]}`:code}
const centerSource='<a href="https://www.panamacity.gov/DocumentCenter/View/8951/Tentative-Budget-FY25---Digital-Book" target="_blank" rel="noopener">FY25 tentative budget ↗</a> and <a href="https://www.panamacity.gov/DocumentCenter/View/10236/Tentative-Budget-FY-26---Digital-book" target="_blank" rel="noopener">FY26 proposed budget ↗</a>';
function personContext(name){const codes=[...new Set(rows.filter(t=>t.person===name).flatMap(t=>t.allocations.map(a=>a.center)))];return '<span class="fine">Recorded cost centers (budget reference names): '+codes.map(c=>esc(centerLabel(c))).join('; ')+'</span>'}
function displayName(s){if(!s)return 'Not publicly identified';if(s.includes(',')){let [last,...first]=s.split(',');return `${first.join(' ').trim()} ${last}`.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}
function fillSelect(id,values,label){$(id).innerHTML=`<option value="">${label}</option>`+[...new Set(values)].sort().map(v=>`<option value="${esc(v)}">${esc(id==='person'?displayName(v):id==='center'?centerLabel(v):v)}</option>`).join('')}
function filters(){return view==='transactions'?Object.fromEntries(new FormData($('filters'))):{}}
function filtered(){
 const f=view==='overview'?{}:filters();let result=[];if(selectedLeader)f.person='';
 if(f.from&&f.to&&f.from>f.to){$('filter-error').textContent='The start date must be on or before the end date.';return []}
 $('filter-error').textContent='';
 for(const t of data.transactions){
  if(f.purchaseType==='travel'&&t.travel==='Not identified as travel')continue;
  if(f.fy&&t.fy!==f.fy||f.person&&t.person!==f.person||f.merchant&&t.merchant!==f.merchant||f.from&&t.date<f.from||f.to&&t.date>f.to||f.minimum&&t.amount<Math.round(Number(f.minimum)*100))continue;
  if(f.search&&!`${t.id} ${t.person} ${displayName(t.person)} ${t.merchant} ${t.raw}`.toLowerCase().includes(f.search.toLowerCase()))continue;
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
function bars(groups,type,limit=8){
 const gs=groups.filter(g=>rankMetric==='count'?g.purchases.size>0:g.net>0).slice(0,limit),value=g=>rankMetric==='count'?g.purchases.size:g.net,max=Math.max(...gs.map(value),1);
 if(!gs.length)return '<p class="empty">No positive values in this selection. Widen the filters to see a comparison.</p>';
 return `<div role="img" aria-label="${esc(rankMetric==='count'?'Purchase count ranking':'Positive net spending ranking')}">${gs.map(g=>`<div class="chart-row"><button type="button" data-filter="${type}" data-value="${esc(g.name)}" aria-label="Filter to ${esc(g.name)}">${esc(type==='person'?displayName(g.name):type==='center'?centerLabel(g.name):g.name)}</button><div class="track" title="${esc(g.name)}: ${rankMetric==='count'?number(value(g)):exact(value(g))}"><div class="bar" style="width:${value(g)/max*100}%"></div></div><span class="chart-value">${rankMetric==='count'?number(value(g)):money(value(g))}</span></div>`).join('')}<div class="axis"><span>0</span><span>${rankMetric==='count'?'Purchase transactions':'USD · net after credits'} · top ${gs.length}</span></div></div>`;
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
function table(ts){const start=page*30,shown=ts.slice(start,start+30);return `<div class="table-wrap"><table><thead><tr><th>Purchase / transaction</th><th>Cardholder</th><th>Merchant</th><th class="num">Amount</th></tr></thead><tbody>${shown.map(t=>`<tr><td><button type="button" class="link" data-detail="${t.id}">${t.date}</button><span class="fine">${t.id}</span></td><td>${esc(displayName(t.person))}<span class="fine">${[...new Set(t.allocations.map(a=>a.center))].map(c=>esc(centerLabel(c))).join(', ')}</span></td><td>${esc(t.merchant)}<span class="fine">${esc(t.travel==='Not identified as travel'?t.category:t.travel)}</span></td><td class="num">${exact(t.scoped)}${t.scoped!==t.amount?`<span class="fine">${exact(t.amount)} full charge</span>`:''}</td></tr>`).join('')}</tbody></table></div>${!ts.length?'<p class="empty">No matching transactions. Reset or widen the filters to continue.</p>':''}<div class="pagination"><span>${ts.length?`${start+1}–${Math.min(start+30,ts.length)} of ${number(ts.length)}`:'0 transactions'}</span><button type="button" id="prev" ${page===0?'disabled':''}>Previous</button><button type="button" id="next" ${start+30>=ts.length?'disabled':''}>Next</button></div>`}
function rankingTable(groups,type){return `<div class="table-wrap"><table><thead><tr><th>${type==='center'?'Cost center':type==='person'?'Cardholder':'Merchant'}</th><th class="num">Net amount</th><th class="num">Purchases</th><th class="num">All transactions</th></tr></thead><tbody>${groups.slice(0,50).map(g=>`<tr><td><button type="button" class="link" data-filter="${type}" data-value="${esc(g.name)}">${esc(type==='person'?displayName(g.name):type==='center'?centerLabel(g.name):g.name)}</button>${type==='person'?personContext(g.name):''}</td><td class="num">${exact(g.net)}</td><td class="num">${number(g.purchases.size)}</td><td class="num">${number(g.ids.size)}</td></tr>`).join('')}</tbody></table></div><p class="fine">Showing ${Math.min(50,groups.length)} of ${groups.length} groups. Click a name or code to inspect its transactions.</p>`}
// Approved leadership selection, in the reviewed order; retain one profile per person.
const leadershipProfiles=[["Allan Branch", "Mayor"], ["Robbie Hughes", "Commissioner, Ward 1"], ["Janice Lucas", "Commissioner Ward 2"], ["Brian Grainger", "Commissioner Ward 3"], ["Josh Street", "Commissioner Ward 4"], ["Jonathan Hayes", "City Manager"], ["Leslie Glaze", "City Clerk-Treasurer"], ["Nevin J. Zimmerman", "City Attorney"], ["Michael Fuller", "Development Services Director"], ["David Collier", "Fire Chief"], ["Mark Smith", "Chief of Police"], ["Sheila Ware", "Director"], ["Vickie Lewis", "Director"], ["Shawn Selph", "Director of Logistics"], ["Clint Murphy", "Public Works Director"], ["Keith Meyerl", "Director of Parks, Culture & Recreation"], ["Brandy Waldron", "Assistant City Manager"], ["Jared Jones", "Assistant City Manager"], ["Stacy Rausch, P.E.", "Assistant Public Works Director / City Engineer"], ["Trent Massey", "Chief Building Official"], ["Cody Klingelhoets", "IT Senior Manager"], ["Gia Del Pozzo", "Purchasing Manager"], ["Samantha Perman", "Budget Manager"], ["Kristen Kennedy", "Public Affairs Manager"]];
// Observed name matches plus explicitly confirmed alternate names. No department attribution.
const leadershipCardholders={"Allan Branch": "BRANCH , ALLAN", "Robbie Hughes": "HUGHES, ROBBIE", "Janice Lucas": "LUCAS, JANICE L", "Brian Grainger": "GRAINGER, BRIAN R", "Josh Street": "STREET, JOSH", "Jonathan Hayes": "HAYES, JONATHAN H", "Leslie Glaze": "GLAZE, LESLIE", "David Collier": "COLLIER, DAVID W", "Mark Smith": "SMITH, MARK E", "Sheila Ware": "WARE, SHEILA S", "Shawn Selph": "SELPH, SHAWN E", "Clint Murphy": "MURPHY, CLINT", "Keith Meyerl": "MEYERL, KEITH", "Brandy Waldron": "WALDRON, BRANDY L", "Stacy Rausch, P.E.": "RAUSCH, STACY L", "Cody Klingelhoets": "KLINGELHOETS, CODY", "Samantha Perman": "PERMAN, SAMANTHA", "Kristen Kennedy": "KENNEDY, KRISTEN P.", "Michael Fuller": "FULLER, JAMES MICHAEL", "Vickie Lewis": "LEWIS, VICTORIA M", "Gia Del Pozzo": "DEL POZZO, GIOVANNA"};
// Allan confirmed Fuller, Lewis, and Del Pozzo's alternate names in this chat.
const unconfirmedLeadershipNames=new Set();
function leadershipId(name){return name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}
function leadershipRecords(name){const cardholder=leadershipCardholders[name];return cardholder?data.transactions.filter(t=>t.person===cardholder):[]}
function leadershipSummary(name){
 const records=leadershipRecords(name);
 return records.length?`${exact(records.reduce((n,t)=>n+t.amount,0))} net associated charges · ${number(records.length)} transactions`:
 unconfirmedLeadershipNames.has(name)?'Cardholder name match needs confirmation':'No matching cardholder record found';
}
const reimbursementNotice='<p class="notice"><strong>P-card transactions only.</strong> These records do not include expense reimbursements. Some officials and employees may have paid expenses personally and received reimbursement separately. Those amounts are not shown here, so these totals are not a complete picture of expenses associated with a person.</p>';
function leadershipIntro(name){
 const profile=data.staff.find(s=>s.name===name);
 const source=profile?` · <a href="${esc(profile.source_url)}" target="_blank" rel="noopener">Official City profile ↗</a>`:'';
 return `<p><a href="#staff">← Back to City leadership</a></p>${reimbursementNotice}<p class="section-note">${esc(leadershipProfiles.find(p=>p[0]===name)[1])}${source}</p><div class="budget-note"><h3>Associated card charges</h3><p>These are charges recorded under a matching cardholder name, not verified personal spending. A cardholder may purchase for others. Costs paid on someone else’s card are not attributed here, and the records do not establish who requested, approved, or benefited from each purchase.</p></div>`;
}
function staffView(){
 const q=(filters().search||'').toLowerCase();const staff=leadershipProfiles.map(([name,title])=>data.staff.find(s=>s.name===name&&s.title===title)).filter(Boolean).filter(s=>`${s.name} ${s.title} ${s.departments.join(' ')} ${s.email}`.toLowerCase().includes(q));
 return `${reimbursementNotice}<p class="section-note">Showing ${staff.length} of ${leadershipProfiles.length} leadership profiles. Only the 24 selected leadership profiles are named; other cardholders are not publicly identified. Roles come from the City directory imported November 9, 2026; they are not verified roles during FY25/FY26. Associated charges use cardholder name matches, not verified identity links or personal spending. Totals cover both supplied fiscal years; no match does not mean no costs.</p><div class="staff-grid">${staff.map(s=>{return `<article class="staff-person"><div class="staff-top">${s.photo_file?`<img class="avatar" src="./${esc(s.photo_file)}" alt="" loading="lazy">`:`<div class="avatar" aria-hidden="true">${esc(s.name.split(/\s+/).map(x=>x[0]).slice(0,2).join(''))}</div>`}<div><h3><a href="#leader/${leadershipId(s.name)}">${esc(s.name)}</a></h3><p>${esc(s.title==='Director'?s.departments.join(' · ')+' Director':s.title||'Title not published')}</p>${s.email?`<a class="staff-email" href="mailto:${esc(s.email)}">${esc(s.email)}</a>`:''}</div></div><p class="leadership-total">${esc(leadershipSummary(s.name))}</p></article>`}).join('')}</div>${!staff.length?'<p class="empty">No leadership profiles match this search. Clear the search to see all City leadership.</p>':''}`;
}

function isHotel(t){return t.travel==='Hotels & lodging'}
function annualTravel(ts){
 return '<div class="boards annual-travel">'+['FY25','FY26'].filter(fy=>!filters().fy||filters().fy===fy).map(fy=>{
 const year=ts.filter(t=>t.fy===fy),hotels=year.filter(isHotel),groups=aggregate(year,'merchant');
 return board(fy+' · Travel report',(fy==='FY25'?'Oct 1, 2024 – Sep 30, 2025':'Oct 1, 2025 – Sep 30, 2026')+' · posting fiscal year',
 '<div class="annual-totals">'+stat('Net travel-related',exact(year.reduce((n,t)=>n+t.scoped,0)))+stat('Included hotel merchants',exact(hotels.reduce((n,t)=>n+t.scoped,0)))+'</div>'+bars(groups,'merchant',5)+
 '<details><summary>View travel merchants</summary>'+rankingTable(groups,'merchant')+'</details>');
 }).join('')+'</div>';
}
let retailerScope='all';
function retailerMatches(t){return t.mixed&&(retailerScope==='all'||retailerScope==='amazon-walmart'&&['Amazon','Walmart'].includes(t.merchant)||t.category===retailerScope)}
function retailerReport(ts){
 const cats=[...new Set(data.transactions.filter(t=>t.mixed).map(t=>t.category))].sort();
 let out='<div class="controls-row"><label>Retailer group<select id="retailer-scope"><option value="all">All broad-selection retailers</option><option value="amazon-walmart">Amazon and Walmart only</option>'+cats.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('')+'</select></label></div><p class="section-note">Scope uses the reviewed merchant groupings: marketplaces, hardware/tools, office/industrial catalogs, grocery/pharmacy and other mixed-category retailers. This is an initial identified set, not every possible retailer. Net spending includes credits. Cost centers use actual accounting allocations; department names remain unverified. Split accounting rows are not receipt line items.</p>'+rankingControls();
 out+='<div class="boards">';
 for(const fy of ['FY25','FY26'].filter(fy=>!filters().fy||filters().fy===fy)){
  const year=ts.filter(t=>t.fy===fy);const mg=aggregate(year,'merchant'),cg=aggregate(year,'center',true);
  out+=board(fy+' · Retailers',exact(year.reduce((n,t)=>n+t.scoped,0))+' net · '+year.length+' transactions · '+(fy==='FY25'?'Oct 2024–Sep 2025':'Oct 2025–Sep 2026')+' postings',bars(mg,'merchant',5)+'<details><summary>View retailer totals</summary>'+rankingTable(mg,'merchant')+'</details>');
  out+=board(fy+' · Spending areas','Allocated net spending · budget reference names; a purchase can span several centers.',bars(cg,'center',5)+'<details><summary>View spending areas</summary>'+rankingTable(cg,'center')+'</details>');
 }
 out+=board('Retailer spending','Current filters · net after credits.',bars(aggregate(ts,'merchant'),'merchant',12),true)+'</div>';
 return out;
}
function render(){
 if(!data)return;
 const route=location.hash.slice(1)||'overview';
 selectedLeader=route.startsWith('leader/')?leadershipProfiles.find(([name])=>leadershipId(name)===route.slice(7))?.[0]||null:null;
 view=selectedLeader?'leader':titles[route]&&route!=='leader'?route:'overview';
 $('title').textContent=selectedLeader||titles[view][0];$('subtitle').textContent=titles[view][1];document.title=(selectedLeader||titles[view][0])+' · Penny Ping';
 document.querySelectorAll('nav a').forEach(a=>{a.classList.toggle('active',a.hash==='#'+(selectedLeader?'staff':view));a.setAttribute('aria-current',a.hash==='#'+(selectedLeader?'staff':view)?'page':'false')});
 const staff=view==='staff';
 document.querySelector('.filter-box').hidden=view!=='transactions';
 document.querySelectorAll('#filters label').forEach(l=>l.hidden=(staff&&!l.classList.contains('search-label'))||!!selectedLeader&&l.contains($('person')));
 const active=Object.values(filters()).filter(Boolean).length;$('filter-count').textContent=staff?'Search leadership':active?`${active} active`:'';
 if(staff){$('content').innerHTML=staffView();return}
 rows=filtered();
 if(selectedLeader){
  const cardholder=leadershipCardholders[selectedLeader];
  rows=cardholder?rows.filter(t=>t.person===cardholder):[];
  if(!leadershipRecords(selectedLeader).length){
   $('content').innerHTML=leadershipIntro(selectedLeader)+`<h2>${unconfirmedLeadershipNames.has(selectedLeader)?'Name match needs confirmation':'No matching cardholder record found'}</h2><p>Associated charges are unavailable for this profile. This does not mean $0 in costs: purchases may have been processed by another cardholder or recorded under a different name.</p><p>Browse <a href="#centers">spending areas</a> to explore recorded accounting allocations without attributing them to this person.</p>`;
   return;
  }
 }
 if(view==='retail')rows=rows.filter(retailerMatches);if(view==='travel')rows=rows.filter(t=>t.travel!=='Not identified as travel');
 rows.sort((a,b)=>b.scoped-a.scoped);
 let out=(selectedLeader?leadershipIntro(selectedLeader)+`<p class="section-note">Name-matched cardholder in source records: <strong>${esc(leadershipCardholders[selectedLeader])}</strong>. Recorded P-card purchases are shown below.</p>`:'')+(view==='transactions'?stats(rows):'');const centered=aggregate(rows,'center',true),people=aggregate(rows,'person'),merchants=aggregate(rows,'merchant');
 if(view!=='overview'&&(filters().fund||filters().center))out+='<p class="section-note">Amounts reflect only the selected accounting allocations. Transaction counts remain unique IDs; minimum-charge and policy checks use the full original charge.</p>';
 if(view==='overview'){
  const travelRows=rows.filter(t=>t.travel!=='Not identified as travel');
  out+='<div class="boards overview-boards"><div class="overview-primary">'+board('By spending area','The largest accounting areas for City P-card purchases. Select an area to explore its transactions.',bars(centered,'center',12),true)+'</div>'+board('All spending across the year','All recorded P-card spending · both fiscal years.',timeline(rows),true)+board('Where spending lands','Businesses the City buys from.',bars(merchants,'merchant',5))+board('Everyday retailers','Store totals do not identify the individual items purchased.',bars(aggregate(rows.filter(t=>t.mixed),'merchant'),'merchant',5))+board('Travel & lodging by spending area','Accounting areas with the most recorded travel spending. Purchases may support several people or services.','<div data-destination="travel">'+bars(aggregate(travelRows,'center',true),'center',8)+'</div><p><a href="#travel">Explore travel &amp; lodging →</a></p>',true)+'</div>';

 }else if(view==='retail'){
  out+=retailerReport(rows);
 }else if(view==='travel'){
  out+='<div class="budget-note"><h3>How travel fits the budget</h3><p>Travel is part of City operations. Employees are expected to follow approved budgets and travel rules. This dataset does not include those budget allocations, so it cannot show remaining budget or establish overspending.</p></div><p class="section-note">Travel is inferred from recognizable merchant names and travel account 54000. It may include personal context, shared bookings, or non-travel charges and may miss other travel. Hotel classification uses recognizable lodging merchants; hotel totals may include meals, tuition and incidentals. Counts are purchase transactions, not trips or nights. Cardholders may book for other people.</p>'+rankingControls();
  out+=annualTravel(rows);
  out+='<div class="boards">'+board('Travel spending by area','Allocated travel charges by accounting area; purchases may support several people.',bars(centered,'center',12),true)+board('Travel merchants','Hotels, airfare, transport, and unclassified travel-account charges.',bars(merchants,'merchant'))+board('Travel through the year','Net recorded amounts by posting month.',timeline(rows),true)+'</div>';
 }else if(['centers','merchants'].includes(view)){
  const type={centers:'center',people:'person',merchants:'merchant'}[view],gs={centers:centered,people,merchants}[view];
  out+=rankingControls()+(view==='people'?'<p class="section-note">A cardholder is the employee named on the payment card, not necessarily the person using the goods or taking the trip. One employee may purchase for a whole team. The table shows recorded cost centers, not a verified job title. <a href="#staff">Browse City leadership</a> for current published roles; identities and historical roles still need confirmation.</p>':'')+(view==='centers'?'<p class="section-note">A cost center is an accounting code used to group spending by a City function or service. Names come from City budget books and budget-workshop records; year-specific labels are marked. Codes awaiting confirmation remain as codes. Split purchases can appear in multiple centers. Source: '+centerSource+'</p>':'');
  out+=board(rankMetric==='count'?'Purchases by group':'Recorded spending by group','Top positive groups · complete signed amounts in the table below.',bars(gs,type,12));out+=rankingTable(gs,type);

 }
 if(view!=='overview')out+=`<section class="transactions"><div class="board-head" style="margin-top:30px"><div><h2>Explore transactions</h2><p class="sub">${number(rows.length)} matching records · largest amounts first · select a date for details</p></div></div>${table(rows)}</section>`;
 $('content').innerHTML=out;
 $('prev')?.addEventListener('click',()=>{page--;render()});$('next')?.addEventListener('click',()=>{page++;render()});
 if($('retailer-scope')){$('retailer-scope').value=retailerScope;$('retailer-scope').addEventListener('change',e=>{retailerScope=e.target.value;page=0;render()})}
 $('rank-metric')?.addEventListener('change',e=>{rankMetric=e.target.value;render()});
}
function openDetail(id){
 const t=data.transactions.find(t=>t.id===id);if(!t)return;selectedId=id;
 $('detail-title').textContent=t.id+' · '+exact(t.amount);
 $('detail-body').innerHTML=`<dl class="detail-grid"><div><dt>Merchant</dt><dd>${esc(t.raw)}</dd></div><div><dt>Cardholder</dt><dd>${esc(displayName(t.person))}</dd></div><div><dt>Purchase / posted</dt><dd>${t.date} / ${t.post}</dd></div><div><dt>Source</dt><dd>${esc(t.source)} · ${esc(t.sheet)} · rows ${t.rows.join(', ')}</dd></div></dl><p class="section-note">P-card transactions only; separate expense reimbursements are not included. Cardholders may purchase for others.</p><h3>Accounting allocations</h3><div class="table-wrap"><table><thead><tr><th>Fund</th><th>Spending area</th><th>Account</th><th class="num">Amount</th></tr></thead><tbody>${t.allocations.map(a=>`<tr><td>${esc(a.fund)}</td><td>${esc(centerLabel(a.center))}</td><td>${esc(a.account)}</td><td class="num">${exact(a.amount)}</td></tr>`).join('')}</tbody></table></div>`;
 $('detail').showModal();
}
$('content').addEventListener('click',e=>{const detail=e.target.closest('[data-detail]');if(detail)openDetail(detail.dataset.detail);const filter=e.target.closest('[data-filter]');if(filter){if(view!=='transactions'){const travel=view==='travel'||filter.closest('[data-destination]')?.dataset.destination==='travel';HTMLFormElement.prototype.reset.call($('filters'));$(filter.dataset.filter).value=filter.dataset.value;$('purchaseType').value=travel?'travel':'';location.hash='transactions';return}$(filter.dataset.filter).value=filter.dataset.value;page=0;render();document.querySelector('.transactions')?.scrollIntoView({behavior:'instant'})}});
$('close-detail').addEventListener('click',()=>$('detail').close());
$('filters').addEventListener('submit',e=>e.preventDefault());
let timer;$('filters').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{page=0;render()},180)});
$('reset').addEventListener('click',()=>{retailerScope='all';HTMLFormElement.prototype.reset.call($('filters'));page=0;render()});
window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#leader/')||selectedLeader&&location.hash==='#staff'){HTMLFormElement.prototype.reset.call($('filters'));retailerScope='all'}page=0;rankMetric='spend';$('nav').classList.remove('open');document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');render();window.scrollTo(0,0)});
document.querySelector('.mobile-menu').addEventListener('click',e=>{const open=$('nav').classList.toggle('open');e.target.setAttribute('aria-expanded',String(open))});
if(innerWidth<=600)document.querySelector('.filter-box').open=false;
function loadDataset(d){
 const strings=['id','fy','date','post','person','merchant','raw','category','source','sheet','travel'];
 if(!d||!Array.isArray(d.transactions)||!Array.isArray(d.staff)||!d.transactions.every(t=>t&&strings.every(k=>typeof t[k]==='string')&&Number.isFinite(t.amount)&&Array.isArray(t.allocations)&&t.allocations.every(a=>a&&['fund','center','account'].every(k=>typeof a[k]==='string'&&/^[\w .-]*$/.test(a[k]))&&Number.isFinite(a.amount))&&['comments','flags'].every(k=>Array.isArray(t[k])&&t[k].every(v=>typeof v==='string'))&&Array.isArray(t.rows)&&t.rows.every(Number.isInteger)&&/^[\w.-]+$/.test(t.id))||!d.staff.every(s=>s&&['name','source_url'].every(k=>typeof s[k]==='string')&&['title','email'].every(k=>s[k]===null||typeof s[k]==='string')&&Array.isArray(s.departments)&&s.departments.every(v=>typeof v==='string')&&/^https?:\/\//.test(s.source_url)))throw Error('Spending records could not be read.');
 data=d;page=0;HTMLFormElement.prototype.reset.call($('filters'));
 for(const [id,values,label] of [['fund',d.transactions.flatMap(t=>t.allocations.map(a=>a.fund)),'All funds'],['center',d.transactions.flatMap(t=>t.allocations.map(a=>a.center)),'All cost centers'],['person',d.transactions.map(t=>t.person).filter(Boolean),'All listed leaders'],['merchant',d.transactions.map(t=>t.merchant),'All merchants']])fillSelect(id,values,label);
 $('loading').hidden=true;render();
}
fetch('./data.json?v=leadership-photos-4').then(r=>{if(!r.ok)throw Error();return r.json()}).then(loadDataset).catch(()=>{$('loading').hidden=false;$('loading').textContent='Spending records could not load. Reload this page to try again.'});
