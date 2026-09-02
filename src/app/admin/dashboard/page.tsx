"use client";

import React, { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { assetService } from '@/services/assetService';
import { Asset } from '@/types/asset';

import GisNavbar from '@/components/gis/GisNavbar';
import GisSidebar from '@/components/gis/GisSidebar';
import MapHUD from '@/components/gis/MapHUD';
import PanelOrchestrator from '@/components/gis/PanelOrchestrator';

// Import GisMapClientWrapper secara dinamis (Bypass SSR untuk Leaflet)
const GisMapDynamic = dynamic(
    () => import('@/components/GisMap'),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                <p className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] animate-pulse">
                    Memuat Kanvas Spasial...
                </p>
            </div>
        ),
    }
);

export default function GisDashboardPage() {
    const [assets, setAssets] = useState<Asset[]>([]);

    useEffect(() => {
        assetService.getAssets().then(data => {
            setAssets(data);
        }).catch(console.error);
    }, []);

    return (
        <main className="relative h-dvh w-screen overflow-hidden bg-slate-950 font-sans text-slate-800 selection:bg-blue-200 selection:text-blue-900">

            {/* LAYER 0: PETA GIS */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={<div className="h-full w-full bg-slate-900" />}>
                    <GisMapDynamic assets={assets} />
                </Suspense>
            </div>

            {/* LAYER UI: Dipanggil secara langsung tanpa dibungkus div absolute lagi */}
            <GisNavbar />
            <GisSidebar />
            <PanelOrchestrator />
            <MapHUD />

        </main>
    );
}
