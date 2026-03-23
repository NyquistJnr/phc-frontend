"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/src/components/adminDashboard/generics/header';
import { Search, Edit2, UserX, KeyRound, UserCheck, Plus, RotateCcw } from 'lucide-react';
import DataTable, { Column } from '@/src/components/adminDashboard/generics/DataTable';
import Pagination from '@/src/components/adminDashboard/generics/Pagination';
import ActionMenu from '@/src/components/adminDashboard/generics/ActionMenu';
import FilterDropdown from '@/src/components/adminDashboard/generics/FilterDropdown';
import Toast from '@/src/components/adminDashboard/generics/Toast';
import MetricCard from '@/src/components/adminDashboard/generics/MetricCard';

interface UserRow {
  [key: string]: unknown;
  id: string;
  name: string;
  role: string;
  facility: string;
  date: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

const allUsers: UserRow[] = Array(30).fill(null).map((_, i) => ({
  id: `STF-PLT-00004${i}`,
  name: i % 4 === 0 ? "Dr. Abubakar Musa" : i % 4 === 1 ? "Nurse Fatima Bello" : i % 4 === 2 ? "Dr. Gilbert Nwosu" : "Pharm. Amina Yusuf",
  role: i % 3 === 0 ? "Doctor" : i % 3 === 1 ? "Nurse" : "Lab Technician",
  facility: "PHC Surulere",
  date: "Mar 5, 2026, 07:15 AM",
  status: i % 5 === 0 ? 'Suspended' : i % 3 === 0 ? 'Inactive' : 'Active',
}));

const ITEMS_PER_PAGE = 10;

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState({ title: '', message: '', type: 'success' as const });

  const activeCount = allUsers.filter(u => u.status === 'Active').length;
  const suspendedCount = allUsers.filter(u => u.status === 'Suspended').length;

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchSearch = searchQuery === '' ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.facility.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      const matchStatus = statusFilter === 'All' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const pagedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const showToast = (title: string, message: string) => {
    setToastMsg({ title, message, type: 'success' });
    setToastVisible(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-[#D2F1DF] text-[#046C3F]';
      case 'Inactive': return 'bg-[#FFE5D3] text-[#FF8433]';
      case 'Suspended': return 'bg-[#FFE0E0] text-[#D32F2F]';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const columns: Column<UserRow>[] = [
    { key: 'id', label: 'Staff ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'facility', label: 'Facility', sortable: true },
    { key: 'date', label: 'Date Created', sortable: true },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (row) => (
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'action', label: 'Action',
      render: (row) => {
        const isSuspended = row.status === 'Suspended';
        return (
          <ActionMenu items={[
            { label: 'Modify', icon: Edit2, onClick: () => showToast('Modify User', `Opening edit form for ${row.name}`) },
            isSuspended
              ? { label: 'Reactivate', icon: RotateCcw, onClick: () => showToast('User Reactivated', `${row.name} has been reactivated`) }
              : { label: 'Suspend', icon: UserX, onClick: () => showToast('User Suspended', `${row.name} has been suspended`), variant: 'danger' as const },
            { label: 'Reset Password', icon: KeyRound, onClick: () => showToast('Password Reset', `Password reset email sent to ${row.name}`) },
          ]} />
        );
      },
    },
  ];

  const breadcrumbs = [
    { label: 'User Management', active: true }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="User Management" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 space-y-6">
        {/* Title row + Create button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-500 text-sm mt-1">Manage all user accounts across your facilities.</p>
          </div>
          <Link
            href="/dashboard/user-management/create-user"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#046C3F] text-white rounded-xl font-semibold shadow-md hover:bg-[#035a34] transition-colors text-sm"
          >
            <Plus size={18} />
            Create New User
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard icon={UserCheck} title="Active Users" value={String(activeCount)} colorClass="bg-white border border-gray-100" />
          <MetricCard icon={UserX} title="Suspended Users" value={String(suspendedCount)} colorClass="bg-white border border-gray-100" />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Filters */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50">
            <h3 className="font-bold text-gray-700">All Users</h3>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by staff ID, name, role or facility..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
                />
              </div>

              <FilterDropdown
                label="All Roles"
                options={['All', 'Doctor', 'Nurse', 'Lab Technician']}
                selected={roleFilter}
                onChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}
              />
              <FilterDropdown
                label="All Status"
                options={['All', 'Active', 'Inactive', 'Suspended']}
                selected={statusFilter}
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
              />
            </div>
          </div>

          <DataTable columns={columns} data={pagedUsers} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      <Toast
        type={toastMsg.type}
        title={toastMsg.title}
        message={toastMsg.message}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}