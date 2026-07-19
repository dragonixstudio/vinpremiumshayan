import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle, AlertTriangle, Send, ShieldAlert, FileText, Landmark } from "lucide-react";

export default function ContactView() {
  const [activeForm, setActiveForm] = useState<"general" | "problem">("problem"); // Default to problem form as requested!
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [plate, setPlate] = useState("");
  const [problemType, setProblemType] = useState("payment_unlock");
  const [orderId, setOrderId] = useState("");
  
  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    // Prepare Web3Forms payload
    const formData = new FormData();
    formData.append("access_key", "ef8188b1-f6d1-4c68-866a-f3bde4eef1a8");
    formData.append("name", name);
    formData.append("email", email);
    
    if (activeForm === "problem") {
      formData.append("subject", `PROBLEM REPORT [${problemType.toUpperCase()}]: ${plate || "No Plate"}`);
      formData.append(
        "message", 
        `Issue Type: ${problemType}\nVehicle Plate/VIN: ${plate}\nOrder/Payment ID: ${orderId || "Not provided"}\n\nUser Message:\n${message}`
      );
      formData.append("vehicle_plate", plate);
      formData.append("problem_type", problemType);
      formData.append("order_id", orderId);
    } else {
      formData.append("subject", subject || "General Contact Inquiry");
      formData.append("message", message);
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setSubmitSuccess(true);
        // Reset states
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setPlate("");
        setOrderId("");
      } else {
        setSubmitError(data.message || "Failed to submit form. Please check your inputs.");
      }
    } catch (err) {
      setSubmitError("Network error. Could not connect to the Web3Forms server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50/50 py-12 md:py-20" id="contact-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full inline-block mb-3">
            UK DPO & Support Hub
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-gray-900 tracking-tight mb-4">
            Help & Customer Support
          </h1>
          <p className="font-sans text-base text-gray-600">
            Have a question, or did you face an issue during your checkout? Submit a priority ticket using our high-priority forms powered by Web3Forms support routing.
          </p>
        </div>

        {/* Toggles to switch between General and Problem forms */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 p-1.5 rounded-xl inline-flex space-x-1 border border-gray-200">
            <button
              onClick={() => {
                setActiveForm("problem");
                setSubmitSuccess(false);
                setSubmitError("");
              }}
              className={`px-5 py-2.5 rounded-lg text-xs font-sans font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeForm === "problem"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report a Checkout/Report Issue</span>
            </button>
            <button
              onClick={() => {
                setActiveForm("general");
                setSubmitSuccess(false);
                setSubmitError("");
              }}
              className={`px-5 py-2.5 rounded-lg text-xs font-sans font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeForm === "general"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>General Enquiry</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-xs">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-4 flex items-center space-x-2">
                <Landmark className="w-5 h-5 text-red-600" />
                <span>Our UK HQ Details</span>
              </h3>
              <p className="font-sans text-xs text-gray-500 leading-relaxed mb-6">
                All inquiries are processed by VinPremium UK Ltd's customer support division in London. Average response time on weekdays is under 2 hours.
              </p>

              <div className="space-y-4 text-xs font-sans text-gray-600">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Registered Address:</strong><br />
                    VinPremium UK Ltd,<br />
                    85 Great Portland Street,<br />
                    London, W1W 7LT,<br />
                    United Kingdom
                  </span>
                </div>
                <div className="flex items-center space-x-3 border-t border-gray-100 pt-3">
                  <Phone className="w-4.5 h-4.5 text-red-600 shrink-0" />
                  <span><strong>Support Phone:</strong> +44 (0) 20 7946 0192</span>
                </div>
                <div className="flex items-center space-x-3 border-t border-gray-100 pt-3">
                  <Mail className="w-4.5 h-4.5 text-red-600 shrink-0" />
                  <span><strong>Corporate Support:</strong> compliance@vinpremium.uk</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-200/60 p-6 rounded-2xl text-left">
              <h4 className="font-display font-bold text-amber-900 text-xs uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Instant Payment Verification</span>
              </h4>
              <p className="font-sans text-xs text-amber-800 leading-relaxed">
                If you have paid but did not receive your report automatically, use our <strong>Checkout success tab</strong> directly to query your transaction or enter your <strong>Gumroad License Key / Order ID</strong> to instantly decrypt the file without waiting for support.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-8 bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
            {submitSuccess ? (
              <div className="text-center py-8 animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-2xl text-gray-900 mb-2">Message Sent Successfully</h3>
                <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
                  Thank you! Your ticket was generated and forwarded directly to our UK compliance team via Web3Forms secure endpoints. We will investigate this immediately.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-sans font-bold text-xs px-6 py-3 rounded-lg transition-all cursor-pointer"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-gray-900 mb-1">
                    {activeForm === "problem" ? "Report a Checkout / Report Problem" : "General Contact & Feedback"}
                  </h3>
                  <p className="font-sans text-xs text-gray-500">
                    {activeForm === "problem" 
                      ? "Use this form to escalate payment unlock errors, refund requests, or data discrepancies." 
                      : "Send general inquiries, partnership proposals, or GDPR information rights requests."}
                  </p>
                </div>

                {submitError && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg text-xs font-sans text-red-800 font-medium">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-sans font-bold text-gray-700 mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-sans font-bold text-gray-700 mb-1.5">
                      Your Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Conditional Fields for "Problem" form */}
                {activeForm === "problem" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-5 rounded-2xl border border-gray-200/50">
                    {/* Problem Type dropdown */}
                    <div className="md:col-span-1">
                      <label className="block text-[11px] font-sans font-bold text-gray-700 mb-1.5">
                        Issue Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={problemType}
                        onChange={(e) => setProblemType(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 bg-white"
                      >
                        <option value="payment_unlock">Paid, report locked</option>
                        <option value="plate_not_found">Plate not found / search error</option>
                        <option value="data_mismatch">Data incorrect or mismatch</option>
                        <option value="refund">Refund / billing request</option>
                        <option value="other_problem">Other technical problem</option>
                      </select>
                    </div>

                    {/* Vehicle Plate input */}
                    <div className="md:col-span-1">
                      <label className="block text-[11px] font-sans font-bold text-gray-700 mb-1.5">
                        Vehicle Plate (or VIN)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AB12 CDE"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value.toUpperCase())}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 uppercase"
                      />
                    </div>

                    {/* Order ID input */}
                    <div className="md:col-span-1">
                      <label className="block text-[11px] font-sans font-bold text-gray-700 mb-1.5">
                        Gumroad Key / Order ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. lic_9B3A2C or 24018"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600"
                      />
                    </div>
                  </div>
                ) : (
                  /* Subject field for General Form */
                  <div>
                    <label className="block text-xs font-sans font-bold text-gray-700 mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={activeForm === "general"}
                      placeholder="e.g. Partnership inquiry, corporate accounts, DPO queries"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600"
                    />
                  </div>
                )}

                {/* Message field */}
                <div>
                  <label className="block text-xs font-sans font-bold text-gray-700 mb-1.5">
                    {activeForm === "problem" ? "Describe your issue & transaction details" : "Your Message"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={
                      activeForm === "problem"
                        ? "Please provide details such as your approximate payment time, Gumroad email used, and any technical message you encountered so we can unlock your report immediately."
                        : "Describe your inquiry or feedback in detail..."
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-sm py-3.5 rounded-lg transition-all shadow-md shadow-red-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <span>Submitting ticket...</span>
                  ) : (
                    <>
                      <span>Submit Secure Support Request</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-gray-400 text-center font-sans">
                  By submitting this ticket, you consent to sharing your details securely via Web3Forms. Your data is protected by UK GDPR.
                </p>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
