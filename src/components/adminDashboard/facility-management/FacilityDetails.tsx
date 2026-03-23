"use client";

import React, { useState, useMemo } from 'react';
import { Search, Eye, Edit2 } from 'lucide-react';
import Header from '@/src/components/adminDashboard/generics/header';
import DataTable, { Column } from '@/src/components/adminDashboard/generics/DataTable';
import Pagination from '@/src/components/adminDashboard/generics/Pagination';
import ActionMenu from '@/src/components/adminDashboard/generics/ActionMenu';
import FilterDropdown from '@/src/components/adminDashboard/generics/FilterDropdown';

interface FacilityRow {
  [key: string]: unknown;
  code: string;
  name: string;
  state: string;
  lga: string;
  status: string;
}

const allFacilities: FacilityRow[] = Array(25).fill(null).map((_, i) => ({
  code: `PHC-PLT-00023${i}`,
  name: "PHC-PLT-ABWOR DYIS",
  state: i % 2 === 0 ? "Plateau State" : "Lagos State",
  lga: i % 2 === 0 ? "Pankshin LGA" : "Ikeja LGA",
  status: i % 3 === 0 ? "Inactive" : "Active"
}));

const ITEMS_PER_PAGE = 10;

export default function FacilityDetails() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [lgaFilter, setLgaFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFacilities = useMemo(() => {
    return allFacilities.filter(f => {
      const matchSearch = searchQuery === '' ||
        f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.lga.toLowerCase().includes(searchQuery.toLowerCase());
      const matchState = stateFilter === 'All' || f.state === stateFilter;
      const matchLga = lgaFilter === 'All' || f.lga === lgaFilter;
      const matchStatus = statusFilter === 'All' || f.status === statusFilter;
      return matchSearch && matchState && matchLga && matchStatus;
    });
  }, [searchQuery, stateFilter, lgaFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE));
  const pagedData = filteredFacilities.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const columns: Column<FacilityRow>[] = [
    { key: 'code', label: 'Facility Code', sortable: true },
    { key: 'name', label: 'Facility Name', sortable: true },
    { key: 'state', label: 'State', sortable: true },
    { key: 'lga', label: 'LGA', sortable: true },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight ${
          row.status === 'Active' ? 'bg-[#D2F1DF] text-[#046C3F]' : 'bg-[#FFE5D3] text-[#FF8433]'
        }`}>{row.status}</span>
      ),
    },
    {
      key: 'action', label: 'Action',
      render: () => (
        <ActionMenu items={[
          { label: 'View Details', icon: Eye, onClick: () => {} },
          { label: 'Edit Facility', icon: Edit2, onClick: () => {} },
        ]} />
      ),
    },
  ];

  const breadcrumbs = [
    { label: 'Facility Management' },
    { label: 'Facility Details', active: true }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Facility Details</h2>
          <p className="text-gray-600 font-medium">View and manage registered health facilities.</p>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50">
            <h3 className="font-bold text-gray-700 text-lg">Facilities</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by Facility Code, name, state or LGA..." 
                  className="pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm w-full sm:w-80 focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
                />
              </div>
              
              <FilterDropdown label="State" options={['All', 'Plateau State', 'Lagos State']} selected={stateFilter} onChange={(v) => { setStateFilter(v); setCurrentPage(1); }} />
              <FilterDropdown label="LGA" options={['All', 'Pankshin LGA', 'Ikeja LGA']} selected={lgaFilter} onChange={(v) => { setLgaFilter(v); setCurrentPage(1); }} />
              <FilterDropdown label="Status" options={['All', 'Active', 'Inactive']} selected={statusFilter} onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }} />
            </div>
          </div>

          <DataTable columns={columns} data={pagedData} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}