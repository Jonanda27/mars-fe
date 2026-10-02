"use client";

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import BaseSidebar, { NavItem } from './BaseSidebar';
import { 
  UserCog, 
  Circle, 
  User,
  ShieldCheck
} from 'lucide-react';

export default function SuperAdminSidebar({ isOpen }: Readonly<{ isOpen: boolean }>) {
  const { user } = useAuthStore();

  const navItems: NavItem[] = [
    { href: "/superadmin/users", label: "Manajemen Akun", icon: <UserCog /> },
  ];

  return (
    <BaseSidebar
      isOpen={isOpen}
      userName={user?.username || 'Super Admin'}
      userAvatar={user?.username?.charAt(0) || <ShieldCheck className="w-5 h-5 text-amber-500" />}
      userStatus={
        <>
          <Circle className="w-[10px] h-[10px] mr-1 fill-[#00a65a] text-[#00a65a]" /> Super Admin Online
        </>
      }
      headerTitle="Super Admin Portal"
      navItems={navItems}
    />
  );
}
