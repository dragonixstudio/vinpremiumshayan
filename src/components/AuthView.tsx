import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";

interface AuthViewProps {
  initialMode?: "login" | "signup";
  onSuccess?: () => void;
  // Optional registration data if they are signing up as part of a payment flow
  registrationData?: {
    plate: string;
    vin?: string;
    planName?: string;
    planPrice?: string;
  };
}

export default function AuthView({ initialMode = "login", onSuccess, registrationData }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!firstName.trim() || !lastName.trim()) {
          setError("Please enter your first and last name.");
          setLoading(false);
          return;
        }

        // 1. Submit to Supabase Auth
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        // 2. If registration data is present or as a fallback for 23 forms (Web3Forms)
        try {
          const formData = new FormData();
          formData.append("access_key", "ef8188b1-f6d1-4c68-866a-f3bde4eef1a8");
          formData.append("name", `${firstName} ${lastName}`);
          formData.append("email", email);
          formData.append(
            "message",
            `
NEW USER SIGNUP WITH SUPABASE AUTH:

User: ${firstName} ${lastName}
Email: ${email}
Status: Account created successfully

Vehicle Intent:
Registration Plate: ${registrationData?.plate || "N/A"}
VIN/Chassis: ${registrationData?.vin || "N/A"}
Selected Plan: ${registrationData?.planName || "N/A"}
Price: ${registrationData?.planPrice || "N/A"}
            `.trim()
          );

          await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
          });
        } catch (web3Err) {
          console.error("Web3Forms submit error during signup:", web3Err);
        }

        setSuccessMsg("Registration successful! Welcome to VinPremium.");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);

      } else {
        // Login mode
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
          throw loginError;
        }

        setSuccessMsg("Successfully logged in!");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An authentication error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-12 px-4 sm:px-6 flex items-center justify-center min-h-[70vh]">
      <div className="bg-white w-full rounded-2xl shadow-xl border border-gray-150 p-8">
        <div className="text-center mb-8">
          <h2 className="font-display font-bold text-2xl text-gray-900">
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h2>
          <p className="font-sans text-xs text-gray-500 mt-1.5 leading-relaxed">
            {mode === "login"
              ? "Sign in to access your saved vehicle history reports and certificates"
              : "Register in seconds to secure your vehicle audit and view live parameters"}
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg text-xs font-sans text-red-800 font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-5 bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg text-xs font-sans text-green-800 font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-150 focus:border-red-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-150 focus:border-red-600"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-150 focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-red-150 focus:border-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-sans font-bold text-xs py-3 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-85 shadow-md shadow-red-200"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{mode === "login" ? "Verifying..." : "Creating Account..."}</span>
              </>
            ) : (
              <>
                <span>{mode === "login" ? "Sign In" : "Register Now"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="font-sans text-xs text-gray-500">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
                setSuccessMsg("");
              }}
              className="font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer focus:outline-none"
            >
              {mode === "login" ? "Sign Up Free" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
