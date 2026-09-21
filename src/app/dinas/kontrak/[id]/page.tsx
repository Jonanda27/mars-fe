'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { contractService } from '@/services/contractService';
import { invoiceService } from '@/services/invoiceService';
import { Contract } from '@/types/contract';
import Link from 'next/link';
import { CheckCircle2, Download, FileSignature, Edit, AlertCircle, FileText, Eye, Loader2, ArrowLeft } from 'lucide-react';
import SignaturePad from '@/components/SignaturePad';
import { toast } from 'react-hot-toast';
import EditContractModal from '@/components/EditContractModal';
import SuratPKS from '@/components/SuratPKS';
import { getFileUrl } from '@/utils/url';

export default function DinasContractDetailPage() {
  const params = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const pksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContract();
  }, [params.id]);

  const fetchContract = async () => {
    try {
      setIsLoading(true);
      const data = await contractService.getContractById(Number(params.id));
      setContract(data);
    } catch (error) {
      console.error('Error fetching contract:', error);
      toast.error('Gagal memuat detail kontrak');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTTE = async (signatureData: string) => {
    try {
      setIsUpdating(true);
      toast.success('Tanda tangan elektronik berhasil disimpan!');
      setShowSignaturePad(false);
      fetchContract();
    } catch (error) {
      console.error('Error saving TTE:', error);
      toast.error('Gagal menyimpan TTE');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pksRef.current || !contract) return;
    
    const html2pdf = (await import('html2pdf.js')).default;
    
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
        <Loader2 className="w-8 h-8 animate-spin text-[#3c8dbc]" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-4 text-center mt-20">
        <h2 className="text-xl font-bold text-gray-700">Kontrak tidak ditemukan</h2>
        <Link href="/dinas/kontrak" className="text-[#3c8dbc] hover:underline mt-2 inline-block">
          Kembali ke Daftar Kontrak
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full">
      <header className="flex justify-between items-end mb-4">
        <div>
          <Link href="/dinas/kontrak" className="text-xs text-slate-500 hover:text-[#3c8dbc] flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar Kontrak &amp; PKS
          </Link>
          <h1 className="text-[24px] font-normal text-[#333]">
            Detail Kontrak &amp; PKS <small className="text-[15px] font-light text-[#777] ml-2">{contract.contract_number}</small>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Dinas Portal</span> / <span className="ml-1 font-medium">Kontrak &amp; PKS</span>
        </div>
      </header>

      {/* Action Bar */}
      <div className="bg-white p-4 shadow-sm border-t-[3px] border-[#3c8dbc] mb-6 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500 mr-2">Status Saat Ini:</span>
          {contract.status?.toLowerCase() === 'draft' && <span className="bg-slate-100 text-slate-700 px-3 py-1 text-xs font-bold">DRAFT</span>}
          {contract.status?.toLowerCase() === 'review' && <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs font-bold inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Menunggu TTE Tenant</span>}
          {contract.status?.toLowerCase() === 'menunggu verifikasi admin' && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 text-xs font-bold inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> MENUNGGU VERIFIKASI</span>}
          {contract.status?.toLowerCase() === 'menunggu pengesahan kadis' && <span className="bg-blue-100 text-[#3c8dbc] px-3 py-1 text-xs font-bold inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> MENUNGGU PENGESAHAN KADIS</span>}
          {contract.status?.toLowerCase() === 'approved' && <span className="bg-green-100 text-green-700 px-3 py-1 text-xs font-bold inline-flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> APPROVED</span>}
          {contract.status?.toLowerCase() === 'waiting payment' && <span className="bg-orange-100 text-orange-700 px-3 py-1 text-xs font-bold inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> MENUNGGU PEMBAYARAN SKRD</span>}
          {(contract.status?.toLowerCase() === 'active' || contract.status?.toLowerCase() === 'aktif') && <span className="bg-green-100 text-green-700 px-3 py-1 text-xs font-bold">AKTIF</span>}
          {contract.status?.toLowerCase() === 'expiring' && <span className="bg-orange-100 text-orange-700 px-3 py-1 text-xs font-bold">AKAN HABIS</span>}
          {contract.status?.toLowerCase() === 'expired' && <span className="bg-red-100 text-red-700 px-3 py-1 text-xs font-bold">KEDALUWARSA</span>}
          {contract.status?.toLowerCase() === 'terminated' && <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold">TERMINATED</span>}
        </div>
        
        <div className="flex gap-2">
          {/* Download PDF button - Available if both signatures exist */}
          {(contract.admin_signature && contract.tenant_signature) && (
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 shadow-sm text-xs font-bold flex items-center cursor-pointer"
            >
              <Download className="w-4 h-4 mr-2" /> Download PDF PKS
            </button>
          )}

          {/* Edit Draft */}
          {contract.status === 'Draft' && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 shadow-sm text-xs font-bold flex items-center cursor-pointer"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Draft
              </button>
            </div>
          )}

          {/* Generate SKRD Button */}
          {['Active', 'Aktif', 'Approved', 'Waiting Payment', 'Expiring'].includes(contract.status || '') && (!contract.invoices || contract.invoices.length === 0) && (
            <button
              onClick={async () => {
                if (window.confirm('Yakin ingin menerbitkan SKRD untuk kontrak ini?')) {
                  try {
                    setIsUpdating(true);
                    await invoiceService.generateSkrd(contract.id as number);
                    toast.success('SKRD berhasil diterbitkan!');
                    fetchContract();
                  } catch (error: any) {
                    console.error(error);
                    toast.error('Gagal menerbitkan SKRD: ' + (error.response?.data?.message || error.message));
                  } finally {
                    setIsUpdating(false);
                  }
                }
              }}
              disabled={isUpdating}
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-2 shadow-sm text-xs font-bold flex items-center disabled:opacity-70 cursor-pointer"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} 
              Terbitkan SKRD
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

      {showEditModal && contract && (
        <EditContractModal
          contract={contract}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchContract();
          }}
        />
      )}

      {/* Dokumen PKS Preview */}
      <div className="bg-gray-200 p-4 md:p-8 rounded-none overflow-auto flex justify-center mb-10 min-h-[800px]">
        {contract.contract_type === 'Payung' && contract.signed_document_url && (
          <iframe 
            src={getFileUrl(contract.signed_document_url)} 
            className="w-full max-w-[1000px] h-[800px] border-0 shadow-xl bg-white"
            title="Kontrak Payung"
          />
        )}
        {contract.contract_type === 'Payung' && !contract.signed_document_url && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-20">
            <FileText className="w-16 h-16 mb-4 text-slate-400" />
            <p className="font-medium text-lg text-slate-600">Dokumen TTD Belum Diunggah</p>
            <p className="text-sm mt-2 max-w-md text-center">Menunggu pihak Tenant untuk mengunggah pindaian Kontrak Payung yang telah ditandatangani.</p>
          </div>
        )}
        {contract.contract_type !== 'Payung' && (
          <SuratPKS contract={contract} ref={pksRef} />
        )}
      </div>

    </div>
  );
}
