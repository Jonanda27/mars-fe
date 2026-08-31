import Link from 'next/link';
import { CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PembayaranPage() {
  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 border-b-4 border-slate-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase">Gateway Pembayaran</h1>
          <p className="text-slate-500 uppercase tracking-widest mt-2">Simulasi Proses Bayar via Virtual Account</p>
        </div>
        <CreditCard className="w-12 h-12 text-slate-300" />
      </header>

      <div className="max-w-2xl mx-auto bg-white border-2 border-slate-200 mb-8 p-8 flex flex-col items-center">
        
        <h2 className="text-2xl font-bold text-slate-900 uppercase mb-2">Virtual Account Bank Papua</h2>
        <p className="text-slate-500 font-medium mb-8 uppercase tracking-wider text-sm">Menunggu Pembayaran</p>

        <div className="w-full bg-slate-50 border-2 border-slate-900 p-6 mb-8 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nomor Virtual Account</p>
          <p className="text-4xl font-mono font-bold text-slate-900 tracking-widest">8812 3456 7890</p>
        </div>

        <div className="w-full grid grid-cols-2 gap-4 mb-10 text-left">
          <div className="border-b border-slate-200 pb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tagihan</p>
            <p className="text-xl font-bold text-slate-900">Rp 1.200.000.000</p>
          </div>
          <div className="border-b border-slate-200 pb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Batas Waktu</p>
            <p className="text-xl font-bold text-rose-600">12 Ags 2026 23:59</p>
          </div>
        </div>

        <button className="w-full bg-emerald-600 text-white px-6 py-4 font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors flex justify-center items-center">
          <CheckCircle2 className="w-5 h-5 mr-2" /> Simulasi Bayar Sukses
        </button>
      </div>

      <div className="max-w-2xl mx-auto flex justify-end">
        <Link 
          href="/rekonsiliasi" 
          className="bg-slate-900 text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center"
        >
          Lanjut ke Rekonsiliasi <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
