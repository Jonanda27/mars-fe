"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
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
  CheckCircle2,
  Building2,
  TowerControl,
  Calendar,
  ExternalLink,
  ChevronRight,
  Eye,
  Plane
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import ContractPDFViewer from '@/components/ContractPDFViewer';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import StatusBadge from '@/components/StatusBadge';

dayjs.locale('id');

interface FormattedPayungContract extends Contract {
  airport_type: 'MOZES' | 'MINI_AIRPORT';
  airport_name: string;
  airport_code: string;
  airport_id?: number | null;
  mini_airport_id?: number | null;
}

export default function PengajuanKontrakPayungPage() {
  const { user } = useAuthStore();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAirportFilter, setSelectedAirportFilter] = useState<string>('ALL');
  const [activeSelectedContractId, setActiveSelectedContractId] = useState<number | null>(null);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [contractToUpload, setContractToUpload] = useState<Contract | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchContracts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await contractService.getTenantContracts();
      setContracts(data || []);
    } catch (error) {
      console.error('Failed to fetch contracts', error);
      toast.error('Gagal memuat data kontrak payung');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Helper untuk memformat dan mengekstrak info bandara dari tiap kontrak payung
  const formatPayungContract = (c: Contract): FormattedPayungContract => {
    let fas = c.fasilitas;
    if (typeof fas === 'string') {
      try { fas = JSON.parse(fas); } catch (e) { fas = {}; }
    }
    fas = fas || {};

    const type = (c.contract_type || '').toLowerCase();
    const num = (c.contract_number || '').toUpperCase();
    const isMini = type.includes('mini') || 
                   Boolean(fas.mini_airport_id) || 
                   Boolean(fas.category === 'Mini Airport') ||
                   num.includes('PKS/ILA') ||
                   num.includes('PKS/EWI') ||
                   num.includes('PKS/UGU');

    if (isMini) {
      const code = fas.airport_code || 
                   (fas.mini_airport_id === 1 || num.includes('ILA') ? 'ILA' : 
                    fas.mini_airport_id === 2 || num.includes('EWI') ? 'EWI' : 
                    fas.mini_airport_id === 3 || num.includes('UGU') ? 'UGU' : 'MINI');

      const defaultName = code === 'ILA' ? 'Bandara Ilaga' :
                          code === 'EWI' ? 'Bandara Enarotali' :
                          code === 'UGU' ? 'Bandara Bilogai' : 'Mini Airport Perintis';

      return {
        ...c,
        airport_type: 'MINI_AIRPORT',
        airport_name: fas.mini_airport_name || fas.airport_name || defaultName,
        airport_code: code,
        mini_airport_id: fas.mini_airport_id || null,
      };
    }

    return {
      ...c,
      airport_type: 'MOZES',
      airport_name: 'Bandara Mozes Kilangin (Timika)',
      airport_code: 'TIM',
      airport_id: fas.airport_id || 1,
    };
  };

  // Kumpulan seluruh Kontrak Payung milik tenant (Mozes Kilangin + Seluruh Mini Airport)
  const allPayungContracts = useMemo(() => {
    return contracts
      .filter((c) => {
        const type = (c.contract_type || '').toLowerCase();
        const num = (c.contract_number || '').toUpperCase();
        let fas = c.fasilitas;
        if (typeof fas === 'string') {
          try { fas = JSON.parse(fas); } catch (e) { fas = {}; }
        }
        return (
          type.includes('payung') ||
          type.includes('mini') ||
          num.includes('PAYUNG') ||
          num.includes('PKS/ILA') ||
          num.includes('PKS/EWI') ||
          num.includes('PKS/UGU') ||
          Boolean(fas?.mini_airport_id)
        );
      })
      .map(formatPayungContract);
  }, [contracts]);

  // Set default selected contract saat data selesai dimuat
  useEffect(() => {
    if (allPayungContracts.length > 0 && !activeSelectedContractId) {
      setActiveSelectedContractId(allPayungContracts[0].id || null);
    }
  }, [allPayungContracts, activeSelectedContractId]);

  // Filter bandara unik untuk tab filter
  const uniqueAirports = useMemo(() => {
    const map = new Map<string, { code: string; name: string; count: number }>();
    allPayungContracts.forEach((c) => {
      const code = c.airport_code;
      if (!map.has(code)) {
        map.set(code, { code, name: c.airport_name, count: 1 });
      } else {
        const current = map.get(code)!;
        current.count += 1;
      }
    });
    return Array.from(map.values());
  }, [allPayungContracts]);

  // Kontrak yang ditampilkan sesuai tab filter bandara yang aktif
  const displayedContracts = useMemo(() => {
    if (selectedAirportFilter === 'ALL') {
      return allPayungContracts;
    }
    return allPayungContracts.filter((c) => c.airport_code === selectedAirportFilter);
  }, [allPayungContracts, selectedAirportFilter]);

  // Kontrak yang sedang dipilih untuk pratinjau dokumen PKS
  const currentActiveContract = useMemo(() => {
    if (!activeSelectedContractId) return displayedContracts[0] || allPayungContracts[0] || null;
    return allPayungContracts.find((c) => c.id === activeSelectedContractId) || displayedContracts[0] || null;
  }, [activeSelectedContractId, allPayungContracts, displayedContracts]);

  // Modal Upload TTD Basah
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
      toast.success('Dokumen TTD basah berhasil diunggah. Menunggu verifikasi Admin.');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Gagal mengunggah dokumen');
    } finally {
      setIsUploading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[450px] bg-[#ecf0f5] text-[#777]">
        <Loader2 className="w-9 h-9 animate-spin text-[#3c8dbc] mb-3" />
        <p className="font-bold text-sm">Memuat Dokumen PKS Kontrak Payung Seluruh Wilayah...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full font-sans">
      {/* Header Halaman */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Perjanjian Kerja Sama <span className="text-[15px] font-light text-[#777] ml-2">Kontrak Payung</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Tenant</span> / <span className="ml-1 font-medium">Kontrak Payung</span>
        </div>
      </header>

      {/* Konten Utama */}
      {allPayungContracts.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-[#d2d6de] shadow-xs p-10 text-center max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#3c8dbc] flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-2xs">
            <AlertCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">
            Belum Ada Kontrak Payung yang Diterbitkan
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            PKS Payung akan diterbitkan secara otomatis setelah verifikasi surat permohonan disetujui oleh Kepala Dinas Perhubungan.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
            <div className="p-3 bg-slate-50 border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#3c8dbc]" /> PKS Mozes Kilangin
              </div>
              <p className="text-[11px] text-slate-500">
                Terbit saat permohonan sewa hanggar &amp; apron Mozes Kilangin disetujui.
              </p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <TowerControl className="w-4 h-4 text-emerald-600" /> PKS Mini Airport
              </div>
              <p className="text-[11px] text-slate-500">
                Terbit saat permohonan izin operasional airstrip pedalaman (Ilaga, Enarotali, Bilogai) disetujui.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* TAB FILTER WILAYAH BANDARA */}
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs p-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#f4f4f4] pb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-[#3c8dbc]" />
                Filter Wilayah Bandara:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedAirportFilter('ALL')}
                  className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    selectedAirportFilter === 'ALL'
                      ? 'bg-[#3c8dbc] text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Semua Wilayah ({allPayungContracts.length})
                </button>
                {uniqueAirports.map((airport) => (
                  <button
                    key={airport.code}
                    type="button"
                    onClick={() => setSelectedAirportFilter(airport.code)}
                    className={`px-3 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedAirportFilter === airport.code
                        ? 'bg-[#3c8dbc] text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{airport.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      selectedAirportFilter === airport.code ? 'bg-white text-[#3c8dbc]' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {airport.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* DAFTAR KARTU KONTRAK PAYUNG (MULTI-AIRPORT GRID) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-3">
              {displayedContracts.map((c) => {
                const isSelected = currentActiveContract?.id === c.id;
                const isMini = c.airport_type === 'MINI_AIRPORT';

                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveSelectedContractId(c.id || null)}
                    className={`border transition-all cursor-pointer relative flex flex-col justify-between p-3.5 ${
                      isSelected
                        ? 'bg-blue-50/40 border-[#3c8dbc] shadow-md ring-1 ring-[#3c8dbc]'
                        : 'bg-white border-[#d2d6de] hover:border-slate-400 shadow-2xs hover:shadow-sm'
                    }`}
                  >
                    {/* Header Kartu */}
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide flex items-center gap-1 rounded ${
                          isMini 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          {isMini ? <TowerControl className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                          {isMini ? 'PKS Mini Airport' : 'PKS Mozes Kilangin'}
                        </span>
                        <StatusBadge status={c.status} className="text-[10px] px-2 py-0.5" />
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 border border-slate-300 rounded">
                          {c.airport_code}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">
                          {c.airport_name}
                        </h3>
                      </div>

                      <div className="font-mono text-[11px] text-[#3c8dbc] font-semibold mb-2 truncate" title={c.contract_number}>
                        {c.contract_number}
                      </div>

                      <div className="text-[11px] text-slate-600 bg-slate-50 p-2 border border-slate-200 mb-3 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Masa Berlaku:</span>
                          <span className="font-bold text-slate-800">
                            {c.start_date ? dayjs(c.start_date).format('DD MMM YYYY') : '-'} s/d {c.end_date ? dayjs(c.end_date).format('DD MMM YYYY') : '-'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Durasi Induk:</span>
                          <span className="font-bold text-emerald-700">1 Tahun Penuh</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Lampiran:</span>
                          <span className="font-medium text-slate-700">
                            {isMini ? 'Master Tax Retribusi' : 'Master Tarif Sewa'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tombol Aksi Kartu */}
                    <div className="pt-2 border-t border-[#f4f4f4] flex items-center justify-between gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSelectedContractId(c.id || null);
                        }}
                        className={`text-xs font-bold px-2.5 py-1.5 transition-colors flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#3c8dbc] text-white hover:bg-[#367fa9]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {isSelected ? 'Sedang Ditinjau' : 'Buka Dokumen'}
                      </button>

                      {c.status === 'Menunggu TTD Tenant' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenUploadModal(c);
                          }}
                          className="text-xs font-bold px-2.5 py-1.5 bg-[#f39c12] hover:bg-[#e08e0b] text-white flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload TTD
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DOKUMEN VIEWER DARI KONTRAK YANG SEDANG DIPILIH */}
          {currentActiveContract && (
            <div className="space-y-3">
              {/* Banner Status Kontrak Terpilih */}
              {currentActiveContract.status === 'Menunggu TTD Tenant' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex flex-col md:flex-row justify-between items-start md:items-center rounded-r gap-3 shadow-xs">
                  <div>
                    <h3 className="font-bold text-yellow-900 text-sm flex items-center gap-2">
                      <FileSignature className="w-5 h-5 text-yellow-600" />
                      PKS Payung {currentActiveContract.airport_name} Menunggu Tanda Tangan Anda
                    </h3>
                    <p className="text-yellow-800 text-xs mt-1">
                      Silakan unduh dokumen PKS di bawah, cetak, bubuhkan <strong>tanda tangan basah dan meterai</strong>, kemudian unggah kembali hasil pindai dokumen tersebut.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto shrink-0">
                    <button 
                      type="button"
                      onClick={() => document.getElementById('download-pdf-btn')?.click()} 
                      className="bg-slate-800 flex-1 md:flex-none justify-center text-white font-bold px-3.5 py-2 text-xs hover:bg-slate-900 transition flex items-center shadow-xs cursor-pointer"
                    >
                      <Download className="w-4 h-4 mr-1.5" />
                      Unduh PDF
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleOpenUploadModal(currentActiveContract)} 
                      className="bg-[#3c8dbc] flex-1 md:flex-none justify-center text-white font-bold px-3.5 py-2 text-xs hover:bg-[#367fa9] transition flex items-center shadow-xs cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-1.5" />
                      Upload TTD Basah
                    </button>
                  </div>
                </div>
              )}

              {currentActiveContract.status === 'Menunggu Verifikasi Admin' && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3.5 flex justify-between items-center rounded-r shadow-xs">
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Verifikasi Berkas PKS Payung {currentActiveContract.airport_name}
                    </h3>
                    <p className="text-blue-800 text-xs mt-0.5">
                      Dokumen PKS tertanda tangan telah berhasil diunggah dan sedang dalam proses verifikasi akhir oleh Admin UPBU.
                    </p>
                  </div>
                  <StatusBadge status="Menunggu Verifikasi" label="Sedang Diverifikasi" />
                </div>
              )}

              {(currentActiveContract.status === 'Aktif' || currentActiveContract.status === 'Active') && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3.5 flex justify-between items-center rounded-r shadow-xs">
                  <div>
                    <h3 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      PKS Payung {currentActiveContract.airport_name} Aktif &amp; Sah
                    </h3>
                    <p className="text-emerald-800 text-xs mt-0.5">
                      {currentActiveContract.airport_type === 'MINI_AIRPORT'
                        ? `PKS Payung berlaku 1 tahun untuk seluruh penerbangan armada Anda yang mendarat di ${currentActiveContract.airport_name}. Pembayaran ditagihkan periodik melalui SKRD Mini Airport.`
                        : 'PKS Induk sewa aset Bandara Mozes Kilangin aktif. Anda dapat mengajukan jadwal pemanfaatan dan penempatan armada.'}
                    </p>
                  </div>
                  <StatusBadge status="Aktif" />
                </div>
              )}

              {/* PDF Document Viewer Container */}
              <div className="bg-white border border-[#d2d6de] shadow-sm">
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <FileSignature className="w-4 h-4 text-[#3c8dbc]" />
                    <span className="text-xs font-bold text-slate-800">
                      Pratinjau Resmi: {currentActiveContract.contract_number} ({currentActiveContract.airport_name})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => document.getElementById('download-pdf-btn')?.click()}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" /> Unduh Dokumen Lengkap
                    </button>
                  </div>
                </div>

                <div className="p-2 sm:p-4 bg-slate-200 flex justify-center">
                  <ContractPDFViewer contract={currentActiveContract} onClose={() => {}} isInline={true} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL UPLOAD TANDA TANGAN BASAH */}
      {isUploadModalOpen && contractToUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4">
          <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-2xl w-full max-w-lg p-5">
            <div className="flex justify-between items-center pb-3 border-b border-[#f4f4f4] mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Upload Dokumen PKS Tertanda Tangan
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Ref: {contractToUpload.contract_number}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                Pastikan dokumen yang diunggah memuat tanda tangan basah pimpinan perusahaan dan meterai Rp 10.000 yang sah. Format yang diterima: PDF atau JPG/PNG (Maks. 10MB).
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pilih Berkas Dokumen (Scan / Foto Jelas):
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:border-0 file:text-xs file:font-bold file:bg-[#3c8dbc] file:text-white hover:file:bg-[#367fa9] file:cursor-pointer border border-[#d2d6de] p-1.5"
                />
              </div>

              {selectedFile && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Berkas terpilih: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#f4f4f4]">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleUploadSubmit}
                disabled={isUploading || !selectedFile}
                className="px-4 py-2 text-xs font-bold bg-[#3c8dbc] hover:bg-[#367fa9] text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-2xs"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Mengunggah...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Unggah Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
