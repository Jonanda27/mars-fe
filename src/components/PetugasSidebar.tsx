"use client";

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import BaseSidebar, { NavItem } from './BaseSidebar';
import { Plane, User, Circle, ShieldCheck, Clock, History } from 'lucide-react';

export default function PetugasSidebar({ isOpen }: Readonly<{ isOpen: boolean }>) {
  const { user } = useAuthStore();

  const navItems: NavItem[] = [
    { href: "/petugas", label: "Log Operasional", icon: <Plane className="w-4 h-4" /> },
    { href: "/petugas/verifikasi-jadwal", label: "Verifikasi Jadwal Masuk", icon: <ShieldCheck className="w-4 h-4" /> },
    { href: "/petugas/tutup-hari", label: "Laporan Tutup Hari", icon: <Clock className="w-4 h-4" /> },
    { href: "/petugas/riwayat", label: "Riwayat Tutup Hari", icon: <History className="w-4 h-4" /> },
  ];

  return (
    <BaseSidebar
      isOpen={isOpen}
      userName={user?.username || 'Petugas'}
      userAvatar={user?.username?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
      userStatus={
        <p className="text-[11px] text-[#00a65a] flex items-center">
          <Circle className="w-2 h-2 mr-1 fill-current" /> Petugas Lapangan
        </p>
      }
      headerTitle="MENU PETUGAS"
      navItems={navItems}
    />
  );
}
