import React from 'react';
import { Sidebar } from '@/src/components/adminDashboard/generics/sidebar';
import Header  from '@/src/components/adminDashboard/generics/header';
import { Search, ChevronDown, ListFilter, ArrowLeft, ArrowRight } from 'lucide-react';

const users = Array(10).fill({
  id: "STF-PLT-000045",
  name: "Dr. Abubakar Musa",
  role: "Doctor",
  facility: "PHC Surulere",
  date: "Mar 5, 2026, 07:15 AM",
  status: "Active"
}).map((u, i) => ({ ...u, role: i % 2 === 0 ? "Doctor" : "Nurse", status: i % 2 === 0 ? "Active" : "Inactive" }));

export default function ModifyUser() {
   const modifyuserBreadcrumbs = [
    { label: 'User Management' },
    { label: 'Modify User', active: true }
  ];
  return (
    <div className="min-h-screen flex bg-[#F6F7F9]">
      <Sidebar />

      <main className="flex-1 flex flex-col">
        <Header title="User Management" breadcrumbs={modifyuserBreadcrumbs}/>

        <div className="p-8">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Modify User</h2>
            <p className="text-gray-500 text-sm mt-1">Search for a user and update their account information.</p>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Table Filters */}
            <div className="p-6 flex items-center justify-between border-b border-gray-50">
              <h3 className="font-bold text-gray-700">Modify User</h3>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by staff ID, name, role or facility...." 
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs w-72 focus:outline-none"
                  />
                </div>
                
                {['All Role', 'All Status', 'Date Range'].map((filter) => (
                  <button key={filter} className="px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 flex items-center gap-2 bg-white">
                    {filter} <ChevronDown size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Data Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-500 text-[13px] font-medium border-b border-gray-50">
                  <th className="px-6 py-4">Staff ID <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                  <th className="px-6 py-4">Name <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                  <th className="px-6 py-4">Role <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                  <th className="px-6 py-4">Facility <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                  <th className="px-6 py-4">Date Created <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                  <th className="px-6 py-4">Status <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                  <th className="px-6 py-4">Action <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{user.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.facility}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        user.status === 'Active' ? 'bg-[#D2F1DF] text-[#046C3F]' : 'bg-[#FFE5D3] text-[#FF8433]'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-[#1AC073] font-bold text-sm hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="p-6 flex items-center justify-center gap-2 border-t border-gray-50">
              <button className="flex items-center gap-2 text-sm text-gray-400 font-medium px-4">
                <ArrowLeft size={16} /> Previous
              </button>
              
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-md bg-[#2D2D2D] text-white text-sm font-bold">1</button>
                {[2, 3].map(n => (
                  <button key={n} className="w-8 h-8 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-100">{n}</button>
                ))}
                <span className="px-2 text-gray-400">...</span>
                {[67, 68].map(n => (
                  <button key={n} className="w-8 h-8 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-100">{n}</button>
                ))}
              </div>

              <button className="flex items-center gap-2 text-sm text-gray-800 font-bold px-4">
                Next <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}