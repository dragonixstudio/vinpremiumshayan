import React from "react";
import { Shield, Database, Award, CheckCircle, Flame, FileText, CheckCircle2 } from "lucide-react";

export default function AboutView() {
  const highlights = [
    {
      icon: <Database className="w-8 h-8 text-red-600" />,
      title: "Direct DVLA & MOT Sync",
      description: "Our systems pull live, accurate data directly from the Driver and Vehicle Licensing Agency (DVLA) and the official UK MOT database."
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: "Anti-Fraud Algorithms",
      description: "We scan written-off (MIAFTR), outstanding finance (HPI), stolen car registries, and mileage histories to flag discrepancies instantly."
    },
    {
      icon: <Award className="w-8 h-8 text-red-600" />,
      title: "Award-Winning Reports",
      description: "Formated perfectly as printable digital certificates. Highly trusted by car dealers, private buyers, and insurers alike across the UK."
    }
  ];

  const stats = [
    { value: "45M+", label: "UK Vehicles Scanned" },
    { value: "99.8%", label: "Data Accuracy Rate" },
    { value: "10 Secs", label: "Average Report Speed" },
    { value: "15M+", label: "Verified Mileage Records" }
  ];

  return (
    <div className="bg-gray-50/50 py-12 md:py-20" id="about-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full inline-block mb-3">
            About VinPremium.uk
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-gray-900 tracking-tight leading-none mb-6">
            Securing Your Automotive Investments
          </h1>
          <p className="font-sans text-lg text-gray-600 leading-relaxed">
            Founded in London, vinpremium.uk provides the ultimate consumer safeguard for vehicle purchases in Great Britain and Northern Ireland. We bring complete transparency to secondary auto markets.
          </p>
        </div>

        {/* Story Section with Visual Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-xs">
          <div>
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-6">
              Our Mission: Zero Unresolved Questions
            </h2>
            <p className="font-sans text-gray-600 mb-4 leading-relaxed">
              Buying a used car is historically fraught with risk. Mileage clocking, hidden structural write-offs (Cat S, Cat N), outstanding finance liens, and stolen histories cost British car buyers millions of pounds every year.
            </p>
            <p className="font-sans text-gray-600 mb-6 leading-relaxed">
              At VinPremium, we consolidate over 80 discrete data points into a single, cohesive, premium PDF document. We strive to give everyday consumers identical intelligence to premier dealerships at a fraction of the market cost.
            </p>

            <div className="space-y-3">
              {[
                "100% compliant with the UK Data Protection Act",
                "Official integration partner for DVLA vehicle registries",
                "Recognized written-off classification (MIAFTR data source)",
                "Full consumer security certificate with every purchase"
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="font-sans text-sm text-gray-800 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 p-8 rounded-xl border border-red-100/50 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
            <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
              <Flame className="w-72 h-72 text-red-100/50 rotate-12" />
            </div>
            
            <div className="relative z-10">
              <h3 className="font-display font-bold text-2xl text-red-950 mb-3">
                Why trust VinPremium over cheaper alternatives?
              </h3>
              <p className="font-sans text-sm text-red-900/90 leading-relaxed mb-6">
                Cheap vehicle checks skip critical, expensive database queries. A budget check will often fail to query actual active finance agreements or insurer write-off registers. With VinPremium, you are covered by our £40,000 Data Accuracy Guarantee, giving you ultimate peace of mind.
              </p>
            </div>

            <div className="border-t border-red-200/50 pt-6 relative z-10 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-display font-bold text-lg">
                UK
              </div>
              <div>
                <p className="font-display font-bold text-red-950 text-sm">Official UK Database Registry</p>
                <p className="font-sans text-xs text-red-700/80">Authorized Partner No. GB-DVLA-8219</p>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {highlights.map((item, index) => (
            <div key={index} className="bg-white border border-gray-100 p-8 rounded-xl hover:border-red-100 hover:shadow-md transition-all group">
              <div className="mb-4 bg-red-50 p-3 rounded-lg w-fit group-hover:bg-red-600 group-hover:text-white transition-all">
                {React.cloneElement(item.icon, { className: "w-8 h-8 text-red-600 group-hover:text-white transition-all" })}
              </div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Strip */}
        <div className="bg-red-900 text-white p-8 md:p-12 rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center shadow-lg shadow-red-950/20">
          {stats.map((stat, i) => (
            <div key={i} className="border-red-800/40 border-r [&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:border-r lg:last:border-r-0">
              <p className="font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-2 text-white">
                {stat.value}
              </p>
              <p className="font-sans text-xs md:text-sm text-red-200 uppercase tracking-wider font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
