import React from 'react';
import { formatRupiah } from '@/utils/formatCurrency';
import { getAircraftTariff } from '@/utils/aircraftTariff';
import { 
  Warehouse, SlidersHorizontal, Building2, Calendar, 
  Plus, CheckCircle2 
} from 'lucide-react';
import { HangarFormSectionProps } from './types';
import { calculateAircraftArea } from './utils';

export const HangarFormSection: React.FC<HangarFormSectionProps> = ({
  formData,
  handleChange,
  availableAssets,
  selectedAsset,
  assetCapacity,
  isOverCapacity,
  requiredArea,
  isExtension,
  totalMalam,
  specificNeeds,
  setSpecificNeeds,
  handleNeedsChange,
  tenantAircrafts,
  masterAircraftTypes,
  setShowAircraftModal,
}) => {
  const displayedAircrafts = isExtension 
    ? tenantAircrafts.filter(a => specificNeeds.aircraft_ids.includes(a.id.toString())) 
    : tenantAircrafts;

  const selectedAircraftObjects = displayedAircrafts.filter(a => specificNeeds.aircraft_ids.includes(a.id.toString()));
  const totalTarifPerMalam = selectedAircraftObjects.reduce((sum, a) => sum + getAircraftTariff(a), 0);
  const totalEstimasiHanggar = totalTarifPerMalam * totalMalam;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Kolom Kiri: Pilihan Objek Hanggar & Spesifikasi Teknis */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
          <div className="w-6 h-6 bg-blue-100 text-[#3c8dbc] rounded-none flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-[#3c8dbc]" />
            Objek Hanggar & Kapasitas {isExtension && <span className="text-[#3c8dbc] font-normal text-xs ml-1">(Perpanjangan)</span>}
          </h4>
        </div>

        {/* Dropdown Aset Utama */}
        <div className="space-y-1.5">
          <label className="block text-[13px] font-bold text-slate-800" htmlFor="asset_id_select">
            {isExtension ? 'Objek Aset (Perpanjangan)' : 'Objek Aset Utama yang Diminati'} <span className="text-red-500">*</span>
          </label>
          <select 
            id="asset_id_select"
            name="asset_id" 
            value={formData.asset_id} 
            onChange={handleChange} 
            required
            disabled={isExtension}
            className="w-full border border-slate-300 px-3.5 py-2.5 rounded-none text-[13px] outline-none focus:border-[#3c8dbc] transition-all bg-white disabled:bg-slate-100 disabled:text-slate-500 font-medium"
          >
            <option value="">-- Pilih Unit Hanggar --</option>
            {availableAssets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.kode_aset} - {asset.nama_aset} ({asset.luas || 0} m²)
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 leading-tight">
            {isExtension 
              ? 'Aset yang akan diperpanjang telah dikunci otomatis sesuai kontrak aktif Anda.' 
              : 'Pilih hanggar yang tersedia. Verifikasi kapasitas akhir akan disesuaikan dengan armada.'}
          </p>
        </div>

        {/* Status Kapasitas Hanggar */}
        {selectedAsset && assetCapacity && (
          <div className="bg-[#f4f8fb] border border-[#d2e3ee] rounded-none p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#3c8dbc]" /> Kapasitas Hanggar
              </span>
              <span className={`font-bold px-2 py-0.5 text-[11px] ${isOverCapacity ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-[#3c8dbc] border border-blue-200'}`}>
                {isOverCapacity ? 'Melebihi Kapasitas' : `Sisa: ${assetCapacity.remainingArea} m²`}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-none h-2.5 overflow-hidden flex">
              <div className="bg-slate-400 h-2.5 transition-all duration-300" style={{ width: `${Math.min(100, (assetCapacity.usedArea / assetCapacity.totalArea) * 100)}%` }}></div>
              <div className={`h-2.5 transition-all duration-300 ${isOverCapacity ? 'bg-red-500' : 'bg-[#3c8dbc]'}`} style={{ width: `${Math.min(100 - (assetCapacity.usedArea / assetCapacity.totalArea) * 100, (requiredArea / assetCapacity.totalArea) * 100)}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium">
              <span>Terpakai: {assetCapacity.usedArea + requiredArea} m²</span>
              <span>Total Luas: {assetCapacity.totalArea} m²</span>
            </div>
          </div>
        )}

        {/* Rincian Objek Sewa & Spesifikasi Detail Hanggar */}
        {selectedAsset ? (
          <div className="border border-slate-200 rounded-none overflow-hidden bg-white shadow-xs">
            <div className="bg-[#f4f8fb] border-b border-[#d2e3ee] text-[#3c8dbc] px-4 py-2.5 text-[12px] font-bold uppercase flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                Rincian Objek & Spesifikasi Teknis
              </span>
              <span className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 border border-slate-200">
                {selectedAsset.kode_aset}
              </span>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h5 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-2">Data Bandara</h5>
                  <div className="text-[12px] text-slate-600 space-y-1">
                    <p><span className="text-slate-400">Bandara:</span> <strong className="text-slate-700">Mozes Kilangin</strong></p>
                    <p><span className="text-slate-400">Kode IATA:</span> <strong className="text-slate-700">TIM</strong></p>
                    <p><span className="text-slate-400">Wilayah:</span> Timika, Papua Tengah</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-2">Data Aset Utama</h5>
                  <div className="text-[12px] text-slate-600 space-y-1">
                    <p><span className="text-slate-400">Nama:</span> <strong className="text-slate-700">{selectedAsset.nama_aset}</strong></p>
                    <p><span className="text-slate-400">Luas:</span> <strong className="text-[#3c8dbc]">{selectedAsset.luas || 0} m²</strong></p>
                    <p><span className="text-slate-400">Kapasitas:</span> {selectedAsset.kapasitas || '-'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h5 className="text-[12px] font-bold text-slate-700 uppercase tracking-wider mb-2.5">Spesifikasi Fasilitas Hanggar</h5>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12px] text-slate-700">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Tinggi Bangunan:</span>
                    <span className="font-semibold text-slate-800">{selectedAsset.spesifikasi_detail?.tinggi_bangunan || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Pintu Hanggar:</span>
                    <span className="font-semibold text-slate-800">{selectedAsset.spesifikasi_detail?.pintu_hanggar || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Fasilitas Listrik:</span>
                    <span className="font-semibold text-slate-800">{selectedAsset.spesifikasi_detail?.fasilitas_listrik || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Fire Safety:</span>
                    <span className="font-semibold text-slate-800">{selectedAsset.spesifikasi_detail?.fire_safety || '-'}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-50">
                    <span className="text-slate-400 text-[11px] block">Koneksi Apron:</span>
                    <span className="font-semibold text-slate-800">{selectedAsset.spesifikasi_detail?.apron_connection || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-slate-300 p-8 text-center bg-slate-50/60 rounded-none">
            <Warehouse className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">Pilih Aset Hanggar</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Spesifikasi teknis, dimensi, dan status kapasitas akan tampil di sini.</p>
          </div>
        )}
      </div>

      {/* Kolom Kanan: Jadwal Sewa, Armada & Kebutuhan Spesifik */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-200">
          <div className="w-6 h-6 bg-blue-100 text-[#3c8dbc] rounded-none flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#3c8dbc]" />
            Jadwal Sewa & Armada Pesawat
          </h4>
        </div>

        {/* Periode Rencana Sewa */}
        <div className="bg-[#f8fafc] border border-slate-200 p-4 rounded-none space-y-2.5">
          <label className="block text-[13px] font-bold text-slate-800">
            Periode Rencana Sewa {isExtension && <span className="text-[#3c8dbc] font-normal text-xs">(Perpanjangan)</span>} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="hangar_start_date" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal Mulai {isExtension && <span className="text-[#3c8dbc] text-[10px]">(Otomatis)</span>}
              </label>
              <input 
                id="hangar_start_date"
                type="date" 
                name="start_date" 
                value={formData.start_date} 
                onChange={handleChange} 
                required
                disabled={isExtension}
                className="w-full border border-slate-300 px-3 py-2 rounded-none text-[13px] outline-none focus:border-[#3c8dbc] bg-white disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>
            <div>
              <label htmlFor="hangar_end_date" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal Selesai
              </label>
              <input 
                id="hangar_end_date"
                type="date" 
                name="end_date" 
                value={formData.end_date} 
                onChange={handleChange} 
                min={formData.start_date}
                required
                className="w-full border border-slate-300 px-3 py-2 rounded-none text-[13px] outline-none focus:border-[#3c8dbc] bg-white"
              />
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-slate-600 mb-1">Durasi Sewa</span>
              <div className="w-full border border-slate-300 bg-white px-3 py-2 rounded-none text-[13px] font-bold text-slate-800 flex items-center justify-center h-[38px]">
                {totalMalam} Malam
              </div>
            </div>
          </div>
        </div>

        {/* Armada Pesawat */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="block text-[13px] font-bold text-slate-800">
                {isExtension ? 'Armada Pesawat (Perpanjangan)' : 'Pilih Armada Pesawat'} <span className="text-red-500">*</span>
              </span>
              <span className="text-[11px] text-slate-500">Centang minimal satu armada yang akan disewa di hanggar</span>
            </div>
            {!isExtension && (
              <button 
                type="button" 
                onClick={() => setShowAircraftModal(true)}
                className="text-xs bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3 py-1.5 rounded-none font-bold transition-colors flex items-center shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Armada
              </button>
            )}
          </div>
          <div className="border border-slate-300 rounded-none bg-white max-h-[220px] overflow-y-auto divide-y divide-slate-100">
            {displayedAircrafts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                {isExtension ? "Tidak ada armada pesawat yang diperpanjang." : "Belum ada armada terdaftar. Silakan klik 'Tambah Armada' di atas."}
              </div>
            ) : (
              displayedAircrafts.map(aircraft => {
                const isSelected = specificNeeds.aircraft_ids.includes(aircraft.id.toString());
                const aircraftArea = calculateAircraftArea(aircraft, masterAircraftTypes);
                const typeName = aircraft.custom_type_name || aircraft.aircraft_types?.jenis_pesawat || masterAircraftTypes.find(t => t.id === aircraft.aircraft_type_id)?.jenis_pesawat || 'Tipe Tidak Diketahui';

                return (
                  <label key={aircraft.id} className={`flex items-start p-3 ${isExtension ? 'cursor-default bg-slate-50/50' : 'cursor-pointer hover:bg-slate-50'} transition-colors ${!isExtension && isSelected ? 'bg-blue-50/40' : ''}`}>
                    {!isExtension && (
                      <div className="pt-0.5 flex-shrink-0 mr-3">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={(e) => {
                            const ids = [...specificNeeds.aircraft_ids];
                            if (e.target.checked) {
                              ids.push(aircraft.id.toString());
                            } else {
                              const index = ids.indexOf(aircraft.id.toString());
                              if (index > -1) ids.splice(index, 1);
                            }
                            setSpecificNeeds(prev => ({ ...prev, aircraft_ids: ids }));
                          }}
                          className="w-4 h-4 text-[#3c8dbc] border-slate-300 rounded-none focus:ring-[#3c8dbc]"
                        />
                      </div>
                    )}
                    {isExtension && (
                      <div className="pt-0.5 flex-shrink-0 mr-3 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[13px] font-bold text-slate-800">{aircraft.registration_number}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-[#3c8dbc] bg-blue-50 px-2 py-0.5 border border-blue-100">{aircraftArea} m²</span>
                          <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 border border-slate-200">
                            {formatRupiah(getAircraftTariff(aircraft))} / malam
                          </span>
                        </div>
                      </div>
                      <span className="block text-[11px] text-slate-500">
                        {typeName} &bull; MTOW: {aircraft.mtow ? Number(aircraft.mtow).toLocaleString('id-ID') : 0} Kg
                      </span>
                    </div>
                  </label>
                );
              })
            )}
          </div>
          {specificNeeds.aircraft_ids.length > 0 && (
            <div className="space-y-1.5 p-2.5 bg-blue-50/60 border border-blue-100 text-[11px] font-semibold text-slate-700">
              <div className="flex justify-between items-center">
                <span>Total Armada Terpilih: {specificNeeds.aircraft_ids.length} unit</span>
                <span className="font-bold text-[#3c8dbc]">Total Luas: {requiredArea} m²</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-blue-200/60">
                <span>Total Tarif Master:</span>
                <div className="text-right">
                  <span className="font-bold text-slate-800">{formatRupiah(totalTarifPerMalam)} / malam</span>
                  {totalMalam > 0 && (
                    <span className="block text-[10px] text-slate-500 font-normal">
                      Estimasi: <strong className="text-[#3c8dbc]">{formatRupiah(totalEstimasiHanggar)}</strong> ({totalMalam} malam)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Kebutuhan Ruang Pendukung Khusus */}
        <div className="space-y-1.5">
          <label htmlFor="kebutuhan_ruang_pendukung" className="block text-[13px] font-bold text-slate-800">
            Kebutuhan Ruang Pendukung Khusus (Opsional)
          </label>
          <textarea 
            id="kebutuhan_ruang_pendukung"
            name="kebutuhan_ruang_pendukung"
            value={specificNeeds.kebutuhan_ruang_pendukung}
            onChange={handleNeedsChange}
            placeholder="Contoh: Kebutuhan koneksi apron luas, daya listrik tambahan (ground power), penempatan peralatan GSE, atau ruang kantor..."
            className="w-full border border-slate-300 p-3 rounded-none text-[13px] outline-none focus:border-[#3c8dbc] transition-all bg-white min-h-[90px] resize-y"
          />
        </div>
      </div>
    </div>
  );
};
