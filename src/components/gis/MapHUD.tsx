"use client";

import React, { useEffect, useState } from "react";
import { Asset } from "@/types/asset";
import { assetService } from "@/services/assetService";

export default function MapHUD() {
    const [stats, setStats] = useState({
        total: 0,
        available: 0,
        occupied: 0,
        expiring: 0,
        maintenance: 0,
        rate: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const assets = await assetService.getAssets();
                let available = 0;
                let occupied = 0;
                let expiring = 0;
                let maintenance = 0;

                assets.forEach(asset => {
                    let isOccupied = false;
                    let isExpiring = false;

                    if (asset.contracts && asset.contracts.length > 0) {
                        const activeContract = asset.contracts.find(c => c.status === 'Active' || c.status === 'Approved');
                        if (activeContract) {
                            isOccupied = true;
                            // Check expiring logic here if needed
                        }
                    }

                    if (isOccupied) {
                        if (isExpiring) expiring++;
                        else occupied++;
                    } else {
                        if (asset.status?.toLowerCase() === 'maintenance' || asset.status?.toLowerCase() === 'problem') {
                            maintenance++;
                        } else {
                            available++;
                        }
                    }
                });

                const total = assets.length;
                const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;

                setStats({ total, available, occupied, expiring, maintenance, rate });
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="absolute right-6 bottom-6 flex flex-col items-end gap-3 z-30 pointer-events-none">
            
            {/* Quick Stats Panel */}
            <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-2xl pointer-events-auto flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Aset</span>
                    <span className="text-2xl font-black text-white leading-none">{stats.total}</span>
                </div>
                <div className="w-px h-10 bg-slate-700" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Occupancy Rate</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white leading-none">{stats.rate}</span>
                        <span className="text-sm font-bold text-blue-400">%</span>
                    </div>
                </div>
            </div>

            {/* Legend Panel */}
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200 shadow-lg pointer-events-auto w-48">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-2 border-b border-slate-100">
                    Legenda Status
                </h3>
                <ul className="flex flex-col gap-2">
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-xs font-semibold text-slate-700">Available</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{stats.available}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                            <span className="text-xs font-semibold text-slate-700">Occupied</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{stats.occupied}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]"></div>
                            <span className="text-xs font-semibold text-slate-700">Expiring</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{stats.expiring}</span>
                    </li>
                    <li className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                            <span className="text-xs font-semibold text-slate-700">Maintenance</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{stats.maintenance}</span>
                    </li>
                </ul>
            </div>

        </div>
    );
}
