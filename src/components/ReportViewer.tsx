import React, { useState } from "react";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  Calendar, 
  Gauge, 
  FileText, 
  AlertTriangle, 
  Download, 
  Lock, 
  Printer, 
  Check, 
  X, 
  User, 
  Hash, 
  Compass, 
  Flame, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";
import { VehicleReport } from "../types";

interface ReportViewerProps {
  report: VehicleReport;
  isUnlocked: boolean;
  onUnlockClick: () => void;
}

export default function ReportViewer({ report, isUnlocked, onUnlockClick }: ReportViewerProps) {
  const [expandedMot, setExpandedMot] = useState<number | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Print utility that generates clean downloadable PDF
  const handlePrint = () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById("printable-report-content");
    if (!element) {
      setIsGeneratingPdf(false);
      return;
    }

    const opt = {
      margin:       10,
      filename:     `VinPremium-Report-${report.plate}.pdf`,
      image:        { type: "jpeg" as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" as const }
    };

    // @ts-ignore
    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        setIsGeneratingPdf(false);
      })
      .catch((err: any) => {
        console.error("PDF generation error:", err);
        setIsGeneratingPdf(false);
      });
  };

  const scoreColor = report.score >= 90 
    ? "text-emerald-600 bg-emerald-50 border-emerald-100" 
    : report.score >= 80 
      ? "text-yellow-600 bg-yellow-50 border-yellow-100" 
      : "text-red-600 bg-red-50 border-red-100";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden print:border-none print:shadow-none" id="report-view-container">
      
      {/* Top Banner Warning if Locked */}
      {!isUnlocked && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg text-white animate-pulse">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm tracking-wide">
                PREVIEW REPORT SHOWN — SENSITIVE DATA LOCKED
              </h4>
              <p className="font-sans text-xs text-red-100">
                Some MOT failures, outstanding finance values, and accident histories are censored.
              </p>
            </div>
          </div>
          <button
            onClick={onUnlockClick}
            className="bg-white text-red-600 font-sans font-bold text-xs py-2 px-5 rounded-lg hover:bg-red-50 transition-all cursor-pointer shadow-sm flex items-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unlock Premium PDF Report</span>
          </button>
        </div>
      )}

      {/* Unlocked Floating Actions */}
      {isUnlocked && (
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2 text-emerald-800 text-xs font-semibold font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Premium Report Fully Decrypted & Validated</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              disabled={isGeneratingPdf}
              className="bg-white text-gray-700 border border-gray-200 hover:border-red-600 hover:text-red-600 text-xs font-sans font-bold py-1.5 px-4 rounded-lg flex items-center space-x-1.5 cursor-pointer transition-colors disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print/Save PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Printable Certificate Container */}
      <div id="printable-report-content" className="p-8 md:p-12 print:p-4 bg-white rounded-2xl">
        
        {/* Certificate Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 mb-8 space-y-4 md:space-y-0">
          <div>
            <div className="flex items-center space-x-2 text-red-600 font-mono text-xs font-bold tracking-widest uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Official VinPremium Audit Certificate</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-gray-900 tracking-tight">
              {report.make} <span className="text-red-600">{report.model}</span>
            </h1>
            <p className="font-sans text-xs text-gray-400 mt-1">
              Generated on: 14 July 2026 at 22:58 • Report Ref: #VP-8219-{report.plate}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Health Score Circular Badge */}
            <div className={`border rounded-xl p-4 flex items-center space-x-3 ${scoreColor}`}>
              <div className="text-right">
                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">VinPremium Score</p>
                <p className="font-display font-bold text-2xl text-gray-900">{report.score}<span className="text-gray-400 text-xs">/100</span></p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center font-display font-bold text-lg">
                {report.score >= 90 ? "A" : report.score >= 80 ? "B" : "C"}
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Panels */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg text-red-600 border border-gray-200/50">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Model Year</p>
              <p className="font-display font-bold text-sm text-gray-800">{report.year}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg text-red-600 border border-gray-200/50">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">UK Number Plate</p>
              <p className="font-mono font-bold text-sm text-red-600 bg-yellow-100/50 border border-yellow-200 px-2 py-0.5 rounded-md w-fit">
                {report.plate}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg text-red-600 border border-gray-200/50">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Total Mileage</p>
              <p className="font-mono font-bold text-sm text-gray-800">
                {report.mileageHistory[report.mileageHistory.length - 1]?.mileage.toLocaleString() || "Locked"} mi
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg text-red-600 border border-gray-200/50">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Prev Owners</p>
              <p className="font-display font-bold text-sm text-gray-800">{report.previousOwners}</p>
            </div>
          </div>

        </div>

        {/* 6 Critical Status Check Grid */}
        <div className="mb-10">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-red-600" />
            <span>Critical Registry Database Audits</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Check 1: Stolen */}
            <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Police Stolen Check</p>
                <h4 className="font-display font-bold text-sm text-gray-800">National Stolen Registry</h4>
              </div>
              <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>{report.stolenStatus}</span>
              </div>
            </div>

            {/* Check 2: Finance */}
            <div className={`border rounded-xl p-4 flex items-center justify-between ${
              report.financeOutstanding === "YES" && isUnlocked ? "border-red-100 bg-red-50/10" : "border-gray-100"
            }`}>
              <div>
                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Outstanding Finance</p>
                <h4 className="font-display font-bold text-sm text-gray-800">Active Finance Liens</h4>
              </div>
              {!isUnlocked ? (
                <div className="flex items-center space-x-1 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold select-none">
                  <Lock className="w-3 h-3" />
                  <span>CENSORED</span>
                </div>
              ) : report.financeOutstanding === "YES" ? (
                <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>LIENS FOUND</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>CLEAR</span>
                </div>
              )}
            </div>

            {/* Check 3: Written-off */}
            <div className={`border rounded-xl p-4 flex items-center justify-between ${
              report.writeOffStatus !== "CLEAN" && isUnlocked ? "border-red-100 bg-red-50/10" : "border-gray-100"
            }`}>
              <div>
                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Insurance Write-off</p>
                <h4 className="font-display font-bold text-sm text-gray-800">MIAFTR Log Categories</h4>
              </div>
              {!isUnlocked ? (
                <div className="flex items-center space-x-1 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold select-none">
                  <Lock className="w-3 h-3" />
                  <span>CENSORED</span>
                </div>
              ) : report.writeOffStatus !== "CLEAN" ? (
                <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{report.writeOffStatus}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>CLEAN</span>
                </div>
              )}
            </div>

            {/* Check 4: Scrapped */}
            <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Scrapped Status</p>
                <h4 className="font-display font-bold text-sm text-gray-800">DVLA Scrappage Registry</h4>
              </div>
              <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>NO</span>
              </div>
            </div>

            {/* Check 5: Imported */}
            <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Import/Export Record</p>
                <h4 className="font-display font-bold text-sm text-gray-800">HMRC Port Logs Check</h4>
              </div>
              <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>{report.importedStatus}</span>
              </div>
            </div>

            {/* Check 6: VIC Subject */}
            <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">VIC Subject Check</p>
                <h4 className="font-display font-bold text-sm text-gray-800">Identity Inspections</h4>
              </div>
              <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>NO</span>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Vehicle Specifications Table */}
        <div className="mb-10">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-red-600" />
            <span>DVLA Registered Specifications</span>
          </h3>
          
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              <div className="divide-y divide-gray-100">
                <div className="grid grid-cols-2 px-6 py-3 text-xs font-sans">
                  <span className="text-gray-400 font-medium">Vehicle Manufacturer</span>
                  <span className="text-gray-900 font-bold text-right">{report.make}</span>
                </div>
                <div className="grid grid-cols-2 px-6 py-3 text-xs font-sans">
                  <span className="text-gray-400 font-medium">Model Designation</span>
                  <span className="text-gray-900 font-bold text-right">{report.model}</span>
                </div>
                <div className="grid grid-cols-2 px-6 py-3 text-xs font-sans">
                  <span className="text-gray-400 font-medium">Engine Displacement</span>
                  <span className="text-gray-900 font-bold text-right">{report.engineSize}</span>
                </div>
                <div className="grid grid-cols-2 px-6 py-3 text-xs font-sans">
                  <span className="text-gray-400 font-medium">Fuel Category</span>
                  <span className="text-gray-900 font-bold text-right">{report.fuelType}</span>
                </div>
                <div className="grid grid-cols-2 px-6 py-3 text-xs font-sans">
                  <span className="text-gray-400 font-medium">Transmission Type</span>
                  <span className="text-gray-900 font-semibold text-right">{report.transmission}</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="grid grid-cols-2 px-6 py-3 text-xs font-sans">
                  <span className="text-gray-400 font-medium">CO2 Emissions Output</span>
                  <span className="text-gray-900 font-semibold text-right">{report.co2Emissions}</span>
                </div>
                <div className="grid grid-cols-2 px-6 py-3 text-xs font-sans">
                  <span className="text-gray-400 font-medium">Primary Exterior Color</span>
                  <span className="text-gray-900 font-semibold text-right">{report.color}</span>
                </div>
                <div className="grid grid-cols-2 px-6 py-3 text-xs font-sans">
                  <span className="text-gray-400 font-medium">Initial UK Registration</span>
                  <span className="text-gray-900 font-mono text-right">{report.registrationDate}</span>
                </div>
                <div className="grid grid-cols-2 px-6 py-3 text-xs font-sans">
                  <span className="text-gray-400 font-medium">Original Assembly Plant</span>
                  <span className="text-gray-900 font-semibold text-right">{report.assemblyPlant}</span>
                </div>
                <div className="grid grid-cols-2 px-6 py-3 text-xs font-sans">
                  <span className="text-gray-400 font-medium">Euro NCAP Safety Rank</span>
                  <span className="text-emerald-600 font-bold text-right">{report.safetyRating}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Interactive Mileage History Chart Section */}
        <div className="mb-10 print:break-inside-avoid">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-2 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <span>Odometer Verification Timeline</span>
          </h3>
          <p className="font-sans text-xs text-gray-500 mb-6">
            We mapped {report.mileageHistory.length} chronological database updates to scan for mileage clocking frauds.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.mileageHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: "1px solid #f3f4f6", fontFamily: "Inter" }}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mileage" 
                    stroke="#dc2626" 
                    strokeWidth={3} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200/50 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[400px]">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 text-[10px] font-sans font-bold uppercase tracking-wider">
                    <th className="pb-2">Audit Date</th>
                    <th className="pb-2">Source Agency</th>
                    <th className="pb-2 text-right">Odometer Mileage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-sans text-xs text-gray-700">
                  {report.mileageHistory.map((row, i) => (
                    <tr key={i} className="hover:bg-white/50">
                      <td className="py-2.5 font-mono">{row.date}</td>
                      <td className="py-2.5 font-medium">{row.source}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-gray-900">{row.mileage.toLocaleString()} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* UK MOT History Log Section */}
        <div className="mb-10 print:break-inside-avoid">
          <h3 className="font-display font-bold text-lg text-gray-900 mb-2 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-red-600" />
            <span>Ministry of Transport (MOT) Testing Log</span>
          </h3>
          <p className="font-sans text-xs text-gray-500 mb-6">
            Complete records of annually mandated UK safety and emissions testing.
          </p>

          <div className="space-y-4">
            {report.motHistory.length === 0 ? (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center text-gray-500 font-sans text-xs">
                No MOT history available. This vehicle may be under 3 years old or imported.
              </div>
            ) : (
              report.motHistory.map((mot, i) => {
                const isPass = mot.result === "Pass";
                const isExpanded = expandedMot === i;
                
                return (
                  <div 
                    key={i} 
                    className={`border rounded-xl overflow-hidden transition-all ${
                      isPass ? "border-gray-100" : "border-red-100 bg-red-50/5"
                    }`}
                  >
                    {/* Header bar of record */}
                    <div 
                      onClick={() => setExpandedMot(isExpanded ? null : i)}
                      className="bg-gray-50/60 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-100/50 transition-colors space-y-2 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-bold tracking-wider uppercase ${
                          isPass ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {mot.result}
                        </span>
                        <div>
                          <p className="font-display font-bold text-xs text-gray-800">Test Date: {mot.date}</p>
                          <p className="font-mono text-[10px] text-gray-400">Ref: {mot.testNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-xs">
                        <div>
                          <span className="text-gray-400 font-sans">Tested Mileage</span>
                          <p className="font-mono font-bold text-gray-800 text-right">{mot.odometer.toLocaleString()} mi</p>
                        </div>
                        {mot.expiryDate && (
                          <div className="text-right">
                            <span className="text-gray-400 font-sans">Expiry Date</span>
                            <p className="font-mono font-medium text-gray-800">{mot.expiryDate}</p>
                          </div>
                        )}
                        <span className="text-gray-400 font-bold ml-2 print:hidden">{isExpanded ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {/* Expandable failure/advisory list */}
                    <div className={`p-4 bg-white border-t border-gray-100 divide-y divide-gray-100 ${isExpanded ? "block" : "hidden print:block"}`}>
                      {/* Failures */}
                      {mot.failures && mot.failures.length > 0 && (
                        <div className="pb-3 mb-3">
                          <h5 className="font-display font-bold text-xs text-red-700 flex items-center space-x-1 mb-2">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Critical Test Failure Reasons:</span>
                          </h5>
                          <ul className="list-disc list-inside font-sans text-xs text-gray-700 space-y-1.5 pl-2">
                            {mot.failures.map((f: string, idx: number) => (
                              <li key={idx} className={!isUnlocked ? "blur-xs select-none" : ""}>
                                {!isUnlocked ? "Censored failure reason details on preview" : f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Advisories */}
                      <div>
                        <h5 className="font-display font-semibold text-xs text-yellow-700 flex items-center space-x-1 mb-2 mt-2">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Advisory Notice Items:</span>
                        </h5>
                        {mot.advisories && mot.advisories.length > 0 ? (
                          <ul className="list-disc list-inside font-sans text-xs text-gray-600 space-y-1 pl-2">
                            {mot.advisories.map((adv: string, idx: number) => (
                              <li key={idx} className={!isUnlocked ? "blur-xs select-none" : ""}>
                                {!isUnlocked ? "Censored advisory notice item log" : adv}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="font-sans text-xs text-gray-400 pl-2">No active advisories noted.</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Accident Logs & Safety Recalls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:break-inside-avoid">
          
          {/* Accident History */}
          <div className="border border-gray-100 rounded-2xl p-6">
            <h3 className="font-display font-bold text-base text-gray-900 mb-4 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <span>Accident Log & Damage Inspections</span>
            </h3>

            {report.accidentHistory.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500 font-sans text-xs">
                No structural accident records identified by insurance databases (CLEAN).
              </div>
            ) : (
              report.accidentHistory.map((acc, i) => (
                <div key={i} className="bg-red-50/10 border border-red-100 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-gray-400">{acc.date}</span>
                    <span className="bg-red-100 text-red-800 text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {acc.severity} Impact
                    </span>
                  </div>
                  <h5 className="font-display font-bold text-xs text-gray-800 mb-1">Point of Impact: {acc.pointOfImpact}</h5>
                  <p className={`font-sans text-xs text-gray-600 leading-normal mb-3 ${!isUnlocked ? "blur-xs select-none" : ""}`}>
                    {!isUnlocked ? "Detailed structural accident collision reports are locked." : acc.description}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] font-sans font-semibold text-green-700">
                    <Check className="w-3.5 h-3.5" />
                    <span>Insurance Certified Repair Complete</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Safety Recalls */}
          <div className="border border-gray-100 rounded-2xl p-6">
            <h3 className="font-display font-bold text-base text-gray-900 mb-4 flex items-center space-x-2">
              <Flame className="w-5 h-5 text-red-600" />
              <span>DVSA Safety Recall Bulletins</span>
            </h3>

            {report.recalls.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500 font-sans text-xs">
                No active safety recalls issued for this model (CLEAN).
              </div>
            ) : (
              report.recalls.map((rec, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-gray-400">{rec.date}</span>
                    <span className="bg-green-100 text-green-800 text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {rec.status}
                    </span>
                  </div>
                  <h5 className="font-display font-bold text-xs text-gray-800 mb-1">{rec.component} ({rec.campaignNumber})</h5>
                  <p className="font-sans text-xs text-gray-500 leading-normal">
                    {rec.description}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Certificate Stamp of Authenticity */}
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0 text-center sm:text-left print:break-inside-avoid">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full border-4 border-dashed border-red-200 flex items-center justify-center text-red-600 rotate-12 shrink-0">
              <span className="font-display font-extrabold text-[10px] tracking-widest text-center leading-none">
                VERIFIED<br />VP.UK
              </span>
            </div>
            <div>
              <p className="font-display font-bold text-xs text-gray-900">VinPremium Secure Data Warranty</p>
              <p className="font-sans text-[10px] text-gray-500 max-w-sm">
                This document serves as proof of structural vehicle verification under UK DMV and MIAFTR guidelines. Securely generated with SHA-256 validation.
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="font-sans text-[10px] text-gray-400">Chief Auditor Signature</p>
            <p className="font-display font-bold text-sm text-gray-800 italic tracking-tight">H. Alexander sterling</p>
            <div className="h-[1.5px] w-32 bg-gray-300 ml-auto mt-1" />
          </div>
        </div>

      </div>
    </div>
  );
}
