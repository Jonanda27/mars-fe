import React from 'react';
import { Building2, X, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export interface EditProfileFormData {
  nib: string;
  npwp: string;
  pic: string;
  nomor_telepon: string;
  email: string;
  alamat: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  editForm: EditProfileFormData;
  onFormChange: (form: EditProfileFormData) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  isSaving: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  editForm,
  onFormChange,
  onSubmit,
  isSaving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-[#3c8dbc] to-blue-700 p-5 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center tracking-wide">
            <Building2 className="w-5 h-5 mr-3 text-blue-100" />
            Lengkapi / Ubah Data Perusahaan
          </h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto bg-slate-50">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-[13px] text-blue-800">
                Pastikan <strong>NIB</strong> dan <strong>NPWP</strong> diisi dengan benar sesuai
                dokumen. Mengubah data ini akan mengharuskan Admin melakukan pengecekan ulang (status
                kembali menjadi Pending).
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-profile-nib" className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Induk Berusaha (NIB) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-profile-nib"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3c8dbc] text-sm"
                    value={editForm.nib}
                    onChange={(e) => onFormChange({ ...editForm, nib: e.target.value })}
                    placeholder="Masukkan nomor NIB"
                  />
                </div>
                <div>
                  <label htmlFor="edit-profile-npwp" className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Pokok Wajib Pajak (NPWP) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-profile-npwp"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3c8dbc] text-sm"
                    value={editForm.npwp}
                    onChange={(e) => onFormChange({ ...editForm, npwp: e.target.value })}
                    placeholder="Masukkan NPWP"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-profile-pic" className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Penanggung Jawab (PIC)
                  </label>
                  <input
                    id="edit-profile-pic"
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3c8dbc] text-sm"
                    value={editForm.pic}
                    onChange={(e) => onFormChange({ ...editForm, pic: e.target.value })}
                    placeholder="Nama PIC"
                  />
                </div>
                <div>
                  <label htmlFor="edit-profile-telp" className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    id="edit-profile-telp"
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3c8dbc] text-sm"
                    value={editForm.nomor_telepon}
                    onChange={(e) => onFormChange({ ...editForm, nomor_telepon: e.target.value })}
                    placeholder="Nomor Telepon"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-profile-email" className="block text-xs font-bold text-slate-700 mb-1">Email Utama</label>
                <input
                  id="edit-profile-email"
                  type="email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3c8dbc] text-sm"
                  value={editForm.email}
                  onChange={(e) => onFormChange({ ...editForm, email: e.target.value })}
                  placeholder="Email Perusahaan"
                />
              </div>

              <div>
                <label htmlFor="edit-profile-alamat" className="block text-xs font-bold text-slate-700 mb-1">
                  Alamat Perusahaan Lengkap
                </label>
                <textarea
                  id="edit-profile-alamat"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3c8dbc] text-sm"
                  value={editForm.alamat}
                  onChange={(e) => onFormChange({ ...editForm, alamat: e.target.value })}
                  placeholder="Alamat kantor pusat..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-[#3c8dbc] hover:bg-[#367fa9] text-white rounded-lg text-sm font-bold transition-colors flex items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Simpan Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
