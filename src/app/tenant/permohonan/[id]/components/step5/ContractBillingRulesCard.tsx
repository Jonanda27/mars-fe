import React from 'react';
import { 
  ArrowRight, Eye 
} from 'lucide-react';
import RupiahIcon from '@/components/icons/RupiahIcon';
import { RentalApplication } from '@/types/rental';
import { formatRupiah } from '@/utils/formatCurrency';
import Link from 'next/link';
import dayjs from 'dayjs';

interface ContractBillingRulesCardProps {
  readonly app: RentalApplication;
  readonly isHangar: boolean;
  readonly approvedAircrafts: any[];
  readonly hangarRentalCalc: any;
  readonly skrdInvoice: any;
  readonly onOpenSkrdModal: () => void;
}

export const ContractBillingRulesCard: React.FC<ContractBillingRulesCardProps> = ({
  app,
  isHangar,
  approvedAircrafts,
  hangarRentalCalc,
  skrdInvoice,
  onOpenSkrdModal,
}) => {
  return (
    <div className="bg-white rounded-none shadow-xs border border-slate-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-[#f8fafc] flex items-center justify-between">
        <span className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
          <RupiahIcon className="w-4 h-4 text-[#3c8dbc]" />
          Ketentuan Tarif &amp; Penagihan
        </span>
        <span className="text-[11px] font-bold text-[#3c8dbc]">
          {isHangar ? 'Tarif Master BLU' : 'Pembayaran PKS'}
        </span>
      </div>

      <div className="p-5 space-y-4">
        {isHangar ? (
          <>
            {/* Rincian Kalkulasi Tarif Hanggar */}
            <div className="border border-slate-200 rounded-none overflow-hidden">
              <div className="bg-slate-50 px-3.5 py-2 border-b border-slate-200 flex justify-between items-center text-[11px] font-bold text-slate-700">
                <span>Rincian Armada ({approvedAircrafts.length} Unit)</span>
                <span>Tarif / Malam</span>
              </div>
              <div className="divide-y divide-slate-100 bg-white">
                {hangarRentalCalc.breakdown.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400 italic">
                    Belum ada data armada yang tercatat
                  </div>
                ) : (
                  hangarRentalCalc.breakdown.map((item: any, idx: number) => {
                    const typeName = item.aircraft.custom_type_name || item.aircraft.aircraft_types?.jenis_pesawat || item.aircraft.aircraft_type || 'Pesawat';
                    return (
                      <div key={item.aircraft.id || idx} className="px-3.5 py-2.5 flex justify-between items-center text-[12px]">
                        <div>
                          <span className="font-bold text-slate-800">{item.aircraft.registration_number}</span>
                          <span className="text-[11px] text-slate-500 ml-1.5">({typeName})</span>
                        </div>
                        <span className="font-bold text-slate-700">{formatRupiah(item.tarifPerMalam)}</span>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="bg-[#f8fafc] p-3.5 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-[12px] text-slate-600">
                  <span>Total Tarif per Malam ({approvedAircrafts.length} Armada):</span>
                  <strong className="text-slate-800">{formatRupiah(hangarRentalCalc.totalPerMalam)} / malam</strong>
                </div>
                <div className="flex justify-between text-[12px] text-slate-600">
                  <span>Durasi Waktu Sewa:</span>
                  <strong className="text-slate-800">{hangarRentalCalc.durasiMalam} Malam</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-[13px] font-bold text-slate-800">Estimasi Total Biaya Sewa:</span>
                  <span className="text-[17px] font-bold text-[#3c8dbc]">
                    {formatRupiah(hangarRentalCalc.totalEstimasi)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Invoice tagihan resmi akan diterbitkan oleh <strong>Bagian Keuangan / Bendahara UPBU</strong> setelah masa sewa berjalan atau melalui pencatatan rekap operasional penempatan armada secara berkala.
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Cek status penagihan:</span>
              <Link 
                href="/tenant/tagihan" 
                className="bg-white hover:bg-slate-50 text-[#3c8dbc] border border-[#3c8dbc] px-3.5 py-1.5 rounded-none text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
              >
                Buka Menu Tagihan <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="border border-slate-200 rounded-none overflow-hidden">
              <div className="bg-slate-50 px-3.5 py-2.5 border-b border-slate-200 flex justify-between items-center text-[12px] font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <RupiahIcon className="w-4 h-4 text-[#3c8dbc]" />
                  Penetapan e-SKRD di Awal
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                  skrdInvoice?.status === 'Paid' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {skrdInvoice?.status === 'Paid' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}
                </span>
              </div>

              <div className="p-4 bg-white space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Nomor SKRD</span>
                    <span className="font-mono font-bold text-slate-800 text-[13px]">
                      {skrdInvoice?.invoice_number || 'SKRD-AWAL-RUANGAN'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Masa Retribusi</span>
                    <span className="font-semibold text-slate-700">
                      {app.start_date ? dayjs(app.start_date).format('DD/MM/YYYY') : '-'} s.d. {app.end_date ? dayjs(app.end_date).format('DD/MM/YYYY') : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Jatuh Tempo</span>
                    <span className="font-semibold text-slate-700">
                      {skrdInvoice?.due_date ? dayjs(skrdInvoice.due_date).format('DD MMMM YYYY') : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Kode Bayar</span>
                    <span className="font-mono font-bold text-[#3c8dbc]">
                      {skrdInvoice?.id ? skrdInvoice.id.toString().padStart(6, '0') : '-'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center bg-[#f8fafc] -mx-4 -mb-4 p-3.5 px-4 border-b-0">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Ketetapan Pokok</span>
                    <span className="text-[18px] font-black text-[#3c8dbc]">
                      {formatRupiah(Number(skrdInvoice?.amount || app.contracts?.total_amount || 0))}
                    </span>
                  </div>
                  {skrdInvoice && (
                    <button
                      type="button"
                      onClick={onOpenSkrdModal}
                      className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Lihat e-SKRD
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sesuai ketentuan retribusi daerah, penetapan SKRD untuk sewa ruangan diterbitkan <strong>sekaligus di awal</strong> untuk keseluruhan masa sewa ({app.start_date ? dayjs(app.start_date).format('DD/MM/YYYY') : '-'} s.d. {app.end_date ? dayjs(app.end_date).format('DD/MM/YYYY') : '-'}).
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Menu pembayaran:</span>
              <Link 
                href="/tenant/tagihan" 
                className="bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-3.5 py-1.5 rounded-none text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs"
              >
                Bayar / Menu Tagihan <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
