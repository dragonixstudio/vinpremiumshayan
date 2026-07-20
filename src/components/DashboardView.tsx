import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";
import { 
  LogOut, 
  UserCheck, 
  Calendar, 
  Mail, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  Lock,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { VehicleReport } from "../types";

interface DashboardViewProps {
  user: User;
  onLogout: () => void;
  activeReport: VehicleReport | null;
  onViewReport: () => void;
  audits: any[];
  auditsLoading: boolean;
  auditsError: string;
  onSelectPendingAudit: (plate: string, reportData: any) => void;
  onSelectPaidAudit: (reportData: any) => void;
}

export default function DashboardView({ 
  user, 
  onLogout, 
  activeReport, 
  onViewReport,
  audits,
  auditsLoading,
  auditsError,
  onSelectPendingAudit,
  onSelectPaidAudit
}: DashboardViewProps) {
  const [selectedPaidReport, setSelectedPaidReport] = useState<any | null>(null);

  const firstName = user.user_metadata?.first_name || user.email?.split("@")[0] || "User";
  const lastName = user.user_metadata?.last_name || "";
  const email = user.email || "";
  const joinedDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "Recently";

  const handleLogoutClick = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onLogout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-red-950 rounded-3xl p-8 md:p-10 text-white shadow-xl mb-8 border border-red-500/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="inline-flex items-center space-x-1.5 bg-red-600 text-white font-mono text-[9px] font-bold tracking-widest uppercase py-1 px-3.5 rounded-full border border-red-500/20 mb-3.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Account</span>
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-white mb-2">
              Welcome, {firstName}!
            </h1>
            <p className="font-sans text-gray-300 text-xs sm:text-sm max-w-md">
              Access your saved vehicles, request priority lookups, and view verified DVLA registrations in your secured portal.
            </p>
          </div>
          
          <button
            onClick={handleLogoutClick}
            className="self-start md:self-center font-sans font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/15 px-4.5 py-2.5 rounded-lg transition-all flex items-center space-x-2 cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
          <h3 className="font-display font-bold text-sm text-gray-900 pb-4 border-b border-gray-100 flex items-center space-x-2">
            <UserCheck className="w-4.5 h-4.5 text-red-600" />
            <span>Account Details</span>
          </h3>
          
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Full Name</p>
              <p className="font-display font-bold text-sm text-gray-800 mt-0.5">
                {firstName} {lastName}
              </p>
            </div>

            <div>
              <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold flex items-center space-x-1">
                <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                <span>Email Address</span>
              </p>
              <p className="font-mono text-xs text-gray-700 mt-1 select-all break-all">
                {email}
              </p>
            </div>

            <div>
              <p className="font-sans text-[10px] text-gray-400 uppercase tracking-wider font-semibold flex items-center space-x-1">
                <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                <span>Joined Date</span>
              </p>
              <p className="font-sans text-xs text-gray-700 mt-0.5">
                {joinedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Saved Audits / Active Report Card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-150 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-gray-900 pb-4 border-b border-gray-100 flex items-center space-x-2">
              <FileText className="w-4.5 h-4.5 text-red-600" />
              <span>My Vehicle Audits</span>
            </h3>

            <div className="mt-4">
              {auditsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-3" />
                  <p className="font-sans text-xs">Fetching your secure vehicle audits history...</p>
                </div>
              ) : auditsError ? (
                <div className="text-center py-8 text-red-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-red-500" />
                  <p className="font-sans text-xs font-semibold">{auditsError}</p>
                </div>
              ) : audits.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-sans text-xs">No vehicle audits processed yet.</p>
                  <p className="font-sans text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">
                    Enter a license plate or VIN on the homepage to start a lookup.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {audits.map((row) => {
                    const formattedDate = row.created_at 
                      ? new Date(row.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })
                      : "Recently";
                    const isPaid = row.status === "paid";
                    
                    return (
                      <div 
                        key={row.id} 
                        className="bg-gray-50/50 hover:bg-gray-50 border border-gray-150 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          {/* Beautiful UK style plate */}
                          <div className="bg-yellow-100 border-2 border-gray-900 rounded-lg px-2.5 py-1 font-mono font-extrabold tracking-widest text-xs text-gray-900 select-none shadow-xs shrink-0">
                            {row.number_plate}
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-xs sm:text-sm text-gray-800">
                              {row.make} {row.model}
                            </h4>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <p className="font-sans text-[11px] text-gray-400">
                                {formattedDate}
                              </p>
                              <span className="text-gray-300">•</span>
                              <p className="font-sans text-[11px] text-gray-400">
                                {row.colour || "Unknown colour"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          {isPaid ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans tracking-wide uppercase bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                              Pending
                            </span>
                          )}

                          <button
                            onClick={() => {
                              if (isPaid) {
                                setSelectedPaidReport(row.full_report || row);
                              } else {
                                onSelectPendingAudit(row.number_plate, row.full_report || row);
                              }
                            }}
                            className={`font-sans font-bold text-[11px] px-3.5 py-2 rounded-lg transition-all flex items-center space-x-1 cursor-pointer shadow-xs ${
                              isPaid 
                                ? "bg-red-600 hover:bg-red-700 text-white" 
                                : "bg-gray-800 hover:bg-gray-900 text-white"
                            }`}
                          >
                            <span>View Report</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center space-x-3.5 text-xs text-gray-500 leading-normal bg-red-50/20 p-3 rounded-lg border border-red-100/30">
            <Lock className="w-4.5 h-4.5 text-red-600 shrink-0" />
            <p className="font-sans text-[10px]">
              <strong>Security Information:</strong> All lookups correspond to verified official records. If you purchased a premium package, your complete decrypted report files are bound and persistent here.
            </p>
          </div>
        </div>

      </div>

      {/* RENDER DETAILED PAID REPORT MODAL */}
      {selectedPaidReport && (
        <div className="fixed inset-0 z-50 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8 animate-fadeIn">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-150 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-100 border-2 border-gray-900 rounded-lg px-2.5 py-1 font-mono font-extrabold tracking-widest text-xs text-gray-900 select-none shadow-xs">
                  {selectedPaidReport.plate || selectedPaidReport.number_plate}
                </div>
                <h3 className="font-display font-bold text-sm text-gray-800">
                  {selectedPaidReport.make} {selectedPaidReport.model}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedPaidReport(null)}
                className="text-gray-400 hover:text-gray-600 font-sans text-sm font-medium cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Core Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Make & Model</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedPaidReport.make} {selectedPaidReport.model}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Year of Manufacture</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedPaidReport.year || "Unknown"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Colour</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedPaidReport.color || selectedPaidReport.colour || "Unknown"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Fuel Type</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">{selectedPaidReport.fuelType || selectedPaidReport.fuel_type || "Unknown"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">MOT Status</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      (selectedPaidReport.motHistory?.[0]?.result || selectedPaidReport.mot_status) === "Pass" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    }`}>
                      {selectedPaidReport.motHistory?.[0]?.result || selectedPaidReport.mot_status || "Pass"}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">Tax Status</p>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      {selectedPaidReport.roadTaxStatus || selectedPaidReport.tax_status || "Taxed"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Status Checklist */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-gray-800 mb-3">Security and Status Indicators</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-500">Stolen Check</span>
                    <span className={`font-bold font-mono ${selectedPaidReport.stolenStatus === "CLEAN" ? "text-emerald-600" : "text-red-600"}`}>
                      {selectedPaidReport.stolenStatus || "CLEAN"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-500">Finance Outstanding</span>
                    <span className={`font-bold font-mono ${selectedPaidReport.financeOutstanding === "NO" ? "text-emerald-600" : "text-red-600"}`}>
                      {selectedPaidReport.financeOutstanding || "NO"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-500">Insurance Write-Off</span>
                    <span className={`font-bold font-mono ${selectedPaidReport.writeOffStatus === "CLEAN" ? "text-emerald-600" : "text-red-600"}`}>
                      {selectedPaidReport.writeOffStatus || "CLEAN"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-gray-500">Scrapped Status</span>
                    <span className={`font-bold font-mono ${selectedPaidReport.scrappedStatus === "NO" ? "text-emerald-600" : "text-red-600"}`}>
                      {selectedPaidReport.scrappedStatus || "NO"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Mileage History */}
              {selectedPaidReport.mileageHistory && selectedPaidReport.mileageHistory.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold text-gray-800 mb-3">Mileage Records</h4>
                  <div className="overflow-hidden border border-gray-100 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-100 text-left text-xs font-sans">
                      <thead className="bg-gray-50 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Mileage</th>
                          <th className="px-4 py-2">Source</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-gray-700 bg-white">
                        {selectedPaidReport.mileageHistory.slice(0, 3).map((m: any, idx: number) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 font-mono">{m.date}</td>
                            <td className="px-4 py-2 font-bold">{m.mileage?.toLocaleString()} mi</td>
                            <td className="px-4 py-2 text-gray-500">{m.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-150 px-6 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <button 
                onClick={() => {
                  setSelectedPaidReport(null);
                  onSelectPaidAudit(selectedPaidReport);
                }}
                className="w-full sm:w-auto font-sans font-bold text-xs bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <span>Open Full Interactive Report</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setSelectedPaidReport(null)}
                className="w-full sm:w-auto font-sans font-semibold text-xs text-gray-500 hover:text-gray-700 px-4 py-2 border border-gray-200 bg-white rounded-lg transition-all cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
