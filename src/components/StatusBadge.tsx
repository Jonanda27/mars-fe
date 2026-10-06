import React from 'react';

interface StatusBadgeProps {
  readonly status: string;
  readonly className?: string;
  readonly label?: string;
}

export const getStatusColorClass = (status: string): string => {
  const s = status?.trim().toLowerCase() || '';

  // 1. Ditolak / Rejected / Overdue / Menunggak / Expired / Problem / Lewat / Darurat / SP 2 / SP 3 / Danger (Merah AdminLTE)
  if (
    s.includes('tolak') || 
    s.includes('reject') || 
    s.includes('overdue') || 
    s.includes('menunggak') ||
    s.includes('expired') || 
    s.includes('kedaluwarsa') ||
    s.includes('maintenance') ||
    s.includes('problem') ||
    s.includes('terminated') ||
    s.includes('jatuh tempo') ||
    s.includes('lewat') ||
    s.includes('darurat') ||
    s.includes('suspended') ||
    s.includes('dibekukan') ||
    s.includes('penuh') ||
    s.includes('teguran') ||
    s.includes('strd') ||
    s === 'sp 2' ||
    s === 'sp2' ||
    s === 'sp 3' ||
    s === 'sp3' ||
    s.includes('denda') ||
    s.includes('danger')
  ) {
    return 'bg-[#dd4b39] text-white'; // Red
  }

  // 2. Kosong / Belum Ada Berkas / Empty (Netral Slate Gray - Kontras dengan Tersedia/Hijau)
  if (
    s.includes('kosong') ||
    s.includes('belum diunggah') ||
    s.includes('empty')
  ) {
    return 'bg-slate-400 text-white'; // Cool Slate Gray
  }

  // 3. Lengkapi Dokumen / Belum Lengkap (Biru Standar MARS AdminLTE)
  if (
    s.includes('belum lengkap') ||
    s.includes('lengkapi') ||
    s.includes('incomplete')
  ) {
    return 'bg-[#3c8dbc] text-white'; // Royal Blue
  }

  // 4. Menunggu Verifikasi / Pending / Verifikasi / Validasi / Belum Lunas / Unpaid / SP 1 / Warning (Kuning/Amber/Orange AdminLTE)
  if (
    s.includes('belum lunas') ||
    s.includes('unpaid') ||
    s.includes('unbilled') ||
    s.includes('belum terbit') ||
    s.includes('belum aktif') ||
    s.includes('belum bayar') ||
    s.includes('menunggu') ||
    s.includes('pending') ||
    s.includes('verifikasi') ||
    s.includes('validasi') ||
    s.includes('pengesahan') ||
    s.includes('persetujuan') ||
    s.includes('expiring') || 
    s.includes('akan habis') ||
    s.includes('inap') ||
    s.includes('waiting payment') ||
    s.includes('review') ||
    s.includes('pemberitahuan') ||
    s === 'sp 1' ||
    s === 'sp1' ||
    s.includes('warning')
  ) {
    return 'bg-[#f39c12] text-white'; // Amber/Orange konsisten
  }

  // 3. Draft / Batal / Cancelled (Netral Slate Gray)
  if (
    s.includes('draft') || 
    s.includes('batal') ||
    s.includes('cancel')
  ) {
    return 'bg-slate-600 text-white'; // Slate Gray
  }

  // 4. Reviewed / Terisi / Occupied / Checked-In / Terjadwal (Biru Standar MARS AdminLTE)
  if (
    s.includes('reviewed') || 
    s.includes('occupied') || 
    s.includes('terisi') ||
    s.includes('in-use') ||
    s.includes('checked-in') ||
    s.includes('terjadwal') ||
    s.includes('scheduled')
  ) {
    return 'bg-[#3c8dbc] text-white'; // Royal Blue
  }

  // 5. Checked-Out / Pasca-Checkout (Ungu AdminLTE #605ca8 - Kontras & Berbeda dari Hijau Aktif/Disetujui)
  if (
    s.includes('checked-out') || 
    s.includes('checked out') || 
    s.includes('check-out') || 
    s.includes('checkout')
  ) {
    return 'bg-[#605ca8] text-white'; // AdminLTE Purple
  }

  // 6. Disetujui / Aktif / Approved / Terverifikasi / Lunas / Tersedia / Terunggah / Billed / Selesai (Hijau Sukses AdminLTE)
  // Pastikan tidak mengandung kata negasi
  const hasNegation = s.includes('belum') || s.includes('unpaid') || s.includes('unbilled') || s.startsWith('un-') || s.includes('tidak') || s.includes('non') || s.includes('batal');
  if (
    !hasNegation && (
      s.includes('surat disetujui') || 
      s.includes('disetujui kadis') ||
      s.includes('disetujui') || 
      s.includes('aktif') || 
      s.includes('active') || 
      s.includes('approved') ||
      s.includes('terverifikasi') ||
      s.includes('verified') ||
      s.includes('paid') ||
      s.includes('lunas') ||
      s.includes('tersedia') ||
      s.includes('available') ||
      s.includes('terunggah') ||
      s.includes('sudah diunggah') ||
      s.includes('direalisasikan') ||
      s.includes('realisasi') ||
      s.includes('mendarat') ||
      s.includes('telah mendarat') ||
      s.includes('signed') ||
      s.includes('billed') ||
      s.includes('skrd terbit') ||
      s.includes('selesai') ||
      s.includes('completed') ||
      s.includes('success')
    )
  ) {
    return 'bg-[#00a65a] text-white'; // Green
  }

  return 'bg-slate-500 text-white';
};

