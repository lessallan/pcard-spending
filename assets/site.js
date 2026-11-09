'use strict';
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
if (toggle && nav) {
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); toggle.focus();
    }
  });
}
const table = document.querySelector('#merchant-table');
if (table) {
  const rows = [...table.tBodies[0].rows];
  const search = document.querySelector('#search');
  const category = document.querySelector('#category');
  const sort = document.querySelector('#sort');
  const normalize = text => text.toLowerCase().replace(/[’‘]/g, "'");
  const dollars = new Intl.NumberFormat('en-US', {style:'currency', currency:'USD'});
  function update() {
    const query = normalize(search.value.trim());
    const ordered = [...rows].sort((a,b) => sort.value === 'name' ? a.dataset.merchant.localeCompare(b.dataset.merchant) : Number(b.dataset[sort.value])-Number(a.dataset[sort.value]));
    let count = 0, cents = 0;
    for (const row of ordered) {
      row.hidden = !normalize(row.dataset.merchant).includes(query) || (category.value !== '' && row.dataset.category !== category.value);
      if (!row.hidden) { count++; cents += Math.round(Number(row.dataset.net)*100); }
      table.tBodies[0].append(row);
    }
    document.querySelector('#result-count').textContent = `${count} of ${rows.length} merchants · ${dollars.format(cents/100)} combined net spending`;
    document.querySelector('.empty').hidden = count !== 0;
  }
  document.querySelector('.filters').hidden = false;
  search.addEventListener('input',update); category.addEventListener('change',update); sort.addEventListener('change',update);
  document.querySelector('.reset').addEventListener('click',()=>{search.value=''; category.value=''; sort.value='net'; update(); search.focus();});
}
