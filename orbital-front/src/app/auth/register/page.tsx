"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Terminal, Activity, Rocket, Info, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"OBSERVER" | "OPERATOR">("OBSERVER");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.full_name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the terms");
      return;
    }

    setLoading(true);

    const payload = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      role: role, // UPPERCASE gönder
    };

    console.log("Sending payload:", payload);

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (!response.ok) {
        // 422 validation hatası için detaylı mesaj
        if (response.status === 422 && data.detail) {
          const validationErrors = Array.isArray(data.detail) 
            ? data.detail.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ')
            : JSON.stringify(data.detail);
          throw new Error(`Validation error: ${validationErrors}`);
        }
        
        // Diğer hatalar
        const errorMessage = typeof data.detail === 'string' 
          ? data.detail 
          : JSON.stringify(data.detail || data);
        throw new Error(errorMessage);
      }

      // Başarılı kayıt
      router.push("/auth/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-12 relative overflow-hidden bg-astro-black">
      {/* Container */}
      <div className="max-w-[1240px] w-full flex flex-col lg:flex-row relative z-10 shadow-2xl h-[780px]">
        
        {/* Left Panel */}
        <div className="w-full lg:w-[45%] bg-[#030405] p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#7be1ea]/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="mb-4">
              <Image 
                src="/astrologo.gif" 
                alt="Logo" 
                width={100} 
                height={100} 
                className="opacity-95 mix-blend-screen"
                unoptimized
              />
            </div>
            
            <h1 className="text-astro-cyan font-bold text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-6">
              ORBITAL<br />SENSE
            </h1>
            
            <div className="mt-8 border-l-[1px] border-astro-cyan/50 pl-5">
              <p className="text-astro-muted text-[11px] uppercase tracking-[0.25em] font-mono leading-relaxed max-w-[280px]">
                BEYOND THE ATMOSPHERE. PREDICTING THE ANOMALY.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-10 mt-16 font-mono relative z-10">
            <div className="flex gap-4 items-start">
              <div className="mt-1 flex-shrink-0">
                <Activity size={24} className="text-[#a3e635]" />
              </div>
              <div className="mt-1">
                <h3 className="text-white text-sm font-bold tracking-wider mb-2">REAL-TIME TELEMETRY</h3>
                <p className="text-[#64748b] text-[11px] leading-[1.7] max-w-[320px]">
                  Direct downlink from solar observation satellites including ACE, DSCOVR, and SOHO.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="mt-1 flex-shrink-0">
                <Rocket size={24} className="text-astro-cyan" />
              </div>
              <div className="mt-1">
                <h3 className="text-white text-sm font-bold tracking-wider mb-2">CME PROPAGATION</h3>
                <p className="text-[#64748b] text-[11px] leading-[1.7] max-w-[320px]">
                  Advanced modeling for Coronal Mass Ejections with sub-minute latency alerts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[55%] bg-[#121212] p-10 lg:p-16 flex flex-col relative border-l border-white/5">
          {/* Header Row */}
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-white text-2xl font-bold tracking-widest font-sans uppercase">
              ACCESS AUTHORIZATION
            </h2>
            <Link href="/auth/login" className="text-astro-cyan text-[10px] font-mono uppercase tracking-[0.2em] hover:underline underline-offset-4 decoration-astro-cyan/50 mb-1">
              SIGN IN
            </Link>
          </div>

          <div className="flex-1 flex flex-col">
            
            {/* Nav Tabs */}
            <div className="flex h-24 mb-10 bg-[#1a1a1a] shadow-inner mb-12">
              <div 
                onClick={() => setRole("OBSERVER")}
                className={`flex-1 flex flex-col items-center justify-center gap-3 border-b-2 cursor-pointer transition-colors ${
                  role === "OBSERVER" 
                    ? "border-astro-cyan text-astro-cyan bg-[#1f1f1f]" 
                    : "border-transparent text-astro-muted hover:text-white/80"
                }`}
              >
                <Eye size={20} />
                <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase mt-1">OBSERVER</span>
              </div>
              <div 
                onClick={() => setRole("OPERATOR")}
                className={`flex-1 flex flex-col items-center justify-center gap-3 border-b-2 cursor-pointer transition-colors ${
                  role === "OPERATOR" 
                    ? "border-astro-cyan text-astro-cyan bg-[#1f1f1f]" 
                    : "border-transparent text-astro-muted hover:text-white/80"
                }`}
              >
                <Terminal size={20} />
                <span className="font-mono text-xs font-bold tracking-[0.2em] uppercase mt-1">OPERATOR</span>
              </div>
            </div>

            <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 mb-6 text-red-400 text-xs font-mono tracking-wider">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-12 gap-y-12 mb-10">
                <div className="flex flex-col gap-3">
                  <label className="text-astro-muted text-[9px] font-mono tracking-[0.2em] uppercase">
                    FULL NAME
                  </label>
                  <input 
                    type="text" 
                    placeholder="COMMANDER J. DOE" 
                    className="astro-input"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-astro-muted text-[9px] font-mono tracking-[0.2em] uppercase">
                    EMAIL ADDRESS
                  </label>
                  <input 
                    type="email" 
                    placeholder="CONTACT@ASTRO.IO" 
                    className="astro-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-astro-muted text-[9px] font-mono tracking-[0.2em] uppercase">
                    PASSWORD
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="astro-input text-lg tracking-[0.2em]"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-astro-muted text-[9px] font-mono tracking-[0.2em] uppercase">
                    CONFIRM PASSWORD
                  </label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="astro-input text-lg tracking-[0.2em]"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Alert Box */}
              <div className="bg-[#050505] p-5 flex items-center gap-4 mb-10">
                <Info size={16} className="text-[#eab308] fill-[#eab308]/20 flex-shrink-0" />
                <p className="text-astro-muted font-mono text-[11px] tracking-widest">
                  Email is required to receive weekly <span className="text-[#eab308] font-bold mx-1">Kp-Index</span> summaries.
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-5 mb-auto">
                <input 
                  type="checkbox" 
                  className="astro-checkbox mt-0.5 flex-shrink-0" 
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms" className="text-astro-muted text-[10px] uppercase font-mono tracking-[0.15em] cursor-pointer select-none leading-relaxed">
                  I ACCEPT THE PROTOCOL TERMS OF USE AND DATA PROCESSING AUTHORIZATION.
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-astro-cyan text-astro-black font-bold text-[13px] tracking-[0.25em] py-5 px-8 flex justify-between items-center hover:bg-astro-cyan-dim transition-colors mt-8 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "PROCESSING..." : "INITIATE REGISTRATION"}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 flex justify-between text-[#475569] text-[9px] font-mono tracking-[0.2em] uppercase">
              <span>SECTOR-01 REGISTRATION</span>
              <span>UTC: 12:44:02.119</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global Bottom Footer text */}
      <div className="fixed bottom-6 w-full flex justify-between px-12 text-[#334155] text-[9px] font-mono tracking-[0.2em] uppercase z-0 pointer-events-none">
        <span className="opacity-50 hover:opacity-100 transition-opacity">© 2024 ORBITAL SENSE SYSTEM. ALL RIGHTS RESERVED.</span>
        <span className="opacity-50 hover:opacity-100 transition-opacity">© 2024 ORBITAL SENSE SYSTEM. ALL RIGHTS RESERVED.</span>
        <span className="opacity-50 hover:opacity-100 transition-opacity hidden md:inline">© 2024 ORBITAL SENSE SYSTEM. ALL RIGHTS RESERVED.</span>
        <span className="opacity-50 hover:opacity-100 transition-opacity hidden lg:inline">© 2024 ORBITAL SENSE SYSTEM. ALL RIGHTS RESERVED.</span>
      </div>
    </div>
  );
}
