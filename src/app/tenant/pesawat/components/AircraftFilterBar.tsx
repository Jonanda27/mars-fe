import React from 'react';
import { Plane, Search, LayoutGrid, List, Plus } from 'lucide-react';

interface AircraftFilterBarProps {
  filteredArmadaCount: number;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onAddNew: () => void;
}

export const AircraftFilterBar: React.FC<AircraftFilterBarProps> = ({
  filteredArmadaCount,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onAddNew,
}) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <span className="text-[14px] font-bold text-[#333] flex items-center">
          <Plane className="w-5 h-5 mr-2 text-[#3c8dbc]" /> Katalog Armada Terdaftar ({filteredArmadaCount})
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-[#d2d6de] bg-white px-3 py-1.5 text-[13px] focus:outline-none font-semibold text-[#555] w-full sm:w-auto"
        >
          <option value="all">Semua Status</option>
          <option value="aktif">Aktif Operasional</option>
          <option value="maintenance">Dalam Pemeliharaan</option>
          <option value="hangar">Disewa di Hangar</option>
        </select>

        <div className="flex w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Cari registrasi atau tipe..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-[#d2d6de] border-r-0 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#3c8dbc] min-w-[200px]" 
          />
          <button className="bg-[#f4f4f4] border border-[#d2d6de] px-3 py-1.5 hover:bg-[#e0e0e0] transition-colors">
            <Search className="w-4 h-4 text-[#777]" />
          </button>
        </div>

        <div className="flex border border-[#d2d6de] bg-slate-50 rounded-sm p-0.5">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 text-[12px] flex items-center font-bold transition-colors ${viewMode === 'grid' ? 'bg-[#3c8dbc] text-white shadow-sm' : 'text-[#777] hover:text-[#333]'}`}
          >
            <LayoutGrid className="w-4 h-4 mr-1" /> Grid
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 text-[12px] flex items-center font-bold transition-colors ${viewMode === 'list' ? 'bg-[#3c8dbc] text-white shadow-sm' : 'text-[#777] hover:text-[#333]'}`}
          >
            <List className="w-4 h-4 mr-1" /> Daftar
          </button>
        </div>

        <button 
          onClick={onAddNew}
          className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white text-[13px] font-bold px-4 py-1.5 transition-colors flex items-center justify-center shadow-sm whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-1" /> Daftarkan
        </button>
      </div>
    </div>
  );
};

export default AircraftFilterBar;
