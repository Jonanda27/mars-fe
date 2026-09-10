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
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { Stepper } from '@/components/Stepper';

const resolveUrl = (url: string | null | undefined) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || '';
  return `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
};

export default function ReviewPermohonanPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [app, setApp] = useState<RentalApplication | null>(null);
  
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');

  const [assetCapacity, setAssetCapacity] = useState<{ isHangar: boolean, totalArea: number, usedArea: number, remainingArea: number } | null>(null);
  const [fetchingCapacity, setFetchingCapacity] = useState(false);

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
      
      if (appData.asset_id) {
        fetchCapacity(appData.asset_id.toString());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCapacity = async (idStr: string) => {
    setFetchingCapacity(true);
    try {
      const capacity = await assetService.getAssetCapacity(parseInt(idStr));
      setAssetCapacity(capacity);
    } catch (err) {
      console.error(err);
      setAssetCapacity(null);
    } finally {
      setFetchingCapacity(false);
    }
  };

  const handleAssetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedAssetId(val);
    if (val) {
      fetchCapacity(val);
    } else {
      setAssetCapacity(null);
    }
  };

  // Calculate required area based on application details
  const calculateRequiredArea = () => {
    let area = 0;
    if (app?.specific_needs?.aircraft_details && Array.isArray(app.specific_needs.aircraft_details)) {
      app.specific_needs.aircraft_details.forEach((ac: any) => {
        if (ac.aircraft_types && ac.aircraft_types.luas_efektif_m2) {
          area += parseFloat(ac.aircraft_types.luas_efektif_m2);
        }
      });
    }
    return area;
  };
  const requiredArea = calculateRequiredArea();
  const isOverCapacity = assetCapacity?.isHangar && requiredArea > assetCapacity.remainingArea;

  const handleVerifyLetter = async (status: string) => {
    if (confirm(`Apakah Anda yakin ingin menandai surat ini sebagai ${status}?`)) {
      setSaving(true);
      try {
        await api.patch(`/rentals/${id}/verify-letter`, { status });
        toast.success(`Surat permohonan berhasil ${status === 'Surat Disetujui' ? 'disetujui' : 'ditolak'}!`);
        fetchData();
      } catch (error: any) {
        toast.error('Gagal update status: ' + error.message);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleAction = async (status: string) => {
    if ((status === 'Approved' || status === 'Draft Kontrak') && !selectedAssetId) {
      toast.error('Anda harus menetapkan alokasi aset sebelum menyetujui permohonan!');
      return;
    }
    
    if ((status === 'Approved' || status === 'Draft Kontrak') && isOverCapacity) {
      toast.error('Kapasitas hanggar tidak mencukupi untuk jumlah armada yang diajukan. Silakan pilih hanggar lain atau tolak permohonan.');
      return;
    }
    
    if (confirm(`Apakah Anda yakin ingin menandai permohonan ini sebagai ${status}?`)) {
      setSaving(true);
      try {
        if (status === 'Draft Kontrak') {
          // If asset is selected but not yet saved in application, save it first
          if (app?.asset_id?.toString() !== selectedAssetId) {
             await rentalService.updateApplicationStatus(parseInt(id), 'Reviewed', parseInt(selectedAssetId));
          }
          await api.patch(`/rentals/${id}/approve-kadis`);
          toast.success('Validasi berhasil! Draft PKS berhasil dibuat otomatis.');
        } else {
          await rentalService.updateApplicationStatus(parseInt(id), status, parseInt(selectedAssetId));
        }
        router.push('/admin/permohonan');
      } catch (error: any) {
        toast.error('Gagal update status: ' + error.message);
        setSaving(false);
      }
    }
  };

  const getStepNumber = (status: string) => {
    if (status === 'Menunggu Verifikasi Kadis' || status === 'Pending') return 1;
    if (status === 'Surat Disetujui') return 2;
    if (status === 'Menunggu Validasi Admin' || status === 'Reviewed') return 3;
    if (status === 'Draft Kontrak' || status === 'Approved') return 4;
    if (status === 'Signed') return 5;
    if (status === 'Active') return 6;
    return 1;
  };

  if (loading || !app) {
    return <div className="p-10 text-center flex justify-center min-h-screen items-center"><Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc]" /></div>;
  }

  const currentStep = getStepNumber(app.status);
  const isKadisStep = app.status === 'Menunggu Verifikasi Kadis';
  const isAdminStep = app.status === 'Menunggu Validasi Admin';

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
            <div className="bg-slate-200 px-4 py-1.5 rounded-full text-sm font-bold text-slate-700 uppercase tracking-wide">
              {app.status}
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">ID Ref: <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{app.application_number}</span></p>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Kolom Kiri: Informasi Rinci */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Informasi Tenant */}
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-[#3c8dbc] px-5 py-4 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold tracking-wide">Profil Perusahaan Tenant</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-start gap-4 pb-6 border-b border-slate-100 mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-[#3c8dbc] flex-shrink-0">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{app.tenants?.nama_perusahaan}</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wider border border-slate-200">
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
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-[#3c8dbc] px-5 py-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-white" />
              <h2 className="text-white font-semibold tracking-wide">Rencana Sewa & Spesifikasi</h2>
            </div>
            
            <div className="p-6">
              
              <div className="mb-6 bg-slate-50 border border-slate-200 rounded-none p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tujuan / Perihal</p>
                <p className="text-slate-800 font-bold text-lg">{app.purpose || '-'}</p>
              </div>

              {app.official_letter_url && (
                <div className="mb-6 bg-slate-50 border border-slate-200 rounded-none p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Dokumen Surat Permohonan Resmi</p>
                    <p className="text-slate-700 font-medium text-sm">Lampiran permohonan yang ditandatangani.</p>
                  </div>
                  <a href={resolveUrl(app.official_letter_url)} target="_blank" rel="noopener noreferrer" className="bg-[#3c8dbc] hover:bg-[#347ea8] text-white px-4 py-2 rounded-none text-sm font-bold flex items-center shadow-sm">
                    <FileText className="w-4 h-4 mr-2" /> Lihat PDF
                  </a>
                </div>
              )}

              {app.contracts?.signed_document_url && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-none p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Dokumen PKS (Telah Ditandatangani Tenant)</p>
                    <p className="text-emerald-800 font-medium text-sm">Draft PKS yang telah ditandatangani dan diunggah oleh tenant.</p>
                  </div>
                  <a href={resolveUrl(app.contracts.signed_document_url)} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-none text-sm font-bold flex items-center shadow-sm">
                    <FileText className="w-4 h-4 mr-2" /> Lihat PDF PKS
                  </a>
                </div>
              )}

              {/* Only show these details if tenant has completed them */}
              {currentStep >= 3 && app.application_type && (
                <>
                  <div className="mb-6 bg-slate-50 border border-slate-200 rounded-none p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tipe Permohonan Layanan</p>
                    <p className="text-slate-800 font-bold text-lg">{app.application_type}</p>
                  </div>

                  {/* Timeline Periode Sewa */}
                  <div className="mb-8 bg-slate-50 p-5 rounded-none border border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> Periode Pemanfaatan</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white p-3 rounded-none shadow-sm border border-slate-200">
                        <p className="text-[11px] text-slate-500 mb-1">Tanggal Mulai</p>
                        <p className="font-bold text-slate-800">{app.start_date ? dayjs(app.start_date).format('DD MMMM YYYY') : '-'}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <div className="flex-1 bg-white p-3 rounded-none shadow-sm border border-slate-200">
                        <p className="text-[11px] text-slate-500 mb-1">Tanggal Selesai</p>
                        <p className="font-bold text-slate-800">{app.end_date ? dayjs(app.end_date).format('DD MMMM YYYY') : '-'}</p>
                      </div>
                      <div className="w-32 bg-[#3c8dbc] text-white p-3 rounded-none shadow-sm flex flex-col items-center justify-center flex-shrink-0">
                        <p className="text-[10px] text-white/80 uppercase tracking-wider mb-0.5">Durasi Sewa</p>
                        <p className="font-bold text-lg">
                          {(() => {
                            if (!app.end_date || !app.start_date) return '-';
                            const diff = dayjs(app.end_date).diff(dayjs(app.start_date), 'day');
                            return diff === 0 ? 1 : diff;
                          })()} Malam
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center"><Plane className="w-4 h-4 mr-1.5" /> Kebutuhan Spesifik Aset (Armada Pesawat)</p>
                      <ul className="space-y-3 bg-slate-50 p-4 rounded-none border border-slate-100 min-h-[80px]">
                        <li className="flex flex-col">
                          <span className="text-[11px] text-slate-500 mb-2">Daftar Pesawat yang akan dimasukkan ke Hanggar (Registrasi - Tipe - MTOW)</span>
                          {app.specific_needs?.aircraft_details && Array.isArray(app.specific_needs.aircraft_details) && app.specific_needs.aircraft_details.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                               {app.specific_needs.aircraft_details.map((ac: any) => (
                                 <div key={ac.id} className="text-sm font-medium text-slate-800 bg-white border border-slate-200 px-3 py-2 rounded-none shadow-sm flex flex-col">
                                   <span className="font-bold text-[#3c8dbc]">{ac.registration_number}</span>
                                   <span>{ac.aircraft_type || ac.aircraft_types?.jenis_pesawat || '-'}</span>
                                   <span className="text-xs text-slate-500 font-mono mt-1 pt-1 border-t border-slate-100 flex items-center gap-2">
                                     <span>{ac.mtow ? `MTOW: ${ac.mtow.toLocaleString('id-ID')} Kg` : 'MTOW: N/A'}</span>
                                     {ac.aircraft_types?.luas_efektif_m2 && (
                                       <span className="text-slate-600 bg-slate-100 px-1 rounded-none border border-slate-200">Luas: {ac.aircraft_types.luas_efektif_m2} m²</span>
                                     )}
                                   </span>
                                 </div>
                               ))}
                            </div>
                          ) : (
                            <span className="font-medium text-slate-800 italic text-sm">Tidak ada pesawat yang dipilih (Bukan Sewa Hanggar)</span>
                          )}
                        </li>
                        {app.specific_needs?.facilities && (
                          <li className="flex flex-col mt-4 pt-4 border-t border-slate-200">
                            <span className="text-[11px] text-slate-500">Ruang / Fasilitas Pendukung Khusus</span>
                            <span className="font-medium text-slate-800">{app.specific_needs.facilities}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </>
              )}
              {currentStep < 3 && (
                <div className="mt-4 bg-slate-100 border border-slate-200 rounded-none p-6 text-center text-slate-500">
                  <p>Tenant belum melengkapi detail layanan sewa.</p>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Kolom Kanan: Action Panel (Sticky) */}
        <div className="lg:col-span-1 sticky top-6">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-[#3c8dbc] px-5 py-4">
              <h2 className="text-white font-bold tracking-wide flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-white/90" /> Tindak Lanjut & Validasi
              </h2>
            </div>
            
            <div className="p-5">
              
              {isKadisStep && user?.role?.toLowerCase() === 'kadis' && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-800 mb-1">Persetujuan Surat Permohonan</label>
                  <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                    Mohon periksa dokumen lampiran Surat Permohonan Resmi. Jika sesuai, silakan berikan persetujuan agar Tenant dapat melanjutkan ke tahap pengisian detail layanan.
                  </p>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleVerifyLetter('Surat Disetujui')} 
                      disabled={saving} 
                      className={`w-full text-white py-3 px-4 rounded-none font-bold transition-all flex justify-center items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md bg-green-600 hover:bg-green-700`}
                    >
                      {saving && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                      Setujui Surat
                    </button>
                    
                    <button 
                      onClick={() => handleVerifyLetter('Ditolak')} 
                      disabled={saving} 
                      className="w-full bg-white hover:bg-red-50 text-red-600 border-2 border-red-100 hover:border-red-200 py-2.5 px-4 rounded-none font-bold transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Tolak Permohonan
                    </button>
                  </div>
                </div>
              )}

              {isKadisStep && user?.role?.toLowerCase() === 'admin' && (
                <div className="text-center p-4">
                  <p className="text-sm text-slate-500 font-medium">Menunggu Verifikasi Kepala Dinas (Kadis)</p>
                </div>
              )}

              {(isAdminStep || currentStep > 3) && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-800 mb-1">Alokasikan Aset <span className="text-red-500">*</span></label>
                  <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                    Admin harus menetapkan alokasi aset definitif kepada tenant.
                  </p>
                  <div className="relative">
                    <select 
                      value={selectedAssetId} 
                      onChange={handleAssetSelect} 
                      disabled={!isAdminStep || saving || (user?.role?.toLowerCase() !== 'admin' && isAdminStep)}
                      className="w-full border-2 border-slate-200 px-3 py-2.5 rounded-none text-sm outline-none focus:border-[#3c8dbc] focus:ring-4 focus:ring-blue-50 bg-white disabled:bg-slate-100 disabled:text-slate-500 transition-all font-medium appearance-none"
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
                      <div className="mt-3">
                        <div className="bg-slate-50 p-2 rounded-none text-xs text-slate-700 flex items-start gap-2 border border-slate-200 mb-2">
                          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {isHanggar ? (
                            <p>Penagihan sewa hanggar <strong>dihitung otomatis per unit pesawat per malam</strong>.</p>
                          ) : (
                            <p>Tarif Dasar Aset: <strong>{formatRupiah((asset as any)?.tarif_dasar || (asset as any)?.master_tariffs?.tarif)} / {(asset as any)?.satuan}</strong></p>
                          )}
                        </div>
                        
                        {isHanggar && fetchingCapacity && (
                          <div className="text-xs text-slate-500 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin"/> Mengecek kapasitas...</div>
                        )}
                        
                        {isHanggar && assetCapacity && !fetchingCapacity && (
                          <div className={`p-3 border rounded-none ${isOverCapacity ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-semibold text-slate-700">Kapasitas Hanggar</span>
                              <span className={`text-xs font-bold ${isOverCapacity ? 'text-red-600' : 'text-emerald-600'}`}>
                                Sisa: {assetCapacity.remainingArea} m²
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-none h-2 mb-2">
                              <div className={`${isOverCapacity ? 'bg-red-500' : 'bg-[#3c8dbc]'} h-2 rounded-none`} style={{ width: `${Math.min(100, (assetCapacity.usedArea / assetCapacity.totalArea) * 100)}%` }}></div>
                            </div>
                            <div className="text-[10px] text-slate-500 flex justify-between mb-2">
                              <span>Terpakai: {assetCapacity.usedArea} m²</span>
                              <span>Total: {assetCapacity.totalArea} m²</span>
                            </div>
                            <div className={`text-[11px] font-bold p-1.5 rounded-none text-center ${isOverCapacity ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                              Kebutuhan Pemohon: {requiredArea} m²
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {isAdminStep && user?.role?.toLowerCase() === 'admin' && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => handleAction('Draft Kontrak')} 
                    disabled={saving || isOverCapacity} 
                    className={`w-full text-white py-3 px-4 rounded-none font-bold transition-all flex justify-center items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md ${isOverCapacity ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {saving && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                    Validasi & Buat Draft Kontrak
                  </button>
                  
                  <button 
                    onClick={() => handleAction('Rejected')} 
                    disabled={saving} 
                    className="w-full bg-white hover:bg-red-50 text-red-600 border-2 border-red-100 hover:border-red-200 py-2.5 px-4 rounded-none font-bold transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Tolak Permohonan
                  </button>
                </div>
              )}

              {isAdminStep && user?.role === 'Kadis' && (
                <div className="text-center p-4">
                  <p className="text-sm text-slate-500 font-medium">Menunggu Validasi Aset oleh Admin</p>
                </div>
              )}

              {currentStep > 3 && (
                <div className="pt-4 border-t border-slate-100">
                  <div className={`p-4 rounded-lg flex flex-col gap-2 items-center text-center
                    ${app.status === 'Signed' || app.status === 'Draft Kontrak' || app.status === 'Approved' ? 'bg-blue-50 border border-blue-100' : 'bg-red-50 border border-red-100'}
                  `}>
                    {app.status === 'Signed' || app.status === 'Draft Kontrak' || app.status === 'Approved' ? (
                      <CheckCircle2 className="w-10 h-10 text-blue-500 mb-1" />
                    ) : (
                      <X className="w-10 h-10 text-red-500 mb-1" />
                    )}
                    
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Status Saat Ini</p>
                      <p className={`text-lg font-bold ${app.status === 'Signed' || app.status === 'Draft Kontrak' || app.status === 'Approved' ? 'text-blue-700' : 'text-red-700'}`}>
                        {app.status}
                      </p>
                    </div>

                    {app.status === 'Draft Kontrak' && (
                      <div className="w-full mt-3 flex flex-col gap-2">
                        <Link href={`/admin/kontrak`} className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 py-2 px-3 rounded-md text-[13px] font-semibold text-center transition-colors shadow-sm flex items-center justify-center">
                          Lihat Draft PKS di Menu Kontrak
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
