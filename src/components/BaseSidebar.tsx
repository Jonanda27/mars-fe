"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactElement;
  disabled?: boolean;
  badge?: string;
}

interface BaseSidebarProps {
  readonly isOpen: boolean;
  readonly userAvatar?: React.ReactNode;
  readonly userName?: string;
  readonly userStatus?: React.ReactNode;
  readonly headerTitle?: string;
  readonly navItems: readonly NavItem[];
  readonly bottomContent?: React.ReactNode;
}

export default function BaseSidebar({
  isOpen,
  userAvatar,
  userName = 'User',
  userStatus,
  headerTitle = 'MAIN NAVIGATION',
  navItems,
  bottomContent,
}: Readonly<BaseSidebarProps>) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        isOpen ? 'w-56' : 'w-16'
      } bg-[#222d32] text-white flex-shrink-0 flex flex-col h-full z-20 overflow-hidden transition-all duration-300`}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-4">
        {/* User Panel */}
        <div
          className={`flex items-center pb-4 whitespace-nowrap ${
            isOpen ? 'px-4' : 'justify-center'
          }`}
        >
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 flex-shrink-0 overflow-hidden uppercase font-bold text-lg">
            {userAvatar}
          </div>
          {isOpen && (
            <div className="ml-3 overflow-hidden">
              <p className="font-semibold text-[14px] truncate max-w-[130px] capitalize">
                {userName}
              </p>
              {userStatus && (
                <div className="text-[11px] text-slate-300 flex items-center mt-1">
                  {userStatus}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Header */}
        {isOpen && headerTitle && (
          <div className="text-[12px] text-[#4b646f] bg-[#1a2226] px-4 py-3 uppercase whitespace-nowrap font-semibold">
            {headerTitle}
          </div>
        )}

        {/* Navigation Items */}
        <ul className="text-[14px] mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            if (item.disabled) {
              return (
                <li key={item.href}>
                  <div
                    title={!isOpen ? `${item.label} (Belum Tersedia)` : undefined}
                    className={`flex items-center py-3 ${
                      isOpen ? 'px-4' : 'justify-center'
                    } border-l-[3px] border-transparent text-[#666] cursor-not-allowed opacity-50 relative`}
                  >
                    {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                      className: `w-4 h-4 flex-shrink-0 ${isOpen ? 'mr-3' : ''}`,
                    })}
                    {isOpen && (
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
                  title={!isOpen ? item.label : undefined}
                  className={`flex items-center py-3 ${
                    isOpen ? 'px-4' : 'justify-center'
                  } transition-colors duration-200 border-l-[3px] ${
                    isActive
                      ? 'bg-[#1e282c] border-[#3c8dbc] text-white'
                      : 'border-transparent text-[#b8c7ce] hover:bg-[#1e282c] hover:text-white'
                  }`}
                >
                  {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                    className: `w-4 h-4 flex-shrink-0 ${isOpen ? 'mr-3' : ''} ${
                      isActive ? 'text-[#3c8dbc]' : ''
                    }`,
                  })}
                  {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {bottomContent}
      </div>
    </aside>
  );
}
