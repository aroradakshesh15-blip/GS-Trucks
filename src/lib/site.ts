/**
 * Business information for GS Truck & Trailer Repair.
 * Location sourced from the business's Google Maps listing.
 */
export const BUSINESS = {
  name: "GS Truck & Trailer Repair",
  shortName: "GS Truck",
  phoneDisplay: "+1 (416) 918-2630",
  phoneHref: "tel:+14169182630",
  email: "info@gstruckrepair.ca",
  emailHref: "mailto:info@gstruckrepair.ca",
  address: "6149 Shawson Dr Unit 4, Mississauga, ON L5T 1E4",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=G+S+Truck+and+Trailer+Repair,+6149+Shawson+Dr+Unit-+4,+Mississauga,+ON+L5T+1E4",
  mapsEmbedSrc:
    "https://www.google.com/maps?q=G+S+Truck+and+Trailer+Repair,+6149+Shawson+Dr+Unit-+4,+Mississauga,+ON+L5T+1E4&output=embed",
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

export type InspectionItem = { id: string; label: string; description: string };
export type InspectionCategory = { id: string; title: string; items: InspectionItem[] };

export const INSPECTION_CATEGORIES: InspectionCategory[] = [
  {
    id: "safety-compliance",
    title: "Safety & Compliance",
    items: [
      {
        id: "dot-inspection",
        label: "Annual DOT Inspection",
        description: "Full compliance inspection to keep the unit legally on the road.",
      },
      {
        id: "brake-system",
        label: "Brake System Inspection",
        description: "Pads, drums, chambers and overall braking performance.",
      },
      {
        id: "air-brake",
        label: "Air Brake Inspection",
        description: "Air lines, valves, tanks and system pressure checks.",
      },
      {
        id: "lighting-electrical",
        label: "Lighting & Electrical Safety Check",
        description: "Headlights, marker lights, signals and wiring condition.",
      },
      {
        id: "reflector-safety",
        label: "Reflector & Safety Equipment Inspection",
        description: "Reflective tape, triangles and required safety equipment.",
      },
      {
        id: "emergency-equipment",
        label: "Emergency Equipment Inspection",
        description: "Fire extinguisher, flares and other required emergency gear.",
      },
    ],
  },
  {
    id: "engine-mechanical",
    title: "Engine & Mechanical",
    items: [
      {
        id: "engine-inspection",
        label: "Engine Inspection",
        description: "General condition, performance and warning signs.",
      },
      {
        id: "transmission-inspection",
        label: "Transmission Inspection",
        description: "Shifting behaviour, fluid condition and leaks.",
      },
      {
        id: "cooling-system",
        label: "Cooling System Inspection",
        description: "Radiator, coolant level and cooling performance.",
      },
      {
        id: "fuel-system",
        label: "Fuel System Inspection",
        description: "Lines, filters and fuel delivery components.",
      },
      {
        id: "exhaust-system",
        label: "Exhaust System Inspection",
        description: "Exhaust, mounts and emissions-related components.",
      },
      {
        id: "belts-hoses",
        label: "Belts & Hoses Inspection",
        description: "Wear, cracking and tension on belts and hoses.",
      },
      {
        id: "fluid-leak",
        label: "Fluid Level & Leak Inspection",
        description: "Oil, coolant and other fluid levels, plus leak checks.",
      },
    ],
  },
  {
    id: "steering-suspension-wheels",
    title: "Steering, Suspension & Wheels",
    items: [
      {
        id: "steering-system",
        label: "Steering System Inspection",
        description: "Steering box, linkage and play in the system.",
      },
      {
        id: "suspension-inspection",
        label: "Suspension Inspection",
        description: "Springs, shocks, air bags and mounting hardware.",
      },
      {
        id: "wheel-hub",
        label: "Wheel & Hub Inspection",
        description: "Bearings, seals and hub condition.",
      },
      {
        id: "tire-condition",
        label: "Tire Condition Inspection",
        description: "Tread depth, wear pattern and sidewall condition.",
      },
      {
        id: "wheel-alignment",
        label: "Wheel Alignment Check",
        description: "Alignment check for even wear and predictable handling.",
      },
    ],
  },
  {
    id: "trailer-inspection",
    title: "Trailer Inspection",
    items: [
      {
        id: "trailer-annual",
        label: "Trailer Annual Inspection",
        description: "Full annual compliance inspection for the trailer unit.",
      },
      {
        id: "trailer-brake",
        label: "Trailer Brake Inspection",
        description: "Trailer brake components and air/electric connections.",
      },
      {
        id: "trailer-lighting",
        label: "Trailer Lighting Inspection",
        description: "Marker, brake and signal lighting on the trailer.",
      },
      {
        id: "trailer-suspension",
        label: "Trailer Suspension Inspection",
        description: "Axles, suspension components and mounting hardware.",
      },
      {
        id: "trailer-coupling",
        label: "Trailer Coupling / Fifth Wheel Inspection",
        description: "Coupling, kingpin and fifth wheel condition.",
      },
      {
        id: "trailer-tires-wheels",
        label: "Trailer Tires & Wheels Inspection",
        description: "Tread, pressure and wheel condition on the trailer.",
      },
    ],
  },
  {
    id: "other-services",
    title: "Other Services",
    items: [
      {
        id: "pre-trip",
        label: "Pre-Trip Inspection",
        description: "Quick check before a trip to catch issues early.",
      },
      {
        id: "preventive-maintenance",
        label: "Preventive Maintenance Inspection",
        description: "Scheduled check to catch wear before it becomes downtime.",
      },
      {
        id: "complete-safety",
        label: "Complete Vehicle Safety Inspection",
        description: "A full top-to-bottom safety inspection of the unit.",
      },
      {
        id: "custom-inspection",
        label: "Other / Custom Inspection",
        description: "Something specific in mind? Describe it in the message below.",
      },
    ],
  },
];

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
