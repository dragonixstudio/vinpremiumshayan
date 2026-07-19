import React, { useState } from "react";
import { 
  Percent, 
  Handshake, 
  TrendingUp, 
  Users, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  MessageSquare,
  Sparkles,
  DollarSign
} from "lucide-react";

export default function AffiliateView() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    source: "Social Media",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const data = new FormData();
    data.append("access_key", "ef8188b1-f6d1-4c68-866a-f3bde4eef1a8");
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("subject", `NEW AFFILIATE PARTNER APPLICATION: ${formData.name}`);
    data.append(
      "message",
      `Affiliate Partner Application Details:
Name: ${formData.name}
Email: ${formData.email}
Website/Channel: ${formData.website}
Traffic Source: ${formData.source}

Partner Vision:
${formData.message}`
    );

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });

      const resJson = await response.json();
      if (resJson.success) {
        setFormSubmitted(true);
      } else {
        setSubmitError(resJson.message || "Could not submit application. Please check your details.");
      }
    } catch (err) {
      setSubmitError("Failed to reach partnership servers. Please check your network connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 px-4 py-2 rounded-full border border-red-100">
          <Handshake className="w-3.5 h-3.5" />
          <span>Earn Passive Income</span>
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 mt-4 mb-6 tracking-tight leading-none">
          VinPremium <span className="text-red-600">Affiliate Program</span>
        </h1>
        <p className="font-sans text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Partner with the UK's most trusted vehicle history provider. Refer visitors to VinPremium and earn a massive <strong className="text-gray-900 font-bold underline decoration-red-500 decoration-2">35% commission</strong> on every single purchase made through your unique link.
        </p>
      </div>

      {/* Program Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4">
            <Percent className="w-5 h-5" />
          </div>
          <span className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Commission Rate</span>
          <h3 className="font-display font-bold text-2xl text-gray-900 mt-1">35% Payout</h3>
          <p className="font-sans text-xs text-gray-500 mt-1.5 leading-relaxed">
            Unbeatable industry-leading commission on all basic, gold, and multi-pack purchases.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Cookie Window</span>
          <h3 className="font-display font-bold text-2xl text-gray-900 mt-1">60 Day Cookies</h3>
          <p className="font-sans text-xs text-gray-500 mt-1.5 leading-relaxed">
            Get paid even if visitors purchase 2 months after clicking your referral link.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Payout Schedule</span>
          <h3 className="font-display font-bold text-2xl text-gray-900 mt-1">Monthly terms</h3>
          <p className="font-sans text-xs text-gray-500 mt-1.5 leading-relaxed">
            Fast, reliable payouts directly to PayPal, Payoneer, or direct UK Bank Transfers.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4">
            <Users className="w-5 h-5" />
          </div>
          <span className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Partner Support</span>
          <h3 className="font-display font-bold text-2xl text-gray-900 mt-1">1-on-1 Support</h3>
          <p className="font-sans text-xs text-gray-500 mt-1.5 leading-relaxed">
            Dedicated affiliate dashboard, banners, high-converting copy, and real-time click tracking.
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Form / Contact Section */}
        <div className="lg:col-span-7 bg-white border border-gray-150 rounded-3xl p-8 md:p-10 shadow-lg shadow-gray-100">
          
          {formSubmitted ? (
            <div className="text-center py-10 animate-scaleUp">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display font-bold text-2xl text-gray-900 mb-3">Application Submitted Successfully!</h3>
              <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
                Thank you for applying to the VinPremium Affiliate Program. Our partner relations team will review your traffic channels and reach out with your unique link within 24 hours.
              </p>
              <div className="bg-gray-50 rounded-2xl p-4 text-left max-w-sm mx-auto border border-gray-100 space-y-2 text-xs">
                <p className="font-sans text-gray-400 uppercase tracking-wider font-semibold text-[10px]">Your Registered Details</p>
                <p className="font-sans text-gray-700"><strong>Name:</strong> {formData.name}</p>
                <p className="font-sans text-gray-700"><strong>Email:</strong> {formData.email}</p>
                <p className="font-sans text-gray-700"><strong>Traffic Source:</strong> {formData.source} ({formData.website})</p>
              </div>
              <button 
                onClick={() => setFormSubmitted(false)}
                className="mt-8 font-sans font-bold text-xs text-red-600 hover:text-red-700 cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <h2 className="font-display font-bold text-xl text-gray-900 tracking-tight">Become A Partner Today</h2>
                <p className="font-sans text-xs text-gray-400 mt-1">
                  Fill out our partner interest form to secure your high-converting 35% link.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-gray-700">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Liam Smith"
                    className="w-full bg-gray-50/50 border border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-xs font-sans text-gray-800 transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. liam@example.com"
                    className="w-full bg-gray-50/50 border border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-xs font-sans text-gray-800 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-gray-700">Website or Channel URL</label>
                  <input
                    type="url"
                    required
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="e.g. https://mycarblog.co.uk"
                    className="w-full bg-gray-50/50 border border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-xs font-sans text-gray-800 transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-sans font-semibold text-gray-700">Primary Traffic Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full bg-gray-50/50 border border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-xs font-sans text-gray-800 transition-all outline-none cursor-pointer"
                  >
                    <option value="Social Media">Social Media (YouTube / Instagram / TikTok)</option>
                    <option value="Automotive Blog">Automotive Blog or Forum</option>
                    <option value="Dealership Portal">Used Car Dealership / Brokerage</option>
                    <option value="Email Newsletter">Email Newsletter Network</option>
                    <option value="Other">Other Referral Channel</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-sans font-semibold text-gray-700">Partnership Vision / Messages</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us briefly how you plan to refer customers to VinPremium..."
                  className="w-full bg-gray-50/50 border border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 rounded-xl px-4 py-3 text-xs font-sans text-gray-800 transition-all outline-none resize-none"
                />
              </div>

              {submitError && (
                <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-lg text-xs font-sans text-red-800 font-medium">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-red-200 disabled:opacity-85"
              >
                <span>{isSubmitting ? "Submitting Application..." : "Submit Partnership Registration"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-2 justify-center text-[10px] text-gray-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authorized secure partnership portal under UK FCA compliance standards.</span>
              </div>

            </form>
          )}

        </div>

        {/* Right Column: Information & FAQ */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <h3 className="font-display font-bold text-base text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>Program Benefits</span>
            </h3>
            
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold mt-0.5">✓</div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-xs">Highest Commission Rate</h4>
                  <p className="text-gray-500 mt-0.5">We pay out 35% on every purchase. If a referral purchases our multi-vehicle pack (£104.99), you make £36.75 on a single click!</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold mt-0.5">✓</div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-xs">High Conversion Rate</h4>
                  <p className="text-gray-500 mt-0.5">Used car buyers always check. Our high-fidelity, trusted interface and premium warranties guarantee highly optimized click-to-sale ratios.</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold mt-0.5">✓</div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-xs">Promo Banners & Assets</h4>
                  <p className="text-gray-500 mt-0.5">Get instant access to ready-made banners, text link formats, and sample content templates for your website, video, or social posts.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-gray-900 uppercase tracking-wider pl-1">Partner FAQ</h3>
            
            <div className="border border-gray-100 rounded-xl p-4 bg-white">
              <h4 className="font-display font-bold text-xs text-gray-900">Who can join the program?</h4>
              <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                Anyone with a platform! Whether you run an active automotive blog, a popular YouTube channel, a dealership, or a social network profile, you are welcome to apply.
              </p>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 bg-white">
              <h4 className="font-display font-bold text-xs text-gray-900">How and when do I get paid?</h4>
              <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                Commission payments are calculated monthly. We clear all approved earnings on the 10th of every month for transactions made in the preceding calendar month. Minimum payout is £50.
              </p>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 bg-white">
              <h4 className="font-display font-bold text-xs text-gray-900">Does it cost anything to apply?</h4>
              <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">
                Absolutely not. Joining the VinPremium Affiliate Program is 100% free. We provide all trackers, assets, and support with no hidden fees.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
