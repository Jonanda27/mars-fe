import React, { forwardRef } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export interface StrdRowItem {
  year: string | number;
  retribusi_terhutang: number;
  sanksi_denda: number;
  jumlah_terhutang: number;
}

export interface StrdPaymentRecord {
  payment_date: string;
  reference_no?: string;
  amount: number;
  description?: string;
}

export interface StrdData {
  strd_number: string;
  retribution_type: string;
  // Identitas Wajib Retribusi
  tenant_name: string;
  phone_fax_email: string;
  address: string;
  npwdr: string;
  // Tabel Rincian Piutang (Ketetapan Awal)
  items: StrdRowItem[];
  // Catatan Mutasi Pembayaran & Saldo Sisa Piutang (Kartu Kendali Pembayaran)
  payments?: StrdPaymentRecord[];
  total_paid?: number;
  remaining_balance?: number;
  // Penerima & Pejabat Pengesahan
  city: string;
  issue_date: string;
  official_title: string;
  official_name: string;
  official_nip: string;
  bank_name: string;
}

export const defaultStrdDummy: StrdData = {
  strd_number: 'STRD/2026/10/001',
  retribution_type: 'Pemanfaatan Barang Milik Daerah (Sewa Hanggar & Apron)',
  tenant_name: 'PT SMART CAKRAWALA AVIATION',
  phone_fax_email: '(0901) 321778 / info@smartaviation.co.id',
  address: 'Hanggar Sisi Timur, Bandara Mozes Kilangin, Timika',
  npwdr: '91.823.412.5-953.000',
  items: [
    { year: '2026', retribusi_terhutang: 35000000, sanksi_denda: 700000, jumlah_terhutang: 35700000 },
    { year: '2025', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
    { year: '2024', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
    { year: '2023', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 },
    { year: '2022', retribusi_terhutang: 0, sanksi_denda: 0, jumlah_terhutang: 0 }
  ],
  payments: [
    {
      payment_date: '2026-10-05',
      reference_no: 'SSRD/MMK/2026/10/019',
      amount: 20000000,
      description: 'Setoran Sebagian Kasda (SSRD Ke-1)'
    }
  ],
  total_paid: 20000000,
  remaining_balance: 15700000,
  city: 'Timika',
  issue_date: dayjs().format('YYYY-MM-DD'),
  official_title: 'Kepala Dinas Perhubungan',
  official_name: 'JANIA BASIK-BASIK, S.Sos., M.Si.',
  official_nip: '19740510 200212 1 008',
  bank_name: 'Bank Papua Cabang Timika'
};

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
};

const toTerbilang = (angka: number): string => {
  if (angka <= 0) return 'Nol Rupiah';
  return (terbilang(angka).trim().replace(/\s+/g, ' ') + ' Rupiah').replace('  ', ' ');
};

interface SuratSTRDProps {
  readonly data?: StrdData;
}

export const SuratSTRD = forwardRef<HTMLDivElement, SuratSTRDProps>(({ data = defaultStrdDummy }, ref) => {
  const d = data;

  // Hitung total ketetapan awal dari seluruh baris
  const totalRetribusiTerhutang = d.items.reduce((acc, curr) => acc + (Number(curr.retribusi_terhutang) || 0), 0);
  const totalSanksiDenda = d.items.reduce((acc, curr) => acc + (Number(curr.sanksi_denda) || 0), 0);
  const grandTotal = d.items.reduce((acc, curr) => acc + (Number(curr.jumlah_terhutang) || 0), 0);

  // Perhitungan mutasi setoran dan saldo sisa piutang
  const paymentsList = d.payments || [];
  const totalPaid = d.total_paid !== undefined 
    ? Number(d.total_paid) 
    : paymentsList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const remainingBalance = d.remaining_balance !== undefined 
    ? Number(d.remaining_balance) 
    : Math.max(0, grandTotal - totalPaid);
  const hasPayments = totalPaid > 0 || paymentsList.length > 0;

  const tglTerbitFormatted = dayjs(d.issue_date).format('DD MMMM YYYY');

  return (
    <div
      ref={ref}
      id="strd-document-root"
      className="bg-white text-black print:p-0 mx-auto select-text"
      style={{
        fontFamily: '"Times New Roman", Times, serif',
        color: '#000000',
        backgroundColor: '#ffffff',
        width: '210mm',
        height: '296mm',
        maxHeight: '296mm',
        boxSizing: 'border-box',
        padding: '7mm 12mm',
        fontSize: '9pt',
        lineHeight: 1.25,
        overflow: 'hidden',
        pageBreakAfter: 'avoid',
        pageBreakBefore: 'avoid',
        pageBreakInside: 'avoid',
        breakInside: 'avoid'
      }}
    >
      {/* GLOBAL PRINT STYLE SO IT NEVER EXCEEDS 1 PAGE A4 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: A4 portrait;
          margin: 0 !important;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #strd-document-root {
            width: 210mm !important;
            height: 296mm !important;
            max-height: 296mm !important;
            padding: 7mm 12mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            border: none !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}} />

      {/* JUDUL LAMPIRAN RESMI DI ATAS FORMULIR */}
      <div className="font-bold text-[10.5pt] mb-1.5 tracking-tight">
        Format Surat Tagihan Retribusi Daerah (STRD).
      </div>

      {/* ======================================================== */}
      {/* KOTAK TABEL FORMULIR UTAMA STRD (PERSIS DOKUMEN PERBUP)  */}
      {/* ======================================================== */}
      <table 
        className="w-full border-collapse"
        style={{ 
          border: '1.5px solid #000000', 
          backgroundColor: '#ffffff',
          color: '#000000'
        }}
      >
        <tbody>
          
          {/* ---------------------------------------------------- */}
          {/* BARIS 1: KOP DINAS (KIRI) & JUDUL STRD (KANAN)       */}
          {/* ---------------------------------------------------- */}
          <tr>
            {/* Kiri: Kop Dinas */}
            <td 
              className="p-2.5 align-middle"
              style={{ width: '65%', border: '1px solid #000000' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-16 flex-shrink-0 flex items-center justify-center">
                  <img 
                    src="/images/logo dishub .png" 
                    alt="Logo Dishub Mimika" 
                    className="w-14 h-auto object-contain"
                  />
                </div>
                <div className="flex-1 text-center pr-3">
                  <h3 className="font-bold text-[10.5pt] uppercase tracking-wide leading-tight" style={{ margin: 0 }}>
                    PEMERINTAH KABUPATEN MIMIKA
                  </h3>
                  <h2 className="font-bold text-[12pt] uppercase tracking-wide leading-tight" style={{ margin: '1px 0' }}>
                    DINAS PERHUBUNGAN
                  </h2>
                  <div style={{ borderBottom: '2.5px double #000000', margin: '3px 0' }}></div>
                  <p className="text-[8pt] text-slate-800 leading-tight" style={{ margin: 0 }}>
                    Jln. Bandara Mozes Kilangin, Timika<br />
                    Kabupaten Mimika Tlp. (0901) 321123
                  </p>
                </div>
              </div>
            </td>

            {/* Kanan: Judul Dokumen & Jenis Retribusi */}
            <td 
              className="p-2 text-center align-middle"
              style={{ width: '35%', border: '1px solid #000000' }}
            >
              <div className="font-bold text-[10pt] uppercase leading-tight">
                SURAT TAGIHAN RETRIBUSI DAERAH
              </div>
              <div className="font-bold text-[10.5pt] my-0.5">
                ( STRD )
              </div>
              <div className="text-[8.5pt] mt-1 text-slate-800">
                Retribusi : <span className="font-medium">{d.retribution_type}</span>
              </div>
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 2: IDENTITAS WAJIB RETRIBUSI & NOMOR STRD      */}
          {/* ---------------------------------------------------- */}
          <tr>
            {/* Kiri: Data Wajib Retribusi */}
            <td 
              className="p-2.5 align-top"
              style={{ border: '1px solid #000000' }}
            >
              <table className="w-full border-collapse text-[9.5pt]">
                <tbody>
                  <tr>
                    <td className="w-40 py-0.5">Nama Wajib Retribusi</td>
                    <td className="w-4 py-0.5">:</td>
                    <td className="py-0.5 font-bold">{d.tenant_name}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">Telp./ Fax/ Email</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5">{d.phone_fax_email}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 align-top">A l a m a t</td>
                    <td className="py-0.5 align-top">:</td>
                    <td className="py-0.5 leading-snug">{d.address}</td>
                  </tr>
                  <tr>
                    <td className="py-0.5">NPWRD</td>
                    <td className="py-0.5">:</td>
                    <td className="py-0.5 font-mono font-medium">{d.npwdr}</td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Kanan: Nomor STRD */}
            <td 
              className="p-2.5 align-top font-medium text-[9.5pt]"
              style={{ border: '1px solid #000000' }}
            >
              Nomor : <span className="font-mono font-bold">{d.strd_number}</span>
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 3: DASAR PELAKSANAAN PENAGIHAN                 */}
          {/* ---------------------------------------------------- */}
          <tr>
            <td 
              colSpan={2} 
              className="p-2.5 text-[9.5pt] leading-relaxed"
              style={{ border: '1px solid #000000' }}
            >
              <div>Dasar Pelaksanaan Penagihan Retribusi Daerah Terhutang antara lain adalah :</div>
              <ol className="list-decimal pl-5 mt-1 space-y-0.5">
                <li>Peraturan Pemerintah Nomor 35 Tahun 2023 tentang Ketentuan Umum Pajak Daerah dan Retribusi Daerah.</li>
                <li>Peraturan Daerah Kabupaten Mimika Nomor 4 Tahun 2023 tentang Pajak Daerah dan Retribusi Daerah.</li>
              </ol>
              <div className="mt-1">Rincian retribusi terhutang adalah sebagai berikut :</div>
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 4: TABEL RINCIAN TAHUN, POKOK, SANKSI & TOTAL  */}
          {/* ---------------------------------------------------- */}
          <tr>
            <td colSpan={2} className="p-0" style={{ border: '1px solid #000000' }}>
              <table className="w-full border-collapse text-[9.5pt]">
                <thead>
                  <tr className="font-bold text-center">
                    <th className="p-1.5" style={{ width: '38%', borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Tahun
                    </th>
                    <th className="p-1.5" style={{ width: '22%', borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Retribusi Terhutang<br/>(Rp)
                    </th>
                    <th className="p-1.5" style={{ width: '18%', borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Sanksi/ Denda<br/>(Rp)
                    </th>
                    <th className="p-1.5" style={{ width: '22%', borderBottom: '1px solid #000000' }}>
                      Jumlah<br/>Retribusi Terhutang<br/>(Rp)
                    </th>
                  </tr>
                  <tr className="italic text-center text-[8.5pt]">
                    <th className="py-0.5" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>1</th>
                    <th className="py-0.5" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>2</th>
                    <th className="py-0.5" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>3</th>
                    <th className="py-0.5" style={{ borderBottom: '1px solid #000000' }}>2 + 3 = 4</th>
                  </tr>
                </thead>
                <tbody>
                  {d.items.map((row, idx) => {
                    const isZero = Number(row.jumlah_terhutang) === 0;
                    return (
                      <tr key={idx}>
                        <td className="text-center p-1" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                          {row.year}
                        </td>
                        <td className="text-right p-1 font-mono pr-3" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                          {isZero ? '-' : Number(row.retribusi_terhutang).toLocaleString('id-ID')}
                        </td>
                        <td className="text-right p-1 font-mono pr-3" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                          {isZero ? '-' : Number(row.sanksi_denda).toLocaleString('id-ID')}
                        </td>
                        <td className="text-right p-1 font-mono pr-3 font-semibold" style={{ borderBottom: '1px solid #000000' }}>
                          {isZero ? '-' : Number(row.jumlah_terhutang).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Baris Total Retribusi Terhutang Yang Harus Dibayar */}
                  <tr className="font-bold">
                    <td className="p-1.5 italic" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      Total Retribusi Terhutang Yang Harus Dibayar ...
                    </td>
                    <td className="p-1.5 text-right font-mono pr-3" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      {totalRetribusiTerhutang > 0 ? totalRetribusiTerhutang.toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="p-1.5 text-right font-mono pr-3" style={{ borderRight: '1px solid #000000', borderBottom: '1px solid #000000' }}>
                      {totalSanksiDenda > 0 ? totalSanksiDenda.toLocaleString('id-ID') : '-'}
                    </td>
                    <td className="p-1.5 text-right font-mono pr-3 text-[10.5pt]" style={{ borderBottom: '1px solid #000000' }}>
                      {grandTotal > 0 ? grandTotal.toLocaleString('id-ID') : '-'}
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={4} className="p-1.5" style={{ borderBottom: '1px solid #000000' }}>
                      <span className="font-medium">Dengan Huruf :</span> ( <span className="italic font-bold">{toTerbilang(grandTotal)}</span> )
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 4b: CATATAN MUTASI PEMBAYARAN & SISA PIUTANG   */}
          {/* (KARTU KENDALI PEMBAYARAN SESUAI STANDAR PERBUP)     */}
          {/* ---------------------------------------------------- */}
          {hasPayments && (
            <tr>
              <td colSpan={2} className="p-0" style={{ border: '1px solid #000000' }}>
                <div 
                  className="px-2 py-1 border-b border-black flex items-center justify-between"
                  style={{ backgroundColor: '#f1f5f9' }}
                >
                  <div className="font-bold text-[8.5pt] uppercase tracking-wide">
                    Catatan Mutasi Pembayaran & Saldo Sisa Piutang Retribusi (Kartu Kendali)
                  </div>
                  <div className="text-[7.5pt] font-mono text-slate-700 italic">
                    {remainingBalance <= 0 ? '[ Lunas Penuh ]' : '[ Status: Pembayaran Sebagian / Kurang Bayar ]'}
                  </div>
                </div>
                
                <table className="w-full border-collapse text-[8.5pt]">
                  <thead>
                    <tr className="font-bold text-center border-b border-black" style={{ backgroundColor: '#f8fafc' }}>
                      <th className="py-1 px-1.5" style={{ width: '6%', borderRight: '1px solid #000000' }}>No</th>
                      <th className="py-1 px-2" style={{ width: '18%', borderRight: '1px solid #000000' }}>Tgl. Setor</th>
                      <th className="py-1 px-2" style={{ width: '28%', borderRight: '1px solid #000000' }}>Bukti Setor / SSRD / NTPN</th>
                      <th className="py-1 px-2" style={{ width: '26%', borderRight: '1px solid #000000' }}>Keterangan Mutasi</th>
                      <th className="py-1 px-2 text-right pr-3" style={{ width: '22%' }}>Jumlah Setor (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsList.map((pay, idx) => (
                      <tr key={idx} className="border-b border-black">
                        <td className="text-center py-0.5 px-1 font-mono" style={{ borderRight: '1px solid #000000' }}>
                          {idx + 1}.
                        </td>
                        <td className="text-center py-0.5 px-2 font-mono" style={{ borderRight: '1px solid #000000' }}>
                          {dayjs(pay.payment_date).format('DD/MM/YYYY')}
                        </td>
                        <td className="py-0.5 px-2 font-mono text-[8pt]" style={{ borderRight: '1px solid #000000' }}>
                          {pay.reference_no || '-'}
                        </td>
                        <td className="py-0.5 px-2">
                          {pay.description || `Setoran ${idx === 0 ? 'Sebagian Ke-1' : `Ke-${idx + 1}`}`}
                        </td>
                        <td className="py-0.5 px-2 text-right font-mono pr-3">
                          {Number(pay.amount).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}

                    {/* Baris Total Setoran Telah Diterima */}
                    <tr className="font-bold border-b border-black" style={{ backgroundColor: '#f8fafc' }}>
                      <td colSpan={4} className="py-1 px-2 text-right italic" style={{ borderRight: '1px solid #000000' }}>
                        Total Setoran Telah Diterima Kas Daerah ...
                      </td>
                      <td className="py-1 px-2 text-right font-mono pr-3 text-emerald-800">
                        {totalPaid.toLocaleString('id-ID')}
                      </td>
                    </tr>

                    {/* Baris Sisa Piutang Kurang Bayar */}
                    <tr className="font-bold border-b border-black" style={{ backgroundColor: '#fffbeb' }}>
                      <td colSpan={4} className="py-1 px-2 text-right text-amber-950 uppercase" style={{ borderRight: '1px solid #000000' }}>
                        Sisa Retribusi Terutang Kurang Dibayar (Saldo Piutang STRD) ...
                      </td>
                      <td className="py-1 px-2 text-right font-mono pr-3 text-amber-900 text-[9pt]">
                        {remainingBalance.toLocaleString('id-ID')}
                      </td>
                    </tr>

                    {/* Baris Dengan Huruf Sisa */}
                    <tr>
                      <td colSpan={5} className="p-1.5 text-[8pt] italic bg-white">
                        <span className="font-semibold not-italic">Dengan Huruf (Sisa Kewajiban):</span> ( <span className="font-bold text-slate-900">{toTerbilang(remainingBalance)}</span> )
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )}

          {/* ---------------------------------------------------- */}
          {/* BARIS 5: PERHATIAN                                   */}
          {/* ---------------------------------------------------- */}
          <tr>
            <td colSpan={2} className="p-2 text-[8.5pt] leading-snug" style={{ border: '1px solid #000000' }}>
              <div className="font-bold underline mb-0.5">PERHATIAN :</div>
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="align-top w-5">1.</td>
                    <td>
                      Harap penyetoran dilakukan ke Kas Daerah Kabupaten Mimika ({d.bank_name}) melalui BKP, paling lambat <strong>7 (tujuh) hari kerja</strong> sejak menerima Surat Tagihan Retribusi Daerah (STRD) ini.
                    </td>
                  </tr>
                  <tr>
                    <td className="align-top">2.</td>
                    <td>
                      Surat Tagihan Retribusi Daerah (STRD) ini dapat diabaikan apabila seluruh Retribusi Daerah Terhutang tersebut telah dibayar lunas ke Kas Daerah.
                    </td>
                  </tr>
                  {hasPayments && remainingBalance > 0 && (
                    <tr>
                      <td className="align-top">3.</td>
                      <td>
                        Berdasarkan Catatan Mutasi Pembayaran di atas, sisa retribusi terutang kurang dibayar sebesar <strong>Rp {remainingBalance.toLocaleString('id-ID')}</strong> wajib segera dilunasi. Sanksi administrasi bunga 1% per bulan tetap diperhitungkan atas sisa pokok terutang sesuai Pasal 21 Perbup No. 25 Tahun 2024.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 6: TANDA TERIMA PENYERAHAN & TTD KEPALA DINAS  */}
          {/* ---------------------------------------------------- */}
          <tr>
            {/* Kiri: Yang Menerima */}
            <td 
              className="p-2.5 align-top flex flex-col justify-between"
              style={{ width: '50%', borderRight: '1px solid #000000', minHeight: '110px' }}
            >
              <div>
                <div className="text-[8.5pt]">
                  ............................ Tanggal, ............................
                </div>
                <div className="mt-1 text-[9pt]">
                  Yang Menerima,
                </div>
              </div>

              <div className="pt-10">
                <div className="border-b border-black w-44"></div>
              </div>
            </td>

            {/* Kanan: Kepala Dinas Perhubungan Kabupaten Mimika */}
            <td 
              className="p-2.5 text-center align-top"
              style={{ width: '50%', minHeight: '110px' }}
            >
              <div className="text-[9pt]">
                {d.city}, {tglTerbitFormatted}
              </div>
              <div className="font-bold text-[9pt] mt-0.5">
                {d.official_title}<br />
                Kabupaten Mimika,
              </div>

              <div className="pt-10">
                <div className="font-bold underline text-[9pt] inline-block tracking-wide">
                  {d.official_name}
                </div>
                <div className="text-[8.5pt] mt-0.5">
                  NIP. {d.official_nip}
                </div>
              </div>
            </td>
          </tr>

        </tbody>
      </table>

    </div>
  );
});

SuratSTRD.displayName = 'SuratSTRD';
