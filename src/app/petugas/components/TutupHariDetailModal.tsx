"use client";

import React from 'react';
import { OvernightReport } from '@/services/overnightReportService';
import { 
  X, Calendar, User, Plane, MapPin, 
  FileText, ExternalLink, ShieldCheck, Camera
} from 'lucide-react';
import dayjs from 'dayjs';

interface TutupHariDetailModalProps {
  report: OvernightReport | null;
  onClose: () => void;
}

export const TutupHariDetailModal: React.FC<TutupHariDetailModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-none shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#3c8dbc] text-white px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Detail Laporan Tutup Hari (Overnight Log)
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Ref ID #{report.id} &bull; Tanggal: {dayjs(report.report_date).format('DD MMMM YYYY')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-200 text-lg font-bold cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          
          {/* Metadata Grid */}
          <div className="bg-white p-4 border border-slate-200 shadow-2xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Petugas Pelapor</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {report.officer?.username || 'Petugas'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Waktu Submit</span>
              <span className="font-semibold text-slate-700">
                {dayjs(report.created_at).format('DD/MM/YYYY HH:mm')} WIT
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Total Armada Inap</span>
              <span className="font-bold text-[#3c8dbc] text-sm">
                {report.total_aircraft_staying} Pesawat
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Status Laporan</span>
              <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold text-[10px] border border-emerald-200">
                {report.status || 'VERIFIED'}
              </span>
            </div>
          </div>

          {/* Catatan Shift & Foto Hanggar */}
          {(report.general_notes || report.general_evidence_photo) && (
            <div className="bg-white p-4 border border-slate-200 shadow-2xs space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 flex items-center gap-1.5 uppercase text-[11px] tracking-wider">
                <FileText className="w-3.5 h-3.5 text-[#3c8dbc]" />
                Catatan Shift &amp; Kondisi Umum
              </h4>
              {report.general_notes && (
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 border border-slate-100 italic">
                  "{report.general_notes}"
                </p>
              )}
              {report.general_evidence_photo && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Dokumentasi Hanggar:</span>
                  <a href={report.general_evidence_photo} target="_blank" rel="noreferrer" className="inline-block border border-slate-200 overflow-hidden hover:opacity-90">
                    <img src={report.general_evidence_photo} alt="Hanggar" className="h-24 w-auto object-cover" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Daftar Pesawat yang Menginap */}
          <div className="bg-white border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 bg-[#f8fafc] border-b border-slate-200 flex justify-between items-center">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-[#3c8dbc]" />
                Rincian Armada Terverifikasi Menginap ({report.items?.length || 0} Unit)
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {(!report.items || report.items.length === 0) ? (
                <div className="p-6 text-center text-xs text-slate-400">Tidak ada armada menginap</div>
              ) : (
                report.items.map((item, idx) => (
                  <div key={item.id || idx} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 text-sm">
                          {item.registration_number}
                        </span>
                        {item.is_adhoc ? (
                          <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 border border-amber-200">
                            Manual / Ad-Hoc
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-[#3c8dbc] text-[10px] font-bold px-1.5 py-0.5 border border-blue-100">
                            Check-In Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600">
                        <strong>{item.tenant?.nama_perusahaan || item.tenant_name || 'Maskapai'}</strong> &bull; {item.aircraft_type || 'Pesawat'}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        Lokasi: {item.parking_location || 'Hanggar'} ({item.asset?.nama_aset || item.asset_name || 'Hanggar'})
                      </div>
                      {item.notes && (
                        <div className="text-[11px] text-slate-600 italic bg-slate-100 px-2 py-0.5 mt-1 border-l-2 border-[#3c8dbc]">
                          {item.notes}
                        </div>
                      )}
                    </div>

                    {/* Foto Bukti Wajib */}
                    {item.evidence_photo && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a
                          href={item.evidence_photo}
                          target="_blank"
                          rel="noreferrer"
                          className="w-16 h-16 border border-slate-200 overflow-hidden relative group block"
                        >
                          <img
                            src={item.evidence_photo}
                            alt={item.registration_number}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
