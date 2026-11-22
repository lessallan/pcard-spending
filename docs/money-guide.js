// Keep incoming links useful even when their evidence starts collapsed.
function revealTopic() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  if (!target) return;
  if (target.tagName === 'DETAILS') target.open = true;
  for (let parent = target.parentElement; parent; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
  requestAnimationFrame(() => target.scrollIntoView({block:'start',behavior:'instant'}));
}
window.addEventListener('hashchange', revealTopic);
if (location.hash) revealTopic();
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link && link.hash === location.hash) revealTopic();
});
// Mobile records retain their column labels, including totals in table footers.
document.querySelectorAll('.topic table').forEach(table => {
  const headers = [...table.querySelectorAll('thead th')].map(cell => cell.textContent.trim());
  table.setAttribute('role','table');
  table.querySelectorAll('thead,tbody,tfoot').forEach(group=>group.setAttribute('role','rowgroup'));
  table.querySelectorAll('tr').forEach(row=>row.setAttribute('role','row'));
  table.querySelectorAll('thead th').forEach(cell=>cell.setAttribute('role','columnheader'));
  table.querySelectorAll('tbody tr,tfoot tr').forEach(row => {
    let column = 0;
    [...row.cells].forEach(cell => {
      cell.setAttribute('role',cell.tagName==='TH'?'rowheader':'cell');
      if (cell.tagName === 'TD' && !cell.dataset.label) cell.dataset.label = headers[column] || '';
      column += cell.colSpan;
    });
  });
});
