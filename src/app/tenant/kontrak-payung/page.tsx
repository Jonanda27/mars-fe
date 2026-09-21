"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { 
  Loader2, 
  AlertCircle, 
  FileText, 
  Upload, 
  CheckCircle, 
  X, 
  Download, 
  FileSignature, 
  Info, 
  Clock, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import ContractPDFViewer from '@/components/ContractPDFViewer';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';

dayjs.locale('id');

export default function PengajuanKontrakPayungPage() {
  const { user } = useAuthStore();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [contractToUpload, setContractToUpload] = useState<Contract | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchContracts = useCallback(async () => {
    try {
      const data = await contractService.getTenantContracts();
      setContracts(data || []);
    } catch (error) {
      console.error('Failed to fetch contracts', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await contractService.getTenantContracts();
        if (isMounted) {
          setContracts(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch contracts', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const activePayung = contracts.find(c => c.contract_type === 'Payung') || null;

  const handleOpenUploadModal = (contract: Contract) => {
    setContractToUpload(contract);
    setSelectedFile(null);
    setIsUploadModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!contractToUpload?.id || !selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('signature_file', selectedFile);

    try {
      await contractService.uploadSignature(contractToUpload.id, formData);
      setIsUploadModalOpen(false);
      setContractToUpload(null);
      setSelectedFile(null);
      await fetchContracts();
      toast.success('Dokumen berhasil diunggah. Menunggu verifikasi Admin.');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Gagal mengunggah dokumen');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc]" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Pengajuan Kontrak Payung{' '}
            <span className="text-[15px] font-light text-[#777] ml-2">Bandara Mozes Kilangin</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium text-slate-800">Pengajuan Kontrak Payung</span>
        </div>
      </header>

      {/* Konten Kontrak Payung */}
      {activePayung ? (
        <div className="flex flex-col gap-4">
          {/* Status Banner: Menunggu TTD Tenant */}
          {activePayung.status === 'Menunggu TTD Tenant' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex flex-col md:flex-row justify-between items-start md:items-center rounded-r gap-4 shadow-xs">
              <div>
                <h3 className="font-bold text-yellow-800 flex items-center gap-2">
                  <FileSignature className="w-5 h-5 text-yellow-600" />
                  Menunggu Tanda Tangan Anda
                </h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Silakan unduh dokumen kontrak di bawah, cetak, beri <strong>tanda tangan basah dan meterai</strong>, kemudian <em>scan</em> dan unggah kembali dokumen tersebut.
                </p>
              </div>
              <div className="flex gap-2 w-full md:w-auto flex-shrink-0">
                <button 
                  type="button"
                  onClick={() => document.getElementById('download-pdf-btn')?.click()} 
                  className="bg-slate-800 flex-1 md:flex-none justify-center text-white font-bold px-4 py-2.5 text-sm hover:bg-slate-900 transition flex items-center shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Unduh PDF
                </button>
                <button 
                  type="button"
                  onClick={() => handleOpenUploadModal(activePayung)} 
                  className="bg-blue-600 flex-1 md:flex-none justify-center text-white font-bold px-4 py-2.5 text-sm hover:bg-blue-700 transition flex items-center shadow-xs cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload TTD Basah
                </button>
              </div>
            </div>
          )}

          {/* Status Banner: Menunggu Verifikasi Admin */}
          {activePayung.status === 'Menunggu Verifikasi Admin' && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 flex justify-between items-center rounded-r shadow-xs">
              <div>
                <h3 className="font-bold text-blue-800">Verifikasi Berkas Kontrak Payung</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Dokumen tertanda tangan telah berhasil diunggah dan saat ini sedang menunggu proses verifikasi oleh Admin UPBU.
                </p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5" /> Sedang Diproses
              </div>
            </div>
          )}

          {/* Status Banner: Aktif */}
          {(activePayung.status === 'Aktif' || activePayung.status === 'Active') && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 flex justify-between items-center rounded-r shadow-xs">
              <div>
                <h3 className="font-bold text-emerald-800">Kontrak Payung Aktif</h3>
                <p className="text-emerald-700 text-sm mt-1">
                  PKS Induk Anda telah disetujui dan aktif. Anda dapat menggunakan modul permohonan sewa untuk menyewa aset.
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> Aktif
              </span>
            </div>
          )}

          {/* Template / PDF Viewer Kontrak Payung */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-sm">
            <ContractPDFViewer contract={activePayung} onClose={() => {}} isInline={true} />
          </div>
        </div>
      ) : (
        /* Empty / Preparation State jika belum ada draf kontrak payung */
        <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
          <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-[#3c8dbc]" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Perjanjian Kerja Sama (PKS) Kontrak Payung
              </h2>
            </div>
            <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded">
              Belum Diterbitkan
            </span>
          </div>

          <div className="p-8 text-center max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
              <AlertCircle className="w-8 h-8 text-slate-400" />
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-2">
              Belum Ada Kontrak Payung yang Diterbitkan
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Draf Kontrak Payung untuk <strong>{user?.nama_perusahaan || 'Perusahaan Anda'}</strong> sedang 
              dalam proses persiapan oleh bagian hukum UPBU Bandara Mozes Kilangin.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-6">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 mb-1 text-slate-700 font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1. Dokumen Legalitas</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pastikan NIB, NPWP, Akta, dan izin operasional telah lengkap di profil.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 mb-1 text-slate-700 font-bold text-xs">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Penerbitan Draf</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Admin UPBU menyusun draf kontrak payung resmi sesuai ketentuan.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="flex items-center gap-2 mb-1 text-slate-700 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>3. TTD & Pengesahan</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Dokumen akan muncul di halaman ini untuk Anda unduh dan tanda tangani.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-600 flex items-start gap-3 text-left">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 block mb-0.5">Informasi:</span>
                <p>Jika Anda telah melengkapi seluruh legalitas, Anda dapat menghubungi petugas UPBU Bandara Mozes Kilangin untuk mempercepat penerbitan draf PKS Payung.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Upload TTD Basah */}
      {isUploadModalOpen && contractToUpload && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white tracking-wide">Upload TTD Basah</h3>
              <button 
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 rounded p-4 flex gap-3 text-blue-800 mb-6">
                <Upload className="w-6 h-6 flex-shrink-0 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm leading-relaxed">
                    Unggah dokumen PDF Kontrak <strong className="text-blue-900">({contractToUpload.contract_number})</strong> yang sudah dicetak, ditandatangani basah, dan di-scan.
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="file-upload-modal" className="block text-sm font-bold text-slate-800 mb-3">
                  Pilih Dokumen PDF <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-slate-200 border-dashed rounded p-6 text-center hover:bg-slate-50 transition-colors group">
                  <input 
                    type="file" 
                    id="file-upload-modal"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload-modal" className="cursor-pointer flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-blue-600 hover:text-blue-700 mb-1">Pilih File PDF</span>
                    <span className="text-xs text-slate-500">Maksimal ukuran file 5MB</span>
                  </label>
                  
                  {selectedFile && (
                    <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-sm font-bold flex items-center justify-center">
                      <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-5 py-2.5 rounded font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                disabled={isUploading}
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isUploading}
                className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer"
              >
                {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {isUploading ? 'Mengunggah...' : 'Unggah Dokumen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
