import Link from 'next/link';
import { Activity, ArrowRight, Plus } from 'lucide-react';

export default function PemakaianPage() {
  const fasilitas = [
    { nama: 'Sewa Pokok (Hanggar A)', jenis: 'Fixed', biaya: 'Sesuai Tarif Master' },
    { nama: 'Akses Apron', jenis: 'Tetap', biaya: 'Rp 10.000.000 / bln' },
    { nama: 'Pemakaian Listrik', jenis: 'Usage Based', biaya: 'Per kWh' },
  ];

  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 border-b-4 border-slate-900 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 uppercase">Data Pemakaian</h1>
          <p className="text-slate-500 uppercase tracking-widest mt-2">Komponen Utilitas & Fasilitas Tambahan</p>
        </div>
        <Activity className="w-12 h-12 text-slate-300" />
      </header>

      <div className="bg-white border-2 border-slate-200 mb-8 p-8">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 uppercase">Daftar Komponen Biaya</h2>
          <button className="flex items-center text-sm font-bold text-slate-600 border border-slate-300 px-4 py-2 hover:bg-slate-50 uppercase">
            <Plus className="w-4 h-4 mr-2" /> Tambah Fasilitas
          </button>
        </div>

        <table className="w-full text-left border-collapse mb-8">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Nama Komponen</th>
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Jenis Biaya</th>
              <th className="p-4 font-bold text-slate-900 uppercase tracking-wider text-sm">Keterangan Biaya</th>
            </tr>
          </thead>
          <tbody>
            {fasilitas.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-200">
                <td className="p-4 font-bold text-slate-900">{item.nama}</td>
                <td className="p-4">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800">
                    {item.jenis}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{item.biaya}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <Link 
            href="/hitung-tarif" 
            className="bg-slate-900 text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center"
          >
            Lanjut Hitung Tarif <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
