/**
 * Business information extracted verbatim from gstruckandtrailerrepair.com.
 * Do not invent or alter contact details.
 */
export const BUSINESS = {
  name: "GS Truck & Trailer Repair",
  shortName: "GS Truck",
  phoneDisplay: "+1 (416) 918-2630",
  phoneHref: "tel:+14169182630",
  email: "info@gstruckrepair.ca",
  emailHref: "mailto:info@gstruckrepair.ca",
  address: "18 Knightsbridge Rd, Brampton, ON L6T 3X5",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=18+Knightsbridge+Rd,+Brampton,+ON+L6T+3X5",
  tagline: "24/7 Emergency Roadside Assistance",
  promise:
    "GS Truck and Trailer repair provide excellent trucking solutions, we promise to provide superior trucking solutions.",
} as const;

export type ServiceCategory = {
  id: string;
  title: string;
  code: string;
  blurb: string;
  services: string[];
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "emergency",
    code: "01",
    title: "Emergency & Mobile Repair",
    blurb:
      "Roadside breakdown? Our mobile units roll out around the clock so your freight keeps moving.",
    services: [
      "24/7 Mobile Truck Repair",
      "24/7 Emergency Roadside Assistance",
      "Fleet Maintenance",
      "Battery",
      "Tyres",
    ],
  },
  {
    id: "truck",
    code: "02",
    title: "Heavy Duty Truck Repair",
    blurb:
      "Full heavy-duty capability, from severe collision damage to everyday shop work on any make.",
    services: [
      "Heavy Duty Truck Repairs",
      "Truck & Trailer Repair",
      "Truck Mechanics",
      "Body & Trim",
      "Exhaust",
      "Air System",
    ],
  },
  {
    id: "trailer",
    code: "03",
    title: "Trailer Repair",
    blurb:
      "Trailer bodywork, box rollup and barn door repairs handled in-house and turned around fast.",
    services: ["Trailer Repair", "Trailer Bodywork", "Body & Trim", "Brakes", "Electrical"],
  },
  {
    id: "diagnostics",
    code: "04",
    title: "Diagnostics",
    blurb:
      "Electronic diagnostics that find the real fault the first time — no guesswork, no repeat visits.",
    services: [
      "Computer Diagnostics",
      "Computer Diagnostic Testing",
      "Check Engine Light Diagnostic",
      "Electrical",
    ],
  },
  {
    id: "engine",
    code: "05",
    title: "Mechanical & Engine",
    blurb:
      "Engine, driveline and running gear work performed by technicians who live in these machines.",
    services: [
      "Engine Repair",
      "Transmission",
      "Clutch Replacement",
      "Steering & Suspension",
      "Engine Cooling System",
      "Cooling System Flush",
      "Air Conditioning",
    ],
  },
  {
    id: "maintenance",
    code: "06",
    title: "Maintenance & Inspection",
    blurb:
      "Planned service that keeps annual inspections clean and unplanned downtime off your schedule.",
    services: [
      "Annual Inspection",
      "Routine Service",
      "Tune Up",
      "Oil Exchange",
      "Air & Cabin Filter",
      "Brakes",
    ],
  },
];

/** Flat list used by the request-service form select. */
export const ALL_SERVICES: string[] = Array.from(
  new Set(SERVICE_CATEGORIES.flatMap((c) => c.services)),
).sort((a, b) => a.localeCompare(b));

export const FEATURED_SERVICES = [
  {
    title: "24/7 Mobile Truck Repair",
    detail: "Mobile units dispatched to the roadside, yard or terminal — day or night.",
  },
  {
    title: "Heavy Duty Truck Repairs",
    detail: "Full shop capability for tractors, straight trucks and vocational units.",
  },
  {
    title: "Trailer Repair & Bodywork",
    detail: "Box rollup, barn doors, panels and structural trailer repair.",
  },
  {
    title: "Computer Diagnostics",
    detail: "Electronic fault tracing and check engine light diagnostics.",
  },
  {
    title: "Engine & Transmission",
    detail: "Engine repair, clutch replacement and driveline service.",
  },
  {
    title: "Annual Inspection",
    detail: "Inspection-ready service so you pass the first time.",
  },
] as const;
