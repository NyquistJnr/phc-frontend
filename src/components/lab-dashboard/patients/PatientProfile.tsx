"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import LabDateRangeFilter from "@/src/components/lab-dashboard/generics/LabDateRangeFilter";

import {
  usePatientDetails,
  usePatientHistory,
  usePatientLabRequests,
  usePatientPrescriptions,
  usePatientReferrals,
} from "@/src/hooks/nurses/use-patients";

type ProfileTab =
  | "Demographics"
  | "History"
  | "Laboratory"
  | "Medications"
  | "Referrals";

const PROFILE_TABS: ProfileTab[] = [
  "Demographics",
  "History",
  "Laboratory",
  "Medications",
  "Referrals",
];

const badgeColors = {
  green: { bg: "#DFF3EA", text: "#039855" },
  red: { bg: "#FDE8E8", text: "#F33131" },
  amber: { bg: "#FFF4E5", text: "#1F2937" },
  gray: { bg: "#F3F4F6", text: "#374151" },
};

const formatDate = (isoString?: string) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusBadge = (status: string) => {
  const s = status.toUpperCase();
  const key = ["COMPLETED", "DISPENSED", "ACCEPTED", "ACTIVE"].includes(s)
    ? badgeColors.green
    : ["PENDING", "PARTIAL", "SCHEDULED"].includes(s)
      ? badgeColors.amber
      : ["REJECTED", "CANCELLED", "OUT OF STOCK"].includes(s)
        ? badgeColors.red
        : badgeColors.gray;

  return (
    <StatusBadge label={status} bgColorHex={key.bg} textColorHex={key.text} />
  );
};

function Field({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string | number;
  muted?: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white px-4 py-3">
      <p
        className={`mb-2 text-xs ${muted ? "text-gray-300" : "text-[#62636C]"}`}
      >
        {label}
      </p>
      <p className="text-base text-gray-500">{value || "-"}</p>
    </div>
  );
}

