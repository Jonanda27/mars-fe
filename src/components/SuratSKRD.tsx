import React, { forwardRef } from 'react';
import { Invoice } from '@/types/invoice';
import { formatRupiah } from '@/utils/formatCurrency';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

const terbilang = (angka: number): string => {
  const bilne = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
  if (angka < 12) return bilne[angka];
  if (angka < 20) return terbilang(angka - 10) + " Belas";
  if (angka < 100) return terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10);
  if (angka < 200) return "Seratus " + terbilang(angka - 100);
  if (angka < 1000) return terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100);
  if (angka < 2000) return "Seribu " + terbilang(angka - 1000);
  if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + " Ribu " + terbilang(angka % 1000);
  if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + " Juta " + terbilang(angka % 1000000);
  if (angka < 1000000000000) return terbilang(Math.floor(angka / 1000000000)) + " Miliar " + terbilang(angka % 1000000000);
  return "";
}

const toTerbilang = (angka: number) => {
    if (angka === 0) return 'Nol Rupiah';
    return (terbilang(angka).trim().replace(/\s+/g, ' ') + ' Rupiah').replace('  ', ' ');
}

interface SuratSKRDProps {
  invoice: Invoice;
}

const SuratSKRD = forwardRef<HTMLDivElement, SuratSKRDProps>(({ invoice }, ref) => {
  const contract = invoice.contracts;
  const tenant = contract?.tenants || invoice.tenants;
  const asset = contract?.assets;
  
  const baseAmount = Number(invoice.amount || 0);
  const penaltyAmount = Number(invoice.penalty_amount || 0);
  const totalAmount = baseAmount + penaltyAmount;

  const isDenda = Boolean(
    invoice.invoice_type === 'SKRD Denda' ||
    invoice.invoice_number?.includes('DND') ||
    invoice.details?.type === 'PENALTY_INVOICE'
  );

  const isCancelled = invoice.status === 'Cancelled' || invoice.status === 'Dibatalkan';

  const isRuangan = !isDenda && Boolean(
    invoice.invoice_type === 'Sewa Ruangan' ||
    contract?.jenis_pemanfaatan?.toLowerCase().includes('ruang') ||
    asset?.jenis_aset?.toLowerCase().includes('ruang') ||
    contract?.contract_number?.includes('PKS-RG')
  );

  const isHanggar = !isDenda && !isRuangan && Boolean(
    invoice.invoice_type === 'Sewa Hanggar' || 
    (Array.isArray(invoice.details) && invoice.details.length > 0) || 
    invoice.invoice_number?.includes('HGR') ||
    contract?.contract_number?.includes('PAYUNG') ||
    contract?.contract_number?.includes('HGR') ||
    contract?.jenis_pemanfaatan?.toLowerCase().includes('hanggar')
  );

  const getMasaRetribusi = () => {
    if (isDenda) {
      return `${invoice.details?.overdue_days || 0} Hari (${invoice.details?.months_overdue || 1} Bulan)`;
    }
    if (Array.isArray(invoice.details) && invoice.details.length > 0) {
      const dates = invoice.details
        .map((d: any) => ({ entry: d.entry_time, exit: d.exit_time }))
        .filter((d: any) => Boolean(d.entry));
      if (dates.length > 0) {
        const earliest = dates.reduce((min: string, p: any) => new Date(p.entry) < new Date(min) ? p.entry : min, dates[0].entry);
        const latest = dates.reduce((max: string, p: any) => (p.exit && new Date(p.exit) > new Date(max)) ? p.exit : max, dates[0].exit || dates[0].entry);
        return `${dayjs(earliest).format('DD-MM-YYYY')} s/d ${dayjs(latest).format('DD-MM-YYYY')}`;
      }
    }
    if (contract?.start_date && contract?.end_date) {
      return `${dayjs(contract.start_date).format('DD-MM-YYYY')} s/d ${dayjs(contract.end_date).format('DD-MM-YYYY')}`;
    }
    return dayjs(invoice.created_at).format('DD-MM-YYYY');
  };

  const invoiceItemsList = Array.isArray(invoice.details) ? invoice.details : [];

  return (
    <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', color: '#000000', lineHeight: 1.3, position: 'relative' }}>
      
      {/* HALAMAN 1: SKRD UTAMA */}
      <div 
        className="p-8 shadow-lg mb-8 mx-auto relative" 
        style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          boxSizing: 'border-box',
          backgroundColor: '#ffffff'
        }}
      >
        {isCancelled && (
          <div className="mb-4 p-3 border-2 border-red-600 bg-red-50 text-red-700 text-center font-bold text-sm">
            [ SKRD TELAH DIBATALKAN / DIKOREKSI ]
            {invoice.details?.cancellation?.reason && (
              <div className="font-normal text-xs mt-1">
                Alasan: {invoice.details.cancellation.reason} ({dayjs(invoice.details.cancellation.cancelled_at).format('DD-MM-YYYY HH:mm')})
              </div>
            )}
          </div>
        )}

        {invoice.details?.correction?.is_corrected_invoice && (
          <div className="mb-4 p-3 border-2 border-blue-600 bg-blue-50 text-blue-800 text-center font-bold text-sm">
            [ SKRD PENGGANTI / KOREKSI ]
            <div className="font-normal text-xs mt-1">
              Diterbitkan sebagai pengganti SKRD Nomor: <strong>{invoice.details.correction.corrected_from_invoice_number}</strong>
              {invoice.details.correction.correction_reason && ` — Alasan: ${invoice.details.correction.correction_reason}`}
            </div>
          </div>
        )}


        <table className="w-full border-collapse border border-black text-sm">
          <tbody>
            {/* Row 1 & 2 */}
            <tr>
              <td rowSpan={2} className="border border-black p-2 w-1/3 text-center align-top font-bold">
                PEMERINTAH KABUPATEN MIMIKA<br/>
                DINAS PERHUBUNGAN<br/>
                UPBU MOZES KILANGIN TIMIKA
              </td>
              <td className="border border-black p-2 text-center w-1/3 font-bold text-xl">
                {isDenda ? 'SKRD DENDA' : 'SKRD'}
              </td>
              <td className="border border-black p-2 text-center w-1/3" style={{ backgroundColor: '#f9fafb' }}>
                <div className="font-bold">No. SKRD</div>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">
                <div className="font-bold text-center mb-2">
                  {isDenda 
                    ? 'SURAT KETETAPAN RETRIBUSI DAERAH - DENDA' 
                    : 'SURAT KETETAPAN RETRIBUSI DAERAH'}
                </div>
                <div className="flex text-xs">
                  <div className="w-28">{isDenda ? 'Masa Tunggakan' : 'Masa Retribusi'}</div>
                  <div>: {getMasaRetribusi()}</div>
                </div>
                <div className="flex text-xs mt-1">
                  <div className="w-28">Tahun</div>
                  <div>: {dayjs(invoice.created_at).format('YYYY')}</div>
                </div>
              </td>
              <td className="border border-black p-2 text-center align-top">
                <div className="font-bold">{invoice.invoice_number}</div>
                <div className="mt-4 text-xs font-bold">Kode Bayar</div>
                <div className="font-bold">{invoice.id.toString().padStart(6, '0')}</div>
              </td>
            </tr>
            
            {/* Wajib Retribusi */}
            <tr>
              <td colSpan={3} className="border border-black p-3">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="w-32">Nama</td>
                      <td className="w-4">:</td>
                      <td className="font-bold">{tenant?.nama_perusahaan || invoiceItemsList[0]?.tenant_name || '-'}</td>
                    </tr>
                    <tr>
                      <td>Alamat</td>
                      <td>:</td>
                      <td className="font-bold">{tenant?.alamat || 'Bandara Mozes Kilangin Timika'}</td>
                    </tr>
                    <tr>
                      <td>NPWRD / NPWP</td>
                      <td>:</td>
                      <td className="font-bold">{tenant?.npwp || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            
            {/* Jatuh Tempo */}
            <tr>
              <td colSpan={3} className="border border-black p-2">
                 Tanggal Jatuh Tempo : <span className="font-bold">{dayjs(invoice.due_date).format('DD-MM-YYYY')}</span> <span className="text-xs text-slate-500 font-normal">(30 hari kalender sejak penetapan)</span>
              </td>
            </tr>
            
            {/* Items Header */}
            <tr className="text-center font-bold" style={{ backgroundColor: '#f9fafb' }}>
              <td className="border border-black p-2">Kode Rekening</td>
              <td className="border border-black p-2">Jenis Retribusi Daerah</td>
              <td className="border border-black p-2">Jumlah (Rp.)</td>
            </tr>
            
            {/* Items Body */}
            <tr>
              <td className="border border-black p-2 text-center align-top" style={{ minHeight: '120px' }}>
                 {isDenda ? '4.1.4.01.01' : isHanggar ? '4.1.2.02.02' : '4.1.2.02.01'}
              </td>
              <td className="border border-black p-2 align-top">
                {isDenda ? (
                  <div>
                    <div className="font-bold text-base mb-1 text-red-700">
                      Pendapatan Denda Retribusi Daerah
                    </div>
                    <div className="text-xs text-slate-700 mb-2">
                      Sanksi administratif berupa bunga keterlambatan sebesar 2% per bulan atas keterlambatan pelunasan SKRD Pokok.
                    </div>
                    
                    <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                      <div className="flex">
                        <span className="w-36 text-slate-500">Nomor SKRD Pokok:</span>
                        <span className="font-bold text-slate-900">{invoice.details?.principal_invoice_number || '-'}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 text-slate-500">Pokok Tertunggak:</span>
                        <span className="font-bold text-slate-900">Rp {Number(invoice.details?.principal_amount || 0).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 text-slate-500">Durasi Keterlambatan:</span>
                        <span className="font-bold text-slate-900">{invoice.details?.overdue_days || 0} Hari ({invoice.details?.months_overdue || 1} Bulan Dihitung)</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 text-slate-500">Tarif Denda:</span>
                        <span className="font-bold text-slate-900">2% per bulan</span>
                      </div>
                      <div className="flex">
                        <span className="w-36 text-slate-500">Keterangan:</span>
                        <span className="text-slate-800 italic">{invoice.details?.reference_note || '-'}</span>
                      </div>
                    </div>
                  </div>
                ) : isHanggar ? (
                  <div>
                    <div className="font-bold text-base mb-1">
                      Retribusi Sewa Hanggar & Apron Pesawat Udara
                    </div>
                    <div className="text-xs text-slate-600 mb-2">
                      Pemakaian fasilitas parkir & inap armada di Bandara Mozes Kilangin berdasarkan hasil verifikasi Laporan Tutup Hari.
                    </div>

                    {/* Rincian Tabel Armada jika ada details */}
                    {invoiceItemsList.length > 0 ? (
                      <div className="mt-2">
                        <table className="w-full border-collapse border border-slate-300 text-[11px] mb-2">
                          <thead>
                            <tr className="bg-slate-100 text-slate-800 font-bold">
                              <th className="border border-slate-300 p-1 text-center w-6">No</th>
                              <th className="border border-slate-300 p-1 text-left">Registrasi</th>
                              <th className="border border-slate-300 p-1 text-left">Tipe Pesawat</th>
                              <th className="border border-slate-300 p-1 text-center">Lokasi</th>
                              <th className="border border-slate-300 p-1 text-center">Inap</th>
                              <th className="border border-slate-300 p-1 text-right">Tarif/Mlm</th>
                              <th className="border border-slate-300 p-1 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoiceItemsList.map((item: any, idx: number) => (
                              <tr key={idx} className="border-b border-slate-200">
                                <td className="border border-slate-300 p-1 text-center">{idx + 1}</td>
                                <td className="border border-slate-300 p-1 font-bold">{item.registration_number}</td>
                                <td className="border border-slate-300 p-1">{item.aircraft_type}</td>
                                <td className="border border-slate-300 p-1 text-center">{item.parking_location}</td>
                                <td className="border border-slate-300 p-1 text-center font-bold">{item.total_nights} Mlm</td>
                                <td className="border border-slate-300 p-1 text-right">Rp {Number(item.rate_per_night).toLocaleString('id-ID')}</td>
                                <td className="border border-slate-300 p-1 text-right font-bold">Rp {Number(item.subtotal).toLocaleString('id-ID')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-xs space-y-1">
                        <div>Tarif Dasar: Sesuai Master Tarif Pesawat Bandara Mozes Kilangin</div>
                        <div>Dasar Penetapan: Laporan Tutup Hari Petugas Lapangan Terverifikasi</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="font-bold">Sewa {asset?.jenis_aset || 'Ruangan'} - {asset?.nama_aset || 'Objek Retribusi'}</div>
                    <div className="text-xs mt-1 space-y-0.5">
                      <div>
                        Tarif Satuan: Rp {Number(contract?.tarif_satuan || 0).toLocaleString('id-ID')} / 
                        {contract?.periode_pembayaran === 'Harian' ? ' Malam' : ' m² / Bulan'}
                      </div>
                      {contract?.luas && (
                        <div>Luas Objek: {contract.luas} m²</div>
                      )}
                      {contract?.start_date && contract?.end_date && (
                        <div className="text-slate-600 font-medium">
                          Masa Retribusi: {dayjs(contract.start_date).format('DD-MM-YYYY')} s/d {dayjs(contract.end_date).format('DD-MM-YYYY')}
                        </div>
                      )}
                      <div className="text-slate-500 italic text-[11px]">
                        *Penetapan SKRD di awal untuk keseluruhan masa sewa
                      </div>
                    </div>
                  </div>
                )}
              </td>
              <td className="border border-black p-2 text-right align-top font-bold">
                 {baseAmount.toLocaleString('id-ID')}
              </td>
            </tr>

            {/* Denda Keterlambatan Tambahan jika ada di SKRD Pokok */}
            {!isDenda && penaltyAmount > 0 && (
              <tr>
                <td className="border border-black p-2 text-center align-top">
                  4.1.4.01.01
                </td>
                <td className="border border-black p-2 align-top" style={{ color: '#dc2626' }}>
                  <div className="font-bold">Denda Keterlambatan Pembayaran (2% per bulan)</div>
                </td>
                <td className="border border-black p-2 text-right align-top font-bold" style={{ color: '#dc2626' }}>
                  {penaltyAmount.toLocaleString('id-ID')}
                </td>
              </tr>
            )}
            
            {/* Total */}
            <tr>
              <td colSpan={2} className="border border-black p-2 text-right pr-4">
                Jumlah Ketetapan {isDenda ? 'Denda' : 'Pokok' + (penaltyAmount > 0 ? ' + Denda' : '')}
              </td>
              <td className="border border-black p-2 text-right font-bold" style={{ backgroundColor: '#f9fafb' }}>
                {totalAmount.toLocaleString('id-ID')}
              </td>
            </tr>
            
            {/* Terbilang */}
            <tr>
              <td className="border border-black p-2">
                 Dengan huruf
              </td>
              <td colSpan={2} className="border border-black p-2 font-bold italic">
                 {toTerbilang(totalAmount)}
              </td>
            </tr>
            
            {/* Perhatian & Signatures */}
            <tr>
              <td colSpan={3} className="border border-black p-0">
                 <div className="p-2 border-b border-black">
                   <div className="font-bold uppercase">PERHATIAN</div>
                   <ol className="list-decimal ml-6 mt-1 text-xs space-y-1">
                     <li>Penyetoran dilakukan melalui Bendahara Penerima atau Kas Daerah dengan menggunakan SKRD ini.</li>
                     <li>Apabila SKRD ini tidak atau kurang dibayar setelah lewat waktu paling lama 30 hari sejak SKRD ini ditetapkan dikenakan sanksi administratif berupa bunga sebesar 2 % per bulan.</li>
                   </ol>
                 </div>
                 
                 <div className="flex">
                    <div className="w-1/2 p-4 flex items-center justify-center border-r border-black">
                       <div className="w-28 h-28 border border-dashed flex items-center justify-center text-xs text-center p-2" style={{ borderColor: '#9ca3af', backgroundColor: '#f9fafb', color: '#9ca3af' }}>
                          [QR Code Bayar]
                       </div>
                    </div>
                    <div className="w-1/2 p-4 text-center flex flex-col justify-between">
                       <div className="mb-16 text-sm">
                          Timika, {dayjs(invoice.created_at).format('DD MMMM YYYY')}<br/>
                          Pejabat Yang Menetapkan
                       </div>
                       <div className="text-sm">
                          <div className="underline font-bold">Kepala UPBU Mozes Kilangin</div>
                          <div>NIP. 19700101 199001 1 001</div>
                       </div>
                    </div>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* HALAMAN 2: TANDA TERIMA */}
      <div 
        className="p-8 shadow-lg mx-auto" 
        style={{ 
          width: '210mm', 
          minHeight: '297mm', 
          boxSizing: 'border-box',
          pageBreakBefore: 'always',
          backgroundColor: '#ffffff'
        }}
      >
        <table className="w-full border-collapse border border-black text-sm">
          <tbody>
            <tr>
              <td colSpan={3} className="border border-black p-1 text-center font-bold" style={{ backgroundColor: '#f9fafb' }}>
                 No. SKRD: {invoice.invoice_number}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black p-2 text-center font-bold">
                 TANDA TERIMA
              </td>
            </tr>
            <tr>
              <td className="w-40 border border-black p-2 border-r-0">NPWRD / NPWP</td>
              <td className="w-4 border-y border-black p-2">:</td>
              <td className="border border-black p-2 border-l-0 font-bold">{tenant?.npwp || '-'}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 border-r-0">Nama</td>
              <td className="border-y border-black p-2">:</td>
              <td className="border border-black p-2 border-l-0 font-bold">{tenant?.nama_perusahaan || '-'}</td>
            </tr>
            <tr>
              <td className="border border-black p-2 border-r-0">Alamat</td>
              <td className="border-y border-black p-2">:</td>
              <td className="border border-black p-2 border-l-0 font-bold">{tenant?.alamat || '-'}</td>
            </tr>
            <tr>
              <td colSpan={3} className="border border-black p-0">
                 <div className="flex">
                   <div className="w-1/2 p-4">
                      <table className="w-full text-xs">
                        <tbody>
                          <tr>
                            <td className="w-28 py-1">Status Pembayaran</td>
                            <td className="w-2 py-1">:</td>
                            <td className="font-bold py-1">
                              {invoice.status === 'Paid' ? 'LUNAS' : invoice.status === 'Overdue' ? 'Overdue (Menunggak)' : invoice.status === 'Cancelled' ? 'DIBATALKAN' : 'Belum Lunas'}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1">Tgl Pembayaran</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{invoice.payment_date ? dayjs(invoice.payment_date).format('DD-MM-YYYY') : '-'}</td>
                          </tr>
                          <tr>
                            <td className="py-1">{isDenda ? 'Denda' : 'Pokok'}</td>
                            <td className="py-1">:</td>
                            <td className="py-1">{baseAmount.toLocaleString('id-ID')}</td>
                          </tr>
                          {!isDenda && (
                            <tr>
                              <td className="py-1">Denda</td>
                              <td className="py-1">:</td>
                              <td className="py-1 font-bold" style={{ color: '#dc2626' }}>{penaltyAmount.toLocaleString('id-ID')}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="py-1">Jumlah Total</td>
                            <td className="py-1">:</td>
                            <td className="font-bold text-base py-1">{totalAmount.toLocaleString('id-ID')}</td>
                          </tr>
                        </tbody>
                      </table>
                   </div>
                   <div className="w-1/2 p-4 text-center text-xs flex flex-col justify-between items-center relative">
                      <div className="text-right w-full" style={{ color: '#6b7280' }}>
                         Timika, .............................. {dayjs().format('YYYY')}
                      </div>
                      <div className="mb-16 mt-4 font-bold">Yang Menerima</div>
                      <div className="w-3/4 border-b border-dashed border-black"></div>
                   </div>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

SuratSKRD.displayName = 'SuratSKRD';
export default SuratSKRD;
