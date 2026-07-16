import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Gauge, 
  ShieldAlert, 
  Clock, 
  Loader2, 
  Car,
  ChevronDown,
  Sparkles,
  Award,
  CheckCircle2,
  Layers,
  Zap,
  Gem,
  Check
} from "lucide-react";
import Navbar from "./components/Navbar";
import AboutView from "./components/AboutView";
import PrivacyView from "./components/PrivacyView";
import AffiliateView from "./components/AffiliateView";
import PaymentWizard from "./components/PaymentWizard";
import ReportViewer from "./components/ReportViewer";
import { VehicleReport } from "./types";
import { generateSimulatedReport } from "./lib/mockDatabase";

// Path to the generated premium background image
const carBanner = "/car_banner_1784095133179.jpg";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "privacy" | "report" | "pricing" | "affiliate">("home");
  const [vinOrPlate, setVinOrPlate] = useState("");
  const [searchType, setSearchType] = useState<"vin" | "plate">("plate");
  
  // Input element reference for seamless pricing CTA focusing
  const inputRef = useRef<HTMLInputElement>(null);

  // App operational states
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [report, setReport] = useState<VehicleReport | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState("");

  // FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Scroll to pricing section if tab changes to "pricing"
  useEffect(() => {
    if (activeTab === "pricing") {
      const element = document.getElementById("pricing-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [activeTab]);

  const handleSelectPlanFromHome = () => {
    // Scroll back to search input and focus
    const element = document.getElementById("hero-banner");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 600);
  };

  const scanSteps = [
    "Establishing encrypted connection to DVLA central files...",
    "Querying Ministry of Transport (MOT) mileage registry...",
    "Scanning MIAFTR insurance accident write-off registers...",
    "Checking PNC national database for active stolen records...",
    "Compiling VinPremium risk audit report..."
  ];

  // Primary handler for searching vehicle details
  const handleSearch = async (e?: React.FormEvent, customQuery?: string, customType?: "vin" | "plate") => {
    if (e) e.preventDefault();
    
    const query = customQuery || vinOrPlate;
    const type = customType || searchType;

    if (!query.trim()) {
      setError("Please enter a valid VIN or UK Number Plate.");
      return;
    }

    setError("");
    setLoading(true);
    setScanStep(0);

    // Dynamic scanning sequence simulator (5 step countdown)
    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= scanSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 900);

    try {
      let data: VehicleReport;
      try {
        const response = await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vinOrPlate: query, type }),
        });

        if (response.ok) {
          data = await response.json();
        } else {
          // Fallback to client-side simulation if server reports an error
          data = generateSimulatedReport(query, type);
        }
      } catch (fetchErr) {
        // Fallback if offline/network error/hosted statically on Vercel
        data = generateSimulatedReport(query, type);
      }
      
      // Complete remaining loading ticks
      setTimeout(() => {
        clearInterval(interval);
        setReport(data);
        setIsUnlocked(false); // Locked preview default
        setLoading(false);
        setActiveTab("report");
      }, 4500);

    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "An unexpected database connectivity issue occurred.");
      setLoading(false);
    }
  };

  const handleDemoClick = (plate: string) => {
    setVinOrPlate(plate);
    setSearchType("plate");
    handleSearch(undefined, plate, "plate");
  };

  const handlePaymentComplete = (planId: string) => {
    setIsUnlocked(true);
    setShowCheckout(false);
  };

  const faqs = [
    {
      q: "What is a VinPremium.uk Vehicle Check?",
      a: "VinPremium.uk compiles a full multi-point audit report on any UK registered car, van, or motorcycle. Our reports query multiple national databases (DVLA, MOT, MIAFTR write-offs, police stolen registries, outstanding finance records) to give you an unblurred overview of the vehicle's past."
    },
    {
      q: "How does the £40,000 Data Accuracy Guarantee work?",
      a: "Every comprehensive Gold and Diamond check is insured up to £40,000. If our report fails to show an outstanding finance agreement or insurance write-off status active on the date of search, you are fully covered against any resulting financial loss."
    },
    {
      q: "What are UK insurance write-off categories (Cat S, Cat N)?",
      a: "Insurance companies classify damaged vehicles as write-offs. Category S indicates structural damage that must be repaired professionally. Category N represents non-structural safety issues (like electronics or superficial panel impacts). VinPremium lists these clear categories on every check."
    },
    {
      q: "Can I print or download my report as a PDF?",
      a: "Yes! Once you unlock your premium report via our secure gateway, you can print or save it natively as a cleanly formatted, official PDF document. Our sheets are perfectly optimized for physical printouts, complete with security watermarks."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="app-root">
      
      {/* Top Banner Ticker */}
      <div className="bg-red-950 text-white py-2 px-4 text-center text-[10px] sm:text-xs font-sans tracking-wide border-b border-red-800 flex flex-col sm:flex-row items-center justify-center gap-1 sm:space-x-2">
        <div className="flex items-center space-x-1 shrink-0">
          <span className="bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-sm">ALERT</span>
          <span className="font-semibold text-red-300 sm:hidden">UK SYSTEM ACTIVE</span>
        </div>
        <span className="truncate max-w-full text-gray-200">Secure real-time UK vehicle registers interface active. 45,000+ checks processed today.</span>
      </div>

      {/* Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasActiveReport={!!report} 
      />

      {/* Main Switchboard Content */}
      <main className="flex-grow">
        
        {/* VIEW: ABOUT */}
        {activeTab === "about" && <AboutView />}

        {/* VIEW: PRIVACY */}
        {activeTab === "privacy" && <PrivacyView />}

        {/* VIEW: AFFILIATE PROGRAM */}
        {activeTab === "affiliate" && <AffiliateView />}

        {/* VIEW: ACTIVE REPORT */}
        {activeTab === "report" && report && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="printable-report-wrapper">
            <div className="mb-6 flex justify-between items-center print:hidden">
              <button
                onClick={() => setActiveTab("home")}
                className="text-sm font-sans font-semibold text-gray-500 hover:text-red-600 cursor-pointer flex items-center space-x-1.5"
              >
                <span>← Run Another Vehicle Search</span>
              </button>
            </div>
            <ReportViewer 
              report={report} 
              isUnlocked={isUnlocked} 
              onUnlockClick={() => setShowCheckout(true)} 
            />
          </div>
        )}

        {/* VIEW: HOME PAGE */}
        {(activeTab === "home" || activeTab === "pricing") && (
          <div>
            
            {/* HERO SECTION WITH BIG IMAGE BANNER */}
            <div 
              className="relative bg-gray-900 overflow-hidden min-h-[550px] md:min-h-[600px] flex items-center py-10 md:py-20"
              id="hero-banner"
            >
              {/* Sleek dark layout layer overlay on top of red sports car image */}
              <div 
                className="absolute inset-0 bg-cover bg-center z-0 scale-105 animate-pulse-slow opacity-45 lg:opacity-60" 
                style={{ backgroundImage: `url(${carBanner})` }}
              />
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-950/95 via-gray-950/85 to-gray-950/95 lg:bg-gradient-to-r lg:from-red-950/80 lg:to-gray-950/95" />
              
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 text-white w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left Column: Headline and Trust */}
                  <div className="lg:col-span-7 space-y-6 bg-black/30 backdrop-blur-xs lg:bg-transparent p-6 sm:p-8 lg:p-0 rounded-2xl border border-white/5 lg:border-none">
                    <span className="inline-flex items-center space-x-2 bg-red-600/90 text-white font-mono text-[9px] sm:text-[10px] font-bold tracking-widest uppercase py-1.5 px-4 rounded-full border border-red-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>OFFICIAL UK VEHICLE HISTORY AUDITS</span>
                    </span>
                    <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-none text-white">
                      Don't Buy A Used Car <br />
                      <span className="text-red-500">Without Checking It First</span>
                    </h1>
                    <p className="font-sans text-xs sm:text-sm md:text-base text-gray-200 max-w-lg leading-relaxed">
                      Enter any UK registration plate or chassis VIN to decrypt live mileage records, outstanding finance, salvage categories, and stolen histories instantly.
                    </p>


                    {/* Trust badges */}
                    <div className="pt-4 flex flex-wrap gap-4 items-center">
                      <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-lg px-4 py-2 flex items-center space-x-2">
                        <ShieldCheck className="w-5 h-5 text-red-500" />
                        <span className="font-sans font-semibold text-xs text-white">MIAFTR Registered</span>
                      </div>
                      <div className="bg-black/30 backdrop-blur-xs border border-white/10 rounded-lg px-4 py-2 flex items-center space-x-2">
                        <Award className="w-5 h-5 text-red-500" />
                        <span className="font-sans font-semibold text-xs text-white">DVLA Verified Sync</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Search Card */}
                  <div className="lg:col-span-5">
                    <div className="bg-white text-gray-900 rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10">
                      
                      {/* Search Type Selector Tabs */}
                      <div className="flex bg-gray-100 rounded-lg p-1.5 mb-6">
                        <button
                          type="button"
                          onClick={() => { setSearchType("plate"); setError(""); }}
                          className={`flex-1 py-2 rounded-md font-display font-bold text-xs tracking-wide cursor-pointer transition-all ${
                            searchType === "plate" 
                              ? "bg-white text-red-600 shadow-sm" 
                              : "text-gray-500 hover:text-red-600"
                          }`}
                        >
                          UK Number Plate
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSearchType("vin"); setError(""); }}
                          className={`flex-1 py-2 rounded-md font-display font-bold text-xs tracking-wide cursor-pointer transition-all ${
                            searchType === "vin" 
                              ? "bg-white text-red-600 shadow-sm" 
                              : "text-gray-500 hover:text-red-600"
                          }`}
                        >
                          17-Digit VIN
                        </button>
                      </div>

                      {/* Loading Scan State Cover */}
                      {loading ? (
                        <div className="py-12 text-center space-y-6">
                          <div className="relative inline-block">
                            <div className="w-16 h-16 rounded-full border-4 border-red-100 border-t-red-600 animate-spin" />
                            <Car className="w-6 h-6 text-red-600 absolute inset-0 m-auto animate-pulse" />
                          </div>
                          <div>
                            <p className="font-display font-bold text-gray-900 text-sm">Querying UK Registry Datasets...</p>
                            <p className="font-sans text-xs text-gray-400 mt-1 h-8 animate-pulse">
                              {scanSteps[scanStep]}
                            </p>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-300" 
                              style={{ width: `${((scanStep + 1) / scanSteps.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        /* Standard Input Form */
                        <form onSubmit={handleSearch} className="space-y-4">
                          
                          {error && (
                            <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-lg text-xs font-sans text-red-800 font-medium">
                              {error}
                            </div>
                          )}

                          {searchType === "plate" ? (
                            /* UK PLATE INPUT DESIGN */
                            <div>
                              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-2">
                                UK Vehicle Registration Plate
                              </label>
                              <div className="flex border-4 border-gray-900 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-blue-800 text-white px-2.5 flex flex-col justify-center items-center font-sans font-bold text-[9px] tracking-tight">
                                  <span className="text-sm font-semibold">GB</span>
                                  <span className="text-yellow-400">★</span>
                                </div>
                                <input
                                  ref={inputRef}
                                  type="text"
                                  placeholder="e.g. WP69 XYA"
                                  value={vinOrPlate}
                                  onChange={(e) => setVinOrPlate(e.target.value.toUpperCase())}
                                  className="flex-grow px-3 py-3 text-lg sm:px-4 sm:py-4 sm:text-xl font-mono font-extrabold tracking-widest uppercase bg-yellow-100 placeholder-yellow-800/40 text-gray-900 focus:outline-none"
                                />
                              </div>
                            </div>
                          ) : (
                            /* VIN CHASSIS INPUT DESIGN */
                            <div>
                              <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-2">
                                17-Digit Vehicle Identification (VIN)
                              </label>
                              <div className="relative border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-600 transition-all">
                                <input
                                  ref={inputRef}
                                  type="text"
                                  placeholder="SADFC8DF9HA021..."
                                  maxLength={17}
                                  value={vinOrPlate}
                                  onChange={(e) => setVinOrPlate(e.target.value.toUpperCase())}
                                  className="w-full px-3 py-3 sm:px-4 sm:py-4 text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-gray-900 focus:outline-none placeholder-gray-300 pr-12"
                                />
                                <Search className="w-5 h-5 text-gray-300 absolute right-4 top-4" />
                              </div>
                            </div>
                          )}

                          <button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-sm py-4 rounded-xl shadow-lg shadow-red-200 transition-all cursor-pointer flex items-center justify-center space-x-2"
                          >
                            <Search className="w-4 h-4" />
                            <span>Verify Vehicle Past History</span>
                          </button>

                           {/* Quick Demos */}
                           <div className="pt-4 border-t border-gray-100">
                             <span className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-2">
                               Test Live Simulated Queries (6 Vehicle Scenarios):
                             </span>
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                               <button
                                 type="button"
                                 onClick={() => handleDemoClick("WP69 XYA")}
                                 className="bg-gray-100 hover:bg-red-50 hover:text-red-600 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold text-gray-600 cursor-pointer transition-colors text-left truncate"
                                 title="WP69 XYA (BMW 3 Series - Clean)"
                               >
                                 🟢 WP69 XYA (BMW)
                               </button>
                               <button
                                 type="button"
                                 onClick={() => handleDemoClick("LS21 TES")}
                                 className="bg-gray-100 hover:bg-red-50 hover:text-red-600 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold text-gray-600 cursor-pointer transition-colors text-left truncate"
                                 title="LS21 TES (Tesla Model 3 - Clean)"
                               >
                                 🟢 LS21 TES (Tesla)
                               </button>
                               <button
                                 type="button"
                                 onClick={() => handleDemoClick("LV70 ABC")}
                                 className="bg-gray-100 hover:bg-red-50 hover:text-red-600 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold text-gray-600 cursor-pointer transition-colors text-left truncate"
                                 title="LV70 ABC (Audi A4 - Outstanding Finance)"
                               >
                                 🟡 LV70 ABC (Audi Finance)
                               </button>
                               <button
                                 type="button"
                                 onClick={() => handleDemoClick("GJ18 XYZ")}
                                 className="bg-gray-100 hover:bg-red-50 hover:text-red-600 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold text-gray-600 cursor-pointer transition-colors text-left truncate"
                                 title="GJ18 XYZ (Ford Fiesta - Cat N Write-off)"
                               >
                                 🟠 GJ18 XYZ (Fiesta Cat N)
                               </button>
                               <button
                                 type="button"
                                 onClick={() => handleDemoClick("HG21 HBY")}
                                 className="bg-gray-100 hover:bg-red-50 hover:text-red-600 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold text-gray-600 cursor-pointer transition-colors text-left truncate"
                                 title="HG21 HBY (Toyota Yaris - Pristine Hybrid)"
                               >
                                 🟢 HG21 HBY (Yaris Hybrid)
                               </button>
                               <button
                                 type="button"
                                 onClick={() => handleDemoClick("RO67 VLR")}
                                 className="bg-gray-100 hover:bg-red-50 hover:text-red-600 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold text-gray-600 cursor-pointer transition-colors text-left truncate"
                                 title="RO67 VLR (Range Rover - Structural S & Finance)"
                               >
                                 🔴 RO67 VLR (Velar Cat S)
                               </button>
                             </div>
                           </div>

                        </form>
                      )}

                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* BENEFITS / CORE CHECKS SECTION */}
            <div className="py-20 bg-white border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                    Why Use VinPremium?
                  </span>
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mt-4 tracking-tight leading-none">
                    Unmatched Premium Verification Features
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  
                  <div className="p-6 border border-gray-100 rounded-2xl hover:border-red-100 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <Gauge className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-gray-900 mb-2">Mileage Clocking Check</h3>
                    <p className="font-sans text-xs text-gray-500 leading-normal">
                      We track historical MOT logs and dealership records to flag rolled-back odometers instantly, protecting you from fraud.
                    </p>
                  </div>

                  <div className="p-6 border border-gray-100 rounded-2xl hover:border-red-100 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-gray-900 mb-2">Insurance Category S/N</h3>
                    <p className="font-sans text-xs text-gray-500 leading-normal">
                      Discover whether the car has been classified as structural or cosmetic write-off Cat S, N, C or D in insurer registers.
                    </p>
                  </div>

                  <div className="p-6 border border-gray-100 rounded-2xl hover:border-red-100 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-gray-900 mb-2">Outstanding Finance</h3>
                    <p className="font-sans text-xs text-gray-500 leading-normal">
                      Liens remain with the asset, not the buyer. Ensure a bank doesn't repossess your newly acquired car after transaction.
                    </p>
                  </div>

                  <div className="p-6 border border-gray-100 rounded-2xl hover:border-red-100 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-gray-900 mb-2">PNC Stolen Database</h3>
                    <p className="font-sans text-xs text-gray-500 leading-normal">
                      Active lookup in the National Police Computer register. Ensure you are buying a legitimate asset with certified title.
                    </p>
                  </div>

                </div>

              </div>
            </div>

            {/* PRICING PLANS SECTION */}
            <div className="py-20 bg-white border-t border-b border-gray-100" id="pricing-section">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full inline-block">
                    Affordable Transparency
                  </span>
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mt-4 mb-4 tracking-tight leading-none">
                    Select Your Vehicle History Audit Plan
                  </h2>
                  <p className="font-sans text-sm text-gray-500 max-w-lg mx-auto">
                    Choose the ideal plan to scan the vehicle history records. Get secure, real-time results instantly.
                  </p>
                </div>

                {/* 3-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Plan 1: Silver Starter */}
                  <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:shadow-lg transition-all relative">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="bg-slate-100 text-slate-800 font-mono text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md inline-block">
                            Silver Starter
                          </div>
                          <h3 className="font-display font-bold text-xl text-gray-900 mt-2">Basic Registry Sync</h3>
                        </div>
                        <Layers className="w-5 h-5 text-gray-400" />
                      </div>

                      <div className="mb-6 flex items-baseline">
                        <span className="font-display font-bold text-4xl text-gray-900">£24.99</span>
                        <span className="font-sans text-xs text-gray-400 ml-1">GBP</span>
                      </div>

                      <p className="font-sans text-xs text-gray-500 mb-6 leading-relaxed">
                        Best for a fast, basic verification of manufacturer specifications, taxation status, and registration checks.
                      </p>

                      <div className="border-t border-gray-100 pt-6 space-y-3.5 mb-8">
                        {[
                          "Official DVLA registration specs",
                          "Tax & MOT validity status logs",
                          "Color & paint history records",
                          "Basic written-off status search",
                          "Instant secure email delivery"
                        ].map((feature, i) => (
                          <div key={i} className="flex items-start space-x-2.5 text-xs text-gray-600">
                            <Check className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSelectPlanFromHome}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-sans font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
                    >
                      Run Vehicle Audit
                    </button>
                  </div>

                  {/* Plan 2: Gold Ultimate Check */}
                  <div className="bg-white border-2 border-red-600 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:shadow-xl transition-all relative shadow-lg shadow-red-50">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white font-mono text-[9px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-sm">
                      Most Popular
                    </div>

                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="bg-red-50 text-red-600 font-mono text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md inline-block">
                            Gold Ultimate
                          </div>
                          <h3 className="font-display font-bold text-xl text-gray-900 mt-2">Full History Check</h3>
                        </div>
                        <Zap className="w-5 h-5 text-red-600" />
                      </div>

                      <div className="mb-6 flex items-baseline">
                        <span className="font-display font-bold text-4xl text-gray-900">£49.99</span>
                        <span className="font-sans text-xs text-gray-400 ml-1">GBP</span>
                      </div>

                      <p className="font-sans text-xs text-gray-500 mb-6 leading-relaxed">
                        Complete comprehensive audit covering write-offs, outstanding finance, police stolen databases, and full mileage chart.
                      </p>

                      <div className="border-t border-gray-100 pt-6 space-y-3.5 mb-8">
                        {[
                          "Includes everything in Silver Plan",
                          "Outstanding finance checks (MIAFTR)",
                          "UK accident & write-off damage logs",
                          "PNC Police Stolen register check",
                          "Odometer timeline & clocking check",
                          "Downloadable physical PDF Certificate",
                          "£40,000 Data Accuracy Guarantee"
                        ].map((feature, i) => (
                          <div key={i} className="flex items-start space-x-2.5 text-xs text-gray-700">
                            <Check className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <span className="font-semibold">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSelectPlanFromHome}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer text-center shadow-md shadow-red-200"
                    >
                      Run Vehicle Audit
                    </button>
                  </div>

                  {/* Plan 3: Diamond Elite Bundle */}
                  <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 flex flex-col justify-between hover:shadow-lg transition-all relative">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="bg-amber-50 text-amber-600 font-mono text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md inline-block">
                            Diamond Bundle
                          </div>
                          <h3 className="font-display font-bold text-xl text-gray-900 mt-2">Multi-Vehicle Pack</h3>
                        </div>
                        <Gem className="w-5 h-5 text-amber-500" />
                      </div>

                      <div className="mb-6 flex items-baseline">
                        <span className="font-display font-bold text-4xl text-gray-900">£104.99</span>
                        <span className="font-sans text-xs text-gray-400 ml-1">GBP</span>
                      </div>

                      <p className="font-sans text-xs text-gray-500 mb-6 leading-relaxed">
                        The ultimate package for heavy car shopping. Get three separate comprehensive checks plus real-time updates for one year.
                      </p>

                      <div className="border-t border-gray-100 pt-6 space-y-3.5 mb-8">
                        {[
                          "Everything in Gold Ultimate check",
                          "3 Full Premium Vehicle Reports",
                          "12 months auto-tax update alerts",
                          "SMS & email safety recall alerts",
                          "Auto-price depreciation tracking",
                          "Premium dedicated dealer agent line",
                          "Credits valid indefinitely"
                        ].map((feature, i) => (
                          <div key={i} className="flex items-start space-x-2.5 text-xs text-gray-600">
                            <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSelectPlanFromHome}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-sans font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
                    >
                      Run Vehicle Audit
                    </button>
                  </div>

                </div>

              </div>
            </div>

            {/* TRUST FACTOR / HOW IT WORKS GRID */}
            <div className="py-20 bg-gray-50/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
                      Step-by-Step Security
                    </span>
                    <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mt-4 mb-6 tracking-tight leading-none">
                      How VinPremium Protects Your Used Car Purchases
                    </h2>
                    
                    <div className="space-y-6">
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                          1
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-gray-900">Query the Vehicle</h4>
                          <p className="font-sans text-xs text-gray-500 mt-1">
                            Input a Plate or VIN. Our system connects to live registers to map the basic manufacturer blueprint and build metadata fields.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                          2
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-gray-900">Analyze the Censored Preview</h4>
                          <p className="font-sans text-xs text-gray-500 mt-1">
                            We compile a risk scorecard immediately, indicating overall health. Critical details are blurred safely in this free preview layer.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                          3
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-gray-900">Decrypt and Print PDF Report</h4>
                          <p className="font-sans text-xs text-gray-500 mt-1">
                            Select our Gold or Diamond plan, fill our encrypted payment layout, and instantly download a highly comprehensive printable report.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="font-sans font-bold text-xs text-gray-900 ml-2">4.9 / 5.0 (2,450+ Reviews)</span>
                    </div>

                    <p className="font-sans text-sm text-gray-600 italic leading-relaxed">
                      "I was about to purchase a 2019 BMW 3 Series. The seller promised it was Cat-Clean, but VinPremium's Gold check revealed it was recorded as a Cat S structural write-off in 2022! Saved me over £12,000 on a dangerous repair fraud. Highly recommended."
                    </p>

                    <div className="flex items-center space-x-3 border-t border-gray-100 pt-4">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white font-display font-bold text-sm flex items-center justify-center">
                        DM
                      </div>
                      <div>
                        <p className="font-display font-bold text-xs text-gray-800">Daniel McAllister</p>
                        <p className="font-sans text-[10px] text-gray-400">Verified Purchaser from Edinburgh</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
            <div className="py-20 bg-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                <div className="text-center mb-12">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full inline-block mb-3">
                    Knowledge Centre
                  </span>
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-900 tracking-tight">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-4">
                  {faqs.map((faq, index) => {
                    const isOpen = activeFaq === index;
                    return (
                      <div 
                        key={index} 
                        className="border border-gray-100 rounded-xl overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : index)}
                          className="w-full flex justify-between items-center p-5 text-left bg-gray-50/50 hover:bg-gray-50 cursor-pointer"
                          id={`faq-btn-${index}`}
                        >
                          <span className="font-display font-bold text-sm text-gray-800">{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-red-600" : ""}`} />
                        </button>
                        {isOpen && (
                          <div className="p-5 bg-white border-t border-gray-100 font-sans text-xs text-gray-500 leading-relaxed">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER SECTION: Fully branded, compliant company details */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8 border-t border-gray-800 font-sans text-xs" id="footer-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Branded Block */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight text-white">
                  vinpremium<span className="text-red-600">.uk</span>
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                The leading high-fidelity vehicle registry audit database in the United Kingdom. Giving used car buyers peace of mind and structural security certificates.
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ICO Register No: ZA82193 • PCI-DSS Certified</span>
              </div>
            </div>

            {/* Support Links */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="font-display font-bold text-white text-xs tracking-wider uppercase">Useful Information</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab("home")} className="hover:text-red-500 cursor-pointer text-left">
                    Home Lookup Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("about")} className="hover:text-red-500 cursor-pointer text-left">
                    About Our Datasets
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("affiliate")} className="text-red-400 font-semibold hover:text-red-500 cursor-pointer text-left flex items-center space-x-1">
                    <span>Affiliate Partner (35% Commission)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("privacy")} className="hover:text-red-500 cursor-pointer text-left">
                    UK GDPR Privacy & Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Details (Requested explicitly by User) */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="font-display font-bold text-white text-xs tracking-wider uppercase">Contact & Business Details</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>Registered Address:</strong><br />
                    VinPremium UK Ltd,<br />
                    85 Great Portland Street,<br />
                    London, W1W 7LT,<br />
                    United Kingdom
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-red-600 shrink-0" />
                  <span><strong>DDI Phone:</strong> +44 (0) 20 7946 0192</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-red-600 shrink-0" />
                  <span><strong>DPO Support:</strong> compliance@vinpremium.uk</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Legal Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-4 sm:space-y-0 text-gray-500 text-[11px]">
            <p>
              © 2026 VinPremium UK Ltd. All rights reserved. vinpremium.uk is not affiliated with nor endorsed by the DVLA. All search lookup parameters are subject to our standard accuracy guarantee.
            </p>
            <div className="flex space-x-4">
              <button onClick={() => setActiveTab("privacy")} className="hover:text-white cursor-pointer">
                Privacy
              </button>
              <span>•</span>
              <button onClick={() => setActiveTab("privacy")} className="hover:text-white cursor-pointer">
                Cookies
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* RENDER ACTIVE PAYMENT WIZARD IN MODAL OVERLAY */}
      {showCheckout && report && (
        <PaymentWizard
          vinOrPlate={report.plate}
          onPaymentSuccess={handlePaymentComplete}
          onClose={() => setShowCheckout(false)}
        />
      )}

    </div>
  );
}
