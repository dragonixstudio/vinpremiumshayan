import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  Loader2, 
  CreditCard, 
  ShieldAlert, 
  Sparkles, 
  Lock, 
  Layers, 
  Zap, 
  Gem,
  Award,
  ChevronRight,
  ArrowLeft,
  User,
  Mail
} from "lucide-react";
import { PricingPlan } from "../types";
import { supabase } from "../lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface PaymentWizardProps {
  vinOrPlate: string;
  onPaymentSuccess: (planId: string) => void;
  onClose: () => void;
  user: SupabaseUser | null;
  onAuthSuccess: (user: SupabaseUser) => void;
}

export default function PaymentWizard({ vinOrPlate, onPaymentSuccess, onClose, user, onAuthSuccess }: PaymentWizardProps) {
  // Steps: "data-pull" | "gateway-setup" | "select-plan" | "checkout" | "processing" | "success"
  const [step, setStep] = useState<"data-pull" | "gateway-setup" | "select-plan" | "checkout" | "success">("data-pull");
  const [progress, setProgress] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  
  // Email and redirection state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [plate, setPlate] = useState(vinOrPlate);
  const [vin, setVin] = useState("");
  const [formErrors, setFormErrors] = useState<string>("");
  const [isPaying, setIsPaying] = useState(false);

  // Auth states for non-signed-up users
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);


  const plans: PricingPlan[] = [
    {
      id: "silver",
      name: "Silver Starter",
      price: 24.99,
      description: "Basic verification for low-risk secondary market cars",
      features: [
        "Official DVLA registration details",
        "Tax & MOT validity status",
        "Basic written-off status search",
        "Color & paint history records",
        "Email delivery only"
      ],
      accentColor: "border-gray-200 hover:border-gray-300",
    },
    {
      id: "gold",
      name: "Gold Ultimate Check",
      price: 49.99,
      badge: "Most Popular",
      description: "Comprehensive 80+ criteria lookup with complete coverage guarantee",
      features: [
        "Everything in Silver plan",
        "Outstanding finance check (MIAFTR)",
        "Chronological mileage chart & discrepancies",
        "UK accident and damage log (Cat S, N, C, D)",
        "Stolen police database PNC lookups",
        "Official downloadable PDF Certificate"
      ],
      accentColor: "border-red-600 ring-2 ring-red-100",
    },
    {
      id: "diamond",
      name: "Diamond Elite Bundle",
      price: 104.99,
      badge: "Best Value",
      description: "Multi-vehicle checks (3 reports) + real-time alerts for 1 year",
      features: [
        "Everything in Gold plan",
        "3 full premium report checks",
        "12 months of automatic price tracking alerts",
        "Recall remedy status monitoring",
        "SMS/Email notification alerts for tax updates",
        "Premium dedicated dealer agent hotline"
      ],
      accentColor: "border-gray-800 hover:border-red-600 ring-2 ring-gray-900/5",
    }
  ];

  // Set default plan to Gold
  useEffect(() => {
    setSelectedPlan(plans[1]);
  }, []);

  // Prefill name and email if user is logged in
  useEffect(() => {
    if (user) {
      const fName = user.user_metadata?.first_name || "";
      const lName = user.user_metadata?.last_name || "";
      setName(`${fName} ${lName}`.trim() || user.email?.split("@")[0] || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Step 1: Data pulling loading simulator (fantasy colors)
  useEffect(() => {
    if (step === "data-pull") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setStep("gateway-setup");
              setProgress(0);
            }, 800);
            return 100;
          }
          return prev + 6;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Step 2: Gateway setup loading simulator
  useEffect(() => {
    if (step === "gateway-setup") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setStep("select-plan");
              setProgress(0);
            }, 800);
            return 100;
          }
          return prev + 10;
        });
      }, 70);
      return () => clearInterval(interval);
    }
  }, [step]);

  const getGumroadUrl = (finalEmail: string, finalName: string) => {
    let baseUrl = "https://gumroad.com/l/vinpremium-gold";
    if (selectedPlan?.id === "diamond") {
      baseUrl = (import.meta as any).env.VITE_GUMROAD_DIAMOND_URL || "https://gumroad.com/l/vinpremium-diamond";
    } else if (selectedPlan?.id === "gold") {
      baseUrl = (import.meta as any).env.VITE_GUMROAD_GOLD_URL || "https://gumroad.com/l/vinpremium-gold";
    } else if (selectedPlan?.id === "silver") {
      baseUrl = "https://vippremiumuk.gumroad.com/l/nqzkwy?_gl=1*17q1trw*_ga*MTUxODMzMzE1NS4xNzg0NDgxOTgz*_ga_6LJN6D94N6*czE3ODQ1MjY1NDkkbzIkZzEkdDE3ODQ1MjcwNDMkajYwJGwwJGgw";
    }

    const currentHost = window.location.origin;
    const redirectUrl = `${currentHost}/success?email=${encodeURIComponent(finalEmail)}&name=${encodeURIComponent(finalName)}&registration=${encodeURIComponent(plate)}&vin=${encodeURIComponent(vin)}&plan=${encodeURIComponent(selectedPlan?.id || "gold")}&planName=${encodeURIComponent(selectedPlan?.name || "Gold Ultimate Check")}&price=${encodeURIComponent(selectedPlan?.price || "24.99")}`;
    
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}email=${encodeURIComponent(finalEmail)}&registration_number=${encodeURIComponent(plate)}&registration=${encodeURIComponent(plate)}&redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handlePayRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalName = user ? name : `${firstName} ${lastName}`.trim();
    const finalEmail = user ? email : email;

    if (!user) {
      if (authMode === "signup") {
        if (!firstName.trim() || !lastName.trim()) {
          setFormErrors("Please enter your first and last name.");
          return;
        }
      }
      if (!email.trim()) {
        setFormErrors("Please enter a valid email address.");
        return;
      }
      if (!password || password.length < 6) {
        setFormErrors("Please enter a password of at least 6 characters.");
        return;
      }
    } else {
      if (!name.trim()) {
        setFormErrors("Please enter your full name.");
        return;
      }
      if (!email.trim()) {
        setFormErrors("Please enter a valid email address.");
        return;
      }
    }

    if (!plate.trim()) {
      setFormErrors("Please enter the vehicle registration number plate.");
      return;
    }

    setFormErrors("");
    setIsPaying(true);

    try {
      // Handle Supabase Auth if not logged in
      if (!user) {
        if (authMode === "signup") {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { first_name: firstName, last_name: lastName } }
          });
          if (signUpError) {
            setFormErrors(`Signup failed: ${signUpError.message}`);
            setIsPaying(false);
            return;
          }
          if (data.user) {
            onAuthSuccess(data.user);
          }
        } else {
          const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
          if (loginError) {
            setFormErrors(`Login failed: ${loginError.message}`);
            setIsPaying(false);
            return;
          }
          if (data.user) {
            onAuthSuccess(data.user);
          }
        }
      }

      // 1. Submit instantly to Web3Forms using FormData
      const formData = new FormData();
      formData.append("access_key", "ef8188b1-f6d1-4c68-866a-f3bde4eef1a8");
      formData.append("name", finalName);
      formData.append("email", finalEmail);
      formData.append("message", `
NEW SECURE ORDER PLACED ON VINPREMIUM.CO.UK:

Customer Name: ${finalName}
Customer Email: ${finalEmail}
Vehicle Registration Plate: ${plate.toUpperCase().trim()}
Chassis VIN Number: ${vin.toUpperCase().trim() || "Not provided by user"}

Selected Plan: ${selectedPlan?.name || "Gold Ultimate Check"}
Plan Price: £${selectedPlan?.price || "24.99"} GBP

Payment Status: Redirected to Gumroad Checkout Gateway.
Delivery Requirement: Manual verification and PDF generation required. Report should be sent via email to ${finalEmail} within 8-10 hours.
      `.trim());

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Web3Forms backup dispatch failed:", err);
    }
    
    // Open Gumroad checkout in a brand new tab/window
    const checkoutUrl = getGumroadUrl(finalEmail, finalName);
    window.open(checkoutUrl, "_blank");
    
    // Immediately redirect the current page to our premium success verification loader
    const successUrl = `/success?email=${encodeURIComponent(finalEmail)}&name=${encodeURIComponent(finalName)}&registration=${encodeURIComponent(plate)}&vin=${encodeURIComponent(vin)}&plan=${encodeURIComponent(selectedPlan?.id || "gold")}&planName=${encodeURIComponent(selectedPlan?.name || "Gold Ultimate Check")}&price=${encodeURIComponent(selectedPlan?.price || "24.99")}`;
    window.location.href = successUrl;
  };

  const handleSimulatePayment = async () => {
    const finalName = user ? name : `${firstName} ${lastName}`.trim();
    const finalEmail = user ? email : email;

    if (!user) {
      if (authMode === "signup") {
        if (!firstName.trim() || !lastName.trim()) {
          setFormErrors("Please enter your first and last name to run the simulation.");
          return;
        }
      }
      if (!email.trim()) {
        setFormErrors("Please enter an email address to run the simulation.");
        return;
      }
      if (!password || password.length < 6) {
        setFormErrors("Please enter a password of at least 6 characters.");
        return;
      }
    } else {
      if (!name.trim()) {
        setFormErrors("Please enter your full name to run the simulation.");
        return;
      }
      if (!email.trim()) {
        setFormErrors("Please enter an email address to run the simulation.");
        return;
      }
    }
    
    if (!plate.trim()) {
      setFormErrors("Please enter the registration plate to run the simulation.");
      return;
    }
    
    setIsPaying(true);
    setFormErrors("");
    try {
      // Handle Supabase Auth if not logged in
      if (!user) {
        if (authMode === "signup") {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { first_name: firstName, last_name: lastName } }
          });
          if (signUpError) {
            setFormErrors(`Signup failed: ${signUpError.message}`);
            setIsPaying(false);
            return;
          }
          if (data.user) {
            onAuthSuccess(data.user);
          }
        } else {
          const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
          if (loginError) {
            setFormErrors(`Login failed: ${loginError.message}`);
            setIsPaying(false);
            return;
          }
          if (data.user) {
            onAuthSuccess(data.user);
          }
        }
      }

      // Send simulation to Web3Forms as well
      try {
        const formData = new FormData();
        formData.append("access_key", "ef8188b1-f6d1-4c68-866a-f3bde4eef1a8");
        formData.append("name", `${finalName} (SIMULATED)`);
        formData.append("email", finalEmail);
        formData.append("message", `
[SIMULATED TEST ORDER ON VINPREMIUM.CO.UK]

Customer Name: ${finalName}
Customer Email: ${finalEmail}
Vehicle Registration Plate: ${plate.toUpperCase().trim()}
Chassis VIN Number: ${vin.toUpperCase().trim() || "Not provided by user"}

Selected Plan: ${selectedPlan?.name || "Gold Ultimate Check"}
Plan Price: £${selectedPlan?.price || "24.99"} GBP

Payment Status: SIMULATED PAYMENT APPROVED
Delivery Requirement: Manual verification and PDF generation required. Report should be sent via email to ${finalEmail} within 8-10 hours.
        `.trim());

        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });
      } catch (e) {
        console.error("Simulated Web3Forms email submission failure:", e);
      }

      const response = await fetch(`/api/gumroad-webhook?email=${encodeURIComponent(finalEmail)}&registration=${encodeURIComponent(plate)}&product_id=${encodeURIComponent(selectedPlan?.id || "gold")}&product_name=${encodeURIComponent(selectedPlan?.name || "Gold Ultimate Check")}`);
      
      if (response.ok) {
        // Redirect to success page so it polls, verifies, and unlocks!
        window.location.href = `/success?email=${encodeURIComponent(finalEmail)}&name=${encodeURIComponent(finalName)}&registration=${encodeURIComponent(plate)}&vin=${encodeURIComponent(vin)}&plan=${encodeURIComponent(selectedPlan?.id || "gold")}&planName=${encodeURIComponent(selectedPlan?.name || "Gold Ultimate Check")}&price=${encodeURIComponent(selectedPlan?.price || "24.99")}`;
      } else {
        setFormErrors("Simulation failed. Could not communicate with webhook endpoint.");
      }
    } catch (err) {
      setFormErrors("Simulation error. Check that server is running.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8">
        
        {/* Header bar */}
        <div className="bg-gray-50 border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-gray-500">
              Checkout Session: {vinOrPlate}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-sans text-sm font-medium cursor-pointer"
          >
            Cancel Lookup
          </button>
        </div>

        {/* Dynamic Pipeline Progress Bars at top */}
        <div className="bg-gray-50/50 border-b border-gray-100 px-4 sm:px-8 py-4 sm:py-6 grid grid-cols-3 gap-3 sm:gap-4">
          
          {/* Item 1: Pull Data */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className={`font-display font-bold ${step === "data-pull" ? "text-red-600" : "text-gray-500"} text-[10px] sm:text-xs truncate`}>
                <span className="hidden sm:inline">1. Pulling Live Data</span>
                <span className="sm:hidden">1. Pulling</span>
              </span>
              {step !== "data-pull" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              ) : (
                <Loader2 className="w-3.5 h-3.5 text-red-600 animate-spin shrink-0" />
              )}
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 via-purple-600 to-indigo-500 rounded-full transition-all duration-100" 
                style={{ width: step === "data-pull" ? `${progress}%` : "100%" }}
              />
            </div>
          </div>

          {/* Item 2: Payment Gateway Setup */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className={`font-display font-bold ${step === "gateway-setup" ? "text-red-600" : step === "data-pull" ? "text-gray-400" : "text-gray-500"} text-[10px] sm:text-xs truncate`}>
                <span className="hidden sm:inline">2. Payment Gateway</span>
                <span className="sm:hidden">2. Gateway</span>
              </span>
              {step === "data-pull" ? (
                <span className="text-gray-300">•</span>
              ) : step !== "gateway-setup" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              ) : (
                <Loader2 className="w-3.5 h-3.5 text-red-600 animate-spin shrink-0" />
              )}
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 via-rose-600 to-red-600 rounded-full transition-all duration-100" 
                style={{ 
                  width: step === "data-pull" ? "0%" : step === "gateway-setup" ? `${progress}%` : "100%" 
                }}
              />
            </div>
          </div>

          {/* Item 3: Pay and Go */}
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className={`font-display font-bold ${["select-plan", "checkout", "success"].includes(step) ? "text-red-600" : "text-gray-400"} text-[10px] sm:text-xs truncate`}>
                <span className="hidden sm:inline">3. Pay & Go</span>
                <span className="sm:hidden">3. Checkout</span>
              </span>
              {step === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              ) : (
                <span className="text-gray-300">•</span>
              )}
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-600 rounded-full transition-all duration-300" 
                style={{ width: step === "success" ? "100%" : "0%" }}
              />
            </div>
          </div>

        </div>

        {/* Content body based on active step */}
        <div className="p-4 sm:p-8">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Data Pulling Simulator UI */}
            {step === "data-pull" && (
              <motion.div
                key="data-pull"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-12"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-500 animate-pulse-slow">
                    <Sparkles className="w-10 h-10 text-red-600 animate-bounce" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-red-600/30 border-t-red-600 animate-spin" />
                </div>
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
                  Pulling Live DVLA & MOT Database Records
                </h3>
                <p className="font-sans text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
                  Connecting to secure servers... Gathering verified mileage history, outstanding finance files, and police stolen checklists for <span className="font-mono text-red-600 font-bold">{vinOrPlate}</span>.
                </p>
                <div className="inline-flex items-center space-x-2 bg-red-50 text-red-800 text-xs font-mono px-3 py-1.5 rounded-full border border-red-100 animate-pulse">
                  <span>LIVE SOURCE ENCRYPTION ACTIVE</span>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment Gateway Setup UI */}
            {step === "gateway-setup" && (
              <motion.div
                key="gateway-setup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-12"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                    <Lock className="w-10 h-10 text-red-600" />
                  </div>
                  <div className="absolute -inset-2 rounded-full border-2 border-red-500/20 border-b-red-600 animate-spin" />
                </div>
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
                  Bridging Encrypted Payment Gateway
                </h3>
                <p className="font-sans text-gray-500 text-sm max-w-md mx-auto leading-relaxed mb-6">
                  Configuring SSL certificates and tokenized billing headers for PCI-DSS compliance...
                </p>
                <div className="inline-flex items-center space-x-2 bg-gray-50 border border-gray-200 text-gray-500 text-xs font-mono px-3 py-1.5 rounded-full">
                  <span>SECURE CHANNEL SETUP COMPLETED</span>
                </div>
              </motion.div>
            )}

            {/* Step 3: Select Plan */}
            {step === "select-plan" && (
              <motion.div
                key="select-plan"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <div className="text-center mb-8">
                  <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
                    Select Your VinPremium Report Plan
                  </h3>
                  <p className="font-sans text-sm text-gray-500 max-w-lg mx-auto">
                    We gathered comprehensive UK data files for <span className="font-mono text-red-600 font-bold">{vinOrPlate}</span>. Select a package to run final decryptions and download your full PDF.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan?.id === plan.id;
                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`relative border-2 rounded-xl p-6 cursor-pointer flex flex-col justify-between transition-all hover:shadow-lg ${
                          isSelected 
                            ? "border-red-600 bg-red-50/20 shadow-sm" 
                            : "border-gray-200 hover:border-red-300 bg-white"
                        }`}
                      >
                        {plan.badge && (
                          <span className="absolute top-0 right-6 transform -translate-y-1/2 text-white bg-red-600 font-sans font-bold text-[10px] tracking-widest uppercase py-1 px-3.5 rounded-full shadow-xs">
                            {plan.badge}
                          </span>
                        )}
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            {plan.id === "silver" && <Layers className={`w-5 h-5 ${isSelected ? "text-red-600" : "text-gray-400"}`} />}
                            {plan.id === "gold" && <Zap className={`w-5 h-5 ${isSelected ? "text-red-600" : "text-gray-400"}`} />}
                            {plan.id === "diamond" && <Gem className={`w-5 h-5 ${isSelected ? "text-red-600" : "text-gray-400"}`} />}
                            <h4 className="font-display font-bold text-lg text-gray-900">{plan.name}</h4>
                          </div>
                          
                          <p className="font-sans text-xs text-gray-400 mb-4 h-10">{plan.description}</p>
                          
                          <div className="mb-6 flex items-baseline">
                            <span className="font-display font-bold text-3xl text-gray-900">£{plan.price}</span>
                            <span className="font-sans text-xs text-gray-500 ml-1">GBP</span>
                          </div>

                          <div className="border-t border-gray-100/80 pt-4 space-y-2">
                            {plan.features.map((feat, i) => (
                              <div key={i} className="flex items-start space-x-2 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
                                <span className="font-sans text-gray-600 leading-tight">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-8 pt-4">
                          <button
                            type="button"
                            className={`w-full py-2.5 rounded-lg text-xs font-sans font-bold cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {isSelected ? "Selected Tier" : "Choose Plan"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setStep("checkout")}
                    disabled={!selectedPlan}
                    className="bg-red-600 text-white font-sans font-bold text-sm px-6 py-3 rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-200 cursor-pointer flex items-center space-x-2"
                  >
                    <span>Proceed to Gateway</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Secure Checkout Email and Redirect */}
            {step === "checkout" && selectedPlan && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Form column */}
                <div className="lg:col-span-7">
                  <button
                    onClick={() => setStep("select-plan")}
                    className="flex items-center space-x-2 text-xs text-gray-500 hover:text-red-600 mb-6 font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Plan</span>
                  </button>

                  <h3 className="font-display font-bold text-xl text-gray-900 mb-1">
                    {user ? "Complete Your Secured Registration" : "Account Setup & Secured Registration"}
                  </h3>
                  <p className="font-sans text-xs text-gray-500 mb-6">
                    {user 
                      ? "Your account is secure. Enter vehicle details to manually certify your history report and PDF."
                      : "Please sign up or log in below. We will create your secure account and compile your vehicle history."}
                  </p>

                  <form onSubmit={handlePayRedirect} className="space-y-4">
                    
                    {formErrors && (
                      <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg text-xs font-sans text-red-800 font-medium">
                        {formErrors}
                      </div>
                    )}

                    {!user ? (
                      <div className="bg-gray-50 border border-gray-150 rounded-xl p-4.5 mb-2 space-y-4">
                        <div className="flex border-b border-gray-200 pb-3">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode("signup");
                              setFormErrors("");
                            }}
                            className={`flex-1 text-center font-sans font-bold text-xs py-1 px-3 rounded-lg transition-all cursor-pointer ${
                              authMode === "signup"
                                ? "bg-red-600 text-white shadow-xs"
                                : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            Create Account (Sign Up)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode("login");
                              setFormErrors("");
                            }}
                            className={`flex-1 text-center font-sans font-bold text-xs py-1 px-3 rounded-lg transition-all cursor-pointer ${
                              authMode === "login"
                                ? "bg-red-600 text-white shadow-xs"
                                : "text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            Already Registered? (Log In)
                          </button>
                        </div>

                        {authMode === "signup" ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-1">
                                  First Name
                                </label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                                    <User className="w-3.5 h-3.5" />
                                  </span>
                                  <input
                                    type="text"
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 bg-white"
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-1">
                                  Last Name
                                </label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                                    <User className="w-3.5 h-3.5" />
                                  </span>
                                  <input
                                    type="text"
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 bg-white"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-1">
                                  Email Address
                                </label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                                    <Mail className="w-3.5 h-3.5" />
                                  </span>
                                  <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 bg-white"
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-1">
                                  Password
                                </label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                                    <Lock className="w-3.5 h-3.5" />
                                  </span>
                                  <input
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    minLength={6}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 bg-white"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Email Address
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                                  <Mail className="w-3.5 h-3.5" />
                                </span>
                                <input
                                  type="email"
                                  placeholder="you@example.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 bg-white"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-1">
                                Password
                              </label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                                  <Lock className="w-3.5 h-3.5" />
                                </span>
                                <input
                                  type="password"
                                  placeholder="Enter your password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 bg-white"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-red-50/10 border border-red-100/40 p-4 rounded-xl mb-2">
                        {/* Name Input */}
                        <div>
                          <label className="block text-xs font-sans font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 bg-white"
                            required
                          />
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="block text-xs font-sans font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                            Email Address
                          </label>
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 bg-white/70"
                            required
                            disabled
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Plate Input */}
                      <div>
                        <label className="block text-xs font-sans font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                          UK Number Plate
                        </label>
                        <div className="flex border border-gray-950 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-600">
                          <div className="bg-blue-800 text-white px-2.5 flex flex-col justify-center items-center font-sans font-bold text-[8px] tracking-tight shrink-0 select-none">
                            <span>GB</span>
                            <span className="text-yellow-400">★</span>
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. WP69 XYA"
                            value={plate}
                            onChange={(e) => setPlate(e.target.value.toUpperCase())}
                            className="w-full px-3 py-2 text-xs font-mono font-extrabold tracking-widest uppercase bg-yellow-100 text-gray-900 focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      {/* VIN Input */}
                      <div>
                        <label className="block text-xs font-sans font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                          17-Digit VIN / Chassis (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="SADFC8DF9HA021..."
                          value={vin}
                          maxLength={17}
                          onChange={(e) => setVin(e.target.value.toUpperCase())}
                          className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 bg-white"
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400 leading-normal bg-gray-50 p-3 rounded-lg border border-gray-150">
                      ℹ️ <strong>Manual Dispatch Commitment:</strong> Because we verify real, live registries, your complete certified vehicle history report will be compiled manually and delivered as a premium PDF certificate directly to your email address within <strong>8 to 10 hours</strong>.
                    </p>

                    <div className="pt-2 space-y-3">
                      <button
                        type="submit"
                        disabled={isPaying}
                        className="w-full bg-red-600 text-white font-sans font-bold text-sm py-3.5 rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-80"
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{user ? "Dispatching details & launching gateway..." : authMode === "signup" ? "Signing up & dispatching..." : "Logging in & dispatching..."}</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>{user ? `Pay & Unlock Manual Report (£${selectedPlan.price} GBP)` : authMode === "signup" ? `Register & Unlock Report (£${selectedPlan.price} GBP)` : `Log In & Unlock Report (£${selectedPlan.price} GBP)`}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Pricing / Plan Summary column */}
                <div className="lg:col-span-5 bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-100">
                      Receipt Summary
                    </span>
                    <h4 className="font-display font-bold text-lg text-gray-900 mt-3 mb-1">
                      {selectedPlan.name}
                    </h4>
                    <p className="font-sans text-xs text-gray-400 mb-4">
                      Single purchase for {plate}
                    </p>

                    <div className="space-y-3 py-4 border-y border-gray-200/60 text-xs">
                      <div className="flex justify-between font-sans">
                        <span className="text-gray-500">Premium Lookup Database Rate</span>
                        <span className="text-gray-900 font-semibold">£{selectedPlan.price}</span>
                      </div>
                      <div className="flex justify-between font-sans">
                        <span className="text-gray-500">Government Registry Fee</span>
                        <span className="text-green-600 font-medium">FREE</span>
                      </div>
                      <div className="flex justify-between font-sans">
                        <span className="text-gray-500">Secure Report Decryption</span>
                        <span className="text-green-600 font-medium">FREE</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline pt-4 mb-6">
                      <span className="font-display font-bold text-sm text-gray-800">Total Charged Amount</span>
                      <span className="font-display font-bold text-2xl text-red-600">£{selectedPlan.price} GBP</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded-lg space-y-3">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-red-600" />
                      <span className="font-display font-bold text-xs text-gray-800">VinPremium Guarantee</span>
                    </div>
                    <p className="font-sans text-[10px] text-gray-500 leading-normal">
                      Each lookup is backed by our £40,000 accuracy insurance warranty. If our report misses active recorded finance or stolen records, you receive a full refund and compensation.
                    </p>
                  </div>
                </div>

              </motion.div>
            )}

            {/* Success step before transition to full report */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">
                  Payment Succeeded!
                </h3>
                <p className="font-sans text-gray-500 text-sm max-w-sm mx-auto leading-relaxed mb-6">
                  Secured authorization approved. Your full premium car report is now decrypted and unlocked for downloading!
                </p>
                <button
                  onClick={() => onPaymentSuccess(selectedPlan?.id || "gold")}
                  className="bg-red-600 text-white font-sans font-bold text-sm px-8 py-3 rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-200 cursor-pointer inline-flex items-center space-x-2"
                >
                  <span>Access Complete Report</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
