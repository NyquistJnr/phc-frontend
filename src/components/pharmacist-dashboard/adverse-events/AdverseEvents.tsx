"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import {
  useAdverseEvents,
  useDeleteAdverseEvent,
} from "@/src/hooks/pharmacist/use-adverse-events";
import type { AdverseEventReport } from "./type";

const STATUS_OPTIONS = [
  "All Status",
  "REPORTED",
  "UNDER_REVIEW",
  "RESOLVED",
  "CLOSED",
];
const SEVERITY_OPTIONS = [
  "All Severity",
  "MILD",
  "MODERATE",
  "SEVERE",
  "LIFE_THREATENING",
  "FATAL",
];
const PAGE_SIZES = ["10", "50", "100"];

const SEVERITY_COLORS: Record<string, { bg: string; text: string }> = {
  MILD: { bg: "#DDF2EA", text: "#00A556" },
  MODERATE: { bg: "#FFF4E5", text: "#B45309" },
  SEVERE: { bg: "#FFE1D6", text: "#C2410C" },
  LIFE_THREATENING: { bg: "#FDE8E8", text: "#F33131" },
  FATAL: { bg: "#1F2937", text: "#FFFFFF" },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  REPORTED: { bg: "#E2E7FF", text: "#046C3F" },
  UNDER_REVIEW: { bg: "#FFF4E5", text: "#B45309" },
  RESOLVED: { bg: "#DFF3EA", text: "#039855" },
  CLOSED: { bg: "#F1F5F9", text: "#475569" },
};

const SEVERITY_LABELS: Record<string, string> = {
  MILD: "Mild",
  MODERATE: "Moderate",
  SEVERE: "Severe",
  LIFE_THREATENING: "Life-Threatening",
  FATAL: "Fatal",
};

const STATUS_LABELS: Record<string, string> = {
  REPORTED: "Reported",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

function formatDate(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

function ActionMenu({
  row,
  onDelete,
}: {
  row: AdverseEventReport;
  onDelete: (row: AdverseEventReport) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
      >
        <MoreHorizontal size={18} />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: coords.top, left: coords.left }}
            className="absolute z-[999] w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
          >
            <button
              onClick={() => {
                router.push(`/pharmacist-dashboard/adverse-events/${row.id}`);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye size={18} /> View Details
            </button>
            <button
              onClick={() => {
                onDelete(row);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={18} /> Delete
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

export default function AdverseEvents() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const statusFilter = searchParams.get("status") || "All Status";
  const severityFilter = searchParams.get("severity") || "All Severity";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);
  const [toastMessage, setToastMessage] = useState("");

  const deleteMutation = useDeleteAdverseEvent();

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (localSearch === currentSearch) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (localSearch) params.set("search", localSearch);
      else params.delete("search");

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, pathname, router, searchParams]);

  const { data, isLoading } = useAdverseEvents({
    page,
    page_size: pageSize,
    status: statusFilter,
    severity: severityFilter,
    search: searchParams.get("search") || undefined,
    start_date,
    end_date,
  });

  const updateUrlParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleDelete = (row: AdverseEventReport) => {
    if (
      !window.confirm(
        `Delete adverse event report ${row.event_id}? This action cannot be undone.`,
      )
    ) {
      return;
    }
    deleteMutation.mutate(row.id, {
      onSuccess: () => {
        setToastMessage(`${row.event_id} deleted`);
        window.setTimeout(() => setToastMessage(""), 3000);
      },
    });
  };

  const columns: ColumnDef<AdverseEventReport>[] = [
    { header: "Event ID", accessorKey: "event_id", sortable: true },
    { header: "Patient", accessorKey: "patient_name", sortable: true },
    {
      header: "Suspected Drug",
      accessorKey: "suspected_drug_name",
      sortable: true,
    },
    { header: "Reaction Type", accessorKey: "reaction_type", sortable: true },
    {
      header: "Severity",
      sortable: true,
      render: (row) => {
        const color = SEVERITY_COLORS[row.severity] || SEVERITY_COLORS.MILD;
        return (
          <StatusBadge
            label={SEVERITY_LABELS[row.severity] || row.severity}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Status",
      sortable: true,
      render: (row) => {
        const color = STATUS_COLORS[row.status] || STATUS_COLORS.REPORTED;
        return (
          <StatusBadge
            label={STATUS_LABELS[row.status] || row.status}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Date of Reaction",
      sortable: true,
      render: (row) => formatDate(row.date_of_reaction),
    },
    {
      header: "Reported By",
      sortable: true,
      render: (row) => row.reported_by_name || "-",
    },
    {
      header: "Action",
      render: (row) => <ActionMenu row={row} onDelete={handleDelete} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Adverse Events"
        breadcrumbs={[{ label: "Adverse Events" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
              Adverse Drug Reactions
            </h1>
            <p className="text-base text-[#3F3F46]">
              Report and review ADR cases
            </p>
          </div>
          <button
            onClick={() =>
              router.push("/pharmacist-dashboard/adverse-events/new")
            }
            className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-6 text-white"
          >
            <Plus size={18} />
            Report New Event
          </button>
        </div>

        <DataTable
          title="Adverse Events"
          data={data?.results || []}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient, event ID, or drug name"
          onSearch={setLocalSearch}
          totalPages={data?.total_pages}
          emptyMessage={
            isLoading
              ? "Loading adverse events..."
              : "No adverse events match your criteria."
          }
          toolbarActions={
            <>
              <DateRangeFilter
                label="Filter by Date"
                startDate={start_date}
                endDate={end_date}
                onApply={(start, end) => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (start) params.set("start_date", start);
                  else params.delete("start_date");

                  if (end) params.set("end_date", end);
                  else params.delete("end_date");

                  params.set("page", "1");
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
                onClear={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("start_date");
                  params.delete("end_date");
                  params.set("page", "1");
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
              />
              <CustomDropdown
                options={STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={(value) => updateUrlParams("status", value)}
              />
              <CustomDropdown
                options={SEVERITY_OPTIONS}
                selected={severityFilter}
                onSelect={(value) => updateUrlParams("severity", value)}
              />
              <CustomDropdown
                options={PAGE_SIZES}
                selected={pageSize.toString()}
                onSelect={(val) => updateUrlParams("page_size", val)}
                placeholder="Rows per page"
              />
            </>
          }
        />
      </div>

      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
          <span className="h-12 w-1 rounded-full bg-[#039855]" />
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#A8E6C4] bg-[#E8F7F0] text-[#039855]">
            <AlertTriangle size={14} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Updated</p>
            <p className="text-sm text-gray-600">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="border-l border-gray-100 pl-4 text-gray-900 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
