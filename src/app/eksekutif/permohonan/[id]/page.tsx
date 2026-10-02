"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { rentalService } from '@/services/rentalService';
import { resolveUrl } from '@/utils/url';
import { getErrorMessage } from '@/services/api';
import { RentalApplication } from '@/types/rental';
import { 
  FileText, ArrowLeft, Loader2, CheckCircle2, XCircle, 
  Building2, Calendar, MapPin, ExternalLink, Download, 
  Clock, Plane, ShieldCheck, UserCheck 
} from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/StatusBadge';
import dayjs from 'dayjs';

export default function EksekutifPermohonanDetailPage() {
  const params = useParams();
  const { id } = params as { id: string };
  
  const [app, setApp] = useState<RentalApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const data = await rentalService.getApplicationById(Number(id));
      setApp(data);
    } catch (error) {
      console.error('Error fetching details:', error);
      toast.error('Gagal mengambil data permohonan.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLetter = async (newStatus: 'Surat Disetujui' | 'Ditolak') => {
    try {
      setProcessing(true);
      await rentalService.verifyLetter(Number(id), newStatus);
      toast.success(`Permohonan berhasil ${newStatus === 'Surat Disetujui' ? 'disetujui' : 'ditolak'}`);
      fetchApplicationDetails();
    } catch (error: any) {
      console.error('Error verifying letter:', error);
      toast.error(getErrorMessage(error) || 'Gagal memperbarui status permohonan.');
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveContract = async () => {
    try {
      setProcessing(true);
      await rentalService.approveKadis(Number(id));
      toast.success('Kontrak PKS berhasil disahkan dan disetujui');
      fetchApplicationDetails();
    } catch (error: any) {
      console.error('Error approving contract:', error);
      toast.error(getErrorMessage(error) || 'Gagal mengesahkan kontrak.');
    } finally {
      setProcessing(false);
    }
  };

  const rentalDuration = useMemo(() => {
    if (!app?.start_date || !app?.end_date) return null;
    const start = dayjs(app.start_date);
    const end = dayjs(app.end_date);
    const diff = end.diff(start, 'day');
    return Math.max(1, diff);
  }, [app?.start_date, app?.end_date]);

  const aircraftDetails = useMemo(() => {
    if (!app?.specific_needs) return [];
    const spec = app.specific_needs as any;
    if (Array.isArray(spec.aircraft_details) && spec.aircraft_details.length > 0) {
      return spec.aircraft_details;
    }
    return [];
  }, [app?.specific_needs]);

  const isExtension = Boolean(
    app?.application_type?.toLowerCase().includes('perpanjangan') ||
    (app?.specific_needs as any)?.extend_from_contract_id
  );

  if (loading || !app) {
    return (
      <div className="p-10 text-center flex flex-col justify-center min-h-[400px] items-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc]" />
        <span className="text-sm font-bold text-[#777]">Memuat berkas permohonan Kepala Dinas...</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-[calc(100vh-60px)] space-y-4 font-sans">
      
      {/* Header & Navigasi Eksekutif */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <Link 
            href="/eksekutif/permohonan" 
            className="inline-flex items-center text-[12px] font-bold text-[#3c8dbc] hover:text-[#367fa9] transition-colors mb-1.5"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Persetujuan
          </Link>
          <h1 className="text-[22px] font-normal text-[#333] flex items-baseline gap-2">
            Detail Permohonan Sewa
            <span className="text-[14px] text-[#777] font-mono font-normal">
              ({app.application_number})
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={app.status} className="text-xs px-3.5 py-1 font-bold shadow-2xs" />
          <div className="text-[12px] text-[#777] items-center bg-white border border-[#e0e0e0] px-3 py-1.5 shadow-2xs hidden sm:flex rounded-none">
            <span className="mr-1">Eksekutif Portal</span> / <span className="ml-1 font-bold text-slate-800">Tinjauan Permohonan</span>
          </div>
        </div>
      </header>

      {/* Action Card 1: Tahap Menunggu Verifikasi Kadis (Surat Permohonan Masuk) */}
      {app.status === 'Menunggu Verifikasi Kadis' && (
        <div className="bg-white border-t-[3px] border-[#f39c12] border-l-4 border-l-[#f39c12] shadow-sm p-4 sm:p-5 rounded-none">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f39c12] text-white px-2 py-0.5 rounded">
                  Disposisi Kepala Dinas
                </span>
                <h3 className="text-[16px] font-bold text-[#333]">
                  Tindakan: Persetujuan Surat Permohonan Sewa
                </h3>
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed max-w-3xl">
                Silakan telaah kelengkapan surat resmi, legalitas pemohon, dan objek aset yang diminati di bawah ini sebelum menandatangani persetujuan resmi.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button 
                type="button"
                onClick={() => handleVerifyLetter('Ditolak')}
                disabled={processing}
                className="bg-white text-[#dd4b39] border border-[#dd4b39] hover:bg-[#dd4b39] hover:text-white px-4 py-2 text-xs font-bold transition-colors disabled:opacity-60 flex items-center gap-1.5 rounded-none shadow-2xs cursor-pointer"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                Tolak Permohonan
              </button>
              <button 
                type="button"
                onClick={() => handleVerifyLetter('Surat Disetujui')}
                disabled={processing}
                className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-5 py-2 text-xs font-bold transition-colors shadow-xs disabled:opacity-60 flex items-center gap-1.5 rounded-none cursor-pointer"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Setujui Surat Permohonan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Card 2: Tahap Draft Kontrak / Menunggu Pengesahan Kadis */}
      {(app.status === 'Draft Kontrak' || app.status === 'Menunggu Persetujuan Kadis' || app.status === 'Menunggu Pengesahan Kadis') && (
        <div className="bg-white border-t-[3px] border-[#3c8dbc] border-l-4 border-l-[#3c8dbc] shadow-sm p-4 sm:p-5 rounded-none">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#3c8dbc] px-2 py-0.5 rounded border border-blue-200">
                  Pengesahan Kontrak PKS
                </span>
                <h3 className="text-[16px] font-bold text-[#333]">
                  Tindakan: Pengesahan Akhir Perjanjian Kerjasama
                </h3>
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed max-w-3xl">
                Detail teknis fasilitas dan draf kontrak telah divalidasi oleh Admin UPBU. Silakan berikan pengesahan akhir agar tagihan e-SKRD dapat diterbitkan.
              </p>
            </div>
            <button 
              type="button"
              onClick={handleApproveContract}
              disabled={processing}
              className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-6 py-2.5 text-xs font-bold transition-colors shadow-xs disabled:opacity-60 flex items-center gap-1.5 rounded-none cursor-pointer shrink-0"
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Sahkan Kontrak PKS
            </button>
          </div>
        </div>
      )}

      {/* Status Notice jika Surat Sudah Disetujui */}
      {app.status === 'Surat Disetujui' && (
        <div className="bg-white border-t-[3px] border-[#00a65a] border-l-4 border-l-[#00a65a] shadow-sm p-4 rounded-none flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#00a65a] shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-800">
                Surat Permohonan Telah Disetujui oleh Kepala Dinas
              </p>
              <p className="text-[12px] text-slate-500 mt-0.5">
                Tahap saat ini: Tenant sedang melengkapi spesifikasi armada/ruangan untuk divalidasi ketersediaannya oleh Admin UPBU.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#00a65a] bg-emerald-50 px-2.5 py-1 border border-emerald-200 rounded hidden sm:inline-block">
            Dalam Proses Validasi Teknis
          </span>
        </div>
      )}

      {/* Grid Informasi: 2 Kolom (Profil Tenant & Rencana Sewa Fasilitas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Kolom Kiri: Profil Badan Usaha Pemohon */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-none">
          <div className="p-3.5 border-b border-[#f4f4f4] bg-[#f9fafb] flex items-center justify-between rounded-none">
            <h3 className="text-[14px] text-[#333] font-bold uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#3c8dbc]" />
              Data Pemohon (Tenant)
            </h3>
            <span className="text-[11px] text-[#777]">
              {app.tenants?.jenis_tenant || 'Maskapai / Mitra'}
            </span>
          </div>
          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                  Nama Perusahaan
                </span>
                <p className="text-[14px] font-bold text-[#333] mt-0.5">
                  {app.tenants?.nama_perusahaan || '-'}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                  Penanggung Jawab (PIC)
                </span>
                <p className="text-[14px] font-bold text-[#333] mt-0.5">
                  {app.tenants?.pic || '-'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#f4f4f4]">
              <div>
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                  Kontak / Telepon
                </span>
                <p className="text-[13px] font-medium text-slate-800 mt-0.5">
                  {app.tenants?.nomor_telepon || '-'}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                  Alamat Email Resmi
                </span>
                <p className="text-[13px] font-medium text-slate-800 mt-0.5">
                  {app.tenants?.email || '-'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#f4f4f4]">
              <div>
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                  Legalitas NIB &amp; NPWP
                </span>
                <p className="text-[13px] font-mono text-slate-700 mt-0.5">
                  NIB: {app.tenants?.nib || '-'}
                </p>
                <p className="text-[12px] font-mono text-slate-500">
                  NPWP: {app.tenants?.npwp || '-'}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                  Alamat Kantor
                </span>
                <p className="text-[12px] text-slate-600 mt-0.5 leading-relaxed">
                  {app.tenants?.alamat || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Detail Rencana Sewa & Objek Fasilitas */}
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-none">
          <div className="p-3.5 border-b border-[#f4f4f4] bg-[#f9fafb] flex items-center justify-between rounded-none">
            <h3 className="text-[14px] text-[#333] font-bold uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3c8dbc]" />
              Rencana Sewa &amp; Objek Fasilitas
            </h3>
            {isExtension && (
              <span className="text-[10px] font-bold bg-blue-100 text-[#3c8dbc] border border-blue-200 px-2 py-0.5 rounded">
                Perpanjangan
              </span>
            )}
          </div>
          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                  Layanan Retribusi
                </span>
                <p className="text-[14px] font-bold text-[#3c8dbc] mt-0.5">
                  {app.application_type || 'Sewa Fasilitas'}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                  Tanggal Pengajuan
                </span>
                <p className="text-[13px] font-medium text-slate-700 mt-0.5">
                  {dayjs(app.created_at).format('DD MMMM YYYY, HH:mm')} WIT
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f4f4f4]">
              <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                Perihal / Keperluan
              </span>
              <p className="text-[13px] text-slate-800 font-medium mt-0.5">
                {app.purpose || '-'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#f4f4f4]">
              <div>
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                  Objek Aset Diminati
                </span>
                <p className="text-[13px] font-bold text-slate-800 mt-0.5">
                  {app.assets ? `${app.assets.nama_aset} (${app.assets.kode_aset})` : 'Belum Ditentukan / Sesuai Disposisi'}
                </p>
                {app.assets && (
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {app.assets.lokasi_detail || 'Bandara Mozes Kilangin'} • {app.assets.luas ? `${app.assets.luas} m²` : '-'}
                  </p>
                )}
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block">
                  Periode Rencana Sewa
                </span>
                {app.start_date && app.end_date ? (
                  <div className="mt-0.5">
                    <p className="text-[13px] font-bold text-slate-800">
                      {dayjs(app.start_date).format('DD MMM YYYY')} s/d {dayjs(app.end_date).format('DD MMM YYYY')}
                    </p>
                    {rentalDuration !== null && (
                      <span className="inline-block mt-1 text-[11px] font-bold bg-blue-50 text-[#3c8dbc] border border-blue-200 px-2 py-0.5 rounded">
                        Durasi: {rentalDuration} {app.application_type?.toLowerCase().includes('hanggar') ? 'Malam Inap' : 'Hari'}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-400 mt-0.5 italic">
                    Ditentukan pada tahap pemilihan detail aset
                  </p>
                )}
              </div>
            </div>

            {/* Jika ada data armada pesawat */}
            {aircraftDetails.length > 0 && (
              <div className="pt-3 border-t border-[#f4f4f4]">
                <span className="text-[11px] font-bold text-[#777] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Plane className="w-3 h-3 text-[#3c8dbc]" />
                  Armada Pesawat Terdaftar ({aircraftDetails.length} Unit)
                </span>
                <div className="flex flex-wrap gap-2">
                  {aircraftDetails.map((ac: any, idx: number) => (
                    <span 
                      key={`ac-${idx}`}
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded"
                    >
                      <Plane className="w-3 h-3 text-[#3c8dbc]" />
                      {ac.registration_number || ac.registrasi || 'PK-???'} 
                      <span className="font-sans font-normal text-slate-500">({ac.aircraft_types?.jenis_pesawat || ac.tipe_pesawat || 'Standar'})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Dokumen Resmi Permohonan (PDF Viewer Full Width) */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-none">
        <div className="p-3.5 border-b border-[#f4f4f4] bg-[#f9fafb] flex flex-col sm:flex-row justify-between sm:items-center gap-2 rounded-none">
          <div>
            <h3 className="text-[14px] text-[#333] font-bold uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3c8dbc]" />
              Pratinjau Dokumen Surat Permohonan Resmi
            </h3>
            <p className="text-[11px] text-[#777] mt-0.5">
              Berkas digital berkop resmi yang diunggah oleh pihak pemohon
            </p>
          </div>
          
          {app.official_letter_url && (
            <div className="flex items-center gap-2 shrink-0">
              <a 
                href={resolveUrl(app.official_letter_url)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white border border-[#d2d6de] hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-bold transition-colors inline-flex items-center gap-1.5 rounded-none shadow-2xs cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#3c8dbc]" />
                Buka di Tab Baru
              </a>
              <a 
                href={resolveUrl(app.official_letter_url)} 
                download
                className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3.5 py-1.5 text-xs font-bold transition-colors inline-flex items-center gap-1.5 rounded-none shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PDF
              </a>
            </div>
          )}
        </div>

        <div className="p-4 bg-[#e6ebf0] rounded-none">
          {app.official_letter_url ? (
            <div className="w-full bg-white border border-[#d2d6de] shadow-xs rounded-none overflow-hidden">
              <object 
                data={resolveUrl(app.official_letter_url)} 
                type="application/pdf" 
                className="w-full h-[650px] md:h-[800px] bg-white rounded-none border-0"
              >
                <div className="flex flex-col items-center justify-center h-full p-10 bg-slate-50 rounded-none border border-slate-200 text-center">
                  <FileText className="w-14 h-14 text-slate-300 mb-3" />
                  <p className="text-sm font-bold text-slate-700 mb-1">
                    Pratinjau PDF Tidak Didukung Langsung oleh Peramban
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mb-5 leading-relaxed">
                    Dokumen surat permohonan telah tersimpan di sistem. Anda dapat mengunduh atau membukanya di aplikasi PDF reader.
                  </p>
                  <a 
                    href={resolveUrl(app.official_letter_url)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-5 py-2 text-xs font-bold transition-colors inline-flex items-center gap-2 rounded-none shadow-xs"
                  >
                    <Download className="w-4 h-4" /> Unduh Dokumen Surat
                  </a>
                </div>
              </object>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center bg-white rounded-none">
              <FileText className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-600">Dokumen Belum Diunggah</p>
              <p className="text-xs text-slate-400 mt-1">Pemohon belum menyertakan berkas surat resmi bertandatangan.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
