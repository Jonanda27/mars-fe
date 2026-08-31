import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  onSave: (signatureUrl: string) => void;
  onCancel: () => void;
}

export default function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [error, setError] = useState('');

  const handleClear = () => {
    sigCanvas.current?.clear();
    setError('');
  };

  const handleSave = () => {
    if (sigCanvas.current?.isEmpty()) {
      setError('Silakan bubuhkan tanda tangan terlebih dahulu.');
      return;
    }
    
    // Get the base64 URL of the signature image (PNG by default)
    const url = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (url) {
      onSave(url);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Tanda Tangan Elektronik (TTE)</h3>
      <p className="text-sm text-slate-500 mb-4">Silakan gambar tanda tangan Anda di dalam kotak di bawah ini.</p>
      
      <div className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 mb-4 overflow-hidden relative">
        <SignatureCanvas 
          ref={sigCanvas}
          canvasProps={{
            className: 'w-full h-48 cursor-crosshair'
          }}
          backgroundColor="rgba(255,255,255,1)"
        />
        {error && (
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-medium shadow-sm">{error}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center gap-3">
        <button 
          onClick={handleClear}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex-1"
        >
          Hapus TTE
        </button>
        <button 
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex-1"
        >
          Batal
        </button>
        <button 
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex-1"
        >
          Simpan TTE
        </button>
      </div>
    </div>
  );
}
