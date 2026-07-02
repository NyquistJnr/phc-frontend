"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FileText, MoreHorizontal } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { useMyAppointments } from "@/src/hooks/doctors/use-consultation";
import type { MyAppointment, PaginatedResponse } from "./types";

const STATUS_OPTIONS = [
  "All Status",
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
  "VITALS_DONE",
];
const VISIT_TYPES = [
  "All Visit Type",
  "GENERAL",
  "FOLLOW_UP",
  "ANTENATAL",
  "IMMUNIZATION",
  "EMERGENCY",
  "OTHER",
];

const statusColors: Record<string, { bg: string; text: string }> = {
  SCHEDULED: { bg: "#FFF4E5", text: "#1F2937" },
  IN_PROGRESS: { bg: "#E2E7FF", text: "#046C3F" },
  COMPLETED: { bg: "#DFF3EA", text: "#039855" },
  CANCELLED: { bg: "#FDE8E8", text: "#F33131" },
  NO_SHOW: { bg: "#FDE8E8", text: "#F33131" },
  VITALS_DONE: { bg: "#E2E7FF", text: "#046C3F" },
};

function AppointmentActionMenu({ row }: { row: MyAppointment }) {
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
        left: Math.max(12, rect.right + window.scrollX - 220),
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
            className="absolute z-[999] w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <button
              type="button"
              onClick={() => {
                router.push(
                  `/doctor-dashboard/consultations/new?appointment=${row.id}`,
                );
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FileText size={16} className="text-gray-500" />
              Add Consultation Note
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

export default function DoctorAppointments() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const statusFilter = searchParams.get("status") || "All Status";
  const visitType = searchParams.get("visit_type") || "All Visit Type";
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
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, pathname, router, searchParams]);

  const { data, isLoading } = useMyAppointments({
    status: statusFilter === "All Status" ? undefined : statusFilter,
    visit_type: visitType === "All Visit Type" ? undefined : visitType,
    search: searchParams.get("search") || undefined,
    start_date: startDate,
    end_date: endDate,
  });

  const appointmentData = data as
    | PaginatedResponse<MyAppointment>
    | MyAppointment[]
    | undefined;
  const appointments = Array.isArray(appointmentData)
    ? appointmentData
    : appointmentData?.results || [];

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Status" && value !== "All Visit Type") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns = useMemo<ColumnDef<MyAppointment>[]>(
    () => [
      {
        header: "Appointment ID",
        accessorKey: "appointment_id",
        sortable: true,
      },
      {
        header: "Patient ID",
        accessorKey: "patient_display_id",
        sortable: true,
      },
      { header: "Patient Name", accessorKey: "patient_name", sortable: true },
      {
        header: "Date & Time",
        sortable: true,
        render: (row) =>
          [row.appointment_date, row.appointment_time?.slice(0, 5)]
            .filter(Boolean)
            .join(" - ") || "-",
      },
      { header: "Visit Type", accessorKey: "visit_type", sortable: true },
      { header: "Reason", accessorKey: "reason_for_visit", sortable: true },
      {
        header: "Status",
        render: (row) => {
          const status = row.status || "UNKNOWN";
          const color = statusColors[status] || {
            bg: "#F3F4F6",
            text: "#374151",
          };
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
        render: (row) => <AppointmentActionMenu row={row} />,
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Consultations"
        breadcrumbs={[
          { label: "Consultations" },
          { label: "Appointments", active: true },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            My Appointments
          </h2>
          <p className="text-base text-[#3F3F46]">
            Select an assigned appointment to add a consultation note.
          </p>
        </div>

        <DataTable
          title="Assigned Appointments"
          data={appointments}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient name or ID"
          onSearch={setLocalSearch}
          totalPages={
            Array.isArray(appointmentData) ? 1 : appointmentData?.total_pages
          }
          emptyMessage={
            isLoading
              ? "Loading appointments..."
              : "No assigned appointments found."
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
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
                onClear={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("start_date");
                  params.delete("end_date");
                  router.push(`${pathname}?${params.toString()}`, {
                    scroll: false,
                  });
                }}
              />
              <CustomDropdown
                options={VISIT_TYPES}
                selected={visitType}
                onSelect={(value) => updateUrlParams("visit_type", value)}
              />
              <CustomDropdown
                options={STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={(value) => updateUrlParams("status", value)}
              />
            </>
          }
        />
      </div>
    </div>
  );
}
