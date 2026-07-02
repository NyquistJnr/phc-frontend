"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Edit,
  Eye,
  Globe,
  MoreHorizontal,
  User,
} from "lucide-react";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";

import {
  usePatientDetails,
  usePatientHistory,
  usePatientLabRequests,
  usePatientPrescriptions,
  usePatientReferrals,
} from "@/src/hooks/nurses/use-patients";
import { useUpdateReferralStatus } from "@/src/hooks/nurses/use-referrals";
import type { PatientReferral } from "@/src/components/nurse-dashboard/patients/type";

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
  const [filters, setFilters] = useState({ page: 1, page_size: 10 });
  const { data, isLoading } = usePatientHistory(patientId, filters);

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
        {
          header: "Action",
          sortable: false,
          render: (row) => (
            <Link
              href={`/nurse-dashboard/appointments/${row.rawId}`}
              className="text-[#046C3F] font-medium hover:underline"
            >
              View
            </Link>
          ),
        },
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
  const { data, isLoading } = usePatientLabRequests(patientId, filters);

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
          <NurseDateRangeFilter
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
        {
          header: "Action",
          sortable: false,
          render: (row) => (
            <Link
              href={`/nurse-dashboard/lab/${row.rawId}`}
              className="text-[#046C3F] font-medium hover:underline"
            >
              View
            </Link>
          ),
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
  const { data, isLoading } = usePatientPrescriptions(patientId, filters);

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
          <NurseDateRangeFilter
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
        {
          header: "Action",
          sortable: false,
          render: (row) => (
            <Link
              href={`/nurse-dashboard/meds/${row.rawId}`}
              className="text-[#046C3F] font-medium hover:underline"
            >
              View
            </Link>
          ),
        },
      ]}
    />
  );
}

const REFERRAL_STATUS_OPTIONS = ["All Status", "PENDING", "ACCEPTED", "REJECTED"];
const REFERRAL_DIRECTION_OPTIONS = ["All Directions", "inbound", "outbound"];

const referralStatusColors: Record<string, { bg: string; text: string }> = {
  ACCEPTED: { bg: "#DFF3EA", text: "#039855" },
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
  REJECTED: { bg: "#FDE8E8", text: "#F33131" },
};

function FacilityCell({
  name,
  isDestination,
}: {
  name: string | null;
  isDestination?: boolean;
}) {
  if (name) {
    return <span className="font-medium text-gray-700">{name}</span>;
  }
  return (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-gray-300 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500">
      <Globe size={12} className="text-gray-400" />
      <span>{isDestination ? "External Destination" : "External Origin"}</span>
    </div>
  );
}

