"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center bg-[#070809] p-4 font-mono tracking-widest uppercase overflow-hidden">
      {/* Background Pattern - Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      
      {/* Background Pattern - Circles */}
      <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-[30%] -right-[15%] w-[60vw] h-[60vw] rounded-full border border-white/5 pointer-events-none" />

      {/* Top Branding */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-black flex items-center justify-center relative mb-6 shadow-[0_0_30px_rgba(123,225,234,0.15)] border border-white/5">
          <Image 
            src="/astrologo.gif" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="opacity-95 mix-blend-screen"
            unoptimized
          />
        </div>
        
        <h1 className="text-2xl font-bold text-white tracking-[0.4em] mb-2 text-center">
          ORBITAL SENSE
        </h1>
        <div className="text-[#3a8a92] text-[0.6rem] tracking-[0.2em] font-bold text-center">
          BEYOND THE ATMOSPHERE. PREDICTING THE ANOMALY.
        </div>
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-[420px] bg-[#0c0d0f] border-l-2 border-[#7be1ea] p-10 relative z-10 flex flex-col mt-2">
        <h2 className="text-xl font-bold text-white mb-2 font-sans tracking-wide">
          PASSWORD RECOVERY
        </h2>
        <p className="text-[#64748b] text-[0.7rem] normal-case tracking-normal mb-8 font-sans">
          Enter your identifier to receive an orbital reset link.
        </p>

        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-6 flex flex-col">
            <label className="text-[0.65rem] text-[#3a8a92] tracking-[0.2em] mb-3 font-bold">
              IDENTIFIER [MAIL]
            </label>
            <div className="relative flex items-center bg-[#151515] border border-white/10 p-4 focus-within:border-[#7be1ea] transition-colors">
              <Mail className="w-4 h-4 text-[#5a6a75] mr-4 flex-shrink-0" />
              <input 
                type="text" 
                placeholder="OPERATOR@ASTRO.CMD" 
                className="bg-transparent w-full text-white placeholder-[#3a4a55] outline-none text-xs tracking-widest" 
              />
            </div>
          </div>

          <button className="w-full bg-[#7be1ea] text-black font-extrabold tracking-[0.2em] text-[0.8rem] py-4 px-6 flex items-center justify-between hover:bg-[#3a8a92] transition-colors mt-2 group">
            <span>SEND RECOVERY LINK</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 flex justify-center">
          <Link href="/auth/login" className="flex items-center gap-2 text-[#5a6a75] hover:text-white transition-colors text-[0.65rem] tracking-[0.2em]">
            <ChevronLeft className="w-3 h-3" />
            RETURN TO LOGIN
          </Link>
        </div>
      </div>

      {/* Info Blocks Below Form */}
      <div className="w-full max-w-[420px] flex gap-4 mt-6 relative z-10">
        <div className="flex-1 bg-black p-5 border border-white/5">
          <div className="text-[#4a5a65] text-[0.55rem] tracking-widest mb-1.5 font-bold">NODE SECURITY</div>
          <div className="text-[#a3e635] text-[0.65rem] tracking-widest font-bold">AES-256 ENCRYPTED</div>
        </div>
        <div className="flex-1 bg-black p-5 border border-white/5">
          <div className="text-[#4a5a65] text-[0.55rem] tracking-widest mb-1.5 font-bold">SYSTEM STATUS</div>
          <div className="flex items-center text-[#7be1ea] text-[0.65rem] tracking-widest font-bold">
            <div className="w-1.5 h-1.5 bg-[#7be1ea] mr-2" />
            ACTIVE UPLINK
          </div>
        </div>
      </div>

      {/* Global Fixed Footer */}
      <div className="absolute bottom-6 w-full px-12 flex justify-between items-end text-[0.55rem] text-[#4a5a65] tracking-[0.2em] z-0 pointer-events-none leading-relaxed">
         <div className="flex flex-col gap-1">
            <span>LOC: 51.5074° N, 0.1278° W</span>
            <span>REF: CMD-RECOVERY-0092</span>
         </div>
         <div className="flex flex-col gap-1 items-end">
            <span>VER: 2.0.4 STABLE</span>
            <span>© 2024 ASTRO COMMAND SYSTEMS</span>
         </div>
      </div>
    </main>
  );
}
