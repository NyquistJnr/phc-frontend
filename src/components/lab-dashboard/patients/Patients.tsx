"use client";

import { useMemo, useState } from "react";
import { CalendarDays, User } from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { ActionButton, StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import LabBackButton from "@/src/components/lab-dashboard/generics/LabBackButton";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";

type ProfileTab = "Demographics" | "History" | "Laboratory" | "Medications" | "Referrals";
type PatientStatus = "Awaiting Result" | "Processing" | "Completed";

type PatientRow = {
  patientId: string;
  patientName: string;
  ageGender: string;
  lastTest: string;
  status: PatientStatus;
};

const PROFILE_TABS: ProfileTab[] = [
  "Demographics",
  "History",
  "Laboratory",
  "Medications",
  "Referrals",
];

const PATIENTS: PatientRow[] = [
  ["PAT-PLT-000234", "Aisha Mohammed", "34 / F", "Malaria Test", "Completed"],
  ["PAT-PLT-000235", "Musa Abdullahi", "34 / M", "Urinalysis", "Awaiting Result"],
  ["PAT-PLT-000236", "Amina Yusuf", "29 / F", "Hemoglobin", "Processing"],
  ["PAT-PLT-000237", "Bayo Ogunleye", "41 / M", "Lipid Profile", "Completed"],
].map(([patientId, patientName, ageGender, lastTest, status]) => ({
  patientId,
  patientName,
  ageGender,
  lastTest,
  status: status as PatientStatus,
}));

const badgeColors = {
  green: { bg: "#DFF3EA", text: "#039855" },
  red: { bg: "#FDE8E8", text: "#F33131" },
  amber: { bg: "#FFF4E5", text: "#1F2937" },
};

function Field({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white px-4 py-3">
      <p className={`mb-2 text-xs ${muted ? "text-gray-300" : "text-[#62636C]"}`}>
        {label}
      </p>
      <p className="text-base text-gray-500">{value}</p>
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

function DemographicsTab() {
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
          <Field label="Patient Name" value="Aisha Mohammed" />
          <Field label="Patient ID" value="PAT-PLT-000234" muted />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_2fr]">
          <Field label="Age" value="34 years" />
          <Field label="Gender" value="Female" />
          <Field label="Date of Birth" value="12/12/2026" muted />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Address" value="21 Bukayo Street, Opebi salvation, Lagos." />
          <Field label="Phone Number" value="234 90 735 2293" muted />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-300 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <CalendarDays size={22} className="text-gray-500" />
              <div>
                <p className="mb-2 text-xs text-[#62636C]">Last Visited</p>
                <p className="text-base text-gray-500">12/12/2020</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 px-8">
            <span className="relative h-3 w-10 rounded-full bg-[#74B497]">
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#046C3F] text-xs text-white">
                ✓
              </span>
            </span>
            <div>
              <p className="mb-4 text-sm text-gray-700">Status</p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const statusBadge = (status: string) => {
  const color =
    status === "Completed" || status === "Dispensed"
      ? badgeColors.green
      : status === "Pending"
        ? badgeColors.amber
        : badgeColors.red;
  return <StatusBadge label={status} bgColorHex={color.bg} textColorHex={color.text} />;
};

function GenericTable<T>({
  title,
  data,
  columns,
  searchPlaceholder,
  toolbar,
}: {
  title: string;
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder: string;
  toolbar?: React.ReactNode;
}) {
  return (
    <DataTable
      title={title}
      data={data}
      columns={columns}
      showSearch
      searchPlaceholder={searchPlaceholder}
      toolbarActions={toolbar}
      totalPages={68}
      emptyMessage="No records found."
    />
  );
}

function HistoryTab() {
  const rows = Array.from({ length: 10 }, (_, index) => ({
    id: "ENC-PLT-000234",
    date: "12 Mar 2026",
    diagnosis: ["Malaria", "Typhoid", "URTI", "Follow-up"][index % 4],
    doctor: ["Dr. Suleiman", "Dr. Adamu", "Dr Ada", "Dr Musa"][index % 4],
    notes: "Fever, chills, weakness, headache",
  }));

  return (
    <GenericTable
      title="Encounter History"
      data={rows}
      searchPlaceholder="Search patient by Diagnoses..."
      toolbar={<CustomDropdown options={["All Doctor", "Dr. Suleiman", "Dr. Musa"]} selected="All Doctor" onSelect={() => {}} />}
      columns={[
        { header: "Encounter ID", accessorKey: "id", sortable: true },
        { header: "Date", accessorKey: "date", sortable: true },
        { header: "Diagnoses", accessorKey: "diagnosis", sortable: true },
        { header: "Doctor", accessorKey: "doctor", sortable: true },
        { header: "Notes", accessorKey: "notes", sortable: true },
        { header: "Action", sortable: true, render: () => <button className="text-[#046C3F]">View</button> },
      ]}
    />
  );
}

function LaboratoryTab() {
  const rows = Array.from({ length: 10 }, (_, index) => ({
    id: "LAB-PLT-000234",
    date: "12 Mar 2026",
    test: ["Malaria Test", "Blood Count", "Lipid Panel", "Hemoglobin A1c", "Basic Metabolic Panel (BMP)"][index % 5],
    result: index % 3 === 0 ? "Positive" : index % 3 === 1 ? "Negative" : "-",
    status: index % 3 === 2 ? "Pending" : "Completed",
  }));

  return (
    <GenericTable
      title="Patient Laboratory Test"
      data={rows}
      searchPlaceholder="Search patient by lab test..."
      toolbar={
        <>
          <DateRangeFilter startDate="" endDate="" onApply={() => {}} onClear={() => {}} />
          <CustomDropdown options={["All Result", "Positive", "Negative"]} selected="All Result" onSelect={() => {}} />
          <CustomDropdown options={["All Status", "Completed", "Pending"]} selected="All Status" onSelect={() => {}} />
        </>
      }
      columns={[
        { header: "Lab Request ID", accessorKey: "id", sortable: true },
        { header: "Date", accessorKey: "date", sortable: true },
        { header: "Lab Test", accessorKey: "test", sortable: true },
        { header: "Result", accessorKey: "result", sortable: true },
        { header: "Status", sortable: true, render: (row) => statusBadge(row.status) },
      ]}
    />
  );
}

function MedicationsTab() {
  const rows = Array.from({ length: 10 }, (_, index) => ({
    id: "PRC-PLT-000234",
    date: "12 Mar 2026",
    drug: "Artemether,  Paracetamol",
    dosage: index === 0 ? "2x daily" : "3x daily",
    duration: index === 0 ? "A day" : `${Math.min(index + 1, 7)} days`,
    frequency: ["Once daily", "Twice daily", "Three times daily", "Every 8 hours", "Every 12 hours"][index % 5],
    status: ["Dispensed", "Dispensed", "Pending", "cancelled", "Out of stock"][index % 5],
  }));

  return (
    <GenericTable
      title="Patient Laboratory Test"
      data={rows}
      searchPlaceholder="Search patient by Drug name..."
      toolbar={
        <>
          <DateRangeFilter startDate="" endDate="" onApply={() => {}} onClear={() => {}} />
          <CustomDropdown options={["All Status", "Dispensed", "Pending", "cancelled", "Out of stock"]} selected="All Status" onSelect={() => {}} />
        </>
      }
      columns={[
        { header: "Prescribed ID", accessorKey: "id", sortable: true },
        { header: "Date", accessorKey: "date", sortable: true },
        { header: "Drug Name", accessorKey: "drug", sortable: true },
        { header: "Dosage", accessorKey: "dosage", sortable: true },
        { header: "Duration", accessorKey: "duration", sortable: true },
        { header: "Frequency", accessorKey: "frequency", sortable: true },
        { header: "Status", sortable: true, render: (row) => statusBadge(row.status) },
      ]}
    />
  );
}

function ReferralsTab() {
  const rows = Array.from({ length: 10 }, (_, index) => ({
    id: "REF-PLT-000234",
    date: "12 Mar 2026",
    clinician: "General Clinic",
    facility: "General Hospital",
    type: ["Physical referral", "Telemedicine referral", "Emergency"][index % 3],
    reason: "Severe malaria",
    status: ["Completed", "Completed", "Pending", "cancelled"][index % 4],
  }));

  return (
    <GenericTable
      title="Patient Laboratory Test"
      data={rows}
      searchPlaceholder="Search patient by Clinician or Facility..."
      toolbar={
        <>
          <DateRangeFilter startDate="" endDate="" onApply={() => {}} onClear={() => {}} />
          <CustomDropdown options={["All Type", "Physical referral", "Telemedicine referral", "Emergency"]} selected="All Type" onSelect={() => {}} />
          <CustomDropdown options={["All Status", "Completed", "Pending", "cancelled"]} selected="All Status" onSelect={() => {}} />
        </>
      }
      columns={[
        { header: "Referral ID", accessorKey: "id", sortable: true },
        { header: "Date", accessorKey: "date", sortable: true },
        { header: "Referring Clinician", accessorKey: "clinician", sortable: true },
        { header: "Receiving Facility", accessorKey: "facility", sortable: true },
        { header: "Referral Type", accessorKey: "type", sortable: true },
        { header: "Reason", accessorKey: "reason", sortable: true },
        { header: "Status", sortable: true, render: (row) => statusBadge(row.status) },
      ]}
    />
  );
}

function PatientProfile({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<ProfileTab>("Demographics");
  const title =
    tab === "Demographics"
      ? "Patient Profile"
      : tab === "History"
        ? "Patient Encounter History"
        : tab === "Laboratory"
          ? "Patient Laboratory Test"
          : tab === "Medications"
            ? "Patient Medications"
            : "Patient Referrals";

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader
        title="Patients"
        breadcrumbs={[{ label: "Patients" }, { label: "View Profile" }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <LabBackButton onClick={onBack} />
        <h1 className="mb-9 text-2xl font-semibold text-black sm:text-3xl">{title}</h1>
        <ProfileTabs active={tab} onChange={setTab} />
        {tab === "Demographics" && <DemographicsTab />}
        {tab === "History" && <HistoryTab />}
        {tab === "Laboratory" && <LaboratoryTab />}
        {tab === "Medications" && <MedicationsTab />}
        {tab === "Referrals" && <ReferralsTab />}
      </div>
    </div>
  );
}

export default function Patients() {
  const [view, setView] = useState<"list" | "profile">("list");
  const [search, setSearch] = useState("");

  const filteredPatients = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return PATIENTS;
    return PATIENTS.filter((patient) =>
      [patient.patientId, patient.patientName, patient.lastTest].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [search]);

  if (view === "profile") return <PatientProfile onBack={() => setView("list")} />;

  const columns: ColumnDef<PatientRow>[] = [
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Age/Gender", accessorKey: "ageGender", sortable: true },
    { header: "Last Test", accessorKey: "lastTest", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => {
        const color =
          row.status === "Completed"
            ? badgeColors.green
            : row.status === "Processing"
              ? badgeColors.amber
              : badgeColors.red;
        return <StatusBadge label={row.status} bgColorHex={color.bg} textColorHex={color.text} />;
      },
    },
    {
      header: "Action",
      sortable: true,
      render: () => <ActionButton label="View" variant="soft" onClick={() => setView("profile")} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader title="Patients" breadcrumbs={[{ label: "Patients" }]} />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-black sm:text-3xl">Patients</h1>
          <p className="mt-2 text-base text-[#3F3F46]">
            View patient profiles and laboratory records
          </p>
        </div>
        <DataTable
          title="Patients"
          data={filteredPatients}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient name or ID"
          onSearch={setSearch}
          totalPages={68}
          emptyMessage="No patients found."
        />
      </div>
    </div>
  );
}
