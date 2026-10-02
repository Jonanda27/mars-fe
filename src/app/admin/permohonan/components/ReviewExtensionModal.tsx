import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, Calendar, AlertTriangle, CheckCircle2, XCircle, Loader2, 
  ArrowRight, Building2, Check, Plane, HelpCircle, Info
} from 'lucide-react';
import { RentalApplication } from '@/types/rental';
import { rentalService } from '@/services/rentalService';
import StatusBadge from '@/components/StatusBadge';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

interface ReviewExtensionModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly application: RentalApplication | null;
  readonly onSuccess: () => void;
}

export const ReviewExtensionModal: React.FC<ReviewExtensionModalProps> = ({
  isOpen,
  onClose,
  application,
  onSuccess,
}) => {
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extensionReq = application?.specific_needs?.extension_request || null;
  const originalEndDate = extensionReq?.original_end_date || application?.end_date;
  const requestedEndDate = extensionReq?.requested_end_date;
  const additionalDays = extensionReq?.additional_days || 0;

  // Dapatkan apakah aplikasi ini merupakan sewa Hanggar/Apron (Aviasi) atau Sewa Ruangan
  const isAviation = useMemo(() => {
    if (!application) return false;
    const assetType = (application.assets?.jenis_aset || '').toLowerCase();
    const appType = (application.application_type || '').toLowerCase();
    if (assetType === 'hanggar' || assetType === 'apron') return true;
    if (appType.includes('hanggar') || appType.includes('apron')) return true;
    return false;
  }, [application]);

  const isRoomRental = !isAviation;

  useEffect(() => {
    if (isOpen && application && extensionReq) {
      fetchAvailability();
      setSelectedAssetId(application.asset_id || null);
      setAdminNotes('');
    }
  }, [isOpen, application, extensionReq]);

  const fetchAvailability = async () => {
    if (!application || !extensionReq) return;
    try {
      setLoadingAssets(true);
      const data = await rentalService.getAssetAvailability({
        startDate: originalEndDate,
        endDate: requestedEndDate,
        excludeApplicationId: application.id,
        category: isAviation ? 'HANGGAR' : 'RUANGAN',
      });
      setAvailableAssets(data);
    } catch (err) {
      console.error('Error fetching asset availability:', err);
    } finally {
      setLoadingAssets(false);
    }
  };

  if (!isOpen || !application || !extensionReq) return null;

  const currentAsset = availableAssets.find((a) => a.id === application.asset_id) || application.assets;
  
  // Status Hanggar (Aviasi)
  const isCurrentAssetHangar = currentAsset?.jenis_aset === 'Hanggar';
  const isCurrentAssetFull = isCurrentAssetHangar && (
    currentAsset?.is_available === false || 
    (currentAsset?.available_before !== undefined && currentAsset.available_before < (currentAsset.applicant_area || 0))
  );

  // Status Ruangan (Sewa Ruangan)
  const isCurrentRoomAvailable = currentAsset?.is_available !== false;
  const currentRoomConflict = currentAsset?.conflicting_tenant || null;

  const handleReview = async (action: 'APPROVE' | 'REJECT') => {
    if (action === 'REJECT' && !adminNotes.trim()) {
      toast.error('Silakan isi catatan/alasan penolakan perpanjangan');
      return;
    }

    try {
      setIsSubmitting(true);
      await rentalService.reviewExtension(application.id, {
        action,
        target_asset_id: selectedAssetId || application.asset_id,
        admin_notes: adminNotes.trim(),
      });

      toast.success(
        action === 'APPROVE'
          ? isAviation 
            ? 'Perpanjangan sewa dan alokasi penempatan pesawat berhasil disetujui!'
            : 'Perpanjangan masa sewa ruangan berhasil disetujui!'
          : 'Pengajuan perpanjangan sewa telah ditolak'
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error reviewing extension:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Gagal memproses verifikasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-none shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-300 animate-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="bg-[#3c8dbc] text-white px-5 py-3.5 flex justify-between items-center rounded-none">
          <div className="flex items-center gap-2">
            {isAviation ? (
              <Plane className="w-5 h-5 text-white" />
            ) : (
              <Building2 className="w-5 h-5 text-white" />
            )}
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {isAviation 
                  ? 'Verifikasi Pengajuan Perpanjangan Sewa Hanggar' 
                  : 'Verifikasi Pengajuan Perpanjangan Sewa Ruangan'}
              </h3>
              <p className="text-[11px] text-white/90">
                Tiket: <span className="font-mono font-bold text-white">{application.application_number}</span> &bull; Tenant: <strong>{application.tenants?.nama_perusahaan}</strong> &bull; Fasilitas: <strong>{currentAsset?.nama_aset || application.assets?.nama_aset || (isAviation ? 'Hanggar' : 'Ruangan')}</strong>
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

        <div className="p-5 space-y-4 text-xs text-slate-700 max-h-[82vh] overflow-y-auto">
          {/* Ringkasan Durasi & Alasan Tenant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Jadwal Sewa Semula
              </span>
              <div className="font-mono font-bold text-slate-800 text-sm">
                {dayjs(originalEndDate).format('DD MMMM YYYY')}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Mulai: {dayjs(application.start_date).format('DD MMM YYYY')}
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-none">
              <span className="text-[10px] font-bold text-[#3c8dbc] uppercase tracking-wider block mb-1">
                Permintaan Perpanjangan
              </span>
              <div className="font-mono font-bold text-[#3c8dbc] text-sm flex items-center gap-1.5">
                {dayjs(requestedEndDate).format('DD MMMM YYYY')}
                <span className="text-[11px] font-bold bg-[#3c8dbc] text-white px-2 py-0.5 rounded">
                  +{additionalDays} Hari
                </span>
              </div>
              <div className="text-[11px] text-blue-700 mt-0.5">
                Diajukan pada: {dayjs(extensionReq.requested_at).format('DD MMM YYYY HH:mm')}
              </div>
            </div>
          </div>

          {/* Kotak Alasan Tenant */}
          <div className="p-3 bg-amber-50/80 border-l-4 border-l-[#f39c12] rounded-none">
            <div className="font-bold text-amber-900 text-[11px] mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[#f39c12]" />
              Alasan Perpanjangan dari Tenant:
            </div>
            <p className="text-amber-950 italic text-xs leading-relaxed bg-white/70 p-2 border border-amber-200">
              &ldquo;{extensionReq.reason}&rdquo;
            </p>
          </div>

          {/* ======================================================== */}
          {/* JALUR A: KONTROL REVIEW UNTUK SEWA RUANGAN */}
          {/* ======================================================== */}
          {isRoomRental && (
            <div className="border border-slate-200 p-3.5 bg-slate-50 rounded-none space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#3c8dbc]" />
                  Ketersediaan Objek Sewa Ruangan pada Periode Perpanjangan
                </label>
                {loadingAssets && (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-[#3c8dbc]" /> Mengecek ketersediaan...
                  </span>
                )}
              </div>

              {/* Status Ruangan Saat Ini */}
              {currentAsset && (
                <div className={`p-3.5 rounded-none border transition-all ${
                  isCurrentRoomAvailable
                    ? 'bg-gradient-to-br from-emerald-50/60 via-slate-50/40 to-white border-emerald-300 shadow-2xs'
                    : 'bg-rose-50/70 border-rose-300'
                }`}>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 mb-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Objek Ruangan Saat Ini
                      </span>
                      <span className="font-bold text-slate-800 text-sm">
                        {currentAsset.nama_aset}
                      </span>
                    </div>
                    <div>
                      <StatusBadge 
                        status={isCurrentRoomAvailable ? 'Tersedia' : 'Ditolak'} 
                        label={isCurrentRoomAvailable ? 'Ruangan Tersedia' : 'Terisi Tenant Lain'} 
                      />
                    </div>
                  </div>

                  {/* Grid Rincian Spesifikasi Ruangan */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    <div className="bg-white p-2 border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">Kode Aset</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {currentAsset.kode_aset || '-'}
                      </span>
                    </div>

                    <div className="bg-white p-2 border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">Jenis Fasilitas</span>
                      <span className="text-xs font-bold text-slate-800">
                        {currentAsset.jenis_aset || 'Ruangan'}
                      </span>
                    </div>

                    <div className="bg-white p-2 border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">Luas Ruangan</span>
                      <span className="text-xs font-bold text-blue-700 font-mono">
                        {(currentAsset.luas || currentAsset.total_area || 0).toLocaleString('id-ID')} m²
                      </span>
                    </div>

                    <div className="bg-white p-2 border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">Lokasi / Gedung</span>
                      <span className="text-xs font-bold text-slate-800 truncate block" title={currentAsset.lokasi}>
                        {currentAsset.lokasi || 'Terminal Domestik'}
                      </span>
                    </div>
                  </div>

                  {/* Pesan Kesiapan Perpanjangan Ruangan */}
                  {isCurrentRoomAvailable ? (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50/80 p-2.5 border border-emerald-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Ruangan siap diperpanjang!</strong> Tidak ada jadwal sewa tumpang tindih pada periode perpanjangan{' '}
                        <strong>{dayjs(originalEndDate).format('DD MMM YYYY')}</strong> s.d.{' '}
                        <strong>{dayjs(requestedEndDate).format('DD MMM YYYY')}</strong>. Ruangan saat ini otomatis terpilih untuk dilanjutkan.
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-rose-800 bg-rose-50 p-2.5 border border-rose-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Perhatian:</strong> Ruangan ini memiliki jadwal aktif oleh{' '}
                        <strong>{currentRoomConflict || 'Penyewa Lain'}</strong> pada periode tanggal perpanjangan.
                        Silakan alokasikan ke ruangan alternatif di bawah.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pilihan Ruangan Alternatif (Jika ingin dipindah atau ruangan semula terisi) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-700">
                    Konfirmasi Objek Ruangan untuk Masa Perpanjangan:
                  </span>
                  <span className="text-[10px] text-slate-500">
                    (Default: ruangan semula. Klik ruangan lain jika ingin merelokasi)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {availableAssets.map((asset) => {
                    const isSelected = selectedAssetId === asset.id;
                    const isCurrent = asset.id === application.asset_id;
                    const isAvailable = asset.is_available !== false;

                    return (
                      <button
                        type="button"
                        key={asset.id}
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`p-2.5 text-left rounded-none border transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#3c8dbc] bg-blue-50/80 ring-1 ring-[#3c8dbc]'
                            : isAvailable
                            ? 'border-slate-200 bg-white hover:bg-slate-50'
                            : 'border-rose-200 bg-rose-50/30 hover:bg-rose-50/60 opacity-80'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-slate-900 text-xs truncate" title={asset.nama_aset}>
                              {asset.nama_aset}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                              {asset.jenis_aset}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-500 flex items-center justify-between gap-1">
                            <span>Luas: <strong>{(asset.luas || asset.total_area || 0).toLocaleString('id-ID')} m²</strong></span>
                            <span className="truncate">{asset.lokasi || 'Terminal'}</span>
                          </div>
                        </div>

                        <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 font-mono">{asset.kode_aset}</span>
                            {isCurrent && (
                              <span className="px-1 py-0.2 bg-blue-100 text-blue-800 text-[9px] font-bold">
                                Ruangan Semula
                              </span>
                            )}
                          </div>
                          
                          {isSelected ? (
                            <span className="font-bold text-[#3c8dbc] flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Dialokasikan
                            </span>
                          ) : isAvailable ? (
                            <span className="text-emerald-700 font-medium">Tersedia</span>
                          ) : (
                            <span className="text-rose-600 font-medium">Terisi</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* JALUR B: KONTROL REVIEW UNTUK SEWA HANGGAR & APRON */}
          {/* ======================================================== */}
          {isAviation && (
            <div className="border border-slate-200 p-3.5 bg-slate-50 rounded-none space-y-3">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#3c8dbc]" />
                  Ketersediaan Kapasitas & Alokasi Penempatan Pesawat
                </label>
                {loadingAssets && (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-[#3c8dbc]" /> Mengecek kapasitas...
                  </span>
                )}
              </div>

              {/* Status Hanggar Saat Ini */}
              {currentAsset && (
                <div className={`p-3.5 rounded-lg border transition-all ${
                  isCurrentAssetFull
                    ? 'bg-rose-50/60 border-rose-200'
                    : 'bg-gradient-to-br from-emerald-50/50 via-slate-50/40 to-white border-emerald-200/90 shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 mb-3">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Penempatan Hanggar Saat Ini
                      </span>
                      <span className="font-bold text-slate-800 text-sm">
                        {currentAsset.nama_aset}
                      </span>
                    </div>
                    <div>
                      <StatusBadge 
                        status={isCurrentAssetFull ? 'Penuh' : 'Tersedia'} 
                        label={isCurrentAssetFull ? 'Kapasitas Penuh' : 'Kapasitas Tersedia'} 
                      />
                    </div>
                  </div>

                  {/* Grid Rincian Kapasitas Pasti */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    <div className="bg-white p-2 rounded border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">Total Luas</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {(currentAsset.total_area || currentAsset.luas || 0).toLocaleString('id-ID')} m²
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">Terpakai Lain</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">
                        {(currentAsset.used_area ?? 0).toLocaleString('id-ID')} m²
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded border border-slate-200/80">
                      <span className="text-[10px] text-slate-500 block">Pesawat Pemohon</span>
                      <span className="text-xs font-bold text-blue-700 font-mono">
                        {currentAsset.applicant_aircraft?.registration_number 
                          ? `${currentAsset.applicant_aircraft.registration_number} (${currentAsset.applicant_area || 0} m²)` 
                          : `${currentAsset.applicant_area || 0} m²`}
                      </span>
                    </div>

                    <div className={`p-2 rounded border ${
                      isCurrentAssetFull 
                        ? 'bg-rose-50 border-rose-200' 
                        : 'bg-emerald-50/80 border-emerald-200'
                    }`}>
                      <span className={`text-[10px] block font-medium ${isCurrentAssetFull ? 'text-rose-700' : 'text-emerald-700'}`}>
                        Sisa Kapasitas
                      </span>
                      <span className={`text-xs font-bold font-mono ${isCurrentAssetFull ? 'text-rose-800' : 'text-emerald-800'}`}>
                        {(currentAsset.remaining_area !== undefined ? currentAsset.remaining_area : (currentAsset.luas || 0)).toLocaleString('id-ID')} m²
                      </span>
                    </div>
                  </div>

                  {/* Indikator Visual Kapasitas */}
                  {currentAsset.total_area && (
                    <div className="space-y-1">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                        <div 
                          style={{ width: `${Math.min(100, ((currentAsset.used_area || 0) / currentAsset.total_area) * 100)}%` }} 
                          className="bg-amber-400 h-full transition-all duration-300"
                          title={`Terpakai Pesawat Lain: ${currentAsset.used_area || 0} m²`}
                        />
                        <div 
                          style={{ width: `${Math.min(100, ((currentAsset.applicant_area || 0) / currentAsset.total_area) * 100)}%` }} 
                          className="bg-blue-500 h-full transition-all duration-300"
                          title={`Pesawat Pemohon: ${currentAsset.applicant_area || 0} m²`}
                        />
                        <div 
                          style={{ width: `${Math.max(0, 100 - (((currentAsset.used_area || 0) + (currentAsset.applicant_area || 0)) / currentAsset.total_area) * 100)}%` }} 
                          className="bg-emerald-500 h-full transition-all duration-300"
                          title={`Sisa Kapasitas: ${currentAsset.remaining_area} m²`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>0 m²</span>
                        <span className="text-slate-600 font-medium">
                          {isCurrentAssetFull 
                            ? 'Kapasitas tidak mencukupi untuk pesawat ini' 
                            : 'Kapasitas hanggar mencukupi untuk perpanjangan sewa'}
                        </span>
                        <span>{(currentAsset.total_area || 0).toLocaleString('id-ID')} m²</span>
                      </div>
                    </div>
                  )}

                  {isCurrentAssetFull && (
                    <div className="mt-2 text-[11px] font-semibold text-rose-700 bg-rose-50 p-2 rounded border border-rose-200">
                      💡 Kapasitas hanggar saat ini penuh. Silakan alokasikan penempatan pesawat ke Apron atau Hanggar lain pada daftar di bawah.
                    </div>
                  )}
                </div>
              )}

              {/* Pilihan Aset untuk Penempatan */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  Pilih Penempatan Aset pada Periode Perpanjangan:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableAssets.map((asset) => {
                    const isSelected = selectedAssetId === asset.id;
                    const isFull = asset.jenis_aset === 'Hanggar' && (
                      asset.is_available === false || 
                      (asset.remaining_area !== undefined && asset.remaining_area < 0)
                    );
                    const isApron = asset.jenis_aset === 'Apron';

                    return (
                      <button
                        type="button"
                        key={asset.id}
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`p-2.5 text-left rounded-none border transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#3c8dbc] bg-blue-50/80 ring-1 ring-[#3c8dbc]'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-slate-900 text-xs">
                              {asset.nama_aset}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-none ${
                              isApron 
                                ? 'bg-blue-100 text-[#3c8dbc]' 
                                : isFull 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {asset.jenis_aset}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-500">
                            {isApron ? (
                              <span>Kapasitas Parkir Luar (Tarif Apron)</span>
                            ) : (
                              <span>Sisa: <strong>{(asset.remaining_area ?? 0).toLocaleString('id-ID')} m²</strong> dari {(asset.total_area || 0).toLocaleString('id-ID')} m²</span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400 font-mono">{asset.kode_aset}</span>
                          {isSelected && (
                            <span className="font-bold text-[#3c8dbc] flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Dialokasikan
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Catatan Admin UPBU */}
          <div>
            <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">
              Catatan Verifikasi Admin UPBU{' '}
              {selectedAssetId !== application.asset_id && (
                <span className="text-blue-600 font-normal">
                  ({isAviation ? 'Informasikan jika dipindah ke Apron/Hanggar lain' : 'Informasikan jika dialokasikan ke ruangan alternatif'})
                </span>
              )}
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={
                isAviation 
                  ? "Contoh: Disetujui. Karena Hanggar utama penuh pada tanggal 5-8 Okt, pesawat dialokasikan parkir di Apron Timur dengan tarif prorata."
                  : `Contoh: Disetujui. Perpanjangan masa sewa ruangan ${currentAsset?.nama_aset || 'Ruangan'} s.d. tanggal ${dayjs(requestedEndDate).format('DD MMMM YYYY')} disetujui.`
              }
              className="w-full p-2.5 border border-slate-300 rounded-none text-xs focus:ring-1 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white text-slate-800"
            />
          </div>

          {/* Footer Modal dengan Aksi Tolak & Setujui */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-none font-bold text-slate-600 hover:bg-slate-100 cursor-pointer text-xs"
            >
              Batal
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleReview('REJECT')}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 bg-[#dd4b39] hover:bg-[#c93b2a] text-white font-bold rounded-none text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <XCircle className="w-4 h-4" />
                Tolak Pengajuan
              </button>

              <button
                type="button"
                onClick={() => handleReview('APPROVE')}
                disabled={isSubmitting || !selectedAssetId}
                className="w-full sm:w-auto px-4 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold rounded-none shadow-xs text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {isAviation ? 'Setujui & Alokasikan Penempatan' : 'Setujui Perpanjangan Ruangan'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewExtensionModal;
