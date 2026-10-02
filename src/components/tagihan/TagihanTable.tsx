import { 
  Building2, Plane, AlertTriangle, FileText, 
  CheckCircle2, FileEdit, Ban, Loader2, ShieldAlert, Link as LinkIcon, TowerControl 
} from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

interface TagihanTableProps {
  readonly invoices: Invoice[];
  readonly isLoading: boolean;
  readonly isDinas: boolean;
  readonly onOpenVerify: (inv: Invoice) => void;
  readonly onOpenSkrd: (inv: Invoice) => void;
  readonly onOpenPenalty: (inv: Invoice) => void;
  readonly onOpenReissue: (inv: Invoice) => void;
  readonly onOpenCancel: (inv: Invoice) => void;
}

export const TagihanTable: React.FC<TagihanTableProps> = ({
  invoices,
  isLoading,
  isDinas,
  onOpenVerify,
  onOpenSkrd,
  onOpenPenalty,
  onOpenReissue,
  onOpenCancel,
}) => {

  return (
    <div className="bg-white border-t-[3px] border-[#3c8dbc] shadow-sm">
      <div className="p-[10px] border-b border-[#f4f4f4] flex justify-between items-center">
        <h3 className="text-[16px] text-[#444] font-normal">Data e-SKRD Keseluruhan</h3>
      </div>
      
      <div className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="p-10 flex justify-center items-center text-[#777]">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Memuat data tagihan...
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-[14px]">
            <thead>
              <tr className="border-b-2 border-[#f4f4f4] text-[#444] bg-[#f9fafb]">
                <th className="py-4 px-5 font-bold">Tenant</th>
                <th className="py-4 px-5 font-bold">Nomor e-SKRD</th>
                <th className="py-4 px-5 font-bold text-right">Nominal</th>
                <th className="py-4 px-5 font-bold text-center">Batas Waktu</th>
                <th className="py-4 px-5 font-bold text-center">Status</th>
                <th className="py-4 px-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((item) => {
                const isDenda = Boolean(
                  item.invoice_type === 'SKRD Denda' ||
                  item.invoice_number?.includes('DND') ||
                  item.details?.type === 'PENALTY_INVOICE'
                );

                const isRuangan = !isDenda && Boolean(
                  item.invoice_type === 'Sewa Ruangan' ||
                  item.contracts?.jenis_pemanfaatan?.toLowerCase().includes('ruang') ||
                  item.contracts?.assets?.jenis_aset?.toLowerCase().includes('ruang') ||
                  item.contracts?.contract_number?.includes('PKS-RG')
                );

                const isEmergency = !isDenda && Boolean(
                  item.invoice_type === 'Pendaratan Darurat' ||
                  item.invoice_number?.startsWith('SKRD-EMG') ||
                  item.contracts?.contract_type === 'PKS Pendaratan Darurat'
                );

                const isOverdueState = item.status === 'Overdue' || (
                  (item.status === 'Unpaid' || item.status === 'Belum Lunas') &&
                  item.due_date &&
                  new Date() > new Date(item.due_date)
                );

                const isCancellable = isDinas && item.status !== 'Paid' && item.status !== 'Cancelled' && item.status !== 'Dibatalkan';
                const canIssuePenalty = isDinas && !isDenda && isOverdueState && item.status !== 'Paid' && item.status !== 'Cancelled';

                const isMiniAirport = !isDenda && Boolean(
                  item.invoice_type === 'Mini Airport' ||
                  item.invoice_number?.startsWith('SKRD-MAP') ||
                  (item.details && typeof item.details === 'object' && (item.details as any).service_type === 'Mini Airport')
                );

                return (
                  <tr key={item.id} className="border-b border-[#f4f4f4] hover:bg-slate-50">
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#333] text-[15px]">{item.tenants?.nama_perusahaan || '-'}</div>
                      <div className="mt-1">
                        {isDenda ? (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 border border-red-200 text-[10px] font-bold px-1.5 py-0.5">
                            <AlertTriangle className="w-3 h-3 text-red-600" /> SKRD Denda (4.1.4.01.01)
                          </span>
                        ) : isEmergency ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold px-1.5 py-0.5">
                            <ShieldAlert className="w-3 h-3 text-amber-600" /> Pendaratan Darurat (4.1.2.02)
                          </span>
                        ) : isMiniAirport ? (
                          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-300 text-[10px] font-bold px-1.5 py-0.5">
                            <TowerControl className="w-3 h-3 text-purple-600" /> Mini Airport (4.1.2.02.03)
                          </span>
                        ) : isRuangan ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5">
                            <Building2 className="w-3 h-3 text-emerald-600" /> Sewa Ruangan (4.1.2.02.01)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-1.5 py-0.5">
                            <Plane className="w-3 h-3 text-[#3c8dbc]" /> Sewa Hanggar (4.1.2.02.02)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-[#3c8dbc]">{item.invoice_number}</div>
                      {item.contracts?.contract_number && (
                        <div className="text-[11px] text-[#777]">Ref PKS: {item.contracts.contract_number}</div>
                      )}
                      {isDenda && item.details?.principal_invoice_number && (
                        <div className="text-[11px] text-red-600 font-medium">Ref SKRD Pokok: {item.details.principal_invoice_number}</div>
                      )}
                      {Array.isArray(item.details) && item.details.length > 0 && (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                            {item.details.length} Armada ({item.details.reduce((s: number, d: any) => s + (d.total_nights || 1), 0)} Malam)
                          </span>
                        </div>
                      )}
                      {item.contracts?.periode_pembayaran === 'Sekaligus di Awal' && (
                        <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                          SKRD Di Awal ({item.contracts?.start_date ? dayjs(item.contracts.start_date).format('DD/MM/YY') : ''} - {item.contracts?.end_date ? dayjs(item.contracts.end_date).format('DD/MM/YY') : ''})
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-[#333]">
                      {formatRupiah(Number(item.amount) + Number(item.penalty_amount || 0))}
                      {Number(item.penalty_amount) > 0 && (
                        <div className="text-[11px] text-red-600 font-bold mt-1">+ Denda: {formatRupiah(Number(item.penalty_amount))}</div>
                      )}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="font-bold text-[#333]">{item.due_date ? dayjs(item.due_date).format('DD MMM YYYY') : '-'}</span>
                      {isOverdueState && item.status !== 'Paid' && item.status !== 'Cancelled' && (
                        <div className="text-[10px] text-red-600 font-bold mt-0.5">Lewat Jatuh Tempo</div>
                      )}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {item.status === 'Pending Verification' && (
                          <button 
                            onClick={() => onOpenVerify(item)}
                            className="bg-[#3c8dbc] border border-[#367fa9] text-white hover:bg-[#367fa9] px-2 py-1 text-[11px] font-bold inline-flex items-center justify-center shadow-xs cursor-pointer"
                            title="Verifikasi Bukti Pembayaran"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-white" /> Verifikasi
                          </button>
                        )}

                        <button 
                          onClick={() => onOpenSkrd(item)}
                          className="bg-white border border-[#d2d6de] text-[#444] hover:bg-[#f4f4f4] px-2 py-1 text-[11px] font-bold inline-flex items-center justify-center shadow-xs cursor-pointer"
                          title="Lihat / Cetak SKRD"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1 text-[#3c8dbc]" /> Lihat
                        </button>

                        {/* Tombol Salin Link Bayar Khusus Pendaratan Darurat */}
                        {isEmergency && (() => {
                          const details = typeof item.details === 'string' ? JSON.parse(item.details) : (item.details || []);
                          const detailItem = Array.isArray(details) ? details[0] : details;
                          const token = detailItem?.emergency_payment_token;
                          if (!token) return null;
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                const url = `${window.location.origin}/pembayaran-darurat/${token}`;
                                navigator.clipboard.writeText(url);
                                toast.success('Link pembayaran darurat disalin');
                              }}
                              className="bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 px-2 py-1 text-[11px] font-bold inline-flex items-center justify-center shadow-xs cursor-pointer"
                              title="Salin Tautan Pembayaran Darurat untuk Maskapai"
                            >
                              <LinkIcon className="w-3.5 h-3.5 mr-1 text-amber-600" /> Link Bayar
                            </button>
                          );
                        })()}

                        {/* Aksi Otoritas Dinas: Terbitkan SKRD Denda */}
                        {canIssuePenalty && (
                          <button
                            onClick={() => onOpenPenalty(item)}
                            className="bg-amber-50 border border-amber-400 text-amber-800 hover:bg-amber-100 px-2 py-1 text-[11px] font-bold inline-flex items-center justify-center shadow-xs cursor-pointer"
                            title="Terbitkan SKRD Denda 1%/bulan (Slide 6 PPT)"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> + SKRD Denda
                          </button>
                        )}

                        {/* Aksi Otoritas Dinas: Koreksi / Terbitkan SKRD Pengganti (Slide 6 PPTX) */}
                        {isCancellable && (
                          <button
                            onClick={() => onOpenReissue(item)}
                            className="bg-blue-50 border border-blue-300 text-[#3c8dbc] hover:bg-blue-100 px-2 py-1 text-[11px] font-bold inline-flex items-center justify-center shadow-xs cursor-pointer"
                            title="Koreksi Nominal/Jatuh Tempo & Terbitkan SKRD Pengganti"
                          >
                            <FileEdit className="w-3.5 h-3.5 mr-1 text-[#3c8dbc]" /> Koreksi
                          </button>
                        )}

                        {/* Aksi Otoritas Dinas: Batalkan SKRD */}
                        {isCancellable && (
                          <button
                            onClick={() => onOpenCancel(item)}
                            className="bg-white border border-red-300 text-red-600 hover:bg-red-50 px-2 py-1 text-[11px] font-bold inline-flex items-center justify-center shadow-xs cursor-pointer"
                            title="Batalkan / Koreksi SKRD"
                          >
                            <Ban className="w-3.5 h-3.5 mr-1 text-red-500" /> Batalkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">Tidak ada tagihan.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
