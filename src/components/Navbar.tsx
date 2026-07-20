import React from "react";
import { ShieldCheck, FileText, Menu, X, PhoneCall, User as UserIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface NavbarProps {
  activeTab: "home" | "about" | "privacy" | "report" | "pricing" | "affiliate" | "contact" | "dashboard" | "auth" | "success" | "cancel";
  setActiveTab: (tab: "home" | "about" | "privacy" | "report" | "pricing" | "affiliate" | "contact" | "dashboard" | "auth" | "success" | "cancel") => void;
  hasActiveReport: boolean;
  user: User | null;
}

export default function Navbar({ activeTab, setActiveTab, hasActiveReport, user }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "pricing", label: "Pricing Plans" },
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact & Support" },
    { id: "affiliate", label: "Affiliates" },
    ...(hasActiveReport ? [{ id: "report", label: "Active Report" }] : []),
    ...(user 
      ? [{ id: "dashboard", label: "My Dashboard" }]
      : [{ id: "auth", label: "Sign In" }]
    )
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab("home")}
              className="flex items-center space-x-2 cursor-pointer group"
              id="nav-logo"
            >
              <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200 group-hover:bg-red-700 transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-gray-900">
                vinpremium<span className="text-red-600">.co.uk</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsOpen(false);
                }}
                className={`font-sans font-medium text-sm transition-colors cursor-pointer py-2 ${
                  activeTab === item.id
                    ? "text-red-600 border-b-2 border-red-600 font-semibold"
                    : "text-gray-600 hover:text-red-600"
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
            
            <div className="flex items-center space-x-2 text-gray-500 text-xs border-l border-gray-200 pl-6">
              <PhoneCall className="w-4 h-4 text-red-600 animate-bounce" />
              <div>
                <p className="text-gray-400 font-sans">24/7 Support Helpline</p>
                <p className="font-mono text-gray-800 font-semibold">+44 (0) 20 7946 0192</p>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-red-600 focus:outline-none p-2 rounded-lg cursor-pointer hover:bg-gray-50"
              id="mobile-menu-btn"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg text-base font-sans font-medium transition-colors cursor-pointer ${
                activeTab === item.id
                  ? "bg-red-50 text-red-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
              }`}
              id={`mobile-nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-gray-100 flex items-center space-x-3 px-4">
            <PhoneCall className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-xs text-gray-400 font-sans">Helpline</p>
              <p className="text-sm font-mono text-gray-800 font-semibold">+44 (0) 20 7946 0192</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
