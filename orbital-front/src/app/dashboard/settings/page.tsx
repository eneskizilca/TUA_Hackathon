"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Bell, Settings as SettingsIcon, User, 
  ShieldAlert, UserCircle, BellRing, MonitorSmartphone, KeySquare, 
  Activity, ArrowLeft, Terminal, Save, Fingerprint
} from "lucide-react";

type SettingsTab = "profile" | "security" | "notifications" | "interface";

export interface UserSettingsData {
  displayName: string;
  contactEmail: string;
  callsign: string;
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    lastPasswordChange: string;
  };
  notifications: {
    criticalAlerts: boolean;
    systemUpdates: boolean;
    accessLogs: boolean;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [data, setData] = useState<UserSettingsData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // --- BACKEND API FETCH LOGIC ---
    async function fetchSettings() {
      try {
        // const response = await fetch('/api/user/settings');
        // const result: UserSettingsData = await response.json();
        // setData(result);

        // Mock-Free Empty Configuration
        setData({
          displayName: "",
          contactEmail: "",
          callsign: "",
          security: {
            twoFactorEnabled: false,
            biometricEnabled: false,
            lastPasswordChange: "UNKNOWN"
          },
          notifications: {
            criticalAlerts: true,
            systemUpdates: false,
            accessLogs: false
          }
        });
      } catch (error) {
        console.error("Failed to fetch settings", error);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1200);
  };

  const handleTextChange = (field: keyof UserSettingsData, value: string) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleNestedToggle = (category: "security" | "notifications", field: string) => {
    if (!data) return;
    setData({
      ...data,
      [category]: {
        ...data[category] as any,
        [field]: !(data[category] as any)[field]
      }
    });
  };

  if (!data) return (
    <div className="min-h-screen bg-[#050607] text-[#7be1ea] font-mono flex flex-col items-center justify-center gap-4 text-sm tracking-[0.3em] font-bold uppercase">
      <div className="w-8 h-8 border-4 border-[#7be1ea] border-t-transparent rounded-full animate-spin" />
      LOADING PREFERENCES MATRIX...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-[#64748b] font-mono flex flex-col overflow-hidden">
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
          <SettingsIcon size={18} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] cursor-pointer" />
          <div className="w-8 h-8 rounded-full border border-[#7be1ea]/50 flex items-center justify-center cursor-pointer bg-[#7be1ea]/10 transition-colors">
            <User size={16} className="text-[#7be1ea]" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* SETTINGS SIDEBAR NAV */}
        <aside className="w-[300px] border-r border-[#1e293b] flex flex-col py-8 px-6 bg-[#0c0d0f] shrink-0">
           <Link href="/dashboard/admin" className="flex items-center gap-3 text-[#7be1ea] text-[10px] font-bold tracking-[0.2em] hover:text-white transition-colors mb-12 uppercase">
              <ArrowLeft size={14} />
              RETURN TO DASHBOARD
           </Link>

           <h3 className="text-white font-black text-2xl font-sans tracking-tight mb-8">SETTINGS</h3>

           <div className="flex flex-col gap-2">
              <button onClick={() => setActiveTab("profile")} className={`px-4 py-4 rounded-sm flex items-center gap-4 transition-all text-[11px] font-bold tracking-[0.15em] uppercase ${activeTab === "profile" ? "bg-[#15171b] border-l-[3px] border-[#7be1ea] text-[#7be1ea]" : "text-[#64748b] hover:bg-white/5 border-l-[3px] border-transparent"}`}>
                 <UserCircle size={18} className={activeTab === "profile" ? "text-[#7be1ea]" : "text-[#475569]"} />
                 Operator Profile
              </button>
              <button onClick={() => setActiveTab("security")} className={`px-4 py-4 rounded-sm flex items-center gap-4 transition-all text-[11px] font-bold tracking-[0.15em] uppercase ${activeTab === "security" ? "bg-[#15171b] border-l-[3px] border-[#a3e635] text-[#a3e635]" : "text-[#64748b] hover:bg-white/5 border-l-[3px] border-transparent"}`}>
                 <ShieldAlert size={18} className={activeTab === "security" ? "text-[#a3e635]" : "text-[#475569]"} />
                 Security Matrix
              </button>
              <button onClick={() => setActiveTab("notifications")} className={`px-4 py-4 rounded-sm flex items-center gap-4 transition-all text-[11px] font-bold tracking-[0.15em] uppercase ${activeTab === "notifications" ? "bg-[#15171b] border-l-[3px] border-[#c084fc] text-[#c084fc]" : "text-[#64748b] hover:bg-white/5 border-l-[3px] border-transparent"}`}>
                 <BellRing size={18} className={activeTab === "notifications" ? "text-[#c084fc]" : "text-[#475569]"} />
                 Alert Preferences
              </button>
              <button onClick={() => setActiveTab("interface")} className={`px-4 py-4 rounded-sm flex items-center gap-4 transition-all text-[11px] font-bold tracking-[0.15em] uppercase ${activeTab === "interface" ? "bg-[#15171b] border-l-[3px] border-[#38bdf8] text-[#38bdf8]" : "text-[#64748b] hover:bg-white/5 border-l-[3px] border-transparent"}`}>
                 <MonitorSmartphone size={18} className={activeTab === "interface" ? "text-[#38bdf8]" : "text-[#475569]"} />
                 Terminal UI
              </button>
           </div>
        </aside>

        {/* SETTINGS CONTENT */}
        <section className="flex-1 flex flex-col p-12 overflow-y-auto bg-[#050607]">
           
           <div className="max-w-3xl flex flex-col gap-10">
              
              {/* TAB REVEAL */}
              {activeTab === "profile" && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8">
                       <h2 className="text-[#e2e8f0] font-sans font-bold text-3xl">Operator Profile</h2>
                       <p className="text-[#64748b] text-[10px] tracking-widest uppercase mt-2">Modify personnel identity credentials and contact node.</p>
                    </div>

                    <div className="flex flex-col gap-8">
                       {/* AVATAR BOX */}
                       <div className="flex items-center gap-8 bg-[#0c0d0f] p-6 border border-white/5 rounded-sm">
                          <div className="w-20 h-20 bg-[#15171b] border-2 border-dashed border-white/10 rounded-full flex items-center justify-center relative overfow-hidden">
                             <User size={32} className="text-white/20" />
                          </div>
                          <div className="flex flex-col gap-3">
                             <button className="bg-white/5 hover:bg-white/10 text-white font-bold text-[10px] tracking-widest uppercase px-6 py-2 border border-white/10 rounded-sm transition-colors">
                                UPLOAD HOLOGRAM
                             </button>
                             <span className="text-[#475569] text-[9px] font-mono tracking-widest uppercase">Max render frame: 512x512 px. / Cipher locked.</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                             <label className="text-[#475569] font-bold text-[9px] tracking-widest uppercase">Display Call-sign</label>
                             <input 
                               value={data.callsign} onChange={e => handleTextChange("callsign", e.target.value)}
                               className="bg-[#0c0d0f] border border-white/10 text-white p-4 font-mono text-sm focus:border-[#7be1ea] focus:ring-1 focus:ring-[#7be1ea] outline-none transition-all placeholder-white/20"
                               placeholder="e.g. Ghost_Protocol" 
                             />
                          </div>
                          <div className="flex flex-col gap-2">
                             <label className="text-[#475569] font-bold text-[9px] tracking-widest uppercase">Legal Designation</label>
                             <input 
                               value={data.displayName} onChange={e => handleTextChange("displayName", e.target.value)}
                               className="bg-[#0c0d0f] border border-white/10 text-white p-4 font-mono text-sm focus:border-[#7be1ea] focus:ring-1 focus:ring-[#7be1ea] outline-none transition-all placeholder-white/20"
                               placeholder="e.g. Dr. Helena Vance" 
                             />
                          </div>
                          <div className="flex flex-col gap-2 col-span-2">
                             <label className="text-[#475569] font-bold text-[9px] tracking-widest uppercase">Endpoint Comm-Link (Email)</label>
                             <input 
                               value={data.contactEmail} onChange={e => handleTextChange("contactEmail", e.target.value)}
                               className="bg-[#0c0d0f] border border-white/10 text-white p-4 font-mono text-sm focus:border-[#7be1ea] focus:ring-1 focus:ring-[#7be1ea] outline-none transition-all placeholder-white/20"
                               placeholder="h.vance@orbital.com" 
                             />
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === "security" && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8">
                       <h2 className="text-[#a3e635] font-sans font-bold text-3xl">Security Matrix</h2>
                       <p className="text-[#64748b] text-[10px] tracking-widest uppercase mt-2">Manage encryption keys and physical access parameters.</p>
                    </div>

                    <div className="flex flex-col gap-6">
                       <div className="border border-white/5 bg-[#0c0d0f] p-6 rounded-sm flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-black border border-white/10 rounded-sm">
                                <KeySquare size={24} className="text-[#a3e635]" />
                             </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-white font-bold text-sm tracking-widest">Master Passcode</span>
                                <span className="text-[#64748b] text-[10px] font-mono tracking-widest">Last changed: {data.security.lastPasswordChange}</span>
                             </div>
                          </div>
                          <button className="border border-[#a3e635]/30 text-[#a3e635] hover:bg-[#a3e635]/10 px-6 py-3 font-bold text-[10px] tracking-widest uppercase rounded-sm transition-colors">
                             UPDATE KEY
                          </button>
                       </div>

                       <div className="border border-white/5 bg-[#0c0d0f] p-6 rounded-sm flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="p-3 bg-black border border-white/10 rounded-sm">
                                <Fingerprint size={24} className="text-[#7be1ea]" />
                             </div>
                             <div className="flex flex-col gap-1">
                                <span className="text-white font-bold text-sm tracking-widest">Biometric Authentication</span>
                                <span className="text-[#64748b] text-[10px] font-mono tracking-widest">Require retinal/fingerprint scan for critical commands.</span>
                             </div>
                          </div>
                          {/* TOGGLE */}
                          <div 
                             onClick={() => handleNestedToggle("security", "biometricEnabled")}
                             className={`w-14 h-6 border rounded-full shrink-0 flex items-center px-1 cursor-pointer transition-colors ${data.security.biometricEnabled ? 'border-[#7be1ea] bg-[#7be1ea]/20' : 'border-white/20 bg-black'}`}
                          >
                             <div className={`w-4 h-4 bg-white rounded-full transition-transform ${data.security.biometricEnabled ? 'translate-x-7 bg-[#7be1ea]' : ''}`} />
                          </div>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === "notifications" && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8">
                       <h2 className="text-[#c084fc] font-sans font-bold text-3xl">Alert Preferences</h2>
                       <p className="text-[#64748b] text-[10px] tracking-widest uppercase mt-2">Adjust threshold for communication and pings.</p>
                    </div>

                    <div className="border border-white/5 bg-[#0c0d0f] rounded-sm flex flex-col divide-y divide-white/5">
                       {[
                         { id: "criticalAlerts", label: "Critical Anomalies", desc: "Override silenced comms for severity Alpha." },
                         { id: "systemUpdates", label: "Fleet Updates", desc: "Routine telemetry syncs." },
                         { id: "accessLogs", label: "Unrecognized Entry", desc: "Terminal login from unregistered IP." },
                       ].map((item, i) => (
                          <label key={i} className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors">
                             <div className="flex flex-col gap-1">
                                <span className="text-white font-bold text-sm tracking-widest uppercase">{item.label}</span>
                                <span className="text-[#64748b] text-[10px] font-mono tracking-widest">{item.desc}</span>
                             </div>
                             {/* TOGGLE */}
                             <div 
                                onClick={() => handleNestedToggle("notifications", item.id)}
                                className={`w-14 h-6 border rounded-full shrink-0 flex items-center px-1 cursor-pointer transition-colors ${data.notifications[item.id as keyof typeof data.notifications] ? 'border-[#c084fc] bg-[#c084fc]/20' : 'border-white/20 bg-black'}`}
                             >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${data.notifications[item.id as keyof typeof data.notifications] ? 'translate-x-7 bg-[#c084fc]' : ''}`} />
                             </div>
                          </label>
                       ))}
                    </div>
                 </div>
              )}

              {activeTab === "interface" && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-8">
                       <h2 className="text-[#38bdf8] font-sans font-bold text-3xl">Terminal UI</h2>
                       <p className="text-[#64748b] text-[10px] tracking-widest uppercase mt-2">Customize the visual readout mapping.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="bg-[#0c0d0f] border-2 border-[#38bdf8] p-4 rounded-sm cursor-pointer relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-2 bg-[#38bdf8] text-black"><Terminal size={14} /></div>
                          <h4 className="text-white font-bold text-sm mb-2">Deep Space (Dark)</h4>
                          <p className="text-[#64748b] text-[10px] font-mono leading-relaxed">Default contrast. Optimized for low-light observation centers.</p>
                       </div>
                       <div className="bg-[#111318] border border-white/10 p-4 rounded-sm opacity-50 cursor-not-allowed">
                          <h4 className="text-white font-bold text-sm mb-2">Solar Flare (Light)</h4>
                          <p className="text-[#64748b] text-[10px] font-mono leading-relaxed">Currently locked. Exceeds standard lumen capacity limits.</p>
                       </div>
                    </div>
                 </div>
              )}

              {/* SAVE ACTION */}
              <div className="border-t border-white/5 pt-8 flex justify-end">
                 <button 
                   onClick={handleSave} 
                   className={`px-8 py-4 font-extrabold text-[10px] tracking-[0.2em] uppercase rounded-sm flex items-center gap-3 transition-colors ${saving ? 'bg-[#a3e635] text-black shadow-[0_0_20px_rgba(163,230,53,0.5)]' : 'bg-white/10 text-white hover:bg-white hover:text-black'}`}
                 >
                    <Save size={16} />
                    {saving ? "DATA SECURED" : "COMMIT CHANGES"}
                 </button>
              </div>

           </div>

        </section>
      </main>

    </div>
  );
}
