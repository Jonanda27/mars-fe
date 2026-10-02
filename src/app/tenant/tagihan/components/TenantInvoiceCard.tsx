import React from 'react';
import { 
  Building2, Plane, AlertTriangle, FileText, 
  Banknote, Clock, CheckCircle2, Calendar, Ban, Compass 
} from 'lucide-react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import StatusBadge from '@/components/StatusBadge';
import dayjs from 'dayjs';

interface TenantInvoiceCardProps {
  readonly invoice: Invoice;
  readonly isDenda: boolean;
  readonly isRuangan: boolean;
  readonly isMiniAirport?: boolean;
  readonly onOpenSkrd: (invoice: Invoice) => void;
  readonly onOpenUploadModal: (invoice: Invoice) => void;
}

export const TenantInvoiceCard: React.FC<TenantInvoiceCardProps> = ({
  invoice,
  isDenda,
  isRuangan,
  isMiniAirport: propIsMiniAirport,
  onOpenSkrd,
  onOpenUploadModal,
}) => {
  const isMiniAirport = propIsMiniAirport ?? Boolean(
    invoice.invoice_type === 'Mini Airport' ||
    invoice.invoice_number?.includes('MAP') ||
    invoice.details?.type === 'MINI_AIRPORT_LANDING' ||
    invoice.details?.airport_code
  );

  const isScheduled = invoice.status === 'Scheduled';
  const isCancelled = invoice.status === 'Cancelled' || invoice.status === 'Dibatalkan';
  const total = Number(invoice.amount) + Number(invoice.penalty_amount || 0);

  return (
    <div 
      className={`bg-white border-t-[3px] ${
        isDenda 
          ? 'border-t-red-600' 
          : isMiniAirport
          ? 'border-t-amber-500'
          : isRuangan 
          ? 'border-t-emerald-600' 
          : 'border-t-[#3c8dbc]'
      } border-x border-b border-slate-200 shadow-2xs flex flex-col justify-between transition-shadow hover:shadow-xs relative`}
    >
      {isScheduled && (
        <div className="absolute inset-0 bg-slate-50/60 z-10 flex items-center justify-center backdrop-blur-[0.5px] pointer-events-none">
          <div className="bg-slate-800 text-white px-3 py-1 font-bold text-xs flex items-center shadow-md">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Terjadwal (Belum Waktunya)
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="absolute inset-0 bg-red-50/40 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-red-700 text-white px-3 py-1 font-bold text-xs flex items-center shadow-md">
            <Ban className="w-3.5 h-3.5 mr-1.5" /> SKRD Dibatalkan / Dikoreksi
          </div>
        </div>
      )}

      <div>
        {/* Card Header */}
        <div className={`p-3.5 border-b border-slate-100 flex justify-between items-start ${
          isDenda ? 'bg-red-50/30' : isMiniAirport ? 'bg-amber-50/30' : isRuangan ? 'bg-emerald-50/30' : 'bg-blue-50/30'
        }`}>
          <div>
            {/* Service Badge */}
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              {isDenda ? (
                <span className="bg-red-100 text-red-900 border border-red-300 font-bold px-2 py-0.5 text-[10px] inline-flex items-center gap-1 rounded">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                  RETRIBUSI DENDA KETERLAMBATAN (4.1.4.01.01)
                </span>
              ) : isMiniAirport ? (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 text-[10px] inline-flex items-center gap-1 rounded">
                  <Compass className="w-3.5 h-3.5 text-amber-700" />
                  RETRIBUSI MINI AIRPORT (4.1.2.02.03)
                </span>
              ) : isRuangan ? (
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 text-[10px] inline-flex items-center gap-1 rounded">
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  RETRIBUSI SEWA RUANGAN 
                </span>
              ) : (
                <span className="bg-blue-100 text-[#205072] border border-blue-300 font-bold px-2 py-0.5 text-[10px] inline-flex items-center gap-1 rounded">
                  <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" />
                  RETRIBUSI SEWA HANGGAR &amp; APRON
                </span>
              )}

              {isRuangan && invoice.contracts?.periode_pembayaran === 'Sekaligus di Awal' && (
                <span className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                  Penetapan di Awal
                </span>
              )}
            </div>

            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor SKRD</div>
            <div className="font-bold text-base text-slate-900 font-mono">{invoice.invoice_number}</div>
          </div>

          <div className="z-20">
            <StatusBadge status={invoice.status} />
          </div>
        </div>
        
        {/* Card Body Grid */}
        <div className="p-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          
          {/* Column 1: Rincian Objek / Armada / Denda */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {isDenda 
                ? 'Rincian Objek Sanksi Denda' 
                : isMiniAirport
                ? 'Rincian Operasional Mini Airport'
                : isRuangan 
                ? 'Rincian Objek Sewa Ruangan' 
                : 'Rincian Armada Terverifikasi'}
            </div>

            <div className={`p-2.5 border ${
              isDenda 
                ? 'bg-red-50/20 border-red-100'
                : isMiniAirport
                ? 'bg-amber-50/20 border-amber-100'
                : isRuangan 
                ? 'bg-emerald-50/20 border-emerald-100' 
                : 'bg-blue-50/20 border-blue-100'
            }`}>
              {isDenda ? (
                <div className="space-y-1">
                  <div className="font-bold text-red-900 text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                    <span>Sanksi Administratif Bunga (1%/Bulan)</span>
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Ref SKRD Pokok: <strong className="text-slate-900">{invoice.details?.principal_invoice_number || '-'}</strong>
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Pokok Tertunggak: <strong className="text-slate-900">{formatRupiah(Number(invoice.details?.principal_amount || 0))}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-0.5 border-t border-slate-200 mt-1">
                    Keterlambatan: <strong>{invoice.details?.overdue_days || 0} Hari</strong> ({invoice.details?.months_overdue || 1} Bulan Kalender)
                  </div>
                </div>
              ) : isMiniAirport ? (
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>{invoice.details?.airport_name || 'Mini Airport Perintis'}</span>
                    </div>
                    <span className="font-mono text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 border border-amber-200">
                      {invoice.details?.allocated_stand || 'STAND 01'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-700 flex justify-between">
                    <span>Armada:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {invoice.details?.registration_number || '-'} <span className="font-normal font-sans text-slate-500">({invoice.details?.aircraft_type || 'Pesawat'})</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-700 flex justify-between">
                    <span>Penumpang:</span>
                    <strong className="text-slate-900">{invoice.details?.passengers_count ?? 0} Orang</strong>
                  </div>

                  <div className="text-[11px] text-slate-700 flex justify-between">
                    <span>Penempatan:</span>
                    <strong className={invoice.details?.is_overnight ? 'text-amber-800' : 'text-blue-800'}>
                      {invoice.details?.is_overnight ? `Menginap (RON ${invoice.details?.overnight_nights || 1} Mlm)` : 'Parkir Transit Siang'}
                    </strong>
                  </div>

                  {invoice.details?.taxes && (
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-amber-200/60 flex justify-between">
                      <span>{invoice.details.taxes.length} Komponen Retribusi</span>
                      <span className="italic">Perbup No. 25/2024</span>
                    </div>
                  )}
                </div>
              ) : isRuangan ? (
                // Rincian Objek Ruangan
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{invoice.contracts?.assets?.nama_aset || 'Sewa Ruangan Terminal'}</span>
                  </div>
                  
                  {invoice.contracts?.luas && (
                    <div className="text-[11px] text-slate-600">
                      Luas Objek: <strong className="text-slate-800">{invoice.contracts.luas} m²</strong>
                    </div>
                  )}

                  {invoice.contracts?.tarif_satuan && (
                    <div className="text-[11px] text-slate-600">
                      Tarif: <strong className="text-slate-800">{formatRupiah(invoice.contracts.tarif_satuan)}</strong> / m² / Bulan
                    </div>
                  )}

                  {invoice.contracts?.start_date && invoice.contracts?.end_date && (
                    <div className="text-[10px] text-slate-500 pt-0.5 border-t border-slate-200 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Masa: {dayjs(invoice.contracts.start_date).format('DD/MM/YYYY')} - {dayjs(invoice.contracts.end_date).format('DD/MM/YYYY')}</span>
                    </div>
                  )}
                </div>
              ) : (
                // Rincian Armada Hanggar
                <div>
                  {Array.isArray(invoice.details) && invoice.details.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" flex-shrink-0 />
                        <span>{invoice.details.length} Armada Menginap</span>
                      </div>
                      
                      <div className="text-[11px] space-y-1">
                        {invoice.details.map((d: any, i: number) => (
                          <div key={i} className="bg-white p-1.5 border border-slate-200">
                            <div className="font-bold text-slate-800 font-mono text-[11px]">
                              {d.registration_number} <span className="font-normal text-slate-500 font-sans">({d.aircraft_type || 'Pesawat'})</span>
                            </div>
                            <div className="text-[10px] text-slate-600 flex justify-between mt-0.5">
                              <span>{d.total_nights} Malam @ {formatRupiah(d.rate_per_night)}</span>
                              <span className="font-bold text-[#3c8dbc]">{formatRupiah(d.subtotal)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-[10px] text-slate-400 italic pt-0.5">
                        *Dasar penetapan: Rekonsiliasi Tutup Hari Petugas Lapangan
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <Plane className="w-3.5 h-3.5 text-[#3c8dbc]" flex-shrink-0 />
                        <span>{invoice.contracts?.assets?.nama_aset || 'Fasilitas Hanggar & Apron'}</span>
                      </div>
                      {invoice.contracts?.start_date && invoice.contracts?.end_date && (
                        <div className="text-[10px] text-slate-500 pt-0.5 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Masa: {dayjs(invoice.contracts.start_date).format('DD/MM/YYYY')} - {dayjs(invoice.contracts.end_date).format('DD/MM/YYYY')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Column 2: Jatuh Tempo & Total */}
          <div className="flex flex-col justify-between space-y-3">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jatuh Tempo (30 Hari)</div>
              <div className="font-semibold text-slate-800 flex items-center gap-1 text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {invoice.due_date ? dayjs(invoice.due_date).format('DD MMMM YYYY') : '-'}
              </div>
            </div>
            
            <div className="p-2.5 bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                {isDenda ? 'Total Denda' : 'Total Retribusi'}
              </div>
              <div className={`font-black text-lg ${isDenda ? 'text-red-700' : isScheduled ? 'text-slate-600' : 'text-slate-900'}`}>
                {formatRupiah(total)}
              </div>
              {!isDenda && Number(invoice.penalty_amount) > 0 && (
                <div className="text-[10px] text-red-600 font-bold mt-0.5">
                  Termasuk Denda: +{formatRupiah(Number(invoice.penalty_amount))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 flex flex-wrap justify-between items-center gap-2 z-20">
        <div className="text-[10px] text-slate-400 font-mono">
          {isDenda 
            ? 'Kode Rek: 4.1.4.01.01 (Denda)' 
            : isMiniAirport
            ? 'Kode Rek: 4.1.2.02.03 (Mini Airport)'
            : isRuangan 
            ? 'Kode Rek: 4.1.2.02.01 (Ruangan)' 
            : 'Kode Rek: 4.1.2.02.02 (Hanggar)'}
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onOpenSkrd(invoice)}
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" /> 
            Lihat e-SKRD
          </button>

          {!isScheduled && !isCancelled && (invoice.status === 'Unpaid' || invoice.status === 'Overdue') && (
            <button 
              onClick={() => onOpenUploadModal(invoice)}
              className="px-4 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
            >
              <Banknote className="w-3.5 h-3.5" /> 
              Upload Bukti Bayar
            </button>
          )}

          {!isScheduled && invoice.status === 'Pending Verification' && (
            <StatusBadge status="Menunggu Verifikasi" label="Bukti Sedang Diverifikasi" />
          )}

          {!isScheduled && invoice.status === 'Paid' && (
            <StatusBadge status="Lunas" />
          )}
        </div>
      </div>
    </div>
  );
};
