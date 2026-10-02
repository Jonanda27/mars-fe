import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, AlertCircle, Info, Loader2, CheckCircle2, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { RentalApplication } from '@/types/rental';
import { rentalService } from '@/services/rentalService';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface RequestExtensionModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly application: RentalApplication | null;
  readonly onSuccess: () => void;
}

export const RequestExtensionModal: React.FC<RequestExtensionModalProps> = ({
  isOpen,
  onClose,
  application,
  onSuccess,
}) => {
  const [requestedEndDate, setRequestedEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tanggal minimal untuk perpanjangan adalah H+1 dari end_date saat ini
  const minDate = useMemo(() => {
    if (!application?.end_date) return '';
    return dayjs(application.end_date).add(1, 'day').format('YYYY-MM-DD');
  }, [application?.end_date]);

  // Hitung jumlah hari tambahan
  const additionalDays = useMemo(() => {
    if (!application?.end_date || !requestedEndDate) return 0;
    const currentEnd = dayjs(application.end_date).startOf('day');
    const newEnd = dayjs(requestedEndDate).startOf('day');
    const diff = newEnd.diff(currentEnd, 'day');
    return diff > 0 ? diff : 0;
  }, [application?.end_date, requestedEndDate]);

  // Cek apakah jenis aplikasi adalah aviasi (hanggar/apron) atau ruangan
  const isAviation = useMemo(() => {
    if (!application) return false;
    const assetType = (application.assets?.jenis_aset || '').toLowerCase();
    const appType = (application.application_type || '').toLowerCase();
    if (assetType === 'hanggar' || assetType === 'apron') return true;
    if (appType.includes('hanggar') || appType.includes('apron')) return true;
    return false;
  }, [application]);

  // Cek apakah sudah ada request perpanjangan pending
  const existingPendingRequest = useMemo(() => {
    if (!application?.specific_needs) return null;
    const spec = typeof application.specific_needs === 'string'
      ? JSON.parse(application.specific_needs)
      : application.specific_needs;
    if (spec?.extension_request?.status === 'Pending') {
      return spec.extension_request;
    }
    return null;
  }, [application]);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedEndDate) {
      toast.error('Silakan pilih tanggal akhir perpanjangan sewa');
      return;
    }
    if (!reason.trim()) {
      toast.error('Alasan perpanjangan sewa wajib diisi');
      return;
    }
    if (additionalDays <= 0) {
      toast.error('Tanggal perpanjangan harus lebih besar dari tanggal akhir sewa saat ini');
      return;
    }

    try {
      setIsSubmitting(true);
      await rentalService.requestExtension(application.id, {
        requested_end_date: requestedEndDate,
        reason: reason.trim(),
      });
      toast.success('Pengajuan perpanjangan sewa berhasil dikirim ke Admin UPBU!');
      setRequestedEndDate('');
      setReason('');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error requesting extension:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Gagal mengajukan perpanjangan sewa');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-none shadow-2xl max-w-lg w-full overflow-hidden border border-slate-300 animate-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center rounded-none">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {isAviation ? 'Pengajuan Perpanjangan Sewa Hanggar' : 'Pengajuan Perpanjangan Sewa Ruangan'}
              </h3>
              <p className="text-[11px] text-white/90">
                Tiket: <span className="font-mono font-bold text-white">{application.application_number}</span> &bull; Fasilitas: <strong>{application.assets?.nama_aset || (isAviation ? 'Hanggar' : 'Ruangan')}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-none bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Konten Modal */}
        {existingPendingRequest ? (
          <div className="p-5 space-y-4 text-xs">
            <div className="p-4 bg-amber-50 border-l-4 border-l-[#f39c12] text-amber-900 space-y-2 rounded-none">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-[#f39c12]" />
                Pengajuan Perpanjangan Sedang Diproses
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Anda telah mengajukan perpanjangan sewa untuk permohonan ini pada{' '}
                <strong>{dayjs(existingPendingRequest.requested_at).format('DD MMMM YYYY HH:mm')}</strong> dan saat ini sedang dalam proses verifikasi oleh Admin UPBU.
              </p>
              <div className="bg-white/80 p-2.5 rounded-none border border-amber-200 text-[11px] space-y-1">
                <div>Periode Diajukan: Hingga <strong>{dayjs(existingPendingRequest.requested_end_date).format('DD MMMM YYYY')}</strong> (+{existingPendingRequest.additional_days} Hari)</div>
                <div>Alasan: <em>&ldquo;{existingPendingRequest.reason}&rdquo;</em></div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-none text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-slate-700">
            {/* Info Permohonan Saat Ini */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-none space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Aset yang Disewa:</span>
                <span className="font-bold text-slate-800">{application.assets?.nama_aset || 'Hanggar Mozes Kilangin'}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Periode Sewa Saat Ini:</span>
                <span className="font-mono font-bold text-slate-800">
                  {dayjs(application.start_date).format('DD MMM YYYY')} s/d {dayjs(application.end_date).format('DD MMM YYYY')}
                </span>
              </div>
            </div>

            {/* Input Tanggal Akhir Baru */}
            <div>
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#3c8dbc]" />
                Tanggal Akhir Sewa yang Diminta <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={minDate}
                value={requestedEndDate}
                onChange={(e) => setRequestedEndDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white font-medium text-slate-800"
              />
              {additionalDays > 0 ? (
                <div className="mt-1.5 flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px] bg-emerald-50 p-2 border border-emerald-200">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Durasi Tambahan: <strong>+{additionalDays} Hari</strong> (Hingga {dayjs(requestedEndDate).format('DD MMMM YYYY')})
                  </span>
                </div>
              ) : (
                <div className="mt-1 text-[10px] text-slate-400">
                  * Pilih tanggal yang lebih lama dari akhir sewa saat ini ({dayjs(application.end_date).format('DD/MM/YYYY')}).
                </div>
              )}
            </div>

            {/* Input Alasan Perpanjangan */}
            <div>
              <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#3c8dbc]" />
                Alasan Perpanjangan Sewa <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                placeholder={
                  isAviation 
                    ? "Contoh: Menunggu suku cadang maintenance mesin helikopter dari Jayapura, atau penambahan jadwal operasional charter..." 
                    : "Contoh: Memperpanjang operasional kantor perwakilan maskapai, atau penambahan durasi sewa gudang kargo..."
                }
                className="w-full p-2.5 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white text-slate-800 leading-relaxed"
              />
            </div>

            {/* Disclaimer Kebijakan Penempatan Aset & Tagihan */}
            {isAviation ? (
              <div className="bg-blue-50/80 border-l-4 border-l-[#3c8dbc] p-3 text-[11px] text-blue-900 space-y-1 rounded-none leading-relaxed">
                <div className="font-bold flex items-center gap-1 text-[#3c8dbc]">
                  <Info className="w-3.5 h-3.5" />
                  Catatan Verifikasi & Penempatan Aset:
                </div>
                <p>
                  1. Pengajuan perpanjangan akan diperiksa oleh <strong>Admin UPBU</strong> untuk memastikan ketersediaan kapasitas hanggar pada periode tanggal tersebut.
                </p>
                <p>
                  2. Apabila hanggar saat ini telah penuh pada tanggal perpanjangan, Admin dapat mengalokasikan penempatan pesawat ke <strong>hanggar lain</strong> atau ke <strong>apron</strong>.
                </p>
                <p>
                  3. Tarif untuk masa perpanjangan akan disesuaikan secara <strong>prorata</strong> berdasarkan penempatan aset saat realisasi checkout (Block-Out) pesawat.
                </p>
              </div>
            ) : (
              <div className="bg-blue-50/80 border-l-4 border-l-[#3c8dbc] p-3 text-[11px] text-blue-900 space-y-1 rounded-none leading-relaxed">
                <div className="font-bold flex items-center gap-1 text-[#3c8dbc]">
                  <Info className="w-3.5 h-3.5" />
                  Catatan Verifikasi Sewa Ruangan:
                </div>
                <p>
                  1. Pengajuan perpanjangan akan diperiksa oleh <strong>Admin UPBU</strong> untuk memastikan ketersediaan objek ruangan pada periode tanggal tersebut.
                </p>
                <p>
                  2. Apabila ruangan saat ini tetap tersedia (tidak ada sewa tumpang tindih), izin sewa akan langsung diperpanjang pada unit ruangan yang sama.
                </p>
                <p>
                  3. Penetapan SKRD untuk periode perpanjangan akan diterbitkan secara resmi sesuai tarif retribusi daerah yang berlaku.
                </p>
              </div>
            )}

            {/* Footer Modal */}
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-slate-300 rounded-none font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-xs transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || additionalDays <= 0 || !reason.trim()}
                className="px-4 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold rounded-none shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60 text-xs transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Mengirim Pengajuan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Kirim Pengajuan Perpanjangan
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
