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

export interface StrdData {
  strd_number: string;
  retribution_type: string;
  // Identitas Wajib Retribusi
  tenant_name: string;
  phone_fax_email: string;
  address: string;
  npwdr: string;
  // Tabel Rincian Piutang
  items: StrdRowItem[];
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
  data?: StrdData;
}

export const SuratSTRD = forwardRef<HTMLDivElement, SuratSTRDProps>(({ data = defaultStrdDummy }, ref) => {
  const d = data;

  // Hitung total dari seluruh baris
  const totalRetribusiTerhutang = d.items.reduce((acc, curr) => acc + (Number(curr.retribusi_terhutang) || 0), 0);
  const totalSanksiDenda = d.items.reduce((acc, curr) => acc + (Number(curr.sanksi_denda) || 0), 0);
  const grandTotal = d.items.reduce((acc, curr) => acc + (Number(curr.jumlah_terhutang) || 0), 0);

  const tglTerbitFormatted = dayjs(d.issue_date).format('DD MMMM YYYY');

  return (
    <div
      ref={ref}
      id="strd-document-root"
      className="bg-white text-black print:p-0 mx-auto"
      style={{
        fontFamily: '"Times New Roman", Times, serif',
        color: '#000000',
        backgroundColor: '#ffffff',
        width: '794px', // Lebar A4 Standar (210mm)
        height: '1120px', // Pas tepat 1 halaman A4 (297mm)
        maxHeight: '1120px',
        boxSizing: 'border-box',
        padding: '22px 36px 16px 36px',
        fontSize: '9.5pt',
        lineHeight: 1.3,
        overflow: 'hidden'
      }}
    >
      {/* JUDUL LAMPIRAN RESMI DI ATAS FORMULIR */}
      <div className="font-bold text-[11pt] mb-2 tracking-tight">
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

                  {/* Baris Dengan Huruf */}
                  <tr>
                    <td colSpan={4} className="p-2" style={{ borderBottom: '1px solid #000000' }}>
                      <span className="font-medium">Dengan Huruf :</span> ( <span className="italic font-bold">{toTerbilang(grandTotal)}</span> )
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* ---------------------------------------------------- */}
          {/* BARIS 5: PERHATIAN                                   */}
          {/* ---------------------------------------------------- */}
          <tr>
            <td colSpan={2} className="p-2.5 text-[9pt] leading-relaxed" style={{ border: '1px solid #000000' }}>
              <div className="font-bold underline mb-1">PERHATIAN :</div>
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
                      Surat Tagihan Retribusi Daerah (STRD) ini bisa diabaikan apabila sejumlah Retribusi Daerah Terhutang tersebut di atas telah dibayar lunas.
                    </td>
                  </tr>
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
              className="p-3 align-top flex flex-col justify-between"
              style={{ width: '50%', borderRight: '1px solid #000000', minHeight: '135px' }}
            >
              <div>
                <div className="text-[9pt]">
                  ............................ Tanggal, ............................
                </div>
                <div className="mt-2 text-[9.5pt]">
                  Yang Menerima,
                </div>
              </div>

              <div className="pt-14">
                <div className="border-b border-black w-48"></div>
              </div>
            </td>

            {/* Kanan: Kepala Dinas Perhubungan Kabupaten Mimika */}
            <td 
              className="p-3 text-center align-top"
              style={{ width: '50%', minHeight: '135px' }}
            >
              <div className="text-[9.5pt]">
                {d.city}, {tglTerbitFormatted}
              </div>
              <div className="font-bold text-[9.5pt] mt-0.5">
                {d.official_title}<br />
                Kabupaten Mimika,
              </div>

              <div className="pt-12">
                <div className="font-bold underline text-[9.5pt] inline-block tracking-wide">
                  {d.official_name}
                </div>
                <div className="text-[9pt] mt-0.5">
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
