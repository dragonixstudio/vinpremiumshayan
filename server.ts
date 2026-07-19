import express from "express";
import path from "path";
import fs from "fs";
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
  app.use(express.urlencoded({ extended: true }));

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

  // Local JSON File Database for storing payments
  const PAYMENTS_FILE = path.join(process.cwd(), "payments.json");

  interface PaymentInfo {
    email: string;
    product_id: string;
    product_name: string;
    order_id: string;
    registration_number: string;
    payment_status: string;
    purchase_date: string;
    license_key?: string;
  }

  function readPayments(): PaymentInfo[] {
    try {
      if (!fs.existsSync(PAYMENTS_FILE)) {
        return [];
      }
      const data = fs.readFileSync(PAYMENTS_FILE, "utf-8");
      return JSON.parse(data) || [];
    } catch (err) {
      console.error("Error reading payments file:", err);
      return [];
    }
  }

  function writePayments(payments: PaymentInfo[]) {
    try {
      fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing payments file:", err);
    }
  }

  // GET /api/check-payment
  app.get("/api/check-payment", (req, res) => {
    const email = String(req.query.email || "").trim().toLowerCase();
    const registration = String(req.query.registration || req.query.registration_number || "").trim().toUpperCase();
    const key = String(req.query.key || req.query.payment_id || req.query.order_id || req.query.sale_id || "").trim();

    const payments = readPayments();

    // 1. First priority: Check by specific key / transaction ID / license key
    if (key) {
      const record = payments.find(p => 
        (p.order_id && p.order_id.toLowerCase() === key.toLowerCase()) ||
        (p.license_key && p.license_key.toLowerCase() === key.toLowerCase())
      );

      if (record && (record.payment_status === "paid" || record.payment_status === "completed")) {
        return res.json({ 
          paid: true, 
          registration: record.registration_number, 
          email: record.email,
          order_id: record.order_id,
          license_key: record.license_key || ""
        });
      }
    }

    // 2. Second priority: Check by email and registration
    if (email && registration) {
      const record = payments.find(p => 
        p.email === email && 
        p.registration_number === registration && 
        (p.payment_status === "paid" || p.payment_status === "completed")
      );

      if (record) {
        return res.json({ 
          paid: true, 
          registration: record.registration_number, 
          email: record.email,
          order_id: record.order_id,
          license_key: record.license_key || ""
        });
      }
    }

    return res.json({ paid: false });
  });

  // POST /api/gumroad-webhook
  app.post("/api/gumroad-webhook", (req, res) => {
    console.log("Received Gumroad webhook payload:", req.body);

    const body = req.body || {};
    
    // Extract fields with flexible fallbacks
    const email = (body.email || body.buyer_email || body.customer_email || "").trim().toLowerCase();
    const product_id = (body.product_id || body.permalink || "gold-check");
    const product_name = (body.product_name || "Gold Ultimate Check");
    const order_id = String(body.order_number || body.sale_id || body.id || "ord_" + Math.random().toString(36).substring(2, 9));
    const license_key = (body.license_key || "").trim();
    
    // Extract registration number from root or custom_fields
    let registration_number = "";
    if (body.registration_number) {
      registration_number = body.registration_number;
    } else if (body.registration) {
      registration_number = body.registration;
    } else if (body.plate) {
      registration_number = body.plate;
    } else if (body.custom_fields) {
      let customFieldsObj = body.custom_fields;
      if (typeof customFieldsObj === "string") {
        try {
          customFieldsObj = JSON.parse(customFieldsObj);
        } catch (e) {
          // ignore parsing error
        }
      }
      if (typeof customFieldsObj === "object" && customFieldsObj !== null) {
        registration_number = 
          customFieldsObj.registration_number || 
          customFieldsObj.registration || 
          customFieldsObj.plate || 
          customFieldsObj["Registration Number"] || 
          customFieldsObj["registration_number"] || 
          "";
      }
    }

    // Fallback to query params if any
    if (!registration_number && req.query.registration) {
      registration_number = String(req.query.registration);
    }
    if (!registration_number && req.query.registration_number) {
      registration_number = String(req.query.registration_number);
    }

    registration_number = registration_number.trim().toUpperCase();

    const payment_status = (body.payment_status || "paid").trim().toLowerCase();
    const purchase_date = body.created_at || new Date().toISOString();

    if (!email || !registration_number) {
      console.warn("Webhook Warning: Missing critical details. email:", email, "registration_number:", registration_number);
    }

    const payments = readPayments();
    
    // Avoid duplicates by order ID
    const existingIndex = payments.findIndex(p => p.order_id === order_id);
    
    const paymentRecord: PaymentInfo = {
      email,
      product_id,
      product_name,
      order_id,
      registration_number,
      payment_status: "paid", // webhook ping indicates payment success
      purchase_date,
      license_key: license_key || undefined
    };

    if (existingIndex > -1) {
      payments[existingIndex] = paymentRecord;
    } else {
      payments.push(paymentRecord);
    }

    writePayments(payments);
    console.log(`Stored payment: Email=${email}, Plate=${registration_number}, OrderID=${order_id}, LicenseKey=${license_key}`);

    return res.json({ success: true, message: "Webhook processed and stored." });
  });

  // GET /api/gumroad-webhook (Convenience GET endpoint for easy testing / simulation)
  app.get("/api/gumroad-webhook", (req, res) => {
    const email = String(req.query.email || "").trim().toLowerCase();
    const registration = String(req.query.registration || req.query.registration_number || "").trim().toUpperCase();
    const product_id = String(req.query.product_id || "gold-check");
    const product_name = String(req.query.product_name || "Gold Ultimate Check");
    const order_key = String(req.query.key || req.query.payment_id || req.query.order_id || "").trim();

    if (!email || !registration) {
      return res.status(400).json({ error: "email and registration query parameters are required for GET simulation" });
    }

    const payments = readPayments();
    const order_id = order_key || "sim_" + Math.random().toString(36).substring(2, 9).toUpperCase();
    const license_key = "lic_" + Math.random().toString(36).substring(2, 9).toUpperCase();
    
    const paymentRecord: PaymentInfo = {
      email,
      product_id,
      product_name,
      order_id,
      registration_number: registration,
      payment_status: "paid",
      purchase_date: new Date().toISOString(),
      license_key
    };

    payments.push(paymentRecord);
    writePayments(payments);
    console.log(`Simulated payment stored: Email=${email}, Plate=${registration}, OrderID=${order_id}, LicenseKey=${license_key}`);

    return res.json({
      success: true,
      message: "Simulation payment created successfully",
      payment: paymentRecord
    });
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
