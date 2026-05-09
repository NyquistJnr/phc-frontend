"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import {
  ActionButton,
  StatusBadge,
} from "@/src/components/generic/ui/TableHelpers";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";

type VitalsStatus = "Vitals Pending" | "Waiting" | "Completed";
type Priority = "Urgent" | "High" | "Normal" | "Low";

type VitalsRow = {
  patientId: string;
  patientName: string;
  ageGender: string;
  visitType: string;
  priority: Priority;
  status: VitalsStatus;
};

const VISIT_TYPES = [
  "ANC",
  "General",
  "Immunization",
  "Postnatal",
  "Consultation",
  "Follow-up",
  "Lab Test",
];
const PRIORITY_OPTIONS = ["All Priority", "Urgent", "High", "Normal", "Low"];
const STATUS_OPTIONS = ["All Status", "Vitals Pending", "Waiting", "Completed"];

const INITIAL_ROWS: VitalsRow[] = [
  ["Ngozi Eze", "45 / M", "ANC", "Urgent", "Vitals Pending"],
  ["Emeka Dike", "45 / F", "General", "High", "Vitals Pending"],
  ["Amina Bello", "45 / M", "Immunization", "Normal", "Waiting"],
  ["Chukwu Obi", "45 / F", "Postnatal", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Normal", "Waiting"],
  ["Kemi Adeyemi", "45 / F", "Follow - Up", "Urgent", "Vitals Pending"],
  ["Kemi Adeyemi", "45 / M", "Lab Test", "Urgent", "Vitals Pending"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / F", "General", "High", "Waiting"],
  ["Amina Bello", "45 / M", "ANC", "Normal", "Completed"],
].map(([patientName, ageGender, visitType, priority, status]) => ({
  patientId: "PAT-PLT-000234",
  patientName,
  ageGender,
  visitType,
  priority: priority as Priority,
  status: status as VitalsStatus,
}));

const priorityColors: Record<Priority, { bg: string; text: string }> = {
  Urgent: { bg: "#FDE8E8", text: "#F33131" },
  High: { bg: "#FDE8E8", text: "#F33131" },
  Normal: { bg: "#FFF4E5", text: "#1F2937" },
  Low: { bg: "#DFF3EA", text: "#039855" },
};

const statusColors: Record<VitalsStatus, { bg: string; text: string }> = {
  "Vitals Pending": { bg: "#FDE8E8", text: "#F33131" },
  Waiting: { bg: "#FFF4E5", text: "#1F2937" },
  Completed: { bg: "#DFF3EA", text: "#039855" },
};

export default function VitalsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [rows, setRows] = useState<VitalsRow[]>(INITIAL_ROWS);
  const [searchTerm, setSearchTerm] = useState("");
  const [visitFilter, setVisitFilter] = useState("All Visit Types");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !normalizedSearch ||
        [row.patientId, row.patientName, row.ageGender, row.visitType].some(
          (value) => value.toLowerCase().includes(normalizedSearch),
        );
      const matchesVisit =
        visitFilter === "All Visit Types" || row.visitType === visitFilter;
      const matchesPriority =
        priorityFilter === "All Priority" || row.priority === priorityFilter;
      const matchesStatus =
        statusFilter === "All Status" || row.status === statusFilter;

      return matchesSearch && matchesVisit && matchesPriority && matchesStatus;
    });
  }, [priorityFilter, rows, searchTerm, statusFilter, visitFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  const columns: ColumnDef<VitalsRow>[] = [
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Age/Gender", accessorKey: "ageGender", sortable: true },
    { header: "Visit Type", accessorKey: "visitType", sortable: true },
    {
      header: "Priority",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.priority}
          bgColorHex={priorityColors[row.priority].bg}
          textColorHex={priorityColors[row.priority].text}
        />
      ),
    },
    {
      header: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.status}
          bgColorHex={statusColors[row.status].bg}
          textColorHex={statusColors[row.status].text}
        />
      ),
    },
    {
      header: "Action",
      sortable: true,
      render: (row) => (
        <ActionButton
          label={row.status === "Completed" ? "View" : "Record Vitals"}
          variant={row.status === "Completed" ? "soft" : "solid"}
          onClick={() => {
            // Routing to the creation page. You can pass query parameters if needed.
            router.push("/nurse-dashboard/vitals/new");
          }}
        />
      ),
    },
  ];

  const emptyMessage =
    rows.length === 0
      ? "No patients waiting for vitals."
      : "No patients match your criteria.";

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Vitals"
        breadcrumbs={[{ label: "Vitals" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Record Patient Vitals
            </h2>
            <p className="text-base text-[#3F3F46]">
              Take and save patient vital signs
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/nurse-dashboard/vitals/new")}
            className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
          >
            <Plus size={20} />
            Record New Vital
          </button>
        </div>

        <DataTable
          title="Today's Patient waiting for vital"
          data={paginatedRows}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient name or ID"
          onSearch={setSearchTerm}
          totalPages={
            filteredRows.length > itemsPerPage ? totalPages : undefined
          }
          emptyMessage={emptyMessage}
          toolbarActions={
            <>
              <CustomDropdown
                options={["All Visit Types", ...VISIT_TYPES]}
                selected={visitFilter}
                onSelect={setVisitFilter}
              />
              <CustomDropdown
                options={PRIORITY_OPTIONS}
                selected={priorityFilter}
                onSelect={setPriorityFilter}
              />
              <CustomDropdown
                options={STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={setStatusFilter}
              />
            </>
          }
        />
      </div>
    </div>
  );
}
