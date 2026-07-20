import { VehicleReport, MileageRecord, MOTRecord, AccidentRecord, RecallRecord } from "../types";

// Helper to generate a realistic mileage chronological list for a vehicle based on registration year
function generateMileageHistory(year: number, make: string): MileageRecord[] {
  const currentYear = 2026;
  const age = Math.max(1, currentYear - year);
  const averageMileagePerYear = make === "Tesla" ? 11500 : 9200;
  const totalMileage = Math.round(age * averageMileagePerYear + 2500);
  
  const history: MileageRecord[] = [];
  for (let i = 0; i <= age; i++) {
    const recYear = year + i;
    const progressFactor = i / age;
    const recMileage = Math.round(progressFactor * totalMileage * 0.96 + (i * 200));
    history.push({
      date: `14/09/${recYear}`,
      mileage: i === 0 ? 15 : Math.max(100, recMileage),
      source: i === 0 ? "Pre-Delivery Inspection" : i === age ? "DVLA Registry Sync" : "MOT Test Centre",
    });
  }
  return history;
}

// Helper to generate a realistic MOT history list
function generateMotHistory(year: number, score: number, mileageHistory: MileageRecord[]): MOTRecord[] {
  const currentYear = 2026;
  const age = Math.max(1, currentYear - year);
  const motList: MOTRecord[] = [];
  
  if (age >= 3) {
    for (let i = 3; i <= age; i++) {
      const motYear = year + i;
      const odometerValue = mileageHistory[i] ? mileageHistory[i].mileage : Math.round((i / age) * (mileageHistory[mileageHistory.length - 1]?.mileage || 50000));
      const isPass = i !== 4 || score > 85; // Lower score cars can have a failed MOT to look authentic
      
      motList.unshift({
        date: `20/09/${motYear}`,
        result: isPass ? "Pass" : "Fail",
        odometer: odometerValue,
        expiryDate: `19/09/${motYear + 1}`,
        testNumber: "MOT" + Math.floor(100000000000 + Math.random() * 900000000000),
        advisories: isPass && i % 2 === 0 ? ["Brake pad wearing thin (front)", "Nearside rear tyre close to legal limit"] : [],
        failures: isPass ? [] : ["Exhaust emissions exceed limit values", "Windscreen wiper blade split (driver side)"],
      });
    }
  }
  return motList;
}

