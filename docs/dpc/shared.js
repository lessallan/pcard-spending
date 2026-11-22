document.getElementById('dpc-organization')?.addEventListener('change',e=>{if(e.target.value==='panama-city')location.assign(new URL('../review/?organization=panama-city#overview',new URL('./',document.querySelector('script[src*="shared.js"]').src)).href)});

// Keep column context when dense reports reflow into vertical records.
function labelReportTables(root = document) {
  const tables = root.matches?.('table') ? [root] : root.querySelectorAll('table');
  for (const table of tables) {
    const headings = [...table.querySelectorAll('thead th')].map(cell => cell.textContent.trim());
    table.classList.add('vertical-records');
    table.setAttribute('role', 'table');
    table.querySelectorAll('thead,tbody,tfoot').forEach(group => group.setAttribute('role', 'rowgroup'));
    table.querySelectorAll('tr').forEach(row => row.setAttribute('role', 'row'));
    table.querySelectorAll('thead th').forEach(cell => cell.setAttribute('role', 'columnheader'));
    table.querySelectorAll('tbody tr').forEach(row => [...row.cells].forEach((cell, index) => {
      cell.setAttribute('role', cell.tagName === 'TH' ? 'rowheader' : 'cell');
      cell.dataset.label = cell.colSpan > 1 ? '' : headings[index] || '';
    }));
  }
}
labelReportTables();
// Filter, pagination and vendor dialogs replace table rows without reloading.
new MutationObserver(records => {
  const tables = new Set();
  for (const record of records) {
    const table = record.target.closest?.('table');
    if (table) tables.add(table);
  }
  tables.forEach(table => labelReportTables(table));
}).observe(document.body, {childList:true, subtree:true});
