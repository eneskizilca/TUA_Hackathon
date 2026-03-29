"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Settings, User, LayoutGrid, Users, ShieldAlert, Activity, FileText, LogOut, TerminalSquare, AlertCircle, AlertTriangle, ShieldCheck, Box } from "lucide-react";
import { fetchDashboardData } from "@/lib/api/space-weather";
import type { DashboardData as SpaceWeatherData } from "@/types/space-weather";
import ProtectedRoute from "@/components/ProtectedRoute";

// --- TYPES FOR MOCK-FREE BACKEND INTEGRATION ---
export interface AdminMetrics {
  totalUsers: number;
  totalUsersGrowth: string;
  activeOperators: number;
  globalKpIndex: number;
  kpStatus: string;
  uptime: string;
  uptimeDays: string;
}

export interface NodeDistribution {
  polar: number;
  equatorial: number;
  deepSpace: number;
}

export interface SystemHealth {
  cpuLoad: number;
  latency: number;
  throughput: number;
  storage: number;
  heartbeatStatus: string;
  syncId: string;
}

export interface AlertLog {
  time: string;
  type: string;
  msg: string;
  statusText: string;
  statusSub: string;
  statusType: "cyan" | "purple" | "red" | "gray";
}

export interface AdminData {
  adminName: string;
  adminLocation: string;
  metrics: AdminMetrics;
  distribution: NodeDistribution;
  health: SystemHealth;
  logs: AlertLog[];
}

// Helper functions
function calculateUptime(): { uptime: string; days: string } {
  // Mock uptime calculation - in production this would come from server start time
  const uptime = 99.987;
  const days = 127;
  return {
    uptime: `${uptime.toFixed(3)}%`,
    days: `${days}D`
  };
}

function generateSystemLogs(spaceWeatherData: SpaceWeatherData): AlertLog[] {
  const logs: AlertLog[] = [];
  const now = new Date();
  
  // Add threat-based logs
  spaceWeatherData.threats.active_threats.forEach((threat, index) => {
    const time = new Date(now.getTime() - index * 180000).toISOString().substr(11, 8);
    let type = "SYSTEM_WARN";
    let msg = "";
    let statusText = "";
    let statusSub = "";
    let statusType: "cyan" | "purple" | "red" | "gray" = "cyan";
    
    switch (threat) {
      case "SHIELD_BREACH":
        type = "CRITICAL_ERR";
        msg = "Magnetosphere breach detected - All satellite operators notified";
        statusText = "ALERT DISPATCHED";
        statusSub = "12 operators notified";
        statusType = "red";
        break;
      case "GEOMAGNETIC_STORM":
        type = "SYSTEM_WARN";
        msg = "Geomagnetic storm conditions - Power grid assets on standby";
        statusText = "MONITORING ACTIVE";
        statusSub = "3 transformers flagged";
        statusType = "purple";
        break;
      case "INCOMING_CME":
        type = "SYSTEM_WARN";
        msg = `CME detected at ${spaceWeatherData.forecasts.cme_forecasts[0]?.speed_kmps.toFixed(0)} km/s - Impact forecast in 24-72h`;
        statusText = "FORECAST ISSUED";
        statusSub = "All users alerted";
        statusType = "purple";
        break;
      case "RADIATION_STORM":
        type = "CRITICAL_ERR";
        msg = "X-class solar flare detected - Aviation routes updated";
        statusText = "PROTOCOLS ACTIVE";
        statusSub = "Flight paths adjusted";
        statusType = "red";
        break;
    }
    
    if (msg) {
      logs.push({ time, type, msg, statusText, statusSub, statusType });
    }
  });
  
  // Add system operational logs
  logs.push({
    time: new Date(now.getTime() - logs.length * 180000).toISOString().substr(11, 8),
    type: "ACCESS_AUTH",
    msg: "New operator session initiated from Istanbul datacenter",
    statusText: "AUTH_SUCCESS",
    statusSub: "Session ID: OP-4729",
    statusType: "cyan"
  });
  
  logs.push({
    time: new Date(now.getTime() - (logs.length + 1) * 180000).toISOString().substr(11, 8),
    type: "SYSTEM_INFO",
    msg: `Space weather data sync completed - ${spaceWeatherData.forecasts.cme_forecasts.length} CME events processed`,
    statusText: "SYNC_COMPLETE",
    statusSub: "NASA DONKI API",
    statusType: "cyan"
  });
  
  logs.push({
    time: new Date(now.getTime() - (logs.length + 2) * 180000).toISOString().substr(11, 8),
    type: "SYSTEM_INFO",
    msg: `Kp index updated: ${spaceWeatherData.current_conditions.kp_index.kp_value.toFixed(1)} (${spaceWeatherData.current_conditions.kp_index.status})`,
    statusText: "DATA_UPDATED",
    statusSub: "NOAA SWPC",
    statusType: "cyan"
  });
  
  return logs;
}

