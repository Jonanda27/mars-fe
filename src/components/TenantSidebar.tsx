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

export default function TenantSidebar({ isOpen, onToggle }: Readonly<{ isOpen: boolean; onToggle?: () => void }>) {
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
      onToggle={onToggle}
      userName={user?.nama_perusahaan || 'Tenant'}
      userAvatar={<User className="w-5 h-5" />}
      userStatus={
        !isVerified ? (
          <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium leading-none">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
            <span>Pending/Unverified</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[#3c8dbc] font-medium leading-none">
            <span className="w-2 h-2 rounded-full bg-[#3c8dbc] shrink-0" />
            <span>Verified Tenant</span>
          </span>
        )
      }
      headerTitle="Tenant Portal"
      navItems={visibleNavItems}
    />
  );
}
