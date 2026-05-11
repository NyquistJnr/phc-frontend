"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Beaker,
  Calendar,
  ClipboardList,
  PlusCircle,
  UserRound,
} from "lucide-react";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import { LabTest } from "@/src/components/lab-dashboard/home/types";
import { useLabRequestById } from "@/src/hooks/laboratory/use-laboratory";
import { Field, SectionTitle, TextArea } from "./LabSharedUI";
import { labBadgeColors } from "./labData";

type LabRequestDetailData = {
  id: string;
  request_id?: string;
  patient_name?: string;
  patient_display_id?: string;
  appointment?: string;
  requested_by_name?: string;
  priority?: string;
  clinical_notes?: string;
  status?: string;
  created_at?: string;
  tests?: LabTest[];
};

const formatDate = (date?: string | null) =>
  date ? new Date(date).toLocaleDateString() : "-";

const formatLabel = (value?: string | null) => {
  if (!value) return "-";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("-");
};

const getBadgeColor = (value?: string | null) => {
  const label = formatLabel(value);
  return (
    labBadgeColors[label as keyof typeof labBadgeColors] || {
      bg: "#FFF4E5",
      text: "#1F2937",
    }
  );
};

export default function LabRequestDetail() {
  const params = useParams();
  const requestId = String(params?.id || "");
  const { data, isLoading } = useLabRequestById(requestId);
  const request = data as LabRequestDetailData | undefined;

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader
        title="Laboratory"
        breadcrumbs={[
          { label: "Laboratory", href: "/lab-dashboard/laboratory" },
          { label: "Request Detail" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <Link
          href="/lab-dashboard/laboratory"
          className="mb-8 inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#046C3F] transition-colors hover:bg-[#F8FAF9]"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        {isLoading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Loading lab request...
          </div>
        ) : !request ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Lab request not found.
          </div>
        ) : (
          <div className="rounded-xl bg-white px-6 py-7 lg:px-8">
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold text-black sm:text-3xl">
                {request.request_id || "Lab Request"}
              </h1>
              <StatusBadge
                label={formatLabel(request.status)}
                bgColorHex={getBadgeColor(request.status).bg}
                textColorHex={getBadgeColor(request.status).text}
              />
            </div>

            <SectionTitle icon={<UserRound size={18} />} title="Patient Info" />
            <div className="mb-8 grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-3">
              <Field label="Patient" value={request.patient_name || "-"} readOnly />
              <Field
                label="Patient ID"
                value={request.patient_display_id || "-"}
                readOnly
              />
              <Field label="Appointment ID" value={request.appointment || "-"} readOnly />
            </div>

            <SectionTitle
              icon={<ClipboardList size={18} />}
              title="Request Details"
            />
            <div className="mb-8 grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-3">
              <Field
                label="Requested By"
                value={request.requested_by_name || "-"}
                readOnly
              />
              <Field label="Priority" value={formatLabel(request.priority)} readOnly />
              <Field
                label="Request Date"
                value={formatDate(request.created_at)}
                icon={<Calendar size={22} />}
                readOnly
              />
              <div className="md:col-span-3">
                <TextArea
                  label="Clinical notes for lab"
                  value={request.clinical_notes || "-"}
                  readOnly
                />
              </div>
            </div>

            <SectionTitle icon={<Beaker size={18} />} title="Tests" />
            <div className="space-y-4">
              {(request.tests || []).map((test) => (
                <div
                  key={test.id}
                  className="grid gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-[1fr_1fr_1fr_auto]"
                >
                  <Field label="Test Name" value={test.test_name || "-"} readOnly />
                  <Field
                    label="Sample Type"
                    value={test.sample_type || "-"}
                    readOnly
                  />
                  <div className="flex items-center">
                    <StatusBadge
                      label={formatLabel(test.test_status)}
                      bgColorHex={getBadgeColor(test.test_status).bg}
                      textColorHex={getBadgeColor(test.test_status).text}
                    />
                  </div>
                  <Link
                    href={`/lab-dashboard/laboratory/new?test_id=${test.id}&request_id=${request.id}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#046C3F] px-4 text-sm font-medium text-white"
                  >
                    <PlusCircle size={17} />
                    Enter Result
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
