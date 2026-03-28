"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Settings, User, LayoutGrid, Users, ShieldCheck, Activity, FileText, LogOut, CheckSquare, Download, TerminalSquare } from "lucide-react";

export default function GenerateReportPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startGeneration = () => {
    setGenerating(true);
    setLogs(["[SYSTEM] Auth Token Verified.", "[OK] Encrypted channel established.", "[WARN] Pulling operator matrix...", "[OK] 1.4GB data cached."]);
    // Simulate fake compilation sequence
    let p = 0;
    const interval = setInterval(() => {
       p += Math.floor(Math.random() * 15) + 5;
       if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setLogs(prev => [...prev, "[OK] Compiling raw bytes to payload...", "[SUCCESS] Report compilation complete. Protocol encrypted.", "[INFO] Ready for download."]);
       }
       setProgress(p);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#050607] text-[#64748b] font-mono flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0a0b0d] z-50">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <Image src="/astrologo.gif" alt="Logo" width={32} height={32} className="mix-blend-screen" unoptimized />
            <span className="text-white font-bold text-xl tracking-[0.2em] font-sans">Orbital Sense</span>
            <span className="text-[#3a8a92] text-[10px] tracking-[0.1em] ml-2 hidden sm:block uppercase">Beyond the atmosphere. Predicting the anomaly.</span>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[#475569]">
          <Bell size={18} className="hover:text-white cursor-pointer transition-colors" />
          <Settings size={18} className="hover:text-white cursor-pointer transition-colors" />
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
            <User size={16} className="text-white/60" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* LEFT NAV SIDEBAR - UNIFIED */}
        <aside className="w-[280px] bg-[#0c0d0f] border-r border-[#1e293b] flex flex-col py-8 shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-20">
           <div className="px-6 mb-8 flex items-center gap-4">
              <div className="w-10 h-10 bg-[#15171b] border border-white/10 rounded-sm flex items-center justify-center text-[#7be1ea]">
                 <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[#a3e635] font-bold text-[10px] tracking-widest uppercase">SUPER_ADMIN</span>
                 <span className="text-[#64748b] text-[9px] tracking-[0.1em] font-mono mt-0.5">79.0352° N, 12.1234° E</span>
              </div>
           </div>

           <div className="flex flex-col flex-1">
              <Link href="/dashboard/admin" className="px-6 py-4 flex items-center gap-4 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                 <LayoutGrid size={18} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-[11px] group-hover:text-white transition-colors uppercase">System Summary</span>
              </Link>
              <Link href="/dashboard/admin/users" className="px-6 py-4 flex items-center gap-4 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                 <Users size={18} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-[11px] group-hover:text-white transition-colors uppercase">User Management</span>
              </Link>
              <Link href="/dashboard/admin/pro-requests" className="px-6 py-4 flex items-center gap-4 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                 <ShieldCheck size={18} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-[11px] group-hover:text-white transition-colors uppercase">Pro Requests</span>
              </Link>
              <Link href="/dashboard/admin/api-health" className="px-6 py-4 flex items-center gap-4 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                 <Activity size={18} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-[11px] group-hover:text-white transition-colors uppercase">API Health</span>
              </Link>
           </div>

           <div className="px-6 flex flex-col gap-2">
              <Link href="/dashboard/admin/report" className="bg-[#15171b] border border-white/10 w-full text-white font-extrabold text-[10px] tracking-[0.2em] py-4 mb-4 rounded-sm transition-all uppercase flex justify-center items-center shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                 GENERATE REPORT
              </Link>
              <div className="py-3 flex items-center gap-4 text-[#64748b] hover:text-white cursor-pointer transition-colors group">
                 <FileText size={16} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-[11px] uppercase">Logs</span>
              </div>
              <Link href="/auth/login" className="py-3 flex items-center gap-4 text-[#64748b] hover:text-white cursor-pointer transition-colors group">
                 <LogOut size={16} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-[11px] uppercase">Logout</span>
              </Link>
           </div>
        </aside>

        {/* CENTER CONTENT */}
        <section className="flex-1 flex px-10 py-10 gap-10 bg-[#0a0a0a] overflow-hidden">
           
           {/* LEFT CONFIG */}
           <div className="w-[500px] flex flex-col gap-8 shrink-0 overflow-y-auto pr-4 scrollbar-hide">
              <div>
                 <h2 className="text-white font-black text-3xl font-sans tracking-tight uppercase">DATA COMPILATION</h2>
                 <p className="text-[#64748b] text-[10px] font-mono tracking-[0.2em] uppercase mt-2">CONFIGURING THE KNOWLEDGE PAYLOAD</p>
              </div>

              {/* CHECKBOXES */}
              <div className="bg-[#111318] p-6 border border-white/5 rounded-sm flex flex-col gap-6">
                 <h3 className="text-white text-xs font-bold tracking-widest border-b border-white/10 pb-4">MODULES TO INCLUDE:</h3>
                 
                 {[
                    { label: "TELEMETRY ARCHIVE", desc: "Raw sensor arrays and signal bounces" },
                    { label: "USER OPS LOGS", desc: "Operator queries, logins, auth endpoints" },
                    { label: "API PERFORMANCE", desc: "Latency anomalies and node crashes" },
                    { label: "PRO REGISTRATIONS", desc: "Approved/Denied facility applications" }
                 ].map((mod, i) => (
                    <label key={i} className="flex gap-4 cursor-pointer group">
                       <div className="w-5 h-5 mt-1 border border-white/20 bg-black flex items-center justify-center shrink-0 group-hover:border-[#7be1ea] transition-colors">
                          <CheckSquare size={14} className="text-[#a3e635]" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-white tracking-widest">{mod.label}</span>
                          <span className="text-[10px] text-[#64748b] mt-0.5">{mod.desc}</span>
                       </div>
                    </label>
                 ))}
              </div>

              {/* FORMAT */}
              <div className="grid grid-cols-3 gap-4">
                 {["RAW JSON", "PDF", "CSV"].map((fmt, i) => (
                    <div key={i} className={`p-4 border ${i===1?'border-[#7be1ea] bg-[#7be1ea]/10 text-[#7be1ea]':'border-white/5 bg-[#111318] hover:bg-white/5'} text-center text-xs font-bold tracking-widest cursor-pointer rounded-sm transition-colors`}>
                       {fmt}
                    </div>
                 ))}
              </div>

              <div>
              <button 
                onClick={startGeneration} 
                disabled={generating}
                className={`w-full py-5 text-black font-extrabold text-[11px] tracking-[0.3em] rounded-sm flex justify-center items-center gap-3 transition-colors ${generating ? 'bg-[#475569] cursor-not-allowed text-white/50' : 'bg-[#7be1ea] hover:bg-white cursor-pointer shadow-[0_4px_20px_rgba(123,225,234,0.3)]'}`}
              >
                 <Download size={18} />
                 {generating && progress < 100 ? "COMPILING..." : progress === 100 ? "DOWNLOAD SECURE PAYLOAD" : "EXECUTE COMPILATION"}
              </button>

              {generating && (
                 <div className="w-full h-1 bg-[#1e293b] mt-4 relative overflow-hidden rounded-full">
                    <div className="h-full bg-[#a3e635] absolute top-0 left-0 transition-all duration-300" style={{ width: `${progress}%` }} />
                 </div>
              )}
              </div>
           </div>

           {/* RIGHT TERMINAL LOGS */}
           <div className="flex-1 bg-[#050607] border border-white/5 p-6 rounded-sm font-mono text-[11px] tracking-widest flex flex-col">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4 text-[#475569]">
                 <TerminalSquare size={18} />
                 <span className="uppercase font-bold pt-1 text-[#64748b]">ORBITAL OS TERMINAL // COMPILE THREAD</span>
              </div>
              
              <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                 <div className="text-[#475569]">Awaiting compilation instruction...</div>
                 {logs.map((log, i) => (
                    <div key={i} className={`
                       ${log.includes('[OK]') ? 'text-[#a3e635]' : 
                         log.includes('[WARN]') ? 'text-[#eab308]' : 
                         log.includes('[INFO]') ? 'text-[#c084fc] font-bold' : 
                         log.includes('[SUCCESS]') ? 'text-[#7be1ea] font-black' : 'text-white/50'}
                    `}>{log}</div>
                 ))}
                 
                 {generating && progress < 100 && (
                    <div className="text-[#64748b] animate-pulse">_</div>
                 )}
              </div>
           </div>

        </section>
      </main>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
