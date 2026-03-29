"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Settings, User, LayoutGrid, Users, ShieldCheck, Activity, FileText, LogOut, MapPin, Search, Network, Satellite, Building2, Rocket } from "lucide-react";
import { fetchPendingUsers, updateUser, type User as UserType } from "@/lib/api/admin";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProRequestsPage() {
  const [pendingUsers, setPendingUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadPendingUsers();
  }, []);

  async function loadPendingUsers() {
    try {
      const users = await fetchPendingUsers();
      setPendingUsers(users);
    } catch (error) {
      console.error("Failed to fetch pending users", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(userId: number) {
    setProcessingId(userId);
    try {
      await updateUser(userId, { is_active: true });
      await loadPendingUsers();
    } catch (error) {
      console.error("Failed to approve user", error);
      alert("Failed to approve user");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(userId: number) {
    setProcessingId(userId);
    try {
      // For now, we'll just remove from pending by not showing them
      // In a real system, you might want to delete or mark as rejected
      await loadPendingUsers();
    } catch (error) {
      console.error("Failed to reject user", error);
      alert("Failed to reject user");
    } finally {
      setProcessingId(null);
    }
  }

  const getDynamicIcon = (email: string) => {
    // Assign icon based on email domain or random
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const icons = [
      <Network key="network" size={24} className="text-[#c084fc]" />,
      <Satellite key="satellite" size={24} className="text-[#a3e635]" />,
      <Building2 key="building" size={24} className="text-[#64748b]" />,
      <Rocket key="rocket" size={24} className="text-[#c084fc]" />
    ];
    return icons[hash % icons.length];
  };

  const getLocationFromEmail = (email: string) => {
    // Generate pseudo-random coordinates based on email
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const lat = (hash % 90).toFixed(4);
    const lon = ((hash * 2) % 180).toFixed(4);
    return `${lat}° N, ${lon}° E`;
  };

  const queueLoad = pendingUsers.length > 0 ? Math.min(100, pendingUsers.length * 15) : 0;
  const avgResponse = pendingUsers.length > 0 ? `${(pendingUsers.length * 0.3).toFixed(1)}m` : "0.0m";

  if (loading) return (
    <div className="min-h-screen bg-[#050607] text-[#7be1ea] font-mono flex flex-col items-center justify-center gap-4 text-sm tracking-[0.3em] font-bold uppercase">
      <div className="w-8 h-8 border-4 border-[#7be1ea] border-t-transparent rounded-full animate-spin" />
      FETCHING PRO REQUESTS...
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
              <Link href="/dashboard/admin" className="px-6 py-4 flex items-center gap-4 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                 <LayoutGrid size={18} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-[11px] group-hover:text-white transition-colors uppercase">System Summary</span>
              </Link>
              <Link href="/dashboard/admin/users" className="px-6 py-4 flex items-center gap-4 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                 <Users size={18} className="group-hover:text-white transition-colors" />
                 <span className="font-bold tracking-[0.15em] text-[11px] group-hover:text-white transition-colors uppercase">User Management</span>
              </Link>
              <Link href="/dashboard/admin/pro-requests" className="bg-[#15171b] border-l-[3px] border-[#7be1ea] px-6 py-4 flex items-center gap-4 text-[#7be1ea] cursor-pointer group">
                 <ShieldCheck size={18} />
                 <span className="font-bold tracking-[0.15em] text-[11px] uppercase">Pro Requests</span>
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
        <section className="flex-1 flex flex-col px-10 py-10 gap-8 overflow-y-auto bg-[#0a0a0a] relative">
           
           {/* HEADER AREA */}
           <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                 <h2 className="text-white font-black text-5xl font-sans tracking-tight uppercase">Pro Requests</h2>
                 <div className="flex items-center gap-2 mt-2 text-[#64748b] text-[10px] tracking-[0.2em] uppercase font-bold">
                    <div className="w-2 h-2 bg-[#a3e635]" />
                    <span>QUEUE STATUS: {pendingUsers.length} PENDING REGISTRATIONS</span>
                 </div>
              </div>

              {/* FILTER DROPDOWNS */}
              <div className="flex items-center gap-8">
                 <div className="flex flex-col gap-1">
                    <span className="text-[#475569] text-[8px] tracking-widest font-bold uppercase">FILTER BY</span>
                    <span className="text-[#64748b] border-b border-white/20 pb-1 text-[11px] font-mono tracking-widest uppercase cursor-pointer hover:text-white transition-colors">ALL_REGIONS</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-[#475569] text-[8px] tracking-widest font-bold uppercase">SORT BY</span>
                    <span className="text-[#7be1ea] border-b border-[#7be1ea]/50 pb-1 text-[11px] font-mono tracking-widest uppercase cursor-pointer hover:text-white transition-colors">TIMESTAMP_DESC</span>
                 </div>
              </div>
           </div>

           {/* REQUESTS LIST */}
           <div className="flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-hide pb-32">
              {pendingUsers.length > 0 ? pendingUsers.map((user) => (
                 <div key={user.id} className="bg-[#15171b] border border-white/5 flex items-stretch rounded-sm shadow-md group hover:bg-[#1a1c22] transition-colors overflow-hidden">
                    {/* ICON BLOCK */}
                    <div className="w-24 bg-black/20 border-r border-white/5 flex items-center justify-center shrink-0">
                       {getDynamicIcon(user.email)}
                    </div>
                    
                    {/* DETAILS GRID */}
                    <div className="flex-1 p-6 grid grid-cols-4 gap-6 items-center">
                       {/* INSTITUTION */}
                       <div className="flex flex-col gap-1">
                          <span className="text-[#475569] text-[8px] uppercase tracking-widest font-bold">INSTITUTION</span>
                          <span className="text-white font-sans font-bold text-sm tracking-wide">{user.full_name || "UNNAMED_OPERATOR"}</span>
                       </div>

                       {/* OPERATOR CONTACT */}
                       <div className="flex flex-col gap-1">
                          <span className="text-[#475569] text-[8px] uppercase tracking-widest font-bold">OPERATOR CONTACT</span>
                          <span className="text-white font-sans font-bold text-sm tracking-wide">{user.email}</span>
                       </div>

                       {/* TERMINAL ENDPOINT */}
                       <div className="flex flex-col gap-1">
                          <span className="text-[#475569] text-[8px] uppercase tracking-widest font-bold">TERMINAL ENDPOINT</span>
                          <span className="text-[#7be1ea] font-mono text-[10px] tracking-widest">OP_{user.id.toString().padStart(4, '0')}</span>
                       </div>

                       {/* OPERATION CENTER */}
                       <div className="flex flex-col gap-1 col-span-1 border-l border-white/5 pl-6">
                          <span className="text-[#475569] text-[8px] uppercase tracking-widest font-bold">OPERATION CENTER</span>
                          <span className="text-white font-sans text-xs flex items-center gap-1 mb-1">
                             {user.email.split('@')[1]?.toUpperCase() || "UNKNOWN"}
                          </span>
                          <div className="flex items-start gap-1 text-[#64748b] text-[9px] font-mono">
                             <MapPin size={10} className="mt-0.5 shrink-0" />
                             <span>{getLocationFromEmail(user.email)}</span>
                          </div>
                       </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col justify-center gap-3 p-6 shrink-0 w-48">
                       <button 
                          onClick={() => handleApprove(user.id)}
                          disabled={processingId === user.id}
                          className="bg-[#7be1ea] text-black font-extrabold text-[10px] tracking-[0.2em] py-3 rounded-sm uppercase hover:bg-white transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                          {processingId === user.id ? "PROCESSING..." : "APPROVE"}
                       </button>
                       <button 
                          onClick={() => handleReject(user.id)}
                          disabled={processingId === user.id}
                          className="border border-[#ef4444]/30 text-[#ef4444] font-bold text-[10px] tracking-[0.2em] py-3 rounded-sm uppercase hover:bg-[#ef4444]/10 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                          REJECT
                       </button>
                    </div>
                 </div>
              )) : (
                 <div className="flex-1 flex flex-col items-center justify-center opacity-40 gap-4 mt-20">
                    <ShieldCheck size={48} className="text-[#475569]" />
                    <span className="text-[#64748b] text-xs font-bold tracking-[0.3em] uppercase">NO PENDING PRO REGISTRATIONS IN QUEUE</span>
                 </div>
              )}
           </div>

           {/* BOTTOM METRICS FIXED PANE */}
           <div className="absolute bottom-8 left-10 right-32 h-20 bg-[#000000] border-t-2 border-l-2 border-[#1e293b]/50 border-r-2 flex items-center divide-x divide-white/10 shrink-0">
              <div className="flex-1 px-8 flex flex-col justify-center h-full border-l-[3px] border-[#7be1ea]">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] text-[#64748b] font-bold tracking-widest uppercase">QUEUE LOAD</span>
                    <span className="text-[#7be1ea] text-[10px] font-bold">{queueLoad}%</span>
                 </div>
                 <div className="w-full h-1 bg-[#1e293b]">
                    <div className="h-full bg-[#7be1ea]" style={{ width: `${queueLoad}%` }} />
                 </div>
              </div>

              <div className="flex-1 px-8 flex flex-col justify-center h-full border-l-[3px] border-[#a3e635]">
                 <span className="text-[9px] text-[#64748b] font-bold tracking-widest uppercase mb-1">AVERAGE RESPONSE</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-[#a3e635] text-xl font-black font-sans tracking-wider">{avgResponse}</span>
                    <span className="text-[#64748b] text-[9px] font-bold tracking-widest uppercase">LATENCY</span>
                 </div>
              </div>

              <div className="flex-1 px-8 flex flex-col justify-center h-full border-l-[3px] border-[#c084fc]">
                 <span className="text-[9px] text-[#64748b] font-bold tracking-widest uppercase mb-1">SYSTEM ENTROPY</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-[#c084fc] text-xl font-bold font-mono tracking-wider uppercase">{pendingUsers.length > 0 ? "NOMINAL" : "STABLE"}</span>
                    <span className="text-[#64748b] text-[9px] font-bold tracking-widest uppercase">{pendingUsers.length > 0 ? "ACTIVE" : "IDLE"}</span>
                 </div>
              </div>
           </div>

           {/* FLOATING ACTION SEARCH BUTTON */}
           <button className="absolute bottom-10 right-10 w-16 h-16 bg-[#7be1ea] flex items-center justify-center hover:bg-white transition-all hover:scale-105 shadow-[0_10px_30px_rgba(123,225,234,0.3)] z-50">
              <Search size={24} className="text-black inline-block" strokeWidth={3} />
           </button>

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
