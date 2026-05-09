"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Edit, Eye, MoreHorizontal, Plus } from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import { useUpdateImmunizationStatus } from "@/src/hooks/nurses/use-immunization";
import { ImmunizationRecordApi, ImmunizationStatus } from "./type";

const STATUS_OPTIONS = ["All Status", "COMPLETED", "PENDING"];
const SESSION_OPTIONS = ["All Session Types", "FIXED", "OUTREACH", "MOBILE"];

const statusColors: Record<string, { bg: string; text: string }> = {
  COMPLETED: { bg: "#DFF3EA", text: "#039855" },
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
};

function ImmunizationActionMenu({ row }: { row: ImmunizationRecordApi }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(row.status);

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateImmunizationStatus();

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 206;
      const estimatedHeight = 100;
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
      onClick: () => router.push(`/nurse-dashboard/immunization/${row.id}`),
    },
    {
      label: "Update Status",
      icon: Edit,
      onClick: () => setShowStatusModal(true),
    },
  ];

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
            className="absolute z-[9999] w-[206px] rounded-xl border border-gray-100 bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Icon size={16} className="text-gray-700" /> {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}

      {showStatusModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Update Status
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Change the immunization status for <b>{row.patient_name}</b>.
              </p>
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as ImmunizationStatus)
                }
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
              >
                {STATUS_OPTIONS.filter((s) => s !== "All Status").map(
                  (status) => (
                    <option key={status} value={status}>
                      {status}
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
