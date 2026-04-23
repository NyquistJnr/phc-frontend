"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";

interface Patient {
  id: string;
  name: string;
  ageGender: string;
  lastVisit: string;
  condition: string;
}

const PATIENTS: Patient[] = [
  { id: "PAT-PLT-000234", name: "Musa Abdullahi",  ageGender: "35 / F", lastVisit: "Today",          condition: "Malaria" },
  { id: "PAT-PLT-000234", name: "Amina Yusuf",     ageGender: "35 / F", lastVisit: "Yesterday",      condition: "Hypertension" },
  { id: "PAT-PLT-000234", name: "Fatima Ibrahim",  ageGender: "35 / F", lastVisit: "3 days ago",     condition: "ANC (32wks)" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "7 days ago",     condition: "UTI" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "O: 1/160 (high)",condition: "Fever" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "13 Apr",         condition: "Fever" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "13 Apr",         condition: "Fever" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "13 Apr",         condition: "Fever" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "13 Apr",         condition: "Fever" },
  { id: "PAT-PLT-000234", name: "Bayo Ogunleye",   ageGender: "35 / F", lastVisit: "13 Apr",         condition: "Fever" },
];

const TABLE_HEADERS = ["Patient ID", "Patient Name", "Age/Gender", "Last Visit", "Condition", "Action"];

export default function PatientList() {
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [page, setPage] = useState(1);

  const breadcrumbs = [{ label: "Patients", active: true }];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Patients" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Patient</h1>
          <p className="text-sm text-gray-500 mt-1">Search and view patient records</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Patients</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by patient name or ID"
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 w-52 focus:outline-none focus:ring-1 focus:ring-[#1AC073] bg-white"
                />
              </div>

              {/* Last Visit — reuses the shared PeriodFilterButton wrapped in a bordered button style */}
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white">
                <PeriodFilterButton label="Last Visit" />
              </div>

              {/* Gender */}
              <FilterDropdown
                label="Gender"
                options={["All", "Male", "Female"]}
                selected={gender}
                onChange={setGender}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {TABLE_HEADERS.map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">{h} <ChevronDown size={12} /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PATIENTS.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-600 font-medium">{p.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-800 font-semibold">{p.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.ageGender}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.lastVisit}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{p.condition}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/doctor-dashboard/patients/${i + 1}`}
                        className="text-sm font-semibold"
                        style={{ color: "#046C3F" }}
                      >
                        View profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={page} totalPages={68} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
