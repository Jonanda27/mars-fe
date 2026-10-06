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
import ContractPDFViewer from '@/components/ContractPDFViewer';
import StatusBadge from '@/components/StatusBadge';
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
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 mb-4">
        <div>
          <Link href="/dinas/kontrak" className="text-xs text-slate-500 hover:text-[#3c8dbc] flex items-center gap-1 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar Kontrak &amp; PKS
          </Link>
          <h1 className="text-[24px] font-normal text-[#333] flex items-baseline">
            Detail Kontrak &amp; PKS <span className="text-[15px] font-light text-[#777] ml-2">{contract.contract_number}</span>
          </h1>
        </div>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2">
          <span className="mr-1">Dinas</span> / <span className="ml-1 font-medium">Detail Kontrak</span>
        </div>
      </header>

      {/* Action Bar */}
      <div className="bg-white p-4 shadow-sm border-t-[3px] border-[#3c8dbc] mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Status Saat Ini:</span>
          <StatusBadge status={contract.status || ''} />
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
      {(() => {
        const isPayungContract = contract.contract_type === 'Payung' || 
                                 contract.contract_type === 'PKS Payung Mini Airport' || 
                                 contract.contract_type === 'PKS Payung Mozes Kilangin' ||
                                 Boolean(contract.contract_number?.startsWith('PKS-PAYUNG/'));

        return (
          <div className="bg-gray-200 p-4 md:p-8 rounded-none overflow-auto flex justify-center mb-10 min-h-[800px]">
            {isPayungContract && contract.signed_document_url && (
              <iframe 
                src={getFileUrl(contract.signed_document_url)} 
                className="w-full max-w-[1000px] h-[800px] border-0 shadow-xl bg-white"
                title="Kontrak Payung"
              />
            )}
            {isPayungContract && !contract.signed_document_url && (
              <div className="w-full max-w-[1000px]">
                <div className="bg-amber-50 border border-amber-200 p-3 mb-4 text-xs text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Mitra belum mengunggah berkas scan TTD basah. Di bawah ini adalah pratinjau draf dokumen:</span>
                </div>
                <ContractPDFViewer contract={contract} tenant={contract.tenants} onClose={() => {}} isInline={true} />
              </div>
            )}
            {!isPayungContract && (
              <SuratPKS contract={contract} ref={pksRef} />
            )}
          </div>
        );
      })()}

    </div>
  );
}
