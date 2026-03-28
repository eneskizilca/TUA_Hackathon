"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Settings, User, LayoutGrid, Users, ShieldCheck, Activity, FileText, LogOut, Box, Server, Database, RotateCcw, MonitorPlay } from "lucide-react";

// --- TYPES FOR MOCK-FREE BACKEND INTEGRATION ---
export interface ApiNode {
  id: string; // "api-core-1"
  name: string; // "Core Telemetry"
  latency: number; // 24
  status: "ONLINE" | "DEGRADED" | "OFFLINE" | string;
  uptime: string; // "99.9%"
  rpm: number; // Requests Per Minute: 3450
  type: "database" | "server" | "stream" | string;
}

export interface ApiHealthData {
  adminName: string;
  adminLocation: string;
  globalUptime: string;
  totalEndpoints: number;
  avgLatencyMs: number;
  activeIncidents: number;
  nodes: ApiNode[];
}

export default function ApiHealthPage() {
  const [data, setData] = useState<ApiHealthData | null>(null);

  useEffect(() => {
    // --- BACKEND API FETCH LOGIC ---
    async function fetchApiHealth() {
      try {
        // const response = await fetch('/api/admin/health');
        // const result: ApiHealthData = await response.json();
        // setData(result);

        // Mocksuz Boş Başlangıç
        setData({
          adminName: "AWAITING_AUTH",
          adminLocation: "--.---- N, --.---- E",
          globalUptime: "0.00%",
          totalEndpoints: 0,
          avgLatencyMs: 0,
          activeIncidents: 0,
          nodes: [] // Datalar buraya gelecek
        });
      } catch (error) {
        console.error("Failed to fetch API Health data", error);
      }
    }
    fetchApiHealth();
  }, []);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "database": return <Database size={20} className="text-[#a3e635]" />;
      case "stream": return <MonitorPlay size={20} className="text-[#c084fc]" />;
      default: return <Server size={20} className="text-[#7be1ea]" />;
    }
  };

  if (!data) return (
    <div className="min-h-screen bg-[#050607] text-[#7be1ea] font-mono flex flex-col items-center justify-center gap-4 text-sm tracking-[0.3em] font-bold uppercase">
      <div className="w-8 h-8 border-4 border-[#7be1ea] border-t-transparent rounded-full animate-spin" />
      ESTABLISHING SECURE HANDSHAKE...
    </div>
  );

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
          <Link href="/dashboard/settings"><Settings size={18} className="hover:text-white cursor-pointer transition-colors" /></Link>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
            <User size={16} className="text-white/60" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* LEFT NAV SIDEBAR (Matched to System Summary) */}
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
              <Link href="/dashboard/admin/api-health" className="bg-[#15171b] border-l-[3px] border-[#7be1ea] px-6 py-4 flex items-center gap-4 text-[#7be1ea] cursor-pointer group">
                 <Activity size={18} />
                 <span className="font-bold tracking-[0.15em] text-[11px] uppercase">API Health</span>
              </Link>
           </div>

           <div className="px-6 flex flex-col gap-2">
              <Link href="/dashboard/admin/report" className="w-full bg-[#7be1ea] text-black font-extrabold text-[10px] tracking-[0.2em] py-4 mb-4 rounded-sm hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(123,225,234,0.3)] transition-all uppercase flex justify-center items-center">
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
        <section className="flex-1 flex flex-col px-10 py-10 gap-8 bg-[#0a0a0a] overflow-y-auto relative">
           
           {/* HEADER */}
           <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                 <h2 className="text-white font-black text-4xl font-sans tracking-tight uppercase">API HEALTH MATRIX</h2>
                 <p className="text-[#a3e635] text-[10px] font-mono tracking-[0.2em] uppercase mt-1">CORE INFRASTRUCTURE NETWORKING</p>
              </div>
              <button className="border border-white/10 bg-[#15171b] px-6 py-3 rounded-sm flex items-center gap-3 hover:bg-white/5 transition-colors">
                 <RotateCcw size={14} className="text-[#7be1ea]" />
                 <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">FORCE SYNC</span>
              </button>
           </div>

           {/* TOP STATS */}
           <div className="grid grid-cols-4 gap-6">
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-t-[3px] border-t-[#a3e635]">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">GLOBAL UPTIME</div>
                 <span className="text-[#a3e635] text-4xl font-black font-sans tracking-wide">{data.globalUptime}</span>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-t-[3px] border-t-[#7be1ea]">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">SYSTEM ENDPOINTS</div>
                 <span className="text-[#7be1ea] text-4xl font-black font-sans tracking-wide">{data.totalEndpoints}</span>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-t-[3px] border-t-[#c084fc]">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">AVG LATENCY</div>
                 <span className="text-[#c084fc] text-4xl font-black font-sans tracking-wide">{data.avgLatencyMs}<span className="text-lg text-[#64748b] ml-1">ms</span></span>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-t-[3px] border-t-white/10">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">ACTIVE INCIDENTS</div>
                 <span className={`text-4xl font-black font-sans tracking-wide ${data.activeIncidents > 0 ? "text-[#ef4444]" : "text-white/20"}`}>
                    {data.activeIncidents}
                 </span>
              </div>
           </div>

           {/* MICROSERVICES GRID */}
           <div className="flex-1">
              <h3 className="text-white text-xs font-bold tracking-[0.3em] uppercase mb-6 border-b border-white/5 pb-2">SERVICE ENDPOINTS</h3>
              
              {data.nodes.length > 0 ? (
                 <div className="grid grid-cols-2 gap-6">
                    {data.nodes.map((node, i) => (
                       <div key={i} className="bg-[#15171b] border border-white/5 p-6 rounded-sm shadow-md hover:border-white/10 transition-colors flex flex-col justify-between h-48 group">
                          
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-black/40 rounded-sm border border-white/5">
                                   {getTypeIcon(node.type)}
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-white font-sans font-bold text-sm tracking-widest">{node.name}</span>
                                   <span className="text-[#64748b] text-[9px] font-mono tracking-widest uppercase">{node.id}</span>
                                </div>
                             </div>
                             <div className={`flex items-center gap-2 px-3 py-1 border rounded-sm text-[9px] font-bold tracking-widest uppercase ${
                                node.status === 'ONLINE' ? 'bg-[#a3e635]/10 border-[#a3e635]/30 text-[#a3e635]' : 
                                node.status === 'DEGRADED' ? 'bg-[#eab308]/10 border-[#eab308]/30 text-[#eab308]' : 
                                'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'
                             }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'ONLINE' ? 'bg-[#a3e635] animate-pulse' : node.status === 'DEGRADED' ? 'bg-[#eab308]' : 'bg-[#ef4444]'}`} />
                                {node.status}
                             </div>
                          </div>

                          <div className="flex justify-between items-end">
                             <div className="flex items-end gap-6">
                                <div className="flex flex-col">
                                   <span className="text-[#475569] text-[8px] tracking-widest uppercase font-bold mb-1">LATENCY</span>
                                   <span className="text-white font-mono text-lg">{node.latency}<span className="text-[10px] text-[#64748b] ml-1">ms</span></span>
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[#475569] text-[8px] tracking-widest uppercase font-bold mb-1">TRAFFIC</span>
                                   <span className="text-[#7be1ea] font-mono text-lg">{node.rpm.toLocaleString()}<span className="text-[10px] text-[#64748b] ml-1">rpm</span></span>
                                </div>
                             </div>
                             
                             {/* FAKE MINI GRAPH */}
                             <div className="flex items-end gap-1 h-8 opacity-50 group-hover:opacity-100 transition-opacity">
                                {[40, 60, 30, 80, 50, 90, 40, 70, 100, 60].map((h, k) => (
                                   <div key={k} className={`w-1.5 bg-gradient-to-t ${node.status === 'ONLINE' ? 'from-[#7be1ea]/20 to-[#7be1ea]' : 'from-[#ef4444]/20 to-[#ef4444]'} rounded-t-sm`} style={{ height: `${h}%` }} />
                                ))}
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-sm gap-4">
                    <Activity size={48} className="text-[#1e293b]" />
                    <span className="text-[#475569] text-xs font-bold tracking-[0.3em] uppercase">AWAITING TELEMETRY SYNC / NO NODES DETECTED</span>
                 </div>
              )}
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
