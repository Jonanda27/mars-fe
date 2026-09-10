"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { rentalService } from '@/services/rentalService';
import { getBaseUrl } from '@/services/api';
import { RentalApplication } from '@/types/rental';
import { FileText, ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export default function EksekutifPermohonanDetailPage() {
  const params = useParams();
  const router = useRouter();
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

  const resolveUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = getBaseUrl();
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleVerifyLetter = async (newStatus: 'Surat Disetujui' | 'Ditolak') => {
    try {
      setProcessing(true);
      // Calls PATCH /api/rentals/:id/verify-letter
      await rentalService.verifyLetter(Number(id), newStatus);
      toast.success(`Permohonan berhasil ${newStatus === 'Surat Disetujui' ? 'disetujui' : 'ditolak'}`);
      fetchApplicationDetails(); // Reload data
    } catch (error) {
      console.error('Error verifying letter:', error);
      toast.error('Gagal memperbarui status permohonan.');
    } finally {
      setProcessing(false);
    }
  };

  const handleApproveContract = async () => {
    try {
      setProcessing(true);
      // Calls PATCH /api/rentals/:id/approve-kadis
      await rentalService.approveKadis(Number(id));
      toast.success('Kontrak berhasil disetujui');
      fetchApplicationDetails(); // Reload data
    } catch (error) {
      console.error('Error approving contract:', error);
      toast.error('Gagal menyetujui kontrak.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !app) {
    return <div className="p-10 text-center flex justify-center min-h-screen items-center"><Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc]" /></div>;
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-[calc(100vh-60px)]">
      <div className="mb-4">
        <Link href="/eksekutif/permohonan" className="inline-flex items-center text-[14px] text-[#3c8dbc] hover:text-[#367fa9] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Persetujuan
        </Link>
      </div>
      
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Detail Permohonan <small className="text-[15px] text-[#777] ml-2 font-light">ID: {app.application_number}</small>
        </h1>
      </header>

      {/* Action Card if Needs Approval */}
      {app.status === 'Menunggu Verifikasi Kadis' && (
        <div className="bg-white border-t-[3px] border-[#f39c12] shadow-sm rounded-sm mb-8 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-bold text-[#333] mb-1">Tindakan Diperlukan: Persetujuan Surat Permohonan</h3>
              <p className="text-[14px] text-slate-500">Silakan tinjau surat permohonan resmi dari Tenant di bawah ini sebelum memberikan persetujuan.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleVerifyLetter('Ditolak')}
                disabled={processing}
                className="bg-white text-[#dd4b39] border border-[#dd4b39] hover:bg-[#dd4b39] hover:text-white px-5 py-2 rounded font-bold transition-colors disabled:opacity-70 flex items-center"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                Tolak Permohonan
              </button>
              <button 
                onClick={() => handleVerifyLetter('Surat Disetujui')}
                disabled={processing}
                className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-5 py-2 rounded font-bold transition-colors shadow-sm disabled:opacity-70 flex items-center"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Setujui Surat
              </button>
            </div>
          </div>
        </div>
      )}

      {app.status === 'Draft Kontrak' && (
        <div className="bg-white border-t-[3px] border-purple-500 shadow-sm rounded-sm mb-8 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-[18px] font-bold text-[#333] mb-1">Tindakan Diperlukan: Persetujuan Kontrak</h3>
              <p className="text-[14px] text-slate-500">Draft kontrak telah disiapkan oleh admin. Harap berikan persetujuan akhir.</p>
            </div>
            <button 
              onClick={handleApproveContract}
              disabled={processing}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded font-bold transition-colors shadow-sm disabled:opacity-70 flex items-center"
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              Setujui Draft Kontrak
            </button>
          </div>
        </div>
      )}

      {/* Basic Info Card */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm mb-8">
         <div className="p-4 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
           <h3 className="text-[16px] text-[#444] font-bold">Informasi Dasar & Dokumen</h3>
           <div className="bg-[#3c8dbc] px-3 py-1 rounded-sm text-[12px] font-bold text-white uppercase tracking-wide">
             {app.status}
           </div>
         </div>
         <div className="p-6 md:p-8 space-y-8">
           {/* Text Information Section */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div>
               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Perusahaan / Pemohon</p>
               <p className="text-slate-800 font-bold text-[16px]">{app.tenants?.nama_perusahaan || '-'}</p>
               <p className="text-slate-500 text-[13px]">{app.tenants?.pic || '-'}</p>
             </div>
             <div>
               <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tujuan / Perihal Permohonan</p>
               <p className="text-slate-800 font-medium">{app.purpose || '-'}</p>
             </div>
             {app.asset_id && (
               <div>
                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Aset Dipilih</p>
                 <p className="text-slate-800 font-medium">{app.assets?.nama_aset} ({app.assets?.kode_aset})</p>
               </div>
             )}
           </div>

           {/* Full Width Document Viewer */}
           <div className="border-t border-slate-200 pt-8 mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center uppercase tracking-wide">
                    <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> 
                    Dokumen Surat Permohonan Resmi
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">Surat resmi yang diunggah oleh pemohon (Tenant)</p>
                </div>
                {app.official_letter_url && (
                  <a href={resolveUrl(app.official_letter_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[13px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md font-semibold transition-colors border border-slate-300">
                    Buka di Tab Baru
                  </a>
                )}
              </div>
              
              {app.official_letter_url ? (
                <div className="bg-slate-200 p-2 md:p-3 rounded-lg shadow-inner border border-slate-300">
                  <object 
                    data={resolveUrl(app.official_letter_url)} 
                    type="application/pdf" 
                    className="w-full h-[600px] md:h-[800px] rounded-md bg-white border border-slate-300 shadow-sm"
                  >
                    <div className="flex flex-col items-center justify-center h-full p-10 bg-slate-50 rounded-md border border-slate-200">
                      <FileText className="w-16 h-16 text-slate-300 mb-4" />
                      <p className="text-sm text-slate-500 text-center max-w-md">
                        Browser Anda tidak mendukung pratinjau PDF interaktif. Klik tombol di bawah ini untuk mengunduh dokumen.
                      </p>
                      <a href={resolveUrl(app.official_letter_url)} className="mt-6 bg-[#3c8dbc] text-white px-6 py-2.5 rounded shadow-sm font-medium hover:bg-[#367fa9] transition-colors flex items-center">
                        Unduh PDF
                      </a>
                    </div>
                  </object>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-center bg-slate-50">
                  <FileText className="w-10 h-10 text-slate-300 mb-2" />
                  <p className="text-slate-500 font-medium">- Belum ada dokumen terunggah -</p>
                </div>
              )}
           </div>
         </div>
      </div>
    </div>
  );
}
