import React from 'react';
import { 
  ShieldCheck, Plus, Plane, MapPin, Camera, 
  ExternalLink, CheckCircle2, Trash2, CheckSquare, Square 
} from 'lucide-react';
import { OvernightItem } from '@/services/overnightReportService';

interface OvernightChecklistTableProps {
  readonly rosterItems: OvernightItem[];
  readonly totalStaying: number;
  readonly onOpenManualModal: () => void;
  readonly onToggleStaying: (index: number) => void;
  readonly onItemPhotoChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onItemNotesChange: (index: number, val: string) => void;
  readonly onRemoveManualItem: (index: number) => void;
}

export const OvernightChecklistTable: React.FC<OvernightChecklistTableProps> = ({
  rosterItems,
  totalStaying,
  onOpenManualModal,
  onToggleStaying,
  onItemPhotoChange,
  onItemNotesChange,
  onRemoveManualItem,
}) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#3c8dbc]" />
            Rekonsiliasi Fisik Armada Inap ({totalStaying} dari {rosterItems.length} Terpilih)
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Centang armada yang benar-benar bermalam di area bandara dan lampirkan foto fisik wajib per pesawat.
          </p>
        </div>

        {/* Tombol Tambah Pesawat */}
        <button
          type="button"
          onClick={onOpenManualModal}
          className="px-3 py-1.5 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors self-end sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Pesawat Manual
        </button>
      </div>

      {/* Table Checklist */}
      <div className="overflow-x-auto">
        {rosterItems.length === 0 ? (
          <div className="p-10 text-center text-slate-400 space-y-2">
            <Plane className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Tidak ada armada parkir aktif di hanggar/apron hari ini.</p>
            <p className="text-xs text-slate-400">Gunakan tombol <strong>"Tambah Pesawat Manual"</strong> di atas jika terdapat pesawat insidentil yang bermalam.</p>
          </div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f8fafc] text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-14 text-center">Inap?</th>
                <th className="px-4 py-3">Tail Number</th>
                <th className="px-4 py-3">Maskapai / Operator</th>
                <th className="px-4 py-3">Lokasi Penempatan</th>
                <th className="px-4 py-3 min-w-[200px]">Foto Bukti Fisik <span className="text-red-500">*</span></th>
                <th className="px-4 py-3 min-w-[200px]">Catatan Kondisi</th>
                <th className="px-4 py-3 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rosterItems.map((item, idx) => (
                <tr 
                  key={item.operational_log_id ? `log-${item.operational_log_id}` : `manual-${idx}`}
                  className={`transition-colors ${
                    item.is_staying 
                      ? 'bg-white hover:bg-blue-50/30' 
                      : 'bg-slate-50/70 text-slate-400 opacity-60'
                  }`}
                >
                  {/* Checkbox Inap */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleStaying(idx)}
                      title={item.is_staying ? 'Batalkan status inap' : 'Tandai sebagai menginap'}
                      className="cursor-pointer focus:outline-none"
                    >
                      {item.is_staying ? (
                        <CheckSquare className="w-5 h-5 text-[#3c8dbc]" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>
                  </td>

                  {/* Tail Number & Type */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-slate-900 text-[13px]">
                        {item.registration_number}
                      </span>
                      {item.is_adhoc ? (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.2 border border-amber-200">
                          Ad-Hoc
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-[#3c8dbc] text-[9px] font-bold px-1.5 py-0.2 border border-blue-100">
                          Log Aktif
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.aircraft_type || 'Pesawat'}
                    </div>
                  </td>

                  {/* Maskapai */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-800">
                      {item.tenant?.nama_perusahaan || item.tenant_name || 'Maskapai Insidentil'}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {item.asset?.nama_aset || item.asset_name || 'Fasilitas Hanggar'}
                    </div>
                  </td>

                  {/* Lokasi */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {item.parking_location || 'Hanggar'}
                    </span>
                  </td>

                  {/* Foto Bukti Fisik */}
                  <td className="px-4 py-3.5">
                    {item.is_staying ? (
                      <div className="flex items-center gap-2">
                        <label className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-2.5 py-1.5 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs flex-shrink-0">
                          <Camera className="w-3.5 h-3.5 text-[#3c8dbc]" />
                          <span>{item.photo_file || item.photo_preview ? 'Ganti' : 'Ambil Foto'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => onItemPhotoChange(idx, e)}
                            className="hidden"
                          />
                        </label>

                        {item.photo_preview ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={item.photo_preview}
                              target="_blank"
                              rel="noreferrer"
                              className="w-9 h-9 border border-[#3c8dbc] overflow-hidden relative group block shadow-2xs"
                              title="Klik untuk melihat foto"
                            >
                              <img
                                src={item.photo_preview}
                                alt="Bukti"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                                <ExternalLink className="w-3 h-3" />
                              </div>
                            </a>
                            <span className="text-[10px] text-[#3c8dbc] font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Terlampir
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-red-500 font-medium italic">
                            Foto Wajib
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Tidak menginap</span>
                    )}
                  </td>

                  {/* Catatan Kondisi */}
                  <td className="px-4 py-3.5">
                    {item.is_staying ? (
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) => onItemNotesChange(idx, e.target.value)}
                        placeholder="Kondisi fisik / posisi bay..."
                        className="w-full border border-slate-300 px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] bg-white"
                      />
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  {/* Aksi (Delete manual) */}
                  <td className="px-4 py-3.5 text-center">
                    {item.is_adhoc ? (
                      <button
                        type="button"
                        onClick={() => onRemoveManualItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Pesawat Manual"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
