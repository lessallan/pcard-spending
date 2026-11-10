// Source-backed travel enrichment, reviewed 2026-11-10. Published event schedules are not traveler itineraries.
const travelResearch = {
  "reviewed": "2026-11-10",
  "hotels": [
    {
      "pattern": "westin poinsett",
      "city": "Greenville, SC",
      "name": "The Westin Poinsett",
      "url": "https://www.marriott.com/en-us/hotels/gspwi-the-westin-poinsett-greenville/overview/"
    },
    {
      "pattern": "luminary hotel",
      "city": "Fort Myers, FL",
      "name": "Luminary Hotel & Co.",
      "url": "https://www.luminaryhotel.com/contact-us/"
    },
    {
      "pattern": "hotel viata",
      "city": "Austin, TX",
      "name": "Hotel Viata",
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/"
    },
    {
      "pattern": "oglebay lodging",
      "city": "Wheeling, WV",
      "name": "Oglebay Park Resort",
      "url": "https://oglebay.com/about/contact/"
    },
    {
      "pattern": "embassysuitesorlandonorth",
      "city": "Altamonte Springs, FL",
      "name": "Embassy Suites Orlando North",
      "url": "https://www.hilton.com/en/hotels/mcospes-embassy-suites-orlando-north/"
    },
    {
      "pattern": "rosen hotels? (?:centre|plaza|shngl crk)|guestrs rosencentr",
      "city": "Orlando",
      "name": "Rosen Centre / Plaza / Shingle Creek (descriptor identifies property)",
      "url": "https://www.rosenhotels.com/wp-content/uploads/2025/05/RHR-3-Hotel-Leisure-Fact-Sheet-2025-English.pdf"
    },
    {
      "pattern": "hyatt regency coconut pt",
      "city": "Bonita Springs, FL",
      "name": "Hyatt Regency Coconut Point",
      "url": "https://www.fgfoa.org/board-meetings/"
    },
    {
      "pattern": "signia by hilton bonnet",
      "city": "Orlando",
      "name": "Signia by Hilton Orlando Bonnet Creek",
      "url": "https://www.hilton.com/en/hotels/orlhhsa-signia-by-hilton-orlando-bonnet-creek/hotel-location/"
    },
    {
      "pattern": "royal sonesta hotel ne",
      "city": "New Orleans, LA",
      "name": "The Royal Sonesta New Orleans",
      "url": "https://www.sonesta.com/royal-sonesta/la/new-orleans/royal-sonesta-new-orleans/"
    },
    {
      "pattern": "hotel effie",
      "city": "Miramar Beach, FL",
      "name": "Hotel Effie Sandestin",
      "url": "https://www.hoteleffie.com/"
    },
    {
      "pattern": "sheraton sand key",
      "city": "Clearwater, FL",
      "name": "Sheraton Sand Key Resort",
      "url": "https://www.marriott.com/hotels/travel/tpasi-sheraton-sand-key-resort/"
    },
    {
      "pattern": "hutchinson shores",
      "city": "Jensen Beach, FL",
      "name": "Hutchinson Shores Resort",
      "url": "https://www.opalcollection.com/hutchinson-shores/faq/"
    },
    {
      "pattern": "marriott tb isle miami",
      "city": "Aventura, FL",
      "name": "JW Marriott Miami Turnberry Resort",
      "url": "https://assets.contentstack.io/v3/assets/blt99dd26276e65134a/blt66982ca8b3779288/6641e2dde25e7d468a89f355/2024_Fact_Sheet_-_JW_Marriott_Miami_Turnberry_Resort_%26_Spa.pdf"
    },
    {
      "pattern": "linq front",
      "city": "Las Vegas, NV",
      "name": "The LINQ",
      "url": "https://newsroom.caesars.com/Property-Fact-Sheets/The-LINQ-Hotel--Experience/"
    },
    {
      "pattern": "venetian/palazzo",
      "city": "Las Vegas, NV",
      "name": "The Venetian / Palazzo",
      "url": "https://www.venetianlasvegas.com/resort.html"
    },
    {
      "pattern": "curio diplomat",
      "city": "Hollywood, FL",
      "name": "Diplomat Beach Resort",
      "url": "https://flm-members.flcities.com/FLM/FLM/Event_Display.aspx?EventKey=FLMAUG26"
    },
    {
      "pattern": "moxy fayetteville",
      "city": "Fayetteville, AR",
      "name": "Moxy Fayetteville",
      "url": "https://www.marriott.com/en-us/hotels/xnafx-moxy-fayetteville/rooms/"
    },
    {
      "pattern": "sandestin golf",
      "city": "Miramar Beach, FL",
      "name": "Sandestin Golf and Beach Resort",
      "url": "https://www.sandestin.com/sandestin-golf-and-beach-resort-webcams"
    },
    {
      "pattern": "gaylord palms",
      "city": "Kissimmee, FL",
      "name": "Gaylord Palms Resort",
      "url": "https://www.marriott.com/offers/grand-getaways-OFF-97645/mcogp-gaylord-palms-resort-and-convention-center"
    },
    {
      "pattern": "renaissance world golf",
      "city": "St. Augustine, FL",
      "name": "Renaissance World Golf Village",
      "url": "https://www.fgfoa.org/wp-content/uploads/2025/03/2024-10-23-agenda.pdf"
    },
    {
      "pattern": "^castle hotel$",
      "city": "Orlando",
      "name": "Castle Hotel, Autograph Collection",
      "url": "https://www.marriott.com/en-us/hotels/mcoca-castle-hotel-autograph-collection/overview/"
    },
    {
      "pattern": "universals aventura",
      "city": "Orlando",
      "name": "Universal Aventura Hotel",
      "url": "https://www.loewshotels.com/universals-aventura-hotel/discover"
    },
    {
      "pattern": "marriott sanibel harbo",
      "city": "Fort Myers, FL",
      "name": "Marriott Sanibel Harbour Resort",
      "url": "https://www.hotel-development.marriott.com/ResourceFiles/fdd-document/2025-mhr-fdd-3-31-2025.pdf"
    },
    {
      "pattern": "best western plus casi",
      "city": "Las Vegas, NV",
      "name": "Best Western Plus Casino Royale",
      "url": "https://www.casinoroyalehotel.com/"
    }
  ],
  "events": [
    {
      "pattern": "\\b(?:APWA\\s*[- ]*PWX|AWPA\\s+PWX|PWX\\s+EXPO)\\b",
      "name": "APWA PWX 2025",
      "city": "Chicago",
      "start": "2025-08-17",
      "end": "2025-08-20",
      "url": "https://colorado.apwa.org/wp-content/uploads/sites/2/2025/11/2025-Fall-Newsletter.pdf"
    },
    {
      "pattern": "\\b(?:APWA\\s*[- ]*PWX|AWPA\\s+PWX|PWX\\s+EXPO)\\b",
      "name": "APWA PWX 2026",
      "city": "Houston, TX",
      "start": "2026-08-30",
      "end": "2026-09-02",
      "url": "https://www.apwa.org/event/pwx-2026/"
    },
    {
      "pattern": "\\bAPWA\\s+(?:Florida\\s+)?EXPO\\b",
      "name": "APWA Florida Expo 2025",
      "city": "Orlando",
      "start": "2025-04-28",
      "end": "2025-05-01",
      "url": "https://florida.apwa.org/news-and-announcements/apwa-florida-chapter-2025-expo-call-for-papers/"
    },
    {
      "pattern": "\\bAPWA\\s+(?:Florida\\s+)?EXPO\\b",
      "name": "APWA Florida Expo 2026",
      "city": "Tampa",
      "start": "2026-04-07",
      "end": "2026-04-09",
      "url": "https://florida.apwa.org/event/2026-apwa-florida-public-works-expo/"
    },
    {
      "pattern": "strong\\s*towns?",
      "name": "Strong Towns National Gathering 2026",
      "city": "Fayetteville, AR",
      "start": "2026-05-18",
      "end": "2026-05-20",
      "url": "https://gathering.strongtowns.org/faq"
    },
    {
      "pattern": "brownfield",
      "name": "National Brownfields Conference 2025",
      "city": "Chicago",
      "start": "2025-08-05",
      "end": "2025-08-08",
      "url": "https://gobrownfields.org/register-now/"
    },
    {
      "pattern": "\\bFLC\\s+(?:annual\\s+)?conference\\b|Florida League of Cities.*conference",
      "name": "FLC Annual Conference 2026",
      "city": "Hollywood, FL",
      "start": "2026-08-13",
      "end": "2026-08-15",
      "url": "https://flm-members.flcities.com/FLM/FLM/Event_Display.aspx?EventKey=FLMAUG26"
    },
    {
      "pattern": "\\bFRA\\b.*conference|Florida redevelopment.*conference",
      "name": "FRA Annual Conference 2025",
      "city": "West Palm Beach, FL",
      "start": "2025-10-14",
      "end": "2025-10-17",
      "url": "https://redevelopment.net/wp-content/uploads/2025/08/2025-FRA-Conference-Announcement.pdf"
    },
    {
      "pattern": "\\bFRA\\b.*conference|Florida redevelopment.*conference",
      "name": "FRA Annual Conference 2026",
      "city": "Charlotte Harbor, FL",
      "start": "2026-10-20",
      "end": "2026-10-23",
      "url": "https://redevelopment.net/2026-annual-conference/"
    },
    {
      "pattern": "\\bGFOA\\b.*conference",
      "name": "GFOA Annual Conference 2025",
      "city": "Washington, DC",
      "start": "2025-06-29",
      "end": "2025-07-02",
      "url": "https://gfoa-craftcms.files.svdcdn.com/production/general/GFOA-2022-Conference-Program.pdf.pdf?dm=1757628334"
    },
    {
      "pattern": "\\bGFOA\\b.*conference",
      "name": "GFOA Annual Conference 2026",
      "city": "Chicago",
      "start": "2026-06-28",
      "end": "2026-07-01",
      "url": "https://gfoa-craftcms.files.svdcdn.com/production/prismic/GFOA-2026-Info-Sheet.pdf?dm=1762550762"
    },
    {
      "pattern": "FGFOA.*(?:school|SOGF)",
      "name": "FGFOA School of Governmental Finance 2025",
      "city": "Bonita Springs, FL",
      "start": "2025-10-29",
      "end": "2025-10-29",
      "url": "https://www.fgfoa.org/board-meetings/",
      "dateNote": "Published board-meeting date within the school; full school dates not verified."
    },
    {
      "pattern": "FGFOA.*conference",
      "name": "FGFOA Annual Conference 2026",
      "city": "Orlando",
      "start": "2026-06-13",
      "end": "2026-06-17",
      "url": "https://www.fgfoa.org/wp-content/uploads/2026/04/FGFOA-E-Bulletin-FGFOA-Newsletter-April-2026-1.pdf"
    },
    {
      "pattern": "\\bFCCMA\\b.*(?:conference|registration)",
      "name": "FCCMA Annual Conference 2025",
      "city": "Orlando",
      "start": "2025-05-28",
      "end": "2025-05-31",
      "url": "https://www.fccma.org/2025/04/april-2025-presidents-message/"
    },
    {
      "pattern": "\\bFCCMA\\b.*(?:conference|registration)",
      "name": "FCCMA Annual Conference 2026",
      "city": "Orlando",
      "start": "2026-05-27",
      "end": "2026-05-30",
      "url": "https://www.fccma.org/wp-content/uploads/2026/02/2026-Exhibitor-Kit.pdf"
    },
    {
      "pattern": "\\b(?:FMCA|FCMA)\\b.*(?:conference|registration)",
      "name": "FMCA Annual Conference 2026",
      "city": "Clearwater, FL",
      "start": "2026-04-29",
      "end": "2026-04-30",
      "url": "https://www.fmcaonline.com/wp-content/uploads/2025/12/2026-FMCA-Outstanding-Awards-Toolkit-FINAL.pdf"
    },
    {
      "pattern": "trimble dimensions\\s*2025",
      "name": "Trimble Dimensions 2025",
      "city": "Las Vegas, NV",
      "start": "2025-11-10",
      "end": "2025-11-12",
      "url": "https://news.trimble.com/2025-09-10-Announcing-Trimble-Dimensions-2025-Engage-the-Future-of-Work-Now"
    },
    {
      "pattern": "trimble dimensions\\s*2026",
      "name": "Trimble Dimensions 2026",
      "city": "Las Vegas, NV",
      "start": "2026-11-09",
      "end": "2026-11-11",
      "url": "https://news.trimble.com/Dimensions"
    },
    {
      "pattern": "trimble innovate\\s*2025|innovate user conference",
      "name": "Trimble Innovate 2025",
      "city": "Salt Lake City",
      "start": "2025-10-14",
      "end": "2025-10-17",
      "url": "https://assetlifecycle.trimble.com/en/learn/innovate/conference-schedule"
    },
    {
      "pattern": "tyler (?:connect|conference|user conference)",
      "name": "Tyler Connect 2026",
      "city": "Las Vegas, NV",
      "start": "2026-04-07",
      "end": "2026-04-10",
      "url": "https://www.tylertech.com/connect/sessions/general-education"
    },
    {
      "pattern": "\\bICMA\\b.*conference",
      "name": "ICMA Annual Conference 2025",
      "city": "Tampa",
      "start": "2025-10-25",
      "end": "2025-10-29",
      "url": "https://icma.org/documents/2025-icma-annual-conference-preliminary-program"
    },
    {
      "pattern": "\\bICMA\\b.*conference",
      "name": "ICMA Annual Conference 2026",
      "city": "Long Beach, CA",
      "start": "2026-10-17",
      "end": "2026-10-21",
      "url": "https://icma.org/events/2026-icma-annual-conference"
    },
    {
      "pattern": "\\bIACP\\b",
      "name": "IACP Annual Conference 2024",
      "city": "Boston",
      "start": "2024-10-19",
      "end": "2024-10-22",
      "url": "https://2024.theiacpconference.org/attend/registration-information/"
    },
    {
      "pattern": "\\bIACP\\b",
      "name": "IACP Annual Conference 2025",
      "city": "Denver",
      "start": "2025-10-18",
      "end": "2025-10-21",
      "url": "https://www.policechiefmagazine.org/wp-content/uploads/IACP-2025-MediaKit_v04-PRINT_08_05.pdf"
    },
    {
      "pattern": "\\bESRI\\b.*conference",
      "name": "Esri User Conference 2026",
      "city": "San Diego, CA",
      "start": "2026-07-13",
      "end": "2026-07-17",
      "url": "https://www.esri.com/about/newsroom/announcements/2026-esri-user-conference-to-focus-on-creating-a-more-intelligent-world-with-gis"
    },
    {
      "pattern": "\\bFRWA\\b.*conference",
      "name": "FRWA Annual Conference 2025",
      "city": "Daytona Beach, FL",
      "start": "2025-07-29",
      "end": "2025-07-31",
      "url": "https://www.frwa.net/events/2025frwaannualconference"
    },
    {
      "pattern": "\\bFRWA\\b.*conference",
      "name": "FRWA Annual Conference 2026",
      "city": "Daytona Beach, FL",
      "start": "2026-07-27",
      "end": "2026-07-29",
      "url": "https://www.frwa.net/Events/2026frwa-Annual-Conferencedaytona-Beach-72726-72926"
    },
    {
      "pattern": "FBC[ -]?LEO",
      "name": "FBC-LEO Annual Conference 2025",
      "city": "Kissimmee, FL",
      "start": "2025-02-27",
      "end": "2025-02-28",
      "url": "https://members.flcities.com/FLCExhibitors/iCore/Events/Event_display.aspx?EventKey=FBCLEOAC25"
    },
    {
      "pattern": "\\bWCI\\b|work(?:ers.?|man.s)?\\s*comp(?:ensation)?\\s*(?:educational\\s*)?conference",
      "name": "WCI Conference 2026",
      "city": "Orlando",
      "start": "2026-08-23",
      "end": "2026-08-26",
      "url": "https://wci360.com/wp-content/uploads/2025/11/WCI-2026-Prospectus.pdf"
    },
    {
      "pattern": "\\bFSA\\b.*conference",
      "name": "FSA Winter Conference 2025",
      "city": "Kissimmee, FL",
      "start": "2025-12-03",
      "end": "2025-12-05",
      "url": "https://www.florida-stormwater.org/past---future-conferences"
    },
    {
      "pattern": "\\bNLC\\b.*city summitt?",
      "name": "NLC City Summit 2024",
      "city": "Tampa",
      "start": "2024-11-13",
      "end": "2024-11-16",
      "url": "https://www.nlc.org/wp-content/uploads/2023/08/2023-City-Summit-FAQ-MGE-_-Website.pdf"
    },
    {
      "pattern": "\\bNLC\\b.*city summitt?",
      "name": "NLC City Summit 2025",
      "city": "Salt Lake City",
      "start": "2025-11-20",
      "end": "2025-11-22",
      "url": "https://www.nlc.org/events/register-now-for-the-2025-city-summit/"
    },
    {
      "pattern": "\\bFLC\\s+(?:annual\\s+)?conference\\b|Florida League of Cities.*conference",
      "name": "FLC Annual Conference 2025",
      "city": "Orlando",
      "start": "2025-08-14",
      "end": "2025-08-16",
      "url": "https://www.floridaleagueofcities.com/wp-content/uploads/2025/07/FLC_2025-Annual-Conference-Announcement.pdf"
    },
    {
      "pattern": "\\bUS\\s+conference of mayors\\b|\\bUSMAYORS\\b",
      "name": "US Conference of Mayors 2025",
      "city": "Tampa",
      "start": "2025-06-19",
      "end": "2025-06-22",
      "url": "https://www.usmayors.org/wp-content/uploads/2024/06/Mayors-92nd-Annual-Meeting-WEB-Agenda-061824.pdf"
    },
    {
      "pattern": "\\bIEMO\\s*(?:II|2)\\b",
      "name": "IEMO II October 2024",
      "city": "Altamonte Springs, FL",
      "start": "2024-10-25",
      "end": "2024-10-26",
      "url": "https://mccmeetings.blob.core.usgovcloudapi.net/pahokeefl-pubu/MEET-Packet-a06bd8a76abf4f8cb41ad76f9385a583.pdf"
    },
    {
      "pattern": "\\bIEMO\\b(?!\\s*(?:II|2)\\b)",
      "name": "IEMO October 2024",
      "city": "Tampa",
      "start": "2024-10-04",
      "end": "2024-10-05",
      "url": "https://www.palmbayfl.gov/home/showpublisheddocument/27466/638648659229970000"
    },
    {
      "pattern": "FLC\\s+Leadership",
      "name": "FLC Leadership March 2025",
      "city": "Kissimmee, FL",
      "start": "2025-03-06",
      "end": "2025-03-07",
      "url": "https://members.flcities.com/FLC/FLC/Events/Event_Display.aspx?EventKey=IEMOLD0325"
    },
    {
      "pattern": "chief[’\\x27]?s?\\s+conference",
      "name": "FPCA Summer Conference 2025",
      "city": "Miami Beach, FL",
      "start": "2025-06-14",
      "end": "2025-06-18",
      "url": "https://fpca.com/media/2025/03/Spring-2025-Magazine-DIGITAL-FINAL.pdf"
    },
    {
      "pattern": "\\bPRIMA\\b",
      "name": "PRIMA Annual Conference 2026",
      "city": "Fort Lauderdale, FL",
      "start": "2026-06-07",
      "end": "2026-06-10",
      "url": "https://conference.primacentral.org/2025/about_the_show.cfm"
    },
    {
      "pattern": "\\bNLC\\b.*city summitt?|national league of cities.*city summit",
      "name": "NLC City Summit 2026",
      "city": "Nashville, TN",
      "start": "2026-11-19",
      "end": "2026-11-21",
      "url": "https://citysummit.nlc.org/schedule-at-a-glance/"
    },
    {
      "pattern": "housing.*conf",
      "name": "Florida Housing Coalition Conference 2025",
      "city": "Orlando",
      "start": "2025-08-25",
      "end": "2025-08-27",
      "url": "https://flhousing.org/2025-conference-save-the-date/"
    },
    {
      "pattern": "housing.*conf",
      "name": "Florida Housing Coalition Conference 2026",
      "city": "Orlando",
      "start": "2026-08-24",
      "end": "2026-08-26",
      "url": "https://conference.flhousing.org/2026-waitlist-3/"
    },
    {
      "pattern": "HR\\s*FL.*conf|HRFL.*conf|SHRM.*conf",
      "name": "HR Florida Conference 2025",
      "city": "Kissimmee, FL",
      "start": "2025-08-24",
      "end": "2025-08-27",
      "url": "https://shrmflorida.org/m/event_details.asp?id=1867344"
    },
    {
      "pattern": "HR\\s*FL.*conf|HRFL.*conf|SHRM.*conf",
      "name": "HR Florida Conference 2026",
      "city": "Kissimmee, FL",
      "start": "2026-08-30",
      "end": "2026-09-02",
      "url": "https://greaterpensacolashrm.wildapricot.org/hr-florida"
    },
    {
      "pattern": "\\bSHRUG\\b",
      "name": "SHRUG GIS Workshop 2024",
      "city": "Tallahassee",
      "start": "2024-11-13",
      "end": "2024-11-14",
      "url": "https://cms.leoncountyfl.gov/Portals/0/DeptFiles/Tourism/Docs/TDC%20Meetings/20250206.pdf"
    },
    {
      "pattern": "FGFOA.*(?:conference|registration)",
      "name": "FGFOA Annual Conference 2025",
      "city": "Hollywood, FL",
      "start": "2025-06-14",
      "end": "2025-06-18",
      "url": "https://fgfoa-members.flcities.com/FGFOA/Fgfoa/Events/Event_Display.aspx?EventKey=fgfoaac25"
    },
    {
      "pattern": "(?:FLC|Florida League of Cities).*Leadership",
      "name": "FLC Leadership May 2026",
      "city": "Orlando",
      "start": "2026-05-14",
      "end": "2026-05-15",
      "url": "https://www.flcities.com/newly-elected-officials/"
    },
    {
      "pattern": "FLC.*Policy Committee",
      "name": "FLC Policy Committee · late 2024",
      "city": "Orlando",
      "start": "2024-12-05",
      "end": "2024-12-06",
      "url": "https://www.flcities.com/wp-content/uploads/2025/06/Municipal-Packet-12-24.pdf",
      "dateNote": "Published late-2024 policy committee materials name Hilton Orlando. Specific meeting dates need confirmation; these are recurring meetings."
    }
  ],
  "notes": {
    "TXN00044102": "Conflicting event descriptions: the same record mentions both an Opal pension conference and HR Florida. Registration receipt is needed before choosing an event or destination.",
    "TXN00050894": "Source conflict: comment says ICMA Chicago, while the hotel descriptor says Tampa. ICMA publishes Tampa for its October 25–29, 2025 annual conference. Preserve the original comment; Tampa is the better-supported interpretation.",
    "TXN00047075": "Source conflict: comment says Greenville NC; Westin Poinsett is in Greenville SC. Other May 16 visit notes also say SC. Keep both clues visible.",
    "TXN00050330": "Bundled lodging and member tuition. Accounting explicitly requested a breakdown; no allocation is supplied. Do not count the full amount as hotel room cost.",
    "TXN00053414": "Source conflict: merchant is Drury Inns, but comment describes health-screening food and raffle giveaways. Purchase purpose needs the itemized receipt.",
    "TXN00043883": "Date conflict: GovOS comment spans 02.26.24–02.28.25, unlike the February 2025 dates in related records. Do not interpret this as a year-long stay.",
    "TXN00054981": "Fayetteville, NC economic-development visit; distinct from the May 2026 Strong Towns event in Fayetteville, AR.",
    "TXN00055260": "Record says the charge was disputed and never made. It is not evidence of a completed stay.",
    "TXN00056507": "Record says the charge was disputed and never made. It is not evidence of a completed stay.",
    "TXN00058312": "Comment says purchased in error and reports repayment. This is not evidence of a City business trip; repayment is reported, not independently reconciled.",
    "TXN00057954": "Source conflict: note says Palm Springs, FL, while Hutchinson Shores is in Jensen Beach. Receipt needed to resolve destination.",
    "TXN00058123": "Source conflict: note says Palm Springs, FL, while Hutchinson Shores is in Jensen Beach. Receipt needed to resolve destination.",
    "TXN00043460": "Comment identifies food/water despite a hotel merchant. Treat as a meal/supplies charge pending folio, not automatically a room night.",
    "TXN00045372": "The comment explicitly says UVC Ride. The merchant alone does not establish the operator identity or route.",
    "TXN00054333": "Membership and conference are bundled; the record does not split their amounts.",
    "TXN00053853": "Membership and conference are bundled; the record does not split their amounts.",
    "TXN00054319": "Membership and conference are bundled; the record does not split their amounts."
  },
  "nonTrip": {
    "TXN00041922": {
      "kind": "Virtual training registration — no travel indicated",
      "url": "https://fccma-members.flcities.com/FCCMA/FCCMA/Events/Event_Display.aspx?EventKey=FCCMAFS24",
      "text": "FCCMA identifies its November 21, 2024 Fall Symposium as a virtual Zoom event."
    }
  },
  "related": {
    "TXN00043596": {
      "city": "Austin, TX",
      "name": "GovOS Conference · February 2025 (record-linked)",
      "ids": [
        "TXN00045022",
        "TXN00045069"
      ],
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/",
      "text": "Possible shared event destination: GovOS wording and the booking period match Hotel Viata folios TXN00045022 / TXN00045069. Hotel Viata is in Austin. This is a record-based association, not verified attendance."
    },
    "TXN00043855": {
      "city": "Austin, TX",
      "name": "GovOS Conference · February 2025 (record-linked)",
      "ids": [
        "TXN00045022",
        "TXN00045069"
      ],
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/",
      "text": "Possible shared event destination: GovOS wording and the booking period match Hotel Viata folios TXN00045022 / TXN00045069. Hotel Viata is in Austin. This is a record-based association, not verified attendance."
    },
    "TXN00043883": {
      "city": "Austin, TX",
      "name": "GovOS Conference · February 2025 (record-linked)",
      "ids": [
        "TXN00045022",
        "TXN00045069"
      ],
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/",
      "text": "Possible shared event destination: GovOS wording and the booking period match Hotel Viata folios TXN00045022 / TXN00045069. Hotel Viata is in Austin. This is a record-based association, not verified attendance."
    },
    "TXN00044430": {
      "city": "Austin, TX",
      "name": "GovOS Conference · February 2025 (record-linked)",
      "ids": [
        "TXN00045022",
        "TXN00045069"
      ],
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/",
      "text": "Possible shared event destination: GovOS wording and the booking period match Hotel Viata folios TXN00045022 / TXN00045069. Hotel Viata is in Austin. This is a record-based association, not verified attendance."
    },
    "TXN00044445": {
      "city": "Austin, TX",
      "name": "GovOS Conference · February 2025 (record-linked)",
      "ids": [
        "TXN00045022",
        "TXN00045069"
      ],
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/",
      "text": "Possible shared event destination: GovOS wording and the booking period match Hotel Viata folios TXN00045022 / TXN00045069. Hotel Viata is in Austin. This is a record-based association, not verified attendance."
    },
    "TXN00044962": {
      "city": "Austin, TX",
      "name": "GovOS Conference · February 2025 (record-linked)",
      "ids": [
        "TXN00045022",
        "TXN00045069"
      ],
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/",
      "text": "Possible shared event destination: GovOS wording and the booking period match Hotel Viata folios TXN00045022 / TXN00045069. Hotel Viata is in Austin. This is a record-based association, not verified attendance."
    },
    "TXN00044975": {
      "city": "Austin, TX",
      "name": "GovOS Conference · February 2025 (record-linked)",
      "ids": [
        "TXN00045022",
        "TXN00045069"
      ],
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/",
      "text": "Possible shared event destination: GovOS wording and the booking period match Hotel Viata folios TXN00045022 / TXN00045069. Hotel Viata is in Austin. This is a record-based association, not verified attendance."
    },
    "TXN00045022": {
      "city": "Austin, TX",
      "name": "GovOS Conference · February 2025 (record-linked)",
      "ids": [
        "TXN00045022",
        "TXN00045069"
      ],
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/",
      "text": "Possible shared event destination: GovOS wording and the booking period match Hotel Viata folios TXN00045022 / TXN00045069. Hotel Viata is in Austin. This is a record-based association, not verified attendance."
    },
    "TXN00045032": {
      "city": "Austin, TX",
      "name": "GovOS Conference · February 2025 (record-linked)",
      "ids": [
        "TXN00045022",
        "TXN00045069"
      ],
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/",
      "text": "Possible shared event destination: GovOS wording and the booking period match Hotel Viata folios TXN00045022 / TXN00045069. Hotel Viata is in Austin. This is a record-based association, not verified attendance."
    },
    "TXN00045069": {
      "city": "Austin, TX",
      "name": "GovOS Conference · February 2025 (record-linked)",
      "ids": [
        "TXN00045022",
        "TXN00045069"
      ],
      "url": "https://www.hotelviata.com/stay/prepare-for-your-stay/",
      "text": "Possible shared event destination: GovOS wording and the booking period match Hotel Viata folios TXN00045022 / TXN00045069. Hotel Viata is in Austin. This is a record-based association, not verified attendance."
    },
    "TXN00049301": {
      "city": "Salt Lake City",
      "name": "Trimble Innovate 2025",
      "ids": [
        "TXN00049282"
      ],
      "url": "https://assetlifecycle.trimble.com/en/learn/innovate/conference-schedule",
      "text": "Possible event association: same cardholder and Cityworks wording as TXN00049282, whose merchant explicitly identifies Trimble Innovate 2025. Published event: Salt Lake City, October 14–17. Booking dates are not travel dates."
    },
    "TXN00049316": {
      "city": "Salt Lake City",
      "name": "Trimble Innovate 2025",
      "ids": [
        "TXN00049282"
      ],
      "url": "https://assetlifecycle.trimble.com/en/learn/innovate/conference-schedule",
      "text": "Possible event association: same cardholder and Cityworks wording as TXN00049282, whose merchant explicitly identifies Trimble Innovate 2025. Published event: Salt Lake City, October 14–17. Booking dates are not travel dates."
    },
    "TXN00049252": {
      "city": "Salt Lake City",
      "name": "Trimble Innovate 2025",
      "ids": [
        "TXN00049260"
      ],
      "url": "https://assetlifecycle.trimble.com/en/learn/innovate/conference-schedule",
      "text": "Possible event association: same cardholder and Cityworks wording as TXN00049260, whose merchant explicitly identifies Trimble Innovate 2025. Published event: Salt Lake City, October 14–17. Booking dates are not travel dates."
    },
    "TXN00049290": {
      "city": "Salt Lake City",
      "name": "Trimble Innovate 2025",
      "ids": [
        "TXN00049260"
      ],
      "url": "https://assetlifecycle.trimble.com/en/learn/innovate/conference-schedule",
      "text": "Possible event association: same cardholder and Cityworks wording as TXN00049260, whose merchant explicitly identifies Trimble Innovate 2025. Published event: Salt Lake City, October 14–17. Booking dates are not travel dates."
    },
    "TXN00049881": {
      "city": "Salt Lake City",
      "name": "Trimble Innovate 2025",
      "ids": [
        "TXN00050050"
      ],
      "url": "https://assetlifecycle.trimble.com/en/learn/innovate/conference-schedule",
      "text": "Possible event association: this Trimble flight and TXN00050050 registration share a cardholder and September 2025 booking period. The registration explicitly identifies Innovate 2025; airfare itinerary still needs verification."
    },
    "TXN00050501": {
      "city": "Salt Lake City",
      "name": "Trimble Innovate 2025",
      "ids": [
        "TXN00049282"
      ],
      "url": "https://assetlifecycle.trimble.com/en/learn/innovate/conference-schedule",
      "text": "Possible event association: same cardholder and Cityworks wording as TXN00049282, whose merchant explicitly identifies Trimble Innovate 2025. Published event: Salt Lake City, October 14–17. Booking dates are not travel dates."
    },
    "TXN00050635": {
      "city": "Salt Lake City",
      "name": "Trimble Innovate 2025",
      "ids": [
        "TXN00049282"
      ],
      "url": "https://assetlifecycle.trimble.com/en/learn/innovate/conference-schedule",
      "text": "Possible event association: same cardholder and Cityworks wording as TXN00049282, whose merchant explicitly identifies Trimble Innovate 2025. Published event: Salt Lake City, October 14–17. Booking dates are not travel dates."
    }
  }
};

module.exports=travelResearch;
