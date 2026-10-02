"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { resolveUrl } from '@/utils/url';
import { getErrorMessage } from '@/services/api';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Download, 
  ExternalLink,
  Calendar,
  Building,
  UserCheck,
  AlertTriangle,
  Plane,
  Building2
} from 'lucide-react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import StatusBadge from '@/components/StatusBadge';
import ContractPDFViewer from '@/components/ContractPDFViewer';

export default function EksekutifKontrakDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchContractDetails();
  }, [id]);

  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      const data = await contractService.getContractById(Number(id));
      setContract(data);
    } catch (error) {
      console.error('Error fetching contract details:', error);
      toast.error('Gagal mengambil data kontrak PKS.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!contract) return;
    const contractId = Number(contract.id || id);
    try {
      setProcessing(true);
      await contractService.approveContractByKadis(contractId);
      toast.success(`Kontrak ${contract.contract_number} berhasil disahkan oleh Kepala Dinas dan status kini AKTIF!`);
      await fetchContractDetails();
    } catch (error: any) {
      console.error('Error approving contract:', error);
      toast.error(getErrorMessage(error, 'Gagal mengesahkan kontrak.'));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!contract) return;
    if (!rejectReason.trim()) {
      toast.error('Harap masukkan alasan / catatan revisi untuk mitra.');
      return;
    }
    const contractId = Number(contract.id || id);
    try {
      setProcessing(true);
      await contractService.rejectContractByKadis(contractId, rejectReason);
      toast.success(`Kontrak ${contract.contract_number} dikembalikan untuk revisi.`);
      setShowRejectModal(false);
      await fetchContractDetails();
    } catch (error: any) {
      console.error('Error rejecting contract:', error);
      toast.error(getErrorMessage(error, 'Gagal memproses penolakan kontrak.'));
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !contract) {
    return (
      <div className="p-12 text-center flex flex-col justify-center min-h-[60vh] items-center text-[#777]">
        <Loader2 className="w-10 h-10 animate-spin text-[#3c8dbc] mb-3" />
        <p className="font-bold text-sm">Memuat dokumen & rincian Kontrak PKS...</p>
      </div>
    );
  }

  const s = (contract.status || '').toLowerCase();
  const isPendingKadis = s.includes('menunggu pengesahan') || 
                         s.includes('menunggu verifikasi') || 
                         s.includes('review') ||
                         s === 'draft';
  const isAktif = s === 'aktif' || s === 'active';
  const isMiniAirport = contract.contract_type === 'PKS Payung Mini Airport' || 
    Boolean(
      contract.fasilitas && 
      typeof contract.fasilitas === 'object' && 
      ((contract.fasilitas as any).category === 'Mini Airport' || 
       (contract.fasilitas as any).mini_airport_id || 
       (contract.fasilitas as any).airport_code)
    ) ||
    Boolean(contract.contract_number && contract.contract_number.startsWith('PKS-PAYUNG/'));

  const isHanggar = !isMiniAirport && (
    contract.contract_type === 'Payung' || 
    contract.contract_type === 'PKS Payung Mozes Kilangin' || 
    (contract.assets?.jenis_aset || '').toLowerCase().includes('hanggar')
  );

  const miniFasilitas = (contract.fasilitas as any) || {};
  const miniAirportName = miniFasilitas.airport_name || 'Mini Airport Perintis';
  const miniAirportCode = miniFasilitas.airport_code || '';

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-[calc(100vh-60px)]">
      {/* Back link */}
      <div className="mb-4">
        <Link 
          href="/eksekutif/kontrak" 
          className="inline-flex items-center text-[13px] font-bold text-[#3c8dbc] hover:text-[#367fa9] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali ke Daftar Persetujuan Kontrak
        </Link>
      </div>

      {/* Page Title */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
        <div>
          <h1 className="text-[22px] font-normal text-[#333] flex items-center gap-2">
            Pengesahan Kontrak <small className="text-[14px] font-mono text-[#777] font-light">#{contract.contract_number}</small>
          </h1>
          <p className="text-[12px] text-[#777] mt-0.5">
            Dokumen Perjanjian Kerja Sama (PKS) {
              isMiniAirport 
                ? `Kontrak Payung Pelayanan Bandara ${miniAirportName} (${miniAirportCode})` 
                : isHanggar 
                ? 'Kontrak Payung Hanggar Mozes Kilangin' 
                : 'Sewa Ruangan'
            }
          </p>
        </div>
        <StatusBadge status={contract.status || 'Draft'} />
      </header>

      {/* Action Banner for Kadis (if Pending) */}
      {isPendingKadis && (
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-5 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-blue-50 text-[#3c8dbc] border border-blue-200 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                  Tindakan Kepala Dinas Diperlukan
                </span>
                <span className="text-xs text-slate-500">Berkas Scan TTD Basah telah diterima</span>
              </div>
              <h3 className="text-[17px] font-bold text-[#333]">
                Pengesahan Perjanjian Kerja Sama (PKS)
              </h3>
              <p className="text-[13px] text-slate-600 mt-0.5 max-w-2xl">
                Silakan periksa kelengkapan dokumen tanda tangan basah dan meterai pada pratinjau di bawah. Jika telah sesuai, berikan pengesahan resmi agar status kontrak menjadi <strong>AKTIF</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                disabled={processing}
                className="bg-white text-[#dd4b39] border border-[#dd4b39] hover:bg-[#dd4b39] hover:text-white px-4 py-2.5 rounded-none font-bold text-xs transition-colors disabled:opacity-60 flex items-center justify-center cursor-pointer shadow-xs"
              >
                Tolak / Minta Revisi
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={processing}
                className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-5 py-2.5 rounded-none font-bold text-xs transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center cursor-pointer"
              >
                {processing && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                Sahkan &amp; Setujui Kontrak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification if Already Active */}
      {isAktif && (
        <div className="bg-white border-t-[4px] border-[#00a65a] shadow-sm p-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-[#00a65a] flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm text-[#00a65a]">Kontrak Ini Telah Berstatus AKTIF & Sah</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {contract.admin_signature || 'Telah disahkan oleh Kepala Dinas Perhubungan.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Status Terverifikasi</span>
        </div>
      )}

      {/* Grid 2 Columns: Summary & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Kolom 1: Informasi Mitra & Objek */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Card Data Mitra */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4">
            <h3 className="text-[14px] font-bold text-[#333] border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#3c8dbc]" /> Data Perusahaan / Mitra
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Nama Perusahaan</span>
                <span className="font-bold text-slate-800 text-sm">{contract.tenants?.nama_perusahaan || '-'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">NIB</span>
                  <span className="font-mono text-slate-700">{contract.tenants?.nib || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">NPWP</span>
                  <span className="font-mono text-slate-700">{contract.tenants?.npwp || '-'}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Penanggung Jawab (PIC)</span>
                <span className="font-medium text-slate-700">{contract.tenants?.pic || '-'} ({contract.tenants?.nomor_telepon || '-'})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email Resmi</span>
                <span className="text-slate-700">{contract.tenants?.email || '-'}</span>
              </div>
            </div>
          </div>

          {/* Card Objek Sewa & Ketentuan */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4">
            <h3 className="text-[14px] font-bold text-[#333] border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
              {isMiniAirport ? (
                <Plane className="w-4 h-4 text-sky-600" />
              ) : isHanggar ? (
                <Plane className="w-4 h-4 text-blue-600" />
              ) : (
                <Building2 className="w-4 h-4 text-purple-600" />
              )}
              Objek Perjanjian
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Jenis Kontrak</span>
                <span className="font-bold text-slate-800">
                  {isMiniAirport 
                    ? 'PKS Payung Mini Airport (Perintis)' 
                    : isHanggar 
                    ? 'Kontrak Payung Induk (Hanggar)' 
                    : 'Sewa Ruangan'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Nama Aset / Objek</span>
                <span className="font-bold text-slate-800">
                  {isMiniAirport 
                    ? `Pelayanan Kebandarudaraan Bandara ${miniAirportName} (${miniAirportCode})`
                    : contract.assets?.nama_aset || contract.jenis_pemanfaatan || 'Seluruh Fasilitas Hanggar'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Mulai Berlaku</span>
                  <span className="font-medium text-slate-800">{contract.start_date ? dayjs(contract.start_date).format('DD/MM/YYYY') : '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Berakhir</span>
                  <span className="font-medium text-slate-800">{contract.end_date ? dayjs(contract.end_date).format('DD/MM/YYYY') : '-'}</span>
                </div>
              </div>
              {isMiniAirport && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Ketentuan Retribusi</span>
                  <span className="font-medium text-slate-700 text-xs">
                    SKRD Resmi Pasca-Flight (Lampiran Master Tax)
                  </span>
                </div>
              )}
              {!isMiniAirport && !isHanggar && contract.total_amount && (
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Nilai Retribusi</span>
                  <span className="font-bold font-mono text-emerald-700 text-sm">
                    Rp {Number(contract.total_amount).toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kolom 2: Pratinjau Dokumen Kontrak & Berkas Scan */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
            <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#3c8dbc]" />
                <h3 className="text-sm font-bold text-slate-800">
                  {contract.signed_document_url ? 'Dokumen Scan PKS (Tanda Tangan Basah)' : 'Draf Dokumen Kontrak'}
                </h3>
              </div>

              {contract.signed_document_url && (
                <div className="flex items-center gap-2">
                  <a
                    href={resolveUrl(contract.signed_document_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs font-bold text-[#3c8dbc] hover:text-[#367fa9] bg-white border border-[#3c8dbc] px-3 py-1 rounded-none shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Buka Tab Baru
                  </a>
                  <a
                    href={resolveUrl(contract.signed_document_url)}
                    download={`PKS_${contract.contract_number}.pdf`}
                    className="inline-flex items-center text-xs font-bold text-white bg-[#3c8dbc] hover:bg-[#367fa9] px-3 py-1 rounded-none shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> Unduh Scan PDF
                  </a>
                </div>
              )}
            </div>

            <div className="p-4">
              {contract.signed_document_url ? (
                <div className="border border-slate-200 bg-slate-100 rounded-none overflow-hidden h-[650px]">
                  <iframe 
                    src={resolveUrl(contract.signed_document_url)} 
                    className="w-full h-full border-none"
                    title="Pratinjau Dokumen Kontrak PKS"
                  />
                </div>
              ) : (
                <div>
                  <div className="bg-amber-50 border border-amber-200 p-3 mb-4 text-xs text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Mitra belum mengunggah berkas scan TTD basah. Di bawah ini adalah pratinjau draf otomatis:</span>
                  </div>
                  <ContractPDFViewer 
                    contract={contract} 
                    tenant={contract.tenants} 
                    onClose={() => {}} 
                    isInline={true} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Penolakan / Catatan Revisi */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="bg-[#dd4b39] px-5 py-3.5 text-white flex justify-between items-center">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Kembalikan Kontrak untuk Revisi
              </h3>
              <button 
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="text-white hover:text-white/80 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs text-slate-600 mb-3">
                Silakan masukkan alasan atau poin revisi untuk mitra <strong>{contract.tenants?.nama_perusahaan}</strong>:
              </p>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Tanda tangan belum disertai meterai Rp 10.000 atau halaman 2 buram..."
                className="w-full text-xs p-3 border border-slate-300 rounded-none focus:outline-none focus:border-[#dd4b39] bg-slate-50"
              />
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-none"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={processing || !rejectReason.trim()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#dd4b39] hover:bg-[#c9302c] disabled:opacity-60 rounded-none flex items-center"
              >
                {processing ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                Kirim Catatan Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
