"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, Settings, User, ChevronDown, Satellite, FolderClosed, TerminalSquare, HelpCircle, FileText, Waves } from "lucide-react";

// --- TİPLER (TYPES) ---
export interface ActionLog {
  time: string;
  type: "normal" | "critical" | "success" | string;
  msg: string;
}

export interface TelemetryData {
  latency: number;
  integrity: number;
  bandwidth: number;
}

export interface TargetInfo {
  name: string;
  lat: string;
  lon: string;
  alt: string;
  cmeAlert: string;
}

export interface FleetCondition {
  globalHealth: number;
  nominalAssets: number;
  atRiskAssets: number;
  maintenanceAssets: number;
}

export interface OperatorData {
  activeSession: string;
  target: TargetInfo;
  actionLogs: ActionLog[];
  telemetry: TelemetryData;
  radiationScore: number[];
  fleetCondition: FleetCondition;
}

export default function OperatorDashboard() {
  const [data, setData] = useState<OperatorData | null>(null);

  useEffect(() => {
    // --- BACKEND VERİ ÇEKME MANTIĞI BURAYA GELECEK --- //
    async function fetchOperatorData() {
      try {
        // Örnek API Çağrısı:
        // const response = await fetch('/api/operator/data');
        // const backendData: OperatorData = await response.json();
        // setData(backendData);

        // Şimdilik UI'ın patlamaması için tamamen boş (mock olmayan) referans değerler atıyoruz.
        setData({
          activeSession: "00:00:00",
          target: {
            name: "AWAITING TARGET...",
            lat: "--.-- N",
            lon: "--.-- E",
            alt: "--,--- KM",
            cmeAlert: "UNKNOWN"
          },
          actionLogs: [], // Backend log array expects here
          telemetry: {
            latency: 0,
            integrity: 0,
            bandwidth: 0
          },
          radiationScore: Array(10).fill(0), // Initial empty score chart (10 bars)
          fleetCondition: {
            globalHealth: 0,
            nominalAssets: 0,
            atRiskAssets: 0,
            maintenanceAssets: 0
          }
        });
      } catch (error) {
        console.error("Failed to load operator data from backend", error);
      }
    }

    fetchOperatorData();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#030405] text-[#7be1ea] font-mono flex flex-col items-center justify-center gap-4 text-sm tracking-[0.3em] font-bold">
        <div className="w-8 h-8 border-4 border-[#7be1ea] border-t-transparent rounded-full animate-spin" />
        INITIALIZING OPERATOR TERMINAL...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050607] text-[#64748b] font-mono text-xs uppercase tracking-widest flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-[#0a0b0d] z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Image 
              src="/astrologo.gif" 
              alt="Logo" 
              width={40} 
              height={40} 
              className="mix-blend-screen"
              unoptimized
            />
            <div className="flex flex-col justify-center translate-y-1">
               <span className="text-white font-bold text-2xl tracking-[0.3em] font-sans leading-none">ORBITAL SENSE</span>
               <span className="text-[#3a8a92] text-[8px] tracking-[0.2em] font-bold mt-1">BEYOND THE ATMOSPHERE. PREDICTING THE ANOMALY.</span>
            </div>
          </div>
          <nav className="flex items-center gap-10 ml-16 text-sm h-full">
            <button className="text-[#7be1ea] border-b-2 border-[#7be1ea] h-20 px-2 font-bold tracking-[0.2em]">DASHBOARD</button>
          </nav>
        </div>
        <div className="flex items-center gap-8 text-[#475569]">
          <Bell size={22} className="hover:text-white cursor-pointer transition-colors" />
          <Settings size={22} className="hover:text-white cursor-pointer transition-colors" />
          <div className="w-9 h-9 bg-[#1e293b] rounded flex items-center justify-center border border-white/10 overflow-hidden cursor-pointer hover:bg-white/10 transition-colors">
            <User size={20} className="text-white/60" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT NAV SIDEBAR */}
        <aside className="w-[320px] bg-[#0c0d0f] border-r border-[#1e293b] flex flex-col py-8 shrink-0 relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
           <div className="px-8 mb-8">
              {/* Droplist Button */}
              <button className="w-full bg-[#15171b] border border-white/5 p-4 flex justify-between items-center hover:bg-[#1a1c22] transition-colors rounded-sm">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-[#a3e635] rounded-full shadow-[0_0_8px_#a3e635]" />
                    <span className="text-white font-bold text-sm tracking-[0.2em]">SENTINEL-A1</span>
                 </div>
                 <ChevronDown size={16} className="text-[#64748b]" />
              </button>
              <div className="text-[10px] text-[#64748b] tracking-widest mt-3 opacity-60">
                 Active Session: {data.activeSession}
              </div>
           </div>

           {/* Menu Items */}
           <div className="flex flex-col">
              <div className="bg-[#15171b] border-l-[3px] border-[#a3e635] px-8 py-5 flex items-center gap-5 text-[#a3e635] cursor-pointer group">
                 <Satellite size={20} className="group-hover:scale-110 transition-transform" />
                 <span className="font-bold tracking-[0.15em] text-sm">FLEET OVERVIEW</span>
              </div>
              <div className="px-8 py-5 flex items-center gap-5 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                 <FolderClosed size={20} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-sm group-hover:text-white transition-colors">ASSET REGISTRY</span>
              </div>
              <div className="px-8 py-5 flex items-center gap-5 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                 <TerminalSquare size={20} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-sm group-hover:text-white transition-colors">SYSTEM LOGS</span>
              </div>
           </div>

           {/* Spacer */}
           <div className="flex-1" />

           {/* Bottom Links */}
           <div className="px-8 flex flex-col gap-6 w-full">
              <button className="w-full bg-[#7be1ea] text-black font-extrabold text-xs tracking-[0.2em] py-4 rounded-sm hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(123,225,234,0.3)] transition-all">
                 REGISTER NEW ASSET
              </button>
              
              <div className="flex gap-3 items-center text-[#64748b] hover:text-white cursor-pointer transition-colors">
                 <HelpCircle size={14} className="opacity-70" />
                 <span className="text-[11px] tracking-widest font-bold">SUPPORT</span>
              </div>
              <div className="flex gap-3 items-center text-[#64748b] hover:text-white cursor-pointer transition-colors pb-4">
                 <FileText size={14} className="opacity-70" />
                 <span className="text-[11px] tracking-widest font-bold">DOCUMENTATION</span>
              </div>
           </div>
        </aside>

        {/* CENTER CONTENT */}
        <section className="flex-1 flex flex-col px-6 py-6 gap-6 relative z-10 overflow-hidden">
           {/* Top Map Display */}
           <div className="flex-1 bg-black border border-[#1e293b] rounded-sm relative overflow-hidden flex items-center justify-center shadow-lg group">
              {/* Globe Background Glow */}
              <div className="absolute w-[800px] h-[800px] rounded-full bg-[#1e40af]/10 blur-[150px] pointer-events-none" />
              
              <div className="relative w-[700px] h-[700px] rounded-full overflow-hidden scale-110 flex items-center justify-center">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=1400')] bg-cover bg-center brightness-[0.7] contrast-[1.4] saturate-150" />
                 {/* Atmosphere glow */}
                 <div className="absolute inset-0 rounded-full shadow-[inset_0_0_150px_rgba(59,130,246,0.6)] mix-blend-screen mix-blend-screen pointer-events-none border border-blue-500/20" />
                 
                 {/* Centered Red Rings Overlay Target */}
                 <div className="absolute w-[350px] h-[350px] rounded-full border border-[#ef4444]/40 flex items-center justify-center shadow-[inset_0_0_50px_rgba(239,68,68,0.1)] transition-transform duration-1000 group-hover:scale-105">
                     <div className="absolute w-[250px] h-[250px] rounded-full border border-[#ef4444]/60 flex items-center justify-center">
                        <div className="text-[#ef4444] text-[10px] tracking-[0.3em] font-bold absolute top-10 select-none drop-shadow-[0_0_5px_#ef4444]">
                           INTERCEPT SECTOR
                        </div>
                        <div className="w-1.5 h-1.5 bg-[#ef4444] rounded-full shadow-[0_0_10px_#ef4444]" />
                     </div>
                 </div>
              </div>

              {/* TARGET IDENTIFICATION BLOCK */}
              <div className="absolute top-8 left-8 border-l-[3px] border-[#7be1ea] bg-black/60 backdrop-blur-md p-6 min-w-[320px] shadow-[0_0_30px_rgba(123,225,234,0.15)] border-y border-r border-[#1e293b] rounded-r-sm">
                 <div className="text-[#7be1ea] font-bold text-[10px] tracking-[0.3em] mb-3">TARGET IDENTIFICATION</div>
                 <div className="text-white text-2xl font-sans tracking-widest font-black mb-5 truncate">{data.target.name}</div>
                 <div className="text-[#64748b] text-[10px] tracking-[0.15em] flex gap-4 uppercase font-bold">
                    <span>LAT: <span className="text-white/80">{data.target.lat}</span></span>
                    <span>LON: <span className="text-white/80">{data.target.lon}</span></span>
                 </div>
                 <div className="text-[#64748b] text-[10px] tracking-[0.15em] uppercase font-bold mt-2">
                    <span>ALT: <span className="text-white/80">{data.target.alt}</span></span>
                 </div>
              </div>

              {/* CME ALERT BOX */}
              <div className="absolute top-8 right-8 border border-[#ef4444] bg-[#ef4444]/10 backdrop-blur-md px-4 py-2 flex items-center gap-3 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)] shadow-[inset_0_0_10px_rgba(239,68,68,0.2)] rounded-sm">
                 <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse shadow-[0_0_8px_#ef4444]" />
                 <span className="text-[#ef4444] text-[10px] tracking-[0.2em] font-bold pt-0.5">CME ALERT: {data.target.cmeAlert}</span>
              </div>
           </div>

           {/* Bottom Row */}
           <div className="h-[280px] flex gap-6 shrink-0">
              
              {/* ACTION ALERTS LOG */}
              <div className="flex-1 bg-[#0a0a0a] border border-[#1e293b] p-6 rounded-sm flex flex-col shadow-lg">
                 <div className="flex items-center gap-3 mb-6">
                    <TerminalSquare size={16} className="text-[#ef4444]" />
                    <span className="text-white text-xs font-bold tracking-[0.2em]">ACTION ALERTS LOG</span>
                 </div>
                 <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pr-2">
                    {data.actionLogs.length > 0 ? data.actionLogs.map((log, i) => {
                       const isCritical = log.type === "critical";
                       const isSuccess = log.type === "success";
                       return (
                          <div key={i} className={`flex gap-3 text-[11px] font-mono leading-relaxed p-3 rounded-sm ${isCritical ? 'bg-[#ef4444]/10 border-l-[3px] border-[#ef4444]' : isSuccess ? 'text-[#a3e635]' : 'text-[#94a3b8]'}`}>
                             <span className={isCritical ? "text-[#ef4444] font-bold" : isSuccess ? "text-[#a3e635]" : "text-[#a3e635]"}>[{log.time}]</span>
                             <span className={`tracking-wider ${isCritical ? "text-white" : ""}`}>
                               {log.msg}
                             </span>
                          </div>
                       )
                    }) : (
                        <div className="h-full flex items-center justify-center opacity-30 text-[11px] tracking-[0.3em]">
                           AWAITING SYSTEM LOGS...
                        </div>
                    )}
                 </div>
              </div>

              {/* REAL-TIME TELEMETRY HEALTH */}
              <div className="flex-1 bg-[#0a0a0a] border border-[#1e293b] p-8 rounded-sm flex flex-col shadow-lg">
                 <span className="text-white text-xs font-bold tracking-[0.2em] mb-8">REAL-TIME TELEMETRY HEALTH</span>
                 <div className="flex flex-col justify-between flex-1">
                    
                    <div className="space-y-4">
                       <div className="flex justify-between items-end text-[10px] uppercase font-bold">
                          <span className="text-[#64748b] tracking-widest">NETWORK LATENCY (PING)</span>
                          <span className="text-[#7be1ea] tracking-[0.1em] text-sm">{data.telemetry.latency}ms</span>
                       </div>
                       <div className="w-full h-1.5 bg-[#1e293b]">
                          <div className="h-full bg-[#7be1ea] shadow-[0_0_8px_#7be1ea] transition-all duration-700" style={{ width: `${Math.max(5, 100 - (data.telemetry.latency / 200 * 100))}%` }} />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-end text-[10px] uppercase font-bold">
                          <span className="text-[#64748b] tracking-widest">PACKET INTEGRITY</span>
                          <span className="text-[#a3e635] tracking-[0.1em] text-sm">{data.telemetry.integrity.toFixed(3)}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-[#1e293b]">
                          <div className="h-full bg-[#a3e635] shadow-[0_0_8px_#a3e635] transition-all duration-700" style={{ width: `${data.telemetry.integrity}%` }} />
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-end text-[10px] uppercase font-bold">
                          <span className="text-[#64748b] tracking-widest">BANDWIDTH SATURATION</span>
                          <span className="text-[#c084fc] tracking-[0.1em] text-sm">{data.telemetry.bandwidth.toFixed(1)} Gbps</span>
                       </div>
                       <div className="w-full h-1.5 bg-[#1e293b]">
                          <div className="h-full bg-[#c084fc] shadow-[0_0_8px_#c084fc] transition-all duration-700" style={{ width: `${Math.min(100, (data.telemetry.bandwidth / 100) * 100)}%` }} />
                       </div>
                    </div>

                 </div>
              </div>

           </div>
        </section>

        {/* RIGHT METRICS SIDEBAR */}
        <aside className="w-[420px] flex flex-col py-6 pr-6 gap-6 shrink-0 relative z-20">
           
           {/* RADIATION SCORE CHART */}
           <div className="h-[320px] bg-[#0c0d0f] border border-[#1e293b] rounded-sm p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col">
              <div className="flex justify-between items-center mb-10">
                 <span className="text-white text-xs font-bold tracking-[0.2em]">RADIATION SCORE (RSV/N)</span>
                 <Waves size={20} className="text-[#7be1ea]" />
              </div>

              <div className="flex-1 flex items-end gap-3 px-2 border-b border-white/10 pb-2 relative">
                 {/* Chart guide */}
                 <div className="absolute top-[40%] left-0 w-full h-px border-t border-dashed border-white/20 pointer-events-none" />
                 
                 {/* Bar mapping. For mockup template, iterating exactly 10 arrays if mapped data is present */}
                 {data.radiationScore.map((h, i) => {
                    // Create visual color distribution. Red is high right.
                    const isHigh = i > 5 && i < 9;
                    const isMid = i > 3 && i <= 5;
                    const bgCol = isHigh ? 'bg-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.4)]' : isMid ? 'bg-[#7be1ea]' : 'bg-[#1e293b]';
                    return (
                       <div key={i} className={`flex-1 transition-all duration-700 rounded-t-[2px] ${bgCol}`} style={{ height: `${Math.max(10, h)}%` }} />
                    )
                 })}
              </div>
              <div className="flex justify-between text-[10px] text-[#475569] font-bold mt-4 tracking-widest">
                 <span>12:00</span>
                 <span>14:00</span>
                 <span>16:00</span>
                 <span className="text-[#ef4444]">NOW</span>
              </div>
           </div>

           {/* FLEET CONDITION ALPHA */}
           <div className="flex-1 bg-[#0c0d0f] border border-[#1e293b] rounded-sm p-8 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <h3 className="text-white text-xs font-bold tracking-[0.2em] mb-12 uppercase">FLEET CONDITION ALPHA</h3>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                 {/* Mega Circular Chart Dial */}
                 <div className="relative w-56 h-56 flex items-center justify-center">
                   <svg className="absolute w-full h-full transform -rotate-90">
                     <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-[#1a1c22]" />
                     {/* 2 * Math.PI * 100 = 628 */}
                     <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" strokeDasharray={628} strokeDashoffset={628 * (1 - (data.fleetCondition.globalHealth / 100))} className="text-[#a3e635] stroke-[20] drop-shadow-[0_0_15px_rgba(163,230,53,0.4)] transition-all duration-1000" strokeLinecap="round" />
                   </svg>
                   <div className="absolute flex flex-col items-center justify-center h-full pt-4">
                      <div className="flex flex-col items-center">
                         <div className="flex items-baseline gap-1 relative left-2">
                           <span className="text-6xl font-black font-sans text-white tracking-widest">{data.fleetCondition.globalHealth}</span>
                           <span className="text-2xl font-bold font-sans text-white">%</span>
                         </div>
                         <span className="text-[10px] mt-2 text-[#64748b] tracking-[0.4em] font-bold">GLOBAL HEALTH</span>
                      </div>
                   </div>
                 </div>
              </div>

              {/* Status breakdown rows */}
              <div className="mt-12 flex flex-col gap-6 w-full px-2">
                 <div className="flex items-center justify-between border-l-4 border-[#a3e635] bg-[#1a1c22]/50 pl-4 py-3">
                    <span className="text-[#94a3b8] text-[11px] font-bold tracking-[0.2em]">NOMINAL ASSETS</span>
                    <span className="text-white text-lg font-bold font-sans pr-4">{data.fleetCondition.nominalAssets}</span>
                 </div>
                 <div className="flex items-center justify-between border-l-4 border-[#ef4444] bg-[#1a1c22]/50 pl-4 py-3">
                    <span className="text-[#94a3b8] text-[11px] font-bold tracking-[0.2em]">AT RISK (ERR)</span>
                    <span className="text-white text-lg font-bold font-sans pr-4">{data.fleetCondition.atRiskAssets}</span>
                 </div>
                 <div className="flex items-center justify-between border-l-4 border-[#c084fc] bg-[#1a1c22]/50 pl-4 py-3">
                    <span className="text-[#94a3b8] text-[11px] font-bold tracking-[0.2em]">MAINTENANCE</span>
                    <span className="text-white text-lg font-bold font-sans pr-4">{data.fleetCondition.maintenanceAssets}</span>
                 </div>
              </div>

           </div>
           
           {/* Tiny Footer Crypto Status right under the right panel (mimicking the image footer flow) */}
           <div className="text-[9px] text-[#475569] opacity-50 tracking-[0.3em] font-bold w-full text-right mt-2 flex justify-end gap-6 uppercase overflow-hidden whitespace-nowrap">
             <span>REAL-TIME SECURE ENCRYPTED VIA TELEMETRY NODE AEL/B 4.0.1-P00</span>
             <span>ENCRYPTION: AES-256-GCM</span>
           </div>

        </aside>

      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        /* Overriding text colors from layout for this specific dashboard view */
        ::selection {
          background-color: rgba(123, 225, 234, 0.3);
        }
      `}</style>
    </div>
  );
}