export default function StatusBadge({ status, className = '', label }: Readonly<StatusBadgeProps>) {
  const colorClass = getStatusColorClass(status);
  let displayText = label || status || '-';
  const lower = displayText.trim().toLowerCase();
  
  // Standardisasi teks bahasa Indonesia & Operasional
  if (lower === 'active' || lower === 'signed') {
    displayText = 'Aktif';
  } else if (lower === 'verified') {
    displayText = 'Terverifikasi';
  } else if (lower === 'direalisasikan') {
    displayText = 'Telah Mendarat';
  } else if (lower === 'paid') {
    displayText = 'Lunas';
  } else if (lower === 'unpaid') {
    displayText = 'Belum Lunas';
  } else if (lower === 'pending verification') {
    displayText = 'Menunggu Verifikasi';
  } else if (lower === 'overdue') {
    displayText = 'Menunggak';
  } else if (lower === 'scheduled') {
    displayText = 'Terjadwal';
  } else if (lower === 'checked-out' || lower === 'checked out' || lower === 'checkout') {
    displayText = 'Checked-Out';
  } else if (lower === 'checked-in' || lower === 'checked in' || lower === 'checkin') {
    displayText = 'Checked-In';
  } else if (lower === 'completed') {
    displayText = 'Selesai';
  } else if (lower === 'cancelled' || lower === 'canceled') {
    displayText = 'Dibatalkan';
  } else if (lower === 'menunggu ttd tenant' || lower === 'menunggu ttd anda') {
    displayText = 'Menunggu TTD';
  } else if (lower === 'waiting payment') {
    displayText = 'Menunggu Bayar SKRD';
  } else if (lower === 'review') {
    displayText = 'Menunggu TTD';
  } else if (lower === 'expiring') {
    displayText = 'Akan Habis';
  } else if (lower === 'expired') {
    displayText = 'Kedaluwarsa';
  } else if (lower === 'terminated') {
    displayText = 'Terminated';
  } else if (lower === 'billed') {
    displayText = 'SKRD Terbit';
  } else if (lower === 'unbilled') {
    displayText = 'Belum Terbit SKRD';
  } else if (lower === 'suspended') {
    displayText = 'Dibekukan';
  }

  const hasCustomRadius = className.includes('rounded');

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-0.5 text-[11px] font-bold text-white ${hasCustomRadius ? '' : 'rounded-full'} shadow-2xs tracking-wide text-center leading-tight whitespace-nowrap transition-all ${colorClass} ${className}`}
    >
      {displayText}
    </span>
  );
}
