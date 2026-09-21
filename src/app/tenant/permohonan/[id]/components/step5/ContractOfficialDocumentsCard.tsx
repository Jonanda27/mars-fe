import React from 'react';
import { 
  FileText, ShieldCheck, ExternalLink 
} from 'lucide-react';
import { RentalApplication } from '@/types/rental';
import { resolveUrl } from '@/utils/url';

interface ContractOfficialDocumentsCardProps {
  readonly app: RentalApplication;
  readonly isHangar: boolean;
}

export const ContractOfficialDocumentsCard: React.FC<ContractOfficialDocumentsCardProps> = ({
  app,
  isHangar,
}) => {
  return (
    <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between">
        <span className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#3c8dbc]" />
          Dokumen Acuan &amp; Berkas Resmi
        </span>
        <span className="text-[10px] font-mono text-slate-500 uppercase">Status: Tervalidasi</span>
      </div>

      <div className="p-5 space-y-3.5">
        {/* Berkas Kontrak Payung Induk */}
        {app.contracts && (
          <div className="border border-slate-200 p-3.5 rounded-none flex items-center justify-between gap-3 bg-white">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-50 border border-blue-100 text-[#3c8dbc] flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  {isHangar ? 'Kontrak Payung Induk' : 'Dokumen Kontrak PKS'}
                </span>
                <p className="text-[13px] font-bold text-slate-800 leading-tight">
                  {app.contracts.contract_number}
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  &bull; Status Aktif &amp; Ditandatangani
                </span>
              </div>
            </div>

            {app.contracts.signed_document_url && (
              <a 
                href={resolveUrl(app.contracts.signed_document_url)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3 py-1.5 rounded-none text-xs font-bold flex items-center gap-1 transition-colors shadow-xs flex-shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Buka PDF
              </a>
            )}
          </div>
        )}

        {/* Berkas Surat Permohonan Resmi */}
        {app.official_letter_url && (
          <div className="border border-slate-200 p-3.5 rounded-none flex items-center justify-between gap-3 bg-white">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Surat Permohonan Sewa
                </span>
                <p className="text-[13px] font-bold text-slate-800 leading-tight">
                  {app.application_number}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">
                  Lampiran Disetujui Kepala Dinas
                </span>
              </div>
            </div>

            <a 
              href={resolveUrl(app.official_letter_url)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-none text-xs font-bold flex items-center gap-1 transition-colors shadow-xs flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Lihat Surat
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
