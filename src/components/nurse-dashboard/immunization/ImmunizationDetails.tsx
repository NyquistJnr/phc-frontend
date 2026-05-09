"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Baby, CalendarDays, Loader2, MapPin, Syringe } from "lucide-react";

import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { useImmunizationRecord } from "@/src/hooks/nurses/use-immunization";

const statusColors: Record<string, { bg: string; text: string }> = {
  COMPLETED: { bg: "#DFF3EA", text: "#039855" },
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
      <dt className="text-xs font-medium text-[#62636C]">{label}</dt>
      <dd className="mt-1 text-base font-medium text-gray-900">
        {value || "—"}
      </dd>
    </div>
  );
}

export default function ImmunizationDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: record, isLoading, isError } = useImmunizationRecord(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F7FC]">
        <div className="flex flex-col items-center gap-3 text-[#046C3F]">
          <Loader2 size={32} className="animate-spin" />
          <p className="font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F6F7FC]">
        <NurseDashboardHeader
          title="Immunization"
          breadcrumbs={[
            { label: "Immunization", href: "/nurse-dashboard/immunization" },
            { label: "Details" },
          ]}
        />
        <div className="px-4 py-6 sm:px-6 lg:py-8">
          <NurseBackButton
            onClick={() => router.push("/nurse-dashboard/immunization")}
          />
          <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
            <p>
              Failed to load immunization record. It may have been deleted or
              doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const badgeColor = statusColors[record.status] || {
    bg: "#F3F4F6",
    text: "#374151",
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Immunization"
        breadcrumbs={[
          { label: "Immunization", href: "/nurse-dashboard/immunization" },
          { label: "Record Details" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton
          onClick={() => router.push("/nurse-dashboard/immunization")}
        />

        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Immunization Record
            </h2>
            <p className="text-base text-[#3F3F46]">
              Detailed view of the vaccination administration
            </p>
          </div>
          <div>
            <StatusBadge
              label={record.status}
              bgColorHex={badgeColor.bg}
              textColorHex={badgeColor.text}
            />
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F7F0] text-[#046C3F]">
                <Baby size={18} />
              </span>
              <h3 className="text-lg font-semibold text-gray-900">
                Patient Details
              </h3>
            </div>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem label="Patient Name" value={record.patient_name} />
              <DetailItem
                label="Patient ID"
                value={record.patient_display_id}
              />
              <DetailItem
                label="Age at Vaccination"
                value={record.age_at_vaccination}
              />
            </dl>
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F7F0] text-[#046C3F]">
                <Syringe size={18} />
              </span>
              <h3 className="text-lg font-semibold text-gray-900">
                Vaccine Information
              </h3>
            </div>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem label="Vaccine Given" value={record.vaccine_name} />
              <DetailItem
                label="Date of Visit"
                value={
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-gray-400" />
                    {new Date(record.date_of_visit).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </div>
                }
              />
              <DetailItem
                label="Administered By"
                value={record.administered_by_name || "Unknown"}
              />
            </dl>

            {record.notes && (
              <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
                <dt className="text-xs font-medium text-[#62636C]">
                  Clinical Notes
                </dt>
                <dd className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                  {record.notes}
                </dd>
              </div>
            )}
          </section>
          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F7F0] text-[#046C3F]">
                <MapPin size={18} />
              </span>
              <h3 className="text-lg font-semibold text-gray-900">
                Location Details
              </h3>
            </div>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem label="Session Type" value={record.session_type} />
              <DetailItem label="State" value={record.state} />
              <DetailItem label="LGA" value={record.lga} />
              <DetailItem label="Ward" value={record.ward} />
              {record.site_name && (
                <DetailItem label="Site Name" value={record.site_name} />
              )}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
