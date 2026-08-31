"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contractService } from '@/services/contractService';
import { Contract } from '@/types/contract';
import { FileText, Loader2, ArrowLeft, CheckCircle2, AlertCircle, Building2, Calendar, FileSignature, Save, Download } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { formatRupiah } from '@/utils/formatCurrency';
import SuratPKS from '@/components/SuratPKS';
import SignaturePad from '@/components/SignaturePad';
import html2pdf from 'html2pdf.js';

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
  const [extendDuration, setExtendDuration] = useState(12);
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
      alert('Dokumen PKS berhasil ditandatangani! Silakan lunasi Tagihan SKRD untuk mengaktifkan kontrak.');
      setShowSignaturePad(false);
      fetchContract(); // Reload data
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan TTE');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExtend = async () => {
    if (!contract) return;
    try {
      setIsExtending(true);
      await contractService.extendContract(contract.id as number, extendDuration);
      alert('Pengajuan perpanjangan berhasil dikirim! Silakan cek di menu Permohonan Sewa.');
      setShowExtendModal(false);
      router.push('/tenant/permohonan');
    } catch (error) {
      console.error(error);
      alert('Gagal mengajukan perpanjangan.');
    } finally {
      setIsExtending(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pksRef.current || !contract) return;
    
    const element = pksRef.current;
    const opt = {
      margin:       10,
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
        <div>
          <span className="text-sm text-gray-500 mr-2">Status Saat Ini:</span>
          {contract.status === 'Review' && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Menunggu TTE Anda</span>}
          {(contract.status === 'Approved' || contract.status === 'Waiting Payment') && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> MENUNGGU PEMBAYARAN SKRD</span>}
          {contract.status === 'Active' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">AKTIF</span>}
          {contract.status === 'Expiring' && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">AKAN HABIS</span>}
          {contract.status === 'Expired' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">KEDALUWARSA</span>}
          {contract.status === 'Terminated' && <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">TERMINATED</span>}
        </div>
        
        <div className="flex gap-2">
          {/* Download PDF button - Available if both signatures exist */}
          {(contract.admin_signature && contract.tenant_signature) && (
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
            >
              <Download className="w-4 h-4 mr-2" /> Download PDF PKS
            </button>
          )}

          {/* Tenant TTE button - Available only in Review mode */}
          {contract.status === 'Review' && (
            <button
              onClick={() => setShowSignaturePad(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
            >
              <FileSignature className="w-4 h-4 mr-2" /> Tinjau Dokumen & TTE
            </button>
          )}
          
          {/* Extension button - Available if status is Expiring */}
          {contract.status === 'Expiring' && (
            <button
              onClick={() => setShowExtendModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
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
      {showExtendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Pengajuan Perpanjangan Kontrak</h3>
            <p className="text-sm text-gray-600 mb-4">
              Masa berlaku kontrak ini akan segera habis. Silakan pilih durasi perpanjangan yang Anda inginkan.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Perpanjangan</label>
              <select 
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                value={extendDuration}
                onChange={(e) => setExtendDuration(Number(e.target.value))}
              >
                <option value={1}>1 Bulan</option>
                <option value={3}>3 Bulan</option>
                <option value={6}>6 Bulan</option>
                <option value={12}>1 Tahun</option>
                <option value={24}>2 Tahun</option>
                <option value={36}>3 Tahun</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowExtendModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
              >
                Batal
              </button>
              <button 
                onClick={handleExtend}
                disabled={isExtending}
                className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
              >
                {isExtending ? 'Mengirim...' : 'Kirim Pengajuan'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