function ProfileTabs({
  active,
  onChange,
}: {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}) {
  return (
    <div className="mb-6 flex max-w-4xl items-center justify-between gap-4 overflow-x-auto">
      {PROFILE_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`min-w-32 border-b-4 px-4 pb-3 text-base transition-colors ${
            active === tab
              ? "border-[#046C3F] text-gray-900"
              : "border-transparent text-gray-400 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function GenericTable<T>({
  title,
  data,
  columns,
  searchPlaceholder,
  toolbar,
  totalPages,
}: {
  title: string;
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder: string;
  toolbar?: React.ReactNode;
  totalPages?: number;
}) {
  return (
    <DataTable
      title={title}
      data={data}
      columns={columns}
      showSearch
      searchPlaceholder={searchPlaceholder}
      toolbarActions={toolbar}
      totalPages={totalPages || 1}
      emptyMessage="No records found."
    />
  );
}

function DemographicsTab({ patientId }: { patientId: string }) {
  const { data: patient, isLoading } = usePatientDetails(patientId);

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading demographics...
      </div>
    );
  if (!patient)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load patient data
      </div>
    );

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9BCAB4] text-[#046C3F]">
          <User size={18} />
        </span>
        <h2 className="text-xl font-semibold text-black">Basic Information</h2>
      </div>

      <div className="max-w-4xl space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field
            label="Patient Name"
            value={`${patient.first_name} ${patient.middle_name || ""} ${patient.last_name}`}
          />
          <Field label="Patient ID" value={patient.profile?.patient_id} muted />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_2fr]">
          <Field label="Age" value={`${patient.profile?.age} years`} />
          <Field
            label="Gender"
            value={
              patient.profile?.sex === "M"
                ? "Male"
                : patient.profile?.sex === "F"
                  ? "Female"
                  : "Unknown"
            }
          />
          <Field
            label="Date of Birth"
            value={formatDate(patient.profile?.date_of_birth)}
            muted
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field
            label="Address"
            value={`${patient.address || "-"}, ${patient.state || ""}`}
          />
          <Field label="Phone Number" value={patient.phone_number} muted />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <CalendarDays size={22} className="text-gray-500" />
              <div>
                <p className="mb-2 text-xs text-[#62636C]">Registered On</p>
                <p className="text-base text-gray-500">
                  {formatDate(patient.created_at)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 px-8">
            <span
              className={`relative h-3 w-10 rounded-full ${patient.is_active ? "bg-[#74B497]" : "bg-gray-300"}`}
            >
              <span
                className={`absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full text-xs text-white ${patient.is_active ? "bg-[#046C3F]" : "bg-gray-500"}`}
              >
                {patient.is_active ? "✓" : "x"}
              </span>
            </span>
            <div>
              <p className="mb-4 text-sm text-gray-700">Status</p>
              <p className="text-sm text-gray-400">
                {patient.is_active ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryTab({ patientId }: { patientId: string }) {
  const [filters] = useState({ page: 1, page_size: 10 });
  const { data } = usePatientHistory(patientId, filters);

  const rows =
    data?.results?.map((apt) => ({
      rawId: apt.id,
      id: apt.appointment_id,
      date: formatDate(apt.appointment_date),
      diagnosis: apt.reason_for_visit || "-",
      doctor: apt.assigned_staff_name,
      notes: apt.notes || "-",
    })) || [];

  return (
    <GenericTable
      title="Appointment History"
      data={rows}
      totalPages={data?.total_pages}
      searchPlaceholder="Search patient by Diagnoses..."
      toolbar={
        <CustomDropdown
          options={["All Doctor"]}
          selected="All Doctor"
          onSelect={() => {}}
        />
      }
      columns={[
        { header: "Appointment ID", accessorKey: "id", sortable: true },
        { header: "Date", accessorKey: "date", sortable: true },
        { header: "Diagnoses", accessorKey: "diagnosis", sortable: true },
        { header: "Doctor", accessorKey: "doctor", sortable: true },
        { header: "Notes", accessorKey: "notes", sortable: true },
      ]}
    />
  );
}

function LaboratoryTab({ patientId }: { patientId: string }) {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    status: "All Status",
  });
  const { data } = usePatientLabRequests(patientId, filters);

  const rows =
    data?.results?.map((req) => ({
      rawId: req.id,
      id: req.request_id,
      date: formatDate(req.created_at),
      test: req.tests?.[0]?.test_name || "Multiple Tests",
      result: req.tests?.[0]?.result_value || "-",
      status: req.status,
    })) || [];

  return (
    <GenericTable
      title="Patient Laboratory Test"
      data={rows}
      totalPages={data?.total_pages}
      searchPlaceholder="Search patient by lab test..."
      toolbar={
        <>
          <LabDateRangeFilter
            startDate=""
            endDate=""
            onApply={() => {}}
            onClear={() => {}}
          />
          <CustomDropdown
            options={["All Status", "Completed", "Pending", "Partial"]}
            selected={filters.status}
            onSelect={(val) => setFilters((prev) => ({ ...prev, status: val }))}
          />
        </>
      }
      columns={[
        { header: "Lab Request ID", accessorKey: "id", sortable: true },
        { header: "Date", accessorKey: "date", sortable: true },
        { header: "Lab Test", accessorKey: "test", sortable: true },
        { header: "Result", accessorKey: "result", sortable: true },
        {
          header: "Status",
          sortable: true,
          render: (row) => statusBadge(row.status),
        },
      ]}
    />
  );
}

function MedicationsTab({ patientId }: { patientId: string }) {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    status: "All Status",
  });
  const { data } = usePatientPrescriptions(patientId, filters);

  const rows =
    data?.results?.map((pres) => ({
      rawId: pres.id,
      id: pres.prescription_id,
      date: formatDate(pres.created_at),
      drug: pres.items?.map((i) => i.medication_name).join(", ") || "-",
      dosage: pres.items?.[0]?.dosage || "-",
      duration: pres.items?.[0]?.duration || "-",
      frequency: pres.items?.[0]?.frequency || "-",
      status: pres.status,
    })) || [];

  return (
    <GenericTable
      title="Patient Medications"
      data={rows}
      totalPages={data?.total_pages}
      searchPlaceholder="Search patient by Drug name..."
      toolbar={
        <>
          <LabDateRangeFilter
            startDate=""
            endDate=""
            onApply={() => {}}
            onClear={() => {}}
          />
          <CustomDropdown
            options={["All Status", "Dispensed", "Pending", "Partial"]}
            selected={filters.status}
            onSelect={(val) => setFilters((prev) => ({ ...prev, status: val }))}
          />
        </>
      }
      columns={[
        { header: "Prescribed ID", accessorKey: "id", sortable: true },
        { header: "Date", accessorKey: "date", sortable: true },
        { header: "Drug Name", accessorKey: "drug", sortable: true },
        { header: "Dosage", accessorKey: "dosage", sortable: true },
        { header: "Duration", accessorKey: "duration", sortable: true },
        { header: "Frequency", accessorKey: "frequency", sortable: true },
        {
          header: "Status",
          sortable: true,
          render: (row) => statusBadge(row.status),
        },
      ]}
    />
  );
}

function ReferralsTab({ patientId }: { patientId: string }) {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    status: "All Status",
  });
  const { data } = usePatientReferrals(patientId, filters);

  const rows =
    data?.results?.map((ref) => ({
      rawId: ref.id,
      id: ref.referral_id,
      date: formatDate(ref.created_at),
      clinician: ref.referred_by_name || "-",
      facility: ref.receiving_facility_name || "-",
      type: ref.referral_type,
      reason: ref.reason_for_referral || "-",
      status: ref.status,
    })) || [];

  return (
    <GenericTable
      title="Patient Referrals"
      data={rows}
      totalPages={data?.total_pages}
      searchPlaceholder="Search patient by Clinician or Facility..."
      toolbar={
        <>
          <LabDateRangeFilter
            startDate=""
            endDate=""
            onApply={() => {}}
            onClear={() => {}}
          />
          <CustomDropdown
            options={["All Status", "Pending", "Accepted", "Rejected"]}
            selected={filters.status}
            onSelect={(val) => setFilters((prev) => ({ ...prev, status: val }))}
          />
        </>
      }
      columns={[
        { header: "Referral ID", accessorKey: "id", sortable: true },
        { header: "Date", accessorKey: "date", sortable: true },
        {
          header: "Referring Clinician",
          accessorKey: "clinician",
          sortable: true,
        },
        {
          header: "Receiving Facility",
          accessorKey: "facility",
          sortable: true,
        },
        { header: "Referral Type", accessorKey: "type", sortable: true },
        { header: "Reason", accessorKey: "reason", sortable: true },
        {
          header: "Status",
          sortable: true,
          render: (row) => statusBadge(row.status),
        },
      ]}
    />
  );
}

export default function PatientProfile() {
  const params = useParams();
  const patientId = params?.id as string;
  const [tab, setTab] = useState<ProfileTab>("Demographics");

  const title =
    tab === "Demographics"
      ? "Patient Profile"
      : tab === "History"
        ? "Patient History"
        : tab === "Laboratory"
          ? "Patient Laboratory Test"
          : tab === "Medications"
            ? "Patient Medications"
            : "Patient Referrals";

  if (!patientId) return <div>Invalid Patient URL</div>;

  return (
    <>
      <LabDashboardHeader
        title="Patients"
        breadcrumbs={[
          { label: "Patients", href: "/lab-dashboard/patients" },
          { label: "View Profile" },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <Link
          href="/lab-dashboard/patients"
          className="mb-8 inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#046C3F] transition-colors hover:bg-[#F8FAF9]"
        >
          <ArrowLeft size={15} />
          Back
        </Link>
        <h2 className="mb-9 text-2xl font-semibold text-black sm:text-3xl">
          {title}
        </h2>
        <ProfileTabs active={tab} onChange={setTab} />

        {tab === "Demographics" && <DemographicsTab patientId={patientId} />}
        {tab === "History" && <HistoryTab patientId={patientId} />}
        {tab === "Laboratory" && <LaboratoryTab patientId={patientId} />}
        {tab === "Medications" && <MedicationsTab patientId={patientId} />}
        {tab === "Referrals" && <ReferralsTab patientId={patientId} />}
      </div>
    </>
  );
}
