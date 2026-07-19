import React from "react";
import { ShieldAlert, RefreshCw, Home } from "lucide-react";

interface CancelViewProps {
  onNavigateHome: () => void;
}

export default function CancelView({ onNavigateHome }: CancelViewProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center animate-fadeIn">
      <div className="bg-white border border-gray-150 rounded-3xl p-8 md:p-12 shadow-lg shadow-gray-100 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Checkout Cancelled</h2>
        <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
          The purchase session was cancelled. Don't worry, you haven't been charged. If you're ready to secure your vehicle details, you can rerun your audit search anytime.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onNavigateHome}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-md shadow-red-200"
          >
            <Home className="w-4 h-4" />
            <span>Search New Car Plate</span>
          </button>
          <button
            onClick={onNavigateHome}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-sans font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Payment Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
