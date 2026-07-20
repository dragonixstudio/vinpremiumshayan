import React from "react";
import { ShieldCheck, Lock, Eye, CheckCircle, FileWarning } from "lucide-react";

export default function PrivacyView() {
  return (
    <div className="bg-gray-50/50 py-12 md:py-20" id="privacy-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full inline-block mb-3">
            Compliance & Legal
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-gray-900 tracking-tight mb-4">
            Privacy Policy & Data Security
          </h1>
          <p className="font-sans text-sm text-gray-500">
            Last Updated: July 14, 2026 • Version 2.4 (UK GDPR Compliant)
          </p>
        </div>

        {/* Highlight Banner */}
        <div className="bg-white border border-red-100 rounded-xl p-6 mb-10 flex items-start space-x-4">
          <div className="bg-red-50 p-3 rounded-lg text-red-600 flex-shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-900 text-base mb-1">Your Queries Are Encrypted & Private</h3>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              We never share searched vehicle plates or VINs with insurance brokers, third-party sales networks, or advertising agencies. All plate lookups are processed through secure, tokenized SSL channels directly linked to official DVLA datasets.
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 shadow-xs space-y-10">
          
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
              <span>1. Information We Collect</span>
            </h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed mb-4">
              To process your vehicle lookup and deliver the resulting information safely, we collect the following limited classes of data:
            </p>
            <ul className="list-disc list-inside space-y-2 font-sans text-sm text-gray-600 pl-4">
              <li><strong>Search Identifiers:</strong> Vehicle Identification Numbers (VINs), engine serials, and vehicle registration marks (license plates).</li>
              <li><strong>Transaction Records:</strong> Email address, name, billing address, and transaction amounts (all card billing is processed securely via PCI-DSS compliant providers like Stripe).</li>
              <li><strong>Session Data:</strong> IP address, device telemetry, browser metadata, and referring websites to minimize robotic queries and API abuse.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
              <span>2. How We Source and Use Vehicle Data</span>
            </h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed mb-4">
              VinPremium operates under the lawful basis of "legitimate interest" as defined in Section 6(1)(f) of the UK General Data Protection Regulation (UK GDPR), to facilitate structural safety audits for motor vehicles.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="font-sans text-xs text-gray-700"><strong>DVLA Licensing Sync:</strong> Real-time taxation, vehicle weight, and fuel specification mapping.</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="font-sans text-xs text-gray-700"><strong>MIAFTR Databases:</strong> Verification of structural insurance write-off categories.</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="font-sans text-xs text-gray-700"><strong>Police Stolen Vehicle Check:</strong> PNC vehicle status records checking active thefts.</p>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="font-sans text-xs text-gray-700"><strong>HPI Liens Register:</strong> Live inquiry into active finance and leasing liens.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
              <span>3. Data Retention & Caching</span>
            </h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              We do not persist vehicle registration searches indefinitely. All queried results are cached securely for a maximum of 30 days to allow purchasers to download, view, and print their bought PDF certificates. Following this period, lookups are automatically purged, requiring a fresh API query to pull current records.
            </p>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl text-gray-900 mb-4 flex items-center space-x-2">
              <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
              <span>4. Your GDPR Rights & Contact</span>
            </h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed mb-4">
              Under UK GDPR laws, you hold clear rights regarding your personal email records, including the right to erasure, rectification, access, and portability.
            </p>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              If you have any questions, wish to raise a Data Subject Access Request (DSAR), or have questions about how we securely interface with DVLA data, please email our designated Data Protection Officer at <span className="font-mono text-red-600 font-semibold">compliance@vinpremium.co.uk</span>.
            </p>
          </div>

        </div>

        {/* Footer Disclaimer */}
        <div className="mt-10 text-center flex items-center justify-center space-x-2 text-gray-400 text-xs font-sans">
          <ShieldCheck className="w-4 h-4" />
          <span>vinpremium.co.uk is registered with the Information Commissioner's Office (ICO) under registration number ZA82193.</span>
        </div>

      </div>
    </div>
  );
}
