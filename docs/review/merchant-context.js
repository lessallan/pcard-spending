'use strict';
// Reviewed descriptions, not transaction classifications. Match only explicit aliases.
// Add an alias only after checking the source descriptor; never use fuzzy matching.
const merchantProfiles = [
 [['Amazon'],'Amazon','Online store and marketplace offering a broad range of products.','https://www.aboutamazon.com/what-we-do'],
 [["Lowe's"],"Lowe’s",'Home-improvement retailer selling tools, building supplies, appliances and garden products.','https://www.lowes.com/'],
 [['Home Depot'],'The Home Depot','Home-improvement retailer selling building materials, tools, electrical, plumbing and garden supplies.','https://www.homedepot.com/'],
 [['Harbor Freight'],'Harbor Freight','Retailer of tools, automotive equipment, hardware and safety supplies.','https://www.harborfreight.com/'],
 [['Walmart'],'Walmart','General retailer offering a wide range of merchandise in stores and online.','https://corporate.walmart.com/about'],
 [["Sam's Club"],'Sam’s Club','Membership retailer selling groceries, household goods, electronics and other merchandise.','https://www.samsclub.com/content/samsclub'],
 [['Publix'],'Publix','Supermarket offering groceries, bakery, deli and household products.','https://www.publix.com/products-services'],
 [['BOUND TREE MEDICAL LLC'],'Bound Tree Medical','Supplier of emergency medical equipment and consumables for first responders.','https://www.boundtree.com/'],
 [['HACH COMPANY'],'Hach','Supplier of water-analysis instruments, reagents and calibration standards.','https://info.hach.com/2506_Hach_LP_c-mult_Catalog-landing-page_NA-en_LP.html'],
 [['DETECTACHEM INC'],'DetectaChem','Supplier of drug and explosive detection products.','https://detectachem.com/'],
 [['TRAFFIC SAFETY WAREHOUSE'],'Traffic Safety Warehouse','Supplier of traffic-control, crowd-control and safety equipment.','https://www.trafficsafetywarehouse.com/default.asp'],
 [['DF SUPPLY'],'DF Supply','Supplier of fencing, gate openers and digging equipment.','https://dfsupplyinc.com/'],
 [['CITRUS DEPOT'],'Citrus Depot','Supplier of industrial citrus cleaners, degreasers and tar removers.','https://citrusdepot.net/'],
 [['QUADIENT INC ORACLE'],'Quadient','Provider of mailing equipment and supplies, including ink, labels and sealing solution.','https://www.quadient.com/en-us/ink-supplies'],
 [['TFS FISHER SCI ATL','TFS FISHERSCI ECOM ATL','TFS FISHERSCI ECOM CHI'],'Fisher Scientific','Supplier of laboratory equipment, chemicals, consumables and safety products.','https://www.fishersci.com/us/en/home.html?storeId=10652'],
 [['CRYSTAL TRACTOR','CRYSTAL TRACTOR AND EQUIP','SQ  CRYSTAL TRACTOR'],'Crystal Tractor & Equipment','Dealer offering agricultural equipment, parts and service.','https://www.crystaltractor.com/'],
 [['FLORIDA GOVERNMENT FIN'],'Florida Government Finance Officers Association','Professional association offering membership and events for government finance staff.','https://www.fgfoa.org/membership/']
].map(([aliases,name,description,url])=>({aliases,name,description,url,reviewed:'2026-11-09'}));
function merchantProfile(name){return merchantProfiles.find(p=>p.aliases.includes(name))||null}

// Extract source wording, never infer goods from merchant, role, amount or account.
// Retain whole note bodies (including mixed purchases and qualifications), deduplicate,
// and omit administrative-only or generic notes. Full originals remain in the dialog.
function purchaseNotes(comments=[]){
 const notes=[];const seen=new Set();
 for(const comment of comments){
  const bodies=comment.split(/\([^()]*?,\s*\d{1,2}\/\d{1,2}\/\d{2,4}\s+\d{1,2}:\d{2}\)/);
  for(const body of bodies){
   const text=body.replace(/^[\s;]+|[\s;]+$/g,'').trim();
   const key=text.toLowerCase().replace(/[\s.!;:]+$/g,'').replace(/\s+/g,' ');
   if(!key||seen.has(key)||/^[a-z]{1,3}$/i.test(key))continue;
   if(/^(?:(?:review(?:ed)?\s*(?:&|and)?\s*)?approved|complete[d]?|done|ok(?:ay)?|n\/?a|none|[a-z]{1,3}\s*[-:]?\s*approved)[.!\s]*$/i.test(text))continue;
   if(/^(?:(?:various|operating|miscellaneous|misc)\s+)?(?:supplies|items|parts)(?:\s*[-–]\s*.*|\s+for\s+.*)?$/i.test(key))continue;
   if(/^(?:please\b|approved\b|review(?:ed)?\b|completed\b|sign(?:ing|ed)? off\b|added (?:the |an? )?(?:itemized )?receipt\b|(?:itemized )?receipt (?:attached|added|uploaded|received|missing)\b)/i.test(text))continue;
   seen.add(key);notes.push(text);
  }
 }
 return notes;
}
if(typeof module!=='undefined')module.exports={merchantProfiles,merchantProfile,purchaseNotes};
