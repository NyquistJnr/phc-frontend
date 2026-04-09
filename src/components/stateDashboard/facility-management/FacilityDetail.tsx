"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Calendar } from "lucide-react";
import Header from "@/src/components/adminDashboard/generics/header";
import { useFacility } from "@/src/hooks/useFacilities";

const inputStyles =
  "block w-full border border-gray-200 rounded-xl px-5 py-3.5 text-base text-gray-900 bg-white";

const labelStyles =
  "absolute -top-2.5 left-4 bg-white px-1.5 text-xs text-gray-600 font-medium z-10";

function ReadonlyField({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string | null;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <label className={labelStyles}>{label}</label>
      <div className={`${inputStyles} text-gray-700`}>
        {value || (
          <span className="text-gray-400">{placeholder ?? "—"}</span>
        )}
      </div>
    </div>
  );
}

function ReadonlyDropdownField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="relative">
      <label className={labelStyles}>{label}</label>
      <div className={`${inputStyles} flex items-center`}>
        <span className="flex-1 text-gray-700">{value || "—"}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400 shrink-0">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-lg bg-[#E8F7F0] flex items-center justify-center shrink-0">
        <Building2 size={18} className="text-[#046C3F]" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

export default function FacilityDetail({ facilityId }: { facilityId: string }) {
  const router = useRouter();
  const { data: facility, isLoading } = useFacility(facilityId);

  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "View Facility", href: "/state-dashboard/facility-management/view-facility" },
    { label: "View", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="flex-1 p-4 sm:p-8 space-y-4">
        {/* Back button */}
        <button
          onClick={() => router.push("/state-dashboard/facility-management/view-facility")}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex items-center justify-center text-sm text-gray-400">
            Loading facility details...
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 space-y-8">

            {/* ── Facility Information ─────────────────────────── */}
            <section>
              <SectionHeader title="Facility Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                <ReadonlyField label="Facility Name" value={facility?.name} />
                <ReadonlyField label="Facility ID" value={facility?.code} />
                <ReadonlyDropdownField label="Facility Level" value={facility?.level} />
                <ReadonlyDropdownField label="State" value={facility?.state} />
                <ReadonlyDropdownField label="LGA" value={facility?.lga} />
              </div>
            </section>

            {/* ── Facility Contact Information ─────────────────── */}
            <section className="pt-6 border-t border-gray-100">
              <SectionHeader title="Facility Contact Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
                {/* Facility Address */}
                <ReadonlyField label="Facility Address" value={facility?.address} />

                {/* Code + Phone side by side */}
                <div className="grid grid-cols-[110px_1fr] gap-x-4">
                  <div className="relative">
                    <label className={labelStyles}>Code</label>
                    <div className={`${inputStyles} flex items-center gap-2`}>
                      <div className="w-5 h-5 rounded-sm flex overflow-hidden shrink-0">
                        <div className="w-1/3 h-full bg-[#006C35]" />
                        <div className="w-1/3 h-full bg-white" />
                        <div className="w-1/3 h-full bg-[#006C35]" />
                      </div>
                      <span className="text-gray-700">+234</span>
                      <svg className="ml-auto shrink-0" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <label className={labelStyles}>Phone Number</label>
                    <div className={`${inputStyles} text-gray-700`}>
                      {facility?.manager_phone?.replace("+234", "") || "—"}
                    </div>
                  </div>
                </div>

                {/* Date Created */}
                <div className="relative">
                  <label className={labelStyles}>Date Created</label>
                  <div className={`${inputStyles} flex items-center gap-3`}>
                    <Calendar size={16} className="text-gray-400 shrink-0" />
                    <span className="text-gray-700">
                      {facility?.created_at
                        ? new Date(facility.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* Status toggle — readonly, reflects real state */}
                <div className="flex flex-col gap-2 justify-center">
                  <span className="text-xs text-gray-600 font-medium">Status</span>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-6 rounded-full relative flex items-center shrink-0 border border-transparent ${
                        facility?.is_active ? "bg-[#046C3F]" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`w-[18px] h-[18px] bg-white rounded-full shadow-sm transform transition-transform ${
                          facility?.is_active ? "translate-x-[22px]" : "translate-x-1"
                        }`}
                      >
                        {facility?.is_active && (
                          <svg viewBox="0 0 12 12" fill="none" className="w-full h-full p-0.5">
                            <path d="M2 6L4.5 8.5L10 3" stroke="#046C3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">
                      Active / Inactive
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
