"use client";

import React, { useState } from 'react';
import { 
  Plane, CheckCircle2, XCircle, FileText, 
  MapPin, Clock, Calendar, AlertCircle, Loader2, X, Info
} from 'lucide-react';
import { FlightSchedule } from '@/types/flightSchedule';
import { flightScheduleService } from '@/services/flightScheduleService';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getFileUrl } from '@/utils/url';

interface JadwalVerifikasiModalProps {
  schedule: FlightSchedule;
  onClose: () => void;
  onSuccess: () => void;
}

export function JadwalVerifikasiModal({ schedule, onClose, onSuccess }: JadwalVerifikasiModalProps) {
  const [actionStatus, setActionStatus] = useState<'Disetujui' | 'Ditolak'>('Disetujui');
  const [parkingLocation, setParkingLocation] = useState<string>(schedule.parking_location || 'Hanggar');
  const [officerNotes, setOfficerNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await flightScheduleService.verifySchedule(schedule.id, {
        status: actionStatus,
        parking_location: actionStatus === 'Disetujui' ? parkingLocation : undefined,
        officer_notes: officerNotes
      });

      toast.success(`Jadwal ${schedule.schedule_number} berhasil ${actionStatus.toLowerCase()}!`);
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
      <div className="bg-white rounded-none shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        <div className="bg-slate-800 text-white px-5 py-3.5 flex justify-between items-center">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Plane className="w-4 h-4 text-[#3c8dbc]" />
            Verifikasi Izin Masuk Hanggar (Petugas Lapangan)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleVerify} className="p-5 text-xs text-slate-700 space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-3 text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Sebagai <strong>Petugas Lapangan</strong>, periksa kondisi keterisian ruang hanggar saat ini sebelum memberikan izin masuk pesawat.
            </p>
          </div>

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
              <span className="text-slate-500 font-bold uppercase">Estimasi Keberangkatan:</span>
              <span className="font-medium text-slate-800">
                {schedule.estimated_departure ? dayjs(schedule.estimated_departure).format('DD MMMM YYYY, HH:mm') : '-'}
              </span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500 font-bold uppercase">Estimasi Durasi:</span>
              <span className="font-bold text-slate-800">{schedule.estimated_nights} Malam</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="text-slate-500 font-bold uppercase">Keperluan:</span>
              <span className="font-medium text-slate-800">{schedule.purpose || '-'}</span>
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

          {/* Form Keputusan Petugas Lapangan */}
          <div className="space-y-3 pt-2">
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
                <label className="block mb-1 font-bold text-slate-800 uppercase tracking-wider">
                  Alokasi Lokasi Penempatan <span className="text-red-500">*</span>
                </label>
                <select
                  value={parkingLocation}
                  onChange={(e) => setParkingLocation(e.target.value)}
                  className="w-full p-2 border border-slate-300 focus:border-[#3c8dbc] focus:outline-none bg-white font-medium"
                >
                  <option value="Hanggar">Hanggar Utama Mozes Kilangin (Dalam Ruang)</option>
                  <option value="Apron">Pelataran Parkir (Apron Area Luar)</option>
                </select>
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
                placeholder={actionStatus === 'Disetujui' ? 'Contoh: Slot Hanggar Bay 2 siap...' : 'Alasan penolakan (misal: Hanggar penuh, disarankan parkir apron)...'}
                rows={2}
                className="w-full p-2 border border-slate-300 focus:border-[#3c8dbc] focus:outline-none bg-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
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
          </div>
        </form>
      </div>
    </div>
  );
}
