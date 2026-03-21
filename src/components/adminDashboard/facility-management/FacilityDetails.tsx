import React from 'react';
import Head from 'next/head';
import {  
  Search, 
  ChevronDown, 
  ListFilter, 
  ArrowLeft, 
  ArrowRight,
  Eye,
  Edit2,
  MoreHorizontal
} from 'lucide-react';
import { Sidebar } from '@/src/components/adminDashboard/generics/sidebar';
import Header  from '@/src/components/adminDashboard/generics/header';

// Mock data for health facilities based on the image
const facilities = Array(10).fill(null).map((_, i) => ({
  code: "PHC-PLT-000234",
  name: "PHC-PLT-ABWOR DYIS",
  state: "Plateau State",
  lga: "Pankshin LGA",
  status: i % 2 === 0 ? "Active" : "Inactive"
}));

export default function FacilityDetails() {

    const facilityBreadcrumbs = [
    { label: 'Facility Management' },
    { label: 'Facility Details', active: true }
  ];

  return (
    <>
      <Head>
        <title>Facility Details - Facility Management | PHC EHR</title>
      </Head>

      <div className="min-h-screen flex bg-[#F6F7F9]">
        {/* Persistent Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {/* Persistent Header */}
          <Header title="Facility Management" breadcrumbs={facilityBreadcrumbs}/>

          {/* Page Body */}
          <div className="p-8">

            {/* Title Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Facility Details</h2>
              <p className="text-gray-600 font-medium">View and manage registered health facilities.</p>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Table Header & Search Filters */}
              <div className="p-6 flex items-center justify-between border-b border-gray-50">
                <h3 className="font-bold text-gray-700 text-lg">Facilities</h3>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search by Facility Code, name, state or LGA...." 
                      className="pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm w-87.5 focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
                    />
                  </div>
                  
                  {['State', 'LGA', 'Status'].map((filter) => (
                    <button key={filter} className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 flex items-center gap-2 bg-white hover:bg-gray-50">
                      {filter} <ChevronDown size={14} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Facility Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-500 text-[13px] font-bold border-b border-gray-50">
                      <th className="px-6 py-4">Facility Code <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                      <th className="px-6 py-4">Facility Name <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                      <th className="px-6 py-4">State <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                      <th className="px-6 py-4">LGA <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                      <th className="px-6 py-4">Status <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                      <th className="px-6 py-4">Action <ListFilter size={14} className="inline ml-1 opacity-50" /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {facilities.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors relative group">
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.code}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.state}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{item.lga}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight ${
                            item.status === 'Active' ? 'bg-[#D2F1DF] text-[#046C3F]' : 'bg-[#FFE5D3] text-[#FF8433]'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 relative">
                          <button className="text-gray-400 hover:text-gray-600 p-1">
                            <MoreHorizontal size={20} />
                          </button>

                          {/* Action Dropdown Menu - Shown for the first row as in the image */}
                          {idx === 0 && (
                            <div className="absolute right-6 top-12 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 overflow-hidden">
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left font-medium">
                                <Eye size={16} className="text-gray-400" />
                                View Details
                              </button>
                              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left font-medium">
                                <Edit2 size={16} className="text-gray-400" />
                                Edit Facility
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Section */}
              <div className="p-6 flex items-center justify-center gap-4 border-t border-gray-50">
                <button className="flex items-center gap-2 text-sm text-gray-400 font-medium px-4 cursor-not-allowed">
                  <ArrowLeft size={16} /> Previous
                </button>
                
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 rounded-lg bg-[#2D2D2D] text-white text-sm font-bold">1</button>
                  <button className="w-9 h-9 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors">2</button>
                  <button className="w-9 h-9 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors">3</button>
                  <span className="px-2 text-gray-400 font-bold">...</span>
                  <button className="w-9 h-9 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors">67</button>
                  <button className="w-9 h-9 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors">68</button>
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