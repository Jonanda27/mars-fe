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

export default function AdminKontrakDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // TTE States
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const pksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    try {
      const data = await contractService.getContractById(Number(id));
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
      
      // Update contract with admin signature and change status to Review
      const payload = {
        status: 'Review',
        admin_signature: signatureDataUrl
      };
      
      await contractService.updateContract(contract.id as number, payload);
      alert('Dokumen PKS berhasil ditandatangani! Sekarang diteruskan ke Tenant untuk disetujui.');
      setShowSignaturePad(false);
      fetchContract(); // Reload data
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan TTE');
    } finally {
      setIsUpdating(false);
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
        <Link href="/admin/kontrak" className="text-blue-500 hover:underline mt-2 inline-block">
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
          href="/admin/kontrak"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded shadow-sm flex items-center text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Link>
      </header>

      {/* Action Bar */}
      <div className="bg-white p-4 shadow-sm rounded-sm border-t-[3px] border-[#3c8dbc] mb-6 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500 mr-2">Status Saat Ini:</span>
          {contract.status === 'Draft' && <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">DRAFT</span>}
          {contract.status === 'Review' && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Menunggu TTE Tenant</span>}
          {contract.status === 'Approved' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex inline-flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> APPROVED (TTE Selesai)</span>}
          {contract.status === 'Waiting Payment' && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> MENUNGGU PEMBAYARAN SKRD</span>}
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

          {/* Admin TTE button - Available only in Draft mode */}
          {contract.status === 'Draft' && (
            <button
              onClick={() => setShowSignaturePad(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
            >
              <FileSignature className="w-4 h-4 mr-2" /> Tinjau Dokumen & TTE
            </button>
          )}

          {/* Terminate button */}
          {(contract.status === 'Active' || contract.status === 'Waiting Payment' || contract.status === 'Expiring') && (
            <button
              onClick={async () => {
                if (window.confirm('PERINGATAN: Anda yakin ingin men-Terminasi kontrak ini secara paksa? Aset akan kembali menjadi Available.')) {
                  try {
                    await contractService.terminateContract(contract.id as number);
                    alert('Kontrak berhasil di-Terminasi secara paksa.');
                    fetchContract();
                  } catch (error) {
                    console.error(error);
                    alert('Gagal melakukan terminasi kontrak.');
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
            >
              <AlertCircle className="w-4 h-4 mr-2" /> Terminasi Paksa
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

    </div>
  );
}
