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
  ArrowLeft
} from "lucide-react";
import { PricingPlan } from "../types";

interface PaymentWizardProps {
  vinOrPlate: string;
  onPaymentSuccess: (planId: string) => void;
  onClose: () => void;
}

export default function PaymentWizard({ vinOrPlate, onPaymentSuccess, onClose }: PaymentWizardProps) {
  // Steps: "data-pull" | "gateway-setup" | "select-plan" | "checkout" | "processing" | "success"
  const [step, setStep] = useState<"data-pull" | "gateway-setup" | "select-plan" | "checkout" | "success">("data-pull");
  const [progress, setProgress] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  
  // Credit card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [formErrors, setFormErrors] = useState<string>("");
  const [isPaying, setIsPaying] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: "silver",
      name: "Silver Starter",
      price: 19,
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
      price: 30,
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
      price: 40,
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 16);
    // Format card number with spaces every 4 characters
    const formatted = val.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 2) {
      setCardExpiry(val.substring(0, 2) + "/" + val.substring(2));
    } else {
      setCardExpiry(val);
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      setFormErrors("Please complete all payment fields.");
      return;
    }
    setFormErrors("");
    setIsPaying(true);

    // Simulated API charge payment delay
    setTimeout(() => {
      setIsPaying(false);
      setStep("success");
    }, 2000);
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
                            <span className="font-display font-bold text-3xl text-gray-900">${plan.price}</span>
                            <span className="font-sans text-xs text-gray-500 ml-1">USD</span>
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

            {/* Step 4: Secure Checkout Credit Card Form */}
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
                    <span>Change Subscription Plan</span>
                  </button>

                  <h3 className="font-display font-bold text-xl text-gray-900 mb-1">
                    Secure Credit Card Checkout
                  </h3>
                  <p className="font-sans text-xs text-gray-500 mb-6">
                    Enter your banking details. Payments are processed with bank-level 256-bit AES encryption.
                  </p>

                  <form onSubmit={handlePay} className="space-y-4">
                    
                    {formErrors && (
                      <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg text-xs font-sans text-red-800 font-medium">
                        {formErrors}
                      </div>
                    )}

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-xs font-sans font-semibold text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alexander Sterling"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600"
                        required
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block text-xs font-sans font-semibold text-gray-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600"
                          required
                        />
                        <CreditCard className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    {/* Grid for Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans font-semibold text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 text-center"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-semibold text-gray-700 mb-1">
                          CVV Code
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 text-center"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isPaying}
                        className="w-full bg-red-600 text-white font-sans font-bold text-sm py-3 rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-80"
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing Secure Payment...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Pay & Decrypt Full Report (${selectedPlan.price} USD)</span>
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
                      Single purchase for {vinOrPlate}
                    </p>

                    <div className="space-y-3 py-4 border-y border-gray-200/60 text-xs">
                      <div className="flex justify-between font-sans">
                        <span className="text-gray-500">Premium Lookup Database Rate</span>
                        <span className="text-gray-900 font-semibold">${selectedPlan.price}.00</span>
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
                      <span className="font-display font-bold text-2xl text-red-600">${selectedPlan.price}.00 USD</span>
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
