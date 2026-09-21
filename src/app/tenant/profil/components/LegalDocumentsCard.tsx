import React from 'react';
import { ShieldCheck, Clock, XCircle, AlertCircle, FileCheck, Upload } from 'lucide-react';

interface LegalDocumentsCardProps {
  tenantData: any;
  statusVerifikasi?: string;
  isUploading: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, docType: string) => void;
}

interface DocumentRowProps {
  title: string;
  docType: string;
  isUploaded: boolean;
  isUploading: boolean;
  isWarning?: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, docType: string) => void;
}

const DocumentRow: React.FC<DocumentRowProps> = ({
  title,
  docType,
  isUploaded,
  isUploading,
  isWarning = false,
  onFileUpload,
}) => {
  const borderColor = isWarning && !isUploaded ? 'border-[#f39c12]' : 'border-[#d2d6de]';
  const bgColor = isWarning && !isUploaded ? 'bg-[#f39c12]/5' : 'bg-slate-50';

  return (
    <div
      className={`border ${borderColor} p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${bgColor} hover:border-[#3c8dbc] transition-colors relative overflow-hidden`}
    >
      {isWarning && !isUploaded && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f39c12]"></div>
      )}
      <div className="flex items-start">
        {isWarning && !isUploaded ? (
          <AlertCircle className="w-8 h-8 mr-3 text-[#f39c12]" />
        ) : (
          <FileCheck
            className={`w-8 h-8 mr-3 ${
              isUploaded ? 'text-[#3c8dbc]' : 'text-[#3c8dbc] opacity-70'
            }`}
          />
        )}
        <div>
          <h4 className="font-bold text-[#333] text-[15px]">{title}</h4>
          <p className="text-[12px] text-[#777]">
            {isUploaded ? 'Telah diunggah' : 'Belum diunggah'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        {isUploaded ? (
          <span className="bg-[#3c8dbc]/10 text-[#3c8dbc] border border-[#3c8dbc]/20 font-bold text-[10px] px-2 py-1 uppercase tracking-wider">
            Tersedia
          </span>
        ) : (
          <span className="bg-[#f39c12]/10 text-[#f39c12] border border-[#f39c12]/20 font-bold text-[10px] px-2 py-1 uppercase tracking-wider">
            Kosong
          </span>
        )}
        <label className="bg-white border border-[#d2d6de] text-[#444] px-3 py-1.5 text-[12px] hover:bg-[#f4f4f4] flex items-center shadow-sm cursor-pointer">
          {isUploading ? (
            'Mengunggah...'
          ) : (
            <>
              <Upload className="w-3 h-3 mr-1" /> {isUploaded ? 'Perbarui' : 'Unggah'}
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => onFileUpload(e, docType)}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
};

export const LegalDocumentsCard: React.FC<LegalDocumentsCardProps> = ({
  tenantData,
  statusVerifikasi,
  isUploading,
  onFileUpload,
}) => {
  const getDocStatus = (docType: string) => Boolean(tenantData?.legalitas?.[docType]);

  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1">
      <div className="p-[15px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
        <h3 className="text-[16px] text-[#444] font-bold flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Manajemen Dokumen Legal
        </h3>
        {statusVerifikasi === 'Verified' && (
          <span className="bg-[#3c8dbc] text-white text-[11px] font-bold px-2 py-1 uppercase rounded-sm flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1" /> Verified
          </span>
        )}
        {statusVerifikasi === 'Pending' && (
          <span className="bg-[#f39c12] text-white text-[11px] font-bold px-2 py-1 uppercase rounded-sm flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        )}
        {statusVerifikasi === 'Rejected' && (
          <span className="bg-[#dd4b39] text-white text-[11px] font-bold px-2 py-1 uppercase rounded-sm flex items-center">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </span>
        )}
      </div>

      <div className="p-6">
        <p className="text-[13px] text-[#666] mb-6">
          Bandara Mozes Kilangin mewajibkan seluruh tenant untuk mengunggah dan memperbarui
          dokumen legalitas. Dokumen yang kedaluwarsa akan membuat akun Anda dibekukan sementara
          (suspend).
        </p>

        <div className="flex flex-col gap-4">
          <DocumentRow
            title="Nomor Induk Berusaha (NIB)"
            docType="nib"
            isUploaded={getDocStatus('nib')}
            isUploading={isUploading === 'nib'}
            onFileUpload={onFileUpload}
          />
          <DocumentRow
            title="Nomor Pokok Wajib Pajak (NPWP)"
            docType="npwp"
            isUploaded={getDocStatus('npwp')}
            isUploading={isUploading === 'npwp'}
            onFileUpload={onFileUpload}
          />
          <DocumentRow
            title="Akta Pendirian Perusahaan"
            docType="akta"
            isUploaded={getDocStatus('akta')}
            isUploading={isUploading === 'akta'}
            onFileUpload={onFileUpload}
          />
          {tenantData?.jenis_tenant === 'Maskapai' && (
            <DocumentRow
              title="Air Operator Certificate (AOC) / Izin Usaha"
              docType="aoc"
              isUploaded={getDocStatus('aoc')}
              isUploading={isUploading === 'aoc'}
              isWarning={true}
              onFileUpload={onFileUpload}
            />
          )}
        </div>
      </div>
    </div>
  );
};
