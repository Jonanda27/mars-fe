import React from 'react';
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
  readonly onOpenWarningDoc?: (invoice: Invoice, warning: any) => void;
}

export const TenantInvoiceCard: React.FC<TenantInvoiceCardProps> = ({
  invoice,
  isDenda,
  isRuangan,
  isMiniAirport: propIsMiniAirport,
  onOpenSkrd,
  onOpenUploadModal,
  onOpenWarningDoc,
}) => {
  const isMiniAirport = propIsMiniAirport ?? Boolean(
    invoice.invoice_type === 'Mini Airport' ||
    invoice.invoice_number?.includes('MAP') ||
    invoice.details?.type === 'MINI_AIRPORT_LANDING' ||
    invoice.details?.airport_code
  );

  const isScheduled = invoice.status === 'Scheduled';
  const isCancelled = invoice.status === 'Cancelled' || invoice.status === 'Dibatalkan';

  // Deteksi Surat Naskah Dinas Terkait
  const strdWarning = invoice.warnings?.find(w => (w.type || '').toUpperCase().includes('STRD'));
  const teguranWarning = invoice.warnings?.find(w => (w.type || '').toUpperCase().includes('TEGURAN'));
  const pemberitahuanWarning = invoice.warnings?.find(w => (w.type || '').toUpperCase().includes('PEMBERITAHUAN'));

  // Perhitungan Keterlambatan dan Sanksi Bunga Administrasi
  const dueDate = invoice.due_date ? dayjs(invoice.due_date) : null;
  const today = dayjs();
  const overdueDays = dueDate ? Math.max(0, today.diff(dueDate, 'day')) : 0;

  // Hitung jumlah bulan kalender keterlambatan (1% per bulan kalender)
  const monthsOverdue = overdueDays > 0 ? Math.max(1, Math.min(24, Math.ceil(overdueDays / 30))) : 0;
  const penaltyRatePercent = monthsOverdue * 1;

  const baseAmount = Number(invoice.amount || 0);
  const penaltyAmount = Number(invoice.penalty_amount || 0) > 0 
    ? Number(invoice.penalty_amount) 
    : (penaltyRatePercent > 0 ? Math.round((baseAmount * penaltyRatePercent) / 100) : 0);
  const grandTotal = baseAmount + penaltyAmount;

  return (
    <div 
      className={`bg-white border-t-[3px] ${
        strdWarning
          ? 'border-t-red-600 ring-1 ring-red-100'
          : isDenda 
          ? 'border-t-red-600' 
          : isMiniAirport
          ? 'border-t-amber-500'
          : isRuangan 
          ? 'border-t-emerald-600' 
          : 'border-t-[#3c8dbc]'
      } border-x border-b border-slate-200 shadow-xs flex flex-col justify-between transition-shadow hover:shadow-md relative overflow-hidden`}
    >
      {isScheduled && (
        <div className="absolute inset-0 bg-slate-50/70 z-10 flex items-center justify-center backdrop-blur-[0.5px] pointer-events-none">
          <div className="bg-slate-800 text-white px-3 py-1 font-bold text-xs shadow-md">
            Terjadwal (Belum Waktunya)
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="absolute inset-0 bg-red-50/50 z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-red-700 text-white px-3 py-1 font-bold text-xs shadow-md">
            SKRD Dibatalkan / Dikoreksi
          </div>
        </div>
      )}

      <div>
        {/* ======================================================== */}
        {/* CARD HEADER: BADGES, STATUS & NOMOR DOKUMEN             */}
        {/* ======================================================== */}
        <div className={`p-4 border-b border-slate-200 ${
          strdWarning 
            ? 'bg-red-50/30' 
            : isDenda 
            ? 'bg-red-50/20' 
            : isMiniAirport 
            ? 'bg-amber-50/20' 
            : isRuangan 
            ? 'bg-emerald-50/20' 
            : 'bg-blue-50/20'
        }`}>
          {/* Top Line: Badges Layanan & Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Service Badge */}
              {isDenda ? (
                <span className="bg-red-100 text-red-900 border border-red-300 font-bold px-2 py-0.5 text-[10px] rounded">
                  RETRIBUSI DENDA KETERLAMBATAN
                </span>
              ) : isMiniAirport ? (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 text-[10px] rounded">
                  RETRIBUSI MINI AIRPORT
                </span>
              ) : isRuangan ? (
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 text-[10px] rounded">
                  RETRIBUSI SEWA RUANGAN
                </span>
              ) : (
                <span className="bg-blue-100 text-[#205072] border border-blue-300 font-bold px-2 py-0.5 text-[10px] rounded">
                  RETRIBUSI SEWA HANGGAR &amp; APRON
                </span>
              )}

              {/* Status Peringatan / STRD */}
              {strdWarning && (
                <span className="bg-red-600 text-white font-bold px-2 py-0.5 text-[10px] rounded">
                  STRD TERBIT
                </span>
              )}
              {!strdWarning && teguranWarning && (
                <span className="bg-amber-600 text-white font-bold px-2 py-0.5 text-[10px] rounded">
                  SURAT TEGURAN
                </span>
              )}
              {!strdWarning && !teguranWarning && pemberitahuanWarning && (
                <span className="bg-blue-600 text-white font-bold px-2 py-0.5 text-[10px] rounded">
                  SURAT PEMBERITAHUAN
                </span>
              )}
            </div>

            <div>
              <StatusBadge status={invoice.status} />
            </div>
          </div>

          {/* Grid Nomor SKRD & Nomor STRD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Box Nomor SKRD */}
            <div className="bg-white border border-slate-200 p-2.5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                Nomor SKRD (Pokok)
              </div>
              <div className="font-bold text-sm text-slate-900 font-mono">
                {invoice.invoice_number}
              </div>
            </div>

            {/* Box Nomor STRD / Teguran / Tanggal Penetapan */}
            {strdWarning ? (
              <div className="bg-red-50/80 border border-red-200 p-2.5">
                <div className="text-[10px] text-red-700 font-bold uppercase tracking-wider mb-0.5">
                  Nomor STRD (Piutang)
                </div>
                <div className="font-bold text-sm text-red-950 font-mono">
                  {strdWarning.warning_number}
                </div>
              </div>
            ) : teguranWarning ? (
              <div className="bg-amber-50/80 border border-amber-200 p-2.5">
                <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wider mb-0.5">
                  Nomor Surat Teguran
                </div>
                <div className="font-bold text-sm text-amber-950 font-mono">
                  {teguranWarning.warning_number}
                </div>
              </div>
            ) : pemberitahuanWarning ? (
              <div className="bg-blue-50/80 border border-blue-200 p-2.5">
                <div className="text-[10px] text-blue-800 font-bold uppercase tracking-wider mb-0.5">
                  Nomor Surat Pemberitahuan
                </div>
                <div className="font-bold text-sm text-blue-950 font-mono">
                  {pemberitahuanWarning.warning_number}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 p-2.5 flex flex-col justify-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                  Tanggal Penetapan
                </div>
                <div className="font-medium text-xs text-slate-700 font-mono">
                  {dayjs(invoice.created_at).format('DD MMMM YYYY')}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* BANNER DETAIL SANKSI: HARI & PERSENTASE BUNGA             */}
        {/* ======================================================== */}
        {(strdWarning || overdueDays > 0) && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-300 font-bold text-[11px] rounded">
                Terlambat {overdueDays} Hari
              </span>
              <span className="text-slate-600 text-[11px]">
                Jatuh tempo: <strong className="text-slate-800 font-semibold">{dueDate?.format('DD MMMM YYYY')}</strong>
              </span>
            </div>

            <div>
              <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-[11px] rounded">
                Sanksi Bunga: {penaltyRatePercent}% ({monthsOverdue} Bulan x 1%/Bulan)
              </span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BODY GRID: RINCIAN OBJEK & RINCIAN KEWAJIBAN PEMBAYARAN  */}
        {/* ======================================================== */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* KOLOM 1: Rincian Objek Layanan */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {isDenda 
                ? 'Rincian Objek Denda' 
                : isMiniAirport
                ? 'Rincian Operasional Mini Airport'
                : isRuangan 
                ? 'Rincian Objek Sewa Ruangan' 
                : 'Rincian Armada Terverifikasi'}
            </div>

            <div className="p-3 border border-slate-200 bg-slate-50/50 h-full flex flex-col justify-between">
              {isDenda ? (
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs">
                    Sanksi Administratif Bunga (1%/Bulan)
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Ref SKRD Pokok: <strong className="text-slate-900 font-mono">{invoice.details?.principal_invoice_number || '-'}</strong>
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Pokok Tertunggak: <strong className="text-slate-900">{formatRupiah(Number(invoice.details?.principal_amount || 0))}</strong>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                    Keterlambatan: <strong>{invoice.details?.overdue_days || 0} Hari</strong> ({invoice.details?.months_overdue || 1} Bulan Kalender)
                  </div>
                </div>
              ) : isMiniAirport ? (
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                    <span>{invoice.details?.airport_name || 'Mini Airport Perintis'}</span>
                    <span className="font-mono text-[10px] bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5">
                      {invoice.details?.allocated_stand || 'STAND 01'}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-700 flex justify-between">
                    <span>Armada:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {invoice.details?.registration_number || '-'} ({invoice.details?.aircraft_type || 'Pesawat'})
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-700 flex justify-between">
                    <span>Penumpang:</span>
                    <strong className="text-slate-900">{invoice.details?.passengers_count ?? 0} Orang</strong>
                  </div>

                  <div className="text-[11px] text-slate-700 flex justify-between">
                    <span>Penempatan:</span>
                    <strong className="text-slate-900">
                      {invoice.details?.is_overnight ? `Menginap (${invoice.details?.overnight_nights || 1} Malam)` : 'Parkir Transit Siang'}
                    </strong>
                  </div>
                </div>
              ) : isRuangan ? (
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-900 text-xs">
                    {invoice.contracts?.assets?.nama_aset || 'Sewa Ruangan Terminal'}
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
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      Masa: {dayjs(invoice.contracts.start_date).format('DD/MM/YYYY')} - {dayjs(invoice.contracts.end_date).format('DD/MM/YYYY')}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {Array.isArray(invoice.details) && invoice.details.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="font-bold text-slate-900 text-xs">
                        {invoice.details.length} Armada Menginap
                      </div>
                      
                      <div className="text-[11px] space-y-1.5">
                        {invoice.details.map((d: any, i: number) => (
                          <div key={i} className="bg-white p-2 border border-slate-200">
                            <div className="font-bold text-slate-800 font-mono text-[11px]">
                              {d.registration_number} <span className="font-normal text-slate-500">({d.aircraft_type || 'Pesawat'})</span>
                            </div>
                            <div className="text-[10px] text-slate-600 flex justify-between mt-0.5">
                              <span>{d.total_nights} Malam @ {formatRupiah(d.rate_per_night)}</span>
                              <span className="font-bold text-slate-900 font-mono">{formatRupiah(d.subtotal)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-[10px] text-slate-400 italic pt-1">
                        Dasar penetapan: Rekonsiliasi Tutup Hari Petugas
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900 text-xs">
                        {invoice.contracts?.assets?.nama_aset || 'Fasilitas Hanggar & Apron'}
                      </div>
                      {invoice.contracts?.start_date && invoice.contracts?.end_date && (
                        <div className="text-[10px] text-slate-500 pt-1">
                          Masa: {dayjs(invoice.contracts.start_date).format('DD/MM/YYYY')} - {dayjs(invoice.contracts.end_date).format('DD/MM/YYYY')}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* KOLOM 2: Box Rincian Kewajiban Pembayaran */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Rincian Kewajiban Pembayaran
            </div>

            <div className="flex flex-col justify-between h-full bg-slate-50 border border-slate-200 p-3.5">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                  <span className="text-[11px] font-bold text-slate-700">Komponen Biaya</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {strdWarning ? 'SKRD Pokok + STRD' : 'SKRD Pokok'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Pokok Retribusi */}
                  <div className="flex justify-between items-center text-slate-700">
                    <span className="text-[11px]">Pokok Retribusi (SKRD):</span>
                    <span className="font-mono font-bold text-slate-900">{formatRupiah(baseAmount)}</span>
                  </div>

                  {/* Jatuh Tempo */}
                  <div className="flex justify-between items-center text-slate-600 text-[11px]">
                    <span>Jatuh Tempo (30 Hari):</span>
                    <span className="font-mono text-slate-800">{dueDate ? dueDate.format('DD MMMM YYYY') : '-'}</span>
                  </div>

                  {/* Detail Hari & Persentase Sanksi */}
                  {(strdWarning || overdueDays > 0 || penaltyAmount > 0) && (
                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-red-700 font-medium">Masa Keterlambatan:</span>
                        <span className="font-mono font-bold text-red-800">
                          {overdueDays} Hari <span className="font-normal text-slate-500">({monthsOverdue} Bulan)</span>
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline text-[11px]">
                        <div>
                          <span className="text-red-700 font-bold">Sanksi Bunga Administrasi ({penaltyRatePercent}%):</span>
                          <div className="text-[9.5px] text-red-600/90 italic font-normal">
                            1%/Bulan x {monthsOverdue} Bulan
                          </div>
                        </div>
                        <span className="font-mono font-bold text-red-700 text-xs">
                          +{formatRupiah(penaltyAmount)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Wajib Setor Highlight */}
              <div className={`mt-3 pt-2.5 border-t-2 ${strdWarning || penaltyAmount > 0 ? 'border-red-300 bg-red-100/30 -mx-3.5 -mb-3.5 p-3.5' : 'border-slate-300'}`}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                      Total Wajib Setor
                    </div>
                    {strdWarning ? (
                      <div className="text-[9.5px] text-red-700 italic">
                        Pokok SKRD + Sanksi Bunga STRD
                      </div>
                    ) : (
                      <div className="text-[9.5px] text-slate-500 italic">
                        Kas Umum Daerah Kabupaten Mimika
                      </div>
                    )}
                  </div>
                  <div className={`font-black text-xl font-mono ${strdWarning || penaltyAmount > 0 ? 'text-red-900' : 'text-slate-900'}`}>
                    {formatRupiah(grandTotal)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* CARD ACTIONS FOOTER: TOMBOL SEDERHANA & RAPI             */}
      {/* ======================================================== */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex flex-wrap justify-between items-center gap-2 z-20">
        <div className="text-[10px] text-slate-400 font-mono">
          {isDenda 
            ? 'Kode Rek: 4.1.4.01.01 (Denda)' 
            : isMiniAirport
            ? 'Kode Rek: 4.1.2.02.03 (Mini Airport)'
            : isRuangan 
            ? 'Kode Rek: 4.1.2.02.01 (Ruangan)' 
            : 'Kode Rek: 4.1.2.02.02 (Hanggar)'}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Tombol Lihat e-SKRD */}
          <button 
            type="button"
            onClick={() => onOpenSkrd(invoice)}
            className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs cursor-pointer transition-colors"
          >
            Lihat e-SKRD
          </button>

          {/* Tombol Lihat STRD */}
          {strdWarning && (
            <button 
              type="button"
              onClick={() => onOpenWarningDoc?.(invoice, strdWarning)}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs cursor-pointer transition-colors"
              title="Buka Dokumen Resmi Surat Tagihan Retribusi Daerah"
            >
              Lihat STRD
            </button>
          )}

          {/* Tombol Surat Teguran jika ada dan belum STRD */}
          {!strdWarning && teguranWarning && (
            <button 
              type="button"
              onClick={() => onOpenWarningDoc?.(invoice, teguranWarning)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs cursor-pointer transition-colors"
              title="Buka Dokumen Resmi Surat Teguran"
            >
              Lihat Surat Teguran
            </button>
          )}

          {/* Tombol Surat Pemberitahuan jika ada */}
          {!strdWarning && !teguranWarning && pemberitahuanWarning && (
            <button 
              type="button"
              onClick={() => onOpenWarningDoc?.(invoice, pemberitahuanWarning)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer transition-colors"
              title="Buka Dokumen Resmi Surat Pemberitahuan"
            >
              Lihat Surat Pemberitahuan
            </button>
          )}

          {/* Tombol Upload Bukti Bayar / Setor */}
          {!isScheduled && !isCancelled && (invoice.status === 'Unpaid' || invoice.status === 'Overdue') && (
            <button 
              type="button"
              onClick={() => onOpenUploadModal(invoice)}
              className="px-4 py-1.5 bg-[#00a65a] hover:bg-[#008d4c] text-white font-semibold text-xs cursor-pointer transition-colors"
              title="Upload Bukti Setoran ke Rekening Kas Daerah"
            >
              {strdWarning ? 'Upload Bukti Setor (Pokok + STRD)' : 'Upload Bukti Bayar'}
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
