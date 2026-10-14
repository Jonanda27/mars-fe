"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactElement;
  disabled?: boolean;
  badge?: string;
}

export interface BaseSidebarProps {
  readonly isOpen: boolean;
  readonly onToggle?: () => void;
  readonly isMobileOpen?: boolean;
  readonly onCloseMobile?: () => void;
  readonly userAvatar?: React.ReactNode;
  readonly userName?: string;
  readonly userStatus?: React.ReactNode;
  readonly headerTitle?: string;
  readonly navItems: readonly NavItem[];
  readonly bottomContent?: React.ReactNode;
}

export default function BaseSidebar({
  isOpen,
  onToggle,
  isMobileOpen = false,
  onCloseMobile,
  userAvatar,
  userName = 'User',
  userStatus,
  headerTitle = 'MAIN NAVIGATION',
  navItems,
  bottomContent,
}: Readonly<BaseSidebarProps>) {
  const pathname = usePathname();
  // Di mobile drawer selalu tampilkan tampilan penuh; di desktop ikuti prop isOpen
  const isExpanded = Boolean(isMobileOpen || isOpen);

  return (
    <>
      {/* Backdrop Gelap untuk Layar Mobile / Tablet (< lg) */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300 animate-in fade-in"
          aria-label="Tutup Menu Sidebar"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-[#222d32] text-white shadow-2xl transition-all duration-300
          lg:static lg:z-30 lg:shadow-none lg:flex-shrink-0
          ${isMobileOpen ? 'translate-x-0 w-64 max-w-[85vw]' : '-translate-x-full lg:translate-x-0'}
          ${isOpen ? 'lg:w-56' : 'lg:w-16'}
        `}
      >
        {/* Tombol Panah Buka / Tutup Desktop (Hanya Aktif di Desktop lg:) */}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            title={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
            aria-label={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
            className="hidden lg:flex absolute -right-3.5 top-[92px] -translate-y-1/2 z-40 w-7 h-7 rounded-full bg-[#1a2226] hover:bg-[#3c8dbc] text-slate-300 hover:text-white border border-slate-600 hover:border-[#3c8dbc] shadow-md items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none"
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Mobile Header Bar dengan Tombol Tutup (X) */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1 lg:hidden border-b border-[#1a2226]/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Menu Navigasi
          </span>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1a2226] transition-colors"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-3">
          {/* User Panel */}
          <div
            className={`flex items-center pb-4 transition-all duration-300 ${
              isExpanded ? 'px-4' : 'justify-center px-2'
            }`}
          >
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 flex-shrink-0 overflow-hidden uppercase font-bold text-lg">
              {userAvatar}
            </div>
            {isExpanded && (
              <div className="ml-3 overflow-hidden flex-1 min-w-0 pr-1">
                <p className="font-semibold text-[14px] text-white truncate capitalize leading-tight">
                  {userName}
                </p>
                {userStatus && (
                  <div className="text-[11px] text-slate-300 mt-1.5 flex items-center gap-1.5 leading-none">
                    {userStatus}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Header */}
          {isExpanded && headerTitle && (
            <div className="text-[12px] text-[#4b646f] bg-[#1a2226] px-4 py-3 uppercase whitespace-nowrap font-semibold">
              {headerTitle}
            </div>
          )}

          {/* Navigation Items */}
          <ul className="text-[14px] mt-2">
            {navItems.map((item) => {
              const isRootDashboard =
                item.href === '/tenant' ||
                item.href === '/admin' ||
                item.href === '/superadmin' ||
                item.href === '/eksekutif' ||
                item.href === '/dinas' ||
                item.href === '/petugas';

              const isActive = isRootDashboard
                ? pathname === item.href
                : pathname === item.href || (pathname ? pathname.startsWith(`${item.href}/`) : false);

              if (item.disabled) {
                return (
                  <li key={item.href}>
                    <div
                      title={!isExpanded ? `${item.label} (Belum Tersedia)` : undefined}
                      className={`flex items-center py-3 ${
                        isExpanded ? 'px-4' : 'justify-center'
                      } border-l-[3px] border-transparent text-[#666] cursor-not-allowed opacity-50 relative`}
                    >
                      {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                        className: `w-4 h-4 flex-shrink-0 ${isExpanded ? 'mr-3' : ''}`,
                      })}
                      {isExpanded && (
                        <div className="flex justify-between items-center w-full">
                          <span className="whitespace-nowrap">{item.label}</span>
                          <span className="text-[9px] bg-[#333] text-white px-1.5 py-0.5 rounded ml-2">
                            {item.badge || 'WIP'}
                          </span>
                        </div>
                      )}
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    title={!isExpanded ? item.label : undefined}
                    className={`flex items-center py-3 ${
                      isExpanded ? 'px-4' : 'justify-center'
                    } transition-colors duration-200 border-l-[3px] ${
                      isActive
                        ? 'bg-[#1e282c] border-[#3c8dbc] text-white'
                        : 'border-transparent text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'
                    }`}
                  >
                    {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                      className: `w-4 h-4 flex-shrink-0 ${isExpanded ? 'mr-3' : ''} ${
                        isActive ? 'text-[#3c8dbc]' : ''
                      }`,
                    })}
                    {isExpanded && <span className="whitespace-nowrap">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          {bottomContent}
        </div>
      </aside>
    </>
  );
}
