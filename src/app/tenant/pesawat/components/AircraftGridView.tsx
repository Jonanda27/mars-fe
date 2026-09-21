import React from 'react';
import { Aircraft } from '@/types/aircraft';
import StatusBadge from '@/components/StatusBadge';
import { MapPin, Edit, Trash2 } from 'lucide-react';

interface AircraftGridViewProps {
  filteredArmada: Aircraft[];
  handleEdit: (item: Aircraft) => void;
  handleDelete: (id: number) => void;
}

export const AircraftGridView: React.FC<AircraftGridViewProps> = ({
  filteredArmada,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in">
      {filteredArmada.map((item) => (
        <div key={item.id} className="bg-white shadow-sm border border-[#d2d6de] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
          <div className="relative h-[200px] bg-slate-800 overflow-hidden">
            <img 
              src={item.foto || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"} 
              alt={item.aircraft_types?.jenis_pesawat || 'Aircraft'} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white px-3 py-1 font-mono font-bold text-[16px] tracking-wider border border-white/20 shadow-md">
              {item.registration_number}
            </div>
            <div className="absolute top-3 right-3">
              {item.asset_id ? (
                <span className="bg-[#3c8dbc] text-white font-bold text-[11px] px-3 py-1 shadow-sm flex items-center border border-white/20">
                  <MapPin className="w-3 h-3 mr-1" /> Ditempatkan di {item.assets?.nama_aset || 'Hangar'}
                </span>
              ) : (
                <StatusBadge status={item.status === 'aktif' ? 'Aktif' : 'Maintenance'} />
              )}
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
              <h3 className="text-[16px] font-bold leading-tight">{item.aircraft_types?.jenis_pesawat || 'Unknown Type'}</h3>
            </div>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-3 bg-white text-[13px]">
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-[#f4f4f4]">
              <div>
                <span className="text-[11px] text-[#777] uppercase font-bold block">Berat (MTOW)</span>
                <span className="font-mono font-bold text-[#333] text-[14px]">{item.mtow?.toLocaleString('id-ID')} Kg</span>
              </div>
              <div>
                <span className="text-[11px] text-[#777] uppercase font-bold block">Kapasitas</span>
                <span className="font-bold text-[#333] text-[14px]">{item.capacity || '-'} Penumpang</span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-slate-50 border-t border-[#f4f4f4] flex justify-end items-center gap-2">
            <button 
              onClick={() => handleEdit(item)} 
              disabled={!!item.asset_id}
              className={`border px-3 py-1.5 shadow-sm flex items-center text-[12px] font-bold transition-colors ${item.asset_id ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-[#d2d6de] text-[#3c8dbc] hover:bg-[#3c8dbc] hover:text-white'}`} 
            >
              <Edit className="w-4 h-4 mr-1.5" /> Edit
            </button>
            <button 
              onClick={() => handleDelete(item.id!)} 
              disabled={!!item.asset_id}
              className={`border px-3 py-1.5 shadow-sm flex items-center text-[12px] font-bold transition-colors ${item.asset_id ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-[#d2d6de] text-[#dd4b39] hover:bg-[#dd4b39] hover:text-white'}`} 
            >
              <Trash2 className="w-4 h-4 mr-1.5" /> Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AircraftGridView;
