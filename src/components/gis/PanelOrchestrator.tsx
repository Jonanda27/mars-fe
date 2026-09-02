"use client";

import React, { useEffect, useState } from "react";
import { X, ExternalLink, Building, Info, AlertTriangle } from "lucide-react";
import { useGisStore, GisPanelType } from "@/store/useGisStore";
import { Asset } from "@/types/asset";
import { assetService } from "@/services/assetService";
import { formatRupiah } from "@/utils/formatCurrency";
import Link from "next/link";

export default function PanelOrchestrator() {
    const { activePanels, closePanel, closePanelsToTheRight, selectedAsset } = useGisStore();

    if (activePanels.length === 0) return null;

    return (
        <div className="absolute top-16 bottom-0 left-16 flex z-40 pointer-events-none">
            {activePanels.map((panel, index) => {
                const zIndex = 50 + index;
                return (
                    <div
                        key={panel.type}
                        className="h-full bg-white/95 backdrop-blur-md border-r border-slate-200 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.1)] pointer-events-auto flex flex-col transition-all duration-300 w-80 animate-in slide-in-from-left-4"
                        style={{ zIndex }}
                        onClick={() => closePanelsToTheRight(index)}
                    >
                        {/* Header Panel */}
                        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 bg-slate-50/50 flex-shrink-0">
                            <h2 className="font-bold text-sm uppercase tracking-wider text-slate-800">
                                {panel.title}
                            </h2>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closePanelsToTheRight(index - 1);
                                }}
                                className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Konten Panel */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 custom-scrollbar">
                            {panel.type === "katalog-aset" && <KatalogAsetPanel />}
                            {panel.type === "detail-aset" && selectedAsset && <DetailAsetPanel asset={selectedAsset} />}
                            {panel.type === "tentang" && <TentangPanel />}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// --- SUB-PANELS ---

function KatalogAsetPanel() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const { setSelectedAsset, openPanel } = useGisStore();

    useEffect(() => {
        assetService.getAssets().then(data => {
            setAssets(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-center text-sm text-slate-500 mt-10">Memuat katalog aset...</div>;

    return (
        <div className="flex flex-col gap-3">
            {assets.map(asset => {
                let status = asset.status || 'Available';
                if (asset.contracts && asset.contracts.length > 0) {
                    const activeContract = asset.contracts.find(c => c.status === 'Active' || c.status === 'Approved');
                    if (activeContract) status = 'Occupied';
                }

                let color = "bg-green-500";
                if (status === 'Occupied') color = "bg-blue-600";
                if (status === 'Expiring') color = "bg-yellow-400";
                if (status === 'Maintenance' || status === 'Problem') color = "bg-red-600";

                return (
                    <div 
                        key={asset.id} 
                        className="group p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => {
                            setSelectedAsset(asset);
                            openPanel("detail-aset", `Detail Aset: ${asset.kode_aset}`);
                        }}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-800 text-sm">{asset.kode_aset}</span>
                            <div className={`w-2 h-2 rounded-full ${color} mt-1.5`} />
                        </div>
                        <div className="text-xs text-slate-600 font-medium mb-2">{asset.nama_aset}</div>
                        <div className="flex justify-between items-end text-[10px] text-slate-500">
                            <span>{asset.jenis_aset}</span>
                            <span>{asset.luas} {asset.satuan}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function DetailAsetPanel({ asset }: { asset: Asset }) {
    let status = asset.status || 'Available';
    let tenantName = null;
    let contractValue = 0;
    
    if (asset.contracts && asset.contracts.length > 0) {
        const activeContract = asset.contracts.find(c => c.status === 'Active' || c.status === 'Approved');
        if (activeContract) {
            status = 'Occupied';
            tenantName = activeContract.tenants?.nama_perusahaan;
            contractValue = Number(activeContract.total_amount || 0);
        }
    }

    let statusColor = "text-green-600 bg-green-50 border-green-200";
    if (status === 'Occupied') statusColor = "text-blue-700 bg-blue-50 border-blue-200";
    if (status === 'Expiring') statusColor = "text-yellow-700 bg-yellow-50 border-yellow-200";
    if (status === 'Maintenance' || status === 'Problem') statusColor = "text-red-700 bg-red-50 border-red-200";

    return (
        <div className="flex flex-col">
            <div className="w-full h-32 bg-slate-100 rounded-lg border border-slate-200 mb-4 flex items-center justify-center overflow-hidden">
                {asset.foto ? (
                    <img src={asset.foto} alt={asset.nama_aset} className="w-full h-full object-cover" />
                ) : (
                    <Building className="w-10 h-10 text-slate-300" />
                )}
            </div>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-black text-xl text-slate-800 leading-tight">{asset.kode_aset}</h3>
                    <p className="text-sm font-medium text-slate-600">{asset.nama_aset}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${statusColor}`}>
                    {status}
                </span>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Informasi Dasar</h4>
                    <ul className="text-xs text-slate-700 space-y-1">
                        <li className="flex justify-between"><span className="text-slate-500">Jenis Aset</span> <span className="font-semibold">{asset.jenis_aset}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Luas</span> <span className="font-semibold">{asset.luas} {asset.satuan}</span></li>
                        <li className="flex justify-between"><span className="text-slate-500">Lokasi</span> <span className="font-semibold">{asset.lokasi || '-'}</span></li>
                    </ul>
                </div>

                <div className="h-px w-full bg-slate-100" />

                <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Penyewaan</h4>
                    {tenantName ? (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="text-[10px] text-slate-500 mb-0.5">Disewa oleh:</div>
                            <div className="font-bold text-sm text-slate-800 mb-2">{tenantName}</div>
                            <div className="text-[10px] text-slate-500 mb-0.5">Nilai Kontrak:</div>
                            <div className="font-bold text-blue-600">{formatRupiah(contractValue)}</div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center flex flex-col items-center justify-center">
                            <Info className="w-5 h-5 text-slate-400 mb-1" />
                            <span className="text-xs text-slate-500">Aset ini belum memiliki penyewa aktif.</span>
                        </div>
                    )}
                </div>
                
                <Link 
                    href={`/admin/aset`}
                    className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors"
                >
                    Kelola Aset <ExternalLink size={14} />
                </Link>
            </div>
        </div>
    );
}

function TentangPanel() {
    return (
        <div className="text-sm text-slate-600">
            <p className="mb-4">
                <strong>MARS GIS (Geographic Information System)</strong> adalah modul visualisasi aset dari <em>Mimika Airport Revenue System</em>.
            </p>
            <p className="mb-4">
                Sistem ini memungkinkan Kepala Dinas dan jajaran manajemen untuk memantau status utilisasi aset (seperti Hanggar, Ruangan, Lahan) secara <em>real-time</em> melalui representasi peta spasial.
            </p>
            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg border border-blue-100 text-xs">
                <AlertTriangle className="w-4 h-4 mb-2 text-blue-600" />
                Titik koordinat yang ditampilkan saat ini adalah estimasi untuk keperluan demonstrasi sistem.
            </div>
        </div>
    );
}
