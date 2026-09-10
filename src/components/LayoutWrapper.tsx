"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Sidebar from './Sidebar';
import TenantSidebar from './TenantSidebar';
import PetugasSidebar from './PetugasSidebar';
import EksekutifSidebar from './EksekutifSidebar';
import TopNavbar from './TopNavbar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const noSidebarRoutes = ['/', '/register', '/login'];
  const pathname = usePathname();
  const router = useRouter();
  const { user, syncUser } = useAuthStore();

  useEffect(() => {
    // Sync profil user ke backend setiap kali app di-mount atau dimuat ulang
    syncUser();
  }, [syncUser]);

  useEffect(() => {
    if (user?.role === 'Tenant' && user?.status_verifikasi === 'Pending') {
      if (pathname.startsWith('/tenant') && pathname !== '/tenant/profil') {
        router.push('/tenant/profil');
      }
    }
  }, [user, pathname, router]);

  // Jika di halaman awal (Login), register, atau khusus layar penuh lainnya
  if (noSidebarRoutes.includes(pathname) || pathname.startsWith('/cetak') || pathname === '/admin/dashboard') {
    return <>{children}</>;
  }

  const isTenant = user?.role === 'Tenant' || pathname.startsWith('/tenant');
  const isPetugas = user?.role === 'Petugas' || pathname.startsWith('/petugas');
  const isEksekutif = user?.role?.toLowerCase() === 'kepala dinas' || pathname.startsWith('/eksekutif');

  return (
    <div className="flex h-screen overflow-hidden bg-[#ecf0f5]">
      {/* Sidebar */}
      {isTenant ? (
        <TenantSidebar isOpen={isSidebarOpen} />
      ) : isPetugas ? (
        <PetugasSidebar isOpen={isSidebarOpen} />
      ) : isEksekutif ? (
        <EksekutifSidebar isOpen={isSidebarOpen} />
      ) : (
        <Sidebar isOpen={isSidebarOpen} />
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopNavbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
