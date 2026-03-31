"use client";

import React, { useState, useMemo } from 'react';
import { Search, UploadCloud } from 'lucide-react';
import Header from '@/src/components/adminDashboard/generics/header';
import DataTable, { Column } from '@/src/components/adminDashboard/generics/DataTable';
import Pagination from '@/src/components/adminDashboard/generics/Pagination';
import FilterDropdown from '@/src/components/adminDashboard/generics/FilterDropdown';

interface DatabaseLogRow {
  [key: string]: unknown;
  module: string;
  logType: string;
  queryEvent: string;
  severity: string;
  timestamp: string;
}

const allDatabaseLogs: DatabaseLogRow[] = [
  { module: "Patient Records", logType: "Query Execution", queryEvent: "SELECT patient_data", severity: "Info", timestamp: "2026-03-08 08:42:15" },
  { module: "Authentication", logType: "Database Error", queryEvent: "Connection timeout", severity: "warning", timestamp: "2026-03-08 08:31:02" },
  { module: "User Management", logType: "Connection Event", queryEvent: "UPDATE user_role", severity: "Error", timestamp: "2026-03-08 08:15:44" },
  { module: "Facility Management", logType: "Data Update", queryEvent: "UPDATE facility", severity: "Critical", timestamp: "2026-03-08 07:58:33" },
  { module: "Patient Records", logType: "Query Execution", queryEvent: "SELECT patient_data", severity: "Info", timestamp: "2026-03-08 07:44:00" },
  { module: "Patient Records", logType: "Query Execution", queryEvent: "SELECT patient_data", severity: "Error", timestamp: "2026-03-08 07:58:33" },
  { module: "Patient Records", logType: "Query Execution", queryEvent: "SELECT patient_data", severity: "Info", timestamp: "2026-03-08 07:44:00" },
  { module: "Patient Records", logType: "Query Execution", queryEvent: "SELECT patient_data", severity: "warning", timestamp: "2026-03-08 07:44:00" },
  { module: "Patient Records", logType: "Query Execution", queryEvent: "SELECT patient_data", severity: "Info", timestamp: "2026-03-08 07:44:00" },
  { module: "Patient Records", logType: "Query Execution", queryEvent: "SELECT patient_data", severity: "Critical", timestamp: "2026-03-08 07:44:00" },
];

const getSeverityStyles = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'info': return 'bg-[#E0F2FE] text-[#0284C7]';
    case 'warning': return 'bg-[#FFF5EB] text-[#F97316]';
    case 'error': 
    case 'critical': return 'bg-[#FEE2E2] text-[#DC2626]';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const ITEMS_PER_PAGE = 10;

export default function DatabaseLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLogs = useMemo(() => {
    return allDatabaseLogs.filter(log => {
      const matchSearch = searchQuery === '' ||
        log.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.queryEvent.toLowerCase().includes(searchQuery.toLowerCase());
      const matchModule = moduleFilter === 'All' || log.module === moduleFilter;
      const matchSeverity = severityFilter === 'All' || log.severity === severityFilter;
      // Date filter logic would go here in a real application
      return matchSearch && matchModule && matchSeverity;
    });
  }, [searchQuery, moduleFilter, severityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE));
  const pagedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const columns: Column<DatabaseLogRow>[] = [
    { key: 'module', label: 'Module', sortable: true, className: 'text-gray-600' },
    { key: 'logType', label: 'Log Type', sortable: true, className: 'text-gray-600' },
    { key: 'queryEvent', label: 'Query/Event', sortable: true, className: 'text-gray-600' },
    {
      key: 'severity', label: 'Severity', sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${getSeverityStyles(row.severity)}`}>
          {row.severity}
        </span>
      ),
    },
    { key: 'timestamp', label: 'Timestamp', sortable: true, className: 'text-gray-600' },
    {
      key: 'action', label: 'Action', sortable: false,
      render: () => (
        <button className="text-sm font-semibold text-[#2A6543] hover:underline">
          View
        </button>
      ),
    },
  ];

  const breadcrumbs = [
    { label: 'System Logs' },
    { label: 'Database logs', active: true }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="Dashboard" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        
        {/* Page Title & Export Container */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Database Logs</h1>
            <p className="text-gray-600">Monitor database queries, errors, and performance activities across the system.</p>
          </div>
          <button className="bg-[#2A6543] text-white px-5 sm:px-6 py-3 rounded-xl font-semibold flex items-center gap-3 hover:bg-[#235337] transition-colors shadow-sm self-start">
            <UploadCloud size={20} />
            Export
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Table Controls (Title + Filters) */}
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-[17px]">Database Logs Table</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search Logs..." 
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full sm:w-[220px] focus:outline-none focus:border-[#2A6543] focus:ring-1 focus:ring-[#2A6543]"
                />
              </div>
              
              <FilterDropdown 
                label="Database module" 
                options={['All', 'Patient Records', 'Authentication', 'User Management', 'Facility Management']} 
                selected={moduleFilter} 
                onChange={(v) => { setModuleFilter(v); setCurrentPage(1); }} 
              />
              <FilterDropdown 
                label="All Severity" 
                options={['All', 'Info', 'warning', 'Error', 'Critical']} 
                selected={severityFilter} 
                onChange={(v) => { setSeverityFilter(v); setCurrentPage(1); }} 
              />
              <FilterDropdown 
                label="Date Range" 
                options={['All', 'Today', 'Last 7 Days', 'Last 30 Days']} 
                selected={dateFilter} 
                onChange={(v) => { setDateFilter(v); setCurrentPage(1); }} 
              />
            </div>
          </div>

          {/* Reusable Data Table */}
          <DataTable columns={columns} data={pagedLogs} />
          
          {/* Reusable Pagination */}
          <div className="p-4 sm:p-6 border-t border-gray-50">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>

        </div>
      </div>
    </div>
  );
}