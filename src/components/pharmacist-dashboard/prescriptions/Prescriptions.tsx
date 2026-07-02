"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { Eye, MoreHorizontal, Pill, X } from "lucide-react";

import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";

import {
  useDispensePrescriptionOrder,
  usePrescriptionOrders,
} from "@/src/hooks/pharmacist/use-prescriptions";
import { PrescriptionOrder } from "./type";
import DispensePrescriptionModal from "./DispensePrescriptionModal";

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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

function ActionMenu({
  row,
  onDispense,
}: {
  row: PrescriptionOrder;
  onDispense: (row: PrescriptionOrder) => void;
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
                router.push(`/pharmacist-dashboard/prescriptions/${row.id}`);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Eye size={18} /> View Details
            </button>
            <button
              onClick={() => {
                onDispense(row);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <Pill size={18} /> Dispense
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

export default function Prescriptions() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const statusFilter = searchParams.get("status") || "All Status";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  const [dispenseModalOpen, setDispenseModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PrescriptionOrder | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState("");
  const [dispenseError, setDispenseError] = useState("");
  const dispenseMutation = useDispensePrescriptionOrder();

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

  const { data, isLoading } = usePrescriptionOrders({
    page,
    page_size: pageSize,
    status: statusFilter,
    search: searchParams.get("search") || undefined,
    start_date,
    end_date,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Status") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns: ColumnDef<PrescriptionOrder>[] = [
    { header: "Prescribed ID", accessorKey: "prescription_id", sortable: true },
    { header: "Patient ID", accessorKey: "patient_display_id", sortable: true },
    { header: "Patient Name", accessorKey: "patient_name", sortable: true },
    {
      header: "Medications",
      sortable: true,
      render: (row) =>
        row.items.map((item) => item.medication_name).join(", ") || "-",
    },
    {
      header: "Prescribed By",
      accessorKey: "prescribed_by_name",
      sortable: true,
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
        const color = statusColors[row.status] || statusColors.PENDING;
        return (
          <StatusBadge
            label={row.status}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Action",
      render: (row) => (
        <ActionMenu
          row={row}
          onDispense={(order) => {
            setSelectedOrder(order);
            setDispenseError("");
            setDispenseModalOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Prescriptions"
        breadcrumbs={[{ label: "Prescriptions" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7">
          <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
            Prescriptions
          </h1>
          <p className="text-base text-[#3F3F46]">
            Manage and dispense prescription to patient
          </p>
        </div>

        <DataTable
          title="Patient Prescription History"
          data={data?.results || []}
          columns={columns}
          showSearch
          searchPlaceholder="Search by ID, Patient or Drug name..."
          onSearch={(val) => setLocalSearch(val)}
          totalPages={data?.total_pages}
          emptyMessage={
            isLoading
              ? "Loading prescriptions..."
              : "No prescriptions match your criteria."
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
                options={PAGE_SIZES}
                selected={pageSize.toString()}
                onSelect={(val) => updateUrlParams("page_size", val)}
                placeholder="Rows per page"
              />
            </>
          }
        />
      </div>

      {dispenseModalOpen && (
        selectedOrder && (
          <DispensePrescriptionModal
            order={selectedOrder}
            isSubmitting={dispenseMutation.isPending}
            errorMessage={dispenseError}
            onClose={() => setDispenseModalOpen(false)}
            onConfirm={() => {
              setDispenseError("");
              dispenseMutation.mutate(selectedOrder.id, {
                onSuccess: () => {
                  setDispenseModalOpen(false);
                  setToastMessage(
                    `${selectedOrder.prescription_id} dispensed successfully`,
                  );
                  window.setTimeout(() => setToastMessage(""), 3500);
                },
                onError: (error: unknown) => {
                  setDispenseError(
                    error instanceof Error
                      ? error.message
                      : "Failed to dispense. Please try again.",
                  );
                },
              });
            }}
          />
        )
      )}

      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
          <span className="h-12 w-1 rounded-full bg-[#039855]" />
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[#A8E6C4] bg-[#E8F7F0] text-[#039855]">
            <Pill size={14} />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              Dispense Successful
            </p>
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
