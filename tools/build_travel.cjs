// Reproducible publication builder for the reviewed, fixed historical dataset.
// New datasets must pass a fresh review; candidate scans never replace published memberships.
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const bytes=fs.readFileSync('docs/data.json'),data=JSON.parse(bytes),review=require('./reviewed-travel-changes.json');
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),review.sourceSha256,'Dataset changed: re-review travel baseline and memberships before publishing');
const snapshot=structuredClone(require('./fixtures/travel-reviewed-baseline-20261111.json'));
require('./apply_event_calendar.cjs').applyEventCalendar(data.transactions,snapshot.records);
require('./apply_reviewed_travel.cjs').applyReviewedTravel(data.transactions,snapshot.records);
fs.writeFileSync('docs/travel.json',JSON.stringify(snapshot));
console.log('Built '+Object.keys(snapshot.records).length+' reviewed travel records; source hashes and evidence validated.');
