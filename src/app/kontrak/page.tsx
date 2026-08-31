import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';

export default function KontrakPage() {
  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 border-b-4 border-slate-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase">Pembuatan Kontrak</h1>
          <p className="text-slate-500 uppercase tracking-widest mt-2">Draft Perjanjian Sewa</p>
        </div>
        <FileText className="w-12 h-12 text-slate-300" />
      </header>

      <div className="bg-white border-2 border-slate-200 p-8 mb-8">
        <h2 className="text-xl font-bold text-slate-900 uppercase mb-6 border-b border-slate-100 pb-4">Detail Perjanjian</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Penyewa Terpilih</label>
            <div className="p-3 bg-slate-50 border border-slate-200 font-bold">PT Jaya Abadi (T-001)</div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Aset Terpilih</label>
            <div className="p-3 bg-slate-50 border border-slate-200 font-bold">Hanggar A (HGR-001)</div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Periode Sewa (Tahun)</label>
            <input type="number" defaultValue={1} className="w-full p-3 border border-slate-300 focus:outline-none focus:border-slate-900" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor Kontrak</label>
            <input type="text" defaultValue="001/HGR/2026" className="w-full p-3 border border-slate-300 bg-slate-100" readOnly />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end gap-4">
          <button className="px-6 py-3 border-2 border-slate-900 text-slate-900 font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors">
            Simpan Draft
          </button>
          <Link href="/pemakaian" className="px-6 py-3 bg-slate-900 text-white font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center">
            Setujui & Lanjut <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
