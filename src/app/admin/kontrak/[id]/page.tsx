'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { contractService } from '@/services/contractService';
import { invoiceService } from '@/services/invoiceService';
import { Contract } from '@/types/contract';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Download, FileSignature, Edit, AlertCircle, FileText, Eye, Loader2 } from 'lucide-react';
import SignaturePad from '@/components/SignaturePad';
import { toast } from 'react-hot-toast';
import EditContractModal from '@/components/EditContractModal';
import SuratPKS from '@/components/SuratPKS';

export default function AdminContractDetailPage() {
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
      // Logic for saving Admin TTE
      // await contractService.updateContract(contract.id, { admin_signature: signatureData, status: 'Menunggu TTD Tenant' });
      toast.success('Tanda tangan elektronik berhasil disimpan!');
      setShowSignaturePad(false);
      fetchContract();
    } catch (error) {
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
        <h1 className="text-[24px] font-normal text-[#333]">
          Detail Kontrak <small className="text-[15px] font-light text-[#777] ml-2">{contract.contract_number}</small>
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Admin Portal</span> / <span className="ml-1 font-medium">Kontrak</span>
        </div>
      </header>

      {/* Action Bar */}
      <div className="bg-white p-4 shadow-sm border-t-[3px] border-[#3c8dbc] mb-6 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500 mr-2">Status Saat Ini:</span>
          {contract.status?.toLowerCase() === 'draft' && <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">DRAFT</span>}
          {contract.status?.toLowerCase() === 'review' && <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Menunggu TTE Tenant</span>}
          {contract.status?.toLowerCase() === 'menunggu verifikasi admin' && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> MENUNGGU VERIFIKASI ADMIN</span>}
          {contract.status?.toLowerCase() === 'approved' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> APPROVED (TTE Selesai)</span>}
          {contract.status?.toLowerCase() === 'waiting payment' && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> MENUNGGU PEMBAYARAN SKRD</span>}
          {(contract.status?.toLowerCase() === 'active' || contract.status?.toLowerCase() === 'aktif') && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">AKTIF</span>}
          {contract.status?.toLowerCase() === 'expiring' && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">AKAN HABIS</span>}
          {contract.status?.toLowerCase() === 'expired' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">KEDALUWARSA</span>}
          {contract.status?.toLowerCase() === 'terminated' && <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">TERMINATED</span>}
        </div>
        
        <div className="flex gap-2">
          {/* Verify Document Button */}
          {contract.status === 'Menunggu Verifikasi Admin' && (
            <>
              {contract.signed_document_url && (
                <a
                  href={contract.signed_document_url.startsWith('http') ? contract.signed_document_url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${contract.signed_document_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" /> Preview File
                </a>
              )}
              <button
                onClick={async () => {
                  try {
                    setIsUpdating(true);
                    await contractService.verifyContract(contract.id as number);
                    toast.success('Kontrak berhasil diverifikasi dan diaktifkan!');
                    fetchContract();
                  } catch (error) {
                    toast.error('Gagal memverifikasi kontrak');
                  } finally {
                    setIsUpdating(false);
                  }
                }}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />} 
                Verifikasi & Aktifkan
              </button>
            </>
          )}

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
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" /> Edit Draft
              </button>
              <button
                onClick={() => setShowSignaturePad(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center"
              >
                <FileSignature className="w-4 h-4 mr-2" /> Tinjau Dokumen & TTE
              </button>
            </div>
          )}

          {/* Generate SKRD Button - Available for Active/Approved/Waiting Payment if no invoice exists */}
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
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-2 rounded shadow-sm text-sm font-medium flex items-center disabled:opacity-70"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} 
              Terbitkan SKRD
            </button>
          )}

          {/* Terminate button */}
          {(contract.status === 'Active' || contract.status === 'Aktif' || contract.status === 'Waiting Payment' || contract.status === 'Expiring') && (
            <button
              onClick={async () => {
                if (window.confirm('PERINGATAN: Anda yakin ingin men-Terminasi kontrak ini secara paksa? Aset akan kembali menjadi Available.')) {
                  try {
                    await contractService.terminateContract(contract.id as number);
                    toast.success('Kontrak berhasil di-Terminasi secara paksa.');
                    fetchContract();
                  } catch (error) {
                    console.error(error);
                    toast.error('Gagal melakukan terminasi kontrak.');
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
      <div className="bg-gray-200 p-4 md:p-8 rounded-lg overflow-auto flex justify-center mb-10 min-h-[800px]">
        {contract.contract_type === 'Payung' ? (
          contract.signed_document_url ? (
            <iframe 
              src={contract.signed_document_url.startsWith('http') ? contract.signed_document_url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || ''}${contract.signed_document_url}`} 
              className="w-full max-w-[1000px] h-[800px] border-0 shadow-xl bg-white rounded"
              title="Kontrak Payung"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-20">
              <FileText className="w-16 h-16 mb-4 text-slate-400" />
              <p className="font-medium text-lg text-slate-600">Dokumen TTD Belum Diunggah</p>
              <p className="text-sm mt-2 max-w-md text-center">Menunggu pihak Tenant untuk mengunggah pindaian Kontrak Payung yang telah ditandatangani.</p>
            </div>
          )
        ) : (
          <SuratPKS contract={contract} ref={pksRef} />
        )}
      </div>

    </div>
  );
}
