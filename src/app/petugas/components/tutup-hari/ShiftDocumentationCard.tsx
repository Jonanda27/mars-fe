import React from 'react';
import { FileText, Upload } from 'lucide-react';

interface ShiftDocumentationCardProps {
  readonly generalNotes: string;
  readonly setGeneralNotes: (val: string) => void;
  readonly generalPhoto: File | null;
  readonly generalPhotoPreview: string | null;
  readonly onGeneralPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ShiftDocumentationCard: React.FC<ShiftDocumentationCardProps> = ({
  generalNotes,
  setGeneralNotes,
  generalPhoto,
  generalPhotoPreview,
  onGeneralPhotoChange,
}) => {
  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-xs p-4 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 border-b pb-2 border-slate-100">
        <FileText className="w-4 h-4 text-[#3c8dbc]" />
        Dokumentasi Shift &amp; Kondisi Hanggar Umum
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Catatan Shift Petugas Lapangan
          </label>
          <textarea
            rows={3}
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Catatan mengenai kondisi keamanan, penerangan hanggar, cuaca, atau informasi penting lainnya..."
            className="w-full border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#3c8dbc] focus:ring-1 focus:ring-[#3c8dbc] bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Foto Dokumentasi Keseluruhan Hanggar / Apron (Opsional)
          </label>
          <div className="flex items-center gap-3">
            <label className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-2xs">
              <Upload className="w-4 h-4 text-slate-500" />
              <span>{generalPhoto ? 'Ganti Foto Hanggar' : 'Upload Foto Hanggar'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={onGeneralPhotoChange}
                className="hidden"
              />
            </label>

            {generalPhotoPreview && (
              <div className="w-16 h-12 border border-slate-200 overflow-hidden relative shadow-2xs">
                <img src={generalPhotoPreview} alt="Foto Hanggar" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Foto panorama kondisi hanggar atau apron saat jam tutup hari (20:00 - 23:59 WIT).
          </p>
        </div>
      </div>
    </div>
  );
};
