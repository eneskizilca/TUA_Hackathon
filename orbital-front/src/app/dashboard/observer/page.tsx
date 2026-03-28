"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, Settings, User, Shield, Radio, Activity, Globe } from "lucide-react";

// --- TİPLER (TYPES) ---
export interface AlertData {
  time: string;
  type: string;
  color: string;
  msg: string;
}

export interface MapData {
  lat: string;
  lon: string;
  alt: string;
  symmetry: number;
  fluxDensity: number;
  trackingTarget: string;
}

export interface AssetData {
  id: string;
  status: string;
  iconType: "shield" | "globe" | "activity" | "radio" | string;
  color: string;
  img: string;
}

export interface MetricData {
  kpTrend: number[];
  solarWindSpeed: number;
  solarWindMagneticDir: number;
  radioBlackoutProb: number;
  auroraVisibility: number;
}

export interface DashboardData {
  alerts: AlertData[];
  mapInfo: MapData;
  assets: AssetData[];
  metrics: MetricData;
  news: string[];
  uptime: string;
}

export default function ObserverDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // --- BACKEND VERİ ÇEKME MANTIĞI BURAYA GELECEK --- //
    async function fetchDashboardData() {
      try {
        // Örnek API Çağrısı:
        // const response = await fetch('/api/observer/data');
        // const backendData: DashboardData = await response.json();
        // setData(backendData);

        // Şimdilik UI'ın patlamaması için tamamen boş (mock olmayan) referans değerler atıyoruz.
        // Backend bağlandığında yukardaki kodlar aktif edilip alttaki setData silinecek.
        setData({
          alerts: [], // Gelen veriler burada listelenecek
          mapInfo: {
            lat: "0.0000 N",
            lon: "0.0000 W",
            alt: "0.0 KM",
            symmetry: 0.0,
            fluxDensity: 0.0,
            trackingTarget: "AWAITING_UPLINK"
          },
          assets: [], // Gelecek Asset objeleri...
          metrics: {
            kpTrend: Array(13).fill(0), // Başlangıç grafiği için içi 0 dolu 13 elemanlık boş dizi
            solarWindSpeed: 0.0,
            solarWindMagneticDir: 0.0,
            radioBlackoutProb: 0,
            auroraVisibility: 0,
          },
          news: ["Awaiting telemetry feed..."], // Marquee boş kalmasın diye
          uptime: "0.000%"
        });
      } catch (error) {
        console.error("Failed to load dashboard data from backend", error);
      }
    }

    fetchDashboardData();
  }, []);

  const getDynamicIcon = (type: string, size = 18) => {
    switch (type.toLowerCase()) {
      case "shield": return <Shield size={size} />;
      case "globe": return <Globe size={size} />;
      case "activity": return <Activity size={size} />;
      case "radio": return <Radio size={size} />;
      default: return <Activity size={size} />;
    }
  };

  // Veri yüklenene kadar Loading ekranı
  if (!data) {
    return (
      <div className="min-h-screen bg-[#030405] text-[#7be1ea] font-mono flex flex-col items-center justify-center gap-4 text-sm tracking-[0.3em] font-bold">
        <div className="w-8 h-8 border-4 border-[#7be1ea] border-t-transparent rounded-full animate-spin" />
        ESTABLISHING SECURE UPLINK...
      </div>
    );
  }

  // --- VERİ EŞLEŞTİRMELİ ANA UI MİMARİSİ --- //
  return (
    <div className="min-h-screen bg-[#030405] text-[#64748b] font-mono text-xs uppercase tracking-widest flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-[#050607]/80 backdrop-blur-md z-50">
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
            <span className="text-white font-bold text-2xl tracking-[0.3em] font-sans">ORBITAL SENSE</span>
          </div>
          <nav className="flex items-center gap-10 ml-12 text-sm">
            <button className="text-[#7be1ea] border-b-2 border-[#7be1ea] h-20 px-2 font-bold tracking-[0.2em]">DASHBOARD</button>
            <button className="text-[#475569] hover:text-white transition-colors tracking-[0.2em]">AURORA VIEW</button>
          </nav>
        </div>
        <div className="flex items-center gap-8 text-[#475569]">
          <Bell size={24} className="hover:text-white cursor-pointer transition-colors" />
          <Settings size={24} className="hover:text-white cursor-pointer transition-colors" />
          <div className="w-10 h-10 bg-[#1e293b] rounded flex items-center justify-center border border-white/10 overflow-hidden cursor-pointer hover:bg-white/10 transition-colors">
            <User size={24} className="text-white/60" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* LEFT PANEL - ALERT FEED */}
        <aside className="w-[420px] flex flex-col border border-white/5 bg-[#050607]/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 shrink-0">
          <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#a3e635] animate-pulse shadow-[0_0_10px_#a3e635]" />
                <span className="text-[#a3e635] font-bold text-sm tracking-[0.2em]">LIVE ALERT FEED</span>
             </div>
             <span className="text-[10px] opacity-60 font-bold">LVL: DELTA-9</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
             {data.alerts.length > 0 ? (
               data.alerts.map((alert, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex gap-3 text-[11px] tracking-[0.1em]">
                        <span className="text-white/30 truncate">[{alert.time}]</span>
                        <span className={`${alert.color} font-bold`}>{alert.type}</span>
                     </div>
                     <p className="normal-case text-[13px] leading-relaxed pr-6 text-white/70 tracking-wide font-sans">
                       {alert.msg}
                     </p>
                  </div>
               ))
             ) : (
               <div className="h-full flex items-center justify-center opacity-30 text-[10px] tracking-[0.3em]">
                 NO RECENT ALERTS DETECTED
               </div>
             )}
          </div>
        </aside>

        {/* CENTER PANEL - GLOBE & ASSETS */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          <div className="flex-1 relative border border-white/5 bg-[#050607]/30 flex items-center justify-center overflow-hidden">
            {/* Globe Background Glow */}
            <div className="absolute w-[800px] h-[800px] rounded-full bg-[#7be1ea]/5 blur-[120px]" />
            
            {/* Earth Center View */}
            <div className="relative w-[700px] h-[700px] rounded-full border border-white/10 shadow-[inner_0_0_150px_rgba(123,225,234,0.15)] overflow-hidden scale-110">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=1400')] bg-cover bg-center brightness-[0.6] contrast-[1.3] grayscale-[0.3]" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
               <div className="absolute top-0 left-0 w-full h-full border-[30px] border-black/40 blur-md rounded-full pointer-events-none" />
               <div className="absolute inset-0 bg-gradient-to-b from-[#7be1ea]/20 via-transparent to-transparent opacity-70 mix-blend-screen animate-pulse" />
            </div>

            {/* HEATMAP INFO OVERLAY */}
            <div className="absolute top-10 left-10 p-6 border-l-4 border-[#7be1ea] bg-black/50 backdrop-blur-md shadow-[0_0_30px_rgba(123,225,234,0.1)]">
               <h2 className="text-white font-bold text-lg tracking-[0.3em] mb-4">POLAR AURORA HEATMAP</h2>
               <div className="space-y-2 opacity-80 text-xs tracking-widest">
                  <div className="flex justify-between gap-8"><span>LAT:</span> <span className="text-[#7be1ea]">{data.mapInfo.lat}</span></div>
                  <div className="flex justify-between gap-8"><span>LON:</span> <span className="text-[#7be1ea]">{data.mapInfo.lon}</span></div>
                  <div className="flex justify-between gap-8"><span>ALT:</span> <span className="text-[#7be1ea]">{data.mapInfo.alt}</span></div>
               </div>
            </div>

            {/* METRICS BOTTOM LEFT OVERLAY */}
            <div className="absolute bottom-10 left-10 flex gap-6">
               <div className="border-l-[3px] border-[#a3e635] bg-black/50 backdrop-blur-md p-6 min-w-[140px] shadow-[0_0_20px_rgba(163,230,53,0.1)]">
                  <div className="text-[10px] opacity-50 mb-2 font-bold tracking-widest">SYMMETRY</div>
                  <div className="text-[#a3e635] text-3xl font-bold font-sans">{data.mapInfo.symmetry.toFixed(2)}</div>
               </div>
               <div className="border-l-[3px] border-[#7be1ea] bg-black/50 backdrop-blur-md p-6 min-w-[180px] shadow-[0_0_20px_rgba(123,225,234,0.1)]">
                  <div className="text-[10px] opacity-50 mb-2 font-bold tracking-widest">FLUX DENSITY</div>
                  <div className="text-[#7be1ea] text-3xl font-bold font-sans">{data.mapInfo.fluxDensity.toFixed(1)} GW</div>
               </div>
            </div>

            {/* TRACKING STATUS */}
            <div className="absolute bottom-10 right-10 bg-black/50 backdrop-blur-md border border-white/10 px-6 py-3 flex items-center gap-3 shadow-lg">
               <div className="w-2 h-2 rounded-full bg-[#a3e635] shadow-[0_0_12px_#a3e635]" />
               <span className="text-[11px] font-bold tracking-[0.2em] text-[#64748b]">TRACKING: <span className="text-white">{data.mapInfo.trackingTarget}</span></span>
            </div>
          </div>

          {/* ASSETS GRID */}
          <div className="h-[240px] flex gap-2 flex-shrink-0">
             {data.assets.length > 0 ? data.assets.map((asset, i) => (
                <div key={i} className="flex-1 border border-white/5 bg-[#050607]/80 p-5 flex flex-col relative group cursor-pointer hover:border-[#7be1ea]/50 transition-colors shadow-lg">
                   <div className="flex justify-between items-start mb-4 relative z-10">
                      <span className="text-[#eab308]/90 text-[11px] font-bold group-hover:text-[#7be1ea] transition-colors tracking-[0.2em]">{asset.id}</span>
                      <div className={asset.color}>{getDynamicIcon(asset.iconType)}</div>
                   </div>
                   <div className="flex-1 overflow-hidden relative border border-white/5 bg-black rounded-sm">
                      <img src={asset.img} alt={asset.id} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 contrast-125 saturate-[1.2]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                   </div>
                   <div className="mt-4 text-[10px] opacity-60 tracking-[0.2em] font-bold">STATUS: <span className="text-white group-hover:text-[#7be1ea] transition-colors">{asset.status}</span></div>
                </div>
             )) : (
                <div className="w-full h-full border border-white/5 bg-[#050607]/80 p-5 flex items-center justify-center opacity-30 text-[11px] tracking-[0.3em]">
                   NO ACTIVE ASSETS LINKED
                </div>
             )}
          </div>
        </div>

        {/* RIGHT PANEL - ANALYTICS */}
        <aside className="w-[420px] border border-white/5 bg-[#050607]/50 flex flex-col gap-2 shrink-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10">
          <div className="p-8 border-b border-white/5 space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-white font-bold text-sm tracking-[0.2em]">NOAA KP-INDEX TREND</h3>
                <span className="text-[#ef4444] text-[10px] font-bold tracking-widest">THRESHOLD REACHED</span>
             </div>
             <div className="h-40 flex items-end gap-1.5 px-2 relative">
                <div className="absolute top-1/4 left-0 w-full h-px border-t border-dashed border-[#ef4444]/40 pointer-events-none" />
                {data.metrics.kpTrend.map((h, i) => (
                   <div key={i} 
                     className={`flex-1 transition-all duration-500 ${h > 70 ? 'bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-[#1e293b]'}`} 
                     style={{ height: `${h}%` }} 
                   />
                ))}
             </div>
             <div className="flex justify-between text-[10px] opacity-40 font-bold tracking-widest">
                <span>-24H</span>
                <span>-12H</span>
                <span>NOW</span>
             </div>
          </div>

          <div className="flex-1 p-8 flex flex-col justify-between">
             <div className="space-y-8">
                <h3 className="text-white font-bold text-sm uppercase tracking-[0.2em]">SOLAR WIND & IMF</h3>
                <div className="space-y-4">
                   <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-[#64748b] tracking-widest">SPEED (Hiz)</span>
                      <span className="text-[#7be1ea] text-sm tracking-widest">{data.metrics.solarWindSpeed.toFixed(1)} km/s</span>
                   </div>
                   <div className="h-1.5 bg-[#1e293b] w-full relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-[#7be1ea] shadow-[0_0_10px_#7be1ea] transition-all duration-700" style={{ width: `${Math.min(100, Math.max(0, data.metrics.solarWindSpeed / 10))}%` }} />
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between text-[11px] font-bold mt-4">
                      <span className="text-[#64748b] tracking-widest">Bz (Magnetic Dir.)</span>
                      <span className="text-[#ef4444] text-sm tracking-widest">{data.metrics.solarWindMagneticDir.toFixed(1)} nT</span>
                   </div>
                   <div className="h-1.5 bg-[#1e293b] w-full relative flex overflow-hidden">
                      <div className="flex-1 border-r border-white/10" />
                      <div className="flex-1 h-full bg-[#ef4444] shadow-[0_0_10px_#ef4444] transition-all duration-700" style={{ width: `${Math.min(100, Math.abs(data.metrics.solarWindMagneticDir))}%` }} />
                   </div>
                   <div className="flex justify-between text-[9px] opacity-40 font-bold tracking-[0.2em]">
                      <span>NORTH</span>
                      <span>SOUTH</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-8 pt-8 mt-8 border-t border-white/5 relative z-10">
                <div className="flex flex-col items-center justify-center p-4">
                   {/* Radio Blackout Dial */}
                   <div className="relative w-40 h-40 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90">
                       <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                       <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={452} strokeDashoffset={452 * (1 - (data.metrics.radioBlackoutProb / 100))} className="text-[#ef4444] stroke-[10] drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-1000" strokeLinecap="round" />
                     </svg>
                     <div className="absolute flex flex-col items-center translate-y-3">
                        <span className="text-4xl font-black font-sans text-white">{data.metrics.radioBlackoutProb}%</span>
                     </div>
                   </div>
                   <span className="text-center text-[11px] mt-6 text-[#64748b] font-bold tracking-[0.2em] leading-relaxed font-sans normal-case w-40">RADIO BLACKOUT PROBABILITY</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-4">
                   {/* Aurora Visibility Dial */}
                   <div className="relative w-40 h-40 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90">
                       <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                       <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={452} strokeDashoffset={452 * (1 - (data.metrics.auroraVisibility / 100))} className="text-[#a3e635] stroke-[10] drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] transition-all duration-1000" strokeLinecap="round" />
                     </svg>
                     <div className="absolute flex flex-col items-center translate-y-3">
                        <span className="text-4xl font-black font-sans text-white">{data.metrics.auroraVisibility}%</span>
                     </div>
                   </div>
                   <span className="text-center text-[11px] mt-6 text-[#64748b] font-bold tracking-[0.2em] leading-relaxed font-sans normal-case w-40">AURORA VISIBILITY</span>
                </div>
             </div>
          </div>
        </aside>
      </main>

      {/* FOOTER - STATUS BAR */}
      <footer className="h-14 border-t border-white/5 bg-black/80 flex items-center px-6 shrink-0 text-[10px] tracking-[0.2em]">
        <div className="flex items-center gap-3 border-r border-white/10 pr-6 mr-6 text-[#a3e635] font-bold">
           <Radio size={16} />
           <span className="text-xs">TELEMETRY LINKED</span>
        </div>
        
        <div className="flex-1 flex items-center gap-6 overflow-hidden">
           <span className="bg-[#7be1ea]/20 text-[#7be1ea] px-3 py-1 font-bold shrink-0 text-[11px]">NASA DONKI NEWS</span>
           <div className="whitespace-nowrap animate-marquee flex gap-16 font-sans opacity-80 normal-case tracking-normal text-sm">
              {data.news.map((item, idx) => (
                 <span key={idx}>{item}</span>
              ))}
           </div>
        </div>

        <div className="pl-6 ml-6 border-l border-white/10 opacity-70 flex gap-4 text-xs font-bold">
           <span>UPTIME: {data.uptime}</span>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(10%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
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
