# Merchant and trip research

## Evidence passes

Start with the baseline ungrouped set and keep a disposition for every candidate. Rank large positive charges for review, but examine credits and smaller companion purchases as supporting evidence. Use the full relevant dataset for research, not only the visible fiscal-year or person filter.

1. **Read notes before guessing from vendors.** Remove commenter/timestamp headers for interpretation; keep original text. Comment authors and approvers are not travelers. Later corrections can change an earlier lodging interpretation into insurance or identify a canceled booking.
2. **Recognize explicit purposes and dates.** Registration, airfare, hotel deposit, folio, baggage, parking, rental fuel, insurance and refunds are different charge types. Parse valid numeric, dotted and day-month ranges, including `14-MAY-16MAY25`. Validate calendar dates and contradictory ranges. Purchase date is not departure date; published conference dates are not a traveler’s itinerary.
3. **Research merchant descriptors across people.** Compare exact descriptors first, then conservative variants retaining location/store/booking codes. Search other notes for explicit city, property, event, service, traveler and refund references. Keep exact matches distinct from fuzzy candidates. Verify property/code claims with authoritative vendor, airport or event sources when needed; store URL and review date.
4. **Corroborate trip membership.** Stronger combinations include same descriptor/date plus a named event; same hotel and matching booking installment amounts plus a later event-named charge; or a named recipient’s registration/flight plus a hotel paid on another card. Matching dates alone are weak; matching a generic chain alone is weaker.
5. **Check contradictions and alternatives.** Preserve opposing cities, multiple courses, repeat annual conferences and competing itineraries. Do not let a new guessed association become independent evidence for another guess. An airport parking location is usually an origin/service clue, not the trip destination.
6. **Resolve credits and fees.** Link exact booking references or well-supported original/credit pairs. Preserve full charges, tax refunds, fees and partial credits. A refund can prove cancellation of a booking without proving cancellation of an entire trip. Show unexplained residuals. A duplicate-receipt warning is not proof of duplicate charges.

## Reusable examples from this project

- `SONESTA ES SUITES NEW`: Bush and Forbes on the same purchase date; Forbes names WEFTEC. Supports a probable cross-card event connection, not shared rooms or attendance.
- `AGASERVICECO MAR TT`: another person’s corrected note identifies Allianz trip protection despite earlier lodging wording. Reuse the service interpretation, not that person’s trip.
- `LAZ PARKING M06316WC`: repeated explicit ECP notes support probable airport parking across cardholders. Generic LAZ or opaque Hertz numbers do not inherit that location. ECP is the Panama City airport code; do not silently turn a different code into ECP.
- `HILTON CONVENTION CTR`: Daugherty and Murphy have matching $259.88/$740.12 charges, with SWANA named on supporting records. Review those bookings specifically; the same descriptor also appears for different events.
- Taylor’s Embassy Suites charge: Scoggin’s adjacent-date conference note plus Taylor’s own conference-named fuel notes support the link. Two independent clues are stronger than the chain name alone.
- `HOMES TO SUITES BY HILTON`: same-day records name different cities. Do not overwrite Tallahassee with Orlando simply because several other people’s notes say Orlando.

These are methods and regression examples, not universal mappings for future records.

## Encode and test inferences

Keep reviewed memberships bounded to explicit member IDs, supporting IDs, a human-readable reason, and optional supported location/recipient overrides. Missing anchors must block application of the reviewed association. Do not let a reviewed cluster absorb unrelated nearby records. Every full charge belongs to at most one group; estimated shared-person allocations must reconcile without duplicating the charge.

Reuse vendor evidence separately from trip assignments. Keep name aliases, property identities and event editions separate where the current architecture permits. Retain source disagreements even when a probable match is useful. No silent correction of source fields.

Do not expand historic timing windows globally merely to connect one advance booking. Use explicit matching travel dates or a reviewed record link. Source topics without a city can still identify a useful event; label standalone clues separately from multi-purchase connections.

## Deliverables

Retain baseline, changed memberships, supporting evidence, credits, remaining candidates and a specific follow-up for each unresolved record. For largest-ungrouped reports, verify the current published snapshot if the user is asking about the live site; state positive-charge ranking versus net amounts. Show amount, recorded cardholder, purchase date, merchant, existing clue and the exact missing document/field. A source cardholder is not necessarily the traveler.

Separate: connected to other purchases; standalone event/place identified; unresolved; and non-trip evidence. Do not claim the historical 148 connections or any other prior result as a fresh import’s result.
