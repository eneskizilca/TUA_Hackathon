"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { ChevronDown, Zap, Activity, MapPin, Eye } from "lucide-react";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export interface AuroraDataPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  intensity: number; // 0 to 100
  status: "CRITICAL" | "ELEVATED" | "MODERATE";
}

const translations = {
  EN: {
    about: "ABOUT US",
    register: "REGISTER",
    login: "SIGN IN",
    matrixTitle: "AURORA MATRIX",
    matrixDesc: "Live heat map generated from atmospheric ionization nodes. Analyzing the electromagnetic storm index targeting terrestrial and satellite assets.",
    liveView: "LIVE IONOSPHERE VIEW (ARCTIC CIRCLE)",
    awaiting: "Awaiting Incoming Telemetry from Polar Sensors..."
  },
  TR: {
    about: "HAKKIMIZDA",
    register: "KAYIT OL",
    login: "GİRİŞ YAP",
    matrixTitle: "AURORA MATRİSİ",
    matrixDesc: "Atmosferik iyonizasyon düğümlerinden elde edilen canlı ısı haritası. Yeryüzü ve uydu donanımlarını hedefleyen elektromanyetik fırtına indeksi analiz ediliyor.",
    liveView: "CANLI İYONOSFER GÖRÜNÜMÜ (KUZEY KUTUP DAİRESİ)",
    awaiting: "Kutup Sensörlerinden Telemetri Bekleniyor..."
  }
};

