"use client";

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import BaseSidebar, { NavItem } from './BaseSidebar';
import { Plane, User, Circle, ShieldCheck, Clock, History, AlertTriangle, TowerControl, MapPin } from 'lucide-react';

export default function PetugasSidebar({ isOpen, onToggle }: Readonly<{ isOpen: boolean; onToggle?: () => void }>) {
  const { user } = useAuthStore();
  const role = (user?.role || '').toLowerCase();
  const isMiniPetugas = role === 'petugas_mini_airport' || role === 'petugas lapangan mini airport' || Boolean(user?.mini_airport_id);

  const mozesNavItems: NavItem[] = [
    { href: "/petugas", label: "Log Operasional (Mozes)", icon: <Plane className="w-4 h-4" /> },
    { href: "/petugas/verifikasi-jadwal", label: "Verifikasi Jadwal Masuk", icon: <ShieldCheck className="w-4 h-4" /> },
    { href: "/petugas/tutup-hari", label: "Laporan Tutup Hari", icon: <Clock className="w-4 h-4" /> },
    { href: "/petugas/riwayat", label: "Riwayat Tutup Hari", icon: <History className="w-4 h-4" /> },
    { href: "/petugas/pendaratan-darurat", label: "Pendaratan Darurat", icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
  ];

  const miniNavItems: NavItem[] = [
    { href: "/petugas/mini-airport", label: "Dashboard Operasional", icon: <TowerControl className="w-4 h-4" /> },
    { href: "/petugas/mini-airport/rencana-masuk", label: "Rencana Kedatangan", icon: <ShieldCheck className="w-4 h-4" /> },
    { href: "/petugas/mini-airport/rekap-harian", label: "Rekapitulasi & Tutup Hari", icon: <Clock className="w-4 h-4" /> },
  ];

  const navItems = isMiniPetugas ? miniNavItems : mozesNavItems;

  const getShortAirport = (name?: string | null) => {
    if (!name) return '';
    return name
      .replace(/^Mini Airport\s+/i, '')
      .replace(/^Bandara\s+/i, '');
  };

  const shortAirport = getShortAirport(user?.airport_name);

  const userStatusElement = isMiniPetugas ? (
    <div className="flex flex-col text-[11px] leading-tight">
      <span className="text-[#00a65a] flex items-center font-medium">
        <Circle className="w-1.5 h-1.5 mr-1.5 fill-current flex-shrink-0" /> Petugas Lapangan
      </span>
      {shortAirport ? (
        <span
          className="text-slate-400 text-[10px] truncate max-w-[130px] flex items-center gap-1 mt-0.5"
          title={user?.airport_name || undefined}
        >
          <MapPin className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
          <span className="truncate">{shortAirport}</span>
        </span>
      ) : (
        <span className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
          <MapPin className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
          <span>Mini Airport</span>
        </span>
      )}
    </div>
  ) : (
    <div className="flex flex-col text-[11px] leading-tight">
      <span className="text-[#00a65a] flex items-center font-medium">
        <Circle className="w-1.5 h-1.5 mr-1.5 fill-current flex-shrink-0" /> Petugas Lapangan
      </span>
      <span className="text-slate-400 text-[10px] truncate max-w-[130px] flex items-center gap-1 mt-0.5">
        <MapPin className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
        <span>Mozes Kilangin</span>
      </span>
    </div>
  );

  return (
    <BaseSidebar
      isOpen={isOpen}
      onToggle={onToggle}
      userName={user?.username || 'Petugas'}
      userAvatar={user?.username?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
      userStatus={userStatusElement}
      headerTitle={isMiniPetugas ? "MENU PETUGAS MINI AIRPORT" : "MENU PETUGAS MOZES"}
      navItems={navItems}
    />
  );
}
