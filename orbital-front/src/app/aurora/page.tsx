"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ComposableMap, Geographies, Geography, Marker, Graticule } from "react-simple-maps";
import { ChevronDown, Zap, Activity, MapPin, Eye } from "lucide-react";
import { fetchCurrentConditions } from "@/lib/api/space-weather";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export interface AuroraDataPoint {
  id: string;
  name: string;
  coordinates: [number, number];
  intensity: number; // 0 to 100
  status: "CRITICAL" | "ELEVATED" | "MODERATE";
  kpIndex: number;
}

const translations = {
  EN: {
    about: "ABOUT US",
    register: "REGISTER",
    login: "SIGN IN",
    matrixTitle: "AURORA MATRIX",
    matrixDesc: "Real-time aurora borealis visibility map based on Kp geomagnetic index. Tracking ionospheric activity and northern lights observation zones across the Arctic Circle.",
    liveView: "LIVE IONOSPHERE VIEW (ARCTIC CIRCLE)",
    awaiting: "Awaiting Incoming Telemetry from Polar Sensors..."
  },
  TR: {
    about: "HAKKIMIZDA",
    register: "KAYIT OL",
    login: "GİRİŞ YAP",
    matrixTitle: "AURORA MATRİSİ",
    matrixDesc: "Kp jeomanyetik indeksine dayalı gerçek zamanlı kuzey ışıkları görünürlük haritası. Kuzey Kutup Dairesi boyunca iyonosferik aktivite ve kuzey ışıkları gözlem bölgeleri takip ediliyor.",
    liveView: "CANLI İYONOSFER GÖRÜNÜMÜ (KUZEY KUTUP DAİRESİ)",
    awaiting: "Kutup Sensörlerinden Telemetri Bekleniyor..."
  }
};

