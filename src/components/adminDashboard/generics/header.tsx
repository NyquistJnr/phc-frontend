"use client";

import React from 'react';
import { Search, Bell, Home, Menu } from 'lucide-react';
import Image from 'next/image';
import { useSidebar } from './sidebar';

interface Breadcrumb {
  label: string;
  href?: string;
  active?: boolean;
}

interface HeaderProps {
  title: string;
  breadcrumbs: Breadcrumb[];
}

export default function Header({ title, breadcrumbs }: HeaderProps) {
  const { setMobileOpen } = useSidebar();

  return (
    <div className="flex flex-col sticky top-0 z-10 w-full">
      {/* Top Section: Title, Search, and Profile */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-600 p-1">
            <Menu size={22} />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h1>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative hidden md:block w-64 lg:w-80 xl:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white border border-gray-200 rounded-full pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button className="relative p-2 bg-gray-50 rounded-full text-gray-600">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#1AC073] rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l pl-3 sm:pl-4 border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">Nobert</p>
                <p className="text-[11px] text-gray-500 font-medium">Admin</p>
              </div>
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-gray-200">
                <Image src="/images/profile.jpg" alt="Profile" fill className="object-cover w-40 h-40" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Section: Breadcrumb Navigation */}
      <nav className="bg-[#F9FAFB] px-2 sm:px-8 py-3 sm:py-4 flex items-center gap-2 text-sm text-gray-500 overflow-x-auto">
        <Home size={16} className="text-[#046C3F] shrink-0" />
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span className="mx-1 shrink-0">/</span>
            <span className={`whitespace-nowrap ${crumb.active ? "text-gray-800 font-medium" : ""}`}>
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
}