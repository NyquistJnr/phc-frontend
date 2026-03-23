"use client";

import React, { useState, useMemo } from 'react';
import { Search, UploadCloud } from 'lucide-react';
import Header from '@/src/components/adminDashboard/generics/header';
import DataTable, { Column } from '@/src/components/adminDashboard/generics/DataTable';
import Pagination from '@/src/components/adminDashboard/generics/Pagination';
import FilterDropdown from '@/src/components/adminDashboard/generics/FilterDropdown';

interface AuditRow {
  [key: string]: unknown;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  ip: string;
  status: string;
}

const allAuditLogs: AuditRow[] = [
  { user: "Dr. Adaeze Nwosu", action: "User Login", module: "Authentication", timestamp: "2026-03-08 08:42:15", ip: "192.168.1.14", status: "Success" },
  { user: "System Admin", action: "Password Reset: Chioma Eze", module: "Security", timestamp: "2026-03-08 08:31:02", ip: "192.168.1.1", status: "Warning" },
  { user: "Fatima Belio", action: "Role Changed: Nurse → Doctor", module: "User Management", timestamp: "2026-03-08 08:15:44", ip: "192.168.1.1", status: "Info" },
  { user: "Unknown (IP: 10.0.0.45)", action: "Failed Login Attempt", module: "Authentication", timestamp: "2026-03-08 07:58:33", ip: "192.168.1.18", status: "Critical" },
  { user: "System Admin", action: "System Settings Updated", module: "System", timestamp: "2026-03-08 07:44:00", ip: "192.168.1.1", status: "Info" },
  { user: "Emeka Okafor", action: "User Login", module: "Authentication", timestamp: "2026-03-08 07:58:33", ip: "192.168.1.1", status: "Success" },
  { user: "System Admin", action: "System Settings Updated", module: "System", timestamp: "2026-03-08 07:44:00", ip: "192.168.1.1", status: "Info" },
  { user: "Unknown (IP: 10.0.0.45)", action: "Failed Login Attempt", module: "Authentication", timestamp: "2026-03-08 07:44:00", ip: "192.168.1.1", status: "Warning" },
  { user: "System Admin", action: "System Settings Updated", module: "System", timestamp: "2026-03-08 07:44:00", ip: "192.168.1.1", status: "Info" },
  { user: "Dr John .A", action: "User Login", module: "Authentication", timestamp: "2026-03-08 07:44:00", ip: "192.168.1.1", status: "Success" },
];

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success': return 'bg-[#D2F1DF] text-[#046C3F]';
    case 'warning': return 'bg-[#FFE5D3] text-[#FF8433]';
    case 'info': return 'bg-[#E0F2FE] text-[#0284C7]';
    case 'critical': return 'bg-[#FEE2E2] text-[#DC2626]';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const ITEMS_PER_PAGE = 10;

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = useMemo(() => {
    return allAuditLogs.filter(log => {
      const matchSearch = searchQuery === '' ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase());
      const matchModule = moduleFilter === 'All' || log.module === moduleFilter;
      const matchStatus = statusFilter === 'All' || log.status === statusFilter;
      return matchSearch && matchModule && matchStatus;
    });
  }, [searchQuery, moduleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const pagedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const columns: Column<AuditRow>[] = [
    { key: 'user', label: 'User', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'module', label: 'Module', sortable: true },
    { key: 'timestamp', label: 'Timestamp', sortable: true, className: 'font-mono' },
    { key: 'ip', label: 'IP Address', sortable: true },
    {
      key: 'status', label: 'Status', sortable: true, className: 'text-center',
      render: (row) => (
        <span className={`inline-block min-w-[80px] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusStyles(row.status)}`}>
          {row.status}
        </span>
      ),
    },
  ];

  const breadcrumbs = [
    { label: 'System Logs' },
    { label: 'Audit Logs', active: true }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="System Logs" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Audit Logs</h2>
            <p className="text-gray-600">Track user actions, logins, role changes, and record access</p>
          </div>
          <button className="bg-[#046C3F] text-white px-5 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-3 hover:bg-[#035a34] transition-colors shadow-sm self-start">
            <UploadCloud size={20} />
            Export
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50">
            <h3 className="font-bold text-gray-700 text-lg">Recent Audit Logs</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search Logs..." 
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
                />
              </div>
              
              <FilterDropdown label="All Modules" options={['All', 'Authentication', 'Security', 'User Management', 'System']} selected={moduleFilter} onChange={(v) => { setModuleFilter(v); setCurrentPage(1); }} />
              <FilterDropdown label="All Status" options={['All', 'Success', 'Warning', 'Info', 'Critical']} selected={statusFilter} onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }} />
            </div>
          </div>

          <DataTable columns={columns} data={pagedLogs} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}