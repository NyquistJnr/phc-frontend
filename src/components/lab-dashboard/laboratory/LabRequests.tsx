"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, FileUp, PlusCircle } from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import LabDateRangeFilter from "@/src/components/lab-dashboard/generics/LabDateRangeFilter";
import {
  LabRequest,
  LabTest,
} from "@/src/components/lab-dashboard/home/types";
import { useAdvancedLabRequests } from "@/src/hooks/laboratory/use-laboratory";
import LabActionMenu from "./LabActionMenu";
import { labBadgeColors } from "./labData";

const priorityOptions = ["All Priority", "NORMAL", "URGENT"];
const statusOptions = [
  "All Status",
  "PENDING",
  "PARTIAL",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
];

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

const firstPendingTestId = (tests?: LabTest[]) =>
  tests?.find((test) => test.test_status !== "RESULT_READY")?.id ||
  tests?.[0]?.id;

export default function LabRequests() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("All Priority");
  const [status, setStatus] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const { data, isLoading } = useAdvancedLabRequests({
    page: 1,
    page_size: 10,
    search,
    priority: priority === "All Priority" ? undefined : priority,
    status,
    start_date: startDate,
    end_date: endDate,
  });

  const requests = data?.results || [];

  const requestColumns: ColumnDef<LabRequest>[] = [
    { header: "Lab request ID", accessorKey: "request_id", sortable: true },
    { header: "Patient ID", accessorKey: "patient_display_id", sortable: true },
    { header: "Patient Name", accessorKey: "patient_name", sortable: true },
    {
      header: "Test Type",
      sortable: true,
      render: (row) =>
        row.tests?.length
          ? row.tests.map((test) => test.test_name).join(", ")
          : "-",
    },
    { header: "Requested by", accessorKey: "requested_by_name", sortable: true },
    {
      header: "Priority",
      sortable: true,
      render: (row) => {
        const color = getBadgeColor(row.priority);
        return (
          <StatusBadge
            label={formatLabel(row.priority)}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
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
        const color = getBadgeColor(row.status);
        return (
          <StatusBadge
            label={formatLabel(row.status)}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Action",
      sortable: false,
      render: (row) => {
        const testId = firstPendingTestId(row.tests);
        const actions = [
          {
            label: "View Request",
            icon: Eye,
            onClick: () => router.push(`/lab-dashboard/laboratory/${row.id}`),
          },
          ...(testId
            ? [
                {
                  label: "Enter Result",
                  icon: PlusCircle,
                  onClick: () =>
                    router.push(
                      `/lab-dashboard/laboratory/new?test_id=${testId}&request_id=${row.id}`,
                    ),
                },
              ]
            : []),
          {
            label: "Export",
            icon: FileUp,
            onClick: () => {
              setToast("Export started");
              setTimeout(() => setToast(null), 2500);
            },
          },
        ];

        return <LabActionMenu items={actions} />;
      },
    },
  ];

  return (
    <>
      <DataTable
        title="Lab Request"
        data={requests}
        columns={requestColumns}
        showSearch
        searchPlaceholder="Search by patient name or ID"
        onSearch={setSearch}
        toolbarActions={
          <>
            <LabDateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onApply={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              onClear={() => {
                setStartDate("");
                setEndDate("");
              }}
            />
            <CustomDropdown
              options={priorityOptions}
              selected={priority}
              onSelect={setPriority}
            />
            <CustomDropdown
              options={statusOptions}
              selected={status}
              onSelect={setStatus}
            />
          </>
        }
        totalPages={data?.total_pages}
        emptyMessage={
          isLoading ? "Loading lab requests..." : "No lab requests found."
        }
      />
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[350px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
          <span className="mt-0.5 h-6 w-6 rounded-lg border border-[#9ADDBA] bg-[#E8F7F0]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">{toast}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-900">
            x
          </button>
        </div>
      )}
    </>
  );
}
