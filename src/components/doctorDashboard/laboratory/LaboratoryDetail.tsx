"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, TestTube } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { useLabRequestById } from "@/src/hooks/doctors/use-doctors";
import type { LabRequestRecord } from "@/src/hooks/doctors/use-doctors";

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
  PARTIAL: { bg: "#E2E7FF", text: "#046C3F" },
  COMPLETED: { bg: "#DFF3EA", text: "#039855" },
  CANCELLED: { bg: "#FDE8E8", text: "#F33131" },
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="mb-1 text-xs text-[#62636C]">{label}</p>
      <p className="whitespace-pre-wrap text-sm font-medium text-gray-900">
        {value || "N/A"}
      </p>
    </div>
  );
}

export default function LabRequestDetail() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, isError } = useLabRequestById(id);
  const labRequest = data as LabRequestRecord | undefined;

  const status = labRequest?.status || "PENDING";
  const color = statusColors[status] || { bg: "#F3F4F6", text: "#374151" };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Laboratory"
        breadcrumbs={[
          { label: "Laboratory", href: "/doctor-dashboard/laboratory" },
          { label: "Details", active: true },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <Link
          href="/doctor-dashboard/laboratory"
          className="mb-8 inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#046C3F] transition-colors hover:bg-[#F8FAF9]"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        {isLoading ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
            Loading lab request details...
          </div>
        ) : isError || !labRequest ? (
          <div className="rounded-xl bg-white p-8 text-center text-red-500 shadow-sm">
            Failed to load lab request details.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
                  Lab Request Detail
                </h2>
                <p className="text-base text-[#3F3F46]">
                  {labRequest.request_id || labRequest.id}
                </p>
              </div>
              <StatusBadge
                label={status.charAt(0) + status.slice(1).toLowerCase()}
                bgColorHex={color.bg}
                textColorHex={color.text}
              />
            </div>

            {/* Request Information Section */}
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
                <TestTube size={20} className="text-[#046C3F]" />
                Request Information
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DetailItem label="Patient" value={labRequest.patient_name} />
                <DetailItem
                  label="Patient ID"
                  value={labRequest.patient_display_id}
                />
                <DetailItem label="Priority" value={labRequest.priority} />
                <DetailItem
                  label="Requested By"
                  value={labRequest.requested_by_name}
                />
                <DetailItem
                  label="Date Requested"
                  value={new Date(labRequest.created_at).toLocaleString()}
                />
                <DetailItem
                  label="Clinical Notes"
                  value={labRequest.clinical_notes}
                />
              </div>
            </section>

            {/* Lab Tests Section */}
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Lab Tests & Results
              </h3>
              <div className="space-y-4">
                {labRequest.tests?.length ? (
                  labRequest.tests.map((test) => (
                    <div
                      key={test.id}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-4"
                    >
                      {/* Test Header */}
                      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-2">
                        <h4 className="font-semibold text-gray-800">
                          {test.test_name}
                        </h4>
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                          {test.test_status.replace(/_/g, " ")}
                        </span>
                      </div>

                      {/* Test Details Grid */}
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                        <DetailItem
                          label="Sample Type"
                          value={test.sample_type}
                        />
                        <DetailItem
                          label="Linked Item"
                          value={test.linked_item_name}
                        />
                        <DetailItem
                          label="Result"
                          value={
                            test.result_value
                              ? `${test.result_value} ${test.result_unit || ""}`.trim()
                              : null
                          }
                        />
                        <DetailItem
                          label="Test Method"
                          value={test.test_method}
                        />
                        <DetailItem
                          label="Interpretation"
                          value={test.result_interpretation}
                        />
                        <DetailItem
                          label="Result Notes"
                          value={test.result_notes}
                        />
                        <DetailItem
                          label="Result Date"
                          value={
                            test.result_date
                              ? new Date(test.result_date).toLocaleString()
                              : null
                          }
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    No laboratory tests found for this request.
                  </p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
