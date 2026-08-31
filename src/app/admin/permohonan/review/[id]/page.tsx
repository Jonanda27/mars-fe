"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { rentalService } from '@/services/rentalService';
import { RentalApplication } from '@/types/rental';
import { assetService } from '@/services/assetService';
import { Asset } from '@/types/asset';
import { 
  FileText, Save, ArrowLeft, Check, X, Loader2, 
  Building2, User, Phone, Briefcase, Calendar, MapPin, Plane, AlertCircle, Info, ChevronRight, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';

export default function ReviewPermohonanPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [app, setApp] = useState<RentalApplication | null>(null);
  
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appData = await rentalService.getApplicationById(parseInt(id));
      setApp(appData);
      setSelectedAssetId(appData.asset_id?.toString() || '');

      const assetsData = await assetService.getAssets();
      const available = assetsData.filter(a => a.status === 'Available' || a.status === 'Tersedia' || a.id === appData.asset_id);
      setAvailableAssets(available);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status: string) => {
    if (status === 'Approved' && !selectedAssetId) {
      alert('Anda harus menetapkan alokasi aset sebelum menyetujui permohonan!');
      return;
    }
    
    if (confirm(`Apakah Anda yakin ingin menandai permohonan ini sebagai ${status}?`)) {
      setSaving(true);
      try {
        await rentalService.updateApplicationStatus(parseInt(id), status, parseInt(selectedAssetId));
        router.push('/admin/permohonan');
      } catch (error: any) {
        alert('Gagal update status: ' + error.message);
        setSaving(false);
      }
    }
  };

  if (loading || !app) {
    return <div className="p-10 text-center flex justify-center min-h-screen items-center"><Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc]" /></div>;
  }

  const isPending = app.status === 'Pending' || app.status === 'Reviewed';

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending':
      case 'Reviewed':
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Menunggu Tindakan</span>;
      case 'Approved':
        return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Disetujui</span>;
      case 'Rejected':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center"><X className="w-3 h-3 mr-1" /> Ditolak</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans">
      
      {/* Header & Breadcrumb */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link href="/admin/permohonan" className="inline-flex items-center text-sm text-slate-500 hover:text-[#3c8dbc] transition-colors mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Permohonan
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Review Permohonan Sewa</h1>
            {getStatusBadge(app.status)}
          </div>
          <p className="text-sm text-slate-500 mt-1">ID Ref: <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{app.application_number}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Kolom Kiri: Informasi Rinci */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Informasi Tenant */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 px-5 py-4 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-semibold tracking-wide">Profil Perusahaan Tenant</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-4 pb-6 border-b border-slate-100 mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{app.tenants?.nama_perusahaan}</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Verified Legal Entity
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">NIB Perusahaan</p>
                  <p className="text-slate-800 font-medium">{app.tenants?.nib || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">NPWP Perusahaan</p>
                  <p className="text-slate-800 font-mono font-medium">{app.tenants?.npwp || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">PIC / Kontak Representatif</p>
                  <div className="flex items-center gap-2 text-slate-800">
                    <User className="w-4 h-4 text-slate-400" /> <span className="font-medium">{app.tenants?.pic}</span>
                    <span className="text-slate-300">|</span>
                    <Phone className="w-4 h-4 text-slate-400" /> <span>{app.tenants?.nomor_telepon}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Rencana Sewa & Spesifikasi */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-500" />
              <h2 className="text-slate-800 font-semibold tracking-wide">Rencana Sewa & Spesifikasi</h2>
            </div>
            
            <div className="p-6">
              {/* Timeline Periode Sewa */}
              <div className="mb-8 bg-indigo-50/50 p-5 rounded-lg border border-indigo-100">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-4 flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> Periode Pemanfaatan</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-white p-3 rounded shadow-sm border border-indigo-50">
                    <p className="text-[11px] text-slate-500 mb-1">Tanggal Mulai</p>
                    <p className="font-bold text-slate-800">{dayjs(app.start_date).format('DD MMMM YYYY')}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-300 flex-shrink-0" />
                  <div className="flex-1 bg-white p-3 rounded shadow-sm border border-indigo-50">
                    <p className="text-[11px] text-slate-500 mb-1">Tanggal Selesai</p>
                    <p className="font-bold text-slate-800">{dayjs(app.end_date).format('DD MMMM YYYY')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center"><Briefcase className="w-4 h-4 mr-1.5" /> Tujuan Sewa</p>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100 min-h-[80px]">
                    {app.purpose}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center"><Plane className="w-4 h-4 mr-1.5" /> Kebutuhan Spesifik Aset</p>
                  <ul className="space-y-3 bg-slate-50 p-3 rounded-md border border-slate-100 min-h-[80px]">
                    <li className="flex flex-col">
                      <span className="text-[11px] text-slate-500">Jenis Pesawat / Armada</span>
                      <span className="font-medium text-slate-800">{app.specific_needs?.jenis_pesawat || '-'}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-[11px] text-slate-500">Max Take-Off Weight (MTOW)</span>
                      <span className="font-mono text-slate-800">{app.specific_needs?.mtow || '-'}</span>
                    </li>
                    <li className="flex flex-col">
                      <span className="text-[11px] text-slate-500">Ruang / Fasilitas Pendukung Khusus</span>
                      <span className="font-medium text-slate-800">{app.specific_needs?.kebutuhan_ruang_pendukung || '-'}</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Kolom Kanan: Action Panel (Sticky) */}
        <div className="lg:col-span-1 sticky top-6">
          <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden ring-1 ring-black/5">
            <div className="bg-gradient-to-r from-[#3c8dbc] to-blue-500 px-5 py-4">
              <h2 className="text-white font-bold tracking-wide flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-blue-100" /> Tindak Lanjut & Alokasi
              </h2>
            </div>
            
            <div className="p-5">
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-800 mb-1">Alokasikan Aset <span className="text-red-500">*</span></label>
                <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                  Pilih aset hanggar/ruang yang akan ditetapkan secara definitif kepada tenant berdasarkan spesifikasi dan ketersediaan.
                </p>
                <div className="relative">
                  <select 
                    value={selectedAssetId} 
                    onChange={(e) => setSelectedAssetId(e.target.value)} 
                    disabled={!isPending || saving}
                    className="w-full border-2 border-slate-200 px-3 py-2.5 rounded-lg text-sm outline-none focus:border-[#3c8dbc] focus:ring-4 focus:ring-blue-50 bg-white disabled:bg-slate-100 disabled:text-slate-500 transition-all font-medium appearance-none"
                  >
                    <option value="">-- Silakan Pilih Aset --</option>
                    {availableAssets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.kode_aset} - {asset.nama_aset}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
                {selectedAssetId && (() => {
                  const asset = availableAssets.find(a => a.id.toString() === selectedAssetId);
                  const isHanggar = asset?.jenis_aset?.toLowerCase().includes('hanggar');
                  
                  return (
                    <div className="mt-2 bg-blue-50 p-2 rounded text-xs text-blue-800 flex items-start gap-2 border border-blue-100">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {isHanggar ? (
                        <p>Penagihan sewa hanggar <strong>dihitung otomatis per unit pesawat per malam</strong> sesuai Master Tarif Perbup berdasarkan jenis armada, bukan berdasarkan luas gedung.</p>
                      ) : (
                        <p>Tarif Dasar Aset: <strong>{formatRupiah((asset as any)?.tarif_dasar || (asset as any)?.master_tariffs?.tarif)} / {(asset as any)?.satuan}</strong></p>
                      )}
                    </div>
                  );
                })()}
              </div>

              {isPending ? (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => handleAction('Approved')} 
                    disabled={saving} 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-bold transition-all flex justify-center items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Check className="w-5 h-5 mr-2" />}
                    Setujui & Terbitkan Kontrak
                  </button>
                  
                  <button 
                    onClick={() => handleAction('Rejected')} 
                    disabled={saving} 
                    className="w-full bg-white hover:bg-red-50 text-red-600 border-2 border-red-100 hover:border-red-200 py-2.5 px-4 rounded-lg font-bold transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />}
                    Tolak Permohonan
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-100">
                  <div className={`p-4 rounded-lg flex flex-col gap-2 items-center text-center
                    ${app.status === 'Approved' ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}
                  `}>
                    {app.status === 'Approved' ? (
                      <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-1" />
                    ) : (
                      <X className="w-10 h-10 text-red-500 mb-1" />
                    )}
                    
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Status Saat Ini</p>
                      <p className={`text-lg font-bold ${app.status === 'Approved' ? 'text-emerald-700' : 'text-red-700'}`}>
                        {app.status === 'Approved' ? 'Disetujui' : 'Ditolak'}
                      </p>
                    </div>

                    {app.status === 'Approved' && app.contracts && app.contracts.length > 0 && (
                      <Link href={`/admin/kontrak/${app.contracts[0].id}`} className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white px-3 py-1.5 rounded-full border border-blue-200 shadow-sm transition-colors w-full">
                        Lihat Kontrak Sewa &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              )}
              
            </div>
          </div>
          
          <div className="mt-4 bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
            <p className="leading-relaxed">Pastikan alokasi aset tidak tumpang tindih dengan kontrak yang masih berjalan. Sistem MARS akan mengecek utilisasi aset sebelum menyimpan.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
