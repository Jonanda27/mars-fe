import React, { useState } from 'react';
import { Contract } from '@/types/contract';
import { Save, X, Loader2 } from 'lucide-react';
import { contractService } from '@/services/contractService';

interface EditContractModalProps {
  contract: Contract;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditContractModal({ contract, onClose, onSuccess }: EditContractModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    total_amount: contract.total_amount?.toString() || '0',
    deposit_jaminan: contract.deposit_jaminan?.toString() || '0',
    denda: contract.denda || '',
    fasilitas: contract.fasilitas ? JSON.stringify(contract.fasilitas) : ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let parsedFasilitas = null;
      if (formData.fasilitas) {
        try {
          parsedFasilitas = JSON.parse(formData.fasilitas);
        } catch (err) {
          // If not valid JSON, just store it as a simple object with a note string
          parsedFasilitas = { catatan: formData.fasilitas };
        }
      }

      const payload = {
        total_amount: formData.total_amount,
        deposit_jaminan: formData.deposit_jaminan,
        denda: formData.denda,
        fasilitas: parsedFasilitas
      };

      await contractService.updateContract(contract.id as number, payload);
      alert('Draft kontrak berhasil diubah!');
      onSuccess();
    } catch (error: any) {
      console.error(error);
      alert('Gagal menyimpan perubahan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Edit Draft Kontrak</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Total Retribusi (Rp) <span className="text-red-500">*</span></label>
              <input required type="number" name="total_amount" value={formData.total_amount} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded outline-none focus:border-blue-500" />
              <p className="text-xs text-gray-500 mt-1">Nilai yang dihitung sistem otomatis, bisa disesuaikan.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Deposit Jaminan (Rp)</label>
              <input type="number" name="deposit_jaminan" value={formData.deposit_jaminan} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded outline-none focus:border-blue-500" />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Ketentuan Denda</label>
            <input type="text" name="denda" value={formData.denda} onChange={handleChange} placeholder="Contoh: 2% per bulan dari total tagihan..." className="w-full border border-gray-300 px-3 py-2 rounded outline-none focus:border-blue-500" />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-1">Fasilitas Tambahan / Catatan Khusus</label>
            <textarea name="fasilitas" value={formData.fasilitas} onChange={handleChange} rows={3} placeholder="Format JSON atau teks bebas. Contoh: Listrik 10KVA" className="w-full border border-gray-300 px-3 py-2 rounded outline-none focus:border-blue-500"></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded">
              Batal
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded flex items-center">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
