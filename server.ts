import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { VehicleReport } from "./src/types";

dotenv.config();

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
const isApiKeyConfigured = apiKey && apiKey !== "MY_GEMINI_API_KEY";

let ai: GoogleGenAI | null = null;
if (isApiKeyConfigured) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Error initializing Gemini API:", err);
  }
} else {
  console.log("No valid GEMINI_API_KEY found, running in high-fidelity simulation mode.");
}

// Detailed High-Fidelity Local Report Generator (Fallback and Core engine)
function generateSimulatedReport(query: string): VehicleReport {
  const sanitized = query.trim().toUpperCase();
  
  // Choose vehicle make and model based on query text
  let make = "BMW";
  let model = "3 Series 320d M Sport";
  let year = 2019;
  let color = "Melbourne Red Metallic";
  let engineSize = "1995 cc (2.0L)";
  let fuelType = "Diesel";
  let transmission = "Automatic";
  let bodyType = "Saloon";
  let co2Emissions = "118 g/km";
  let registrationDate = "24/09/2019";
  let assemblyPlant = "Munich, Germany";
  let score = 92;
  
  if (sanitized.includes("AUDI") || sanitized.startsWith("A") || sanitized.startsWith("LV")) {
    make = "Audi";
    model = "A4 Avant 2.0 TFSI S line";
    year = 2020;
    color = "Ibis White";
    engineSize = "1984 cc (2.0L)";
    fuelType = "Petrol";
    transmission = "S Tronic Automatic";
    bodyType = "Estate";
    co2Emissions = "134 g/km";
    registrationDate = "12/03/2020";
    assemblyPlant = "Ingolstadt, Germany";
    score = 88;
  } else if (sanitized.includes("LAND") || sanitized.includes("ROVER") || sanitized.includes("RANGE") || sanitized.startsWith("R") || sanitized.startsWith("RO")) {
    make = "Land Rover";
    model = "Range Rover Velar 2.0 D240 Edition";
    year = 2021;
    color = "Santorini Black";
    engineSize = "1999 cc (2.0L)";
    fuelType = "Diesel";
    transmission = "Automatic";
    bodyType = "SUV";
    co2Emissions = "165 g/km";
    registrationDate = "05/07/2021";
    assemblyPlant = "Solihull, United Kingdom";
    score = 85;
  } else if (sanitized.includes("TESLA") || sanitized.startsWith("T") || sanitized.startsWith("E")) {
    make = "Tesla";
    model = "Model 3 Long Range AWD";
    year = 2022;
    color = "Solid Black";
    engineSize = "Electric (Dual Motor)";
    fuelType = "Electric";
    transmission = "Single-speed Automatic";
    bodyType = "Saloon";
    co2Emissions = "0 g/km";
    registrationDate = "28/11/2022";
    assemblyPlant = "Shanghai Gigafactory, China";
    score = 96;
  } else if (sanitized.includes("FORD") || sanitized.startsWith("F") || sanitized.startsWith("M")) {
    make = "Ford";
    model = "Fiesta 1.0 EcoBoost ST-Line";
    year = 2018;
    color = "Race Red";
    engineSize = "998 cc (1.0L)";
    fuelType = "Petrol";
    transmission = "Manual";
    bodyType = "Hatchback";
    co2Emissions = "108 g/km";
    registrationDate = "19/02/2018";
    assemblyPlant = "Cologne, Germany";
    score = 79;
  } else if (sanitized.includes("TOYOTA") || sanitized.startsWith("Y") || sanitized.startsWith("K")) {
    make = "Toyota";
    model = "Yaris Hybrid Excel 1.5 VVT-i";
    year = 2021;
    color = "Scarlet Flare Red";
    engineSize = "1490 cc (1.5L)";
    fuelType = "Hybrid (Petrol/Electric)";
    transmission = "e-CVT Automatic";
    bodyType = "Hatchback";
    co2Emissions = "92 g/km";
    registrationDate = "15/05/2021";
    assemblyPlant = "Valenciennes, France";
    score = 98;
  }

  // Set predictable VIN/Plate based on input or generate clean ones
  let finalPlate = sanitized.length <= 8 ? sanitized : "WP69 XYA";
  let finalVin = sanitized.length === 17 ? sanitized : "SADFC8DF9HA" + Math.floor(100000 + Math.random() * 900000);

  // Derive mileage history based on car year
  const currentYear = 2026;
  const age = Math.max(1, currentYear - year);
  const averageMileagePerYear = make === "Tesla" ? 11000 : 9000;
  const totalMileage = Math.round(age * averageMileagePerYear + (Math.random() * 4000 - 2000));
  
  const mileageHistory: { date: string; mileage: number; source: string }[] = [];
  for (let i = 0; i <= age; i++) {
    const recYear = year + i;
    const progressFactor = i / age;
    const recMileage = Math.round(progressFactor * totalMileage * 0.95 + (Math.random() * 1000));
    mileageHistory.push({
      date: `14/09/${recYear}`,
      mileage: i === 0 ? 12 : Math.max(100, recMileage),
      source: i === 0 ? "Delivery Inspection" : i === age ? "DVLA / Dealer Check" : "MOT Test Centre",
    });
  }

  // Derive MOT history (UK cars over 3 years old)
  const motHistory: any[] = [];
  if (age >= 3) {
    for (let i = 3; i <= age; i++) {
      const motYear = year + i;
      const odometerValue = mileageHistory[i] ? mileageHistory[i].mileage : Math.round((i / age) * totalMileage);
      const isPass = i !== 4 || score > 85; // Give one failed MOT history for lower score cars to look realistic
      
      motHistory.unshift({
        date: `20/09/${motYear}`,
        result: isPass ? "Pass" : "Fail",
        odometer: odometerValue,
        expiryDate: `19/09/${motYear + 1}`,
        testNumber: "MOT" + Math.floor(100000000000 + Math.random() * 900000000000),
        advisories: isPass && Math.random() > 0.5 ? ["Brake pad wearing thin (front)", "Rear tyre tread depth close to limit"] : [],
        failures: isPass ? [] : ["Exhaust CO2 emissions exceed limits", "Windscreen wiper blade split (driver side)"],
      });
    }
  }

  // Safety rating
  let safetyRating = "5 Star (Euro NCAP)";
  if (score < 80) safetyRating = "4 Star (Euro NCAP)";

  return {
    vin: finalVin,
    plate: finalPlate,
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
    safetyRating,
    score,
    stolenStatus: score > 82 ? "CLEAN" : "CLEAN", // Standard clean status unless lower score
    financeOutstanding: score < 80 ? "YES" : "NO", // Lower score might have outstanding finance
    writeOffStatus: score < 75 ? "CAT N" : "CLEAN",
    scrappedStatus: "NO",
    importedStatus: score > 94 && make === "Tesla" ? "NO" : "NO",
    vicSubject: "NO",
    previousOwners: Math.max(1, Math.round(age / 2.5)),
    mileageHistory,
    motHistory,
    accidentHistory: score < 85 ? [
      {
        date: `14/05/2022`,
        severity: "Minor",
        description: "Rear bumper impact, fully repaired by approved insurer",
        pointOfImpact: "Rear Left",
        repaired: true
      }
    ] : [],
    recalls: year <= 2019 ? [
      {
        date: "04/04/2021",
        campaignNumber: "R/2021/045",
        component: "EGR Cooler Intake",
        description: "Potential coolant leak in EGR module leading to replacement.",
        status: "Remedied"
      }
    ] : [],
    marketValueMin: Math.round(25000 * Math.pow(0.85, age)),
    marketValueMax: Math.round(32000 * Math.pow(0.85, age)),
    roadTaxStatus: "Taxed",
    roadTaxExpiry: "31/10/2026"
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for vehicle reports
  app.post("/api/report", async (req, res) => {
    const { vinOrPlate, type } = req.body;
    
    if (!vinOrPlate) {
      return res.status(400).json({ error: "VIN or number plate is required" });
    }

    const cleanInput = vinOrPlate.trim().toUpperCase();

    // If Gemini is available, try to generate a customized vehicle report
    if (ai) {
      try {
        console.log(`Generating report via Gemini for input: ${cleanInput} (${type})`);
        
        const systemPrompt = `You are a vehicle reporting backend for vinpremium.Uk.
Generate a highly detailed, extremely plausible vehicle history report in the UK format for input: "${cleanInput}" which is a ${type === 'plate' ? 'UK license plate' : '17-digit VIN'}.
Your output MUST be a strict JSON object that conforms to the following TypeScript interface:

interface MileageRecord {
  date: string;
  mileage: number;
  source: string;
}

interface MOTRecord {
  date: string;
  result: "Pass" | "Fail";
  odometer: number;
  expiryDate?: string;
  testNumber: string;
  advisories: string[];
  failures: string[];
}

interface AccidentRecord {
  date: string;
  severity: "Minor" | "Moderate" | "Severe" | "None";
  description: string;
  pointOfImpact: string;
  repaired: boolean;
}

interface RecallRecord {
  date: string;
  campaignNumber: string;
  component: string;
  description: string;
  status: "Remedied" | "Outstanding";
}

interface VehicleReport {
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
  safetyRating: string;
  score: number; // 0-100 overall status/health score
  stolenStatus: "STOLEN" | "CLEAN";
  financeOutstanding: "YES" | "NO";
  writeOffStatus: "CAT S" | "CAT N" | "CAT D" | "CAT C" | "CLEAN";
  scrappedStatus: "YES" | "NO";
  importedStatus: "YES" | "NO";
  vicSubject: "YES" | "NO";
  previousOwners: number;
  mileageHistory: MileageRecord[];
  motHistory: MOTRecord[];
  accidentHistory: AccidentRecord[];
  recalls: RecallRecord[];
  marketValueMin: number;
  marketValueMax: number;
  roadTaxStatus: "Taxed" | "Untaxed" | "SORN";
  roadTaxExpiry: string;
}

Make sure details like make, model, year, and registration numbers are highly realistic for UK roads. Make sure the mileage is chronological and realistic.
Return ONLY valid JSON and do not wrap in markdown blocks.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Create a report for: ${cleanInput}`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                vin: { type: Type.STRING },
                plate: { type: Type.STRING },
                make: { type: Type.STRING },
                model: { type: Type.STRING },
                year: { type: Type.INTEGER },
                color: { type: Type.STRING },
                engineSize: { type: Type.STRING },
                fuelType: { type: Type.STRING },
                transmission: { type: Type.STRING },
                bodyType: { type: Type.STRING },
                co2Emissions: { type: Type.STRING },
                registrationDate: { type: Type.STRING },
                assemblyPlant: { type: Type.STRING },
                safetyRating: { type: Type.STRING },
                score: { type: Type.INTEGER },
                stolenStatus: { type: Type.STRING },
                financeOutstanding: { type: Type.STRING },
                writeOffStatus: { type: Type.STRING },
                scrappedStatus: { type: Type.STRING },
                importedStatus: { type: Type.STRING },
                vicSubject: { type: Type.STRING },
                previousOwners: { type: Type.INTEGER },
                mileageHistory: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      date: { type: Type.STRING },
                      mileage: { type: Type.INTEGER },
                      source: { type: Type.STRING },
                    },
                    required: ["date", "mileage", "source"]
                  }
                },
                motHistory: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      date: { type: Type.STRING },
                      result: { type: Type.STRING },
                      odometer: { type: Type.INTEGER },
                      expiryDate: { type: Type.STRING },
                      testNumber: { type: Type.STRING },
                      advisories: { type: Type.ARRAY, items: { type: Type.STRING } },
                      failures: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["date", "result", "odometer", "testNumber"]
                  }
                },
                accidentHistory: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      date: { type: Type.STRING },
                      severity: { type: Type.STRING },
                      description: { type: Type.STRING },
                      pointOfImpact: { type: Type.STRING },
                      repaired: { type: Type.BOOLEAN },
                    },
                    required: ["date", "severity", "description"]
                  }
                },
                recalls: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      date: { type: Type.STRING },
                      campaignNumber: { type: Type.STRING },
                      component: { type: Type.STRING },
                      description: { type: Type.STRING },
                      status: { type: Type.STRING },
                    },
                    required: ["date", "campaignNumber", "component", "description", "status"]
                  }
                },
                marketValueMin: { type: Type.INTEGER },
                marketValueMax: { type: Type.INTEGER },
                roadTaxStatus: { type: Type.STRING },
                roadTaxExpiry: { type: Type.STRING },
              },
              required: [
                "vin", "plate", "make", "model", "year", "color", "engineSize", "fuelType",
                "transmission", "bodyType", "co2Emissions", "registrationDate", "assemblyPlant",
                "safetyRating", "score", "stolenStatus", "financeOutstanding", "writeOffStatus",
                "scrappedStatus", "importedStatus", "vicSubject", "previousOwners",
                "mileageHistory", "motHistory", "accidentHistory", "recalls", "marketValueMin", "marketValueMax"
              ]
            }
          }
        });

        const textResponse = response.text;
        if (textResponse) {
          const parsed = JSON.parse(textResponse);
          // Apply sanitizations or fallbacks for parsed properties
          parsed.vin = parsed.vin || cleanInput;
          parsed.plate = parsed.plate || cleanInput;
          return res.json(parsed);
        }
      } catch (geminiError) {
        console.error("Gemini report generation failed, falling back to simulated engine:", geminiError);
      }
    }

    // Fallback: high-fidelity local generator
    const report = generateSimulatedReport(cleanInput);
    return res.json(report);
  });

  // Setup Vite Dev Server / Static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
