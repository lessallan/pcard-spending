const travelResearch=require('./travel-research-catalog.cjs');
const reviewedTripById=new Map((travelResearch.reviewedGroups||[]).flatMap(g=>g.ids.map(id=>[id,g])));
function displayName(s){return s||'Unknown traveler'}
function tripDestination(t){return transactionTravelAnalysis(t).destinations[0]||null}
function namedTripDestination(t){
 const c=tripComment(t),raw=t.raw||'';
 if(/\b(?:DC|D\.C\.)\s+(?:trip|rental|metrorail)|\btrip\s+(?:to\s+)?(?:DC|D\.C\.)\b/i.test(c))return 'Washington, DC';
 if(!/greenville\s*,?\s*NC\b/i.test(c)&&(/\bgreenville\s*,?\s*SC\b|\bSC\s+Greenville\b/i.test(c)||/^(?:GREENVILLE PARKINGPOINSET|THE WESTIN POINSETT)$/i.test(raw)))return 'Greenville, SC';
 return null;
}
function tripClue(t){
 const text=tripComment(t);
 if(travelNonTrip(t))return null;
 const reviewed=reviewedTripById.get(t.id);
 if(reviewed)return {name:reviewed.name,days:0,reason:reviewed.reason};
 const related=travelResearch.related[t.id];
 if(related)return {name:related.name,days:240,reason:related.text};
 const researched=researchedEvents(t);
 if(researched.length===1)return {name:researched[0].name,days:240,reason:'Event wording and purchase timing suggest this published edition; see transaction evidence. Attendance and travel dates remain unverified.'};
 const events=[['APWA — event unspecified',/\bAPWA\b/i],['Brownfields Conference',/brownfields?/i],['Strong Towns',/strong\s*towns?/i],['GovOS Conference',/GovOS/i],['FBC-LEO',/FBC[ -]?LEO/i],['FRA — course / event unspecified',/\bFRA\b|Florida redevelopment/i],['FCCMA — training / event unspecified',/\bFCCMA\b/i],['Trimble — event unspecified',/trimble/i],['Cityworks — event unspecified',/city\s*works/i],['New World — event unspecified',/new world/i],['HR Florida',/HR\s*FL|HRFL|SHRM/i],['Florida Housing Coalition',/housing.*conf/i],['FPL Symposium',/FPL.*symposium/i],['Chief’s Conference',/\bchief[’\x27]?s?\s+conference\b/i],['IEMO II',/\bIEMO\s*(?:II|2)\b/i],['IEMO',/\bIEMO\b/i],['NLC Congressional City Conference',/\bNLC\s+(?:CCC|cong(?:ressional)?\b)/i],['NLC City Summit',/\bcity summitt?\b/i],['NLC — event unspecified',/\bNLC\b/i],['FGCU budget training',/\bFGCU\b|budget training/i],['FGFOA',/\bFGFOA\b/i],['FLC Leadership',/\bFLC\s+Leadership\b/i],['FLC Policy Committee',/\bFLC\s+Policy Committee\b/i],['FLC Annual Conference',/\bFLC\s+annual\s+conference\b/i],['FLC — event unspecified',/\bFLC\b|Florida League of Cities/i],['SHRUG',/\bSHRUG\b/i]];
 const found=events.find(([,pattern])=>pattern.test(text));
 if(found){const broad=/unspecified|^HR Florida$|^FPL Symposium$|^FRA|^APWA/.test(found[0]);return {name:found[0],days:broad?21:120,reason:'Shared event wording and people in comments; purchases within '+(broad?21:120)+' days of the first charge. Broad organization references use a shorter window to avoid combining separate meetings. Attendance remains unverified.'};}
 const topic=(travelResearch.sourceTopics||[]).find(x=>new RegExp(x.pattern,'i').test((t.raw||'')+' '+text));
 if(topic)return {name:topic.name,days:topic.days,reason:'Specific event or purpose wording in source notes; destination and actual travel dates require separate evidence.'};
 const named=namedTripDestination(t);
 if(named)return {name:named+' trip',days:named==='Washington, DC'?35:21,reason:'Explicit trip wording or specific Greenville property, matching traveler and bounded purchase window; inferred association, not confirmed attendance.'};
 const city=text.match(/\b([A-Z][a-z]+(?: [A-Z][a-z]+){0,2}),\s*(FL|MA|GA|DC|NV|TX|NY)\b/);
 if(city&&(t.travel&&t.travel!=='Not identified as travel'||/\b(?:travel|training|conference|lodging|hotel|flight)\b/i.test(text)))return {name:city[0],days:21,reason:'Shared destination wording and cardholder; purchases within 21 days of the first charge. Separate visits may be mixed.'};
 const hotel=tripDestination(t);if(hotel)return {name:hotel+' (hotel clue)',days:21,reason:'Location clue in merchant or comments; purchases within 21 days. Separate stays may be mixed.'};
 return null;
}
function suggestedTrips(transactions,peopleFor=t=>[t.person]){
 const groups=[],assigned=new Map();
 const records=transactions.map(t=>({t,clue:tripClue(t),names:peopleFor(t),range:tripDateRange(t)})).filter(r=>r.clue&&!reviewedTripById.has(r.t.id));
 // Resolve generic FLC wording only if exactly one nearby specific event matches a named person.
 for(const r of records){
  if(r.clue.name!=='FLC — event unspecified'||!r.names.length)continue;
  const events=[...new Set(records.filter(x=>/^FLC (Annual Conference(?: 20\d{2})?|Leadership(?: March 2025)?|Policy Committee)$/.test(x.clue.name)&&x.names.some(n=>r.names.includes(n))&&Math.abs(Date.parse(x.t.date)-Date.parse(r.t.date))<=120*86400000).map(x=>x.clue.name))];
  if(events.length===1)r.clue={...r.clue,name:events[0],reason:'FLC wording and named people match one specific nearby event in the notes; association is estimated.'};
 }
 // Attach undated purchases only to one matching recorded itinerary near its dates.
 // Candidate ranges are captured first so inferred attachments cannot create further links.
 const dated=records.filter(r=>r.range);
 for(const r of records.filter(r=>!r.range&&r.names.length)){
  const candidates=dated.filter(x=>x.clue.name===r.clue.name&&x.names.some(n=>r.names.includes(n))&&Date.parse(r.t.date)>=Date.parse(x.range.start)-3*86400000&&Date.parse(r.t.date)<=Date.parse(x.range.end)+3*86400000);
  const ranges=[...new Set(candidates.map(x=>x.range.start+'/'+x.range.end))];
  if(ranges.length===1){r.range=candidates[0].range;r.clue={...r.clue,reason:'Inferred from matching trip clue and traveler, with purchase within three days of recorded travel dates. Supporting records: '+candidates.map(x=>x.t.id).join(', ')+'.'};}
 }
 for(const {t,clue,names,range} of records.sort((a,b)=>a.t.date.localeCompare(b.t.date)||a.t.id.localeCompare(b.t.id))){
  const dateKey=range?range.start+'/'+range.end:null;
  const candidates=groups.filter(g=>g.clue===clue.name&&
   (names.length?g.names.some(n=>names.includes(n)):!g.names.length&&g.person===t.person)&&
   (dateKey&&g.dateKey?dateKey===g.dateKey:!dateKey&&!g.dateKey&&Math.abs(Date.parse(t.date)-Date.parse(g.start))<=clue.days*86400000));
  let g=candidates.length===1?candidates[0]:null;
  if(!g){g={person:t.person,names:[...names],dateKey,clue:clue.name,start:t.date,label:`${clue.name} · ${names.join(', ')||'Traveler unknown; cardholder '+displayName(t.person)}${dateKey?' · stay '+dateKey:''} · purchases from ${t.date} · ${t.id}`,reason:clue.reason};groups.push(g)}
  else g.names=[...new Set([...g.names,...names])];
  assigned.set(t.id,g);
 }
 // Reviewed ID lists may connect advance bookings, cross-card payments and later refunds.
 // Never add a non-member merely because it is nearby or uses the same merchant.
 const byId=new Map(transactions.map(t=>[t.id,t]));
 for(const reviewed of travelResearch.reviewedGroups||[]){
  const members=reviewed.ids.map(id=>byId.get(id)).filter(t=>t&&!travelNonTrip(t));
  // A partial dataset must contain every supporting record before applying the association.
  if(!members.length||!reviewed.evidenceIds.every(id=>byId.has(id)))continue;
  const names=[...new Set(members.flatMap(peopleFor))];
  const g={clue:reviewed.name,names,start:members.map(t=>t.date).sort()[0],label:reviewed.name+' · reviewed '+reviewed.key,reason:'Reviewed suggested association: '+reviewed.reason+' Supporting records: '+reviewed.evidenceIds.join(', ')+'.'};
  for(const t of members)assigned.set(t.id,g);
 }
 return assigned;
}
function tripComment(t){return (t.comments||[]).join(' ').replace(/\([^)]*\d{1,2}\/\d{1,2}\/\d{2}[^)]*\)/g,' ')}
function tripDateRange(t){
 const months={JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12};
 const text=tripComment(t).replace(/\b(\d{1,2})[- ]*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:[a-z]*)\s*(\d{4}|\d{2})?\b/gi,(_,d,m,y)=>months[m.toUpperCase()]+'/'+d+(y?'/'+y:''))
 .replace(/\b(\d{1,2})\.(\d{1,2})\.(\d{4}|\d{2})\b/g,'$1/$2/$3').replace(/[-–]\.(?=\d)/g,'-'),ranges=[];
 const pattern=/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{4}|\d{2}))?\s*[-–]\s*(\d{1,2})\/(\d{1,2})(?:\/(\d{4}|\d{2})|,\s*(\d{4}))?\b/g;
 const year=v=>v?(+v<100?2000+(+v):+v):null;
 const iso=(y,m,d)=>{const x=new Date(Date.UTC(y,m-1,d));return x.getUTCFullYear()===y&&x.getUTCMonth()===m-1&&x.getUTCDate()===d?x.toISOString().slice(0,10):null};
 for(const m of text.matchAll(pattern)){
  let y1=year(m[3]),y2=year(m[6]||m[7]);const inferred=!y1&&!y2;
  y1=y1||y2||+t.date.slice(0,4);y2=y2||y1;
  if(+m[4]<+m[1]&&!m[6]&&!m[7])y2++;
  const start=iso(y1,+m[1],+m[2]),end=iso(y2,+m[4],+m[5]);
  if(!start||!end)continue;
  const days=(Date.parse(end)-Date.parse(start))/86400000+1;
  if(days>0&&days<=60)ranges.push({start,end,days,inferred});
 }
 const unique=[...new Map(ranges.map(r=>[r.start+'/'+r.end,r])).values()];
 return unique.length===1?unique[0]:null;
}
function travelNonTrip(t){
 if(travelResearch.nonTrip[t.id])return travelResearch.nonTrip[t.id].kind;
 const c=tripComment(t);
 if(/conference\s+room|conference\s+(?:table|microphone)/i.test(c)&&!/(?:flight|lodging|travel|hotel stay)/i.test(c))return 'Office / conference-room purchase';
 if(/\b(?:membership|dues)\b/i.test(c)&&!/conference|registration|training|hotel|flight/i.test(c))return 'Membership dues';
 if(/fraudulent activity|disputed charge|charge never (?:made|happened)|purchased in error/i.test(c))return 'Disputed / erroneous charge';
 if(/job posting/i.test(c))return 'Recruitment / job posting';
 if(/yearly renewal/i.test(c)&&/APWA/i.test(t.raw+' '+c))return 'Membership renewal';
 if(/office supplies|civil service supplies|training books/i.test(c))return 'Office / training materials';
 if(/hotel emergency access door/i.test(c))return 'Equipment / supplies';
 return null;
}
function researchedEvents(t){
 const text=(t.raw||'')+' '+tripComment(t);
 if(/\bOpal\b/i.test(text)&&/HR\s*FL/i.test(text))return [];
 if(travelNonTrip(t)||/Gettysburg|school of|school of finance|SOGF|board training|infrastructure|capt?ital project|\bFRA\b.*course/i.test(text)){
  if(!/FGFOA.*(?:school|SOGF)/i.test(text))return [];
 }
 const explicitYears=[...text.matchAll(/\b20(?:24|25|26|27)\b/g)].map(m=>m[0]);
 return travelResearch.events.filter(e=>{
  if(!new RegExp(e.pattern,'i').test(text))return false;
  if(e.name.startsWith('FGFOA Annual')&&/school|SOGF/i.test(text))return false;
  if(e.name.startsWith('FBC-LEO')&&/breakfast/i.test(text))return false;
  if(e.name.startsWith('FLC Annual')&&/leadership|policy committee/i.test(text))return false;
  if(e.name.startsWith('FPCA Summer')&&(/future|mid.?winter/i.test(text)||!/^LOEWS HOTELS$/i.test(t.raw||'')))return false;
  if(e.name.startsWith('FSA Winter')&&/summer|annual/i.test(text))return false;
  const year=e.start.slice(0,4);
  if(explicitYears.length&&!explicitYears.includes(year))return false;
  const days=(Date.parse(t.date)-Date.parse(e.start))/86400000;
  // Timing suggests an edition, never proves it; older registrations and late credits stay unresolved.
  return days>=-240&&days<=45;
 }).map(e=>({...e,editionBasis:explicitYears.includes(e.start.slice(0,4))?'Year appears in source text':'Edition inferred from purchase timing; verify registration'}));
}
function travelPurpose(t){
 const raw=t.raw||'',c=tripComment(t),text=raw+' '+c,non=travelNonTrip(t);
 if(non)return {kind:non,clue:c};
 const rules=[
 ['Membership and conference — allocation unknown',/memberships? and conference/i],
 ['Training materials',/training books/i],
 ['Conference merchandise',/sweater from .*conf/i],
 ['Lodging and tuition — allocation unknown',/tuition.*lodging|lodging.*tuition/i],
 ['Booking / cancellation fee',/booking fee|service fee|cancelation service fee|cancellation fee|hotelbooking servfee/i],
 ['Travel insurance',/allianz|agaserviceco|travel guard|travel insurance|trip protection|lodging ins|rental (?:car )?protection|car rental protection/i],
 ['Tolls',/\btolls?\b|sunpass|etoll|eractoll|cfx\s+ves/i],
 ['Parking',/parking|parkmobile|hilton lot|garage daily|laz pkg/i],
 ['Airline baggage fee',/baggage|checked bag|\bbag fee\b|excs_bag|\bbags\b/i],
 ['Airline seat / upgrade fee',/seat fee|seat change|preferred (?:seat|cabin)|upgrade|upsell/i],
 ['Rental-car fuel',/fuel for (?:a )?rental|rental car (?:gas|fuel)|gas (?:of|for) rental/i],
 ['Business printing',/printing business center/i],
 ['Meals / refreshments',/\bdinner\b|breakfast|meal plan|\bfood\b|\blunch\b|starbucks|shipley.s tavern|trigo.*deli|subway|taco bell|mcdonald/i],
 ['Ground transportation',/\blyft\b|\buber(?!\s*eats)\b|\bUVC Ride\b|\btaxi\b|metrorail|\bCMT CHICAGO\b/i],
 ['Car rental',/enterprise rent|avis|hertz|budget.*(?:car|prepay)|car rental|rental car/i],
 ['Lodging / hotel-related charge',/\blodging\b|\bloding\b|\bsuites\b|quality inn|renaissance|delta stays|airbnb|embassy|courtyard|residence inn|springhill|staybridge|fairfield|drury|comfort inns|best western|la quinta|homewood|homes to suites|four points|loews|marriott|marriot|hotel|sheraton|hyatt|hampton|hilton|moxy|\bfolio\b|venetian|palazzo|linq front|oglebay|sandestin|hutchinson shores|rosen/i],
 ['Airfare',/delta|american air|southwes|united\s+\d|spirit air|breeze air|flight|airfare/i],
 ['Event registration / fees',/registration|\breg\b|tuition|conference fees|conference (?:admission|fee)|conf(?:erence)?[^;.]*admission|trimble (?:dimensions|innovate)|^EP\s+2026 STRONG TOWNS/i],
 ['Vehicle fuel',/\bfuel\b|\bgas\b|shell oil|exxon|chevron|sunoco|marathon|murphy usa|racetrac|circle k|flying j|pilot_|love.s|cefco|buc-ee/i]
 ];
 const organizer=/national le|florida league|florida government fin|government finance off|florida city and count|florida redevelopment|florida housing|^IACP$|^ICMA ONLINE$|APWA|FASRO|FRMA|police chiefs|police foundation|WCI CONFERENCE|FPL|gulf power|CVENT|HR FLORIDA|SHRM|SOCIETYFORHUMAN|RURAL WATER|SWANA|PRIMA|FUFC|FAPAONLINE|ASPHALT CONTRACTORS|EVENT MANAGERS|FIRECODEACDMY|NIC -DFS|IAWRP/i.test(raw);
 if(organizer&&/conf|event|meeting|mtg|course|class|training|certification|symposium|leadership|\bCCC\b|reception/i.test(text))rules.push(['Event / training / association charge',/conf|event|meeting|mtg|course|class|training|certification|symposium|leadership|\bCCC\b|reception/i]);
 const match=rules.find(([,re])=>re.test(text));
 let kind=match?match[0]:'Purpose not identified',clue=match?text.match(match[1])[0]:'';
 if(!match&&t.travel&& !/unclassified|Not identified/.test(t.travel)){kind=t.travel;clue='Existing merchant/account classification; itemized purpose unverified';}
 // A generic reference to another travel service in the comment must not override the merchant.
 const hotelRule=rules.find(([label])=>label==='Lodging / hotel-related charge');
 if(hotelRule[1].test(raw)&&['Car rental','Airfare','Event registration / fees'].includes(kind)){kind=hotelRule[0];clue=raw.match(hotelRule[1])[0];}
 const adjustments=[];
 if(t.amount<0)adjustments.push('Credit / refund recorded');
 else if(/refund|credit|cancelled|canceled/i.test(c))adjustments.push('Refund / cancellation mentioned; this record is a positive charge');
 if(/deposit|initial hold|advance deposit|reservation/i.test(c)&&t.amount>=0)adjustments.push('Advance booking / deposit mentioned; purchase date is not stay date');
 return {kind,clue,adjustments};
}
function travelLocationClues(t){
 const raw=t.raw||'',comment=tripComment(t),text=raw+' '+comment,clues=[];
 const add=(city,note,url)=>clues.push({city,text:note,url});
 if(travelNonTrip(t))return clues;
 const h=travelResearch.hotels.find(h=>new RegExp(h.pattern,'i').test(raw));
 if(h)add(h.city,'Probable property match: '+h.name+'.',h.url);
 // Specific city names and documented abbreviations. No geolocation from generic chain names.
 const cities=[['Crestview, FL',/\bCrestview\s+FL\b/i],['Lake City, FL',/\bLake City\s+FL\b/i],['Orange Beach, AL',/\bOrange Beach,?\s*Al\b/i],['Orlando',/\borlando\b/i],['Tampa',/\btampa\b/i],['Atlanta',/\batlanta\b/i],['Boston',/\bboston\b/i],['Chicago',/\bchicago\b/i],['Denver',/\bdenver\b/i],['Salt Lake City',/salt lake city/i],['Jacksonville',/jacksonv/i],['Miami',/\bmiami\b/i],['West Palm Beach, FL',/west pl?am beach|west palm|\bw palm beach/i],['Fort Myers, FL',/fort myers|ft\.? myers|fort mye/i],['St. Augustine, FL',/st\.? augustin/i],['Daytona Beach, FL',/daytona|hard rock hotel dayton/i],['Pensacola',/pensacol/i],['Tallahassee',/tallahasse|hilton tall\b/i],['Gainesville, FL',/gainesville|gainsville/i],['Houston, TX',/housto/i],['New Orleans, LA',/new orleans/i],['Indianapolis, IN',/indianapolis/i],['Sarasota, FL',/sarasota/i],['Ocala, FL',/\bocala\b/i],['Gettysburg, PA',/gettysburg/i],['Fort Pierce, FL',/fort pierce/i],['Fayetteville, NC',/fayetteville\s*,?\s*NC\b/i],['Greenville, SC',/green(?:s)?ville\s*,?\s*SC\b|\bSC\s+Greenville\b/i],['Greenville, NC',/greenville\s*,?\s*NC\b/i],['Austin, TX',/\baustin\b/i],['Palmetto, FL',/palmetto\s*,?\s*FL/i],['Kissimmee, FL',/kissimmee/i],['Las Vegas, NV',/\b(?:las )?vegas\b/i],['Panama City, FL',/panama city\s*,?\s*FL|^hotel indigo panama/i]];
 const isTravel=!!(t.travel&&t.travel!=='Not identified as travel')||travelPurpose(t).kind!=='Purpose not identified'||/conference|training|trip|travel|class/i.test(comment);
 if(isTravel)for(const [city,re] of cities)if(re.test(h?comment:text))add(city,'Location wording: “'+(h?comment:text).match(re)[0]+'”; may describe a stop, origin, or destination.');
 // City/state pairs with punctuation, initials and reviewer metadata removed upstream.
 const pairs=comment.matchAll(/\b([A-Z][a-z]+(?:[ .]+[A-Z][a-z]+){0,2}),\s*(AL|AR|CA|CO|DC|FL|GA|IL|IN|LA|MA|NC|NJ|NV|NY|PA|SC|TN|TX|UT|VA|WV)\b/g);
 if(isTravel)for(const m of pairs)add(m[1]+', '+m[2],'City/state explicitly recorded: '+m[0]+'.');
 return clues;
}

