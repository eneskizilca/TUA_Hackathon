"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Settings, User, LayoutGrid, Users, ShieldCheck, Activity, FileText, LogOut, Server, Database, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { fetchAPIHealth, type APIHealthStatus } from "@/lib/api/admin";

export default function ApiHealthPage() {
  const [healthData, setHealthData] = useState<APIHealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadHealthData();
    const interval = setInterval(loadHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadHealthData() {
    try {
      const data = await fetchAPIHealth();
      setHealthData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Failed to fetch API health", error);
    } finally {
      setLoading(false);
    }
  }

  const calculateGlobalUptime = () => {
    if (!healthData) return "0.00%";
    const noaaHealthy = healthData.noaa_swpc.status === 'healthy' ? 1 : 0;
    const nasaHealthy = healthData.nasa_donki.status === 'healthy' ? 1 : 0;
    return `${((noaaHealthy + nasaHealthy) / 2 * 100).toFixed(1)}%`;
  };

  const calculateAvgLatency = () => {
    if (!healthData) return 0;
    return Math.round((healthData.noaa_swpc.latency_ms + healthData.nasa_donki.latency_ms) / 2);
  };

  const countActiveIncidents = () => {
    if (!healthData) return 0;
    let incidents = 0;
    if (healthData.noaa_swpc.status === 'down') incidents++;
    if (healthData.nasa_donki.status === 'down') incidents++;
    return incidents;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050607] text-[#7be1ea] font-mono flex flex-col items-center justify-center gap-4 text-sm tracking-[0.3em] font-bold uppercase">
      <div className="w-8 h-8 border-4 border-[#7be1ea] border-t-transparent rounded-full animate-spin" />
      ESTABLISHING SECURE HANDSHAKE...
    </div>
  );

  const globalUptime = calculateGlobalUptime();
  const avgLatency = calculateAvgLatency();
  const activeIncidents = countActiveIncidents();
  const totalEndpoints = healthData ? 6 : 0;

  return (
    <div className="min-h-screen bg-[#050607] text-[#64748b] font-mono flex flex-col overflow-hidden">
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

        <section className="flex-1 flex flex-col px-10 py-10 gap-8 bg-[#0a0a0a] overflow-y-auto relative">
           <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                 <h2 className="text-white font-black text-4xl font-sans tracking-tight uppercase">API HEALTH MATRIX</h2>
                 <p className="text-[#a3e635] text-[10px] font-mono tracking-[0.2em] uppercase mt-1">CORE INFRASTRUCTURE NETWORKING</p>
                 <p className="text-[#64748b] text-[9px] font-mono tracking-wider mt-2">Last Update: {lastUpdate.toLocaleTimeString()}</p>
              </div>
              <button 
                onClick={loadHealthData}
                className="border border-white/10 bg-[#15171b] px-6 py-3 rounded-sm flex items-center gap-3 hover:bg-white/5 transition-colors"
              >
                 <RotateCcw size={14} className="text-[#7be1ea]" />
                 <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">FORCE SYNC</span>
              </button>
           </div>

           <div className="grid grid-cols-4 gap-6">
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-t-[3px] border-t-[#a3e635]">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">GLOBAL UPTIME</div>
                 <span className="text-[#a3e635] text-4xl font-black font-sans tracking-wide">{globalUptime}</span>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-t-[3px] border-t-[#7be1ea]">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">SYSTEM ENDPOINTS</div>
                 <span className="text-[#7be1ea] text-4xl font-black font-sans tracking-wide">{totalEndpoints}</span>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-t-[3px] border-t-[#c084fc]">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">AVG LATENCY</div>
                 <span className="text-[#c084fc] text-4xl font-black font-sans tracking-wide">{avgLatency}<span className="text-lg text-[#64748b] ml-1">ms</span></span>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-t-[3px] border-t-white/10">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">ACTIVE INCIDENTS</div>
                 <span className={`text-4xl font-black font-sans tracking-wide ${activeIncidents > 0 ? "text-[#ef4444]" : "text-white/20"}`}>
                    {activeIncidents}
                 </span>
              </div>
           </div>

           <div className="flex-1">
              <h3 className="text-white text-xs font-bold tracking-[0.3em] uppercase mb-6 border-b border-white/5 pb-2">EXTERNAL API SERVICES</h3>
              
              {healthData ? (
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-[#15171b] border border-white/5 p-6 rounded-sm shadow-md hover:border-white/10 transition-colors flex flex-col justify-between h-64 group">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-black/40 rounded-sm border border-white/5">
                                <Server size={20} className="text-[#7be1ea]" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-white font-sans font-bold text-sm tracking-widest">NOAA SWPC</span>
                                <span className="text-[#64748b] text-[9px] font-mono tracking-widest uppercase">REAL-TIME SOLAR WIND</span>
                             </div>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 border rounded-sm text-[9px] font-bold tracking-widest uppercase ${
                             healthData.noaa_swpc.status === 'healthy' ? 'bg-[#a3e635]/10 border-[#a3e635]/30 text-[#a3e635]' : 
                             healthData.noaa_swpc.status === 'degraded' ? 'bg-[#eab308]/10 border-[#eab308]/30 text-[#eab308]' : 
                             'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'
                          }`}>
                             {healthData.noaa_swpc.status === 'healthy' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                             {healthData.noaa_swpc.status.toUpperCase()}
                          </div>
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-[#64748b] uppercase tracking-wider">Plasma Data</span>
                             {healthData.noaa_swpc.endpoints.plasma ? 
                               <CheckCircle2 size={16} className="text-[#a3e635]" /> : 
                               <XCircle size={16} className="text-[#ef4444]" />
                             }
                          </div>
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-[#64748b] uppercase tracking-wider">Magnetic Field</span>
                             {healthData.noaa_swpc.endpoints.mag ? 
                               <CheckCircle2 size={16} className="text-[#a3e635]" /> : 
                               <XCircle size={16} className="text-[#ef4444]" />
                             }
                          </div>
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-[#64748b] uppercase tracking-wider">Kp Index</span>
                             {healthData.noaa_swpc.endpoints.kp_index ? 
                               <CheckCircle2 size={16} className="text-[#a3e635]" /> : 
                               <XCircle size={16} className="text-[#ef4444]" />
                             }
                          </div>
                       </div>

                       <div className="flex justify-between items-end pt-4 border-t border-white/5">
                          <div className="flex flex-col">
                             <span className="text-[#475569] text-[8px] tracking-widest uppercase font-bold mb-1">LATENCY</span>
                             <span className="text-white font-mono text-lg">{healthData.noaa_swpc.latency_ms}<span className="text-[10px] text-[#64748b] ml-1">ms</span></span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-[#15171b] border border-white/5 p-6 rounded-sm shadow-md hover:border-white/10 transition-colors flex flex-col justify-between h-64 group">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-black/40 rounded-sm border border-white/5">
                                <Database size={20} className="text-[#a3e635]" />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-white font-sans font-bold text-sm tracking-widest">NASA DONKI</span>
                                <span className="text-[#64748b] text-[9px] font-mono tracking-widest uppercase">FORECAST & EVENTS</span>
                             </div>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 border rounded-sm text-[9px] font-bold tracking-widest uppercase ${
                             healthData.nasa_donki.status === 'healthy' ? 'bg-[#a3e635]/10 border-[#a3e635]/30 text-[#a3e635]' : 
                             healthData.nasa_donki.status === 'degraded' ? 'bg-[#eab308]/10 border-[#eab308]/30 text-[#eab308]' : 
                             'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'
                          }`}>
                             {healthData.nasa_donki.status === 'healthy' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                             {healthData.nasa_donki.status.toUpperCase()}
                          </div>
                       </div>

                       <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-[#64748b] uppercase tracking-wider">CME Events</span>
                             {healthData.nasa_donki.endpoints.cme ? 
                               <CheckCircle2 size={16} className="text-[#a3e635]" /> : 
                               <XCircle size={16} className="text-[#ef4444]" />
                             }
                          </div>
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-[#64748b] uppercase tracking-wider">Solar Flares</span>
                             {healthData.nasa_donki.endpoints.flare ? 
                               <CheckCircle2 size={16} className="text-[#a3e635]" /> : 
                               <XCircle size={16} className="text-[#ef4444]" />
                             }
                          </div>
                       </div>

                       <div className="flex justify-between items-end pt-4 border-t border-white/5">
                          <div className="flex flex-col">
                             <span className="text-[#475569] text-[8px] tracking-widest uppercase font-bold mb-1">LATENCY</span>
                             <span className="text-white font-mono text-lg">{healthData.nasa_donki.latency_ms}<span className="text-[10px] text-[#64748b] ml-1">ms</span></span>
                          </div>
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-sm gap-4">
                    <Activity size={48} className="text-[#1e293b]" />
                    <span className="text-[#475569] text-xs font-bold tracking-[0.3em] uppercase">AWAITING TELEMETRY SYNC</span>
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
