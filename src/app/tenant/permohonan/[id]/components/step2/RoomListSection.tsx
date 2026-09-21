import React from 'react';
import { 
  Building2, SlidersHorizontal, SearchX, CheckCircle2, MapPin 
} from 'lucide-react';
import { RoomListSectionProps } from './types';

export const RoomListSection: React.FC<RoomListSectionProps> = ({
  roomZone,
  roomType,
  roomAC,
  availableAssets,
  isExtension,
  formData,
  setFormData,
}) => {
  const matchedZona = roomZone === 'dalam' ? 'Di Dalam Terminal' : 'Di Luar Terminal';
  const matchedAC = roomAC === 'dengan';
  const filteredRooms = availableAssets.filter(a => {
    const spec = a.spesifikasi_detail as { lokasi_zona?: string; tipe_ruangan?: string; fasilitas_ac?: boolean } | null;
    if (!spec) return false;
    return spec.lokasi_zona === matchedZona && spec.tipe_ruangan === roomType && spec.fasilitas_ac === matchedAC;
  });

  const renderRooms = () => {
    if (!roomZone || !roomType || !roomAC) {
      return (
        <div className="border border-dashed border-slate-200 rounded-lg p-8 text-center bg-slate-50/60">
          <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-[13px] font-semibold text-slate-700">Lengkapi 3 Kriteria Preferensi di Atas</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
            Silakan tentukan Zona Lokasi, Tipe Ruangan, dan Fasilitas AC pada kartu di atas untuk melihat ruangan yang tersedia.
          </p>
        </div>
      );
    }

    if (filteredRooms.length === 0) {
      return (
        <div className="border border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
          <SearchX className="w-9 h-9 text-slate-400 mx-auto mb-2" />
          <p className="text-[13px] font-semibold text-slate-700">Tidak Ada Ruangan yang Cocok</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
            Saat ini belum ada ruangan kosong dengan kombinasi zona, tipe, dan AC yang dipilih. Silakan coba kriteria lainnya.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map(asset => {
          const isSelected = formData.asset_id === asset.id.toString();
          const tariffRate = Number(asset.master_tariffs?.tarif || 0);
          const monthlyEstimate = tariffRate * Number(asset.luas || 0);

          return (
            <button
              type="button"
              key={asset.id}
              disabled={isExtension}
              onClick={() => setFormData(p => ({ ...p, asset_id: asset.id.toString() }))}
              className={`border rounded-lg p-4 transition-all relative flex flex-col justify-between text-left w-full ${
                isExtension ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
              } ${
                isSelected
                  ? 'border-[#3c8dbc] bg-blue-50/50 shadow-sm ring-2 ring-[#3c8dbc]/25'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                    {asset.kode_aset}
                  </span>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-[#3c8dbc] flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0 mt-0.5"></div>
                  )}
                </div>
                <h5 className="text-[13px] font-bold text-slate-800 leading-snug mb-1">{asset.nama_aset}</h5>
                <div className="flex items-center text-[11px] text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-slate-400" />
                  <span className="truncate">{asset.lokasi || '-'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded p-2 text-[11px] text-slate-600 mb-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Luas:</span>
                    <span className="font-bold text-slate-700">{asset.luas || 0} m²</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Kapasitas:</span>
                    <span className="font-medium text-slate-700">{asset.kapasitas || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between w-full">
                <div>
                  <span className="text-[10px] text-slate-400 block">Estimasi Tarif:</span>
                  <span className="text-[12px] font-bold text-[#3c8dbc]">
                    {monthlyEstimate > 0 ? `Rp ${monthlyEstimate.toLocaleString('id-ID')}` : 'Sesuai Ketentuan'}
                    <span className="text-[10px] font-normal text-slate-500 ml-0.5">/bln</span>
                  </span>
                </div>
                <span
                  className={`text-[11px] font-bold px-3 py-1 rounded transition-colors ${
                    isSelected 
                      ? 'bg-[#3c8dbc] text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? 'Dipilih' : 'Pilih Ruangan'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-4 gap-2">
        <div>
          <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#3c8dbc]" />
            Daftar Ruangan Sesuai Kriteria
          </h4>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Pilih salah satu ruangan yang ingin Anda sewa dari daftar di bawah ini.
          </p>
        </div>
        {roomZone && roomType && roomAC && (
          <span className="text-[11px] text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium self-start sm:self-auto">
            Filter: {roomZone === 'dalam' ? 'Dalam Terminal' : 'Luar Terminal'} • {roomType} • {roomAC === 'dengan' ? 'Dengan AC' : 'Tanpa AC'}
          </span>
        )}
      </div>

      {renderRooms()}
    </div>
  );
};
