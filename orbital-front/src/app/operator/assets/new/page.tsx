"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, Settings, User, Satellite, FolderClosed, TerminalSquare, Calendar } from "lucide-react";

export default function NewAssetPage() {
    // Asset Tipi State'i
    const [assetType, setAssetType] = useState("SATELLITE");

    // Görsel Seçenekler Config'i
    const assetTypes = [
        { id: "SATELLITE", label: "SATELLITE", img: "/uydu.png", glow: "shadow-[0_0_20px_rgba(123,225,234,0.2)] text-[#7be1ea]", border: "border-[#7be1ea]" },
        { id: "POWER GRID", label: "POWER GRID", img: "/trafo.png", glow: "shadow-[0_0_20px_rgba(192,132,252,0.2)] text-[#c084fc]", border: "border-[#c084fc]" },
        { id: "AIRCRAFT", label: "AIRCRAFT", img: "/ucak.png", glow: "shadow-[0_0_20px_rgba(163,230,53,0.2)] text-[#a3e635]", border: "border-[#a3e635]" },
        { id: "DATA CENTER", label: "DATA CENTER", img: "/datacenter.png", glow: "shadow-[0_0_20px_rgba(148,163,184,0.2)] text-[#cbd5e1]", border: "border-[#cbd5e1]" },
    ];

    return (
        <div className="min-h-screen bg-[#050607] text-[#64748b] font-mono flex flex-col overflow-hidden">
            {/* HEADER */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0a0b0d] z-50">
                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-3">
                        <Image src="/astrologo.gif" alt="Logo" width={32} height={32} className="mix-blend-screen" unoptimized />
                        <span className="text-white font-bold text-xl tracking-[0.2em] font-sans">ORBITAL SENSE</span>
                        <span className="text-[#3a8a92] text-[10px] tracking-[0.1em] ml-2 hidden sm:block">Beyond the atmosphere. Predicting the anomaly.</span>
                    </div>
                </div>
                <div className="flex items-center gap-6 text-[#475569]">
                    <Bell size={18} className="hover:text-white cursor-pointer transition-colors" />
                    <Link href="/operator/settings"><Settings size={18} className="hover:text-white cursor-pointer transition-colors" /></Link>
                    <div className="w-8 h-8 bg-[#1e293b] rounded flex items-center justify-center border border-white/10 overflow-hidden cursor-pointer hover:bg-white/10 transition-colors">
                        <User size={18} className="text-white/60" />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* LEFT NAV SIDEBAR */}
                <aside className="w-[300px] bg-[#0c0d0f] border-r border-[#1e293b] flex flex-col py-8 shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.5)] z-20">
                    <div className="px-8 mb-8">
                        <div className="text-[10px] text-[#475569] tracking-[0.2em] font-bold uppercase mb-2">FLEET COMMAND</div>
                        <div className="text-[#7be1ea] font-bold font-sans text-lg tracking-wide">Active Orbits</div>
                    </div>

                    <div className="flex flex-col">
                        <Link href="/dashboard/operator" className="px-8 py-5 flex items-center gap-5 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                            <Satellite size={18} className="group-hover:text-white transition-colors" />
                            <span className="font-bold tracking-[0.15em] text-xs group-hover:text-white transition-colors uppercase">FLEET OVERVIEW</span>
                        </Link>
                        <Link href="/operator/assets" className="bg-[#15171b] border-l-[3px] border-[#7be1ea] px-8 py-5 flex items-center gap-5 text-[#7be1ea] cursor-pointer group">
                            <FolderClosed size={18} />
                            <span className="font-bold tracking-[0.15em] text-xs uppercase">ASSET REGISTRY</span>
                        </Link>
                        <div className="px-8 py-5 flex items-center gap-5 text-[#64748b] hover:bg-white/5 cursor-pointer transition-colors group border-l-[3px] border-transparent">
                            <TerminalSquare size={18} className="group-hover:text-white transition-colors" />
                            <span className="font-bold tracking-[0.15em] text-xs group-hover:text-white transition-colors uppercase">SYSTEM LOGS</span>
                        </div>
                    </div>

                    <div className="flex-1" />

                    <div className="px-8 w-full pb-4">
                        <Link href="/operator/assets/new" className="w-full bg-[#7be1ea]/20 border border-[#7be1ea] text-[#7be1ea] font-extrabold text-[10px] tracking-[0.2em] py-4 rounded-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(123,225,234,0.1)]">
                            <span>+ ADD NEW ASSET</span>
                        </Link>
                    </div>
                </aside>

                {/* CENTER CONTENT EXACTLY MATCHING DESIGN */}
                <section className="flex-1 flex flex-col relative bg-[#101217] overflow-y-auto">
                    {/* Decorative background grid */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{
                            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                            backgroundSize: "40px 40px"
                        }}
                    />

                    <div className="flex-1 max-w-7xl w-full mx-auto p-12 relative z-10 flex flex-col">

                        {/* HEADER TITLE */}
                        <div className="border-l-[3px] border-[#a3e635] pl-6 mb-10 flex flex-col gap-1">
                            <h2 className="text-white font-black text-4xl font-sans tracking-wide uppercase">Asset Registration</h2>
                            <p className="text-[#64748b] text-[10px] font-mono tracking-[0.2em] uppercase">Initialize manual record for non-automated orbital nodes.</p>
                        </div>

                        {/* VISUAL ASSET SELECTOR */}
                        <div className="mb-10 flex flex-col gap-4">
                            <div className="text-[10px] tracking-[0.2em] font-bold text-white/50 uppercase">1. SELECT ASSET CLASSIFICATION VISUALLY</div>
                            <div className="grid grid-cols-4 gap-6">
                                {assetTypes.map((type) => {
                                    const isSelected = assetType === type.id;
                                    return (
                                        <div
                                            key={type.id}
                                            onClick={(e) => { e.preventDefault(); setAssetType(type.id); }}
                                            className={`relative h-[160px] border cursor-pointer overflow-hidden rounded-sm transition-all duration-300 group ${isSelected ? `${type.border} ${type.glow}` : "border-white/5 bg-[#15171b] hover:border-white/20"
                                                }`}
                                        >
                                            {/* Background Image */}
                                            <div className="absolute inset-0 z-0">
                                                <img
                                                    src={type.img}
                                                    alt={type.label}
                                                    className={`w-full h-full object-cover transition-all duration-700 ${isSelected ? "opacity-60 scale-105 contrast-125 saturate-150" : "opacity-20 grayscale scale-100 group-hover:opacity-40 group-hover:grayscale-[50%]"
                                                        }`}
                                                />
                                            </div>
                                            {/* Gradient Overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-t ${isSelected ? 'from-[#050607]/90 via-[#050607]/30' : 'from-[#050607]/90 via-[#050607]/60'
                                                } to-transparent transition-colors z-10 flex flex-col justify-end p-5`}>
                                                {/* Text Label */}
                                                <span className={`font-bold text-xs tracking-[0.2em] uppercase transition-colors relative z-20 flex items-center gap-3 ${isSelected ? type.glow : 'text-white/50 group-hover:text-white/80'}`}>
                                                    {isSelected && <div className={`w-1.5 h-1.5 rounded-full ${type.border.replace('border-', 'bg-')} animate-pulse`} />}
                                                    {type.label}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <form className="flex flex-col gap-6 flex-1" onSubmit={(e) => e.preventDefault()}>

                            <div className="grid grid-cols-2 gap-6">
                                {/* BOX 01 // BASIC INFORMATION */}
                                <div className="border border-white/5 bg-[#15171b] p-8 flex flex-col gap-8 rounded-sm">
                                    <div className="flex items-center gap-3 text-[#a3e635] text-[11px] font-bold tracking-[0.2em]">
                                        <div className="w-2.5 h-2.5 bg-[#a3e635]" />
                                        01 // BASIC INFORMATION
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">ASSET TYPE</label>
                                        <select
                                            value={assetType}
                                            onChange={(e) => setAssetType(e.target.value)}
                                            className="bg-[#1e293b]/50 border border-white/5 p-4 text-[#7be1ea] focus:outline-none focus:border-[#7be1ea]/50 text-xs font-bold tracking-[0.1em] transition-colors rounded-sm appearance-none cursor-pointer"
                                        >
                                            <option value="SATELLITE">SATELLITE</option>
                                            <option value="POWER GRID">POWER GRID</option>
                                            <option value="DATA CENTER">DATA CENTER</option>
                                            <option value="AIRCRAFT">AIRCRAFT</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">ASSET ID</label>
                                        <input
                                            type="text"
                                            className="bg-white text-black p-4 focus:outline-none focus:ring-2 focus:ring-[#7be1ea] font-medium text-xs tracking-widest transition-colors rounded-sm"
                                            placeholder="OS-XXXX-ALPHA"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">STATUS</label>
                                        <select className="bg-[#1e293b]/50 border border-white/5 p-4 text-[#7be1ea] focus:outline-none focus:border-[#7be1ea]/50 text-xs font-bold tracking-[0.1em] transition-colors rounded-sm appearance-none cursor-pointer">
                                            <option>ACTIVE</option>
                                            <option>WARNING</option>
                                            <option>MAINTENANCE</option>
                                        </select>
                                    </div>
                                </div>

                                {/* BOX 02 // TELEMETRY & POSITION */}
                                <div className="border border-white/5 bg-[#15171b] p-8 flex flex-col gap-8 rounded-sm">
                                    <div className="flex items-center gap-3 text-[#7be1ea] text-[11px] font-bold tracking-[0.2em]">
                                        <div className="w-2.5 h-2.5 bg-[#7be1ea]" />
                                        02 // TELEMETRY & POSITION
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">REGISTRATION TIMESTAMP</label>
                                        <div className="relative border border-white/5 bg-[#1e293b]/30 rounded-sm">
                                            <input
                                                type="text"
                                                className="w-full bg-transparent p-4 text-[#7be1ea]/80 font-mono focus:outline-none text-xs tracking-widest"
                                                placeholder="mm/dd/yyyy, --:-- --"
                                            />
                                            <Calendar size={16} className="absolute right-4 top-4 border-[#1e293b]/80" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">LATITUDE</label>
                                            <input type="text" placeholder="00.000000" className="bg-white text-black font-medium p-4 text-xs tracking-widest transition-colors rounded-sm focus:outline-none focus:ring-2 ring-[#7be1ea]" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">LONGITUDE</label>
                                            <input type="text" placeholder="00.000000" className="bg-white text-black font-medium p-4 text-xs tracking-widest transition-colors rounded-sm focus:outline-none focus:ring-2 ring-[#7be1ea]" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">ALTITUDE (KM)</label>
                                        <input type="text" placeholder="400.0" className="bg-white text-black font-medium p-4 text-xs tracking-widest transition-colors rounded-sm focus:outline-none focus:ring-2 ring-[#7be1ea]" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* BOX 03 // ORBITAL DYNAMICS */}
                                <div className="border border-white/5 bg-[#15171b] p-8 flex flex-col gap-8 rounded-sm">
                                    <div className="flex items-center gap-3 text-[#a3e635] text-[11px] font-bold tracking-[0.2em]">
                                        <div className="w-2.5 h-2.5 bg-[#a3e635]" />
                                        03 // ORBITAL DYNAMICS
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">VEL X (KM/S)</label>
                                            <input type="text" placeholder="7.66" className="bg-white text-black font-medium p-4 text-xs tracking-widest transition-colors rounded-sm focus:outline-none focus:ring-2 ring-[#7be1ea]" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">VEL Y (KM/S)</label>
                                            <input type="text" placeholder="0.00" className="bg-white text-black font-medium p-4 text-xs tracking-widest transition-colors rounded-sm focus:outline-none focus:ring-2 ring-[#7be1ea]" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">VEL Z (KM/S)</label>
                                            <input type="text" placeholder="0.00" className="bg-white text-black font-medium p-4 text-xs tracking-widest transition-colors rounded-sm focus:outline-none focus:ring-2 ring-[#7be1ea]" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full">
                                        <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">BATTERY VOLTAGE (V)</label>
                                        <div className="flex items-center gap-4">
                                            <input type="text" placeholder="28.4" className="bg-white flex-1 text-black font-medium p-4 text-xs tracking-widest transition-colors rounded-sm focus:outline-none focus:ring-2 ring-[#7be1ea]" />
                                            <div className="bg-[#1e40af]/20 border border-[#a3e635]/20 text-[#a3e635] text-[9px] font-bold tracking-[0.2em] px-4 py-4 rounded-sm">
                                                NOMINAL
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BOX 04 // PROJECTED ROUTE */}
                                <div className="border border-white/5 bg-[#15171b] p-8 flex flex-col gap-8 rounded-sm">
                                    <div className="flex items-center gap-3 text-[#c084fc] text-[11px] font-bold tracking-[0.2em] mb-4">
                                        <div className="w-2.5 h-2.5 bg-[#c084fc]" />
                                        04 // PROJECTED ROUTE
                                    </div>

                                    <div className="flex flex-col gap-2 flex-1 relative">
                                        <label className="text-[10px] tracking-[0.2em] font-bold text-[#64748b] uppercase">COORDINATE ARRAY (JSON/TXT)</label>
                                        <textarea
                                            className="flex-1 bg-[#1e293b]/30 border border-white/5 rounded-sm p-4 text-[#64748b] font-mono text-xs tracking-widest focus:outline-none focus:border-[#c084fc]/50 resize-none"
                                            placeholder="[ {lat: 45.0, lng: -12.0, alt: 400.2}, ... ]"
                                        />
                                    </div>

                                    <div className="text-[9px] tracking-[0.2em] text-[#475569] font-bold uppercase mt-[-10px]">
                                        ENTER TRAJECTORY WAYPOINTS FOR PREDICTIVE ANOMALY ANALYSIS.
                                    </div>
                                </div>
                            </div>

                            {/* BOTTOM ACTIONS */}
                            <div className="mt-12 flex items-center justify-end gap-12 border-t border-white/5 pt-12">
                                <Link href="/operator/assets" className="text-[11px] tracking-[0.3em] font-bold text-white hover:text-[#ef4444] transition-colors uppercase">
                                    CANCEL
                                </Link>
                                <button className="bg-[#7be1ea] text-black font-extrabold text-[11px] tracking-[0.2em] px-12 py-5 rounded-sm uppercase hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(123,225,234,0.3)] transition-all">
                                    REGISTER ASSET
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}
