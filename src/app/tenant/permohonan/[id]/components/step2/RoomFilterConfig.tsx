import React from 'react';
import { 
  SlidersHorizontal, Building2, Warehouse, 
  DoorOpen, DoorClosed, Wind, Snowflake, Check 
} from 'lucide-react';
import { RoomFilterConfigProps } from './types';

export const RoomFilterConfig: React.FC<RoomFilterConfigProps> = ({
  isExtension,
  roomZone,
  setRoomZone,
  roomType,
  setRoomType,
  roomAC,
  setRoomAC,
  setFormData,
}) => (
  <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
    <div className="border-b border-slate-100 pb-3 mb-4">
      <h4 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-[#3c8dbc]" />
        Konfigurasi Kriteria Ruangan {isExtension && <span className="text-blue-600 font-normal text-xs ml-1">(Perpanjangan)</span>}
      </h4>
      <p className="text-[12px] text-slate-500 mt-0.5">
        Pilih Zona Lokasi, Tipe Ruangan, dan Fasilitas AC untuk menampilkan ruangan yang sesuai dengan kebutuhan operasional Anda.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Step 1: Zona Lokasi */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full bg-[#3c8dbc] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">1</span>
          <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">Zona Lokasi</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={isExtension}
            onClick={() => { setRoomZone('dalam'); setFormData(p => ({...p, asset_id: ''})); }}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between min-h-[96px] ${
              roomZone === 'dalam'
                ? 'border-[#3c8dbc] bg-blue-50/80 shadow-xs ring-2 ring-[#3c8dbc]/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            } ${isExtension ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-md ${roomZone === 'dalam' ? 'bg-[#3c8dbc] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Building2 className="w-4 h-4" />
              </div>
              {roomZone === 'dalam' && <Check className="w-4 h-4 text-[#3c8dbc]" />}
            </div>
            <div>
              <div className={`text-[12px] font-bold ${roomZone === 'dalam' ? 'text-[#3c8dbc]' : 'text-slate-800'}`}>Dalam Terminal</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Area terminal penumpang</div>
            </div>
          </button>

          <button
            type="button"
            disabled={isExtension}
            onClick={() => { setRoomZone('luar'); setFormData(p => ({...p, asset_id: ''})); }}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between min-h-[96px] ${
              roomZone === 'luar'
                ? 'border-[#3c8dbc] bg-blue-50/80 shadow-xs ring-2 ring-[#3c8dbc]/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            } ${isExtension ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-md ${roomZone === 'luar' ? 'bg-[#3c8dbc] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Warehouse className="w-4 h-4" />
              </div>
              {roomZone === 'luar' && <Check className="w-4 h-4 text-[#3c8dbc]" />}
            </div>
            <div>
              <div className={`text-[12px] font-bold ${roomZone === 'luar' ? 'text-[#3c8dbc]' : 'text-slate-800'}`}>Luar Terminal</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Area komersil & penunjang</div>
            </div>
          </button>
        </div>
      </div>

      {/* Step 2: Tipe Ruangan */}
      <div className={`bg-slate-50/70 border border-slate-200/80 rounded-lg p-4 transition-all ${!roomZone ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full bg-[#3c8dbc] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">2</span>
          <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">Tipe Ruangan</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={isExtension}
            onClick={() => { setRoomType('Terbuka'); setFormData(p => ({...p, asset_id: ''})); }}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between min-h-[96px] ${
              roomType === 'Terbuka'
                ? 'border-[#3c8dbc] bg-blue-50/80 shadow-xs ring-2 ring-[#3c8dbc]/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            } ${isExtension ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-md ${roomType === 'Terbuka' ? 'bg-[#3c8dbc] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <DoorOpen className="w-4 h-4" />
              </div>
              {roomType === 'Terbuka' && <Check className="w-4 h-4 text-[#3c8dbc]" />}
            </div>
            <div>
              <div className={`text-[12px] font-bold ${roomType === 'Terbuka' ? 'text-[#3c8dbc]' : 'text-slate-800'}`}>Terbuka</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Tanpa partisi/sekat penuh</div>
            </div>
          </button>

          <button
            type="button"
            disabled={isExtension}
            onClick={() => { setRoomType('Tertutup'); setFormData(p => ({...p, asset_id: ''})); }}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between min-h-[96px] ${
              roomType === 'Tertutup'
                ? 'border-[#3c8dbc] bg-blue-50/80 shadow-xs ring-2 ring-[#3c8dbc]/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            } ${isExtension ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-md ${roomType === 'Tertutup' ? 'bg-[#3c8dbc] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <DoorClosed className="w-4 h-4" />
              </div>
              {roomType === 'Tertutup' && <Check className="w-4 h-4 text-[#3c8dbc]" />}
            </div>
            <div>
              <div className={`text-[12px] font-bold ${roomType === 'Tertutup' ? 'text-[#3c8dbc]' : 'text-slate-800'}`}>Tertutup</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Berdinding privat & pintu</div>
            </div>
          </button>
        </div>
      </div>

      {/* Step 3: Fasilitas AC */}
      <div className={`bg-slate-50/70 border border-slate-200/80 rounded-lg p-4 transition-all ${(!roomZone || !roomType) ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full bg-[#3c8dbc] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">3</span>
          <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">Fasilitas AC</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={isExtension}
            onClick={() => { setRoomAC('tanpa'); setFormData(p => ({...p, asset_id: ''})); }}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between min-h-[96px] ${
              roomAC === 'tanpa'
                ? 'border-[#3c8dbc] bg-blue-50/80 shadow-xs ring-2 ring-[#3c8dbc]/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            } ${isExtension ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-md ${roomAC === 'tanpa' ? 'bg-[#3c8dbc] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Wind className="w-4 h-4" />
              </div>
              {roomAC === 'tanpa' && <Check className="w-4 h-4 text-[#3c8dbc]" />}
            </div>
            <div>
              <div className={`text-[12px] font-bold ${roomAC === 'tanpa' ? 'text-[#3c8dbc]' : 'text-slate-800'}`}>Tanpa AC</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Ventilasi alami / kipas</div>
            </div>
          </button>

          <button
            type="button"
            disabled={isExtension}
            onClick={() => { setRoomAC('dengan'); setFormData(p => ({...p, asset_id: ''})); }}
            className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between min-h-[96px] ${
              roomAC === 'dengan'
                ? 'border-[#3c8dbc] bg-blue-50/80 shadow-xs ring-2 ring-[#3c8dbc]/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            } ${isExtension ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-md ${roomAC === 'dengan' ? 'bg-[#3c8dbc] text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Snowflake className="w-4 h-4" />
              </div>
              {roomAC === 'dengan' && <Check className="w-4 h-4 text-[#3c8dbc]" />}
            </div>
            <div>
              <div className={`text-[12px] font-bold ${roomAC === 'dengan' ? 'text-[#3c8dbc]' : 'text-slate-800'}`}>Dengan AC</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">Pendingin ruangan sentral</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
);
