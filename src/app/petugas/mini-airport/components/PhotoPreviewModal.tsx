import React from 'react';

interface PhotoPreviewModalProps {
  readonly previewPhotoUrl: string | null;
  readonly onClose: () => void;
}

export const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({
  previewPhotoUrl,
  onClose,
}) => {
  if (!previewPhotoUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white p-2 max-w-2xl w-full shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 bg-slate-900/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-slate-900"
        >
          &times;
        </button>
        <img
          src={previewPhotoUrl}
          alt="Foto Bukti Apron"
          className="w-full h-auto max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
};
