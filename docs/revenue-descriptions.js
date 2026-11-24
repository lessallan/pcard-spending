(async()=>{
const host=document.getElementById('expense-dashboard');if(!host)return;
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
try{const response=await fetch('revenue-descriptions.json');if(!response.ok)throw Error('Descriptions unavailable');const data=await response.json();
function add(){for(const card of host.querySelectorAll('[data-comparison-id]')){const id=card.dataset.comparisonId,entry=data.streams[id];if(!entry||card.querySelector('.revenue-stream-description'))continue;
const panel=card.querySelector('[id$="-spending-panel"]'),details=card.querySelector('[id$="-details-panel"]');if(!panel||!details)continue;
const description=el('p','revenue-stream-description',entry.text);panel.prepend(description);
const evidence=el('section','revenue-stream-evidence');evidence.append(el('h5','','Who sets this revenue?'),el('p','',entry.control),el('p','revenue-description-status',entry.status==='Explained'?'Reviewed November 24, 2026.':entry.status+' · reviewed November 24, 2026.'));
const list=el('ul');for(const source of entry.sources){const row=el('li'),link=el('a','',source.title);link.href=source.url;row.append(link);list.append(row)}evidence.append(list);details.prepend(evidence);
}}
new MutationObserver(add).observe(host,{childList:true,subtree:true});add();
}catch(error){console.error(error);const note=el('p','finance-note','Revenue descriptions could not load. Refresh to try again.');note.setAttribute('role','status');host.prepend(note)}
})();
