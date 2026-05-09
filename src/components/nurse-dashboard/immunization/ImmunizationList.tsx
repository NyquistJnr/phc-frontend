"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, MoreHorizontal, Plus, Syringe } from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import { ImmunizationRecordApi, ImmunizationStatus } from "./type";

const STATUS_OPTIONS = ["All Status", "COMPLETED", "PENDING"];
const SESSION_OPTIONS = ["All Session Types", "FIXED", "OUTREACH", "MOBILE"];

const statusColors: Record<string, { bg: string; text: string }> = {
  COMPLETED: { bg: "#DFF3EA", text: "#039855" },
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
};

function ImmunizationActionMenu({ row }: { row: ImmunizationRecordApi }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 206;
      const estimatedHeight = 124;
      const top =
        rect.bottom + estimatedHeight > window.innerHeight
          ? rect.top + window.scrollY - estimatedHeight - 4
          : rect.bottom + window.scrollY + 4;
      const left = Math.max(
        12 + window.scrollX,
        rect.right - menuWidth + window.scrollX,
      );
      setCoords({ top, left });
    }
    setOpen((current) => !current);
  };

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
    function handleScroll() {
      setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
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
            className="absolute z-[9999] w-[206px] border border-gray-200 bg-white px-4 py-5 shadow-sm"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mb-3 flex w-full items-center gap-3 border-b border-gray-100 pb-3 text-left text-sm font-medium text-gray-400"
            >
              <Eye size={20} className="text-gray-700" /> View Detail
            </button>
            <div className="flex items-center gap-3">
              <Syringe size={20} className="text-gray-900" />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                }}
                className="rounded-md bg-[#046C3F] px-3 py-2 text-xs font-medium text-white hover:bg-[#035a34]"
              >
                Mark Administered
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default function ImmunizationList({
  records,
  totalPages,
  isLoading,
  localSearch,
  setLocalSearch,
  statusFilter,
  sessionTypeFilter,
  startDate,
  endDate,
  updateUrlParams,
  onRegisterClick,
}: {
  records: ImmunizationRecordApi[];
  totalPages?: number;
  isLoading: boolean;
  localSearch: string;
  setLocalSearch: (val: string) => void;
  statusFilter: string;
  sessionTypeFilter: string;
  startDate: string;
  endDate: string;
  updateUrlParams: (key: string, value: string) => void;
  onRegisterClick: () => void;
}) {
  const columns: ColumnDef<ImmunizationRecordApi>[] = [
    { header: "Patient ID", accessorKey: "patient_display_id", sortable: true },
    { header: "Patient Name", accessorKey: "patient_name", sortable: true },
    { header: "Age", accessorKey: "age_at_vaccination", sortable: true },
    { header: "Date of Visit", accessorKey: "date_of_visit", sortable: true },
    { header: "Vaccine", accessorKey: "vaccine_name", sortable: true },
    { header: "Session", accessorKey: "session_type", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => {
        const colorData = statusColors[row.status] || {
          bg: "#F3F4F6",
          text: "#374151",
        };
        return (
          <StatusBadge
            label={row.status}
            bgColorHex={colorData.bg}
            textColorHex={colorData.text}
          />
        );
      },
    },
    {
      header: "Action",
      sortable: false,
      render: (row) => <ImmunizationActionMenu row={row} />,
    },
  ];

  return (
    <>
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Immunization
          </h2>
          <p className="text-base text-[#3F3F46]">
            Vaccination schedule and administration
          </p>
        </div>
        <button
          type="button"
          onClick={onRegisterClick}
          className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
        >
          <Plus size={20} /> Register Child
        </button>
      </div>

      <DataTable
        title="Immunization Records"
        data={records}
        columns={columns}
        showSearch
        searchPlaceholder="Search patient name, ID, or vaccine..."
        onSearch={setLocalSearch}
        totalPages={totalPages}
        emptyMessage={
          isLoading
            ? "Loading immunization records..."
            : "No immunization records match your criteria."
        }
        toolbarActions={
          <>
            <NurseDateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onApply={(start, end) => {
                updateUrlParams("start_date", start);
                updateUrlParams("end_date", end);
              }}
              onClear={() => {
                updateUrlParams("start_date", "");
                updateUrlParams("end_date", "");
              }}
            />
            <CustomDropdown
              options={SESSION_OPTIONS}
              selected={sessionTypeFilter}
              onSelect={(val) => updateUrlParams("session_type", val)}
            />
            <CustomDropdown
              options={STATUS_OPTIONS}
              selected={statusFilter}
              onSelect={(val) => updateUrlParams("status", val)}
            />
          </>
        }
      />
    </>
  );
}
