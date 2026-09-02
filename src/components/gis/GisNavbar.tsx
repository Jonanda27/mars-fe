"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, User, Activity } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGisStore } from "@/store/useGisStore";

export default function GisNavbar() {
    const { user } = useAuthStore();
    const { clearPanels, resetMapContext } = useGisStore();

    const handleLogoClick = () => {
        clearPanels();
        resetMapContext();
    };

    const initials = user?.username?.substring(0, 2).toUpperCase() || "AD";
    const roleLabel = user?.role || "Admin";

    return (
        <nav className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 pointer-events-auto shadow-sm">

            {/* KIRI: Back Button & Branding */}
            <div className="flex items-center gap-5">
                <Link
                    href="/admin"
                    className="group flex items-center gap-2 text-slate-500 hover:text-blue-700 transition-all rounded-none outline-none"
                    onClick={handleLogoClick}
                >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 transition-colors">
                        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:block">
                        Kembali
                    </span>
                </Link>

                <div className="w-px h-6 bg-slate-200" />

                <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
                    <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                        <Activity className="text-white w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-800 tracking-wide uppercase leading-tight">
                            MARS GIS
                        </span>
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-tight">
                            Airport Revenue System
                        </span>
                    </div>
                </div>
            </div>

            {/* KANAN: User Profile Minimalis */}
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-[11px] font-bold text-slate-700 capitalize">{user?.username || 'Admin'}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{roleLabel}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                    {initials}
                </div>
            </div>

        </nav>
    );
}
