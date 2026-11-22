(() => {
  const host = document.getElementById('department-explorer');
  if (!host) return;
  const money = value => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}).format(value);
  const percent = value => new Intl.NumberFormat('en-US', {style:'percent', maximumFractionDigits:1}).format(value);
  const make = (tag, className, text) => {const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
  const state = new Map();
  let data, fund, expanded=false;
  const status=host.querySelector('[data-status]'), controls=host.querySelector('[data-controls]'), fundSelect=host.querySelector('#department-fund'), search=host.querySelector('#department-search'), list=host.querySelector('[data-rows]'), more=host.querySelector('[data-more]');
  function selected() {return state.get(fund.id);}
  function totals() {
    const sum=fund.accounts.filter(a=>selected().has(a.id)).reduce((n,a)=>n+a.amount,0);
    host.querySelector('[data-selected]').textContent=money(sum);
    host.querySelector('[data-share]').textContent=`${percent(sum/fund.total)} of ${money(fund.total)} in ${fund.name}`;
    host.querySelector('[data-count]').textContent=`${selected().size} of ${fund.accounts.length} departments and programs selected`;
    host.querySelector('[data-meter]').style.width=`${sum/fund.total*100}%`;
    for(const row of list.children) row.classList.toggle('is-excluded', !selected().has(row.dataset.account));
  }
  function render() {
    list.replaceChildren();
    const query=search.value.trim().toLocaleLowerCase();
    const matches=fund.accounts.filter(a=>`${a.name} ${a.id}`.toLocaleLowerCase().includes(query)).sort((a,b)=>b.amount-a.amount || a.name.localeCompare(b.name));
    const shown=expanded||query?matches:matches.slice(0,8);
    for(const a of shown) {
      const row=make('li','department-row');row.dataset.account=a.id;
      const label=make('label','department-choice'), checkbox=make('input');checkbox.type='checkbox';checkbox.checked=selected().has(a.id);checkbox.value=a.id;
      const body=make('span','department-row-body'), line=make('span','department-line');
      line.append(make('span','department-name',a.name),make('strong','money',money(a.amount)));
      const meta=make('span','department-meta',`${a.id==='fund'?'Fund-wide cost':'Account '+a.id} · ${percent(a.amount/fund.total)} of this fund`);
      const bar=make('span','department-bar'), fill=make('span');bar.setAttribute('aria-hidden','true');fill.style.width=`${a.amount/fund.total*100}%`;bar.append(fill);
      body.append(line,meta,bar);label.append(checkbox,body);row.append(label);
      const source=make('a','department-source',`Budget p. ${a.page-2}`);source.href=`${data.sourceUrl}#page=${a.page}`;source.setAttribute('aria-label',`${a.name}: source budget page ${a.page-2}`);row.append(source);
      checkbox.addEventListener('change',()=>{checkbox.checked?selected().add(a.id):selected().delete(a.id);totals();});list.append(row);
    }
    host.querySelector('[data-empty]').hidden=matches.length!==0;
    more.hidden=!!query || matches.length<=8;more.textContent=expanded?'Show fewer departments':`Show all ${matches.length} departments and programs`;more.setAttribute('aria-expanded',String(expanded));
    host.querySelector('[data-fund-note]').textContent=fund.fundOnly?'This fund reports its costs fund-wide; the adopted budget does not provide a department allocation.':'Department and program accounts are shown as listed in the adopted budget, including non-departmental costs.';
    totals();
  }
  function chooseFund(){fund=data.funds.find(f=>f.id===fundSelect.value);if(!state.has(fund.id))state.set(fund.id,new Set(fund.accounts.map(a=>a.id)));search.value='';expanded=false;render();}
  fundSelect.addEventListener('change',chooseFund);search.addEventListener('input',render);more.addEventListener('click',()=>{expanded=!expanded;render();});
  host.querySelector('[data-all]').addEventListener('click',()=>{state.set(fund.id,new Set(fund.accounts.map(a=>a.id)));render();});
  host.querySelector('[data-none]').addEventListener('click',()=>{state.set(fund.id,new Set());render();});
  async function load(){
    status.textContent='Loading department budgets…';
    try {
      const response=await fetch('./department-budget.json');if(!response.ok)throw new Error('Budget unavailable');data=await response.json();
      if(!Array.isArray(data.funds)||!data.funds.length||data.funds.some(f=>f.total<=0||f.accounts.reduce((n,a)=>n+a.amount,0)!==f.total))throw new Error('Budget totals do not match');
      fundSelect.replaceChildren(...data.funds.map(f=>{const o=make('option','',`${f.id} · ${f.name}`);o.value=f.id;return o;}));fundSelect.value='001';chooseFund();status.hidden=true;controls.hidden=false;
    }catch(error){status.replaceChildren(document.createTextNode('Department budgets could not load. '));const retry=make('button','','Try again');retry.type='button';retry.addEventListener('click',load);status.append(retry);}
  }
  load();
})();
