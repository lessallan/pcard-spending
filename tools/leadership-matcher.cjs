function createPeopleMatcher(transactions,leaders=[]){
 const aliases=new Map();
 const roster=leaders;
 const key=name=>{const p=name.replace(/,.*$/,'').trim().split(/\s+/);return (p[0]+' '+p.at(-1)).toLowerCase()};
 const canonical=new Map();for(const [name] of roster)if(!canonical.has(key(name)))canonical.set(key(name),name);
 const canonicalName=name=>canonical.get(key(name))||name;
 const add=(alias,name)=>{name=canonicalName(name);const key=alias.toLowerCase().replace(/\s+/g,' ').trim();if(!aliases.has(key))aliases.set(key,new Set());aliases.get(key).add(name)};
 for(const raw of new Set(transactions.map(t=>t.person))){
  if(!raw.includes(','))continue;
  const [surname,given]=raw.split(',').map(s=>s.trim()),first=given.split(/\s+/)[0];
  const title=s=>s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
  const name=raw==='JONES, BEAU J'?'Jared Jones':title(first+' '+surname);
  add(first+' '+surname,name);add(first[0]+'. '+surname,name);add(first[0]+' '+surname,name);
 }
 for(const [name] of roster){
  add(name,name);const parts=name.replace(/,.*$/,'').split(' ');add(parts[0]+' '+parts.at(-1),name);
  add(parts[0][0]+'. '+parts.at(-1),name);add(parts[0][0]+' '+parts.at(-1),name);
 }
 // Source-confirmed public names and explicit role-qualified aliases.
 for(const [name,aliasesForPerson] of [
  ['Brian Grainger',['Commissioner Grainger','Comm. Grainger','Comm Grainger']],
  ['Janice Lucas',['Commissioner Lucas','Comm. Lucas','Comm Lucas']],
  ['Josh Street',['Commissioner Street','Comm. Street','Comm Street']],
  ['Robbie Hughes',['Commissioner Hughes','Comm. Hughes','Comm Hughes']],
  ['Allan Branch',['Mayor Branch']],['Jared Jones',['J. Jones','Jared Jones']],
  ['Michael Fuller',['James Michael Fuller']],['Kristain Shaw',['K. Shaw']],
  // Explicit names in TXN00047915; people need not hold a card or a leadership role.
  ['Jonathan Hayes',['Jonthan Hayes']],
  ['Mike Burke',['Mike Burke']],
  ['Natalie McSwane',['Natalie McSwane','N. McSwane']],
  // Board membership source: panamacity.gov/AgendaCenter/ViewFile/Item/16495?fileID=35493
  ['Jan Lohse',['Jan Lohse','J. Lohse','J Lohse']],
  ['Priscilla Hagler',['Priscilla Hagler','P. Hagler','P Hagler']],
  // Explicit misspellings in the supplied notes, not general fuzzy matching.
  ['Shawn Selph',['S. Sleph','S Sleph','Shan Selph']],
  ['Matt DeVito, P.E.',['Matt Diveto']],
  ['Janette Smith',['Jan Smith']],
  // Published CRA staff: panamacity.gov/AgendaCenter/ViewFile/Item/16611?fileID=36068
  ['Joy Marler',['Joy Marler']],
  // Named attendees from TXN00054488, TXN00055452 and TXN00053704.
  // These names establish note mentions, not City employment.
  ...['Clair Williams','Mike Allen','Raymond Nolind','Ian Crelling','Bob Majka','Joel Schubert','Donald Hamm','Brandon Burg','Brandon Henderson','Ron Danzey','JP Ferreira','Cecile Scoon','Caroline Smith','Chris Forehand'].map(name=>[name,[name]])
 ])for(const alias of aliasesForPerson){aliases.set(alias.toLowerCase(),new Set([canonicalName(name)]))}
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const patterns=[...aliases].map(([alias,names])=>({pattern:new RegExp('\\b'+escape(alias).replace(/ /g,'\\s+')+'\\b','ig'),names:[...names]}));
 return t=>{
  const matches=new Map(),ambiguous=[];
  const bodies=(t.comments||[]).flatMap(c=>c.split(/\([^()]*?,\s*\d{1,2}\/\d{1,2}\/\d{2,4}\s+\d{1,2}:\d{2}\)/)).flatMap(c=>c.split(';')).map(c=>c.trim()).filter(c=>c&&!/^(?:approved|reviewed|sign(?:ing|ed)? off|please|completed|receipt attached)\b/i.test(c));
  for(const note of bodies)for(const {pattern,names} of patterns){
   pattern.lastIndex=0;
   for(const match of note.matchAll(pattern)){
    if(names.length!==1){ambiguous.push({text:match[0],evidence:note});continue}
    const name=names[0],prefix=note.slice(Math.max(0,match.index-45),match.index);
    const relationship=/(?:on behalf of|purchased for|bought for|ordered for|for)\s*(?:commissioner\s*)?$/i.test(prefix)?'For / on behalf of':'Named in purchase notes';
    if(!matches.has(name))matches.set(name,{name,relationship,evidence:note});
    else if(relationship==='For / on behalf of')matches.set(name,{name,relationship,evidence:note});
   }
  }
  return {people:[...matches.values()].sort((a,b)=>a.name.localeCompare(b.name)),ambiguous:[...new Map(ambiguous.map(x=>[x.text,x])).values()]};
 };
}

module.exports={createPeopleMatcher};
