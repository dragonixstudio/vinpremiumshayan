import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, AlertTriangle, FileText, ArrowRight, ExternalLink, RefreshCw } from "lucide-react";

interface SuccessViewProps {
  onUnlockReport: (registration: string) => void;
  onNavigateHome: () => void;
}

export default function SuccessView({ onUnlockReport, onNavigateHome }: SuccessViewProps) {
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [email, setEmail] = useState("");
  const [registration, setRegistration] = useState("");
  const [plan, setPlan] = useState("");
  const [planName, setPlanName] = useState("");
  const [price, setPrice] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Manual key verification state
  const [manualKey, setManualKey] = useState("");
  const [isVerifyingKey, setIsVerifyingKey] = useState(false);
  const [keyError, setKeyError] = useState("");

  // Construct Gumroad link for backup reopening
  const getGumroadUrl = () => {
    let baseUrl = "https://gumroad.com/l/vinpremium-gold";
    if (plan === "diamond") {
      baseUrl = (import.meta as any).env?.VITE_GUMROAD_DIAMOND_URL || "https://gumroad.com/l/vinpremium-diamond";
    } else if (plan === "gold") {
      baseUrl = (import.meta as any).env?.VITE_GUMROAD_GOLD_URL || "https://gumroad.com/l/vinpremium-gold";
    } else if (plan === "silver") {
      baseUrl = "https://gumroad.com/l/vinpremium-silver";
    }

    const currentHost = window.location.origin;
    const redirectUrl = `${currentHost}/success?email=${encodeURIComponent(email)}&registration=${encodeURIComponent(registration)}&plan=${encodeURIComponent(plan)}&planName=${encodeURIComponent(planName)}&price=${encodeURIComponent(price)}`;
    
    return `${baseUrl}?email=${encodeURIComponent(email)}&registration_number=${encodeURIComponent(registration)}&registration=${encodeURIComponent(registration)}&redirect=${encodeURIComponent(redirectUrl)}`;
  };

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email") || "";
    const regParam = params.get("registration") || params.get("registration_number") || params.get("plate") || "";
    const planParam = params.get("plan") || "gold";
    const planNameParam = params.get("planName") || "Gold Ultimate Check";
    const priceParam = params.get("price") || "24.99";

    setEmail(emailParam);
    setRegistration(regParam.toUpperCase().trim());
    setPlan(planParam);
    setPlanName(planNameParam);
    setPrice(priceParam);

    if (!emailParam || !regParam) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let currentAttempts = 0;
    const maxAttempts = 60; // 3 minutes total of automatic polling (every 3s)
    let pollInterval: NodeJS.Timeout;

    const checkPayment = async () => {
      try {
        const response = await fetch(
          `/api/check-payment?email=${encodeURIComponent(emailParam)}&registration=${encodeURIComponent(regParam.toUpperCase().trim())}`
        );
        const data = await response.json();

        if (data.paid) {
          if (isMounted) {
            setPaid(true);
            setLoading(false);
            if (data.registration) setRegistration(data.registration);
            if (data.email) setEmail(data.email);
            clearInterval(pollInterval);
          }
        } else {
          if (isMounted) {
            currentAttempts += 1;
            setAttempts(currentAttempts);
            if (currentAttempts >= maxAttempts) {
              clearInterval(pollInterval);
              setLoading(false);
            }
          }
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
      }
    };

    // Run first check immediately
    checkPayment();

    // Set up polling interval (every 3 seconds)
    pollInterval = setInterval(() => {
      if (currentAttempts < maxAttempts && !paid) {
        checkPayment();
      } else {
        clearInterval(pollInterval);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [paid]);

  const handleManualRetry = async () => {
    setLoading(true);
    setErrorMsg("");
    setKeyError("");
    try {
      const response = await fetch(
        `/api/check-payment?email=${encodeURIComponent(email)}&registration=${encodeURIComponent(registration)}`
      );
      const data = await response.json();
      if (data.paid) {
        setPaid(true);
        if (data.registration) setRegistration(data.registration);
        if (data.email) setEmail(data.email);
      } else {
        setErrorMsg("We could not find a completed purchase for this plate/email yet. If you have already paid, please wait a few seconds and try again.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to verification server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyKey = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualKey.trim()) {
      setKeyError("Please enter a valid Payment ID, Order ID, or License Key.");
      return;
    }

    setIsVerifyingKey(true);
    setKeyError("");
    setErrorMsg("");

    try {
      const response = await fetch(
        `/api/check-payment?key=${encodeURIComponent(manualKey.trim())}`
      );
      const data = await response.json();
      if (data.paid) {
        setPaid(true);
        if (data.registration) setRegistration(data.registration);
        if (data.email) setEmail(data.email);
        setLoading(false);
      } else {
        setKeyError("No match found. Please check your Gumroad Payment ID, Order ID, or License Key and make sure payment was completed.");
      }
    } catch (err) {
      setKeyError("Failed to connect to verification server. Please try again.");
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleReopenCheckout = () => {
    window.open(getGumroadUrl(), "_blank");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center animate-fadeIn">
      {loading ? (
        <div className="bg-white border border-gray-150 rounded-3xl p-8 md:p-12 shadow-lg shadow-gray-100 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Awaiting Gumroad Checkout</h2>
          <p className="font-sans text-sm text-gray-500 mb-6 leading-relaxed">
            We opened your checkout session in a new tab. Please complete the payment. 
            This screen will <span className="font-semibold text-red-600 animate-pulse">automatically unlock</span> your vehicle history report for <span className="font-mono text-red-600 font-bold">{registration || "your vehicle"}</span> once done.
          </p>

          <div className="bg-red-50/40 border border-red-100 rounded-2xl p-4 text-left space-y-2 mb-6 text-xs max-w-md mx-auto">
            <p className="font-sans text-red-800 font-bold uppercase tracking-wider text-[9px]">Awaiting Payment Records</p>
            {planName && <p className="font-sans text-gray-600"><strong>Plan:</strong> {planName} (£{price} GBP)</p>}
            {registration && <p className="font-sans text-gray-600"><strong>Registered Plate:</strong> {registration}</p>}
            {email && <p className="font-sans text-gray-600"><strong>Destination Email:</strong> {email}</p>}
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={handleReopenCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-md shadow-red-200"
            >
              <span>Re-open Secure Checkout Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <div className="inline-flex items-center space-x-2 text-[10px] text-gray-400 font-mono">
              <span>LISTENING FOR WEBHOOK (POLL {attempts}/60)</span>
            </div>

            {/* Quick Key Entry directly inside Loading */}
            <div className="border-t border-gray-100 pt-5 mt-4 text-left">
              <p className="text-[11px] font-sans font-semibold text-gray-700 mb-2">
                Already paid? Enter your Gumroad Key, License Key, or Order ID below:
              </p>
              <form onSubmit={handleVerifyKey} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. lic_9B3A2C... or ord_24018"
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />
                <button
                  type="submit"
                  disabled={isVerifyingKey}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-sans font-bold text-[11px] px-4 py-2 rounded-lg transition-all disabled:opacity-85"
                >
                  {isVerifyingKey ? "Checking..." : "Unlock"}
                </button>
              </form>
              {keyError && (
                <p className="text-[10px] text-red-600 font-sans mt-1.5">{keyError}</p>
              )}
            </div>

          </div>
        </div>
      ) : paid ? (
        <div className="bg-white border border-gray-150 rounded-3xl p-8 md:p-12 shadow-lg shadow-gray-100 max-w-xl mx-auto animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-3">Payment Confirmed!</h2>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
            Excellent! Your premium vehicle history report for <span className="font-mono text-red-600 font-bold">{registration}</span> has been unlocked successfully.
          </p>

          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left space-y-2 mb-8 text-xs max-w-md mx-auto">
            <p className="font-sans text-gray-400 uppercase tracking-wider font-semibold text-[10px]">Purchase Details</p>
            <p className="font-sans text-gray-700"><strong>Registered Plate:</strong> {registration}</p>
            <p className="font-sans text-gray-700"><strong>Customer Email:</strong> {email}</p>
            <p className="font-sans text-gray-700"><strong>Status:</strong> Unlocked & Ready</p>
          </div>

          <button
            onClick={() => onUnlockReport(registration)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-sm py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-red-200"
          >
            <span>Access Premium Report</span>
            <FileText className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-150 rounded-3xl p-8 md:p-12 shadow-lg shadow-gray-100 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-100">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">Verification Timeout</h2>
          <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
            We haven't received confirmation from Gumroad for <strong className="text-gray-900">{registration || "your vehicle"}</strong> yet. Please ensure checkout is complete in the other window.
          </p>

          {errorMsg && (
            <p className="text-xs font-sans text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 mb-6 leading-relaxed">
              {errorMsg}
            </p>
          )}

          <div className="flex flex-col gap-3 max-w-md mx-auto pt-2">
            <button
              onClick={handleManualRetry}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shadow-red-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Verify Payment Status Now</span>
            </button>
            <button
              onClick={handleReopenCheckout}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-sans font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Resume Checkout (Open Tab)</span>
            </button>

            {/* Quick Key Entry on Timeout */}
            <div className="border-t border-gray-100 pt-5 mt-4 text-left">
              <p className="text-[11px] font-sans font-semibold text-gray-700 mb-2">
                Already paid? Enter your Gumroad Key, License Key, or Order ID below:
              </p>
              <form onSubmit={handleVerifyKey} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. lic_9B3A2C... or ord_24018"
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />
                <button
                  type="submit"
                  disabled={isVerifyingKey}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-sans font-bold text-[11px] px-4 py-2 rounded-lg transition-all disabled:opacity-85 whitespace-nowrap"
                >
                  {isVerifyingKey ? "Checking..." : "Unlock"}
                </button>
              </form>
              {keyError && (
                <p className="text-[10px] text-red-600 font-sans mt-1.5">{keyError}</p>
              )}
            </div>

            <button
              onClick={onNavigateHome}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-sans font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer mt-4"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

