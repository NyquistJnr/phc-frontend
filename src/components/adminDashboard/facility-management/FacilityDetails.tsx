"use client";

import { useSession } from "next-auth/react";
import { Users, Loader2, Building2, UserCircle, ActivitySquare, CheckCircle2 } from "lucide-react";
import Header from "@/src/components/adminDashboard/generics/header";
import MetricCard from "@/src/components/adminDashboard/generics/MetricCard";
import { useItAdminFacilityInfo } from "@/src/hooks/useItAdminDashboard";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";

export default function FacilityDetails() {
  const { data: session } = useSession();
  const { data: facility, isLoading } = useItAdminFacilityInfo();

  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "My Facility Details", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 space-y-6">
        <div className="mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Facility Details
          </h2>
          <p className="text-gray-600 font-medium">
            View detailed information about your assigned facility.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
            <p className="text-sm font-medium">Fetching facility details...</p>
          </div>
        ) : facility ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                icon={Users}
                title="Total Patients"
                value={String(facility.patient_count || 0)}
                colorClass="bg-[#046C3F] text-white"
              />
              <MetricCard
                icon={UserCircle}
                title="Total Staff"
                value={String(facility.staff_count || 0)}
                colorClass="bg-white border border-gray-100"
              />
              <MetricCard
                icon={ActivitySquare}
                title="Departments"
                value={String(facility.department_count || 0)}
                colorClass="bg-white border border-gray-100"
              />
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">General Information</h3>
                  <p className="text-sm text-gray-500 mt-1">Key details and identifiers for this facility.</p>
                </div>
                <StatusBadge 
                  label={facility.is_active ? "Active" : "Suspended"} 
                  bgColorHex={facility.is_active ? "#D2F1DF" : "#FFE5D3"}
                  textColorHex={facility.is_active ? "#046C3F" : "#FF8433"}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <DetailItem label="Facility Code" value={facility.code} />
                <DetailItem label="Facility Name" value={facility.name} />
                <DetailItem label="Facility Type" value={facility.facility_type} />
                <DetailItem label="Facility Level" value={facility.level} />
                <DetailItem label="State" value={facility.state} />
                <DetailItem label="LGA" value={facility.lga} />
                <DetailItem label="Ward" value={facility.ward} />
                <DetailItem label="Address" value={facility.address} />
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Management Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-[#EAF7F1] flex items-center justify-center text-[#046C3F] shrink-0">
                      <UserCircle size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Facility Manager</p>
                      <p className="font-semibold text-gray-900 text-lg">{facility.manager_name || "N/A"}</p>
                      {(facility as any).manager_email && (
                        <p className="text-sm text-gray-500 mt-1">{(facility as any).manager_email}</p>
                      )}
                      {(facility as any).manager_phone && (
                        <p className="text-sm text-gray-500">{(facility as any).manager_phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">IT Admin</p>
                      <p className="font-semibold text-gray-900 text-lg">{facility.it_admin_name || "N/A"}</p>
                      {(facility as any).it_admin_email && (
                        <p className="text-sm text-gray-500 mt-1">{(facility as any).it_admin_email}</p>
                      )}
                      {(facility as any).it_admin_phone && (
                        <p className="text-sm text-gray-500">{(facility as any).it_admin_phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <Building2 className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Facility Found</h3>
            <p className="text-gray-500">You are not currently assigned to any facility or the facility data is unavailable.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1.5">{label}</p>
      <p className="font-semibold text-gray-900">{value || "N/A"}</p>
    </div>
  );
}
