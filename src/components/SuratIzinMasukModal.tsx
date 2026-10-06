"use client";

import React, { useRef, useState } from 'react';
import { FlightSchedule } from '@/types/flightSchedule';
import { SuratIzinMasukHanggar } from '@/components/SuratIzinMasukHanggar';
import { Download, Printer, X, Loader2, Plane, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { generateTiketPdf } from '@/utils/exportTiketPdf';

interface SuratIzinMasukModalProps {
  readonly schedule: FlightSchedule;
  readonly onClose: () => void;
}

export const SuratIzinMasukModal: React.FC<SuratIzinMasukModalProps> = ({ schedule, onClose }) => {
  const docRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!docRef.current) return;
    try {
      setDownloading(true);
      const safeScheduleNum = (schedule.schedule_number || 'PASS').replace(/[\/\\?%*:|"<>]/g, '_');
      const safeReg = (schedule.registration_number || 'ARMADA').replace(/[\/\\?%*:|"<>]/g, '_');
      const filename = `Tiket_Izin_Masuk_Hanggar_${safeScheduleNum}_${safeReg}.pdf`;

      await generateTiketPdf(docRef.current, filename, { autoDownload: true });
      toast.success('Tiket Izin Masuk Hanggar (PDF) berhasil diunduh');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Gagal mengunduh tiket izin masuk');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-none shadow-2xl max-w-4xl w-full h-[95vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-800 text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#3c8dbc]" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Tiket Izin Masuk Hanggar (E-Gate Pass) &bull; {schedule.schedule_number}
              </h3>
              <p className="text-[11px] text-slate-300">
                Armada: <strong>{schedule.registration_number}</strong> ({schedule.aircraft_type || 'Standar'}) &bull; Tenant: {schedule.tenant?.nama_perusahaan || '-'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-3.5 py-1.5 bg-[#3c8dbc] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Mengunduh...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Unduh PDF
                </>
              )}
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white ml-2 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Document Preview Area */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-6 flex justify-center">
          <div className="bg-white shadow-lg">
            <SuratIzinMasukHanggar schedule={schedule} ref={docRef} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Dokumen sah terverifikasi oleh Petugas Lapangan UPBU Mozes Kilangin Timika.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