export function generateSimulatedReport(query: string, type: "vin" | "plate" = "plate"): VehicleReport {
  const cleanInput = query.replace(/\s+/g, "").toUpperCase();

  // Database of 2 detailed demo cars with varied statuses
  const demoCars: Record<string, Partial<VehicleReport>> = {
    // 1. BMW 3 Series - Clean High Score
    "WP69XYA": {
      make: "BMW",
      model: "3 Series 320d M Sport",
      year: 2019,
      color: "Melbourne Red Metallic",
      engineSize: "1995 cc (2.0L)",
      fuelType: "Diesel",
      transmission: "Automatic",
      bodyType: "Saloon",
      co2Emissions: "118 g/km",
      registrationDate: "24/09/2019",
      assemblyPlant: "Munich, Germany",
      safetyRating: "5 Star (Euro NCAP)",
      score: 94,
      stolenStatus: "CLEAN",
      financeOutstanding: "NO",
      writeOffStatus: "CLEAN",
      scrappedStatus: "NO",
      importedStatus: "NO",
      vicSubject: "NO",
      previousOwners: 1,
      accidentHistory: [],
      recalls: [
        {
          date: "04/04/2021",
          campaignNumber: "R/2021/045",
          component: "EGR Cooler Intake",
          description: "Potential coolant leak in EGR module leading to replacement.",
          status: "Remedied"
        }
      ],
      marketValueMin: 16500,
      marketValueMax: 18200,
      roadTaxStatus: "Taxed",
      roadTaxExpiry: "31/10/2026"
    },

    // 2. Tesla Model 3 - Clean high tech electric
    "LS21TES": {
      make: "Tesla",
      model: "Model 3 Long Range AWD",
      year: 2021,
      color: "Pearl White Multi-Coat",
      engineSize: "Electric (Dual Motor)",
      fuelType: "Electric",
      transmission: "Single-speed Automatic",
      bodyType: "Saloon",
      co2Emissions: "0 g/km",
      registrationDate: "28/03/2021",
      assemblyPlant: "Shanghai Gigafactory, China",
      safetyRating: "5 Star (Euro NCAP)",
      score: 97,
      stolenStatus: "CLEAN",
      financeOutstanding: "NO",
      writeOffStatus: "CLEAN",
      scrappedStatus: "NO",
      importedStatus: "NO",
      vicSubject: "NO",
      previousOwners: 1,
      accidentHistory: [],
      recalls: [],
      marketValueMin: 21200,
      marketValueMax: 23500,
      roadTaxStatus: "Taxed",
      roadTaxExpiry: "31/03/2027"
    }
  };

  // 1. Direct match check
  const matched = demoCars[cleanInput];
  if (matched) {
    const base = matched as VehicleReport;
    const finalPlate = base.plate || query.toUpperCase();
    const finalVin = base.vin || "SADFC8DF9HA" + Math.floor(100000 + Math.random() * 900000);
    const mileage = generateMileageHistory(base.year, base.make);
    const mot = generateMotHistory(base.year, base.score, mileage);
    
    return {
      vin: finalVin,
      plate: finalPlate,
      make: base.make,
      model: base.model,
      year: base.year,
      color: base.color,
      engineSize: base.engineSize,
      fuelType: base.fuelType,
      transmission: base.transmission,
      bodyType: base.bodyType,
      co2Emissions: base.co2Emissions,
      registrationDate: base.registrationDate,
      assemblyPlant: base.assemblyPlant,
      safetyRating: base.safetyRating,
      score: base.score,
      stolenStatus: base.stolenStatus,
      financeOutstanding: base.financeOutstanding,
      writeOffStatus: base.writeOffStatus,
      scrappedStatus: base.scrappedStatus,
      importedStatus: base.importedStatus,
      vicSubject: base.vicSubject,
      previousOwners: base.previousOwners,
      mileageHistory: mileage,
      motHistory: mot,
      accidentHistory: base.accidentHistory || [],
      recalls: base.recalls || [],
      marketValueMin: base.marketValueMin,
      marketValueMax: base.marketValueMax,
      roadTaxStatus: base.roadTaxStatus,
      roadTaxExpiry: base.roadTaxExpiry
    };
  }

  // 2. Procedural generator for any other input (e.g. wildcard query)
  // Let's decide make based on search letters
  let make = "Mercedes-Benz";
  let model = "A-Class A200 AMG Line";
  let year = 2021;
  let color = "Iridium Silver";
  let engineSize = "1332 cc (1.3L)";
  let fuelType = "Petrol";
  let transmission = "7G-DCT Automatic";
  let bodyType = "Hatchback";
  let co2Emissions = "121 g/km";
  let registrationDate = "22/04/2021";
  let assemblyPlant = "Rastatt, Germany";
  let score = 91;

  if (cleanInput.includes("VOLVO") || cleanInput.startsWith("V") || cleanInput.startsWith("Y")) {
    make = "Volvo";
    model = "XC40 T3 Momentum";
    year = 2020;
    color = "Osmium Grey Metallic";
    engineSize = "1477 cc (1.5L)";
    fuelType = "Petrol";
    transmission = "Manual";
    bodyType = "SUV";
    co2Emissions = "142 g/km";
    registrationDate = "05/09/2020";
    assemblyPlant = "Ghent, Belgium";
    score = 89;
  } else if (cleanInput.includes("MINI") || cleanInput.startsWith("M") || cleanInput.startsWith("G")) {
    make = "MINI";
    model = "Hatch Cooper Classic";
    year = 2018;
    color = "British Racing Green";
    engineSize = "1499 cc (1.5L)";
    fuelType = "Petrol";
    transmission = "Manual";
    bodyType = "Hatchback";
    co2Emissions = "114 g/km";
    registrationDate = "14/11/2018";
    assemblyPlant = "Oxford, United Kingdom";
    score = 85;
  } else if (cleanInput.includes("NISSAN") || cleanInput.startsWith("N") || cleanInput.startsWith("E")) {
    make = "Nissan";
    model = "Qashqai 1.3 DIG-T N-Connecta";
    year = 2019;
    color = "Magnetic Blue";
    engineSize = "1332 cc (1.3L)";
    fuelType = "Petrol";
    transmission = "Manual";
    bodyType = "SUV";
    co2Emissions = "121 g/km";
    registrationDate = "19/08/2019";
    assemblyPlant = "Sunderland, United Kingdom";
    score = 84;
  } else if (cleanInput.includes("VW") || cleanInput.includes("GOLF") || cleanInput.startsWith("K") || cleanInput.startsWith("L")) {
    make = "Volkswagen";
    model = "Golf Hatchback 1.5 TSI Life";
    year = 2021;
    color = "Urano Grey";
    engineSize = "1498 cc (1.5L)";
    fuelType = "Petrol";
    transmission = "Manual";
    bodyType = "Hatchback";
    co2Emissions = "122 g/km";
    registrationDate = "10/01/2021";
    assemblyPlant = "Wolfsburg, Germany";
    score = 93;
  }

  const mileageHistory = generateMileageHistory(year, make);
  const motHistory = generateMotHistory(year, score, mileageHistory);

  return {
    vin: type === "vin" && cleanInput.length === 17 ? cleanInput : "SADFC8DF9HA" + Math.floor(100000 + Math.random() * 900000),
    plate: type === "plate" ? query.toUpperCase() : "WP69 XYA",
    make,
    model,
    year,
    color,
    engineSize,
    fuelType,
    transmission,
    bodyType,
    co2Emissions,
    registrationDate,
    assemblyPlant,
    safetyRating: score < 85 ? "4 Star (Euro NCAP)" : "5 Star (Euro NCAP)",
    score,
    stolenStatus: "CLEAN",
    financeOutstanding: "NO",
    writeOffStatus: "CLEAN",
    scrappedStatus: "NO",
    importedStatus: "NO",
    vicSubject: "NO",
    previousOwners: Math.max(1, Math.round((2026 - year) / 2.5)),
    mileageHistory,
    motHistory,
    accidentHistory: [],
    recalls: [],
    marketValueMin: Math.round(22000 * Math.pow(0.86, 2026 - year)),
    marketValueMax: Math.round(28000 * Math.pow(0.86, 2026 - year)),
    roadTaxStatus: "Taxed",
    roadTaxExpiry: "31/10/2026"
  };
}
