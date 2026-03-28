"use client";

import { Eye, Terminal, Activity, Rocket, ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"observer" | "operator">("observer");
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState("");

  // Hydration hatasını önlemek ve saati canlı tutmak için useEffect
  useEffect(() => {
    setMounted(true);

    // Saati her saniye güncelle
    const updateClock = () => {
      setTime(new Date().toISOString().substring(11, 23));
    };

    updateClock(); // İlk açılışta çalıştır
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-[#0d1616] p-4 text-[0.8rem] text-slate-400 overflow-hidden font-mono tracking-wider">
      {/* Background ambient glow effect */}
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-white/5 to-transparent to-70% pointer-events-none" />

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl min-h-[750px] shadow-2xl relative z-10 border border-white/5 bg-[#0e0f11]">

        {/* Left Side (Black Branding Area) */}
        <div className="flex-[0.45] bg-[#050606] border-r border-white/5 p-12 flex flex-col pt-16 relative">
          <div className="mb-14">
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden shadow-[0_0_20px_rgba(123,225,234,0.3)] mb-8 border border-[#164e63]">
              <img src="/astrologo.gif" alt="Astro Command Logo" className="w-full h-full object-cover" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-[#7be1ea] leading-tight tracking-tight mb-4 uppercase" style={{ textShadow: "0 0 20px rgba(123, 225, 234, 0.4)" }}>
              ORBITAL<br />SENSE
            </h1>
            <div className="flex items-center text-[#7a8c96] text-xs font-mono tracking-widest mt-2 border-l-2 border-[#164e63] pl-3 py-1">
              ORBITAL SENSE PROTOCOL V4.0
            </div>
          </div>

          <div className="mt-auto space-y-10">
            <div className="flex items-start gap-4">
              <Activity className="w-5 h-5 mt-0.5 text-[#a3e635] shrink-0" />
              <div>
                <h3 className="text-[#f8fafc] font-bold text-[0.85rem] mb-1.5 uppercase font-sans tracking-wide">Real-time Telemetry</h3>
                <p className="text-[#7a8c96] leading-relaxed">Direct downlink from solar observation satellites including ACE, DSCOVR, and SOHO.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Rocket className="w-5 h-5 mt-0.5 text-[#7be1ea] shrink-0 fill-[#7be1ea]/20" />
              <div>
                <h3 className="text-[#f8fafc] font-bold text-[0.85rem] mb-1.5 uppercase font-sans tracking-wide">CME Propagation</h3>
                <p className="text-[#7a8c96] leading-relaxed">Advanced modeling for Coronal Mass Ejections with sub-minute latency alerts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Form Area) */}
        <div className="flex-[0.55] p-12 lg:p-16 flex flex-col justify-center bg-[#131518]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl text-white font-bold font-sans tracking-widest">ACCESS AUTHORIZATION</h2>
            <button className="text-[#7be1ea] hover:text-white transition-colors border-b border-[#7be1ea]/50 pb-0.5 uppercase text-xs tracking-[0.2em]">SIGN IN</button>
          </div>

          {/* Form Tabs */}
          <div className="flex gap-4 mb-10 w-full h-[60px]">
            <button
              onClick={() => setActiveTab("observer")}
              className={`flex-1 flex flex-col items-center justify-center gap-2 border-b-2 transition-all ${activeTab === "observer" ? "bg-white/[0.03] border-[#7be1ea] text-[#7be1ea]" : "border-transparent bg-black/20 text-[#5a6a75] hover:text-white"}`}>
              <Eye className="w-5 h-5" />
              <span className="text-[0.7rem] uppercase tracking-widest font-bold">OBSERVER</span>
            </button>
            <button
              onClick={() => setActiveTab("operator")}
              className={`flex-1 flex flex-col items-center justify-center gap-2 border-b-2 transition-all ${activeTab === "operator" ? "bg-white/[0.03] border-[#7be1ea] text-[#7be1ea]" : "border-transparent bg-black/20 text-[#5a6a75] hover:text-white"}`}>
              <Terminal className="w-5 h-5" />
              <span className="text-[0.7rem] uppercase tracking-widest font-bold">OPERATOR</span>
            </button>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <label className="text-[0.65rem] uppercase text-[#5a6a75] tracking-widest mb-2 block font-bold">Full Name</label>
                <input type="text" placeholder="COMMANDER J. DOE" className="astro-input bg-[#0d1013] border border-white/10 p-3 w-full focus:border-[#7be1ea] outline-none transition-all" />
              </div>
              <div className="relative group">
                <label className="text-[0.65rem] uppercase text-[#5a6a75] tracking-widest mb-2 block font-bold">Email Address</label>
                <input type="email" placeholder="CONTACT@ASTRO.IO" className="astro-input bg-[#0d1013] border border-white/10 p-3 w-full focus:border-[#7be1ea] outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <label className="text-[0.65rem] uppercase text-[#5a6a75] tracking-widest mb-2 block font-bold">Password</label>
                <input type="password" placeholder="••••••••" className="astro-input bg-[#0d1013] border border-white/10 p-3 w-full focus:border-[#7be1ea] outline-none transition-all text-lg tracking-[0.3em]" />
              </div>
              <div className="relative group">
                <label className="text-[0.65rem] uppercase text-[#5a6a75] tracking-widest mb-2 block font-bold">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="astro-input bg-[#0d1013] border border-white/10 p-3 w-full focus:border-[#7be1ea] outline-none transition-all text-lg tracking-[0.3em]" />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <input type="checkbox" id="terms" className="astro-checkbox shrink-0 accent-[#7be1ea]" />
              <label htmlFor="terms" className="text-[0.65rem] tracking-widest text-[#7a8c96] cursor-pointer mt-0.5">
                I ACCEPT THE PROTOCOL TERMS OF USE AND DATA PROCESSING AUTHORIZATION.
              </label>
            </div>

            <button className="w-full bg-gradient-to-r from-[#7be1ea] to-[#4cabb4] text-black font-extrabold uppercase tracking-[0.25em] text-[0.8rem] py-4 px-6 flex items-center justify-between hover:brightness-110 active:scale-[0.99] transition-all group mt-6 shadow-[0_0_20px_rgba(123,225,234,0.15)]">
              <span>INITIATE REGISTRATION</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="flex items-center justify-between mt-12 text-[0.6rem] text-[#4a5a65] font-mono tracking-[0.15em] uppercase">
            <span>Sector-01 Registration</span>
            <span>UTC: {mounted ? time : "--:--:--.---"}</span>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="absolute bottom-6 w-full px-12 flex justify-between items-center text-[0.55rem] text-[#4a5a65] tracking-[0.2em] font-mono uppercase z-0">
        <div className="flex gap-8">
          <span className="hover:text-white cursor-pointer transition-colors">TERMINALS</span>
          <span className="hover:text-white cursor-pointer transition-colors">PRIVACY SHIELD</span>
          <span className="hover:text-white cursor-pointer transition-colors">GLOBAL NETWORK</span>
        </div>
        <div>
          © 2024 ASTRO COMMAND SYSTEM. ALL RIGHTS RESERVED.
        </div>
      </div>
    </main>
  );
}