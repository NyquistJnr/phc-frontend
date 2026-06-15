"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Eye, MoreHorizontal, Plus } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { usePrescriptions } from "@/src/hooks/doctors/use-prescriptions";
import type { PaginatedResponse, PrescriptionRecord } from "./types";

const STATUS_OPTIONS = [
  "All Status",
  "PENDING",
  "PARTIAL",
  "DISPENSED",
  "CANCELLED",
];
const PAGE_SIZES = ["10", "50", "100"];

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
  PARTIAL: { bg: "#E2E7FF", text: "#046C3F" },
  DISPENSED: { bg: "#DFF3EA", text: "#039855" },
  CANCELLED: { bg: "#FDE8E8", text: "#F33131" },
};

function PrescriptionActionMenu({ row }: { row: PrescriptionRecord }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: Math.max(12, rect.right + window.scrollX - 190),
      });
    }
    setOpen((current) => !current);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
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
            <button
              type="button"
              onClick={() => {
                router.push(`/doctor-dashboard/prescriptions/${row.id}`);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Eye size={16} className="text-gray-500" />
              View Detail
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getMedicationNames(row: PrescriptionRecord) {
  const names = row.items
    ?.map(
      (item) =>
        item.drug_name ||
        item.medication_name ||
        item.custom_drug_name ||
        item.drug,
    )
    .filter(Boolean);
  return names?.length ? names.join(", ") : "-";
}

export default function Prescriptions() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const { data, isLoading } = usePrescriptions({
    page,
    page_size: pageSize,
    status: statusFilter,
    search: searchParams.get("search") || undefined,
    start_date: startDate,
    end_date: endDate,
  });

  const prescriptionsData = data as
    | PaginatedResponse<PrescriptionRecord>
    | undefined;

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

  const columns = useMemo<ColumnDef<PrescriptionRecord>[]>(
    () => [
      {
        header: "Prescription ID",
        accessorKey: "prescription_id",
        sortable: true,
      },
      {
        header: "Patient ID",
        accessorKey: "patient_display_id",
        sortable: true,
      },
      { header: "Patient Name", accessorKey: "patient_name", sortable: true },
      { header: "Drug Name", render: getMedicationNames, sortable: true },
      {
        header: "Dosage",
        render: (row) => row.items?.[0]?.dosage || "-",
        sortable: true,
      },
      {
        header: "Frequency",
        render: (row) => row.items?.[0]?.frequency || "-",
        sortable: true,
      },
      {
        header: "Duration",
        render: (row) => row.items?.[0]?.duration || "-",
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
          const status = row.status || "PENDING";
          const color = statusColors[status] || {
            bg: "#F3F4F6",
            text: "#374151",
          };
          return (
            <StatusBadge
              label={status.charAt(0) + status.slice(1).toLowerCase()}
              bgColorHex={color.bg}
              textColorHex={color.text}
            />
          );
        },
      },
      {
        header: "Action",
        render: (row) => <PrescriptionActionMenu row={row} />,
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Prescriptions"
        breadcrumbs={[{ label: "Prescriptions", active: true }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Prescriptions
            </h2>
            <p className="text-base text-[#3F3F46]">
              Create and manage prescriptions
            </p>
          </div>
          <Link
            href="/doctor-dashboard/prescriptions/new"
            className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
          >
            <Plus size={20} />
            Create Prescription
          </Link>
        </div>

        <DataTable
          title="Prescription History"
          data={prescriptionsData?.results || []}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient, ID, or drug"
          onSearch={setLocalSearch}
          totalPages={prescriptionsData?.total_pages}
          emptyMessage={
            isLoading ? "Loading prescriptions..." : "No prescriptions found."
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
    </div>
  );
}
