"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import { FACILITY_USAGE_DATA } from "./UsageAnalytics";

// Extend with more rows for pagination demo
const ALL_ROWS = [
  ...FACILITY_USAGE_DATA,
  ...Array.from({ length: 58 }, (_, i) => ({
    id: `FAC-PLT-${String(i + 11).padStart(3, "0")}`,
    name: "PHC Ajah",
    users: 123,
    logins: 98,
    lastActive: "last month",
    status: "Active" as const,
  })),
];

const ITEMS_PER_PAGE = 13;

function statusStyle(status: string) {
  if (status === "Active") return "bg-[#D2F1DF] text-[#046C3F]";
  if (status === "Low Activity") return "bg-[#FFF3CD] text-[#B45309]";
  return "bg-[#FFE0E0] text-[#D32F2F]";
}

export default function FacilityUsageFullTable() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ALL_ROWS.length / ITEMS_PER_PAGE);
  const rows = ALL_ROWS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const breadcrumbs = [
    { label: "User Management" },
    { label: "Usage Analytics", href: "/state-dashboard/system-monitoring" },
    { label: "View All table", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="System Monitoring" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 space-y-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Title + Export */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Facility Usage table</h2>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#046C3F] text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-[#035a34] transition-colors">
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50">
            <h3 className="font-bold text-gray-800 text-sm">Facility Usage Table</h3>
            <span className="text-xs font-semibold text-[#046C3F] flex items-center gap-1 cursor-default">
              View all →
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-50">
                  {["Facility ID", "Facility Name", "Users", "Logins", "Last Active", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3">
                      <span className="flex items-center gap-1">
                        {h}
                        <svg width="10" height="12" viewBox="0 0 10 12" className="opacity-30">
                          <path d="M5 0L9 4H1L5 0Z" fill="currentColor" />
                          <path d="M5 12L1 8H9L5 12Z" fill="currentColor" />
                        </svg>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row, i) => (
                  <tr key={`${row.id}-${i}`} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.id}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.name}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.users.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.logins}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{row.lastActive}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
