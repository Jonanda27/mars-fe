"use client";

import React, { useEffect, useState, useRef } from 'react';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { 
  Loader2, 
  AlertCircle, 
  FileText, 
  Upload, 
  CheckCircle, 
  X, 
  Building2, 
  PlusCircle, 
  Calendar 
} from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { formatRupiah } from '@/utils/formatCurrency';
import SuratPKSModal from '@/components/SuratPKSModal';
import StatusBadge from '@/components/StatusBadge';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

dayjs.locale('id');

export default function TenantKontrakSewaPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [contractToUpload, setContractToUpload] = useState<Contract | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchContracts = async () => {
    try {
      const data = await contractService.getTenantContracts();
      setContracts(data || []);
    } catch (error) {
      console.error('Failed to fetch contracts', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const sewaContracts = contracts.filter(c => 
    c.contract_type === 'Sewa' || 
    c.contract_type === 'Sewa Baru' || 
    c.contract_type === 'Perpanjangan'
  );

  const expiringContracts = contracts.filter(c => {
    if (!['Aktif', 'Active'].includes(c.status || '') || !c.end_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(c.end_date);
    end.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  });

  const expiredContracts = contracts.filter(c => {
    if (!['Aktif', 'Active'].includes(c.status || '') || !c.end_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(c.end_date);
    end.setHours(0, 0, 0, 0);
    return end < today;
  });

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
      toast.success('Dokumen Surat PKS berhasil diunggah. Menunggu verifikasi Admin.');
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
    <div className="p-4 bg-[#ecf0f5] min-h-full space-y-4">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Kontrak Sewa Ruangan
            <span className="text-[15px] font-light text-[#777] ml-2">Bandara Mozes Kilangin</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] py-1 px-2">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium text-slate-800">Kontrak Sewa (Surat PKS)</span>
        </div>
      </header>

      {/* Peringatan H-7 Kontrak Akan Berakhir */}
      {expiringContracts.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 text-sm">
                Peringatan: {expiringContracts.length} Kontrak Akan Berakhir Dalam Waktu Dekat (H-7)
              </h3>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                {expiringContracts.map(c => `${c.contract_number} (${dayjs(c.end_date).format('DD MMM YYYY')})`).join(', ')}.
                Segera ajukan perpanjangan kontrak sebelum masa berlaku berakhir.
              </p>
              <div className="mt-2">
                <Link
                  href="/tenant/permohonan"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Ajukan Permohonan Perpanjangan
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Peringatan Kontrak Telah Expired */}
      {expiredContracts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-sm">
                Pemberitahuan: {expiredContracts.length} Kontrak Telah Kedaluwarsa
              </h3>
              <p className="text-xs text-red-700 mt-1 leading-relaxed">
                Masa berlaku kontrak berikut telah berakhir: {expiredContracts.map(c => `${c.contract_number} (${dayjs(c.end_date).format('DD MMM YYYY')})`).join(', ')}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Konten Daftar Kontrak Sewa */}
      {sewaContracts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-none shadow-xs p-10 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h2 className="text-base font-bold text-slate-800 mb-1">Belum Ada Kontrak Sewa</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            Anda belum memiliki kontrak sewa ruangan yang diterbitkan. Setelah permohonan sewa disetujui, dokumen Perjanjian Kerja Sama (PKS) akan otomatis diterbitkan di sini.
          </p>
          <Link
            href="/tenant/permohonan/buat"
            className="inline-flex items-center gap-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs px-4 py-2.5 rounded-none shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Buat Permohonan Sewa Ruangan
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {sewaContracts.map(contract => (
            <div 
              key={contract.id} 
              className="bg-white border border-slate-200 rounded-none shadow-xs p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:border-[#3c8dbc] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-none bg-blue-50 text-[#3c8dbc] flex items-center justify-center flex-shrink-0 border border-blue-100">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-800 font-mono">{contract.contract_number}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{contract.assets?.nama_aset || contract.assets?.kode_aset || 'Ruangan Bandara'}</p>
                  </div>
                  <div className="ml-auto sm:ml-0">
                    <StatusBadge status={contract.status || ''} />
                  </div>
                </div>

                <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> Periode Sewa:
                    </span>
                    <span className="font-semibold text-slate-700">
                      {dayjs(contract.start_date).format('DD MMM YYYY')} - {dayjs(contract.end_date).format('DD MMM YYYY')}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 block flex items-center gap-1">
                      <RupiahIcon className="w-3 h-3 text-slate-400" /> Total Nilai Kontrak:
                    </span>
                    <span className="font-bold text-[#3c8dbc]">
                      {contract.total_amount ? formatRupiah(contract.total_amount) : '-'}
                    </span>
                  </div>

                  <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                    <span className="text-[11px] text-slate-400 block">Pemanfaatan:</span>
                    <span className="font-medium text-slate-700 break-words">
                      {contract.jenis_pemanfaatan || 'Sewa Ruangan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-[170px] flex-shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                {(contract.status === 'Menunggu TTD Tenant' || contract.status === 'Draft') && (
                  <>
                    <button 
                      type="button"
                      onClick={() => setSelectedContract(contract)}
                      className="w-full text-center px-4 py-2 border border-[#3c8dbc] bg-blue-50/50 rounded-none text-xs font-bold text-[#3c8dbc] hover:bg-blue-100/50 transition cursor-pointer"
                    >
                      Lihat Draft PKS (PDF)
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleOpenUploadModal(contract)}
                      className="w-full flex items-center justify-center px-4 py-2 bg-[#3c8dbc] text-white rounded-none text-xs font-bold hover:bg-[#367fa9] transition cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload TTD Basah
                    </button>
                  </>
                )}

                {contract.status === 'Menunggu Verifikasi Admin' && (
                  <>
                    <button 
                      type="button"
                      onClick={() => setSelectedContract(contract)}
                      className="w-full text-center px-4 py-2 border border-slate-300 rounded-none text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      Lihat Dokumen PKS
                    </button>
                    <div className="text-center p-2 border border-blue-200 bg-blue-50 rounded-none text-xs text-blue-700 flex flex-col items-center font-bold">
                      <CheckCircle className="w-4 h-4 mb-1 text-blue-600" />
                      Sedang Diverifikasi Admin
                    </div>
                  </>
                )}

                {(contract.status === 'Aktif' || contract.status === 'Active') && (
                  <>
                    <button 
                      type="button"
                      onClick={() => setSelectedContract(contract)}
                      className="w-full text-center px-4 py-2 bg-slate-800 text-white rounded-none text-xs font-bold hover:bg-slate-900 transition cursor-pointer shadow-xs"
                    >
                      Lihat Dokumen PKS
                    </button>
                    <button 
                      type="button"
                      onClick={() => router.push(`/tenant/permohonan/buat?extend_from=${contract.id}`)}
                      className="w-full text-center px-4 py-2 bg-[#3c8dbc] text-white rounded-none text-xs font-bold hover:bg-[#367fa9] transition cursor-pointer shadow-xs"
                    >
                      Perpanjang Sewa
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Surat PKS Modal Overlay */}
      {selectedContract && (
        <SuratPKSModal 
          contract={selectedContract} 
          onClose={() => setSelectedContract(null)} 
        />
      )}

      {/* Modal Upload Signature */}
      {isUploadModalOpen && contractToUpload && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/60 backdrop-blur-xs transition-all duration-300">
          <div className="bg-white rounded-none shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-300">
            {/* Modal Header */}
            <div className="bg-[#3c8dbc] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-sm font-bold tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4" /> Upload TTD Basah Surat PKS
              </h3>
              <button 
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 rounded-none p-4 flex gap-3 text-blue-800 mb-6">
                <Upload className="w-5 h-5 flex-shrink-0 text-[#3c8dbc] mt-0.5" />
                <div>
                  <p className="text-xs leading-relaxed">
                    Unggah dokumen PDF Surat PKS <strong className="text-blue-900 font-mono">({contractToUpload.contract_number})</strong> yang telah dicetak, ditandatangani di atas materai Rp 10.000, dan di-scan.
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="file-upload-modal-sewa" className="block text-xs font-bold text-slate-800 mb-2">
                  Pilih Dokumen PDF Surat PKS <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-slate-200 border-dashed rounded-none p-6 text-center hover:bg-slate-50 transition-colors group">
                  <input 
                    type="file" 
                    id="file-upload-modal-sewa"
                    ref={fileInputRef}
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload-modal-sewa" className="cursor-pointer flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-50 text-[#3c8dbc] rounded-none flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-blue-100">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-xs text-[#3c8dbc] hover:text-[#367fa9] mb-1">Pilih File PDF</span>
                    <span className="text-[11px] text-slate-500">Maksimal ukuran file 5MB</span>
                  </label>
                  
                  {selectedFile && (
                    <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-none text-xs font-bold flex items-center justify-center">
                      <FileText className="w-4 h-4 mr-2 flex-shrink-0 text-emerald-600" />
                      <span className="truncate max-w-[220px]">{selectedFile.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button 
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 rounded-none font-bold text-xs text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300"
                disabled={isUploading}
              >
                Batal
              </button>
              <button 
                type="button"
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isUploading}
                className="flex items-center px-5 py-2 bg-[#3c8dbc] text-white font-bold text-xs rounded-none hover:bg-[#367fa9] disabled:opacity-60 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer"
              >
                {isUploading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1.5" />}
                {isUploading ? 'Mengunggah...' : 'Unggah Surat PKS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
