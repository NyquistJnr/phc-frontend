"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, Edit, Download, MoreHorizontal } from "lucide-react";
import { createPortal } from "react-dom";

import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import {
  useAppointments,
  useUpdateAppointmentStatus,
} from "@/src/hooks/nurses/use-appointments";
import { AppointmentResult } from "./type";

const VISIT_TYPES = [
  "GENERAL",
  "FOLLOW_UP",
  "ANTENATAL",
  "IMMUNIZATION",
  "EMERGENCY",
  "OTHER",
];
const STATUS_OPTIONS = [
  "All Status",
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
];
const PAGE_SIZES = ["10", "100", "200"];

const statusColors: Record<string, { bg: string; text: string }> = {
  SCHEDULED: { bg: "#FFF4E5", text: "#1F2937" },
  IN_PROGRESS: { bg: "#E2E7FF", text: "#046C3F" },
  COMPLETED: { bg: "#DFF3EA", text: "#039855" },
  CANCELLED: { bg: "#FDE8E8", text: "#F33131" },
  NO_SHOW: { bg: "#FDE8E8", text: "#F33131" },
  VITALS_DONE: { bg: "#E2E7FF", text: "#046C3F" },
};

function AppointmentActionMenu({ row }: { row: AppointmentResult }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(row.status);

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateAppointmentStatus();

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const top =
        rect.bottom + 188 > window.innerHeight
          ? rect.top + window.scrollY - 188 - 4
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
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleUpdateStatus = () => {
    updateStatus(
      { id: row.id, status: selectedStatus },
      { onSuccess: () => setShowStatusModal(false) },
    );
  };

  const items = [
    {
      label: "View Detail",
      icon: Eye,
      onClick: () => router.push(`/nurse-dashboard/appointments/${row.id}`),
      className: "text-gray-700",
    },
    {
      label: "Update Status",
      icon: Edit,
      onClick: () => setShowStatusModal(true),
      className: "text-gray-700",
    },
  ];

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <MoreHorizontal size={18} />
      </button>

      {/* Action Dropdown Menu */}
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

      {/* Status Update Modal */}
      {showStatusModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Update Status
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Change the status for appointment {row.appointment_id}.
              </p>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
              >
                {STATUS_OPTIONS.filter((s) => s !== "All Status").map(
                  (status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ),
                )}
              </select>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="rounded-lg bg-[#046C3F] px-4 py-2 text-sm font-medium text-white hover:bg-[#035a34] disabled:opacity-70"
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

export default function Appointments() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const statusFilter = searchParams.get("status") || "All Status";
  const visitFilter = searchParams.get("visit_type") || "All Visit Type";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (localSearch === currentSearch) {
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (localSearch) {
        params.set("search", localSearch);
      } else {
        params.delete("search");
      }

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, pathname, router, searchParams]);

  const { data, isLoading } = useAppointments({
    page,
    page_size: pageSize,
    status: statusFilter,
    visit_type: visitFilter,
    search: searchParams.get("search") || undefined,
    start_date,
    end_date,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Status" && value !== "All Visit Type") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns: ColumnDef<AppointmentResult>[] = [
    { header: "Patient ID", accessorKey: "patient_display_id", sortable: true },
    { header: "Patient Name", accessorKey: "patient_name", sortable: true },
    {
      header: "Date & Time",
      render: (row) =>
        `${row.appointment_date} - ${row.appointment_time.slice(0, 5)}`,
      sortable: true,
    },
    { header: "Visit Type", accessorKey: "visit_type", sortable: true },
    { header: "Reason", accessorKey: "reason_for_visit", sortable: true },
    {
      header: "Assigned To",
      accessorKey: "assigned_staff_name",
      sortable: true,
    },
    {
      header: "Status",
      render: (row) => {
        const colorData = statusColors[row.status] || {
          bg: "#F3F4F6",
          text: "#374151",
        };
        return (
          <StatusBadge
            label={row.status.replace("_", " ")}
            bgColorHex={colorData.bg}
            textColorHex={colorData.text}
          />
        );
      },
    },
    { header: "Action", render: (row) => <AppointmentActionMenu row={row} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Appointments"
        breadcrumbs={[{ label: "Appointments" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Appointments
            </h2>
            <p className="text-base text-[#3F3F46]">
              Schedule, reschedule, and manage patient appointments
            </p>
          </div>

          <Link
            href="/nurse-dashboard/appointments/new"
            className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
          >
            <Plus size={20} /> New Appointment
          </Link>
        </div>

        <DataTable
          title="Patient Appointments"
          data={data?.results || []}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient name or ID"
          onSearch={(val) => setLocalSearch(val)}
          totalPages={data?.total_pages}
          emptyMessage={
            isLoading
              ? "Loading appointments..."
              : "No appointments match your criteria."
          }
          toolbarActions={
            <>
              <NurseDateRangeFilter
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
                options={["All Visit Type", ...VISIT_TYPES]}
                selected={visitFilter}
                onSelect={(val) => updateUrlParams("visit_type", val)}
              />

              <CustomDropdown
                options={STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={(val) => updateUrlParams("status", val)}
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
    </div>
  );
}
