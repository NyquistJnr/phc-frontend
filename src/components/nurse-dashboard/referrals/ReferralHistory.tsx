"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  MoreHorizontal,
  Eye,
  Edit,
  ArrowDownLeft,
  ArrowUpRight,
  Globe,
  Video,
  VideoOff,
  ExternalLink,
} from "lucide-react";

import TelemedicineModal from "@/src/components/generic/ui/TelemedicineModal";

import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { DataTable, ColumnDef } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import {
  useReferrals,
  useUpdateReferralStatus,
  useEndTelemedicineSession,
} from "@/src/hooks/nurses/use-referrals";
import { ReferralResult, ReferralStatus } from "./type";

const STATUS_OPTIONS = ["All Status", "PENDING", "ACCEPTED", "REJECTED", "CALL_CREATED", "COMPLETED"];
const DIRECTION_OPTIONS = ["All Directions", "inbound", "outbound"];
const PAGE_SIZES = ["10", "50", "100"];

const statusColors: Record<string, { bg: string; text: string }> = {
  ACCEPTED: { bg: "#DFF3EA", text: "#039855" },
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
  REJECTED: { bg: "#FDE8E8", text: "#F33131" },
  CALL_CREATED: { bg: "#E0F2FE", text: "#0284C7" },
  COMPLETED: { bg: "#DCFCE7", text: "#16A34A" },
};

function FacilityCell({
  name,
  isDestination,
}: {
  name: string | null;
  isDestination?: boolean;
}) {
  if (name) {
    return <span className="font-medium text-gray-700">{name}</span>;
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-gray-300 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500">
      <Globe size={12} className="text-gray-400" />
      <span>{isDestination ? "External Destination" : "External Origin"}</span>
    </div>
  );
}

function ReferralActionMenu({ row }: { row: ReferralResult }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTelemedicineModal, setShowTelemedicineModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(row.status);
  const [errorMsg, setErrorMsg] = useState("");

  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateReferralStatus();
  const { mutate: endSession } = useEndTelemedicineSession();

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
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleUpdateStatus = () => {
    setErrorMsg("");
    updateStatus(
      { id: row.id, status: selectedStatus },
      {
        onSuccess: () => {
          setShowStatusModal(false);
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.errors?.detail ||
            error?.response?.data?.message ||
            "Failed to update status. Please try again.";
          setErrorMsg(msg);
        },
      },
    );
  };

  const items = [
    {
      label: "View Detail",
      icon: Eye,
      onClick: () => router.push(`/nurse-dashboard/referrals/${row.id}`),
      className: "text-gray-700",
    },
  ];

  if (row.direction?.toLowerCase() === "inbound") {
    items.push({
      label: "Update Status",
      icon: Edit,
      onClick: () => setShowStatusModal(true),
      className: "text-gray-700",
    });
  }

  if (row.telemedicine_session && row.status !== "COMPLETED") {
    items.push({
      label: "Join Meeting",
      icon: ExternalLink,
      onClick: () => window.open(row.telemedicine_session?.host_join_url, "_blank"),
      className: "text-purple-700",
    });
    items.push({
      label: "End Meeting",
      icon: VideoOff,
      onClick: () => {
        if (confirm("Are you sure you want to end this telemedicine session?")) {
          endSession(row.id);
        }
      },
      className: "text-red-600",
    });
  } else if (!row.telemedicine_session && (row.status === "PENDING" || row.status === "ACCEPTED")) {
    items.push({
      label: "Create Meeting",
      icon: Video,
      onClick: () => setShowTelemedicineModal(true),
      className: "text-purple-700",
    });
  }

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

      {showStatusModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Update Referral Status
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Change the status for referral <b>{row.referral_id}</b>.
              </p>

              {errorMsg && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                  {errorMsg}
                </div>
              )}

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value as ReferralStatus)
                }
                className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
              >
                {STATUS_OPTIONS.filter((s) => s !== "All Status").map(
                  (status) => (
                    <option key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </option>
                  ),
                )}
              </select>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setErrorMsg("");
                    setSelectedStatus(row.status);
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="rounded-lg bg-[#046C3F] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
                >
                  {isUpdating ? "Saving..." : "Save Status"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {showTelemedicineModal && (
        <TelemedicineModal
          referralId={row.id}
          referralDisplayId={row.referral_id}
          onClose={() => setShowTelemedicineModal(false)}
        />
      )}
    </>
  );
}

