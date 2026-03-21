import React from 'react';
import Head from 'next/head';
import { 
  Home, 
  Search, 
  ChevronDown, 
  ListFilter, 
  ArrowLeft, 
  ArrowRight, 
  UploadCloud 
} from 'lucide-react';
import { Sidebar } from '@/src/components/adminDashboard/generics/sidebar';
import Header from '@/src/components/adminDashboard/generics/header';

// Mock data for the audit logs
const auditLogs = [
  { user: "Dr. Adaeze Nwosu", action: "User Login", module: "Authentication", timestamp: "2026-03-08 08:42:15", ip: "192.168.1.14", status: "Success" },
  { user: "System Admin", action: "Password Reset: Chioma Eze", module: "Security", timestamp: "2026-03-08 08:31:02", ip: "192.168.1.1", status: "warning" },
  { user: "Fatima Belio", action: "Role Changed: Nurse → Doctor", module: "User Management", timestamp: "2026-03-08 08:15:44", ip: "192.168.1.1", status: "Info" },
  { user: "Unknown (IP: 10.0.0.45)", action: "Failed Login Attempt", module: "Authentication", timestamp: "2026-03-08 07:58:33", ip: "192.168.1.18", status: "Critical" },
  { user: "System Admin", action: "System Settings Updated", module: "System", timestamp: "2026-03-08 07:44:00", ip: "192.168.1.1", status: "Info" },
  { user: "Emeka Okafor", action: "User Login", module: "Authentication", timestamp: "2026-03-08 07:58:33", ip: "192.168.1.1", status: "Success" },
  { user: "System Admin", action: "System Settings Updated", module: "System", timestamp: "2026-03-08 07:44:00", ip: "192.168.1.1", status: "Info" },
  { user: "Unknown (IP: 10.0.0.45)", action: "Failed Login Attempt", module: "Authentication", timestamp: "2026-03-08 07:44:00", ip: "192.168.1.1", status: "warning" },
  { user: "System Admin", action: "System Settings Updated", module: "System", timestamp: "2026-03-08 07:44:00", ip: "192.168.1.1", status: "Info" },
  { user: "Dr John .A", action: "User Login", module: "Authentication", timestamp: "2026-03-08 07:44:00", ip: "192.168.1.1", status: "Success" },
];

// Helper to style status badges
const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success': return 'bg-[#D2F1DF] text-[#046C3F]';
    case 'warning': return 'bg-[#FFE5D3] text-[#FF8433]';
    case 'info': return 'bg-[#E0F2FE] text-[#0284C7]';
    case 'critical': return 'bg-[#FEE2E2] text-[#DC2626]';
    default: return 'bg-gray-100 text-gray-600';
  }
};

export default function AuditLogsPage() {

     const auditlogsBreadcrumbs = [
    { label: 'System Logs' },
    { label: 'Audit logs', active: true }
  ];
  return (
    <>
      <Head>
        <title>Audit Logs - System Logs | PHC EHR</title>
      </Head>

      <div className="min-h-screen flex bg-[#F6F7F9]">
        {/* Modular Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 =flex flex-col">
          {/* Modular Header */}
          <Header title="Dashboard" breadcrumbs={auditlogsBreadcrumbs}/>

          {/* Page Body */}
          <div className="p-8">

            {/* Title & Export Section */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h2>
                <p className="text-gray-600">Track user actions, logins, role changes, and record access</p>
              </div>
              <button className="bg-[#046C3F] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 hover:bg-[#035a34] transition-colors shadow-sm">
                <UploadCloud size={20} />
                Export
              </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Internal Table Filters */}
              <div className="p-6 flex items-center justify-between border-b border-gray-50">
                <h3 className="font-bold text-gray-700 text-lg">Recent Audit Logs</h3>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search Logs..." 
                      className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
                    />
                  </div>
                  
                  {['All Modules', 'All Status', 'Date Range'].map((filter) => (
                    <button key={filter} className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 flex items-center gap-2 bg-white hover:bg-gray-50">
                      {filter} <ChevronDown size={14} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-500 text-[13px] font-bold border-b border-gray-50">
                      <th className="px-6 py-4">User <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                      <th className="px-6 py-4">Action <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                      <th className="px-6 py-4">Module <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                      <th className="px-6 py-4">Timestamp <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                      <th className="px-6 py-4">IP Address <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                      <th className="px-6 py-4 text-center">Status <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {auditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{log.user}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{log.action}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{log.module}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{log.timestamp}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{log.ip}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block min-w-[80px] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyles(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Section */}
              <div className="p-6 flex items-center justify-center gap-4 border-t border-gray-50">
                <button className="flex items-center gap-2 text-sm text-gray-400 font-medium px-4 hover:text-gray-600 transition-colors">
                  <ArrowLeft size={16} /> Previous
                </button>
                
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 rounded-lg bg-[#2D2D2D] text-white text-sm font-bold">1</button>
                  <button className="w-9 h-9 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100">2</button>
                  <button className="w-9 h-9 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100">3</button>
                  <span className="px-2 text-gray-400 font-bold">...</span>
                  <button className="w-9 h-9 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100">67</button>
                  <button className="w-9 h-9 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100">68</button>
                </div>

                <button className="flex items-center gap-2 text-sm text-gray-800 font-bold px-4 hover:opacity-70 transition-opacity">
                  Next <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}