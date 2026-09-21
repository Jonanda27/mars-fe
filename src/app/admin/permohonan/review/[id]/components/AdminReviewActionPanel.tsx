import React from 'react';
import { RentalApplication } from '@/types/rental';
import { Asset } from '@/types/asset';
import StatusBadge from '@/components/StatusBadge';
import { formatRupiah } from '@/utils/formatCurrency';
import { calculateHangarRentalTotal } from '@/utils/aircraftTariff';
import { CheckCircle2, Loader2, Info, X, ArrowDown, Warehouse, Plane, AlertTriangle } from 'lucide-react';
import dayjs from 'dayjs';
import Link from 'next/link';

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
  handleAction: (status: string) => Promise<void>;
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
  const roleLower = userRole?.toLowerCase();
  const isKadis = roleLower === 'kadis' || roleLower === 'kepala dinas' || roleLower === 'dinas';
  const isAdmin = roleLower === 'admin' || roleLower === 'superadmin';
  const canValidate = isAdmin || isKadis;

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

        {(isAdminStep || currentStep > 3) && (
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
                disabled={!isAdminStep || saving || (roleLower !== 'admin' && isAdminStep)}
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
            <button 
              onClick={() => handleAction(isHangar ? 'Aktif' : 'Draft Kontrak')} 
              disabled={saving || !!isOverCapacity} 
              className={`w-full text-white py-3 px-4 rounded-none font-bold transition-all flex justify-center items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md cursor-pointer ${isOverCapacity ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {saving && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
              {isHangar ? 'Validasi & Setujui Sewa Hanggar' : 'Validasi & Terbitkan Kontrak Sewa (Surat PKS)'}
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
          <div className="text-center p-4">
            <p className="text-sm text-slate-500 font-medium">Menunggu Validasi oleh Admin / Kadis</p>
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
