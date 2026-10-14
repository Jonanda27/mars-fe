import React, { forwardRef, useMemo } from 'react';
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
};

const toTerbilang = (angka: number) => {
  if (angka === 0) return 'Nol Rupiah';
  return (terbilang(angka).trim().replace(/\s+/g, ' ') + ' Rupiah').replace('  ', ' ');
};

interface SuratSKRDPerdaProps {
  readonly invoice: Invoice;
  readonly showLegalCertification?: boolean;
}

export const SuratSKRDPerda = forwardRef<HTMLDivElement, SuratSKRDPerdaProps>(({ 
  invoice,
  showLegalCertification = true
}, ref) => {
  const contract = invoice.contracts;
  const tenant = contract?.tenants || invoice.tenants;

  const baseAmount = Number(invoice.amount || 0);
  const penaltyAmount = Number(invoice.penalty_amount || 0);
  const totalAmount = baseAmount + penaltyAmount;

  // Safe parsing details
  const detailsObj = useMemo(() => {
    if (!invoice?.details) return {};
    if (typeof invoice.details === 'string') {
      try { return JSON.parse(invoice.details); } catch (e) { return {}; }
    }
    return typeof invoice.details === 'object' ? (invoice.details as any) : {};
  }, [invoice?.details]);

  const isDenda = Boolean(
    invoice.invoice_type === 'SKRD Denda' ||
    invoice.invoice_number?.includes('DND')
  );

  const getMasaRetribusi = () => {
    if (isDenda) {
      return `${detailsObj?.overdue_days || 0} Hari (${detailsObj?.months_overdue || 1} Bulan)`;
    }
    if (Array.isArray(invoice.details) && invoice.details.length > 0) {
      const dates = invoice.details
        .map((d: any) => ({ entry: d.entry_time, exit: d.exit_time }))
        .filter((d: any) => Boolean(d.entry));
      if (dates.length > 0) {
        const earliest = dates.reduce((min: string, p: any) => new Date(p.entry) < new Date(min) ? p.entry : min, dates[0].entry);
        const latest = dates.reduce((max: string, p: any) => (p.exit && new Date(p.exit) > new Date(max)) ? p.exit : max, dates[0].exit || dates[0].entry);
        return `${dayjs(earliest).format('DD MMMM YYYY')} s/d ${dayjs(latest).format('DD MMMM YYYY')}`;
      }
    }
    if (contract?.start_date && contract?.end_date) {
      return `${dayjs(contract.start_date).format('DD MMMM YYYY')} s/d ${dayjs(contract.end_date).format('DD MMMM YYYY')}`;
    }
    return dayjs(invoice.created_at).format('MMMM YYYY');
  };

  const jenisRetribusiTitle = useMemo(() => {
    if (isDenda) return 'Sanksi Bunga Retribusi Keterlambatan';
    if (invoice.invoice_type) return invoice.invoice_type;
    if (contract?.jenis_pemanfaatan) return `Sewa ${contract.jenis_pemanfaatan}`;
    return 'Pemanfaatan Barang Milik Daerah';
  }, [invoice.invoice_type, contract?.jenis_pemanfaatan, isDenda]);

  const tahunKetetapan = dayjs(invoice.created_at || new Date()).format('YYYY');
  const tglJatuhTempo = invoice.due_date 
    ? dayjs(invoice.due_date).format('DD MMMM YYYY')
    : dayjs(invoice.created_at).add(30, 'day').format('DD MMMM YYYY');
  const tglCetak = dayjs(invoice.created_at || new Date()).format('DD MMMM YYYY');

  return (
    <div 
      ref={ref} 
      className="p-8 shadow-lg mb-8 mx-auto bg-white text-black select-text"
      style={{ 
        width: '210mm', 
        minHeight: '297mm', 
        boxSizing: 'border-box',
        fontFamily: '"Times New Roman", Times, serif',
        color: '#000000',
        lineHeight: 1.25
      }}
    >
      {/* JUDUL RESMI DI ATAS FORM */}
      <div className="font-bold text-[12pt] mb-2 tracking-tight">
        Format Surat Ketetapan Retribusi Daerah ( SKRD )
      </div>

      {/* KOTAK UTAMA DOKUMEN BERGARIS FORMAL */}
      <div className="border-[1.5px] border-black text-black">
        
        {/* ======================================================== */}
        {/* ROW 1: KOP BADAN PENDAPATAN DAERAH & JUDUL SKRD          */}
        {/* ======================================================== */}
        <div className="grid grid-cols-12 border-b-[1.5px] border-black">
          {/* Logo Mimika (Kolom Kiri) */}
          <div className="col-span-2 border-r-[1.5px] border-black p-2 flex items-center justify-center">
            <img 
              src="/images/logo_mimika.png" 
              alt="Logo Kabupaten Mimika" 
              className="w-16 h-auto object-contain"
            />
          </div>

          {/* Nama Instansi Bapenda (Kolom Tengah) */}
          <div className="col-span-6 border-r-[1.5px] border-black p-3 text-center flex flex-col justify-center">
            <h3 className="font-bold text-[10.5pt] uppercase tracking-wide leading-tight m-0">
              PEMERINTAH KABUPATEN MIMIKA
            </h3>
            <h2 className="font-bold text-[11pt] uppercase tracking-wide leading-tight my-1">
              BADAN PENDAPATAN DAERAH
            </h2>
            <p className="text-[8.5pt] m-0 text-black leading-tight italic">
              Jl. Cenderawasih SP 2, Timika - Papua Tengah
            </p>
          </div>

          {/* Judul Surat Ketetapan Retribusi Daerah (Kolom Kanan) */}
          <div className="col-span-4 p-2.5 text-center flex flex-col justify-center bg-white">
            <div className="font-bold text-[9pt] uppercase leading-snug tracking-wide">
              SURAT KETETAPAN<br />
              RETRIBUSI DAERAH<br />
              ( SKRD )
            </div>
            <div className="text-[8.5pt] mt-1 font-bold">
              Retribusi
            </div>
            <div className="text-[8pt] border-b border-dotted border-black inline-block px-1 mx-auto max-w-[170px] truncate font-medium">
              {jenisRetribusiTitle}
            </div>
            <div className="text-[8.5pt] mt-0.5">
              Tahun <span className="font-bold font-mono">{tahunKetetapan}</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ROW 2: IDENTITAS WAJIB RETRIBUSI & NO. URUT               */}
        {/* ======================================================== */}
        <div className="grid grid-cols-12 border-b-[1.5px] border-black text-[9pt]">
          {/* Kiri: Data Wajib Retribusi */}
          <div className="col-span-8 border-r-[1.5px] border-black p-2.5 space-y-1">
            <div className="flex">
              <span className="w-36 flex-shrink-0 font-medium">Nama Wajib Retribusi</span>
              <span className="w-3 text-center">:</span>
              <span className="font-bold uppercase truncate">{tenant?.nama_perusahaan || '-'}</span>
            </div>
            <div className="flex">
              <span className="w-36 flex-shrink-0 font-medium">A l a m a t</span>
              <span className="w-3 text-center">:</span>
              <span className="text-black truncate">{tenant?.alamat || 'Bandara Mozes Kilangin, Timika'}</span>
            </div>
            <div className="flex">
              <span className="w-36 flex-shrink-0 font-medium">NPWDR</span>
              <span className="w-3 text-center">:</span>
              <span className="font-mono text-black font-semibold">{tenant?.npwp || '94.04.1.2024.0001'}</span>
            </div>
            <div className="flex">
              <span className="w-36 flex-shrink-0 font-medium">Masa Retribusi</span>
              <span className="w-3 text-center">:</span>
              <span className="text-black">{getMasaRetribusi()}</span>
            </div>
            <div className="flex">
              <span className="w-36 flex-shrink-0 font-medium">Jatuh Tempo</span>
              <span className="w-3 text-center">:</span>
              <span className="font-bold text-black">{tglJatuhTempo}</span>
            </div>
          </div>

          {/* Kanan: Nomor Urut SKRD */}
          <div className="col-span-4 p-2.5 flex items-center justify-start pl-4 bg-white">
            <div className="text-[9pt]">
              <span className="font-medium">No. Urut</span>
              <span className="mx-1">:</span>
              <span className="font-mono font-bold text-[9.5pt] ml-1">{invoice.invoice_number}</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ROW 3: KONSIDERAN / DASAR HUKUM                           */}
        {/* ======================================================== */}
        <div className="p-2 border-b-[1.5px] border-black text-[8.5pt] leading-normal text-justify">
          Berdasarkan Undang-Undang Negara Republik Indonesia Nomor 1 Tahun 2022 tentang Pajak Daerah dan Retribusi Daerah, Peraturan Daerah Kabupaten Mimika Nomor 4 Tahun 2023 tentang Pajak Daerah dan Retribusi Daerah.
        </div>

        {/* ======================================================== */}
        {/* ROW 4: TABEL RINCIAN POKOK KETETAPAN RETRIBUSI            */}
        {/* ======================================================== */}
        <div className="border-b-[1.5px] border-black">
          <table className="w-full border-collapse text-[9pt]">
            <thead>
              <tr className="border-b-[1.5px] border-black text-center font-bold">
                <th className="p-2 border-r-[1.5px] border-black w-[50%] align-middle font-bold text-[9pt]">
                  JENIS RETRIBUSI
                </th>
                <th className="p-2 border-r-[1.5px] border-black w-[25%] align-middle font-bold text-[8.5pt] leading-tight">
                  POKOK KETETAPAN<br />
                  RETRIBUSI PERBULAN<br />
                  (Rp.)
                </th>
                <th className="p-2 w-[25%] align-middle font-bold text-[8.5pt] leading-tight">
                  RETRIBUSI<br />
                  YANG<br />
                  HARUS<br />
                  DIBAYAR (Rp.)
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Item 1: Pokok Retribusi */}
              <tr className="border-b border-black/40">
                <td className="p-2 border-r-[1.5px] border-black align-top font-medium">
                  1. Retribusi {jenisRetribusiTitle}
                  {contract?.assets?.nama_aset && (
                    <div className="text-[8pt] text-slate-700 italic pl-3">
                      Objek: {contract.assets.nama_aset} ({contract.assets.kode_aset || 'Kawasan Mozes Kilangin'})
                    </div>
                  )}
                </td>
                <td className="p-2 border-r-[1.5px] border-black text-right font-mono align-top">
                  {formatRupiah(baseAmount).replace('Rp', '').trim()}
                </td>
                <td className="p-2 text-right font-mono align-top font-semibold">
                  {formatRupiah(baseAmount).replace('Rp', '').trim()}
                </td>
              </tr>

              {/* Item 2: Sanksi Bunga Administrasi STRD (Jika Ada) */}
              {penaltyAmount > 0 ? (
                <tr className="border-b border-black/40">
                  <td className="p-2 border-r-[1.5px] border-black align-top font-medium">
                    2. Sanksi Bunga Administrasi Keterlambatan (STRD 1%/Bulan)
                  </td>
                  <td className="p-2 border-r-[1.5px] border-black text-right font-mono align-top">
                    {formatRupiah(penaltyAmount).replace('Rp', '').trim()}
                  </td>
                  <td className="p-2 text-right font-mono align-top font-semibold">
                    {formatRupiah(penaltyAmount).replace('Rp', '').trim()}
                  </td>
                </tr>
              ) : (
                <tr className="border-b border-black/40">
                  <td className="p-2 border-r-[1.5px] border-black align-top text-slate-500 italic">
                    2. Retribusi .....................................................
                  </td>
                  <td className="p-2 border-r-[1.5px] border-black text-right font-mono text-slate-400">
                    -
                  </td>
                  <td className="p-2 text-right font-mono text-slate-400">
                    -
                  </td>
                </tr>
              )}

              {/* Baris Total / Jumlah Retribusi yang harus dibayar */}
              <tr className="font-bold border-t-[1.5px] border-black">
                <td className="p-2 border-r-[1.5px] border-black italic font-medium">
                  Jumlah Retribusi yang harus dibayar ...
                </td>
                <td className="p-2 border-r-[1.5px] border-black text-right font-mono font-bold">
                  {formatRupiah(totalAmount).replace('Rp', '').trim()}
                </td>
                <td className="p-2 text-right font-mono font-bold text-[9.5pt]">
                  {formatRupiah(totalAmount).replace('Rp', '').trim()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ======================================================== */}
        {/* ROW 5: DENGAN HURUF (TERBILANG)                           */}
        {/* ======================================================== */}
        <div className="p-2 border-b-[1.5px] border-black text-[9pt]">
          <span className="font-bold italic">Dengan Huruf : </span>
          <span className="italic font-medium">(&nbsp;{toTerbilang(totalAmount)}&nbsp;)</span>
        </div>

        {/* ======================================================== */}
        {/* ROW 6: KOTAK PERHATIAN KETENTUAN PENYETORAN               */}
        {/* ======================================================== */}
        <div className="p-2.5 border-b-[1.5px] border-black text-[8.5pt] leading-normal">
          <div className="font-bold underline mb-1">PERHATIAN :</div>
          <div className="space-y-1 pl-1">
            <div className="flex items-start">
              <span className="w-4 font-bold flex-shrink-0">1.</span>
              <p className="m-0 text-justify">
                Harap penyetoran dilakukan melalui Kas Daerah (Bank Papua) BKP dan/atau Juru Pungut Retribusi Pelayanan Pasar / Jasa Usaha Kabupaten Mimika dengan menggunakan Surat Setoran Retribusi Daerah ( SSRD ).
              </p>
            </div>
            <div className="flex items-start">
              <span className="w-4 font-bold flex-shrink-0">2.</span>
              <p className="m-0 text-justify">
                Apabila SKRD ini tidak atau kurang dibayar setelah tanggal jatuh tempo, dikenakan sanksi administrasi berupa bunga 2 % perbulan.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ROW 7: KOLOM TANDA TANGAN (YANG MENERIMA & KEPALA DINAS)  */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 text-[9pt]">
          {/* Sisi Kiri: Wajib Retribusi / Yang Menerima */}
          <div className="border-r-[1.5px] border-black p-3 flex flex-col justify-between min-h-[140px]">
            <div className="text-center">
              <div>Yang Menerima,</div>
            </div>
            <div className="mt-14">
              <div className="border-b border-black w-48 mx-auto"></div>
              <div className="text-[8.5pt] mt-1 pl-4">Tanggal, ....................................</div>
            </div>
          </div>

          {/* Sisi Kanan: Pejabat Pengesah / Kepala Bapenda Mimika */}
          <div className="p-3 text-center flex flex-col justify-between min-h-[140px]">
            <div>
              <div>Timika, {tglCetak}</div>
              <div className="font-bold">Kepala Badan Pendapatan Daerah</div>
              <div className="font-bold">Kabupaten Mimika,</div>
            </div>
            <div className="mt-12">
              <div className="border-b border-black w-56 mx-auto"></div>
              <div className="text-[8.5pt] mt-1">NIP. ....................................................</div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BAGIAN BAWAH: LEGALISASI SALINAN PERDA KABUPATEN MIMIKA   */}
      {/* ======================================================== */}
      {showLegalCertification && (
        <div className="mt-4 pt-2 flex items-start justify-between text-[9pt] leading-tight">
          {/* Kiri: Stempel Bagian Hukum & Tanda Tangan Pembina */}
          <div className="flex items-center gap-2">
            <img 
              src="/images/stempel_bagian_hukum.png" 
              alt="Salinan Sesuai Dengan Aslinya - Kepala Bagian Hukum Setda Mimika" 
              className="w-48 h-auto object-contain"
            />
          </div>

          {/* Kanan: Plt. Bupati Mimika */}
          <div className="text-center pr-8 pt-2">
            <div className="font-bold tracking-wide">Plt. BUPATI MIMIKA,</div>
            <div className="my-3 text-[8.5pt]">TTD</div>
            <div className="font-bold tracking-wider">JOHANNES RETTOB</div>
          </div>
        </div>
      )}
    </div>
  );
});

SuratSKRDPerda.displayName = 'SuratSKRDPerda';
export default SuratSKRDPerda;
