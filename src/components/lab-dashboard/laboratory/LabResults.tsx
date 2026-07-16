"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, FileUp } from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import LabDateRangeFilter from "@/src/components/lab-dashboard/generics/LabDateRangeFilter";
import { LabTest } from "@/src/components/lab-dashboard/home/types";
import {
  useAdvancedLabRequests,
  useLabTests,
} from "@/src/hooks/laboratory/use-laboratory";
import LabActionMenu from "./LabActionMenu";
import { labBadgeColors, printLabResult } from "./labData";
import {
  EnrichedLabTest,
  buildLabTestContextMap,
  enrichLabTest,
} from "./labTestContext";

const statusOptions = [
  "All Status",
  "PENDING",
  "SAMPLE_COLLECTED",
  "PROCESSING",
  "RESULT_READY",
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

export default function LabResults() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const { data, isLoading } = useLabTests({
    page: 1,
    page_size: 10,
    search,
    test_status: status,
    start_date: startDate,
    end_date: endDate,
  });
  const { data: requestContextData } = useAdvancedLabRequests({
    page: 1,
    page_size: 200,
  });

  const contextMap = useMemo(
    () => buildLabTestContextMap(requestContextData?.results || []),
    [requestContextData?.results],
  );
  const results = useMemo(
    () =>
      ((data?.results || []) as LabTest[]).map((test) =>
        enrichLabTest(test, contextMap),
      ),
    [contextMap, data?.results],
  );

  const resultColumns: ColumnDef<EnrichedLabTest>[] = [
    {
      header: "Lab request ID",
      sortable: true,
      render: (row) => row.request_id || "-",
    },
    {
      header: "Patient ID",
      sortable: true,
      render: (row) => row.patient_display_id || "-",
    },
    {
      header: "Patient Name",
      sortable: true,
      render: (row) => row.patient_name || "-",
    },
    { header: "Lab Tests", accessorKey: "test_name", sortable: true },
    {
      header: "Result",
      sortable: true,
      render: (row) => row.result_value || "-",
    },
    {
      header: "Date",
      sortable: true,
      render: (row) => formatDate(row.result_date),
    },
    {
      header: "Status",
      sortable: true,
      render: (row) => {
        const color = getBadgeColor(row.test_status);
        return (
          <StatusBadge
            label={formatLabel(row.test_status)}
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
        const resultHref = row.lab_request_uuid
          ? `/lab-dashboard/laboratory/new?test_id=${row.id}&request_id=${row.lab_request_uuid}`
          : `/lab-dashboard/laboratory/new?test_id=${row.id}`;

        return (
          <LabActionMenu
            items={[
              {
                label: "View Result",
                icon: Eye,
                onClick: () => router.push(resultHref),
              },
              {
                label: "Export Result",
                icon: FileUp,
                onClick: () => {
                  const didPrint = printLabResult(row);
                  if (!didPrint) setToast("Unable to open the print window.");
                  else {
                    setToast("Export started");
                    setTimeout(() => setToast(null), 2500);
                  }
                },
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        title="Lab Results"
        data={results}
        columns={resultColumns}
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
              options={statusOptions}
              selected={status}
              onSelect={setStatus}
            />
          </>
        }
        totalPages={data?.total_pages}
        emptyMessage={
          isLoading ? "Loading lab results..." : "No lab results found."
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
