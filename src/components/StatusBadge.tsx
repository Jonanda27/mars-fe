import React from 'react';

interface StatusBadgeProps {
  readonly status: string;
  readonly className?: string;
  readonly label?: string;
}

export const getStatusColorClass = (status: string): string => {
  const s = status?.trim().toLowerCase() || '';

  // 1. Disetujui / Aktif / Approved / Terverifikasi / Lunas / Tersedia / Billed (Hijau Sukses AdminLTE)
  if (
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
    s.includes('direalisasikan') ||
    s.includes('realisasi') ||
    s.includes('mendarat') ||
    s.includes('telah mendarat') ||
    s.includes('signed') ||
    s.includes('billed') ||
    s.includes('skrd terbit') ||
    s.includes('checkout')
  ) {
    return 'bg-[#00a65a] text-white'; // Green
  }

  // 2. Menunggu / Pending / Verifikasi / Validasi / Belum Lunas / Unbilled / SP 1 (Amber/Orange AdminLTE)
  if (
    s.includes('menunggu') ||
    s.includes('pending') ||
    s.includes('verifikasi') ||
    s.includes('validasi') ||
    s.includes('pengesahan') ||
    s.includes('persetujuan') ||
    s.includes('expiring') || 
    s.includes('akan habis') ||
    s.includes('unpaid') ||
    s.includes('belum lunas') ||
    s.includes('unbilled') ||
    s.includes('belum terbit') ||
    s.includes('kosong') ||
    s.includes('inap') ||
    s.includes('waiting payment') ||
    s.includes('review') ||
    s === 'sp 1' ||
    s === 'sp1'
  ) {
    return 'bg-[#f39c12] text-white'; // Amber/Orange konsisten
  }

  // 3. Ditolak / Rejected / Overdue / Menunggak / Expired / Problem / Lewat / Darurat / SP 2 / SP 3 (Merah AdminLTE)
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
    s === 'sp 2' ||
    s === 'sp2' ||
    s === 'sp 3' ||
    s === 'sp3'
  ) {
    return 'bg-[#dd4b39] text-white'; // Red
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

  // 5. Draft / Belum Aktif / Selesai / Completed / Batal (Netral Slate Gray)
  if (
    s.includes('draft') || 
    s.includes('belum aktif') ||
    s.includes('selesai') ||
    s.includes('completed') ||
    s.includes('batal') ||
    s.includes('cancel')
  ) {
    return 'bg-slate-600 text-white'; // Slate Gray
  }

  return 'bg-slate-500 text-white';
};

export default function StatusBadge({ status, className = '', label }: Readonly<StatusBadgeProps>) {
  const colorClass = getStatusColorClass(status);
  let displayText = label || status || '-';
  const lower = displayText.trim().toLowerCase();
  
  // Standardisasi teks bahasa Indonesia
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
      className={`inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold text-white ${hasCustomRadius ? '' : 'rounded'} shadow-2xs tracking-wide text-center leading-tight whitespace-nowrap transition-all ${colorClass} ${className}`}
    >
      {displayText}
    </span>
  );
}
