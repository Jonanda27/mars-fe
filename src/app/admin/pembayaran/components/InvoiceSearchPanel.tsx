import React from 'react';
import { Search, FileText, Loader2, ArrowRight } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';

interface InvoiceSearchPanelProps {
  readonly searchQuery: string;
  readonly setSearchQuery: (query: string) => void;
  readonly onSearch: (e: React.SyntheticEvent) => void;
  readonly selectedInvoice: Invoice | null;
  readonly onSelectInvoice: (inv: Invoice) => void;
  readonly unpaidInvoices: Invoice[];
  readonly isLoading: boolean;
}

export const InvoiceSearchPanel: React.FC<InvoiceSearchPanelProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  selectedInvoice,
  onSelectInvoice,
  unpaidInvoices,
  isLoading,
}) => {
  return (
    <div className="flex-1 lg:w-[60%] flex flex-col gap-4">
      {/* Panel Pencarian */}
      <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
        <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
          <h3 className="text-[16px] text-[#444] font-normal">Scan / Cari Nomor Tagihan SKRD</h3>
        </div>
        <div className="p-4">
          <form onSubmit={onSearch} className="flex gap-2">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Masukkan No. SKRD atau Nama Tenant..." 
              className="flex-1 p-3 border border-[#d2d6de] focus:border-[#3c8dbc] focus:outline-none text-[15px] font-mono uppercase font-bold" 
            />
            <button 
              type="submit" 
              className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-6 py-3 font-bold transition-colors shadow-sm flex items-center cursor-pointer"
            >
              <Search className="w-5 h-5 mr-2" /> Cari Data
            </button>
          </form>
        </div>
      </div>

      {/* Rincian Tagihan Ditemukan */}
      {selectedInvoice ? (
        <div className="bg-white border-t-[3px] border-[#f39c12] shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
            <h3 className="text-[16px] text-[#444] font-bold flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#f39c12]" /> Rincian Objek Retribusi
            </h3>
            <StatusBadge status={selectedInvoice.status} />
          </div>
          
          <div className="p-6 text-[14px]">
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6 border-b border-[#f4f4f4] pb-6">
              <div>
                <p className="text-[#777] text-[12px] font-bold uppercase mb-1">Pihak Tertagih / Wajib Retribusi</p>
                <p className="font-bold text-[#333] text-[16px]">
                  {selectedInvoice.tenants?.nama_perusahaan || 'Tenant / Mitra'}
                </p>
                <p className="text-[#555] text-[12px]">
                  NPWP: {selectedInvoice.tenants?.npwp || '-'} &bull; Kontak: {selectedInvoice.tenants?.telepon || '-'}
                </p>
              </div>
              <div>
                <p className="text-[#777] text-[12px] font-bold uppercase mb-1">Nomor Ketetapan (e-SKRD)</p>
                <p className="font-bold text-[#3c8dbc] text-[16px] font-mono">
                  {selectedInvoice.invoice_number}
                </p>
                <p className="text-[#555] text-[12px]">
                  Tgl Jatuh Tempo: {selectedInvoice.due_date ? dayjs(selectedInvoice.due_date).format('DD MMM YYYY') : '-'}
                </p>
              </div>
            </div>

            {/* Tabel Item Tagihan */}
            <table className="w-full text-left border-collapse mb-6">
              <thead>
                <tr className="border-b-2 border-[#d2d6de] text-[#444]">
                  <th className="py-2 px-2 font-bold">Keterangan Retribusi</th>
                  <th className="py-2 px-2 font-bold text-center">Jenis Tagihan</th>
                  <th className="py-2 px-2 font-bold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#f4f4f4]">
                  <td className="py-3 px-2 text-[#555]">
                    <div className="font-bold">
                      {selectedInvoice.contracts?.assets?.nama_aset || selectedInvoice.invoice_type || 'Retribusi Pemakaian Fasilitas UPBU'}
                    </div>
                    <div className="text-[11px] text-[#777]">
                      Kode Rekening: {selectedInvoice.invoice_type?.toLowerCase().includes('ruangan') ? '4.1.2.02.01 (Sewa Ruangan)' : '4.1.2.02.02 (Sewa Hanggar & Apron)'}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-[#555]">
                    <span className="bg-slate-100 px-2 py-0.5 text-xs font-semibold">
                      {selectedInvoice.invoice_type || 'SKRD Pokok'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-[#333]">
                    {formatRupiah(Number(selectedInvoice.amount))}
                  </td>
                </tr>

                {Number(selectedInvoice.penalty_amount || 0) > 0 && (
                  <tr className="border-b border-[#f4f4f4] bg-red-50/50">
                    <td className="py-3 px-2 text-red-700">
                      <div className="font-bold">Denda Keterlambatan (Sanksi 1%/Bulan)</div>
                      <div className="text-[11px] text-red-500">Kode Rekening: 4.1.4.01.01</div>
                    </td>
                    <td className="py-3 px-2 text-center text-red-700">
                      <StatusBadge status="danger" label="Sanksi Denda" />
                    </td>
                    <td className="py-3 px-2 text-right font-mono font-bold text-red-700">
                      {formatRupiah(Number(selectedInvoice.penalty_amount))}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Quick Select Tagihan Belum Lunas */
        <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
          <div className="p-3.5 border-b border-[#f4f4f4] bg-slate-50 flex justify-between items-center">
            <h3 className="text-[14px] text-[#333] font-bold flex items-center">
              <FileText className="w-4 h-4 mr-2 text-[#3c8dbc]" />
              Daftar Tagihan Belum Lunas Siap Bayar
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {unpaidInvoices.length} e-SKRD
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-4">No. e-SKRD</th>
                  <th className="py-2.5 px-4">Tenant</th>
                  <th className="py-2.5 px-4">Objek / Jenis</th>
                  <th className="py-2.5 px-4 text-right">Nilai Tagihan</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-center w-24">Pilih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3c8dbc]" />
                      <span>Memuat data tagihan dari server...</span>
                    </td>
                  </tr>
                ) : unpaidInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      <p className="font-bold text-xs text-slate-600">Tidak ada tagihan tertunda</p>
                      <p className="text-[11px]">Semua e-SKRD telah lunas atau belum ada tagihan terbit.</p>
                    </td>
                  </tr>
                ) : (
                  unpaidInvoices.slice(0, 8).map((inv) => (
                    <tr key={inv.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#3c8dbc]">
                        {inv.invoice_number}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {inv.tenants?.nama_perusahaan || 'Tenant'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {inv.invoice_type || inv.contracts?.assets?.nama_aset || 'Sewa Fasilitas'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {formatRupiah(Number(inv.amount) + Number(inv.penalty_amount || 0))}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => onSelectInvoice(inv)}
                          className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-bold text-[11px] px-2.5 py-1 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          Pilih <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
