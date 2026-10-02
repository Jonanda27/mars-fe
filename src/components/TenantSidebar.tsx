"use client";

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import BaseSidebar, { NavItem } from './BaseSidebar';
import { 
  FileText, 
  CreditCard, 
  Plane, 
  User, 
  Circle, 
  ShieldCheck,
  LayoutDashboard,
  FileSignature,
  Building2,
  Calendar,
  TowerControl
} from 'lucide-react';
import RupiahIcon from './icons/RupiahIcon';

export default function TenantSidebar({ isOpen }: Readonly<{ isOpen: boolean }>) {
  const { user } = useAuthStore();
  const isVerified = user?.status_verifikasi === 'Verified';

  const navItems: NavItem[] = [
    { href: "/tenant", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/tenant/permohonan", label: "Permohonan Sewa", icon: <FileText /> },
    { href: "/tenant/mini-airport", label: "Permohonan Mini Airport", icon: <TowerControl /> },
    { href: "/tenant/jadwal-hanggar", label: "Jadwal Pemakaian", icon: <Calendar /> },
    { href: "/tenant/kontrak-payung", label: "Kontrak Payung", icon: <FileSignature /> },
    { href: "/tenant/kontrak-sewa", label: "Kontrak Sewa", icon: <Building2 /> },
    { href: "/tenant/pesawat", label: "Data Pesawat", icon: <Plane /> },
    { href: "/tenant/tagihan", label: "SKRD dan Tagihan", icon: <RupiahIcon /> },
    { href: "/tenant/pembayaran", label: "Riwayat Pembayaran", icon: <CreditCard /> },
    { href: "/tenant/profil", label: "Profil dan Legalitas", icon: <ShieldCheck /> },
  ];


  // Filter items based on verification: pending accounts must complete profile first
  const visibleNavItems: NavItem[] = !isVerified
    ? navItems.filter(item => item.href === '/tenant/profil')
    : navItems;

  return (
    <BaseSidebar
      isOpen={isOpen}
      userName={user?.nama_perusahaan || 'Tenant'}
      userAvatar={<User className="w-5 h-5" />}
      userStatus={
        !isVerified ? (
          <>
            <Circle className="w-[10px] h-[10px] mr-1 fill-yellow-500 text-yellow-500" /> Pending/Unverified
          </>
        ) : (
          <>
            <Circle className="w-[10px] h-[10px] mr-1 fill-[#3c8dbc] text-[#3c8dbc]" /> Verified Tenant
          </>
        )
      }
      headerTitle="Tenant Portal"
      navItems={visibleNavItems}
    />
  );
}
