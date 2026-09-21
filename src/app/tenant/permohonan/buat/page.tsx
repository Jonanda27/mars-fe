"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Upload, FileText, ArrowLeft, Loader2, Info, Download } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/services/api';
import { rentalService } from '@/services/rentalService';
import { Stepper } from '@/components/Stepper';
import { useAuthStore } from '@/store/useAuthStore';
import SuratPermohonanTemplate from '@/components/SuratPermohonanTemplate';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';

function BuatPermohonanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const extendFromId = searchParams.get('extend_from');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const templateRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    purpose: '',
    application_type: 'Sewa Hanggar',
  });
  const [extendFromContractId, setExtendFromContractId] = useState<number | null>(null);

  const [officialLetter, setOfficialLetter] = useState<File | null>(null);
  const [requiresPayung, setRequiresPayung] = useState(true);

  useEffect(() => {
    const checkPayung = async () => {
      try {
        const contracts = await contractService.getTenantContracts();
        const hasActivePayung = contracts?.some(
          (c: Contract) => c.contract_type === 'Payung' && (c.status === 'Aktif' || c.status === 'Active')
        );
        setRequiresPayung(!hasActivePayung);
      } catch (err) {
        console.error("Gagal mengecek kontrak payung", err);
      }
    };
    checkPayung();
  }, []);

  useEffect(() => {
    if (extendFromId) {
      const fetchContract = async () => {
        try {
          const contract = await contractService.getTenantContractById(Number.parseInt(extendFromId));
          const isHangar = contract.assets?.jenis_aset?.toLowerCase().includes('hanggar') || false;
          setFormData(prev => ({
            ...prev,
            application_type: isHangar ? 'Perpanjangan Sewa Hanggar' : 'Perpanjangan Sewa Ruangan',
            purpose: `Permohonan Perpanjangan Sewa ${isHangar ? 'Hanggar' : 'Ruangan'} (Ref: ${contract.contract_number})`
          }));
          if (contract.id) setExtendFromContractId(contract.id);
        } catch (error) {
          console.error("Gagal memuat kontrak lama", error);
        }
      };
      fetchContract();
    }
  }, [extendFromId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownloadTemplate = async () => {
    if (!templateRef.current) return;
    try {
      setLoading(true);
      const html2pdf = (await import('html2pdf.js')).default;
      const element = templateRef.current;
      const opt = {
        margin: 0,
        filename: `Template_Permohonan_${formData.application_type.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };
      
      html2pdf().set(opt).from(element).save();
      toast.success('Template berhasil diunduh. Silakan lengkapi, tandatangani, dan unggah kembali.');
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengunduh template surat.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!officialLetter) {
      toast.error('Harap unggah Surat Permohonan Resmi!');
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = new FormData();
      payload.append('purpose', formData.purpose);
      payload.append('application_type', formData.application_type);
      payload.append('official_letter', officialLetter);
      if (extendFromContractId) {
        payload.append('extend_from_contract_id', extendFromContractId.toString());
      }
      
      const newApp = await rentalService.createApplication(payload);
      
      toast.success('Surat permohonan berhasil diajukan! Menunggu verifikasi Kadis.');
      // After success, navigate to the detail page (or back to list)
      router.push(`/tenant/permohonan/${newApp.id}`);
    } catch (error: any) {
      toast.error(getErrorMessage(error) || 'Terjadi kesalahan saat mengajukan permohonan');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-[calc(100vh-60px)]">
      <div className="mb-4">
        <Link href="/tenant/permohonan" className="inline-flex items-center text-[14px] text-[#3c8dbc] hover:text-[#367fa9] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar Permohonan
        </Link>
      </div>
      
      <header className="flex justify-between items-end mb-4">
        <h1 className="text-[24px] font-normal text-[#333] flex items-center">
          Buat Permohonan Baru <small className="text-[15px] text-[#777] ml-2 font-light">Langkah 1: Unggah Surat Permohonan Resmi</small>
        </h1>
      </header>

      {/* Stepper Component */}
      {(() => {
        const isHangar = formData.application_type.toLowerCase().includes('hanggar');
        return (
          <div className="mb-6">
            <Stepper 
              currentStep={1} 
              requiresPayung={isHangar && requiresPayung} 
              isHangar={isHangar} 
            />
          </div>
        );
      })()}

      <form onSubmit={handleSubmit} className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm rounded-sm">
        <div className="p-3 border-b border-[#f4f4f4] bg-slate-50 flex items-center">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Surat Permohonan Resmi
          </h3>
        </div>
        
        <div className="p-6 md:p-8 space-y-8">
            {/* Info Box */}
            <div className="bg-blue-50/50 border-l-4 border-blue-500 rounded-r-lg p-5 flex gap-4 text-blue-900">
              <Info className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[15px] mb-1">Alur Permohonan</h4>
                <p className="text-[14px] text-blue-800/80 leading-relaxed">
                  Pilih layanan yang Anda butuhkan, lalu unggah <strong>Surat Permohonan Resmi</strong> (ber-Kop Surat, ditandatangani, dan distempel).{' '}
                  {formData.application_type.toLowerCase().includes('hanggar') ? (
                    requiresPayung
                      ? "Setelah mendapat persetujuan Kepala Dinas, draf Kontrak Payung (PKS Induk) otomatis diterbitkan untuk Anda tanda tangani sebelum memilih detail aset hanggar."
                      : "Setelah mendapat persetujuan Kepala Dinas, Anda dapat langsung memilih detail hanggar dan armada pesawat di bawah Kontrak Payung aktif Anda."
                  ) : (
                    "Untuk Sewa Ruangan, permohonan menggunakan Kontrak Sewa (Surat PKS). Setelah permohonan disetujui Kepala Dinas, Anda akan memilih spesifikasi ruangan dan draf Kontrak Sewa (Surat PKS) otomatis diterbitkan untuk ditandatangani."
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Kolom Kiri */}
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="application_type" className="block text-[14px] font-semibold text-slate-700 mb-2">Jenis Layanan Sewa <span className="text-red-500">*</span></label>
                    <select 
                      id="application_type"
                      name="application_type" 
                      value={formData.application_type} 
                      onChange={handleChange} 
                      required
                      disabled={!!extendFromId}
                      className="w-full border border-slate-300 px-4 py-2.5 rounded-md text-[14px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white shadow-sm disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                      {extendFromId ? (
                        <>
                          <option value="Perpanjangan Sewa Hanggar">Perpanjangan Sewa Hanggar</option>
                          <option value="Perpanjangan Sewa Ruangan">Perpanjangan Sewa Ruangan</option>
                        </>
                      ) : (
                        <>
                          <option value="Sewa Hanggar">Sewa Hanggar</option>
                          <option value="Sewa Apron">Sewa Apron</option>
                          <option value="Sewa Ruangan">Sewa Ruangan</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="purpose" className="block text-[14px] font-semibold text-slate-700 mb-2">Perihal Surat <span className="text-red-500">*</span></label>
                    <input 
                      id="purpose"
                      type="text" 
                      name="purpose" 
                      value={formData.purpose} 
                      onChange={handleChange} 
                      required
                      placeholder={`Cth: Permohonan ${formData.application_type}...`}
                      className="w-full border border-slate-300 px-4 py-2.5 rounded-md text-[14px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-[14px] text-slate-800 mb-1">Belum memiliki format surat?</h4>
                      <p className="text-[13px] text-slate-500">Kami dapat membuatkan draft otomatis berdasarkan profil Anda.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleDownloadTemplate}
                      disabled={loading}
                      className="whitespace-nowrap bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 py-2 px-4 rounded-md text-[13px] font-semibold transition-all shadow-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-2" /> Unduh Draft PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Kolom Kanan */}
              <div className="lg:col-span-5">
                <label htmlFor="file-upload" className="block text-[14px] font-semibold text-slate-700 mb-2">Dokumen Surat Resmi <span className="text-red-500">*</span></label>
                
                {!officialLetter ? (
                  <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all group relative">
                    <input 
                      id="file-upload" 
                      name="file-upload" 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      accept=".pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setOfficialLetter(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="space-y-3 text-center pointer-events-none">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col text-[14px] text-slate-600 justify-center">
                        <p className="font-semibold text-blue-600">Pilih file dokumen</p>
                        <p className="mt-1">atau seret dan lepas ke sini</p>
                      </div>
                      <p className="text-[12px] text-slate-400 font-medium">Format PDF (Maks. 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex flex-col items-center justify-center px-6 py-8 border-2 border-blue-400 bg-blue-50/50 rounded-lg transition-all shadow-sm">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm transform transition-transform hover:scale-105">
                      <FileText className="w-7 h-7" />
                    </div>
                    <p className="text-[14px] font-bold text-slate-800 text-center truncate w-full px-2 mb-1" title={officialLetter.name}>
                      {officialLetter.name}
                    </p>
                    <p className="text-[12px] text-blue-600 font-semibold mb-4">File siap diunggah</p>
                    
                    <button 
                      type="button"
                      onClick={() => setOfficialLetter(null)}
                      className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-md text-[13px] font-semibold transition-colors shadow-sm text-slate-600"
                    >
                      Ganti File
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white py-2 px-6 rounded-sm text-[14px] font-medium transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Kirim Permohonan
              </button>
            </div>
        </div>
        </form>

        {/* Hidden template for PDF generation */}
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0 }}>
          <SuratPermohonanTemplate 
            ref={templateRef}
            tenantName={user?.nama_perusahaan || 'NAMA PERUSAHAAN TENANT'}
            tenantAddress={(user as any)?.alamat || 'ALAMAT PERUSAHAAN TENANT'}
            applicationType={formData.application_type}
            purpose={formData.purpose}
          />
        </div>
    </div>
  );
}

export default function BuatPermohonanPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" /></div>}>
      <BuatPermohonanForm />
    </Suspense>
  );
}
