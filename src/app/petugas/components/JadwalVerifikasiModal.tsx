"use client";

import React, { useState, useRef } from 'react';
import { 
  Plane, CheckCircle2, XCircle, FileText, 
  MapPin, Clock, Calendar, AlertCircle, Loader2, X, Info, Lock, ShieldCheck, Eye, Mail
} from 'lucide-react';
import { FlightSchedule } from '@/types/flightSchedule';
import { flightScheduleService } from '@/services/flightScheduleService';
import { SuratIzinMasukHanggar } from '@/components/SuratIzinMasukHanggar';
import { SuratIzinMasukModal } from '@/components/SuratIzinMasukModal';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getFileUrl } from '@/utils/url';
import StatusBadge from '@/components/StatusBadge';
import { generateTiketPdf } from '@/utils/exportTiketPdf';

interface JadwalVerifikasiModalProps {
  schedule: FlightSchedule;
  onClose: () => void;
  onSuccess: () => void;
}

export function JadwalVerifikasiModal({ schedule, onClose, onSuccess }: JadwalVerifikasiModalProps) {
  const isAlreadyProcessed = schedule.status !== 'Menunggu Verifikasi Petugas';
  const ticketTemplateRef = useRef<HTMLDivElement>(null);

  const [actionStatus, setActionStatus] = useState<'Disetujui' | 'Ditolak'>('Disetujui');
  const [officerNotes, setOfficerNotes] = useState<string>(schedule.officer_notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  const handleResendTicket = async () => {
    try {
      setIsResending(true);
      const res = await flightScheduleService.resendEntryPermit(schedule.id);
      toast.success(res.message || 'Tiket izin masuk berhasil dikirim ke email tenant!');
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Gagal mengirim tiket ke email tenant';
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  const getDisplayLocation = (loc?: string) => {
    if (!loc) return 'Hanggar Utama Mozes Kilangin (Dalam Ruang)';
    const l = loc.trim().toLowerCase();
    if (l.includes('apron')) return 'Pelataran Parkir (Apron Area Luar)';
    if (l.includes('hanggar')) return 'Hanggar Utama Mozes Kilangin (Dalam Ruang)';
    return loc;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAlreadyProcessed) return;

    try {
      setIsSubmitting(true);

      let pdfBlob: Blob | null = null;
      if (actionStatus === 'Disetujui' && ticketTemplateRef.current) {
        try {
          const safeScheduleNum = (schedule.schedule_number || 'PASS').replace(/[\/\\?%*:|"<>]/g, '_');
          const safeReg = (schedule.registration_number || 'ARMADA').replace(/[\/\\?%*:|"<>]/g, '_');
          const filename = `Tiket_Izin_Masuk_${safeScheduleNum}_${safeReg}.pdf`;

          const result = await generateTiketPdf(ticketTemplateRef.current, filename, {
            returnBlob: true,
            autoDownload: false
          });
          pdfBlob = result.blob || null;
        } catch (pdfErr) {
          console.warn('Gagal generate PDF blob di frontend, fallback tanpa attachment:', pdfErr);
        }
      }

      const formData = new FormData();
      formData.append('status', actionStatus);
      formData.append('parking_location', schedule.parking_location || 'Hanggar');
      if (officerNotes) formData.append('officer_notes', officerNotes);
      if (pdfBlob) {
        formData.append('permit_pdf', pdfBlob, `Tiket_Izin_Masuk_${(schedule.schedule_number || 'PASS').replace(/\//g, '_')}.pdf`);
      }

      await flightScheduleService.verifySchedule(schedule.id, formData);

      toast.success(`Jadwal ${schedule.schedule_number} berhasil ${actionStatus.toLowerCase()}! Tiket PDF resmi dikirimkan.`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Gagal memproses verifikasi jadwal';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-none shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-800 text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-sm flex items-center gap-2">
            {isAlreadyProcessed ? (
              <Eye className="w-4 h-4 text-[#3c8dbc]" />
            ) : (
              <Plane className="w-4 h-4 text-[#3c8dbc]" />
            )}
            {isAlreadyProcessed
              ? 'Detail Izin Masuk Hanggar (Petugas Lapangan)'
              : 'Verifikasi Izin Masuk Hanggar (Petugas Lapangan)'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 text-xs text-slate-700 space-y-4 overflow-y-auto flex-1">
          {/* Header Alert / Info */}
          {!isAlreadyProcessed ? (
            <div className="bg-blue-50 border border-blue-100 p-3 text-blue-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Sebagai <strong>Petugas Lapangan</strong>, periksa kondisi keterisian ruang hanggar saat ini sebelum memberikan izin masuk pesawat.
              </p>
            </div>
          ) : (
            <div
              className={`p-3.5 border flex items-start gap-3 ${
                schedule.status === 'Checked-Out'
                  ? 'bg-purple-50 border-purple-200 text-purple-900'
                  : schedule.status === 'Disetujui' || schedule.status === 'Checked-In' || schedule.status === 'Completed' || schedule.status === 'Selesai'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : schedule.status === 'Ditolak'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              {schedule.status === 'Checked-Out' ? (
                <CheckCircle2 className="w-5 h-5 text-[#605ca8] flex-shrink-0 mt-0.5" />
              ) : schedule.status === 'Disetujui' || schedule.status === 'Checked-In' || schedule.status === 'Completed' || schedule.status === 'Selesai' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : schedule.status === 'Ditolak' ? (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h4 className="font-bold text-[13px]">
                    Status Pengajuan: {schedule.status}
                  </h4>
                  <StatusBadge status={schedule.status} />
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {schedule.status === 'Disetujui' || schedule.status === 'Checked-In'
                    ? 'Izin masuk telah disetujui. Keputusan verifikasi telah disimpan permanen dan tidak dapat diubah kembali.'
                    : schedule.status === 'Checked-Out'
                    ? 'Armada telah selesai pemanfaatan fasilitas hanggar/apron dan telah di-checkout oleh petugas lapangan.'
                    : schedule.status === 'Ditolak'
                    ? 'Izin masuk telah ditolak. Data tersimpan permanen dan tidak dapat diubah kembali.'
                    : `Jadwal ini berstatus ${schedule.status} dan hanya dapat dilihat sebagai riwayat.`}
                  {schedule.verified_at && (
                    <span className="block mt-1 font-medium">
                      Waktu Verifikasi: {dayjs(schedule.verified_at).format('DD MMMM YYYY, HH:mm')} WIT
                      {schedule.verified_by_officer?.username && ` (oleh ${schedule.verified_by_officer.username})`}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Rincian Permohonan Jadwal */}
          <div className="border border-slate-200 p-3 bg-slate-50 space-y-2 text-[11px]">
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500 font-bold uppercase">No. Pengajuan:</span>
              <span className="font-bold font-mono text-[#3c8dbc]">{schedule.schedule_number}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500 font-bold uppercase">Maskapai / Tenant:</span>
              <span className="font-bold text-slate-800">{schedule.tenant?.nama_perusahaan || '-'}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500 font-bold uppercase">Armada Pesawat:</span>
              <span className="font-bold text-slate-800">{schedule.registration_number} ({schedule.aircraft_type || 'Standar'})</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500 font-bold uppercase">Estimasi Kedatangan:</span>
              <span className="font-medium text-slate-800">{dayjs(schedule.estimated_arrival).format('DD MMMM YYYY, HH:mm')}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500 font-bold uppercase">Keperluan:</span>
              <span className="font-medium text-slate-800">{schedule.purpose || '-'}</span>
            </div>
            <div className="flex justify-between border-b pb-1 items-center">
              <span className="text-slate-500 font-bold uppercase">Lokasi Penempatan:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#3c8dbc]" />
                {getDisplayLocation(schedule.parking_location)}
              </span>
            </div>
            {schedule.notes && (
              <div className="pt-1">
                <span className="text-slate-500 font-bold uppercase block mb-0.5">Catatan Tenant:</span>
                <p className="italic text-slate-700 bg-white p-2 border border-slate-200">{schedule.notes}</p>
              </div>
            )}
            {schedule.flight_plan_url && (
              <div className="pt-1">
                <a
                  href={getFileUrl(schedule.flight_plan_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-bold underline flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> Buka Lampiran Dokumen Flight Plan
                </a>
              </div>
            )}
          </div>

          {/* KONDISI 1: Belum Diverifikasi -> Form Input Verifikasi (Lokasi Terkunci) */}
          {!isAlreadyProcessed ? (
            <form onSubmit={handleVerify} id="form-verifikasi-jadwal" className="space-y-3 pt-2">
              <div>
                <label className="block mb-1.5 font-bold text-slate-800 uppercase tracking-wider">
                  Keputusan Izin Masuk <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionStatus('Disetujui')}
                    className={`p-2.5 font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      actionStatus === 'Disetujui'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Setujui Izin Masuk
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionStatus('Ditolak')}
                    className={`p-2.5 font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      actionStatus === 'Ditolak'
                        ? 'bg-red-50 text-red-800 border-red-500 ring-2 ring-red-500/20'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-red-600" />
                    Tolak Izin
                  </button>
                </div>
              </div>

              {actionStatus === 'Disetujui' && (
                <div>
                  <label className="block mb-1 font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Alokasi Lokasi Penempatan</span>
                    <span className="text-[10px] text-slate-500 font-normal lowercase flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" /> sesuai permohonan sewa
                    </span>
                  </label>
                  <div className="w-full p-2.5 border border-slate-200 bg-slate-100 text-slate-700 font-semibold flex items-center justify-between cursor-not-allowed">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#3c8dbc]" />
                      {getDisplayLocation(schedule.parking_location)}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase">
                      Terkunci
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    * Lokasi penempatan telah ditentukan saat tenant mengajukan permohonan sewa dan tidak dapat diubah oleh petugas.
                  </p>
                </div>
              )}

              {actionStatus === 'Disetujui' && (
                <div className="bg-sky-50 border border-sky-200 p-2.5 text-sky-900 flex items-start gap-2">
                  <Mail className="w-4 h-4 text-[#008db9] shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <p className="font-bold text-slate-800">E-Tiket Izin Masuk Otomatis Terkirim</p>
                    <p className="text-slate-600 mt-0.5">
                      Setelah disetujui, sistem otomatis mengirimkan <strong>e-Tiket Izin Masuk Hanggar (QR Entry Pass)</strong> resmi ke email tenant {schedule.tenant?.email ? `(${schedule.tenant.email})` : ''} melalui <em>akunai2705@gmail.com</em>.
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-1 font-bold text-slate-800 uppercase tracking-wider">
                  Catatan Petugas Lapangan {actionStatus === 'Ditolak' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  required={actionStatus === 'Ditolak'}
                  placeholder={actionStatus === 'Disetujui' ? 'Contoh: Slot Hanggar Bay 2 siap...' : 'Alasan penolakan (misal: Ruang hanggar penuh)...'}
                  rows={2}
                  className="w-full p-2 border border-slate-300 focus:border-[#3c8dbc] focus:outline-none bg-white"
                />
              </div>
            </form>
          ) : (
            /* KONDISI 2: Sudah Pernah Diverifikasi -> Mode Read-Only (Hanya Bisa Dilihat) */
            <div className="space-y-3 pt-2">
              <div className="border border-slate-200 p-3 bg-slate-50 space-y-2 text-[11px]">
                <div className="font-bold text-slate-800 uppercase text-[12px] border-b pb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#3c8dbc]" />
                  Hasil Verifikasi Petugas Lapangan
                </div>
                <div className="flex justify-between border-b pb-1 items-center">
                  <span className="text-slate-500 font-bold uppercase">Keputusan Izin:</span>
                  <StatusBadge status={schedule.status} />
                </div>
                <div className="flex justify-between border-b pb-1 items-center">
                  <span className="text-slate-500 font-bold uppercase">Alokasi Penempatan:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#3c8dbc]" />
                    {getDisplayLocation(schedule.parking_location)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase block mb-1">Catatan Petugas:</span>
                  <div className="bg-white p-2.5 border border-slate-200 text-slate-700 italic">
                    {schedule.officer_notes || 'Tidak ada catatan tambahan dari petugas.'}
                  </div>
                </div>

                {(schedule.status === 'Disetujui' || schedule.status === 'Checked-In' || schedule.status === 'Checked-Out' || schedule.status === 'Completed' || schedule.status === 'Selesai') && (
                  <div className="bg-sky-50 border border-sky-200 p-2.5 flex items-start justify-between gap-2 mt-2">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-[#008db9] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800 block text-[11px]">E-Tiket Izin Masuk Resmi (E-Gate Pass)</span>
                        <span className="text-[10px] text-slate-600 leading-tight block">
                          Telah dikirim ke: <strong>{schedule.tenant?.email || 'Email resmi tenant'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50 shrink-0">
          {!isAlreadyProcessed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-slate-300 font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                form="form-verifikasi-jadwal"
                disabled={isSubmitting}
                className={`px-5 py-2 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60 ${
                  actionStatus === 'Disetujui'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Simpan Keputusan Verifikasi
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              {(schedule.status === 'Disetujui' || schedule.status === 'Checked-In' || schedule.status === 'Checked-Out' || schedule.status === 'Completed' || schedule.status === 'Selesai') && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowPdfModal(true)}
                    className="px-3 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Lihat & Unduh PDF Dokumen Tiket Izin Masuk"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#3c8dbc]" />
                    Lihat Tiket PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleResendTicket}
                    disabled={isResending}
                    className="px-3.5 py-2 border border-[#008db9] bg-white hover:bg-sky-50 text-[#008db9] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Mengirim Tiket...
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        Kirim Ulang ke Email
                      </>
                    )}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Off-Screen Template for PDF Generation */}
      <div 
        style={{ 
          position: 'fixed', 
          left: '-99999px', 
          top: 0, 
          width: '794px', 
          opacity: 0, 
          pointerEvents: 'none',
          zIndex: -100 
        }}
      >
        <SuratIzinMasukHanggar schedule={schedule} ref={ticketTemplateRef} />
      </div>

      {/* Modal Preview PDF jika Petugas ingin melihat */}
      {showPdfModal && (
        <SuratIzinMasukModal
          schedule={schedule}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
}