export default function AuroraPage() {
  const [data, setData] = useState<AuroraDataPoint[] | null>(null);
  const [lang, setLang] = useState<"EN" | "TR">("EN");
  const [langOpen, setLangOpen] = useState(false);
  const [kpIndex, setKpIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  // Calculate aurora visibility latitude based on Kp index
  const calculateAuroraLatitude = (kp: number): number => {
    // Kp 0-1: ~67° (Arctic Circle)
    // Kp 2-3: ~64°
    // Kp 4: ~62°
    // Kp 5: ~60°
    // Kp 6: ~58°
    // Kp 7: ~56°
    // Kp 8: ~54°
    // Kp 9: ~50° (visible from northern US/Europe)
    const latitudeMap: { [key: number]: number } = {
      0: 67, 1: 67, 2: 64, 3: 64, 4: 62, 5: 60, 6: 58, 7: 56, 8: 54, 9: 50
    };
    return latitudeMap[Math.round(kp)] || 67;
  };

  // Generate aurora observation points based on Kp index
  const generateAuroraPoints = (kp: number): AuroraDataPoint[] => {
    const safeKp = Number(kp) || 3; // Ensure valid number
    const auroraLat = calculateAuroraLatitude(safeKp);
    const intensity = Math.min(100, Math.round(safeKp * 11)); // Convert Kp (0-9) to percentage
    
    let status: "CRITICAL" | "ELEVATED" | "MODERATE" = "MODERATE";
    if (safeKp >= 7) status = "CRITICAL";
    else if (safeKp >= 5) status = "ELEVATED";

    // Major observation points around the aurora oval
    const points: AuroraDataPoint[] = [
      {
        id: "tromsø",
        name: "Tromsø, Norway",
        coordinates: [18.96, auroraLat],
        intensity,
        status,
        kpIndex: safeKp
      },
      {
        id: "reykjavik",
        name: "Reykjavik, Iceland",
        coordinates: [-21.89, auroraLat - 2],
        intensity: Math.round(intensity * 0.95),
        status,
        kpIndex: safeKp
      },
      {
        id: "fairbanks",
        name: "Fairbanks, Alaska",
        coordinates: [-147.72, auroraLat - 1],
        intensity: Math.round(intensity * 0.98),
        status,
        kpIndex: safeKp
      },
      {
        id: "yellowknife",
        name: "Yellowknife, Canada",
        coordinates: [-114.37, auroraLat],
        intensity,
        status,
        kpIndex: safeKp
      },
      {
        id: "murmansk",
        name: "Murmansk, Russia",
        coordinates: [33.08, auroraLat + 1],
        intensity: Math.round(intensity * 0.92),
        status,
        kpIndex: safeKp
      },
      {
        id: "kiruna",
        name: "Kiruna, Sweden",
        coordinates: [20.22, auroraLat],
        intensity: Math.round(intensity * 0.96),
        status,
        kpIndex: safeKp
      }
    ];

    // If Kp is high enough, add mid-latitude observation points
    if (safeKp >= 6) {
      points.push({
        id: "oslo",
        name: "Oslo, Norway",
        coordinates: [10.75, 59.91],
        intensity: Math.round(intensity * 0.7),
        status: "ELEVATED",
        kpIndex: safeKp
      });
    }

    if (safeKp >= 7) {
      points.push({
        id: "stockholm",
        name: "Stockholm, Sweden",
        coordinates: [18.07, 59.33],
        intensity: Math.round(intensity * 0.65),
        status: "ELEVATED",
        kpIndex: safeKp
      });
    }

    if (safeKp >= 8) {
      points.push({
        id: "edinburgh",
        name: "Edinburgh, UK",
        coordinates: [-3.19, 55.95],
        intensity: Math.round(intensity * 0.55),
        status: "MODERATE",
        kpIndex: safeKp
      });
    }

    return points;
  };

  useEffect(() => {
    async function fetchAuroraData() {
      try {
        const conditions = await fetchCurrentConditions();
        const currentKp = Number(conditions.kp_index) || 3; // Default to 3 if invalid
        setKpIndex(currentKp);
        
        const auroraPoints = generateAuroraPoints(currentKp);
        setData(auroraPoints);
      } catch (error) {
        console.error("Failed to load aurora data", error);
        // Fallback to default data
        setKpIndex(3);
        setData(generateAuroraPoints(3));
      } finally {
        setLoading(false);
      }
    }
    
    fetchAuroraData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchAuroraData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleLangSelect = (code: string) => {
    if (code === "TR" || code === "EN") {
      setLang(code as "EN" | "TR");
    }
    setLangOpen(false);
  };

  if (loading || !data) return (
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
              <div className="flex flex-col">
                <h2 className="font-sans font-black text-2xl tracking-tight text-white uppercase mt-1">{t.matrixTitle}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] tracking-widest text-[#64748b] uppercase">KP INDEX:</span>
                  <span className={`text-sm font-bold ${kpIndex >= 7 ? 'text-[#c084fc]' : kpIndex >= 5 ? 'text-[#a3e635]' : 'text-[#7be1ea]'}`}>
                    {Number(kpIndex).toFixed(1)}
                  </span>
                </div>
              </div>
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
                          <span className="flex items-center gap-2"><MapPin size={10} /> LAT: {Number(point.coordinates[1]).toFixed(2)}° N</span>
                          <span className="flex items-center gap-2">ION-INDEX: {Number(point.intensity).toFixed(0)}%</span>
                       </div>
                       
                       <div className="flex justify-between items-center text-[9px] tracking-widest uppercase text-[#64748b] mt-1">
                          <span>KP: {Number(point.kpIndex).toFixed(1)}</span>
                          <span>VISIBILITY: {Number(point.intensity) > 70 ? 'HIGH' : Number(point.intensity) > 40 ? 'MEDIUM' : 'LOW'}</span>
                       </div>
                       
                       {/* PROGRESS BAR */}
                       <div className="w-full bg-[#1e293b] h-[2px] rounded-full overflow-hidden mt-1">
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ 
                               width: `${Number(point.intensity) || 0}%`,
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
        <section className="flex-1 bg-[#050607] relative flex items-start justify-center pt-0 overflow-hidden z-10">
           
           {/* DECORATIVE OVERLAY GRID */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10 pointer-events-none z-20" />

           {/* AURORA BACKGROUND GLOW EFFECTS - Behind everything, below globe */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -10 }}>
              {/* Aurora Curtain 1 - Purple wave */}
              <div className="absolute bottom-0 left-[15%] w-[100px] animate-aurora-wave-1"
                   style={{
                     height: '70%',
                     background: 'linear-gradient(to top, rgba(192, 132, 252, 0) 0%, rgba(192, 132, 252, 0.6) 40%, rgba(192, 132, 252, 0) 100%)',
                     filter: 'blur(50px)',
                     transformOrigin: 'bottom center'
                   }} />
              
              {/* Aurora Curtain 2 - Green wave */}
              <div className="absolute bottom-0 left-[28%] w-[90px] animate-aurora-wave-2"
                   style={{
                     height: '65%',
                     background: 'linear-gradient(to top, rgba(163, 230, 53, 0) 0%, rgba(163, 230, 53, 0.55) 35%, rgba(163, 230, 53, 0) 100%)',
                     filter: 'blur(45px)',
                     transformOrigin: 'bottom center'
                   }} />
              
              {/* Aurora Curtain 3 - Cyan wave (center) */}
              <div className="absolute bottom-0 left-[42%] w-[110px] animate-aurora-wave-3"
                   style={{
                     height: '75%',
                     background: 'linear-gradient(to top, rgba(123, 225, 234, 0) 0%, rgba(123, 225, 234, 0.65) 45%, rgba(123, 225, 234, 0) 100%)',
                     filter: 'blur(55px)',
                     transformOrigin: 'bottom center'
                   }} />
              
              {/* Aurora Curtain 4 - Purple wave */}
              <div className="absolute bottom-0 left-[56%] w-[95px] animate-aurora-wave-4"
                   style={{
                     height: '68%',
                     background: 'linear-gradient(to top, rgba(192, 132, 252, 0) 0%, rgba(192, 132, 252, 0.58) 38%, rgba(192, 132, 252, 0) 100%)',
                     filter: 'blur(48px)',
                     transformOrigin: 'bottom center'
                   }} />
              
              {/* Aurora Curtain 5 - Green wave */}
              <div className="absolute bottom-0 left-[70%] w-[85px] animate-aurora-wave-5"
                   style={{
                     height: '62%',
                     background: 'linear-gradient(to top, rgba(163, 230, 53, 0) 0%, rgba(163, 230, 53, 0.52) 42%, rgba(163, 230, 53, 0) 100%)',
                     filter: 'blur(42px)',
                     transformOrigin: 'bottom center'
                   }} />
              
              {/* Aurora Curtain 6 - Cyan wave */}
              <div className="absolute bottom-0 left-[82%] w-[100px] animate-aurora-wave-6"
                   style={{
                     height: '70%',
                     background: 'linear-gradient(to top, rgba(123, 225, 234, 0) 0%, rgba(123, 225, 234, 0.6) 40%, rgba(123, 225, 234, 0) 100%)',
                     filter: 'blur(50px)',
                     transformOrigin: 'bottom center'
                   }} />
           </div>

           {/* AURORA GLOBE MAPPING - On top */}
           <div className="w-[120%] h-[120%] flex items-start justify-center mix-blend-screen drop-shadow-[0_0_20px_rgba(192,132,252,0.2)] -mt-64 relative z-10">
              <ComposableMap 
                projection="geoOrthographic" 
                projectionConfig={{ scale: 400, center: [0, 88], rotate: [0, -2, 0] }}
                className="w-full h-full"
              >
                  {/* GRATICULE - Latitude/Longitude grid */}
                  <Graticule 
                    stroke="#1e293b" 
                    strokeWidth={0.5}
                    strokeOpacity={0.5}
                  />

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
                  {data.map((point) => {
                    const safeIntensity = Number(point.intensity) || 50;
                    const radius = Math.max(4, safeIntensity / 5);
                    const innerRadius = Math.max(1.5, safeIntensity / 18);
                    
                    return (
                     <Marker key={point.id} coordinates={point.coordinates}>
                        {/* Outer glow */}
                        <circle 
                           r={radius + 3} 
                           fill={point.status === "CRITICAL" ? "#c084fc" : point.status === "ELEVATED" ? "#a3e635" : "#7be1ea"} 
                           fillOpacity={0.2}
                        />
                        {/* Main circle */}
                        <circle 
                           r={radius} 
                           fill={point.status === "CRITICAL" ? "#c084fc" : point.status === "ELEVATED" ? "#a3e635" : "#7be1ea"} 
                           fillOpacity={0.8}
                           className="animate-pulse"
                        />
                        {/* Inner bright spot */}
                        <circle 
                           r={innerRadius} 
                           fill="#fff" 
                        />
                        {/* Location label */}
                        <text
                          textAnchor="middle"
                          y={-radius - 8}
                          style={{
                            fontFamily: "monospace",
                            fontSize: "9px",
                            fill: "#fff",
                            fontWeight: "bold",
                            textShadow: "0 0 4px #000, 0 0 8px #000"
                          }}
                        >
                          {point.name.split(',')[0]}
                        </text>
                     </Marker>
                    );
                  })}
              </ComposableMap>
           </div>
           
           <div className="absolute top-6 right-6 flex flex-col gap-2">
             <div className="flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-sm text-[10px] tracking-widest text-[#a3e635] uppercase font-bold">
                <Eye size={12} className="animate-pulse" /> {t.liveView}
             </div>
             <div className="bg-black/50 border border-white/10 backdrop-blur-sm px-4 py-3 rounded-sm text-[9px] tracking-widest uppercase">
                <div className="text-[#64748b] mb-2 font-bold">AURORA VISIBILITY</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#c084fc]" />
                    <span className="text-white">KP 7-9: ~{calculateAuroraLatitude(7)}°N</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#a3e635]" />
                    <span className="text-white">KP 5-6: ~{calculateAuroraLatitude(5)}°N</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#7be1ea]" />
                    <span className="text-white">KP 0-4: ~{calculateAuroraLatitude(3)}°N</span>
                  </div>
                </div>
             </div>
           </div>
        </section>

      </main>
      
      <style jsx global>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes aurora-wave-1 {
          0% { 
            opacity: 0.3;
            transform: scaleY(0.6) skewX(-2deg);
            filter: blur(50px) hue-rotate(0deg);
          }
          25% { 
            opacity: 0.7;
            transform: scaleY(1.3) skewX(3deg);
            filter: blur(55px) hue-rotate(15deg);
          }
          50% { 
            opacity: 0.5;
            transform: scaleY(0.9) skewX(-1deg);
            filter: blur(48px) hue-rotate(30deg);
          }
          75% { 
            opacity: 0.8;
            transform: scaleY(1.5) skewX(2deg);
            filter: blur(52px) hue-rotate(15deg);
          }
          100% { 
            opacity: 0.3;
            transform: scaleY(0.6) skewX(-2deg);
            filter: blur(50px) hue-rotate(0deg);
          }
        }
        
        @keyframes aurora-wave-2 {
          0% { 
            opacity: 0.4;
            transform: scaleY(0.8) skewX(3deg);
            filter: blur(45px) hue-rotate(0deg);
          }
          30% { 
            opacity: 0.8;
            transform: scaleY(1.4) skewX(-2deg);
            filter: blur(50px) hue-rotate(-20deg);
          }
          60% { 
            opacity: 0.6;
            transform: scaleY(1.0) skewX(1deg);
            filter: blur(42px) hue-rotate(-10deg);
          }
          90% { 
            opacity: 0.75;
            transform: scaleY(1.2) skewX(-3deg);
            filter: blur(48px) hue-rotate(-15deg);
          }
          100% { 
            opacity: 0.4;
            transform: scaleY(0.8) skewX(3deg);
            filter: blur(45px) hue-rotate(0deg);
          }
        }
        
        @keyframes aurora-wave-3 {
          0% { 
            opacity: 0.5;
            transform: scaleY(1.0) skewX(0deg);
            filter: blur(55px) hue-rotate(0deg);
          }
          20% { 
            opacity: 0.85;
            transform: scaleY(1.6) skewX(-4deg);
            filter: blur(60px) hue-rotate(25deg);
          }
          40% { 
            opacity: 0.65;
            transform: scaleY(1.1) skewX(2deg);
            filter: blur(52px) hue-rotate(40deg);
          }
          70% { 
            opacity: 0.9;
            transform: scaleY(1.7) skewX(-3deg);
            filter: blur(58px) hue-rotate(20deg);
          }
          100% { 
            opacity: 0.5;
            transform: scaleY(1.0) skewX(0deg);
            filter: blur(55px) hue-rotate(0deg);
          }
        }
        
        @keyframes aurora-wave-4 {
          0% { 
            opacity: 0.35;
            transform: scaleY(0.7) skewX(2deg);
            filter: blur(48px) hue-rotate(0deg);
          }
          35% { 
            opacity: 0.75;
            transform: scaleY(1.35) skewX(-3deg);
            filter: blur(53px) hue-rotate(-18deg);
          }
          65% { 
            opacity: 0.55;
            transform: scaleY(0.95) skewX(4deg);
            filter: blur(45px) hue-rotate(-30deg);
          }
          85% { 
            opacity: 0.8;
            transform: scaleY(1.45) skewX(-2deg);
            filter: blur(50px) hue-rotate(-12deg);
          }
          100% { 
            opacity: 0.35;
            transform: scaleY(0.7) skewX(2deg);
            filter: blur(48px) hue-rotate(0deg);
          }
        }
        
        @keyframes aurora-wave-5 {
          0% { 
            opacity: 0.4;
            transform: scaleY(0.75) skewX(-3deg);
            filter: blur(42px) hue-rotate(0deg);
          }
          28% { 
            opacity: 0.7;
            transform: scaleY(1.25) skewX(4deg);
            filter: blur(47px) hue-rotate(22deg);
          }
          55% { 
            opacity: 0.85;
            transform: scaleY(1.5) skewX(-1deg);
            filter: blur(50px) hue-rotate(35deg);
          }
          78% { 
            opacity: 0.6;
            transform: scaleY(1.05) skewX(2deg);
            filter: blur(44px) hue-rotate(18deg);
          }
          100% { 
            opacity: 0.4;
            transform: scaleY(0.75) skewX(-3deg);
            filter: blur(42px) hue-rotate(0deg);
          }
        }
        
        @keyframes aurora-wave-6 {
          0% { 
            opacity: 0.45;
            transform: scaleY(0.85) skewX(1deg);
            filter: blur(50px) hue-rotate(0deg);
          }
          33% { 
            opacity: 0.8;
            transform: scaleY(1.4) skewX(-4deg);
            filter: blur(55px) hue-rotate(-25deg);
          }
          66% { 
            opacity: 0.65;
            transform: scaleY(1.15) skewX(3deg);
            filter: blur(48px) hue-rotate(-15deg);
          }
          88% { 
            opacity: 0.75;
            transform: scaleY(1.3) skewX(-2deg);
            filter: blur(52px) hue-rotate(-20deg);
          }
          100% { 
            opacity: 0.45;
            transform: scaleY(0.85) skewX(1deg);
            filter: blur(50px) hue-rotate(0deg);
          }
        }
        
        .animate-aurora-wave-1 {
          animation: aurora-wave-1 8s ease-in-out infinite;
        }
        
        .animate-aurora-wave-2 {
          animation: aurora-wave-2 10s ease-in-out infinite 1.5s;
        }
        
        .animate-aurora-wave-3 {
          animation: aurora-wave-3 12s ease-in-out infinite 3s;
        }
        
        .animate-aurora-wave-4 {
          animation: aurora-wave-4 9s ease-in-out infinite 0.5s;
        }
        
        .animate-aurora-wave-5 {
          animation: aurora-wave-5 11s ease-in-out infinite 2s;
        }
        
        .animate-aurora-wave-6 {
          animation: aurora-wave-6 10s ease-in-out infinite 4s;
        }
      `}</style>
    </div>
  );
}
