import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { VehicleReport } from "./src/types";
import { generateSimulatedReport } from "./src/lib/mockDatabase";

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