function calculateSystemHealth(spaceWeatherData: SpaceWeatherData): SystemHealth {
  // Calculate based on threat level and data freshness
  const threatScore = spaceWeatherData.threats.composite_score;
  const cpuLoad = Math.min(95, 35 + (threatScore / 100) * 40); // Higher threats = more processing
  const latency = spaceWeatherData.cache_age_seconds ? Math.min(150, spaceWeatherData.cache_age_seconds * 2) : 45;
  
  return {
    cpuLoad: Math.round(cpuLoad),
    latency: Math.round(latency),
    throughput: 8.4,
    storage: 2.7,
    heartbeatStatus: "ACTIVE",
    syncId: `SYN-${Date.now().toString().slice(-6)}`
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const spaceWeatherData = await fetchDashboardData();
        const uptimeData = calculateUptime();
        
        setData({
          adminName: "ADMIN_PRIME",
          adminLocation: "41.0082° N, 28.9784° E",
          metrics: {
            totalUsers: 247,
            totalUsersGrowth: "+12.3%",
            activeOperators: 18,
            globalKpIndex: spaceWeatherData.current_conditions.kp_index.kp_value,
            kpStatus: spaceWeatherData.current_conditions.kp_index.status,
            uptime: uptimeData.uptime,
            uptimeDays: uptimeData.days
          },
          distribution: {
            polar: spaceWeatherData.assets.safe_count + spaceWeatherData.assets.caution_count,
            equatorial: spaceWeatherData.assets.critical_count + 8,
            deepSpace: 3
          },
          health: calculateSystemHealth(spaceWeatherData),
          logs: generateSystemLogs(spaceWeatherData)
        });
      } catch (error) {
        console.error("Failed to load admin summary", error);
        // Fallback data
        setData({
          adminName: "AWAITING_AUTH",
          adminLocation: "--.---- N, --.---- E",
          metrics: {
            totalUsers: 0,
            totalUsersGrowth: "+0.0%",
            activeOperators: 0,
            globalKpIndex: 0.00,
            kpStatus: "UNKNOWN",
            uptime: "0.000%",
            uptimeDays: "0D"
          },
          distribution: {
            polar: 0,
            equatorial: 0,
            deepSpace: 0
          },
          health: {
            cpuLoad: 0,
            latency: 0,
            throughput: 0,
            storage: 0,
            heartbeatStatus: "AWAITING",
            syncId: "---"
          },
          logs: []
        });
      }
    }
    
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-[#050607] text-[#7be1ea] font-mono flex flex-col items-center justify-center gap-4 text-sm tracking-[0.3em] font-bold uppercase">
      <div className="w-8 h-8 border-4 border-[#7be1ea] border-t-transparent rounded-full animate-spin" />
      AUTHORIZING ADMIN ACCESS...
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
    <div className="min-h-screen bg-[#050607] text-[#64748b] font-mono flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0a0b0d] z-50">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <Image src="/astrologo.gif" alt="Logo" width={32} height={32} className="mix-blend-screen" unoptimized />
            <span className="text-white font-bold text-xl tracking-[0.2em] font-sans uppercase">ORBITAL SENSE</span>
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
        {/* LEFT NAV SIDEBAR */}
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
              <Link href="/dashboard/admin" className="bg-[#15171b] border-l-[3px] border-[#7be1ea] px-6 py-4 flex items-center gap-4 text-[#7be1ea] cursor-pointer group">
                 <LayoutGrid size={18} />
                 <span className="font-bold tracking-[0.15em] text-[11px] uppercase">System Summary</span>
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
        <section className="flex-1 flex flex-col px-10 py-10 gap-6 overflow-y-auto bg-[#0a0a0a]">
           
           {/* TITLE HEADER */}
           <div className="mb-2">
              <h2 className="text-white font-bold text-3xl font-sans tracking-widest uppercase truncate mb-1">SYSTEM_SUMMARY_CORE</h2>
              <p className="text-[#64748b] text-[10px] uppercase font-mono tracking-[0.2em]">REAL-TIME ORBITAL TELEMETRY & ASSET DISTRIBUTION</p>
           </div>

           {/* STATS ROW */}
           <div className="grid grid-cols-4 gap-6">
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-md">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4">TOTAL USERS</div>
                 <div className="flex items-end gap-2">
                    <span className="text-[#7be1ea] text-4xl font-black font-sans tracking-wide">{data.metrics.totalUsers.toLocaleString()}</span>
                    <span className="text-[#a3e635] text-[10px] font-bold mb-1.5">{data.metrics.totalUsersGrowth}</span>
                 </div>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-md">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4">ACTIVE OPERATORS</div>
                 <div className="flex items-end justify-between">
                    <span className="text-[#7be1ea] text-4xl font-black font-sans tracking-wide">{data.metrics.activeOperators.toLocaleString()}</span>
                    <div className="flex items-center gap-1.5 text-[#a3e635] font-bold text-[10px] mb-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
                       LIVE
                    </div>
                 </div>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-md">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4">GLOBAL KP-INDEX</div>
                 <div className="flex items-end justify-between">
                    <span className="text-[#c084fc] text-4xl font-black font-sans tracking-wide">{data.metrics.globalKpIndex.toFixed(2)}</span>
                    <span className="text-[#64748b] text-[10px] font-bold mb-1.5">{data.metrics.kpStatus}</span>
                 </div>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-md">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4">SYSTEM UPTIME</div>
                 <div className="flex items-end justify-between">
                    <span className="text-[#a3e635] text-4xl font-black font-sans tracking-wide">{data.metrics.uptime}</span>
                    <span className="text-[#64748b] text-[10px] font-bold mb-1.5">{data.metrics.uptimeDays}</span>
                 </div>
              </div>
           </div>

           {/* MIDDLE ROW */}
           <div className="flex gap-6 min-h-[400px]">
              
              {/* GLOBE AREA */}
              <div className="flex-[2] bg-[#111318] border border-white/5 p-8 rounded-sm shadow-md relative overflow-hidden flex flex-col justify-between">
                
                {/* DÜNYA ARKA PLANI (Gösterişli ve Renkli - Tasarım İsteği) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-80 mix-blend-screen pointer-events-none mt-10">
                   <div className="w-[500px] h-[500px] rounded-full relative">
                      {/* Renkli Dünya Görseli */}
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center rounded-full saturate-150 contrast-125 brightness-75" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050607]/90 via-transparent to-black/40 rounded-full" />
                      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] rounded-full" />
                   </div>
                </div>

                 <div className="flex justify-between items-start relative z-10 w-full">
                    <div>
                       <h3 className="text-white font-bold text-lg font-sans tracking-wider">SENTINEL DISTRIBUTION</h3>
                       <p className="text-[#64748b] text-[9px] tracking-[0.2em] mt-1 uppercase">ASSET_LOCATOR_v4.2</p>
                    </div>
                    <div className="flex gap-3 text-[9px] font-bold uppercase tracking-widest">
                       <span className="border border-[#7be1ea]/50 text-[#7be1ea] px-3 py-1 bg-[#1e293b]/20">LIVE_TELEMETRY</span>
                       <span className="border border-[#a3e635]/50 text-[#a3e635] px-3 py-1 bg-[#1e293b]/20">ORBITAL_SYNC_OK</span>
                    </div>
                 </div>

                 <div className="flex gap-16 relative z-10 mt-auto pt-20">
                    <div className="flex flex-col gap-1">
                       <span className="text-[#64748b] text-[10px] font-bold tracking-[0.2em]">POLAR NODES</span>
                       <span className="text-[#7be1ea] text-3xl font-sans font-bold">{data.distribution.polar.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[#64748b] text-[10px] font-bold tracking-[0.2em]">EQUATORIAL</span>
                       <span className="text-[#7be1ea] text-3xl font-sans font-bold">{data.distribution.equatorial.toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[#64748b] text-[10px] font-bold tracking-[0.2em]">DEEP SPACE</span>
                       <span className="text-[#c084fc] text-3xl font-sans font-bold">{data.distribution.deepSpace.toString().padStart(2, '0')}</span>
                    </div>
                 </div>
              </div>

              {/* SYSTEM HEALTH */}
              <div className="flex-1 bg-[#111318] border border-white/5 p-8 rounded-sm shadow-md flex flex-col justify-between">
                 <div className="flex justify-between items-center mb-10">
                    <h3 className="text-white font-bold text-lg font-sans tracking-wider uppercase">SYSTEM HEALTH</h3>
                    <Activity size={20} className="text-[#a3e635]" />
                 </div>

                 <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2 w-full">
                       <div className="flex justify-between items-end font-bold text-[10px] tracking-widest uppercase">
                          <span className="text-[#64748b]">CPU_LOAD_GLOBAL</span>
                          <span className="text-[#7be1ea] text-sm">{data.health.cpuLoad}%</span>
                       </div>
                       <div className="w-full h-1 bg-[#1e293b]">
                          <div className="h-full bg-[#7be1ea] shadow-[0_0_8px_#7be1ea]" style={{ width: `${data.health.cpuLoad}%` }} />
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full">
                       <div className="flex justify-between items-end font-bold text-[10px] tracking-widest uppercase">
                          <span className="text-[#64748b]">SIGNAL_LATENCY</span>
                          <span className="text-[#a3e635] text-sm">{data.health.latency}MS</span>
                       </div>
                       <div className="w-full h-1 bg-[#1e293b]">
                          <div className="h-full bg-[#a3e635] shadow-[0_0_8px_#a3e635]" style={{ width: '15%' }} />
                       </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                       <div className="flex justify-between items-end font-bold text-[10px] tracking-widest uppercase">
                          <span className="text-[#64748b]">DATA_THROUGHPUT</span>
                          <span className="text-[#7be1ea] text-sm">{data.health.throughput} TB/S</span>
                       </div>
                       <div className="w-full h-1 bg-[#1e293b]">
                          <div className="h-full bg-[#7be1ea] shadow-[0_0_8px_#7be1ea]" style={{ width: '84%' }} />
                       </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                       <div className="flex justify-between items-end font-bold text-[10px] tracking-widest uppercase">
                          <span className="text-[#64748b]">STORAGE_CAPACITY</span>
                          <span className="text-[#c084fc] text-sm">{data.health.storage} EB</span>
                       </div>
                       <div className="w-full h-1 bg-[#1e293b]">
                          <div className="h-full bg-[#c084fc] shadow-[0_0_8px_#c084fc]" style={{ width: '60%' }} />
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 bg-black/50 p-4 border border-white/5 rounded-sm flex items-center gap-4">
                    <div className="w-3 h-3 bg-[#a3e635] shadow-[0_0_10px_#a3e635] rounded-sm animate-pulse" />
                    <div className="flex flex-col gap-0.5">
                       <span className="text-[#a3e635] text-[11px] font-bold tracking-[0.2em] uppercase">HEARTBEAT ACTIVE</span>
                       <span className="text-[#64748b] text-[9px] font-mono tracking-widest uppercase">SYNC_ID: {data.health.syncId}</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* LOGS TABLE SECTION */}
           <div className="bg-[#111318] border border-white/5 p-6 rounded-sm shadow-md flex-1 min-h-[250px] flex flex-col">
              <div className="flex justify-between items-center mb-6 pl-2">
                 <div className="flex items-center gap-2">
                    <TerminalSquare size={14} className="text-white" />
                    <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">GLOBAL_ALERT_LOG</span>
                 </div>
                 <span className="text-[#64748b] text-[9px] font-bold tracking-[0.2em] uppercase">UPDATED: 14:22:01 UTC</span>
              </div>

              <div className="flex-1 flex flex-col gap-0">
                 {data.logs.map((log, i) => {
                    let typeColor = "text-[#7be1ea]";
                    if (log.type === "SYSTEM_WARN") typeColor = "text-[#c084fc]";
                    if (log.type === "CRITICAL_ERR") typeColor = "text-[#ef4444]";
                    if (log.type === "ACCESS_AUTH") typeColor = "text-[#7be1ea]";

                    let statusBgClass = "border-white/10 bg-white/5 text-white/50";
                    if (log.statusType === 'cyan') statusBgClass = "border-[#7be1ea]/50 bg-[#7be1ea]/10 text-[#7be1ea] border-l-[3px]";
                    if (log.statusType === 'purple') statusBgClass = "border-[#c084fc]/50 bg-[#c084fc]/10 text-[#c084fc]";
                    if (log.statusType === 'red') statusBgClass = "border-[#ef4444]/50 bg-[#ef4444]/10 text-[#ef4444]";

                    return (
                       <div key={i} className="flex gap-16 items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                          <span className="text-[#a3e635] text-[10px] w-24 tracking-[0.1em]">[ {log.time} ]</span>
                          <span className={`${typeColor} font-bold text-[10px] tracking-[0.1em] w-32`}>{log.type}</span>
                          <p className="flex-1 text-[#e2e8f0] font-sans text-xs">{log.msg}</p>
                          
                          <div className={`p-2 border rounded-sm flex flex-col justify-center min-w-[200px] ${statusBgClass}`}>
                             <span className="text-[9px] font-bold tracking-[0.1em] font-sans">{log.statusText}</span>
                             {log.statusSub && <span className="text-[7px] text-white/50 tracking-widest mt-1 uppercase">{log.statusSub}</span>}
                          </div>
                       </div>
                    );
                 })}
              </div>

              <div className="flex justify-center border-t border-white/5 pt-6 mt-4">
                 <button className="text-[#64748b] text-[10px] font-bold tracking-[0.3em] uppercase hover:text-white transition-colors">
                    VIEW ALL SYSTEM LOGS
                 </button>
              </div>
           </div>

        </section>
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
    </ProtectedRoute>
  );
}
