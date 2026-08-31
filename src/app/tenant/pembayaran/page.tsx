import { CreditCard, Search, Download, CheckCircle2, Calendar, FileText } from 'lucide-react';

export default function RiwayatPembayaranPage() {
  return (
    <div className="p-4 bg-[#ecf0f5] min-h-full flex flex-col gap-4">
      <header className="flex justify-between items-end">
        <h1 className="text-[20px] font-normal text-[#333] uppercase">
          Riwayat Pembayaran
        </h1>
        <div className="text-[12px] text-[#777] flex items-center bg-[#ecf0f5] p-2 hidden sm:flex">
          <span className="mr-1">Tenant Portal</span> / <span className="ml-1 font-medium">Pembayaran</span>
        </div>
      </header>

      {/* Tabel Data Pembayaran */}
      <div className="bg-white border-t-[3px] border-[#00a65a] shadow-sm flex-1 flex flex-col">
        <div className="p-[15px] border-b border-[#f4f4f4] flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
          <h3 className="text-[16px] text-[#444] font-bold flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-[#00a65a]" /> Daftar Transaksi Lunas
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Filter Tanggal */}
            <div className="flex items-center border border-[#d2d6de] bg-white px-2">
              <Calendar className="w-4 h-4 text-[#777] mr-2" />
              <input type="month" className="py-1.5 text-[13px] focus:outline-none text-[#555] bg-transparent" defaultValue="2026-08" />
            </div>
            
            {/* Search Box */}
            <div className="flex">
              <input type="text" placeholder="Cari No. Referensi atau SKRD..." className="border border-[#d2d6de] border-r-0 px-3 py-1.5 text-[13px] focus:outline-none focus:border-[#00a65a] min-w-[250px]" />
              <button className="bg-[#f4f4f4] border border-[#d2d6de] px-3 py-1.5 hover:bg-[#e0e0e0] transition-colors">
                <Search className="w-4 h-4 text-[#777]" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-0 overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] uppercase text-[12px]">
                <th className="py-4 px-6 font-bold">Tanggal Bayar</th>
                <th className="py-4 px-6 font-bold">No. Referensi / No. SKRD</th>
                <th className="py-4 px-6 font-bold">Metode Pembayaran</th>
                <th className="py-4 px-6 font-bold text-right">Nominal (Rp)</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
                <th className="py-4 px-6 font-bold text-center">Kwitansi</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-bold text-[#333]">05 Ags 2026</div>
                  <div className="text-[11px] text-[#777]">14:30:21 WIT</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-bold text-[#3c8dbc]">INV-2608-0091</div>
                  <div className="text-[11px] text-[#777]">Ref SKRD: SKRD-26-0702</div>
                </td>
                <td className="py-4 px-6 text-[#555]">
                  <span className="font-bold text-[#333]">Transfer Bank (VA)</span>
                  <br /><span className="text-[11px]">Bank Papua - 988xxxxxx</span>
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold text-[#333]">
                  50.000.000
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-flex items-center bg-[#00a65a]/10 text-[#00a65a] border border-[#00a65a]/20 font-bold text-[11px] px-2 py-1 uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Sukses
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="bg-white border border-[#d2d6de] text-[#444] hover:bg-[#f4f4f4] px-3 py-1.5 text-[12px] flex items-center justify-center mx-auto shadow-sm transition-colors font-bold">
                    <FileText className="w-4 h-4 mr-2 text-[#dd4b39]" /> PDF
                  </button>
                </td>
              </tr>
              
              {/* Row 2 */}
              <tr className="border-b border-[#f4f4f4] hover:bg-slate-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-bold text-[#333]">10 Jul 2026</div>
                  <div className="text-[11px] text-[#777]">09:15:00 WIT</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-bold text-[#3c8dbc]">INV-2607-0105</div>
                  <div className="text-[11px] text-[#777]">Ref SKRD: SKRD-26-0601</div>
                </td>
                <td className="py-4 px-6 text-[#555]">
                  <span className="font-bold text-[#333]">QRIS Nasional</span>
                  <br /><span className="text-[11px]">NMID: ID1023xxxxxx</span>
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold text-[#333]">
                  250.000.000
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-flex items-center bg-[#00a65a]/10 text-[#00a65a] border border-[#00a65a]/20 font-bold text-[11px] px-2 py-1 uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Sukses
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button className="bg-white border border-[#d2d6de] text-[#444] hover:bg-[#f4f4f4] px-3 py-1.5 text-[12px] flex items-center justify-center mx-auto shadow-sm transition-colors font-bold">
                    <FileText className="w-4 h-4 mr-2 text-[#dd4b39]" /> PDF
                  </button>
                </td>
              </tr>
              
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-[#f4f4f4] border-t border-[#d2d6de] flex justify-between items-center text-[13px] text-[#777]">
          <span>Menampilkan 1 hingga 2 dari 2 Transaksi di Bulan Ini</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-[#d2d6de] bg-white text-[#ccc] cursor-not-allowed">Prev</button>
            <button className="px-3 py-1 border border-[#00a65a] bg-[#00a65a] text-white font-bold">1</button>
            <button className="px-3 py-1 border border-[#d2d6de] bg-white text-[#ccc] cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>

    </div>
  );
}
