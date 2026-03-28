"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Settings, User, Satellite, FolderClosed, TerminalSquare, X } from "lucide-react";

// --- TYPES ---
export interface AssetType {
  id: string;
  type: string;
  status: "ACTIVE" | "WARNING" | "MAINTENANCE" | string;
  lastTelemetry: string;
}

export interface RegistryData {
  totalAssets: number;
  nominalAssets: number;
  atRiskAssets: number;
  assets: AssetType[];
  selectedDetails: {
    id: string;
    orbStatus: string;
    alt: string;
    vel: string;
    logs: { time: string; msg: string; type: string }[];
  } | null;
}

export default function AssetRegistryPage() {
  const [data, setData] = useState<RegistryData | null>(null);

  useEffect(() => {
    // --- BACKEND VERİ ÇEKME MANTIĞI BURAYA GELECEK --- //
    async function fetchRegistryData() {
      try {
        // const response = await fetch('/api/operator/registry');
        // const backendData: RegistryData = await response.json();
        // setData(backendData);

        // Tamamen Boş/Mocksuz Başlangıç (Backend'den Gelecek)
        setData({
          totalAssets: 0,
          nominalAssets: 0,
          atRiskAssets: 0,
          assets: [],
          selectedDetails: null // Herhangi bir asset seçili değil başlangıçta
        });
      } catch (error) {
        console.error("Failed to load registry data", error);
      }
    }

    fetchRegistryData();
  }, []);

  const getTypeStyle = (type: string) => {
    switch(type) {
      case "SATELLITE": return "border border-[#7be1ea]/50 text-[#7be1ea]";
      case "POWER GRID": return "border border-[#c084fc]/50 text-[#c084fc]";
      case "AIRCRAFT": return "border border-[#7be1ea]/50 text-[#7be1ea]";
      case "DATA CENTER": return "border border-white/20 text-[#94a3b8] bg-white/5";
      default: return "border border-[#7be1ea]/50 text-[#7be1ea]";
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case "ACTIVE": return "text-[#a3e635]";
      case "WARNING": return "text-[#c084fc]";
      case "MAINTENANCE": return "text-[#ef4444]";
      default: return "text-white";
    }
  };

  if (!data) return (
    <div className="min-h-screen bg-[#050607] text-[#7be1ea] font-mono flex flex-col items-center justify-center gap-4 text-sm tracking-[0.3em] font-bold">
      <div className="w-8 h-8 border-4 border-[#7be1ea] border-t-transparent rounded-full animate-spin" />
      FETCHING REGISTRY DATA...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050607] text-[#64748b] font-mono flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0a0b0d] z-50">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <Image src="/astrologo.gif" alt="Logo" width={32} height={32} className="mix-blend-screen" unoptimized />
            <span className="text-white font-bold text-xl tracking-[0.2em] font-sans">ORBITAL SENSE</span>
            <span className="text-[#3a8a92] text-[10px] tracking-[0.1em] ml-2 hidden sm:block">Beyond the atmosphere. Predicting the anomaly.</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[#475569]">
          <Bell size={18} className="hover:text-white cursor-pointer transition-colors" />
          <Settings size={18} className="hover:text-white cursor-pointer transition-colors" />
          <div className="w-8 h-8 bg-[#1e293b] rounded flex items-center justify-center border border-white/10 overflow-hidden cursor-pointer hover:bg-white/10 transition-colors">
            <User size={18} className="text-white/60" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* LEFT NAV SIDEBAR */}
        <aside className="w-[300px] bg-[#0c0d0f] border-r border-[#1e293b] flex flex-col py-8 shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-20">
           <div className="px-8 mb-8">
              <div className="text-[10px] text-[#475569] tracking-[0.2em] font-bold uppercase mb-2">FLEET COMMAND</div>
              <div className="text-[#7be1ea] font-bold font-sans text-lg tracking-wide">Active Orbits</div>
           </div>

           <div className="flex flex-col">
              <Link href="/dashboard/operator" className="px-8 py-5 flex items-center gap-5 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                 <Satellite size={18} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-xs group-hover:text-white transition-colors uppercase">FLEET OVERVIEW</span>
              </Link>
              <div className="bg-[#15171b] border-l-[3px] border-[#7be1ea] px-8 py-5 flex items-center gap-5 text-[#7be1ea] cursor-pointer group">
                 <FolderClosed size={18} />
                 <span className="font-bold tracking-[0.15em] text-xs uppercase">ASSET REGISTRY</span>
              </div>
              <div className="px-8 py-5 flex items-center gap-5 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                 <TerminalSquare size={18} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-xs group-hover:text-white transition-colors uppercase">SYSTEM LOGS</span>
              </div>
           </div>

           <div className="flex-1" />

           <div className="px-8 w-full pb-4">
              <Link href="/operator/assets/new" className="w-full bg-[#7be1ea] text-black font-extrabold text-[10px] tracking-[0.2em] py-4 rounded-sm hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(123,225,234,0.3)] transition-all flex items-center justify-center gap-2">
                 <span>+ ADD NEW ASSET</span>
              </Link>
           </div>
        </aside>

        {/* CENTER CONTENT */}
        <section className="flex-1 flex flex-col px-10 py-8 gap-8 overflow-y-auto bg-[#0a0a0a]">
           {/* Stats Header */}
           <div className="flex gap-1 h-32">
              <div className="flex-1 bg-[#0c0d0f] border-l-4 border-[#7be1ea] p-6 flex flex-col justify-between shadow-lg">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em]">TOTAL ASSETS</div>
                 <div className="flex justify-between items-end">
                    <span className="text-white text-4xl font-black font-sans">{data.totalAssets}</span>
                    <Satellite size={24} className="text-[#334155]" />
                 </div>
              </div>
              <div className="flex-1 bg-[#0c0d0f] border-l-4 border-[#a3e635] p-6 flex flex-col justify-between shadow-lg">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em]">NOMINAL</div>
                 <div className="flex justify-between items-end">
                    <span className="text-[#a3e635] text-4xl font-black font-sans">{data.nominalAssets}</span>
                    <div className="w-5 h-5 rounded-full bg-[#a3e635]/20 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-[#a3e635]" /></div>
                 </div>
              </div>
              <div className="flex-1 bg-[#0c0d0f] border-l-4 border-[#c084fc] p-6 flex flex-col justify-between shadow-lg">
                 <div className="text-[10px] uppercase font-bold tracking-[0.2em]">AT RISK</div>
                 <div className="flex justify-between items-end">
                    <span className="text-[#c084fc] text-4xl font-black font-sans">{data.atRiskAssets}</span>
                 </div>
              </div>
           </div>

           {/* Table Section */}
           <div>
              <h2 className="text-white font-bold text-3xl font-sans tracking-wide mb-1">Asset Registry</h2>
              <p className="text-[#64748b] text-sm mb-8">Real-time telemetry and orbital status across global infrastructure.</p>
              
              <div className="w-full">
                 {/* Header */}
                 <div className="grid grid-cols-4 border-b border-white/10 pb-4 mb-4 text-[10px] uppercase font-bold tracking-[0.2em] px-4">
                    <span>ASSET ID</span>
                    <span>TYPE</span>
                    <span>STATUS</span>
                    <span>LAST TELEMETRY</span>
                 </div>
                 
                 {/* Rows */}
                 <div className="flex flex-col gap-2">
                    {data.assets.length > 0 ? data.assets.map((asset, i) => (
                       <div key={i} className="grid grid-cols-4 items-center bg-[#0c0d0f] p-4 text-xs font-bold hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5 rounded-sm">
                          <span className="text-white">{asset.id}</span>
                          <div>
                             <span className={`px-2 py-1 text-[9px] tracking-widest uppercase ${getTypeStyle(asset.type)}`}>
                               {asset.type}
                             </span>
                          </div>
                          <div className={`flex items-center gap-2 ${getStatusStyle(asset.status)}`}>
                             <div className={`w-1.5 h-1.5 rounded-full ${asset.status === 'WARNING' ? 'bg-[#c084fc]' : asset.status === 'MAINTENANCE' ? 'bg-[#ef4444]' : 'bg-[#a3e635]'} shadow-sm`} />
                             <span className="text-[10px] tracking-widest">{asset.status}</span>
                          </div>
                          <span className="text-[#475569] text-[10px] tracking-widest">{asset.lastTelemetry}</span>
                       </div>
                    )) : (
                       <div className="text-center p-8 text-[#475569] text-[10px] font-bold tracking-[0.3em] bg-[#0c0d0f]">NO ASSETS FOUND IN DIRECTORY</div>
                    )}
                 </div>
              </div>
           </div>
        </section>

        {/* RIGHT DETAILS PANEL (If active) */}
        {data.selectedDetails && (
           <aside className="w-[450px] bg-[#0c0d0f] border-l border-white/5 p-8 flex flex-col gap-8 shrink-0 relative shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20">
              <button className="absolute top-6 right-6 text-[#64748b] hover:text-white transition-colors" onClick={() => setData({...data, selectedDetails: null})}>
                 <X size={20} />
              </button>

              <div>
                 <h2 className="text-white font-bold text-2xl font-sans tracking-wide mb-2">{data.selectedDetails.id}</h2>
                 <div className="text-[10px] tracking-[0.2em] font-bold uppercase">
                    ORBITAL STATUS: <span className="text-[#a3e635]">{data.selectedDetails.orbStatus}</span>
                 </div>
              </div>

              {/* Radar Map */}
              <div className="w-full aspect-square border-none bg-black relative flex items-center justify-center overflow-hidden rounded-sm shadow-[inset_0_0_50px_rgba(123,225,234,0.05)]">
                 {/* Grid Pattern */}
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#7be1ea 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                 {/* Radar Rings */}
                 <div className="w-[80%] h-[80%] rounded-full border border-[#7be1ea]/20 absolute" />
                 <div className="w-[50%] h-[50%] rounded-full border border-[#7be1ea]/20 absolute" />
                 <div className="w-[20%] h-[20%] rounded-full border border-[#7be1ea]/20 absolute" />
                 
                 {/* Target Blip */}
                 <div className="absolute top-[30%] left-[40%] flex gap-2 items-start">
                    <div className="w-2 h-2 bg-[#a3e635] rounded-sm shadow-[0_0_10px_#a3e635]" />
                    <div className="border border-white/20 bg-black/80 backdrop-blur-sm p-2 text-[8px] uppercase tracking-widest font-mono text-white/80">
                       <div>ALT: {data.selectedDetails.alt}</div>
                       <div>VEL: {data.selectedDetails.vel}</div>
                    </div>
                 </div>
              </div>

              {/* LIVE TELEMETRY LOG */}
              <div className="flex-1 flex flex-col gap-3 min-h-[0]">
                 <div className="text-[10px] tracking-[0.2em] text-[#64748b] font-bold uppercase">LIVE TELEMETRY LOG</div>
                 <div className="flex-1 bg-[#050505] p-5 overflow-y-auto border border-white/5 flex flex-col gap-2 rounded-sm scrollbar-hide">
                    {data.selectedDetails.logs.map((log, i) => (
                       <div key={i} className="flex gap-3 text-[9px] font-mono leading-relaxed">
                          <span className={log.type === 'warning' ? 'text-[#c084fc]' : log.type === 'system' ? 'text-[#475569]' : 'text-[#a3e635]'}>
                             [{log.time}]
                          </span>
                          <span className={log.type === 'system' ? 'text-[#475569]' : 'text-white/80'}>{log.msg}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                 <button className="flex-1 border border-white/10 bg-white/5 py-4 text-[9px] font-bold tracking-[0.2em] text-white/50 hover:bg-white/10 hover:text-white transition-colors rounded-sm uppercase">REQUEST DIAGNOSTIC</button>
                 <button className="flex-1 border border-[#1e40af]/30 bg-[#1e40af]/10 py-4 text-[9px] font-bold tracking-[0.2em] text-[#7be1ea] hover:bg-[#1e40af]/20 transition-colors rounded-sm uppercase">EMERGENCY DE-ORBIT</button>
              </div>
           </aside>
        )}
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
}
