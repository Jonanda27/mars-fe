import Link from 'next/link';
import { Receipt, ArrowRight, Printer } from 'lucide-react';

export default function TagihanPage() {
  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 border-b-4 border-slate-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase">Penerbitan SKRD</h1>
          <p className="text-slate-500 uppercase tracking-widest mt-2">Surat Ketetapan Retribusi Daerah (e-SKRD)</p>
        </div>
        <Receipt className="w-12 h-12 text-slate-300" />
      </header>

      <div className="max-w-3xl mx-auto bg-white border-2 border-slate-200 p-10 mb-8 shadow-sm">
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-wider">e-SKRD</h2>
            <p className="text-slate-500 font-bold mt-1">PEMERINTAH KABUPATEN MIMIKA</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-500 uppercase">Nomor SKRD</p>
            <p className="text-xl font-bold text-slate-900 font-mono">001/SKRD/2026</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ditagihkan Kepada:</p>
            <p className="font-bold text-slate-900 text-lg">PT Jaya Abadi</p>
            <p className="text-slate-600">ID Tenant: T-001</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Jatuh Tempo:</p>
            <p className="font-bold text-rose-600 text-lg">12 Agustus 2026</p>
          </div>
        </div>

        <div className="border-t border-b border-slate-200 py-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-700">Sewa Hanggar A (1 Tahun)</span>
            <span className="font-bold text-slate-900">Rp 1.200.000.000</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>Biaya Tambahan</span>
            <span>Rp 0</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-slate-900 uppercase">Total Tagihan</span>
          <span className="text-4xl font-bold text-slate-900">Rp 1.200.000.000</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto flex justify-end gap-4">
        <button className="px-6 py-3 border-2 border-slate-900 text-slate-900 font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center">
          <Printer className="w-4 h-4 mr-2" /> Cetak PDF
        </button>
        <Link 
          href="/pembayaran" 
          className="bg-slate-900 text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center"
        >
          Lanjut Pembayaran <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