export default function ReferralHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const statusFilter = searchParams.get("status") || "All Status";
  const directionFilter = searchParams.get("direction") || "All Directions";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (localSearch === currentSearch) return;

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

  const { data, isLoading } = useReferrals({
    page,
    page_size: pageSize,
    status: statusFilter,
    direction: directionFilter,
    search: searchParams.get("search") || undefined,
    start_date,
    end_date,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Status" && value !== "All Directions") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns: ColumnDef<ReferralResult>[] = [
    { header: "Referral ID", accessorKey: "referral_id", sortable: true },
    {
      header: "Direction",
      accessorKey: "direction",
      sortable: true,
      render: (row) => {
        const isInbound = row.direction?.toLowerCase() === "inbound";
        return (
          <div
            className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isInbound
                ? "bg-blue-50 text-blue-700"
                : "bg-purple-50 text-purple-700"
            }`}
          >
            {isInbound ? (
              <ArrowDownLeft size={14} />
            ) : (
              <ArrowUpRight size={14} />
            )}
            <span className="capitalize">{row.direction || "Unknown"}</span>
          </div>
        );
      },
    },
    {
      header: "Patient",
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.patient_name}</span>
          <span className="text-xs text-gray-500">
            {row.patient_display_id}
          </span>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "referral_type",
      sortable: true,
      render: (row) => (
        <span className="capitalize">
          {row.referral_type?.toLowerCase() || "-"}
        </span>
      ),
    },
    {
      header: "Referring Facility",
      accessorKey: "referring_facility_name",
      sortable: true,
      render: (row) => <FacilityCell name={row.referring_facility_name} />,
    },
    {
      header: "Receiving Facility",
      accessorKey: "receiving_facility_name",
      sortable: true,
      render: (row) => (
        <FacilityCell name={row.receiving_facility_name} isDestination />
      ),
    },
    {
      header: "Date",
      sortable: true,
      render: (row) =>
        new Date(row.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
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
            label={row.status.charAt(0) + row.status.slice(1).toLowerCase()}
            bgColorHex={colorData.bg}
            textColorHex={colorData.text}
          />
        );
      },
    },
    {
      header: "Action",
      render: (row) => <ReferralActionMenu row={row} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Referrals"
        breadcrumbs={[{ label: "Referrals" }, { label: "Referrals History" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            Referrals
          </h2>
          <p className="text-base text-[#3F3F46]">
            Create and track patient referrals
          </p>
        </div>

        <div className="mb-6 grid w-full max-w-[400px] grid-cols-2 overflow-hidden rounded-lg bg-[#EEF5F3]">
          <button
            type="button"
            className="h-10 bg-[#046C3F] px-4 text-sm font-medium text-white transition-colors sm:text-base"
          >
            Referral History
          </button>
          <button
            type="button"
            onClick={() => router.push("/nurse-dashboard/referrals/new")}
            className="h-10 px-4 text-sm font-medium text-gray-400 transition-colors hover:text-[#046C3F] sm:text-base"
          >
            Create Referral
          </button>
        </div>

        <DataTable
          title="Patient Referrals"
          data={data?.results || []}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient name or ID..."
          onSearch={setLocalSearch}
          totalPages={data?.total_pages}
          emptyMessage={
            isLoading
              ? "Loading referrals..."
              : "No referrals match your criteria."
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
                options={DIRECTION_OPTIONS}
                selected={directionFilter}
                onSelect={(val) => updateUrlParams("direction", val)}
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
