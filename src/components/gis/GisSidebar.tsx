"use client";

import React, { useMemo } from "react";
import { Building2, Layers, Info } from "lucide-react";
import { useGisStore, GisPanelType } from "@/store/useGisStore";

export default function GisSidebar() {
    const { openPanel, activePanels, closePanelsToTheRight } = useGisStore();

    const navigationItems = useMemo(() => {
        const items = [];
        
        items.push({
            type: "katalog-aset" as GisPanelType,
            label: "Katalog",
            icon: Building2,
            title: "Katalog & Status Aset"
        });
        
        return items;
    }, []);

    const isPanelActive = (type: GisPanelType) => {
        return activePanels.some(p => p.type === type);
    };

    const handleNavClick = (item: typeof navigationItems[0]) => {
        closePanelsToTheRight(-1);
        openPanel(item.type, item.title);
    };

    return (
        <aside className="absolute top-16 bottom-0 left-0 w-16 flex flex-col items-center bg-white/95 backdrop-blur-md border-r border-slate-200 z-40 pointer-events-auto shadow-sm">
            <div className="flex-1 flex flex-col items-center w-full pt-2">
                {navigationItems.map((item, index) => {
                    const isActive = isPanelActive(item.type);

                    return (
                        <div key={index} className="relative group w-full flex justify-center">
                            <button
                                onClick={() => handleNavClick(item)}
                                className={`w-full h-16 flex flex-col items-center justify-center gap-1 transition-colors relative active:bg-slate-100 rounded-none outline-none
                                    ${isActive
                                        ? "bg-blue-50 text-blue-700 border-l-[3px] border-blue-600"
                                        : "bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-800 border-l-[3px] border-transparent"
                                    }`}
                            >
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[8px] font-bold uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-70"}`}>
                                    {item.label}
                                </span>
                            </button>

                            {/* Tooltip */}
                            <div className="absolute top-1/2 left-full -translate-y-1/2 ml-1 px-3 py-2 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {item.title}
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 rounded-none" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Menu Bawah (Info / Bantuan) */}
            <div className="flex flex-col items-center w-full mt-auto mb-2">
                <div className="w-8 h-px bg-slate-200 mb-1" />

                <div className="relative group w-full flex justify-center">
                    <button
                        onClick={() => {
                            closePanelsToTheRight(-1);
                            openPanel("tentang", "Informasi Sistem GIS");
                        }}
                        className={`w-full h-16 flex items-center justify-center transition-colors relative active:bg-slate-100 rounded-none outline-none border-l-[3px] ${isPanelActive("tentang") ? "bg-blue-50 text-blue-700 border-blue-600" : "bg-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-800 border-transparent"}`}
                    >
                        <Info size={20} strokeWidth={isPanelActive("tentang") ? 2.5 : 2} />
                    </button>

                    <div className="absolute top-1/2 left-full -translate-y-1/2 ml-1 px-3 py-2 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        Informasi Sistem
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 rounded-none" />
                    </div>
                </div>
            </div>
        </aside>
    );
}
