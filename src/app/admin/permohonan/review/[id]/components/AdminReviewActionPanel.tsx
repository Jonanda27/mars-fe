import React, { useState, useEffect } from 'react';
import { RentalApplication } from '@/types/rental';
import { Asset } from '@/types/asset';
import StatusBadge from '@/components/StatusBadge';
import { formatRupiah } from '@/utils/formatCurrency';
import { calculateHangarRentalTotal } from '@/utils/aircraftTariff';
import { CheckCircle2, Loader2, Info, X, ArrowDown, Warehouse, Plane, AlertTriangle } from 'lucide-react';
import dayjs from 'dayjs';
import Link from 'next/link';

import { useAuthStore } from '@/store/useAuthStore';
import { rentalService, StandAvailability } from '@/services/rentalService';

interface AdminReviewActionPanelProps {
  app: RentalApplication;
  currentStep: number;
  isKadisStep: boolean;
  isAdminStep: boolean;
  userRole?: string;
  saving: boolean;
  selectedAssetId: string;
  handleAssetSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  availableAssets: Asset[];
  assetCapacity: { isHangar: boolean; totalArea: number; usedArea: number; remainingArea: number } | null;
  fetchingCapacity: boolean;
  isOverCapacity?: boolean | null;
  requiredArea: number;
  handleVerifyLetter: (status: string) => Promise<void>;
  handleAction: (status: string, extraData?: any) => Promise<void>;
}

