'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(c/100);
const exact=c=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(c/100);
const number=n=>n.toLocaleString('en-US');
let data, rows=[], page=0, view='overview', rankMetric='spend', selectedId=null;
const titles={retail:['Amazon, Walmart & similar stores','Explore annual purchases at everyday retailers.'],overview:['City spending at a glance','Explore public spending by merchant, accounting area, and time.'],travel:['Travel & lodging','Explore travel charges by merchant and cost center.'],centers:['Spending by cost center','Understand the accounting areas charged for City purchases.'],merchants:['Where the money goes','Explore merchants, purchase volume, and broad-selection retailers.']};
// Published reference labels: FY25/FY26 budget books; 4150 identified in June 29, 2026 budget workshop.
// Additional evidence: analysis/cost-center-expanded-search.md (private research, not published).
// Not a verified FY26 chart of accounts or proof of an employee's department.
const centerNames={"4150":"Internal paving crew","7300":"MLK Recreation Campus","1100":"City Commission","1200":"City Manager","1310":"City Clerk Treasurer","1330":"Purchasing","1340":"Human Resources","1350":"Information Technology","1360":"Logistics","1400":"City Attorneys","1610":"Land Use (FY25)","1620":"Engineering","1710":"Public Works Administration","1720":"Facility Maintenance","2100":"Police","2200":"Fire","4110":"Street Maintenance","4120":"Street Drainage","4130":"Street Signs and Markings","4140":"Street Sweeping Operations","7200":"Quality of Life (FY25)","3410":"Environmental Services Administration","3420":"Residential Garbage","3430":"Commercial Garbage","3440":"Residential Trash","3450":"CNG Station","3610":"Utilities Administration","3620":"Billing and Customer Service","3630":"Underground Utilities","3640":"Lift Stations","3650":"Wastewater Treatment Operations","3651":"St. Andrews Wastewater Treatment Plant","3652":"Millville Wastewater Treatment Plant","3720":"F.O.G. Program","7500":"Panama City Marina","7600":"St. Andrew Marina","8930":"Equipment Maintenance","5512":"St. Andrews CRA","5513":"Downtown CRA","5514":"Downtown North CRA","5518":"Millville CRA","5901":"A.D. Harris Campus","8181":"Housing General Administration","8800":"Non-departmental Expenses","1615":"Building Services (FY26)","3653":"Laboratory (FY26)","5410":"City SHIP Funds","5415":"Neighborhood Stabilization Program City","5421":"City SHIP-HHRP","5426":"County NSP Properties","8008":"PC Center for Arts","8110":"City Hall","8131":"Public Service","8520":"Business Recruitment","8752":"PCM Mall Area"};
function centerLabel(code){return centerNames[code]?`${code} · ${centerNames[code]}`:code}
const centerSource='<a href="https://www.panamacity.gov/DocumentCenter/View/8951/Tentative-Budget-FY25---Digital-Book" target="_blank" rel="noopener">FY25 tentative budget ↗</a> and <a href="https://www.panamacity.gov/DocumentCenter/View/10236/Tentative-Budget-FY-26---Digital-book" target="_blank" rel="noopener">FY26 proposed budget ↗</a>';
function displayName(s){if(s.includes(',')){let [last,...first]=s.split(',');return `${first.join(' ').trim()} ${last}`.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}return s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase())}
function fillSelect(id,values,label){$(id).innerHTML=`<option value="">${label}</option>`+[...new Set(values)].sort().map(v=>`<option value="${esc(v)}">${esc(id==='center'?centerLabel(v):v)}</option>`).join('')}
function filters(){return Object.fromEntries(new FormData($('filters')))}
function filtered(){
 const f=filters();let result=[];
 if(f.from&&f.to&&f.from>f.to){$('filter-error').textContent='The start date must be on or before the end date.';return []}
 $('filter-error').textContent='';
 for(const t of data.transactions){
  if(f.fy&&t.fy!==f.fy||f.merchant&&t.merchant!==f.merchant||f.from&&t.date<f.from||f.to&&t.date>f.to||f.minimum&&t.amount<Math.round(Number(f.minimum)*100))continue;
  if(f.search&&!`${t.id} ${t.merchant} ${t.raw} ${t.comments.join(' ')}`.toLowerCase().includes(f.search.toLowerCase()))continue;
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
function stats(ts){const net=ts.reduce((n,t)=>n+t.scoped,0),gross=ts.reduce((n,t)=>n+Math.max(t.scoped,0),0),credits=-ts.reduce((n,t)=>n+Math.min(t.scoped,0),0);return `<div class="stats">${stat('Net recorded amount',money(net),'After negative entries')}${stat('Positive charges',money(gross),number(ts.filter(t=>t.amount>0).length)+' purchases')}${stat('Credits / adjustments',money(credits),'Includes unresolved entries')}${stat('Transactions',number(ts.length),'Unique transaction IDs')}</div>`}
function bars(groups,type,limit=8){
 const gs=groups.filter(g=>rankMetric==='count'?g.purchases.size>0:g.net>0).slice(0,limit),value=g=>rankMetric==='count'?g.purchases.size:g.net,max=Math.max(...gs.map(value),1);
 if(!gs.length)return '<p class="empty">No positive values in this selection. Widen the filters to see a comparison.</p>';
 return `<div role="img" aria-label="${esc(rankMetric==='count'?'Purchase count ranking':'Positive net spending ranking')}">${gs.map(g=>`<div class="chart-row"><button type="button" data-filter="${type}" data-value="${esc(g.name)}" aria-label="Filter to ${esc(g.name)}">${esc(type==='center'?centerLabel(g.name):g.name)}</button><div class="track" title="${esc(g.name)}: ${rankMetric==='count'?number(value(g)):exact(value(g))}"><div class="bar" style="width:${value(g)/max*100}%"></div></div><span class="chart-value">${rankMetric==='count'?number(value(g)):money(value(g))}</span></div>`).join('')}<div class="axis"><span>0</span><span>${rankMetric==='count'?'Purchase transactions':'USD · net after credits'} · top ${gs.length}</span></div></div>`;
}
function timeline(ts){const months=new Map();for(const t of ts){const m=t.post.slice(0,7);months.set(m,(months.get(m)||0)+t.scoped)}const sorted=[...months].sort(),max=Math.max(...sorted.map(x=>Math.abs(x[1])),1);return `<div class="timeline" role="img" aria-label="Net recorded amount by posting month">${sorted.map(([m,n])=>`<div class="month" title="${m}: ${exact(n)}"><div class="shaft"><div class="bar" style="height:${Math.abs(n)/max*100}%;background:${n<0?'var(--rose)':'#638569'}"></div></div><span>${m}</span></div>`).join('')}</div><p class="fine">Posting month · heights show magnitude; hover for exact net amounts. Negative months are marked in red.</p>`}
function board(title,note,body,full=false){return `<section class="board ${full?'full':''}"><div class="board-head"><div><h2>${title}</h2><p class="sub">${note}</p></div></div>${body}</section>`}
function rankingControls(){return `<div class="controls-row"><label>Rank by<select id="rank-metric"><option value="spend" ${rankMetric==='spend'?'selected':''}>Net spending</option><option value="count" ${rankMetric==='count'?'selected':''}>Purchase count</option></select></label></div>`}
function table(ts){const start=page*30,shown=ts.slice(start,start+30);return `<div class="table-wrap"><table><thead><tr><th>Purchase / transaction</th><th>Cost center</th><th>Merchant</th><th class="num">Amount</th></tr></thead><tbody>${shown.map(t=>`<tr><td><button type="button" class="link" data-detail="${t.id}">${t.date}</button><span class="fine">${t.id}</span></td><td><span class="fine">${[...new Set(t.allocations.map(a=>a.center))].map(c=>esc(centerLabel(c))).join(', ')}</span></td><td>${esc(t.merchant)}<span class="fine">${esc(t.travel==='Not identified as travel'?t.category:t.travel)}</span></td><td class="num">${exact(t.scoped)}${t.scoped!==t.amount?`<span class="fine">${exact(t.amount)} full charge</span>`:''}</td></tr>`).join('')}</tbody></table></div>${!ts.length?'<p class="empty">No matching transactions. Reset or widen the filters to continue.</p>':''}<div class="pagination"><span>${ts.length?`${start+1}–${Math.min(start+30,ts.length)} of ${number(ts.length)}`:'0 transactions'}</span><button type="button" id="prev" ${page===0?'disabled':''}>Previous</button><button type="button" id="next" ${start+30>=ts.length?'disabled':''}>Next</button></div>`}
function rankingTable(groups,type){return `<div class="table-wrap"><table><thead><tr><th>${type==='center'?'Cost center':'Merchant'}</th><th class="num">Net amount</th><th class="num">Purchases</th><th class="num">All transactions</th></tr></thead><tbody>${groups.slice(0,50).map(g=>`<tr><td><button type="button" class="link" data-filter="${type}" data-value="${esc(g.name)}">${esc(type==='center'?centerLabel(g.name):g.name)}</button></td><td class="num">${exact(g.net)}</td><td class="num">${number(g.purchases.size)}</td><td class="num">${number(g.ids.size)}</td></tr>`).join('')}</tbody></table></div><p class="fine">Showing ${Math.min(50,groups.length)} of ${groups.length} groups. Click a name or code to inspect its transactions.</p>`}


let retailerScope='all';
function retailerMatches(t){return t.mixed&&(retailerScope==='all'||retailerScope==='amazon-walmart'&&['Amazon','Walmart'].includes(t.merchant)||t.category===retailerScope)}
function retailerReport(ts){
 const cats=[...new Set(data.transactions.filter(t=>t.mixed).map(t=>t.category))].sort();
 let out='<div class="controls-row"><label>Retailer group<select id="retailer-scope"><option value="all">All broad-selection retailers</option><option value="amazon-walmart">Amazon and Walmart only</option>'+cats.map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('')+'</select></label></div><p class="section-note">Scope uses the merchant groupings: marketplaces, hardware/tools, office/industrial catalogs, grocery/pharmacy and other mixed-category retailers. The categories group recognizable retailers and may not include every retailer. Net spending includes credits. Cost centers use actual accounting allocations; known cost-center names are shown beside their codes. A purchase can be allocated across several accounting areas.</p>'+rankingControls();
 out+='<div class="boards">';
 for(const fy of ['FY25','FY26'].filter(fy=>!filters().fy||filters().fy===fy)){
  const year=ts.filter(t=>t.fy===fy);const cg=aggregate(year,'center',true);
  out+=board(fy+' · Cost centers','Allocated net spending · a transaction can span several cost centers.',bars(cg,'center',5)+'<details><summary>View cost-center rankings</summary>'+rankingTable(cg,'center')+'</details>');
 }
 out+=board('Retailer spending','Current filters · net after credits.',bars(aggregate(ts,'merchant'),'merchant',12),true)+'</div>';
 return out;
}

function render(){
 if(!data)return;
 view=location.hash.slice(1)||'overview';if(!titles[view])view='overview';
 $('title').textContent=titles[view][0];$('subtitle').textContent=titles[view][1];document.title=titles[view][0]+' · Penny Ping';
 document.querySelectorAll('nav a').forEach(a=>{a.classList.toggle('active',a.hash==='#'+view);a.setAttribute('aria-current',a.hash==='#'+view?'page':'false')});
 const staff=false;$('export').hidden=staff;
 document.querySelectorAll('#filters label').forEach(l=>l.hidden=staff&&!l.classList.contains('search-label'));
 const active=Object.values(filters()).filter(Boolean).length;$('filter-count').textContent=staff?'Search directory':active?`${active} active`:'';

 rows=filtered();if(view==='retail')rows=rows.filter(retailerMatches);if(view==='travel')rows=rows.filter(t=>t.travel!=='Not identified as travel');
 rows.sort((a,b)=>b.scoped-a.scoped);
 let out=stats(rows);const centered=aggregate(rows,'center',true),merchants=aggregate(rows,'merchant');
 if(filters().fund||filters().center)out+='<p class="section-note">Amounts reflect only the selected accounting allocations. Transaction counts remain unique IDs; the minimum-charge filter uses the full original charge.</p>';
 if(view==='overview'){
  out+='<div class="boards">'+board('Where spending lands','Click a merchant to explore its purchases.',bars(merchants,'merchant'))+board('By cost center','Accounting allocations with known cost-center names.',bars(centered,'center'))+board('Across the year','Both fiscal years · figures from provided detail.',timeline(rows),true)+board('Travel & lodging','Travel purchases by merchant.',bars(aggregate(rows.filter(t=>t.travel!=='Not identified as travel'),'merchant'),'merchant'))+board('Everyday retailers','Purchases at stores that sell many kinds of goods.',bars(aggregate(rows.filter(t=>t.mixed),'merchant'),'merchant'))+'</div>';
 }else if(view==='retail'){
  out+=retailerReport(rows);
 }else if(view==='travel'){
  out+='<p class="section-note">Travel includes recognizable travel merchants and charges assigned to the travel account. Purchases may support an entire department. These records do not identify individual travelers.</p>'+rankingControls();
  out+='<div class="boards">'+board('Travel merchants','Hotels, airfare, transport, and unclassified travel-account charges.',bars(merchants,'merchant'))+board('Travel through the year','Net recorded amounts by posting month.',timeline(rows),true)+'</div>';
 }else if(['centers','merchants'].includes(view)){
  const type={centers:'center',merchants:'merchant'}[view],gs={centers:centered,merchants}[view];
  out+=rankingControls()+(view==='centers'?'<p class="section-note">Names come from City budget books and budget-workshop records; year-specific labels are marked. Unconfirmed centers remain as codes. Split transactions are allocated by their actual accounting rows; a transaction can appear in more than one center’s count.</p>':'');
  out+=board(rankMetric==='count'?'Most purchase transactions':'Largest net amounts','Top positive groups · complete signed amounts in the table below.',bars(gs,type,12));out+=rankingTable(gs,type);

 }
 out+=`<section class="transactions"><div class="board-head" style="margin-top:30px"><div><h2>Explore transactions</h2><p class="sub">${number(rows.length)} matching records · largest amounts first · select a date for details</p></div></div>${table(rows)}</section>`;
 $('content').innerHTML=out;
 $('prev')?.addEventListener('click',()=>{page--;render()});$('next')?.addEventListener('click',()=>{page++;render()});
 if($('retailer-scope')){$('retailer-scope').value=retailerScope;$('retailer-scope').addEventListener('change',e=>{retailerScope=e.target.value;page=0;render()})}
 $('rank-metric')?.addEventListener('change',e=>{rankMetric=e.target.value;render()});
}
function openDetail(id){
 const t=data.transactions.find(t=>t.id===id);if(!t)return;
 $('detail-title').textContent='Purchase · '+exact(t.amount);
 $('detail-body').innerHTML=`<dl class="detail-grid"><div><dt>Merchant</dt><dd>${esc(t.merchant)}</dd></div><div><dt>Purchase date</dt><dd>${t.date}</dd></div><div><dt>Posted</dt><dd>${t.post}</dd></div><div><dt>Fiscal year</dt><dd>${t.fy}</dd></div></dl><h3>Spending allocation</h3><div class="table-wrap"><table><thead><tr><th>Fund</th><th>Cost center</th><th class="num">Amount</th></tr></thead><tbody>${t.allocations.map(a=>`<tr><td>${a.fund}</td><td>${esc(centerLabel(a.center))}</td><td class="num">${exact(a.amount)}</td></tr>`).join('')}</tbody></table></div><p class="fine">A purchase may support several City services. Employee identities are not included.</p>`;
 $('detail').showModal();
}
function download(filename,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function csvCell(v){let s=String(v??'');if(/^[=+@\-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
$('export').addEventListener('click',()=>{const head=['Transaction','Fiscal year','Purchase date','Post date','Merchant','Selected amount USD','Full amount USD','Travel classification'];const content=[head,...rows.map(t=>[t.id,t.fy,t.date,t.post,t.merchant,(t.scoped/100).toFixed(2),(t.amount/100).toFixed(2),t.travel])].map(r=>r.map(csvCell).join(',')).join('\r\n');download(`pcard-${view}-filtered.csv`,content,'text/csv')});
$('content').addEventListener('click',e=>{const detail=e.target.closest('[data-detail]');if(detail)openDetail(detail.dataset.detail);const filter=e.target.closest('[data-filter]');if(filter){$(filter.dataset.filter).value=filter.dataset.value;page=0;render();document.querySelector('.transactions')?.scrollIntoView({behavior:'instant'})}});
$('close-detail').addEventListener('click',()=>$('detail').close());
$('filters').addEventListener('submit',e=>e.preventDefault());
let timer;$('filters').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{page=0;render()},180)});
$('reset').addEventListener('click',()=>{retailerScope='all';HTMLFormElement.prototype.reset.call($('filters'));page=0;render()});
window.addEventListener('hashchange',()=>{page=0;rankMetric='spend';$('nav').classList.remove('open');document.querySelector('.mobile-menu').setAttribute('aria-expanded','false');render();window.scrollTo(0,0)});
document.querySelector('.mobile-menu').addEventListener('click',e=>{const open=$('nav').classList.toggle('open');e.target.setAttribute('aria-expanded',String(open))});
if(innerWidth<=600)document.querySelector('.filter-box').open=false;
function loadDataset(d){
 const strings=['id','fy','date','post','merchant','raw','category','source','sheet','travel'];
 if(!d||!Array.isArray(d.transactions)||!Array.isArray(d.staff)||!d.transactions.every(t=>t&&strings.every(k=>typeof t[k]==='string')&&Number.isFinite(t.amount)&&Array.isArray(t.allocations)&&t.allocations.every(a=>a&&['fund','center','account'].every(k=>typeof a[k]==='string'&&/^[\w .-]*$/.test(a[k]))&&Number.isFinite(a.amount))&&['comments','flags'].every(k=>Array.isArray(t[k])&&t[k].every(v=>typeof v==='string'))&&Array.isArray(t.rows)&&t.rows.every(Number.isInteger)&&/^[\w.-]+$/.test(t.id))||!d.staff.every(s=>s&&['name','source_url'].every(k=>typeof s[k]==='string')&&['title','email'].every(k=>s[k]===null||typeof s[k]==='string')&&Array.isArray(s.departments)&&s.departments.every(v=>typeof v==='string')&&/^https?:\/\//.test(s.source_url)))throw Error('Choose a valid Penny Ping app/data.json dataset.');
 data=d;page=0;HTMLFormElement.prototype.reset.call($('filters'));
 for(const [id,values,label] of [['fund',d.transactions.flatMap(t=>t.allocations.map(a=>a.fund)),'All funds'],['center',d.transactions.flatMap(t=>t.allocations.map(a=>a.center)),'All cost centers'],['merchant',d.transactions.map(t=>t.merchant),'All merchants']])fillSelect(id,values,label);
 $('loading').hidden=true;$('dataset-error').textContent='';$('export').disabled=false;render();
}
$('export').disabled=true;
$('dataset').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;
 try{const parsed=JSON.parse(await file.text());loadDataset(parsed)}catch{$('dataset-error').textContent='This file could not be opened. Choose a valid Penny Ping app/data.json dataset.'}
});
if(['localhost','127.0.0.1'].includes(location.hostname))fetch('./data.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(loadDataset).catch(()=>{});