function ReferralActionMenu({ row }: { row: PatientReferral }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(row.status);
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateReferralStatus();

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const top =
        rect.bottom + 100 > window.innerHeight
          ? rect.top + window.scrollY - 100 - 4
          : rect.bottom + window.scrollY + 4;
      const left = Math.max(
        12 + window.scrollX,
        rect.right - 192 + window.scrollX,
      );
      setCoords({ top, left });
    }
    setOpen((c) => !c);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleUpdateStatus = () => {
    setErrorMsg("");
    updateStatus(
      { id: row.id, status: selectedStatus },
      {
        onSuccess: () => setShowStatusModal(false),
        onError: (error: unknown) => {
          const maybeError = error as {
            response?: { data?: { errors?: { detail?: string }; message?: string } };
          };
          setErrorMsg(
            maybeError?.response?.data?.errors?.detail ||
              maybeError?.response?.data?.message ||
              "Failed to update status. Please try again.",
          );
        },
      },
    );
  };

  const items = [
    {
      label: "View Detail",
      icon: Eye,
      onClick: () => router.push(`/nurse-dashboard/referrals/${row.id}`),
      className: "text-gray-700",
    },
  ];

  if (row.direction?.toLowerCase() === "inbound") {
    items.push({
      label: "Update Status",
      icon: Edit,
      onClick: () => setShowStatusModal(true),
      className: "text-gray-700",
    });
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <MoreHorizontal size={18} />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: coords.top, left: coords.left }}
            className="absolute z-[999] w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 ${item.className}`}
                >
                  <Icon size={16} className={item.className} /> {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}

      {showStatusModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Update Referral Status
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Change the status for referral <b>{row.referral_id}</b>.
              </p>

              {errorMsg && (
                <div className="mb-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                  {errorMsg}
                </div>
              )}

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
              >
                {REFERRAL_STATUS_OPTIONS.filter((s) => s !== "All Status").map(
                  (status) => (
                    <option key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </option>
                  ),
                )}
              </select>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setErrorMsg("");
                    setSelectedStatus(row.status);
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="rounded-lg bg-[#046C3F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
                >
                  {isUpdating ? "Saving..." : "Save Status"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function ReferralsTab({ patientId }: { patientId: string }) {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 10,
    status: "All Status",
    direction: "All Directions",
    start_date: "",
    end_date: "",
  });
  const { data } = usePatientReferrals(patientId, filters);

  const columns: ColumnDef<PatientReferral>[] = [
    { header: "Referral ID", accessorKey: "referral_id", sortable: true },
    {
      header: "Direction",
      sortable: true,
      render: (row) => {
        const isInbound = row.direction?.toLowerCase() === "inbound";
        return (
          <div
            className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isInbound
                ? "bg-blue-50 text-blue-700"
                : "bg-purple-50 text-purple-700"
            }`}
          >
            {isInbound ? (
              <ArrowDownLeft size={14} />
            ) : (
              <ArrowUpRight size={14} />
            )}
            <span className="capitalize">{row.direction || "Unknown"}</span>
          </div>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "referral_type",
      sortable: true,
      render: (row) => (
        <span className="capitalize">
          {row.referral_type?.toLowerCase() || "-"}
        </span>
      ),
    },
    {
      header: "Referring Facility",
      sortable: true,
      render: (row) => <FacilityCell name={row.referring_facility_name} />,
    },
    {
      header: "Receiving Facility",
      sortable: true,
      render: (row) => (
        <FacilityCell name={row.receiving_facility_name} isDestination />
      ),
    },
    {
      header: "Referred By",
      accessorKey: "referred_by_name",
      sortable: true,
    },
    {
      header: "Date",
      sortable: true,
      render: (row) => formatDate(row.created_at),
    },
    {
      header: "Status",
      sortable: true,
      render: (row) => {
        const colorData = referralStatusColors[row.status] || {
          bg: "#F3F4F6",
          text: "#374151",
        };
        return (
          <StatusBadge
            label={row.status.charAt(0) + row.status.slice(1).toLowerCase()}
            bgColorHex={colorData.bg}
            textColorHex={colorData.text}
          />
        );
      },
    },
    {
      header: "Action",
      render: (row) => <ReferralActionMenu row={row} />,
    },
  ];

  return (
    <DataTable
      title="Patient Referrals"
      data={data?.results || []}
      columns={columns}
      showSearch={false}
      totalPages={data?.total_pages}
      emptyMessage="No referrals found."
      toolbarActions={
        <>
          <NurseDateRangeFilter
            startDate={filters.start_date}
            endDate={filters.end_date}
            onApply={(start, end) =>
              setFilters((prev) => ({
                ...prev,
                start_date: start,
                end_date: end,
                page: 1,
              }))
            }
            onClear={() =>
              setFilters((prev) => ({
                ...prev,
                start_date: "",
                end_date: "",
                page: 1,
              }))
            }
          />
          <CustomDropdown
            options={REFERRAL_DIRECTION_OPTIONS}
            selected={filters.direction}
            onSelect={(val) =>
              setFilters((prev) => ({ ...prev, direction: val, page: 1 }))
            }
          />
          <CustomDropdown
            options={REFERRAL_STATUS_OPTIONS}
            selected={filters.status}
            onSelect={(val) =>
              setFilters((prev) => ({ ...prev, status: val, page: 1 }))
            }
          />
        </>
      }
    />
  );
}

export default function PatientProfile({ onBack }: { onBack: () => void }) {
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
      <NurseDashboardHeader
        title="Patients"
        breadcrumbs={[
          { label: "Patients", href: "/nurse-dashboard/patients" },
          { label: "View Profile" },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={onBack} />
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
