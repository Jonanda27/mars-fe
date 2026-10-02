"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { FileText, Loader2, ArrowLeft, CheckCircle2, AlertCircle, Building2, Calendar, FileSignature, Save, Download, Clock, X } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';
import SuratPKS from '@/components/SuratPKS';
import SignaturePad from '@/components/SignaturePad';
import StatusBadge from '@/components/StatusBadge';
import html2pdf from 'html2pdf.js';
import toast from 'react-hot-toast';

export default function TenantKontrakDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // TTE States
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const pksRef = useRef<HTMLDivElement>(null);
  
  // Extension States
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [newEndDate, setNewEndDate] = useState<string>('');
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    try {
      const data = await contractService.getTenantContractById(Number(id));
      setContract(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTTE = async (signatureDataUrl: string) => {
    if (!contract) return;
    try {
      setIsUpdating(true);
      
      // Update contract with tenant signature and change status to Approved
      const payload = {
        status: 'Waiting Payment',
        tenant_signature: signatureDataUrl
      };
      
      await contractService.updateTenantContractStatus(contract.id as number, payload);
      toast.success('Dokumen PKS berhasil ditandatangani! Silakan lunasi Tagihan SKRD untuk mengaktifkan kontrak.');
      setShowSignaturePad(false);
      fetchContract(); // Reload data
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan TTE');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExtendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !newEndDate) return;
    try {
      setIsExtending(true);
      await contractService.extendContract(contract.id as number, newEndDate);
      toast.success('Pengajuan perpanjangan berhasil dikirim! Silakan cek di menu Permohonan Sewa.');
      setShowExtendModal(false);
      setNewEndDate('');
      router.push('/tenant/permohonan');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || 'Gagal mengajukan perpanjangan.');
    } finally {
      setIsExtending(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pksRef.current || !contract) return;
    
    const element = pksRef.current;
    const opt = {
      margin:       0,
      filename:     `PKS_${contract.contract_number}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-4 text-center mt-20">
        <h2 className="text-xl font-bold text-gray-700">Kontrak tidak ditemukan</h2>
        <Link href="/tenant/kontrak" className="text-blue-500 hover:underline mt-2 inline-block">
          Kembali ke Daftar Kontrak
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-[24px] font-normal text-[#333] flex items-center">
            Detail Kontrak PKS <small className="text-[15px] text-[#777] ml-2 font-light">{contract.contract_number}</small>
          </h1>
        </div>
        <Link 
          href="/tenant/kontrak"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded shadow-sm flex items-center text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Link>
      </header>

      {/* Action Bar */}
      <div className="bg-white p-4 shadow-sm rounded-sm border-t-[3px] border-[#3c8dbc] mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Status Saat Ini:</span>
          <StatusBadge status={contract.status || ''} />
        </div>
        
        <div className="flex gap-2">
          {/* Download PDF button - Available if both signatures exist */}
          {(contract.admin_signature && contract.tenant_signature) && (
            <button
              onClick={handleDownloadPDF}
              className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
            >
              <Download className="w-4 h-4 mr-2" /> Download PDF PKS
            </button>
          )}

          {/* Tenant TTE button - Available only in Review mode */}
          {contract.status === 'Review' && (
            <button
              onClick={() => setShowSignaturePad(true)}
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
            >
              <FileSignature className="w-4 h-4 mr-2" /> Tinjau Dokumen & TTE
            </button>
          )}
          
          {/* Extension button - Available if status is Expiring */}
          {contract.status === 'Expiring' && (
            <button
              onClick={() => {
                const defaultEnd = dayjs(contract.end_date).add(1, 'month').format('YYYY-MM-DD');
                setNewEndDate(defaultEnd);
                setShowExtendModal(true);
              }}
              className="bg-[#00a65a] hover:bg-[#008d4c] text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" /> Ajukan Perpanjangan
            </button>
          )}
        </div>
      </div>

      {showSignaturePad ? (
        <div className="mb-8">
          <SignaturePad 
            onSave={handleSaveTTE}
            onCancel={() => setShowSignaturePad(false)}
          />
        </div>
      ) : null}

      {/* Dokumen PKS Preview */}
      <div className="bg-gray-200 p-8 rounded-lg overflow-auto flex justify-center mb-10">
        <SuratPKS contract={contract} ref={pksRef} />
      </div>

      {/* Extension Modal */}
      {showExtendModal && contract && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#3c8dbc] p-5 flex justify-between items-center text-white">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-3 text-white/90" />
                <h3 className="font-bold text-lg tracking-wide">Perpanjang Masa Sewa</h3>
              </div>
              <button onClick={() => setShowExtendModal(false)} className="text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleExtendSubmit} className="p-6">
              <div className="mb-5 bg-slate-50 border border-slate-100 rounded-lg p-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Kontrak Saat Ini</p>
                <p className="font-bold text-lg text-slate-800">{contract.contract_number}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-300"></div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Berakhir Pada</p>
                  <p className="font-bold text-slate-700 text-[15px]">{dayjs(contract.end_date).format('DD MMM YYYY')}</p>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#3c8dbc]"></div>
                  <p className="text-[11px] font-bold text-[#3c8dbc] uppercase tracking-wider mb-1">Mulai Ekstensi</p>
                  <p className="font-bold text-[#3c8dbc] text-[15px]">{dayjs(contract.end_date).add(1, 'day').format('DD MMM YYYY')}</p>
                </div>
              </div>

              <div className="mb-6 relative">
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Pilih Tanggal Berakhir Baru (New End Date)</label>
                <input 
                  type="date" 
                  required
                  min={dayjs(contract.end_date).add(2, 'day').format('YYYY-MM-DD')}
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-lg p-3 outline-none focus:border-[#3c8dbc] focus:ring-2 focus:ring-[#3c8dbc]/20 transition-all font-medium text-slate-700 cursor-pointer"
                />
                
                {newEndDate && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-[#00a65a] uppercase tracking-wider mb-0.5">Total Durasi Perpanjangan</p>
                      <p className="text-sm text-slate-700">Akan diperpanjang hingga {dayjs(newEndDate).format('DD MMM YYYY')}</p>
                    </div>
                    <div className="bg-white text-[#00a65a] font-bold px-3 py-1.5 rounded text-lg border border-emerald-200 shadow-sm">
                      {Math.max(0, dayjs(newEndDate).diff(dayjs(contract.end_date).add(1, 'day'), 'day'))} Malam
                    </div>
                  </div>
                )}
                
                <p className="text-[12px] text-slate-500 mt-3 flex items-start">
                  <AlertCircle className="w-4 h-4 mr-1.5 text-[#3c8dbc] flex-shrink-0 mt-0.5" />
                  Permohonan ini akan diteruskan ke Admin UPBU untuk ditinjau ulang sebelum SKRD baru diterbitkan.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowExtendModal(false)}
                  className="px-5 py-2.5 bg-white border border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isExtending || !newEndDate}
                  className="px-5 py-2.5 bg-[#3c8dbc] text-white font-bold rounded-lg hover:bg-[#367fa9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md shadow-blue-100"
                >
                  {isExtending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</> : 'Ajukan Perpanjangan Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
