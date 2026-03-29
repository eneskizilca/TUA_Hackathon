"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Settings, User, LayoutGrid, Users, ShieldCheck, Activity, FileText, LogOut, Search, Filter, MoreVertical, UserPlus } from "lucide-react";
import { fetchAllUsers, type User as UserType } from "@/lib/api/admin";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  }

  const totalOperators = users.filter(u => u.role === 'OPERATOR').length;
  const totalObservers = users.filter(u => u.role === 'OBSERVER').length;
  const activeUsers = users.filter(u => u.is_active).length;
  const systemIntegrity = users.length > 0 ? (activeUsers / users.length) * 100 : 0;
  const uniqueDomains = new Set(users.map(u => u.email.split('@')[1])).size;

  if (loading) return (
    <div className="min-h-screen bg-[#050607] text-[#7be1ea] font-mono flex flex-col items-center justify-center gap-4 text-sm tracking-[0.3em] font-bold uppercase">
      <div className="w-8 h-8 border-4 border-[#7be1ea] border-t-transparent rounded-full animate-spin" />
      ACCESSING PERSONNEL DIRECTORY...
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
              <Link href="/dashboard/admin/users" className="bg-[#15171b] border-l-[3px] border-[#7be1ea] px-6 py-4 flex items-center gap-4 text-[#7be1ea] cursor-pointer group">
                 <Users size={18} />
                 <span className="font-bold tracking-[0.15em] text-[11px] uppercase">User Management</span>
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
        <section className="flex-1 flex flex-col px-10 py-10 gap-8 overflow-y-auto bg-[#0a0a0a] relative">
           
           {/* TITLE & SEARCH ROW */}
           <div className="flex justify-between items-start">
              <div>
                 <h2 className="text-white font-bold text-3xl font-sans tracking-tight mb-2">Personnel Directory</h2>
                 <p className="text-[#a3e635] text-[10px] font-bold tracking-[0.2em] uppercase">ACTIVE_SESSION_NODES: {activeUsers.toLocaleString()}</p>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#475569]" />
                    <input 
                      type="text" 
                      placeholder="SEARCH_DATABASE..." 
                      className="bg-transparent border border-white/10 rounded-sm py-3 pl-12 pr-6 text-[10px] text-white tracking-[0.2em] focus:outline-none focus:border-[#7be1ea] transition-colors w-64"
                    />
                 </div>
                 <button className="bg-[#15171b] border border-white/10 rounded-sm py-3 px-6 flex items-center gap-3 hover:bg-white/5 transition-colors">
                    <Filter size={14} className="text-white" />
                    <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase">FILTER</span>
                 </button>
              </div>
           </div>

           {/* STATS ROW */}
           <div className="grid grid-cols-4 gap-6">
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-md">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">TOTAL_OPERATORS</div>
                 <span className="text-[#7be1ea] text-4xl font-black font-sans tracking-wide">{totalOperators.toLocaleString()}</span>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-md">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">GLOBAL_OBSERVERS</div>
                 <span className="text-white text-4xl font-black font-sans tracking-wide">{totalObservers.toLocaleString()}</span>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 flex flex-col justify-between rounded-sm shadow-md">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">ACTIVE_INSTITUTIONS</div>
                 <span className="text-[#c084fc] text-4xl font-black font-sans tracking-wide">{uniqueDomains.toLocaleString()}</span>
              </div>
              <div className="bg-[#111318] p-6 border border-white/5 border-l-4 border-l-[#a3e635] flex flex-col justify-between rounded-sm shadow-md">
                 <div className="text-[10px] text-[#64748b] font-bold tracking-[0.2em] mb-4 uppercase">SYSTEM_INTEGRITY</div>
                 <span className="text-[#a3e635] text-4xl font-black font-sans tracking-wide">{systemIntegrity.toFixed(1)}%</span>
              </div>
           </div>

           {/* TABLE SECTION */}
           <div className="flex-1 flex flex-col min-h-[400px]">
              <div className="grid grid-cols-6 border-b border-white/10 pb-4 mb-2 text-[9px] uppercase font-bold tracking-[0.2em] text-[#64748b] px-4">
                 <span>USER_ID</span>
                 <span>IDENTITY_NAME</span>
                 <span>ROLE_CLEARANCE</span>
                 <span className="col-span-2">INSTITUTIONAL_AFFILIATION</span>
                 <span className="flex justify-between w-full"><span>STATUS_STATE</span> <span className="mr-8">ACTIONS</span></span>
              </div>
              
              <div className="flex flex-col flex-1 divide-y divide-white/5">
                 {users.length > 0 ? users.map((user) => (
                    <div key={user.id} className="grid grid-cols-6 items-center p-4 hover:bg-white/5 transition-colors cursor-pointer group rounded-sm">
                       <span className="text-[#7be1ea] text-[11px] font-bold tracking-widest">USR_{user.id.toString().padStart(4, '0')}</span>
                       <span className="text-white text-sm font-bold font-sans">{user.full_name || "UNNAMED"}</span>
                       
                       <div>
                          <span className={`px-3 py-1 text-[9px] tracking-widest uppercase border rounded-[2px] ${
                             user.role === 'OPERATOR' 
                             ? 'bg-[#a3e635]/10 border-[#a3e635]/30 text-[#a3e635]' 
                             : user.role === 'ADMIN'
                             ? 'bg-[#c084fc]/10 border-[#c084fc]/30 text-[#c084fc]'
                             : 'bg-white/5 border-white/20 text-[#64748b]'
                          }`}>
                             {user.role}
                          </span>
                       </div>
                       
                       <span className="col-span-2 text-white/70 text-xs font-sans">{user.email}</span>
                       
                       <div className="flex justify-between items-center w-full">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-[1px] ${
                                user.is_active ? 'bg-[#a3e635] shadow-[0_0_5px_#a3e635]' 
                                : 'bg-[#ef4444] shadow-[0_0_5px_#ef4444]'
                             }`} />
                             <span className={`text-[9px] tracking-widest font-bold uppercase ${
                                user.is_active ? 'text-[#a3e635]' : 'text-[#ef4444]'
                             }`}>
                                {user.is_active ? 'ACTIVE' : 'PENDING'}
                             </span>
                          </div>
                          
                          <button className="text-[#64748b] hover:text-white transition-colors mr-8 opacity-0 group-hover:opacity-100">
                             <MoreVertical size={16} />
                          </button>
                       </div>
                    </div>
                 )) : (
                    <div className="flex-1 flex items-center justify-center opacity-30 text-[11px] font-bold tracking-[0.3em] uppercase">
                       NO PERSONNEL DATA LOADED / AWAITING BACKEND
                    </div>
                 )}
              </div>

              {/* PAGINATION */}
              <div className="flex justify-between items-center pt-4 border-t border-white/5 uppercase">
                 <span className="text-[#64748b] text-[10px] font-bold tracking-[0.2em]">
                    SHOWING_RECORDS_001-{Math.min(50, users.length).toString().padStart(3, '0')}_OF_{users.length}
                 </span>
                 <div className="flex gap-1">
                    <button className="px-4 py-2 bg-[#15171b] text-[#64748b] text-[10px] font-bold tracking-[0.1em] border border-transparent hover:border-white/10 rounded-sm transition-colors">PREV</button>
                    <button className="w-10 py-2 bg-[#7be1ea] text-black text-[10px] font-black tracking-widest border border-transparent rounded-sm">01</button>
                    <button className="w-10 py-2 bg-[#15171b] text-white/70 text-[10px] font-bold tracking-widest border border-transparent hover:border-white/10 rounded-sm transition-colors">02</button>
                    <button className="w-10 py-2 bg-[#15171b] text-white/70 text-[10px] font-bold tracking-widest border border-transparent hover:border-white/10 rounded-sm transition-colors">03</button>
                    <button className="px-4 py-2 bg-[#15171b] text-white/70 text-[10px] font-bold tracking-[0.1em] border border-transparent hover:border-white/10 rounded-sm transition-colors">NEXT</button>
                 </div>
              </div>
           </div>

           {/* BOTTOM ACCESS LOG */}
           <div className="bg-[#111318] p-6 border border-white/5 rounded-sm shadow-md h-32 flex flex-col mt-4">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-2 h-2 bg-[#a3e635] rounded-sm" />
                 <span className="text-[#a3e635] text-[10px] font-bold tracking-[0.2em] uppercase">LIVE_USER_ACCESS_LOG</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide text-[9px] font-mono tracking-wider">
                 {users.slice(0, 3).map((user, i) => (
                    <div key={i} className="flex gap-3 leading-relaxed text-[#a3e635]">
                       <span className="opacity-80">[{new Date(user.created_at).toLocaleTimeString()}]</span>
                       <span className="text-white/80">USER {user.email} REGISTERED AS {user.role}</span>
                    </div>
                 ))}
                 {users.length === 0 && (
                    <div className="opacity-30 flex items-center h-full">NO ACCESS LOGS RECORDED</div>
                 )}
              </div>
           </div>

           {/* FLOATING ACTION BUTTON (Add User) */}
           <button className="absolute bottom-8 right-10 w-16 h-16 bg-[#7be1ea] flex items-center justify-center hover:bg-[#a3e635] transition-all hover:scale-105 shadow-[0_10px_30px_rgba(123,225,234,0.3)] hover:shadow-[0_10px_30px_rgba(163,230,53,0.4)] z-50">
              <UserPlus size={24} className="text-black ml-1" />
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
