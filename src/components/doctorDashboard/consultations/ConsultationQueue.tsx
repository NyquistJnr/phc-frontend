"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { useConsultations } from "@/src/hooks/doctors/use-consultation";
import type { ConsultationRecord, PaginatedResponse } from "./types";
import AddConsultationModal from "./AddConsultationModal";

const PAGE_SIZES = ["10", "50", "100"];
const STATUS_OPTIONS = ["All Status", "IN_PROGRESS", "COMPLETED"];

const statusColors: Record<string, { bg: string; text: string }> = {
  IN_PROGRESS: { bg: "#E2E7FF", text: "#046C3F" },
  COMPLETED: { bg: "#DFF3EA", text: "#039855" },
  UNKNOWN: { bg: "#F3F4F6", text: "#374151" },
};

type ConsultationRow = ConsultationRecord & {
  status?: string;
  appointment_date?: string;
  appointment_time?: string;
};

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AddNoteAction({ row }: { row: ConsultationRow }) {
  return (
    <Link
      href={`/doctor-dashboard/consultations/new?appointment=${row.appointment}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#046C3F] px-3 py-1.5 text-xs font-medium text-[#046C3F] transition-colors hover:bg-[#F0FAF5]"
    >
      <FileText size={14} />
      Add Note
    </Link>
  );
}

export default function ConsultationQueue() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const statusFilter = searchParams.get("status") || "All Status";
  const startDate = searchParams.get("start_date") || "";
  const endDate = searchParams.get("end_date") || "";
  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

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

  const { data, isLoading } = useConsultations({
    page,
    page_size: pageSize,
    search: searchParams.get("search") || undefined,
    start_date: startDate,
    end_date: endDate,
  });

  const consultationsData = data as PaginatedResponse<ConsultationRow> | undefined;

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Status") params.set(key, value);
      else params.delete(key);
      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const rows = useMemo(() => {
    const results = consultationsData?.results || [];
    if (statusFilter === "All Status") return results;
    return results.filter((row) => row.status === statusFilter);
  }, [consultationsData?.results, statusFilter]);

  const columns = useMemo<ColumnDef<ConsultationRow>[]>(
    () => [
      { header: "Patient ID", accessorKey: "patient_display_id", sortable: true },
      { header: "Patient Name", accessorKey: "patient_name", sortable: true },
      {
        header: "Chief Complaint",
        render: (row) => row.chief_complaint || row.presenting_complaint || "-",
        sortable: true,
      },
      {
        header: "Diagnosis",
        render: (row) => row.diagnosed_disease?.name || row.primary_diagnosis || "-",
        sortable: true,
      },
      {
        header: "Date",
        render: (row) => formatDate(row.created_at),
        sortable: true,
      },
      {
        header: "Status",
        render: (row) => {
          const status = row.status || "UNKNOWN";
          const color = statusColors[status] || statusColors.UNKNOWN;
          return (
            <StatusBadge
              label={status.replaceAll("_", " ")}
              bgColorHex={color.bg}
              textColorHex={color.text}
            />
          );
        },
      },
      {
        header: "Action",
        render: (row) => <AddNoteAction row={row} />,
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Consultations"
        breadcrumbs={[{ label: "Consultations", active: true }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Consultation Queue
            </h2>
            <p className="text-base text-[#3F3F46]">
              Review consultation records and continue patient notes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
          >
            <Plus size={20} />
            Add Consultation Note
          </button>
        </div>

        <DataTable
          title="Consultations"
          data={rows}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient name, ID, or complaint"
          onSearch={setLocalSearch}
          totalPages={consultationsData?.total_pages}
          emptyMessage={
            isLoading ? "Loading consultations..." : "No consultations found."
          }
          toolbarActions={
            <>
              <NurseDateRangeFilter
                startDate={startDate}
                endDate={endDate}
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
                options={PAGE_SIZES}
                selected={pageSize.toString()}
                onSelect={(value) => updateUrlParams("page_size", value)}
                placeholder="Rows per page"
              />
            </>
          }
        />
      </div>

      {isAddModalOpen && (
        <AddConsultationModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}
