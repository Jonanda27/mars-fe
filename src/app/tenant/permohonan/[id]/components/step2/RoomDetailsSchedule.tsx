import React from 'react';
import { Building2, Calendar, CreditCard, Info, FileText } from 'lucide-react';
import { RoomDetailsScheduleProps } from './types';
import { calculateTotalLeaseEstimate } from './utils';

export const RoomDetailsSchedule: React.FC<RoomDetailsScheduleProps> = ({
  selectedAsset,
  formData,
  handleChange,
  isExtension,
  totalMalam,
  specificNeeds,
  handleNeedsChange,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    {/* Left Column (6 cols): Spesifikasi Ruangan & Periode Sewa */}
    <div className="lg:col-span-6 space-y-6">
      {/* Spesifikasi Detail Ruangan */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
          <span className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#3c8dbc]" />
            Spesifikasi Ruangan Terpilih
          </span>
          <span className="text-[11px] bg-blue-50 text-[#3c8dbc] font-mono font-bold px-2 py-0.5 rounded border border-blue-100">
            {selectedAsset.kode_aset}
          </span>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <h5 className="text-[14px] font-bold text-slate-800">{selectedAsset.nama_aset}</h5>
            <p className="text-[12px] text-slate-500 mt-0.5">{selectedAsset.lokasi || '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-700 bg-slate-50/60 p-3 rounded border border-slate-100">
            <div>
              <span className="text-slate-400 block text-[10px]">Zona & Tipe:</span>
              <span className="font-semibold">{selectedAsset.spesifikasi_detail?.lokasi_zona || '-'} ({selectedAsset.spesifikasi_detail?.tipe_ruangan || '-'})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Luas Ruangan:</span>
              <span className="font-semibold">{selectedAsset.luas || 0} m²</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Pendingin Ruangan:</span>
              <span className="font-semibold">{selectedAsset.spesifikasi_detail?.fasilitas_ac ? 'Dengan AC' : 'Tanpa AC'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Kelistrikan:</span>
              <span className="font-semibold">{selectedAsset.spesifikasi_detail?.fasilitas_listrik || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Koneksi Internet:</span>
              <span className="font-semibold">{selectedAsset.spesifikasi_detail?.koneksi_internet || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Keamanan:</span>
              <span className="font-semibold">{selectedAsset.spesifikasi_detail?.keamanan || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Toilet:</span>
              <span className="font-semibold">{selectedAsset.spesifikasi_detail?.toilet || '-'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Furniture:</span>
              <span className="font-semibold">{selectedAsset.spesifikasi_detail?.furniture || '-'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Periode Sewa */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs p-4">
        <h5 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Calendar className="w-4 h-4 text-[#3c8dbc]" />
          Periode Rencana Sewa <span className="text-red-500">*</span>
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="room_start_date" className="block text-[11px] text-slate-500 mb-1">Tanggal Mulai</label>
            <input 
              id="room_start_date"
              type="date" 
              name="start_date" 
              value={formData.start_date} 
              onChange={handleChange} 
              required
              disabled={isExtension}
              className="w-full border border-slate-300 px-3 py-2 rounded-md text-[13px] outline-none focus:border-[#3c8dbc] bg-white disabled:bg-slate-100"
            />
          </div>
          <div>
            <label htmlFor="room_end_date" className="block text-[11px] text-slate-500 mb-1">Tanggal Selesai</label>
            <input 
              id="room_end_date"
              type="date" 
              name="end_date" 
              value={formData.end_date} 
              onChange={handleChange} 
              min={formData.start_date}
              required
              className="w-full border border-slate-300 px-3 py-2 rounded-md text-[13px] outline-none focus:border-[#3c8dbc] bg-white"
            />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 mb-1">Durasi Sewa</span>
            <div className="w-full border border-slate-200 bg-slate-50 px-3 py-2 rounded-md text-[12px] font-bold text-slate-700 flex items-center justify-center h-[38px]">
              {Math.ceil(totalMalam / 30)} Bulan ({totalMalam} Hari)
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Right Column (6 cols): Estimasi Biaya & Kebutuhan Khusus */}
    <div className="lg:col-span-6 space-y-6">
      {/* Estimasi Tarif & Biaya */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
          <span className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#3c8dbc]" />
            Informasi Tarif & Estimasi Biaya
          </span>
          <span className="text-[11px] text-slate-500">Ketentuan Tarif Resmi</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-slate-500">Tipe Tarif Objek:</span>
            <span className="font-semibold text-slate-700">{selectedAsset.master_tariffs?.objek || 'Tarif Sewa Ruangan'}</span>
          </div>
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-slate-500">Tarif per m² / Bulan:</span>
            <span className="font-semibold text-slate-800">
              Rp {selectedAsset.master_tariffs?.tarif ? Number(selectedAsset.master_tariffs.tarif).toLocaleString('id-ID') : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[12px]">
            <span className="text-slate-500">Luas Ruangan:</span>
            <span className="font-semibold text-slate-800">{selectedAsset.luas || 0} m²</span>
          </div>
          <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[12px]">
            <span className="text-slate-600 font-medium">Estimasi Biaya per Bulan:</span>
            <span className="font-bold text-[#3c8dbc]">
              Rp {selectedAsset.master_tariffs?.tarif 
                ? (Number(selectedAsset.master_tariffs.tarif) * Number(selectedAsset.luas || 0)).toLocaleString('id-ID') 
                : '-'}
            </span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[13px]">
            <div>
              <span className="font-bold text-slate-800 block">Total Estimasi Masa Sewa:</span>
              <span className="text-[11px] text-slate-400">Untuk {Math.ceil(totalMalam / 30)} Bulan ({totalMalam} Hari)</span>
            </div>
            <span className="font-bold text-lg text-[#3c8dbc]">
              Rp {calculateTotalLeaseEstimate(selectedAsset, totalMalam)}
            </span>
          </div>
          <div className="bg-slate-50 rounded p-2.5 text-[10px] text-slate-500 leading-relaxed flex items-start gap-1.5 border border-slate-100">
            <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span>
              Estimasi tarif di atas belum mencakup PPN dan biaya pemakaian utilitas (listrik/air tambahan bila ada). Penetapan resmi akan dimuat dalam dokumen Perjanjian Kerja Sama (PKS).
            </span>
          </div>
        </div>
      </div>

      {/* Kebutuhan Khusus / Catatan */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs p-4">
        <h5 className="text-[13px] font-bold text-slate-800 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#3c8dbc]" />
          Kebutuhan Khusus / Catatan Tambahan (Opsional)
        </h5>
        <p className="text-[11px] text-slate-500 mb-2">
          Tuliskan instruksi atau kebutuhan fasilitas penunjang tambahan untuk ruangan yang Anda sewa.
        </p>
        <textarea 
          name="kebutuhan_ruang_pendukung"
          value={specificNeeds.kebutuhan_ruang_pendukung}
          onChange={handleNeedsChange}
          disabled={isExtension}
          placeholder="Misal: Membutuhkan stop kontak tambahan, modifikasi partisi, instalasi jaringan komunikasi mandiri, atau akses operasional 24 jam..."
          className="w-full border border-slate-300 px-3 py-2 rounded-md text-[13px] outline-none focus:border-[#3c8dbc] transition-all bg-white min-h-[110px] resize-y disabled:bg-slate-100 disabled:text-slate-500"
        />
      </div>
    </div>
  </div>
);
