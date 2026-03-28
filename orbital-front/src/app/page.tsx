"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Globe, Activity, ArrowRight, Zap, ShieldAlert, Crosshair } from "lucide-react";

const translations = {
  EN: {
    about: "ABOUT US",
    register: "REGISTER",
    login: "SIGN IN",
    heroTitle1: "BEYOND THE \n ATMOSPHERE.",
    heroTitle2A: "PREDICTING",
    heroTitle2B: "THE ANOMALY.",
    heroDesc: "Next-generation spatial awareness and telemetry tracking infrastructure. Authorize your terminal to synchronize with the orbital grid.",
    initLink: "INITIALIZE LINK",
    regTerm: "REGISTER TERMINAL",
    aboutTitle1: "PROJECT VISION",
    aboutTitle2A: "DECODE THE INVISIBLE",
    aboutTitle2B: "THREATS.",
    aboutP1: 'Orbital Sense was developed at the core of modern telemetry and space infrastructure challenges for the TUA Hackathon. In an era where extreme Solar Flares, atmospheric anomalies, and transformer collapses threaten critical hardware, our mission is to build a massive and "Smart" prediction matrix.',
    aboutP2: 'By simultaneously processing in-orbit Satellites, transcontinental Cargo Planes, high-voltage Transformers, and global Datacenters through the <span class="text-white font-bold">Aurora AI</span> network, we provide a simulation capable of isolating environmental & solar fluctuations before they inevitably impact critical assets.',
    f1Title: "REAL-TIME SYNC",
    f1Desc: "Sub-second synchronization spanning a global map matrix for 4 distinct asset classes: Planes, Satellites, Transformers, and Datacenters.",
    f2Title: "AURORA AI",
    f2Desc: "AI-driven neural network framework. Acts as an autonomous infrastructure guardian by predicting the trajectory of disruptive solar activities.",
    f3Title: "GLOBAL SCALE",
    f3Desc: "Differentiated authorization roles tailored for Observers and Operators. Massive scope ranging from System Logs telemetry analysis to Pro Request governance.",
    f4Title: "SECURE PROTOCOL",
    f4Desc: "Strictly compatible with robust FastAPI integrations, utilizing a secure Mock-Free infrastructure architecture bound to an aesthetic UI Matrix."
  },
  TR: {
    about: "HAKKIMIZDA",
    register: "KAYIT OL",
    login: "GİRİŞ YAP",
    heroTitle1: "ATMOSFERİN \n ÖTESİNDE.",
    heroTitle2A: "ANOMALİYİ",
    heroTitle2B: "TAHMİN ET.",
    heroDesc: "Yeni nesil uzaysal farkındalık ve telemetri takip altyapısı. Yörünge ızgarasıyla senkronize olmak için terminalinize yetki verin.",
    initLink: "SEKANSI BAŞLAT",
    regTerm: "TERMİNALİ KAYDET",
    aboutTitle1: "PROJE VİZYONU",
    aboutTitle2A: "GÖRÜNMEZ TEHDİTLERİ",
    aboutTitle2B: "DEŞİFRE ET.",
    aboutP1: 'Orbital Sense, modern telemetri ve uzay altyapısı zorluklarının kalbinde TUA Hackathonu için geliştirilmiştir. Şiddetli Güneş patlamalarının (Solar Flare), atmosferik anomalilerin ve trafo çöküşlerinin kritik donanımlara tehdit oluşturduğu bir çağda, devasa ve "Akıllı" bir öngörü matrisi kurmayı hedefliyoruz.',
    aboutP2: 'Yörüngedeki Uyduları, kıtalararası Uçak kargolarını, yüksek gerilimli Trafo noktalarını ve kıtalararası Veri Merkezlerini eş zamanlı olarak <span class="text-white font-bold">Aurora AI</span> ağı üzerinde işliyor, çevresel/solar değişimler kritik parçalara inmeden onları izole edebilen bir simülasyon sağlıyoruz.',
    f1Title: "GERÇEK ZAMANLI EŞLEME",
    f1Desc: "4 farklı asset (Uçak, Uydu, Trafo, Datacenter) türü için global harita üzerinde milisaniyelik senkronizasyon.",
    f2Title: "AURORA AI",
    f2Desc: "Yapay zeka tabanlı sinir ağı. Güneş patlamalarının rotasını tahmin ederek uydu çarpışmalarını otonom engeller.",
    f3Title: "KÜRESEL ÖLÇEK",
    f3Desc: "Observer ve Operator seviyesinde farklılaştırılmış yetki. Sistem logları okumasından, yetki yönetimine kadar devasa kapsam.",
    f4Title: "GÜVENLİ PROTOKOL",
    f4Desc: "FastAPI entegrasyonuna tam uyumlu, veri kaçağına kapalı 'Mock-Free' altyapı kodlaması ve UI Matrixi."
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState<"EN" | "TR">("EN");
  const [langOpen, setLangOpen] = useState(false);
  const t = translations[lang];

  const handleLangSelect = (code: string) => {
    if (code === "TR" || code === "EN") {
      setLang(code as "EN" | "TR");
    }
    setLangOpen(false);
  };

  return (
    <div className="bg-[#050607] text-[#64748b] font-mono flex flex-col overflow-x-hidden relative scroll-smooth selection:bg-[#7be1ea] selection:text-black">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7be1ea]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[120vh] right-1/4 w-96 h-96 bg-[#a3e635]/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* HEADER */}
      <header className="h-24 flex items-center justify-between px-10 relative z-50 bg-[#050607]/80 backdrop-blur-md sticky top-0 border-b border-white/5">
        <div className="flex items-center gap-4">
          <Image src="/astrologo.gif" alt="Orbital Sense Logo" width={48} height={48} className="mix-blend-screen" unoptimized />
          <span className="text-white font-black text-2xl tracking-[0.2em] font-sans">ORBITAL SENSE</span>
        </div>

        <nav className="flex items-center gap-8 text-[11px] font-bold tracking-widest uppercase">
          <a href="#about" className="hover:text-[#7be1ea] transition-colors border-b border-transparent hover:border-[#7be1ea] pb-1">{t.about}</a>
          
          {/* AURORA BUTTON - FLUID GRADIENT HOVER */}
          <Link href="/aurora" className="relative overflow-hidden px-5 py-2.5 flex items-center gap-2 rounded-sm border border-[#c084fc]/50 text-[#c084fc] transition-all group hover:border-transparent hover:text-white hover:shadow-[0_0_20px_rgba(192,132,252,0.6)] z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7be1ea] via-[#c084fc] to-[#a3e635] opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-[gradientFlow_3s_linear_infinite] z-0" />
            <Zap size={14} className="relative z-10" /> <span className="relative z-10">AURORA</span>
          </Link>

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

      {/* HERO SECTION */}
      <main className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-10 relative z-10 max-w-[1600px] mx-auto w-full gap-10 py-20 lg:py-0">
        
        {/* LEFT COLUMN - GLOBE */}
        <div className="flex-1 flex justify-center items-center relative h-full min-h-[500px]">
          <div className="absolute w-[500px] h-[500px] border border-white/5 rounded-full animate-[spin_40s_linear_infinite]" />
          <div className="absolute w-[550px] h-[550px] border border-dashed border-white/5 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
          
          <div className="relative w-[450px] h-[450px] flex items-center justify-center bg-[#050607] rounded-full shadow-[0_0_80px_rgba(163,230,53,0.15)] overflow-hidden cursor-pointer hover:shadow-[0_0_120px_rgba(123,225,234,0.3)] transition-shadow duration-700">
            <Image src="/world.png" alt="World" width={450} height={450} className="mix-blend-screen opacity-100 drop-shadow-[0_0_40px_rgba(123,225,234,0.6)] animate-pulse object-cover" unoptimized priority />
          </div>

          <div className="absolute top-20 left-10 flex flex-col gap-1 opacity-60">
             <span className="text-[#a3e635] text-[10px]">SYS_ONLINE</span>
             <span className="text-white text-[8px] tracking-widest">LAT: 79.0352° N</span>
          </div>
          <div className="absolute bottom-20 right-10 flex flex-col gap-1 items-end opacity-60">
             <span className="text-[#7be1ea] text-[10px]">GLOBAL_SYNC</span>
             <span className="text-white text-[8px] tracking-widest">NODE: AETHERIS</span>
          </div>
        </div>

        {/* RIGHT COLUMN - TYPOGRAPHY */}
        <div className="flex-1 flex flex-col justify-center pl-12 gap-8 relative z-20">
           <div className="flex flex-col">
              <h1 className="text-white font-black text-[5.5rem] font-sans tracking-tighter leading-[1] mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] whitespace-pre-line">
                 {t.heroTitle1}
              </h1>
              <h2 className="text-[#7be1ea] font-black text-6xl font-sans tracking-tight leading-[1] drop-shadow-[0_0_15px_rgba(123,225,234,0.3)]">
                 {t.heroTitle2A} <br /> 
                 <span className="text-[#a3e635] drop-shadow-[0_0_15px_rgba(163,230,53,0.3)] block mt-3">{t.heroTitle2B}</span>
              </h2>
           </div>

           <p className="text-[#64748b] text-sm tracking-widest max-w-xl leading-relaxed mt-4 border-l-[3px] border-[#c084fc] pl-6 py-2">
              {t.heroDesc}
           </p>

           <div className="flex items-center gap-6 mt-8">
              <Link href="/auth/login" className="bg-[#7be1ea] hover:bg-white text-black font-extrabold text-xs tracking-[0.2em] px-10 py-5 rounded-sm transition-all shadow-[0_5px_20px_rgba(123,225,234,0.3)] hover:-translate-y-1 flex items-center gap-3">
                 {t.initLink} <ArrowRight size={16} />
              </Link>
              <Link href="/auth/register" className="border border-white/20 text-white hover:border-[#a3e635] hover:text-[#a3e635] font-bold text-xs tracking-[0.2em] px-10 py-5 rounded-sm transition-all hover:-translate-y-1 w-[260px] text-center">
                 {t.regTerm}
              </Link>
           </div>
        </div>

      </main>

      {/* ABOUT US SECTION */}
      <section id="about" className="relative z-20 w-full bg-[#0a0b0d] border-t border-white/5 pt-20 pb-32 px-10">
         <div className="max-w-[1400px] mx-auto flex flex-col gap-20">
            
            <div className="flex flex-col lg:flex-row gap-20 items-center">
               
               {/* ABOUT TEXT */}
               <div className="flex-1 flex flex-col gap-8">
                  <div className="flex items-center gap-4 text-[#a3e635] text-sm font-bold tracking-[0.3em] mb-2 uppercase">
                     <Crosshair size={18} /> {t.aboutTitle1}
                  </div>
                  <h3 className="text-white font-sans font-black text-5xl tracking-tight leading-[1.1]">
                     {t.aboutTitle2A} <br /><span className="text-[#7be1ea] block mt-2 drop-shadow-[0_0_10px_rgba(123,225,234,0.3)]">{t.aboutTitle2B}</span>
                  </h3>
                  <div className="text-[#64748b] leading-relaxed text-[13px] tracking-widest flex flex-col gap-6 mt-4 border-l border-[#1e293b] pl-8">
                     <p dangerouslySetInnerHTML={{ __html: t.aboutP1 }}></p>
                     <p dangerouslySetInnerHTML={{ __html: t.aboutP2 }}></p>
                  </div>
               </div>

               {/* ABOUT GRID */}
               <div className="flex-1 grid grid-cols-2 gap-6 w-full">
                  <div className="bg-[#050607] border border-white/5 p-10 flex flex-col gap-4 rounded-sm hover:-translate-y-2 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#7be1ea]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <Activity size={32} className="text-[#7be1ea] group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-bold text-xl tracking-widest mt-2">{t.f1Title}</h4>
                     <p className="text-[#475569] text-xs tracking-widest leading-relaxed">{t.f1Desc}</p>
                  </div>
                  <div className="bg-[#050607] border border-white/5 p-10 flex flex-col gap-4 rounded-sm hover:-translate-y-2 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#a3e635]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <Zap size={32} className="text-[#a3e635] group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-bold text-xl tracking-widest mt-2">{t.f2Title}</h4>
                     <p className="text-[#475569] text-xs tracking-widest leading-relaxed">{t.f2Desc}</p>
                  </div>
                  <div className="bg-[#050607] border border-white/5 p-10 flex flex-col gap-4 rounded-sm hover:-translate-y-2 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#c084fc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <Globe size={32} className="text-[#c084fc] group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-bold text-xl tracking-widest mt-2">{t.f3Title}</h4>
                     <p className="text-[#475569] text-xs tracking-widest leading-relaxed">{t.f3Desc}</p>
                  </div>
                  <div className="bg-[#050607] border border-white/5 p-10 flex flex-col gap-4 rounded-sm hover:-translate-y-2 transition-transform shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <ShieldAlert size={32} className="text-[#ef4444] group-hover:scale-110 transition-transform" />
                     <h4 className="text-white font-bold text-xl tracking-widest mt-2">{t.f4Title}</h4>
                     <p className="text-[#475569] text-xs tracking-widest leading-relaxed">{t.f4Desc}</p>
                  </div>
               </div>

            </div>

         </div>
      </section>

      {/* FOOTER TICKER */}
      <div className="h-10 border-t border-white/5 bg-[#0a0a0a] flex items-center overflow-hidden shrink-0 mt-auto relative z-20">
         <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap text-[10px] tracking-[0.3em] font-bold text-[#475569] flex gap-20">
            <span className="flex items-center gap-2"><Activity size={12} className="text-[#a3e635]" /> SYSTEM NOMINAL</span>
            <span>WARNING: SOLAR FLARE ACTIVITY DETECTED IN SECTOR 4</span>
            <span className="flex items-center gap-2"><Globe size={12} className="text-[#7be1ea]" /> 1,204,992 ACTIVE SENSORS</span>
            <span>UNAUTHORIZED ACCESS ATTEMPT LOGGED @ 19:42 UTC</span>
            <span className="flex items-center gap-2"><Activity size={12} className="text-[#a3e635]" /> SYSTEM NOMINAL</span>
            <span>WARNING: SOLAR FLARE ACTIVITY DETECTED IN SECTOR 4</span>
            <span className="flex items-center gap-2"><Globe size={12} className="text-[#7be1ea]" /> 1,204,992 ACTIVE SENSORS</span>
         </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}