"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Eye, CalendarDays, MoreHorizontal } from "lucide-react";
import { createPortal } from "react-dom";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import NurseDateRangeFilter from "../../generic/ui/DateRangeFilter";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { useAllAncVisits } from "@/src/hooks/nurses/use-anc-visits";
import { AncVisitResult } from "@/src/components/nurse-dashboard/maternal-care/type";

const ATTENDANCE_OPTIONS = ["All Types", "NEW", "RETURN"];
const PAGE_SIZES = ["10", "50", "100"];

const attendanceColors: Record<string, { bg: string; text: string }> = {
  NEW: { bg: "#E2E7FF", text: "#3F51B5" },
  RETURN: { bg: "#DFF3EA", text: "#039855" },
};

function AncVisitActionMenu({ row }: { row: AncVisitResult }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const top =
        rect.bottom + 120 > window.innerHeight
          ? rect.top + window.scrollY - 100
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

  const items = [
    {
      label: "View Appointment",
      icon: CalendarDays,
      onClick: () =>
        router.push(`/doctor-dashboard/appointments/${row.appointment}`),
      className: "text-gray-700",
    },
    {
      label: "View Episode Details",
      icon: Eye,
      onClick: () =>
        router.push(`/doctor-dashboard/maternal-care/${row.episode}`),
      className: "text-[#046C3F]",
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

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: coords.top, left: coords.left }}
            className="absolute z-[999] w-52 rounded-xl border border-gray-100 bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
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
    </>
  );
}
export default function AncVisits() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const attendanceFilter = searchParams.get("attendance_type") || "All Types";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";

  const { data, isLoading } = useAllAncVisits({
    page,
    page_size: pageSize,
    attendance_type: attendanceFilter,
    start_date,
    end_date,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Types") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns: ColumnDef<AncVisitResult>[] = [
    {
      header: "Appt. Date",
      accessorKey: "appointment_date",
      sortable: true,
    },
    {
      header: "Type",
      render: (row) => {
        const colorData = attendanceColors[row.attendance_type] || {
          bg: "#F3F4F6",
          text: "#374151",
        };
        return (
          <StatusBadge
            label={row.attendance_type}
            bgColorHex={colorData.bg}
            textColorHex={colorData.text}
          />
        );
      },
    },
    {
      header: "Hemoglobin",
      render: (row) => (row.hemoglobin ? `${row.hemoglobin} g/dL` : "N/A"),
    },
    {
      header: "HIV Status",
      accessorKey: "hiv_status",
    },
    {
      header: "Iron/Folate Given",
      render: (row) => (row.iron_folate_given ? "Yes" : "No"),
    },
    {
      header: "Action",
      render: (row) => <AncVisitActionMenu row={row} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Antenatal Care"
        breadcrumbs={[{ label: "ANC Visits" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              ANC Visits Directory
            </h2>
            <p className="text-base text-[#3F3F46]">
              Review and manage all antenatal appointments and maternal care
              episodes.
            </p>
          </div>
        </div>

        <DataTable
          title="Patient Visits"
          data={data?.results || []}
          columns={columns}
          showSearch={false}
          totalPages={data?.total_pages}
          emptyMessage={
            isLoading
              ? "Loading ANC visits..."
              : "No ANC visits match your criteria."
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
                options={ATTENDANCE_OPTIONS}
                selected={attendanceFilter}
                onSelect={(val) => updateUrlParams("attendance_type", val)}
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
