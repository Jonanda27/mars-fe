import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
  onReasonChange: (val: string) => void;
  onSubmit: () => void;
}

export const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  isOpen,
  onClose,
  reason,
  onReasonChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#dd4b39] p-4 flex justify-between items-center text-white">
          <h3 className="font-bold flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Alasan Penolakan
          </h3>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <label htmlFor="reject-reason-textarea" className="block text-sm font-bold text-gray-700 mb-2">
            Tuliskan alasan spesifik (Wajib)
          </label>
          <textarea
            id="reject-reason-textarea"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm min-h-[120px] focus:outline-none focus:border-[#dd4b39] focus:ring-1 focus:ring-[#dd4b39]"
            placeholder="Contoh: Dokumen NIB buram, harap upload ulang dengan resolusi lebih tinggi."
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            autoFocus
          ></textarea>
          <p className="text-[11px] text-gray-500 mt-2">
            Pesan ini akan ditampilkan kepada Tenant di halaman profil mereka.
          </p>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-[#dd4b39] hover:bg-[#d73925] text-white text-sm font-bold rounded-lg transition-colors"
          >
            Kirim Penolakan
          </button>
        </div>
      </div>
    </div>
  );
};
