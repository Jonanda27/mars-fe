import React from 'react';
import { 
  Warehouse, Calendar, Clock, Plane 
} from 'lucide-react';
import { RentalApplication } from '@/types/rental';
import { formatRupiah } from '@/utils/formatCurrency';
import { getAircraftTariff } from '@/utils/aircraftTariff';
import dayjs from 'dayjs';
import StatusBadge from '@/components/StatusBadge';

interface ContractAssetDetailCardProps {
  readonly app: RentalApplication;
  readonly isHangar: boolean;
  readonly totalMalam: number;
  readonly approvedAircrafts: any[];
  readonly totalArmadaArea: number;
  readonly hangarRentalCalc: any;
  readonly calculateAircraftArea: (aircraft: any) => number;
}

export const ContractAssetDetailCard: React.FC<ContractAssetDetailCardProps> = ({
  app,
  isHangar,
  totalMalam,
  approvedAircrafts,
  totalArmadaArea,
  hangarRentalCalc,
  calculateAircraftArea,
}) => {
  const spec = typeof app.specific_needs === 'string'
    ? JSON.parse(app.specific_needs)
    : (app.specific_needs || {});
  const extReq = spec?.extension_request;
  const hasApprovedExt = extReq && extReq.status === 'Approved';
  const prevEndDate = extReq?.original_end_date || (app.end_date && extReq?.additional_days ? dayjs(app.end_date).subtract(extReq.additional_days, 'day').format('YYYY-MM-DD') : null);
  const initialDuration = (app.start_date && prevEndDate) ? Math.max(1, dayjs(prevEndDate).diff(dayjs(app.start_date), 'day')) : null;

  return (
    <div className="space-y-6">
      {/* Rincian Fasilitas & Jadwal Sewa */}
      <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between">
          <span className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-[#3c8dbc]" />
            Rincian Objek &amp; Jadwal Sewa
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-[#3c8dbc] border border-blue-100">
            {app.application_type || (isHangar ? 'Sewa Hanggar' : 'Sewa Fasilitas')}
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Tujuan / Perihal
            </span>
            <p className="text-[13px] font-semibold text-slate-800">{app.purpose || '-'}</p>
          </div>

          {app.asset_id && (
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Aset Penempatan Dialokasikan ({app.assets?.jenis_aset || 'Fasilitas'})
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold text-slate-800">{app.assets?.nama_aset}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kode: <strong className="text-slate-700">{app.assets?.kode_aset}</strong> &bull; Kapasitas Luas: <strong className="text-[#3c8dbc]">{app.assets?.luas || 0} m²</strong>
                  </p>
                </div>
                <StatusBadge status="Tersedia" />
              </div>
              {app.specific_needs?.relocations && app.specific_needs.relocations.length > 0 && (
                <div className="mt-2 text-[11px] text-blue-800 bg-blue-50 border border-blue-200 p-2 rounded-none flex items-center gap-1.5">
                  <span className="font-bold">🔄 Penempatan Relokasi:</span>
                  <span>Dialihkan dari {app.specific_needs.relocations[app.specific_needs.relocations.length - 1].previous_asset_name} ke {app.assets?.nama_aset} saat perpanjangan sewa</span>
                </div>
              )}
            </div>
          )}

          {/* Periode Sewa */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="bg-white border border-slate-200 p-3 rounded-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-[#3c8dbc]" /> Tanggal Mulai
              </span>
              <p className="text-[13px] font-bold text-slate-800">
                {dayjs(app.start_date || app.contracts?.start_date).format('DD MMMM YYYY')}
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-none">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#3c8dbc]" /> Tanggal Selesai
                </span>
                {hasApprovedExt && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200">
                    +{extReq.additional_days} Hari
                  </span>
                )}
              </div>
              <p className="text-[13px] font-bold text-slate-800">
                {dayjs(app.end_date || app.contracts?.end_date).format('DD MMMM YYYY')}
              </p>
              {hasApprovedExt && prevEndDate && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Semula: <span className="line-through decoration-slate-400 font-mono text-slate-500">{dayjs(prevEndDate).format('DD MMMM YYYY')}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center bg-[#f4f8fb] border border-[#d2e3ee] px-3.5 py-2 text-xs font-semibold text-slate-700">
            <span>Total Durasi Pemanfaatan Hanggar:</span>
            <span className="font-bold text-[#3c8dbc] text-[13px]">{totalMalam} Malam</span>
          </div>

          {app.specific_needs?.facilities && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Kebutuhan Ruang / Fasilitas Tambahan
              </span>
              <p className="text-[12px] text-slate-700 italic bg-slate-50 p-2.5 border border-slate-200 leading-relaxed">
                &ldquo;{app.specific_needs.facilities}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Daftar Armada Pesawat yang Disetujui (Khusus Hanggar) */}
      {isHangar && (
        <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
              <Plane className="w-4 h-4 text-[#3c8dbc]" />
              Armada Pesawat yang Diizinkan Masuk
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200">
              {approvedAircrafts.length} Armada Terdaftar
            </span>
          </div>

          <div className="p-4">
            {approvedAircrafts.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400 italic">
                Data rincian armada tidak ditemukan pada permohonan ini.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {approvedAircrafts.map((ac: any, idx: number) => {
                  const area = calculateAircraftArea(ac);
                  const typeName = ac.custom_type_name || ac.aircraft_types?.jenis_pesawat || ac.aircraft_type || 'Pesawat Umum';
                  const dailyTariff = getAircraftTariff(ac);

                  return (
                    <div key={ac.id || idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 border border-blue-100 text-[#3c8dbc] flex items-center justify-center font-bold text-xs flex-shrink-0">
                          <Plane className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-[13px] font-bold text-slate-800 leading-tight">
                            {ac.registration_number}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {typeName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div className="hidden sm:block">
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">Luas Alokasi</span>
                          <span className="text-[11px] font-semibold text-slate-600">
                            {area} m²
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase">Tarif Master</span>
                          <span className="text-[12px] font-bold text-[#3c8dbc] bg-blue-50 px-2 py-0.5 border border-blue-100 whitespace-nowrap">
                            {formatRupiah(dailyTariff)} / malam
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {approvedAircrafts.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] font-medium text-slate-600 bg-slate-50 p-2.5">
                <span>Total Kapasitas Terpakai: <strong className="text-slate-800">{totalArmadaArea} m²</strong></span>
                <span>Total Tarif Harian: <strong className="text-[#3c8dbc] font-bold text-[12px]">{formatRupiah(hangarRentalCalc.totalPerMalam)} / malam</strong></span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
