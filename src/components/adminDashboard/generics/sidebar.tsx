"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Building2, FileText, 
  ShieldCheck, Settings, LogOut, ChevronDown, X 
} from 'lucide-react';

// Sidebar context for mobile toggle
interface SidebarContextValue {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}
const SidebarContext = createContext<SidebarContextValue>({ mobileOpen: false, setMobileOpen: () => {} });
export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'User Management', icon: Users, path: '/dashboard/user-management' },
  { 
    name: 'Facility Management', 
    icon: Building2, 
    children: [
      { name: 'Facility Details', path: '/dashboard/facility-management/details' },
      { name: 'Facility Configuration', path: '/dashboard/facility-management/configurations' },
    ]
  },
  { 
    name: 'System Logs', 
    icon: FileText, 
    children: [
      { name: 'Audit Logs', path: '/dashboard/system-logs/audit' },
      { name: 'System Logs', path: '/dashboard/system-logs/system' },
      { name: 'Database Logs', path: '/dashboard/system-logs/database' },
    ]
  },
  { 
    name: 'Security', 
    icon: ShieldCheck, 
    children: [
      { name: 'Role Permission', path: '/dashboard/security/roles' },
      { name: 'Access Control', path: '/dashboard/security/access-control' },
    ]
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const { mobileOpen, setMobileOpen } = useSidebar();

  // Automatically expand the menu that contains the active path
  useEffect(() => {
    navItems.forEach(item => {
      if (item.children?.some(child => pathname.startsWith(child.path))) {
        setExpandedMenu(item.name);
      }
    });
  }, [pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  const toggleMenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      <div className="flex items-center justify-between py-8 px-6">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8">
             <div className="absolute inset-0 bg-[#1AC073] rounded-full"></div>
             <div className="absolute inset-0 bg-[#FFD66B] rounded-full opacity-50 translate-x-1"></div>
             <div className="absolute inset-0 bg-emerald-400 rounded-full scale-75 border-2 border-white"></div>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">LOGO</span>
        </div>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <nav className="grow px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedMenu === item.name;
          const hasActiveChild = item.children?.some(child => child.path === pathname);
          const isParentActive = item.path === pathname || hasActiveChild;

          return (
            <div key={item.name} className="space-y-1">
              {item.children ? (
                
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isParentActive ? 'bg-[#046C3F] text-white' : 'text-[#53545C] hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className={isParentActive ? 'text-white' : 'text-[#53545C]'} />
                  <span className="grow text-sm font-poppins font-medium text-left">{item.name}</span>
                  <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                // If no children, it's a direct link
                <Link
                  href={item.path || '#'}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isParentActive ? 'bg-[#046C3F] text-white shadow-md' : 'text-[#53545C] hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className={isParentActive ? 'text-white' : 'text-[#53545C]'} />
                  <span className="grow text-sm font-poppins font-medium text-left">{item.name}</span>
                </Link>
              )}

              {item.children && isExpanded && (
                <div className="pl-10 space-y-1 mt-1 border-l-2 border-gray-50 ml-6">
                  {item.children.map((subItem) => {
                    const isSubActive = pathname === subItem.path;
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.path}
                        className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-poppins font-medium transition-colors ${
                          isSubActive
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-[#53545C] hover:text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 border-t border-gray-50 mb-4">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
          <Settings size={20} className="text-[#53545C]" />
          <span className="text-sm font-poppins font-medium">System Settings</span>
        </Link>
        <Link href="/logout" className="flex items-center gap-3 px-4 py-3 text-[#F33131] hover:bg-red-50 rounded-2xl transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-poppins font-medium">Logout</span>
        </Link>
      </div>
    </aside>
    </>
  );
};