// Reviewed property matches: abbreviated descriptors remain probable matches, not receipts.
const tripHotels=[
 {pattern:/marriott marquis wash/i,city:'Washington, DC',name:'Marriott Marquis Washington, DC',url:'https://www.marriott.com/en-us/hotels/wasco-marriott-marquis-washington-dc/overview/'},
 {pattern:/marriott dt city creek/i,city:'Salt Lake City',name:'Salt Lake Marriott Downtown at City Creek',url:'https://www.marriott.com/en-us/hotels/slcut-salt-lake-marriott-downtown-at-city-creek/overview/'}
];
function transactionTravelAnalysis(t){
 const raw=t.raw||'',comment=tripComment(t),text=raw+' '+comment,evidence=[];
 const purpose=travelPurpose(t),kind=purpose.kind;
 if(purpose.clue)evidence.push({text:'Purpose clue: “'+purpose.clue+'”.'});
 for(const note of purpose.adjustments||[])evidence.push({text:note});
 const match=kind!=='Purpose not identified';
 const destinations=[];
 const add=(city,text,url)=>{destinations.push(city);evidence.push({text,url});};
 const reviewed=reviewedTripById.get(t.id);
 if(reviewed){const note='Reviewed suggested association: '+reviewed.reason+' Supporting records: '+reviewed.evidenceIds.join(', ')+'.';if(reviewed.city)add(reviewed.city,note);else evidence.push({text:note});}
 for(const hint of travelResearch.vendorEvidence||[])if(new RegExp(hint.pattern,'i').test(raw))evidence.push({text:hint.text+' Supporting records: '+hint.ids.join(', ')+'.'});
 if(travelResearch.notes[t.id])evidence.push({text:travelResearch.notes[t.id]});
 if(travelResearch.nonTrip[t.id])evidence.push(travelResearch.nonTrip[t.id]);
 if(travelNonTrip(t))return {kind,destinations:[],evidence,events:[]};
 const related=travelResearch.related[t.id];
 if(related)add(related.city,related.text,related.url);
 const named=namedTripDestination(t);if(named)add(named,'Trip association clue: destination explicitly named in notes or a specific Greenville property descriptor.');
 if(/^LAZ PARKING M06316WC$/i.test(raw))evidence.push({text:'Probable ECP airport parking: exact descriptor also appears on TXN00045361 and TXN00058093 with explicit ECP parking notes. This identifies an airport service, not the destination or a shared trip across cardholders.',url:'https://www.iflybeaches.com/airport-info/parking'});
 if(t.tripReason)evidence.push({text:t.tripReason});
 const researched=researchedEvents(t);
 for(const clue of travelLocationClues(t))add(clue.city,clue.text,clue.url);
 for(const event of researched)add(event.city,'Possible event: '+event.name+' · '+event.city+' · '+(event.dateNote||('Published dates '+event.start+' to '+event.end))+'. '+event.editionBasis+'. Event dates do not establish travel dates.',event.url);
 if(/^hotel indigo panama/i.test(raw))evidence.push({text:'Local Panama City lodging; notes may concern visiting instructors or assessors. Do not treat this as an employee trip away.'});
 const property=tripHotels.find(h=>h.pattern.test(raw));
 if(property)add(property.city,'Probable property match: '+raw+' → '+property.name+'.',property.url);
 if(/\bWashington,?\s*D\.?C\.?|\bWA DC\b|\(DC\)/i.test(text))add('Washington, DC','Washington, DC is named or abbreviated in the merchant / comments.');
 const lodging=/four points|loews|hotel|suites|sheraton|marriott|hyatt|hampton|hilton|marquis|resort|moxy/i.test(raw);
 if(lodging&&!travelResearch.hotels.some(h=>new RegExp(h.pattern,'i').test(raw)))for(const city of ['Salt Lake City','Boston','Chicago','Denver','Orlando','Atlanta','Tampa','Jacksonville','Tallahassee','Pensacola','Miami'])if(raw.toLowerCase().includes(city.toLowerCase())||(city==='Tallahassee'&&/tallahasse/i.test(raw)))add(city,'Hotel descriptor names '+city+'.');
 if(/\bNLC\s+(?:CCC|cong(?:ressional)?\b)/i.test(comment))add('Washington, DC','Event clue: NLC Congressional City Conference is held in Washington, DC; this does not establish attendance.','https://www.nlc.org/resource/building-a-strong-economy-together-conversations-from-congressional-city-conference/');
 if(/\bcity summitt?\b/i.test(comment)&&/\bNLC\s+(?:CCC|cong(?:ressional)?\b)/i.test(comment))evidence.push({text:'Conflicting event names: City Summit and Congressional conference both appear. Review the source.'});
 if(!destinations.length)evidence.push({text:'Destination unresolved: need a hotel address, event edition, receipt, or itinerary.'});
 if(kind==='Purpose not identified')evidence.push({text:'Purchase purpose unresolved: merchant and comments do not identify the item or service.'});
 return {kind,destinations:[...new Set(destinations.map(normalizeTripCity))],evidence,events:researched};
}
function normalizeTripCity(city){const m={'Tampa, FL':'Tampa','Orlando, FL':'Orlando','Tallahassee, FL':'Tallahassee','Pensacola, FL':'Pensacola','Miami, FL':'Miami','Chicago, IL':'Chicago','Denver, CO':'Denver','Atlanta, GA':'Atlanta','Boston, MA':'Boston','Salt Lake City, UT':'Salt Lake City','Jacksonville, FL':'Jacksonville'};return m[city]||city;}

module.exports={tripClue,tripDateRange,transactionTravelAnalysis,travelNonTrip,suggestedTrips};
