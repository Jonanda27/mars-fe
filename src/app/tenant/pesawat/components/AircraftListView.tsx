import React from 'react';
import { Aircraft } from '@/types/aircraft';
import StatusBadge from '@/components/StatusBadge';
import { MapPin, Edit, Trash2 } from 'lucide-react';

interface AircraftListViewProps {
  filteredArmada: Aircraft[];
  handleEdit: (item: Aircraft) => void;
  handleDelete: (id: number) => void;
}

export const AircraftListView: React.FC<AircraftListViewProps> = ({
  filteredArmada,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="bg-white border border-[#d2d6de] shadow-sm animate-in fade-in">
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse text-[14px]">
          <thead>
            <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-slate-50 uppercase text-[12px]">
              <th className="py-4 px-5 font-bold w-[12%]">Foto</th>
              <th className="py-4 px-5 font-bold w-[15%]">Registrasi</th>
              <th className="py-4 px-5 font-bold w-[25%]">Tipe Pesawat</th>
              <th className="py-4 px-5 font-bold w-[15%]">MTOW (Kg)</th>
              <th className="py-4 px-5 font-bold text-center w-[13%]">Status</th>
              <th className="py-4 px-5 font-bold text-center w-[10%]">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredArmada.map((item) => (
              <tr key={item.id} className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                <td className="py-3 px-5">
                  <img 
                    src={item.foto || "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80"} 
                    alt={item.registration_number} 
                    className="w-16 h-10 object-cover rounded border border-[#d2d6de]"
                  />
                </td>
                <td className="py-3 px-5">
                  <span className="font-mono font-bold text-[#3c8dbc] text-[15px]">{item.registration_number}</span>
                </td>
                <td className="py-3 px-5">
                  <div className="font-bold text-[#333]">{item.aircraft_types?.jenis_pesawat || 'Unknown'}</div>
                  <div className="text-[12px] text-[#777]">MTOW: {item.mtow || '-'} Kg</div>
                </td>
                <td className="py-3 px-5 font-mono font-bold text-[#333]">
                  {item.mtow?.toLocaleString('id-ID')} Kg
                </td>
                <td className="py-3 px-5 text-center">
                  {item.asset_id ? (
                    <span className="bg-[#3c8dbc]/10 text-[#3c8dbc] border border-[#3c8dbc]/20 font-bold text-[11px] px-2.5 py-1 rounded-sm flex items-center justify-center whitespace-nowrap">
                      <MapPin className="w-3 h-3 mr-1" /> Ditempatkan di {item.assets?.nama_aset || 'Hangar'}
                    </span>
                  ) : (
                    <StatusBadge status={item.status === 'aktif' ? 'Aktif' : 'Maintenance'} />
                  )}
                </td>
                <td className="py-3 px-5 text-center">
                  <div className="flex justify-center gap-1">
                    <button 
                      onClick={() => handleEdit(item)} 
                      disabled={!!item.asset_id}
                      className={`border p-1.5 shadow-sm transition-colors ${item.asset_id ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-[#d2d6de] text-[#3c8dbc] hover:bg-[#3c8dbc] hover:text-white'}`} 
                      title={item.asset_id ? "Terkunci (Sedang disewa di Hangar)" : "Edit Data"}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id!)} 
                      disabled={!!item.asset_id}
                      className={`border p-1.5 shadow-sm transition-colors ${item.asset_id ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white border-[#d2d6de] text-[#dd4b39] hover:bg-[#dd4b39] hover:text-white'}`} 
                      title={item.asset_id ? "Terkunci (Sedang disewa di Hangar)" : "Hapus"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AircraftListView;