export const AdminReviewActionPanel: React.FC<AdminReviewActionPanelProps> = ({
  app,
  currentStep,
  isKadisStep,
  isAdminStep,
  userRole,
  saving,
  selectedAssetId,
  handleAssetSelect,
  availableAssets,
  assetCapacity,
  fetchingCapacity,
  isOverCapacity,
  requiredArea,
  handleVerifyLetter,
  handleAction,
}) => {
  const { user: currentUser } = useAuthStore();
  const effectiveRole = (userRole || currentUser?.role || '').toLowerCase();
  const isKadis = effectiveRole === 'kadis' || effectiveRole === 'kepala dinas' || effectiveRole === 'dinas';
  const isMiniAdmin = effectiveRole === 'admin_mini_airport' || Boolean(currentUser?.mini_airport_id);
  const isAdmin = effectiveRole === 'admin' || effectiveRole === 'admin_mini_airport' || effectiveRole === 'superadmin' || isMiniAdmin;

  const spec = typeof app.specific_needs === 'string'
    ? (() => { try { return JSON.parse(app.specific_needs); } catch (e) { return {}; } })()
    : (app.specific_needs || {});

  const [selectedStand, setSelectedStand] = useState<string>(
    spec?.allocated_stand || 'STAND 01'
  );

  const [standsAvailability, setStandsAvailability] = useState<StandAvailability[]>([]);
  const [fetchingStands, setFetchingStands] = useState<boolean>(false);

  const isMini = Boolean(
    app.application_type?.toLowerCase().includes('mini') ||
    spec?.service_type === 'Mini Airport' ||
    Boolean(spec?.airport_id || spec?.mini_airport_id || spec?.airport_name)
  );

  const targetMiniId = spec?.airport_id || spec?.mini_airport_id;
  const targetMiniName = spec?.airport_name || 'Lapangan Terbang Perintis';
  const targetMiniCode = spec?.airport_code || '';

  // Fetch real-time stand availability for Mini Airport
  useEffect(() => {
    if (isMini && targetMiniId) {
      const fetchStands = async () => {
        setFetchingStands(true);
        try {
          const standsData = await rentalService.getMiniAirportStandAvailability(
            Number(targetMiniId),
            spec?.landing_date,
            app.id
          );
          setStandsAvailability(standsData);

          // Cek apakah stand yang tersimpan sebelumnya masih kosong
          const currentlyAllocated = spec?.allocated_stand;
          const matchAllocated = standsData.find(s => s.stand === currentlyAllocated);

          if (matchAllocated && !matchAllocated.is_occupied) {
            setSelectedStand(currentlyAllocated);
          } else {
            // Pilih stand kosong pertama yang tersedia
            const firstAvailable = standsData.find(s => !s.is_occupied);
            if (firstAvailable) {
              setSelectedStand(firstAvailable.stand);
            } else {
              setSelectedStand('');
            }
          }
        } catch (err) {
          console.error('Error fetching stand availability:', err);
        } finally {
          setFetchingStands(false);
        }
      };
      fetchStands();
    }
  }, [isMini, targetMiniId, spec?.landing_date, app.id]);

  const selectedStandInfo = standsAvailability.find(s => s.stand === selectedStand);
  const isSelectedStandOccupied = selectedStandInfo?.is_occupied || false;
  const areAllStandsOccupied = isMini && standsAvailability.length > 0 && standsAvailability.every(s => s.is_occupied);

  const isGlobalRole = ['superadmin', 'kepala dinas', 'dinas'].includes(effectiveRole);
  
  // Check if admin is authorized for this airport
  let isAuthorizedForAirport = true;
  let unauthorizedReason = '';

  if (!isGlobalRole) {
    if (isMini) {
      if (currentUser?.mini_airport_id && targetMiniId && Number(currentUser.mini_airport_id) !== Number(targetMiniId)) {
        isAuthorizedForAirport = false;
        unauthorizedReason = `Permohonan ini ditujukan khusus ke ${targetMiniName}${targetMiniCode ? ` (${targetMiniCode})` : ''}. Validasi hanya dapat dilakukan oleh Administrator ${targetMiniName}.`;
      }
    } else {
      if (currentUser?.mini_airport_id) {
        isAuthorizedForAirport = false;
        unauthorizedReason = `Permohonan sewa ini berada di bawah pengelolaan Bandara Mozes Kilangin Timika dan tidak dapat divalidasi oleh Administrator Mini Airport.`;
      }
    }
  }

  const canValidate = (isAdmin || isKadis) && isAuthorizedForAirport;

  const isHangar = Boolean(
    app.application_type?.toLowerCase().includes('hanggar') ||
    app.assets?.kategori?.toLowerCase().includes('hanggar') ||
    app.contracts?.contract_type === 'Payung'
  );

  const durasiMalam = (() => {
    if (!app.end_date || !app.start_date) return 1;
    const diff = dayjs(app.end_date).diff(dayjs(app.start_date), 'day');
    return diff === 0 ? 1 : diff;
  })();

  const aircraftDetails = app.specific_needs?.aircraft_details || [];
  const hangarCalc = calculateHangarRentalTotal(aircraftDetails, durasiMalam);

  return (
    <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-[#3c8dbc] px-5 py-4">
        <h2 className="text-white font-bold tracking-wide flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2 text-white/90" /> Tindak Lanjut & Validasi
        </h2>
      </div>
      
      <div className="p-5">
        
        {isKadisStep && canValidate && (
          <div className="mb-6">
            <span className="block text-sm font-bold text-slate-800 mb-1">Persetujuan Surat Permohonan</span>
            <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
              Mohon periksa dokumen lampiran Surat Permohonan Resmi. Jika sesuai, silakan berikan persetujuan agar Tenant dapat melanjutkan ke tahap pengisian detail layanan.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleVerifyLetter('Surat Disetujui')} 
                disabled={saving} 
                className="w-full text-white py-3 px-4 rounded-none font-bold transition-all flex justify-center items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md bg-green-600 hover:bg-green-700 cursor-pointer"
              >
                {saving && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                Setujui Surat
              </button>
              
              <button 
                onClick={() => handleVerifyLetter('Ditolak')} 
                disabled={saving} 
                className="w-full bg-white hover:bg-red-50 text-red-600 border-2 border-red-100 hover:border-red-200 py-2.5 px-4 rounded-none font-bold transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Tolak Permohonan
              </button>
            </div>
          </div>
        )}

        {isKadisStep && !canValidate && (
          <div className="text-center p-4">
            <p className="text-sm text-slate-500 font-medium">Menunggu Verifikasi Kepala Dinas (Kadis)</p>
          </div>
        )}

        {/* Khusus Mini Airport: Verifikasi Rencana Pendaratan & Stand Apron */}
        {isMini && (isAdminStep || currentStep > 3) && (
          <div className="mb-6 space-y-3">
            <label className="block text-sm font-bold text-slate-800">
              Verifikasi Operasional Mini Airport
            </label>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sebagai Pengelola Lapangan Terbang Perintis yang dituju, verifikasi rencana pendaratan dan konfirmasi kesiapan stand apron.
            </p>
            <div className="bg-slate-50 border border-slate-200 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Mini Airport Tujuan:</span>
                <span className="font-bold text-[#3c8dbc]">
                  {spec?.airport_name || 'Lapangan Terbang Perintis'} ({spec?.airport_code || '-'})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Armada Pesawat:</span>
                <span className="font-mono font-bold text-slate-800">
                  {spec?.registration_number || '-'} ({spec?.aircraft_type || 'Perintis'})
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Waktu Pendaratan:</span>
                <span className="font-bold text-slate-700">
                  {spec?.landing_date ? dayjs(spec.landing_date).format('DD MMMM YYYY') : '-'} Pukul {spec?.landing_time || '-'} WIT
                </span>
              </div>
              {/* Alokasi Stand Apron oleh Admin */}
              {isAdminStep && canValidate ? (
                <div className="pt-2.5 border-t border-slate-200 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-bold text-xs flex items-center gap-1.5">
                      Tetapkan Stand Apron <span className="text-red-500">*</span>:
                    </span>
                    {selectedStand && !isSelectedStandOccupied ? (
                      <StatusBadge status="Aktif" label={`Pilihan: ${selectedStand}`} />
                    ) : selectedStand && isSelectedStandOccupied ? (
                      <StatusBadge status="Ditolak" label={`${selectedStand} (TERISI)`} />
                    ) : (
                      <StatusBadge status="Menunggu" label="Belum Dipilih" />
                    )}
                  </div>

                  {fetchingStands ? (
                    <div className="p-3 text-center text-xs text-slate-500 bg-white border border-slate-200 flex items-center justify-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#3c8dbc]" />
                      <span>Memeriksa ketersediaan stand apron real-time...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {(standsAvailability.length > 0 ? standsAvailability : [
                          { stand: 'STAND 01', name: 'Apron Utama', is_occupied: false, occupied_by: null, aircraft_type: null, status: 'Tersedia', source: null, notes: '' },
                          { stand: 'STAND 02', name: 'Apron Cadangan', is_occupied: false, occupied_by: null, aircraft_type: null, status: 'Tersedia', source: null, notes: '' }
                        ]).map((st) => {
                          const isOccupied = st.is_occupied;
                          const isSelected = selectedStand === st.stand;

                          return (
                            <button
                              key={st.stand}
                              type="button"
                              onClick={() => {
                                if (!isOccupied) setSelectedStand(st.stand);
                              }}
                              disabled={saving || isOccupied}
                              className={`p-2.5 text-left border transition-all relative flex flex-col justify-between min-h-[82px] ${
                                isOccupied
                                  ? 'bg-rose-50/80 border-rose-300 cursor-not-allowed opacity-95'
                                  : isSelected
                                  ? 'bg-[#3c8dbc] text-white border-[#3c8dbc] shadow-xs cursor-pointer'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 cursor-pointer hover:border-[#3c8dbc]'
                              }`}
                            >
                              <div className="flex justify-between items-center w-full mb-1">
                                <span className={`font-mono font-bold text-xs ${
                                  isOccupied ? 'text-rose-900 line-through' : isSelected ? 'text-white' : 'text-slate-800'
                                }`}>
                                  {st.stand}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                                  isOccupied
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : isSelected
                                    ? 'bg-white/20 text-white border-white/40'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}>
                                  {isOccupied ? 'TERISI' : 'KOSONG'}
                                </span>
                              </div>

                              <div>
                                <span className={`block text-[11px] font-bold leading-tight ${
                                  isOccupied
                                    ? 'text-rose-700'
                                    : isSelected
                                    ? 'text-white'
                                    : 'text-slate-700'
                                }`}>
                                  {isOccupied ? (st.occupied_by ? `${st.occupied_by}` : 'Terisi') : st.name}
                                </span>
                                {isOccupied ? (
                                  <span className="block text-[9px] text-rose-600 truncate mt-0.5 font-medium">
                                    {st.aircraft_type ? `${st.aircraft_type}` : st.status}
                                  </span>
                                ) : (
                                  <span className={`block text-[9px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-emerald-600'}`}>
                                    Siap digunakan
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Notifikasi Peringatan jika semua stand penuh */}
                      {areAllStandsOccupied && (
                        <div className="bg-rose-50 border border-rose-300 p-2.5 text-xs text-rose-900 mt-2">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-semibold">Semua Stand Apron Penuh</strong>
                              <p className="text-[11px] leading-relaxed text-rose-800">
                                Seluruh stand apron di {targetMiniName} sedang terisi pada tanggal ini. Permohonan tidak dapat disetujui sampai ada stand yang kosong atau jadwal pendaratan disesuaikan.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Alokasi Stand Apron:</span>
                  <span className="font-bold text-[#00a65a] bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 font-mono text-xs">
                    {(app.specific_needs as any)?.allocated_stand || selectedStand || 'STAND 01'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Khusus Non-Mini Airport: Penetapan Alokasi Aset Ruangan/Hanggar */}
        {!isMini && (isAdminStep || currentStep > 3) && (
          <div className="mb-6">
            <label htmlFor="alokasi-aset-select" className="block text-sm font-bold text-slate-800 mb-1">
              Alokasikan Aset <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Admin harus menetapkan alokasi aset definitif kepada tenant.
            </p>
            <div className="relative">
              <select 
                id="alokasi-aset-select"
                value={selectedAssetId} 
                onChange={handleAssetSelect} 
                disabled={!isAdminStep || saving || !canValidate}
                className="w-full border-2 border-slate-200 px-3 py-2.5 rounded-none text-sm outline-none focus:border-[#3c8dbc] focus:ring-4 focus:ring-blue-50 bg-white disabled:bg-slate-100 disabled:text-slate-500 transition-all font-medium appearance-none"
              >
                <option value="">-- Silakan Pilih Aset --</option>
                {availableAssets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.kode_aset} - {asset.nama_aset}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>
            {selectedAssetId && (() => {
              const asset = availableAssets.find(a => a.id.toString() === selectedAssetId);
              const isHanggar = asset?.jenis_aset?.toLowerCase().includes('hanggar');
              
              return (
                <div className="mt-3">
                  <div className="bg-[#f4f8fb] border border-[#d2e3ee] p-2.5 rounded-none text-xs text-slate-700 flex items-start gap-2 mb-3">
                    <Info className="w-4 h-4 text-[#3c8dbc] flex-shrink-0 mt-0.5" />
                    {isHanggar ? (
                      <div className="space-y-1">
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          Tarif sewa hanggar dihitung <strong>per unit pesawat per malam</strong> sesuai Master Tarif resmi.
                        </p>
                        {hangarCalc.totalPerMalam > 0 && (
                          <p className="text-[11px] font-bold text-[#3c8dbc]">
                            Total: {formatRupiah(hangarCalc.totalPerMalam)} / malam ({hangarCalc.breakdown.length} armada) &bull; Estimasi: {formatRupiah(hangarCalc.totalEstimasi)} ({durasiMalam} malam)
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] leading-relaxed text-slate-600">
                        Tarif Dasar Aset: <strong>{formatRupiah((asset as any)?.tarif_dasar || (asset as any)?.master_tariffs?.tarif)} / {(asset as any)?.satuan}</strong>
                      </p>
                    )}
                  </div>
                  
                  {isHanggar && fetchingCapacity && (
                    <div className="text-xs text-slate-500 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin"/> Mengecek kapasitas...</div>
                  )}
                  
                  {isHanggar && assetCapacity && !fetchingCapacity && (
                    <div className="space-y-2 mt-2">
                      {/* 1. Kondisi Kapasitas Hanggar Saat Ini */}
                      <div className="p-3.5 border border-slate-200 bg-white rounded-none shadow-xs">
                        <div className="flex justify-between items-center mb-2.5">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Warehouse className="w-3.5 h-3.5 text-slate-500" />
                            Kapasitas Saat Ini
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200">
                            Sisa: {assetCapacity.remainingArea} m²
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-none h-2.5 mb-2 overflow-hidden border border-slate-200/80">
                          <div 
                            className="bg-slate-400 h-2.5 transition-all duration-300" 
                            style={{ width: `${Math.min(100, (assetCapacity.usedArea / assetCapacity.totalArea) * 100)}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-slate-500 flex justify-between mb-2.5 font-medium">
                          <span>Terpakai: <strong className="text-slate-700">{assetCapacity.usedArea} m²</strong></span>
                          <span>Total: <strong className="text-slate-700">{assetCapacity.totalArea} m²</strong></span>
                        </div>
                        <div className="text-[11px] font-bold py-1.5 px-3 rounded-none text-center bg-[#f4f8fb] text-[#3c8dbc] border border-[#d2e3ee] flex items-center justify-center gap-1.5">
                          <Plane className="w-3.5 h-3.5" />
                          <span>Kebutuhan Pemohon: <strong>{requiredArea} m²</strong></span>
                        </div>
                      </div>

                      {/* Panah Ke Bawah / Indikator Transisi Persetujuan */}
                      <div className="flex items-center justify-center relative py-1 my-1">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative bg-white px-2.5 py-0.5 border border-slate-300 text-slate-600 flex items-center gap-1 shadow-2xs">
                          <ArrowDown className="w-3.5 h-3.5 text-[#3c8dbc]" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Jika Disetujui</span>
                        </div>
                      </div>

                      {/* 2. Proyeksi Kapasitas Hanggar Setelah Disetujui */}
                      {(() => {
                        const newUsedArea = assetCapacity.usedArea + requiredArea;
                        const newRemainingArea = assetCapacity.totalArea - newUsedArea;
                        const isProjectedOver = newUsedArea > assetCapacity.totalArea;
                        const usedPercent = Math.min(100, (assetCapacity.usedArea / assetCapacity.totalArea) * 100);
                        const addPercent = Math.min(Math.max(0, 100 - usedPercent), (requiredArea / assetCapacity.totalArea) * 100);

                        return (
                          <div className={`p-3.5 border rounded-none shadow-xs ${isProjectedOver ? 'bg-red-50/70 border-red-300' : 'bg-[#f4f8fb] border-[#d2e3ee]'}`}>
                            <div className="flex justify-between items-center mb-2.5">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#3c8dbc]" />
                                Kapasitas Setelah Disetujui
                              </span>
                              <span className={`text-[11px] font-bold px-2 py-0.5 border ${
                                isProjectedOver 
                                  ? 'bg-red-100 text-red-700 border-red-200' 
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}>
                                {isProjectedOver ? `Kurang: ${Math.abs(newRemainingArea)} m²` : `Sisa: ${newRemainingArea} m²`}
                              </span>
                            </div>

                            {/* Dual Segment Progress Bar */}
                            <div className="w-full bg-slate-200 rounded-none h-2.5 mb-2 overflow-hidden flex border border-slate-300/80">
                              <div 
                                className="bg-slate-400 h-2.5 transition-all duration-300" 
                                style={{ width: `${usedPercent}%` }}
                                title={`Terpakai Sebelumnya: ${assetCapacity.usedArea} m²`}
                              />
                              <div 
                                className={`${isProjectedOver ? 'bg-red-500' : 'bg-[#3c8dbc]'} h-2.5 transition-all duration-300`} 
                                style={{ width: `${addPercent}%` }}
                                title={`Tambahan Pemohon: ${requiredArea} m²`}
                              />
                            </div>

                            <div className="text-[11px] text-slate-500 flex justify-between mb-2.5 font-medium">
                              <span>Total Terpakai: <strong className={isProjectedOver ? 'text-red-600' : 'text-[#3c8dbc]'}>{newUsedArea} m²</strong></span>
                              <span>Total: <strong className="text-slate-700">{assetCapacity.totalArea} m²</strong></span>
                            </div>

                            <div className={`text-[11px] font-bold py-1.5 px-3 rounded-none text-center flex items-center justify-center gap-1.5 border ${
                              isProjectedOver 
                                ? 'bg-red-100 text-red-700 border-red-300' 
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}>
                              {isProjectedOver ? (
                                <>
                                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                                  <span>Melebihi Kapasitas: Kurang <strong>{Math.abs(newRemainingArea)} m²</strong></span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Kapasitas Hanggar: Sisa <strong>{newRemainingArea} m²</strong></span>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {isAdminStep && canValidate && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            {isMini && (
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Terverifikasi sebagai <strong>Administrator {targetMiniName}</strong>.</span>
              </div>
            )}
            <button 
              onClick={() => handleAction(isMini ? 'Aktif' : (isHangar ? 'Aktif' : 'Draft Kontrak'), selectedStand)} 
              disabled={
                saving || 
                (!isMini && !!isOverCapacity) || 
                (isMini && (areAllStandsOccupied || !selectedStand || isSelectedStandOccupied))
              } 
              className={`w-full text-white py-3 px-4 rounded-none font-bold transition-all flex justify-center items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md cursor-pointer ${
                (!isMini && isOverCapacity) || (isMini && (areAllStandsOccupied || !selectedStand || isSelectedStandOccupied))
                  ? 'bg-slate-400' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {saving && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
              {isMini 
                ? (areAllStandsOccupied 
                    ? 'Stand Apron Penuh' 
                    : isSelectedStandOccupied 
                    ? 'Stand Terisi - Pilih Stand Kosong' 
                    : !selectedStand 
                    ? 'Pilih Stand Apron Terlebih Dahulu' 
                    : 'Validasi & Terbitkan Izin Pendaratan Aktif') 
                : (isHangar ? 'Validasi & Setujui Sewa Hanggar' : 'Validasi & Terbitkan Kontrak Sewa (Surat PKS)')}
            </button>
            
            <button 
              onClick={() => handleAction('Rejected')} 
              disabled={saving} 
              className="w-full bg-white hover:bg-red-50 text-red-600 border-2 border-red-100 hover:border-red-200 py-2.5 px-4 rounded-none font-bold transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Tolak Permohonan
            </button>
          </div>
        )}

        {isAdminStep && !canValidate && (
          <div className="p-4 border-t border-slate-100">
            {!isAuthorizedForAirport ? (
              <div className="bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 text-left">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold mb-1 text-amber-950">Wewenang Validasi Terbatas</strong>
                    <p className="leading-relaxed text-[11px]">{unauthorizedReason}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-slate-500 font-medium">Menunggu Validasi oleh Admin / Kadis</p>
              </div>
            )}
          </div>
        )}

        {currentStep > 3 && (
          <div className="pt-4 border-t border-slate-100">
            <div className={`p-4 rounded-none flex flex-col gap-2 items-center text-center
              ${app.status === 'Signed' || app.status === 'Draft Kontrak' || app.status === 'Approved' || app.status === 'Aktif' ? 'bg-blue-50 border border-blue-100' : 'bg-red-50 border border-red-100'}
            `}>
              {app.status === 'Signed' || app.status === 'Draft Kontrak' || app.status === 'Approved' || app.status === 'Aktif' ? (
                <CheckCircle2 className="w-10 h-10 text-blue-500 mb-1" />
              ) : (
                <X className="w-10 h-10 text-red-500 mb-1" />
              )}
              
              <div className="flex flex-col items-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1.5">Status Saat Ini</p>
                <StatusBadge status={app.status} className="text-xs px-4 py-1.5" />
              </div>

              {app.status === 'Draft Kontrak' && !isHangar && (
                <div className="w-full mt-3 flex flex-col gap-2">
                  <Link href={isKadis ? "/dinas/kontrak" : "/admin/kontrak"} className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 py-2 px-3 rounded-none text-[13px] font-semibold text-center transition-colors shadow-xs flex items-center justify-center">
                    Lihat Dokumen PKS di Menu Kontrak
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default AdminReviewActionPanel;
