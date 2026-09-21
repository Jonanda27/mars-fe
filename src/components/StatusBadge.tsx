import React from 'react';

interface StatusBadgeProps {
  readonly status: string;
  readonly className?: string;
  readonly label?: string;
}

export const getStatusColorClass = (status: string): string => {
  const s = status?.trim().toLowerCase() || '';

  // 1. Menunggu Verifikasi Kadis / Pending / Menunggu TTD (Tahap peninjauan/menunggu)
  if (
    s.includes('verifikasi kadis') || 
    s.includes('pengesahan kadis') ||
    s === 'pending' || 
    s.includes('menunggu ttd') || 
    s.includes('menunggu verifikasi') ||
    s.includes('pending verification') ||
    s === 'menunggu'
  ) {
    return 'bg-[#f39c12] text-white'; // Amber/Orange as seen in reference image
  }

  // 2. Surat Disetujui (Surat lolos verifikasi Kepala Dinas)
  if (s.includes('surat disetujui') || s.includes('disetujui kadis')) {
    return 'bg-[#00a65a] text-white'; // Green
  }

  // 3. Menunggu Validasi Admin (Tenant melengkapi detail sewa)
  if (s.includes('validasi admin')) {
    return 'bg-[#00c0ef] text-white'; // Cyan/Sky
  }

  // 4. Menunggu Persetujuan Kadis (PKS divalidasi admin, menunggu Kadis)
  if (s.includes('persetujuan kadis')) {
    return 'bg-purple-600 text-white'; // Purple
  }

  // 5. Draft Kontrak / Draft PKS (Draft dokumen diterbitkan)
  if (s.includes('draft')) {
    return 'bg-indigo-500 text-white'; // Indigo
  }

  // 6. Signed / Reviewed (Kontrak resmi bertandatangan)
  if (s.includes('signed') || s.includes('reviewed')) {
    return 'bg-[#3c8dbc] text-white'; // Royal Blue
  }

  // 7. Disetujui / Aktif / Approved / Verified / Lunas
  if (
    s.includes('aktif') || 
    s.includes('active') || 
    s.includes('disetujui') || 
    s.includes('approved') ||
    s.includes('terverifikasi') ||
    s.includes('verified') ||
    s.includes('paid') ||
    s.includes('lunas') ||
    s.includes('tersedia') ||
    s.includes('available')
  ) {
    return 'bg-[#00a65a] text-white'; // Green
  }

  // 8. Ditolak / Rejected / Overdue / Expired / Problem
  if (
    s.includes('tolak') || 
    s.includes('reject') || 
    s.includes('overdue') || 
    s.includes('expired') || 
    s.includes('kedaluwarsa') ||
    s.includes('maintenance') ||
    s.includes('problem') ||
    s.includes('terminated')
  ) {
    return 'bg-[#dd4b39] text-white'; // Red
  }

  // 9. Akan Habis / Expiring
  if (s.includes('expiring') || s.includes('akan habis')) {
    return 'bg-[#f39c12] text-white'; // Amber
  }

  // 10. Terisi / Occupied
  if (s.includes('occupied') || s.includes('terisi')) {
    return 'bg-[#3c8dbc] text-white'; // Blue
  }

  return 'bg-slate-500 text-white';
};

export default function StatusBadge({ status, className = '', label }: Readonly<StatusBadgeProps>) {
  const colorClass = getStatusColorClass(status);
  const displayText = label || status || '-';

  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1.5 text-[11.5px] font-bold text-white rounded-full shadow-sm tracking-wide text-center leading-tight whitespace-nowrap transition-all ${colorClass} ${className}`}
    >
      {displayText}
    </span>
  );
}
