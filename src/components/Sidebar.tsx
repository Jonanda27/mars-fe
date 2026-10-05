"use client";

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import BaseSidebar, { NavItem } from './BaseSidebar';
import { 
  Building2, 
  Users, 
  FileText, 
  Activity, 
  BarChart3,
  Circle, 
  User, 
  Database, 
  Map as MapIcon,
  ClipboardCheck,
  Receipt
} from 'lucide-react';

export default function Sidebar({ isOpen, onToggle }: Readonly<{ isOpen: boolean; onToggle?: () => void }>) {
  const { user } = useAuthStore();

  const userRole = (user?.role || '').toLowerCase();
  const isMiniAdmin = userRole === 'admin_mini_airport' || Boolean(user?.mini_airport_id);

  const miniAdminNavItems: NavItem[] = [
    { href: "/admin", label: "Dashboard Operasional", icon: <BarChart3 /> },
    { href: "/admin/permohonan", label: `Izin Pendaratan ${user?.airport_code ? `(${user.airport_code})` : 'Mini Airport'}`, icon: <ClipboardCheck /> },
    { href: "/admin/pemakaian", label: "Log Realisasi Lapangan", icon: <Activity /> },
    { href: "/admin/kontrak", label: "PKS Payung Mini Airport", icon: <FileText /> },
    { href: "/admin/tagihan", label: "Monitoring e-SKRD Dinas", icon: <Receipt /> },
    { href: "/admin/tarif", label: "Master Tax Retribusi Daerah", icon: <Database /> },
    { href: "/admin/penyewa", label: "Direktori Mitra Maskapai", icon: <Users /> },
  ];

  const mozesAdminNavItems: NavItem[] = [
    { href: "/admin", label: "Dashboard Operasional", icon: <BarChart3 /> },
    { href: "/admin/permohonan", label: "Permohonan Sewa Mozes", icon: <ClipboardCheck /> },
    { href: "/admin/kontrak", label: "Kontrak & Dokumen PKS", icon: <FileText /> },
    { href: "/admin/tagihan", label: "Penetapan SKRD Sewa", icon: <Receipt /> },
    { href: "/admin/dashboard", label: "Peta Spasial GIS", icon: <MapIcon /> },
    { href: "/admin/aset", label: "Aset & Fasilitas (m²)", icon: <Building2 /> },
    { href: "/admin/tarif", label: "Master Tarif Sewa", icon: <Database /> },
    { href: "/admin/penyewa", label: "Direktori Mitra (Tenant)", icon: <Users /> },
    { href: "/admin/pemakaian", label: "Log Operasional Lapangan", icon: <Activity /> },
  ];

  const navItems: NavItem[] = isMiniAdmin ? miniAdminNavItems : mozesAdminNavItems;

  return (
    <BaseSidebar
      isOpen={isOpen}
      onToggle={onToggle}
      userName={user?.username || (isMiniAdmin ? 'Admin Mini Airport' : 'Admin Mozes Kilangin')}
      userAvatar={user?.username?.charAt(0) || <User className="w-5 h-5" />}
      userStatus={
        <>
          <Circle className="w-[10px] h-[10px] mr-1 fill-[#00a65a] text-[#00a65a]" /> {isMiniAdmin ? 'Admin Mini Airport Online' : 'Admin Mozes Online'}
        </>
      }
      headerTitle="Main Navigation"
      navItems={navItems}
    />
  );
}
