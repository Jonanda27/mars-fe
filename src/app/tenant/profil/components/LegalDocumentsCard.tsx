import React from 'react';
import { ShieldCheck, XCircle, AlertCircle, FileCheck, Upload, X } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

interface LegalDocumentsCardProps {
  tenantData: any;
  statusVerifikasi?: string;
  isUploading: string | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, docType: string) => void;
  isLegalitasComplete?: boolean;
  tutorialDocType?: string | null;
  isTutorialActive?: boolean;
  onDismissTutorial?: () => void;
}

interface DocumentRowProps {
  title: string;
  docType: string;
  isUploaded: boolean;
  isUploading: boolean;
  isWarning?: boolean;
  isTutorialTarget?: boolean;
  onDismissTutorial?: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, docType: string) => void;
}

const DocumentRow: React.FC<DocumentRowProps> = ({
  title,
  docType,
  isUploaded,
  isUploading,
  isWarning = false,
  isTutorialTarget = false,
  onDismissTutorial,
  onFileUpload,
}) => {
  const borderColor = isWarning && !isUploaded ? 'border-[#f39c12]' : 'border-[#d2d6de]';
  const bgColor = isWarning && !isUploaded ? 'bg-[#f39c12]/5' : 'bg-slate-50';

  return (
    <div
      id={isTutorialTarget ? 'tutorial-upload-target' : undefined}
      className={`border ${borderColor} p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${bgColor} hover:border-[#3c8dbc] transition-colors relative`}
    >
      {isWarning && !isUploaded && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f39c12]"></div>
      )}
      <div className="flex items-start">
        {isWarning && !isUploaded ? (
          <AlertCircle className="w-8 h-8 mr-3 text-[#f39c12] flex-shrink-0" />
        ) : (
          <FileCheck
            className={`w-8 h-8 mr-3 flex-shrink-0 ${
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
        <StatusBadge status={isUploaded ? 'Terunggah' : 'Belum Diunggah'} />

        <div className="relative">
          {/* Animated ping dot indicator on top-right corner when tutorial active */}
          {isTutorialTarget && (
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 z-20 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3c8dbc] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#3c8dbc] border-2 border-white"></span>
            </span>
          )}

          <label
            className={`px-3 py-1.5 text-[12px] flex items-center shadow-sm cursor-pointer transition-all duration-200 select-none ${
              isTutorialTarget
                ? 'bg-white border-2 border-[#3c8dbc] text-[#3c8dbc] font-bold ring-4 ring-[#3c8dbc]/30 ring-offset-1 shadow-md scale-105'
                : 'bg-white border border-[#d2d6de] text-[#444] hover:bg-[#f4f4f4]'
            }`}
          >
            {isUploading ? (
              'Mengunggah...'
            ) : (
              <>
                <Upload
                  className={`w-3.5 h-3.5 mr-1.5 ${
                    isTutorialTarget ? 'animate-bounce text-[#3c8dbc]' : ''
                  }`}
                />{' '}
                {isUploaded ? 'Perbarui' : 'Unggah'}
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                if (isTutorialTarget && onDismissTutorial) {
                  onDismissTutorial();
                }
                onFileUpload(e, docType);
              }}
              disabled={isUploading}
            />
          </label>

          {/* Floating Tutorial Popover Tooltip */}
          {isTutorialTarget && (
            <div
              className="absolute right-0 bottom-full mb-3.5 z-50 w-72 sm:w-80 bg-white border-2 border-[#3c8dbc] rounded-lg shadow-2xl p-4 text-left animate-in fade-in zoom-in-95 duration-200"
              style={{ filter: 'drop-shadow(0 10px 15px rgba(60, 141, 188, 0.25))' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center text-[11px] font-bold text-white bg-[#3c8dbc] px-2 py-0.5 rounded">
                  Panduan Pengguna
                </span>
                <button
                  type="button"
                  onClick={onDismissTutorial}
                  className="text-gray-400 hover:text-gray-700 p-0.5 rounded transition-colors"
                  title="Tutup panduan"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Body */}
              <h5 className="font-bold text-[#1f2937] text-[14px] mb-1">
                Mulai dari Sini: Unggah Dokumen
              </h5>
              <p className="text-[12px] text-gray-600 leading-relaxed mb-3">
                Klik tombol <strong className="text-[#3c8dbc] font-bold">Unggah</strong> di bawah ini untuk melampirkan berkas resmi (format PDF, JPG, atau PNG, <strong className="text-gray-700 font-semibold">maks. 5 MB</strong>). Berkas ini diperlukan agar permohonan kemitraan Anda dapat ditinjau oleh Admin.
              </p>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-400">Petunjuk Awal</span>
                <button
                  type="button"
                  onClick={onDismissTutorial}
                  className="bg-[#3c8dbc] hover:bg-[#357ca5] text-white text-[12px] font-bold px-3 py-1 rounded transition-colors shadow-xs"
                >
                  Saya Paham
                </button>
              </div>

              {/* Downward pointing triangle/arrow centered with the button */}
              <div className="absolute -bottom-2 right-8 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-[#3c8dbc] transform rotate-45"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const LegalDocumentsCard: React.FC<LegalDocumentsCardProps> = ({
  tenantData,
  statusVerifikasi,
  isUploading,
  onFileUpload,
  isLegalitasComplete = false,
  tutorialDocType = null,
  isTutorialActive = false,
  onDismissTutorial,
}) => {
  const getDocStatus = (docType: string) => Boolean(tenantData?.legalitas?.[docType]);

  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm flex-1">
      <div className="p-[15px] border-b border-[#f4f4f4] flex justify-between items-center bg-slate-50">
        <h3 className="text-[16px] text-[#444] font-bold flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Manajemen Dokumen Legal
        </h3>
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
            isTutorialTarget={isTutorialActive && tutorialDocType === 'nib'}
            onDismissTutorial={onDismissTutorial}
            onFileUpload={onFileUpload}
          />
          <DocumentRow
            title="Nomor Pokok Wajib Pajak (NPWP)"
            docType="npwp"
            isUploaded={getDocStatus('npwp')}
            isUploading={isUploading === 'npwp'}
            isTutorialTarget={isTutorialActive && tutorialDocType === 'npwp'}
            onDismissTutorial={onDismissTutorial}
            onFileUpload={onFileUpload}
          />
          <DocumentRow
            title="Akta Pendirian Perusahaan"
            docType="akta"
            isUploaded={getDocStatus('akta')}
            isUploading={isUploading === 'akta'}
            isTutorialTarget={isTutorialActive && tutorialDocType === 'akta'}
            onDismissTutorial={onDismissTutorial}
            onFileUpload={onFileUpload}
          />
          {tenantData?.jenis_tenant === 'Maskapai' && (
            <DocumentRow
              title="Air Operator Certificate (AOC) / Izin Usaha"
              docType="aoc"
              isUploaded={getDocStatus('aoc')}
              isUploading={isUploading === 'aoc'}
              isWarning={true}
              isTutorialTarget={isTutorialActive && tutorialDocType === 'aoc'}
              onDismissTutorial={onDismissTutorial}
              onFileUpload={onFileUpload}
            />
          )}
        </div>
      </div>
    </div>
  );
};