export default function AuroraPage() {
  const [data, setData] = useState<AuroraDataPoint[] | null>(null);
  const [lang, setLang] = useState<"EN" | "TR">("EN");
  const [langOpen, setLangOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    async function fetchAuroraData() {
      try {
        setData([]);
      } catch (error) {
        console.error("Failed to load aurora map data", error);
      }
    }
    fetchAuroraData();
  }, []);

  const handleLangSelect = (code: string) => {
    if (code === "TR" || code === "EN") {
      setLang(code as "EN" | "TR");
    }
    setLangOpen(false);
  };

  if (!data) return (
     <div className="min-h-screen bg-[#050607] flex flex-col items-center justify-center text-[#c084fc] font-mono gap-4 tracking-widest uppercase text-sm">
        <div className="w-8 h-8 rounded-full border-2 border-[#c084fc] border-t-transparent animate-spin" />
        Synching Ionosphere Data...
     </div>
  );

  return (
    <div className="min-h-screen bg-[#050607] text-[#64748b] font-mono flex flex-col overflow-hidden selection:bg-[#c084fc] selection:text-white">
      
      {/* HEADER */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 shrink-0 bg-[#0a0b0d] z-50">
        <div className="flex items-center gap-4">
          <Image src="/astrologo.gif" alt="Orbital Sense Logo" width={40} height={40} className="mix-blend-screen" unoptimized />
          <Link href="/" className="text-white font-black text-xl tracking-[0.2em] font-sans hover:text-[#7be1ea] transition-colors">ORBITAL SENSE</Link>
        </div>

        <nav className="flex items-center gap-8 text-[11px] font-bold tracking-widest uppercase">
          <Link href="/#about" className="hover:text-[#7be1ea] transition-colors border-b border-transparent hover:border-[#7be1ea] pb-1">{t.about}</Link>
          
          <div className="relative overflow-hidden px-5 py-2.5 flex items-center gap-2 rounded-sm text-white shadow-[0_0_20px_rgba(192,132,252,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7be1ea] via-[#c084fc] to-[#a3e635] bg-[length:200%_auto] animate-[gradientFlow_3s_linear_infinite]" />
            <Zap size={14} className="relative z-10" /> <span className="relative z-10">AURORA</span>
          </div>

          <Link href="/auth/register" className="hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">{t.register}</Link>
          <Link href="/auth/login" className="hover:text-[#a3e635] transition-colors border-b border-transparent hover:border-[#a3e635] pb-1">{t.login}</Link>
          
          {/* LANGUAGE DROPDOWN */}
          <div className="relative">
             <div onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-2 border border-white/20 px-3 py-1.5 rounded-sm hover:bg-white/5 cursor-pointer transition-colors text-white w-14 justify-between">
               <span>{lang === "TR" ? "🇹🇷" : "🇬🇧"} {lang}</span>
               <ChevronDown size={14} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
             </div>
             {langOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-[#0a0b0d] border border-white/10 rounded-sm py-1 flex flex-col z-50 shadow-2xl">
                   <button onClick={() => handleLangSelect("TR")} className={`flex items-center justify-between px-3 py-2.5 hover:bg-white/10 text-white text-xs text-left ${lang === "TR" ? 'bg-white/5 text-[#7be1ea]' : ''}`}><span className="flex items-center gap-2">🇹🇷 TR</span> <span className="text-[#64748b] text-[9px]">TUR</span></button>
                   <button onClick={() => handleLangSelect("EN")} className={`flex items-center justify-between px-3 py-2.5 hover:bg-white/10 text-white text-xs text-left ${lang === "EN" ? 'bg-white/5 text-[#7be1ea]' : ''}`}><span className="flex items-center gap-2">🇬🇧 EN</span> <span className="text-[#64748b] text-[9px]">ENG</span></button>
                   <button onClick={() => handleLangSelect("RU")} className="flex items-center justify-between px-3 py-2.5 hover:bg-white/10 text-white text-xs text-left opacity-30 cursor-not-allowed" title="Mock Module"><span className="flex items-center gap-2">🇷🇺 RU</span> <span className="text-[#64748b] text-[9px]">RUS</span></button>
                   <button onClick={() => handleLangSelect("ZH")} className="flex items-center justify-between px-3 py-2.5 hover:bg-white/10 text-white text-xs text-left opacity-30 cursor-not-allowed" title="Mock Module"><span className="flex items-center gap-2">🇨🇳 ZH</span> <span className="text-[#64748b] text-[9px]">ZHO</span></button>
                   <button onClick={() => handleLangSelect("JA")} className="flex items-center justify-between px-3 py-2.5 hover:bg-white/10 text-white text-xs text-left opacity-30 cursor-not-allowed" title="Mock Module"><span className="flex items-center gap-2">🇯🇵 JA</span> <span className="text-[#64748b] text-[9px]">JPN</span></button>
                </div>
             )}
          </div>
        </nav>
      </header>

      <main className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR - AURORA DATAFEED */}
        <aside className="w-[400px] bg-[#0a0b0d] border-r border-white/5 flex flex-col py-8 overflow-y-auto shrink-0 z-20">
           <div className="px-8 flex items-center gap-3 text-[#c084fc] mb-8">
              <Activity size={20} />
              <h2 className="font-sans font-black text-2xl tracking-tight text-white uppercase mt-1">{t.matrixTitle}</h2>
           </div>

           <p className="px-8 text-[#475569] text-[10px] tracking-widest uppercase leading-relaxed mb-6">
              {t.matrixDesc}
           </p>

           <div className="px-8 flex flex-col gap-4">
              {data.length === 0 && (
                 <div className="flex flex-col items-center justify-center py-12 opacity-50 border border-dashed border-[#c084fc]/30 rounded-sm gap-4 mt-4">
                    <Activity size={24} className="text-[#c084fc] animate-pulse" />
                    <span className="text-[10px] tracking-widest text-[#c084fc] uppercase font-bold text-center px-6 leading-relaxed">
                       {t.awaiting}
                    </span>
                 </div>
              )}
              {data.map((point) => (
                 <div key={point.id} className="bg-[#050607] border border-white/5 p-5 rounded-sm hover:-translate-y-1 transition-transform border-l-[3px] group shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                   style={{
                     borderLeftColor: point.status === "CRITICAL" ? "#c084fc" : point.status === "ELEVATED" ? "#a3e635" : "#7be1ea"
                   }}
                 >
                    <div className="flex justify-between items-start mb-3">
                       <h3 className="text-white font-bold text-sm tracking-widest">{point.name}</h3>
                       <span className={`px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-[0.2em] border`}
                         style={{ 
                            backgroundColor: point.status === "CRITICAL" ? "rgba(192,132,252,0.1)" : point.status === "ELEVATED" ? "rgba(163,230,53,0.1)" : "rgba(123,225,234,0.1)",
                            borderColor: point.status === "CRITICAL" ? "rgba(192,132,252,0.3)" : point.status === "ELEVATED" ? "rgba(163,230,53,0.3)" : "rgba(123,225,234,0.3)",
                            color: point.status === "CRITICAL" ? "#c084fc" : point.status === "ELEVATED" ? "#a3e635" : "#7be1ea"
                         }}
                       >
                          {point.status}
                       </span>
                    </div>

                    <div className="flex flex-col gap-2">
                       <div className="flex justify-between items-center text-[9px] tracking-widest uppercase text-[#64748b]">
                          <span className="flex items-center gap-2"><MapPin size={10} /> LAT: {point.coordinates[1]}° N</span>
                          <span className="flex items-center gap-2">ION-INDEX: {point.intensity}%</span>
                       </div>
                       
                       {/* PROGRESS BAR */}
                       <div className="w-full bg-[#1e293b] h-[2px] rounded-full overflow-hidden mt-1">
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ 
                               width: `${point.intensity}%`,
                               backgroundColor: point.status === "CRITICAL" ? "#c084fc" : point.status === "ELEVATED" ? "#a3e635" : "#7be1ea" 
                            }}
                          />
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </aside>

        {/* MAP VISUALIZATION */}
        <section className="flex-1 bg-[#050607] relative flex items-center justify-center pt-8 overflow-hidden z-10">
           
           {/* DECORATIVE OVERLAY GRID */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 pointer-events-none" />

           {/* AURORA GLOBE MAPPING */}
           <div className="w-[120%] h-[120%] flex items-center justify-center mix-blend-screen drop-shadow-[0_0_20px_rgba(192,132,252,0.2)]">
              <ComposableMap 
                projection="geoOrthographic" 
                projectionConfig={{ scale: 350, center: [0, 60] }}
                className="w-full h-full"
              >
                  <Geographies geography={geoUrl}>
                    {({ geographies }: any) =>
                      geographies.map((geo: any) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#0a0b0d"
                          stroke="#1e293b"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: { fill: "#151b24", outline: "none" },
                            pressed: { outline: "none" },
                          }}
                        />
                      ))
                    }
                  </Geographies>

                  {/* AURORA HOTSPOTS */}
                  {data.map((point) => (
                     <Marker key={point.id} coordinates={point.coordinates}>
                        <circle 
                           r={point.intensity / 6} 
                           fill={point.status === "CRITICAL" ? "#c084fc" : point.status === "ELEVATED" ? "#a3e635" : "#7be1ea"} 
                           fillOpacity={0.6}
                           className="animate-pulse"
                        />
                        <circle 
                           r={point.intensity / 15} 
                           fill="#fff" 
                        />
                     </Marker>
                  ))}
              </ComposableMap>
           </div>
           
           <div className="absolute top-6 right-6 flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-sm text-[10px] tracking-widest text-[#a3e635] uppercase font-bold">
              <Eye size={12} className="animate-pulse" /> {t.liveView}
           </div>
        </section>

      </main>
      
      <style jsx global>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
