export interface MileageRecord {
  date: string;
  mileage: number;
  source: string;
}

export interface MOTRecord {
  date: string;
  result: "Pass" | "Fail";
  odometer: number;
  expiryDate?: string;
  testNumber: string;
  advisories: string[];
  failures: string[];
}

export interface AccidentRecord {
  date: string;
  severity: "Minor" | "Moderate" | "Severe" | "None";
  description: string;
  pointOfImpact: string;
  repaired: boolean;
}

export interface RecallRecord {
  date: string;
  campaignNumber: string;
  component: string;
  description: string;
  status: "Remedied" | "Outstanding";
}

export interface VehicleReport {
  vin: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  engineSize: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  co2Emissions: string;
  registrationDate: string;
  assemblyPlant: string;
  safetyRating: string; // e.g. "5 Star (Euro NCAP)"
  score: number; // 0-100 overall health score
  
  // Status Checks
  stolenStatus: "STOLEN" | "CLEAN";
  financeOutstanding: "YES" | "NO";
  writeOffStatus: "CAT S" | "CAT N" | "CAT D" | "CAT C" | "CLEAN";
  scrappedStatus: "YES" | "NO";
  importedStatus: "YES" | "NO";
  vicSubject: "YES" | "NO";
  
  // Historical Records
  previousOwners: number;
  mileageHistory: MileageRecord[];
  motHistory: MOTRecord[];
  accidentHistory: AccidentRecord[];
  recalls: RecallRecord[];
  
  // Additional Info
  marketValueMin: number;
  marketValueMax: number;
  roadTaxStatus: "Taxed" | "Untaxed" | "SORN";
  roadTaxExpiry: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  badge?: string;
  description: string;
  features: string[];
  accentColor: string;
}
