"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertOctagon,
  AlertTriangle,
  Box,
  Eye,
  Loader2,
  Pill,
  PackagePlus,
  ReceiptText,
} from "lucide-react";
import DashboardStatCard from "@/src/components/generic/dashboard/DashboardStatCard";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import { usePrescriptionOrders } from "@/src/hooks/pharmacist/use-prescriptions";
import {
  usePharmacyActivities,
  usePharmacyDashboardStats,
  usePharmacyPieChartStats,
} from "@/src/hooks/pharmacist/use-dashboard";
import type { PrescriptionOrder } from "@/src/components/pharmacist-dashboard/prescriptions/type";
import type { PharmacyActivity } from "./type";

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
  PARTIAL: { bg: "#E2E7FF", text: "#046C3F" },
  DISPENSED: { bg: "#DFF3EA", text: "#039855" },
  CANCELLED: { bg: "#FDE8E8", text: "#F33131" },
};

const ACTIVITY_COLORS: Record<string, string> = {
  DISPENSE: "#00A556",
  REFILL: "#00A556",
  LOW_STOCK: "#FFC987",
  OUT_OF_STOCK: "#E12D2D",
  ADR_REPORT: "#E12D2D",
};

const ACTIVITY_ICONS: Record<string, typeof Pill> = {
  DISPENSE: Pill,
  REFILL: PackagePlus,
  LOW_STOCK: AlertTriangle,
  OUT_OF_STOCK: AlertOctagon,
  ADR_REPORT: AlertOctagon,
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

function formatActivityTime(timestamp: string) {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ActivityRow({ activity }: { activity: PharmacyActivity }) {
  const color = ACTIVITY_COLORS[activity.activity_type] || "#9CA3AF";
  const Icon = ACTIVITY_ICONS[activity.activity_type] || Pill;
  // Some activity_types (DISPENSE, REFILL, LOW_STOCK) don't mention the drug
  // name in their description — only OUT_OF_STOCK/ADR_REPORT do. Prefix it
  // when it's not already there so the drug is always visible.
  const showItemName =
    activity.item_name && !activity.description.includes(activity.item_name);

  return (
    <div className="flex gap-3">
      <span
        className="mt-1 h-[70px] w-1 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="flex items-start gap-2 text-base font-medium leading-6 text-[#53545C]">
          <Icon size={15} style={{ color }} className="mt-0.5 shrink-0" />
          <span>
            {showItemName && (
              <span className="font-semibold text-[#1F2A44]">
                {activity.item_name}:{" "}
              </span>
            )}
            {activity.description}
          </span>
        </p>
        <p className="mt-1 text-sm text-[#1F2A44]">
          {formatActivityTime(activity.timestamp)}
        </p>
      </div>
    </div>
  );
}

const PIE_COLORS = {
  dispensed: "#046C3F",
  refilled: "#1AC073",
  out_of_stock: "#F33131",
};

function PieChart({
  dispensed,
  refilled,
  outOfStock,
}: {
  dispensed: number;
  refilled: number;
  outOfStock: number;
}) {
  const total = dispensed + refilled + outOfStock;
  const dispensedEnd = total ? (dispensed / total) * 100 : 0;
  const refilledEnd = total ? dispensedEnd + (refilled / total) * 100 : 0;

  const gradient = total
    ? `conic-gradient(${PIE_COLORS.dispensed} 0% ${dispensedEnd}%, ${PIE_COLORS.refilled} ${dispensedEnd}% ${refilledEnd}%, ${PIE_COLORS.out_of_stock} ${refilledEnd}% 100%)`
    : "conic-gradient(#E9EDFB 0% 100%)";

  return (
    <div
      className="mx-auto flex h-52 w-52 items-center justify-center rounded-full"
      style={{ background: gradient }}
    >
      <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
        <span className="text-2xl font-semibold text-gray-800">{total}</span>
        <span className="text-xs text-gray-400">Total</span>
      </div>
    </div>
  );
}

export default function PharmacistHome() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: stats, isLoading: isLoadingStats } = usePharmacyDashboardStats(
    { start_date: startDate, end_date: endDate },
  );
  const { data: activitiesData, isLoading: isLoadingActivities } =
    usePharmacyActivities({ page: 1, page_size: 5 });
  const { data: pieData, isLoading: isLoadingPie } = usePharmacyPieChartStats({
    start_date: startDate,
    end_date: endDate,
  });
  const { data: prescriptionsData, isLoading: isLoadingPrescriptions } =
    usePrescriptionOrders({ page: 1, page_size: 10 });

  const statCards = [
    {
      title: "Pending Prescriptions",
      value: isLoadingStats ? "-" : (stats?.pending_prescriptions ?? 0),
      icon: ReceiptText,
      active: true,
      href: "/pharmacist-dashboard/prescriptions",
    },
    {
      title: "Dispensed",
      value: isLoadingStats ? "-" : (stats?.dispensed ?? 0),
      icon: Pill,
      href: "/pharmacist-dashboard/prescriptions",
    },
    {
      title: "Low Stock Alerts",
      value: isLoadingStats ? "-" : (stats?.low_stock_alerts ?? 0),
      icon: Box,
      href: "/pharmacist-dashboard/inventory",
    },
    {
      title: "ADR Reports",
      value: isLoadingStats ? "-" : (stats?.adr_reports ?? 0),
      icon: AlertOctagon,
      href: "/pharmacist-dashboard/adverse-events",
    },
  ];

  const columns: ColumnDef<PrescriptionOrder>[] = [
    { header: "Prescribed ID", accessorKey: "prescription_id", sortable: true },
    { header: "Patient ID", accessorKey: "patient_display_id", sortable: true },
    { header: "Patient Name", accessorKey: "patient_name", sortable: true },
    {
      header: "Medications",
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
        <button
          onClick={() =>
            router.push(`/pharmacist-dashboard/prescriptions/${row.id}`)
          }
          className="inline-flex rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="View prescription"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader title="Dashboard" breadcrumbs={[]} />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
              Good morning
            </h1>
            <p className="text-base text-[#3F3F46]">
              Here&apos;s what&apos;s happening across the pharmacy today.
            </p>
          </div>
          <DateRangeFilter
            label="Filter by Date"
            startDate={startDate}
            endDate={endDate}
            onApply={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            onClear={() => {
              setStartDate("");
              setEndDate("");
            }}
          />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <DashboardStatCard key={stat.title} {...stat} showPeriod={false} />
          ))}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,424px)_320px]">
          <section className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#3F3F46]">
              Recent Activity
            </h2>
            {isLoadingActivities ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={24} className="animate-spin text-[#046C3F]" />
              </div>
            ) : activitiesData?.results.length ? (
              <div className="space-y-4">
                {activitiesData.results.map((activity, index) => (
                  <ActivityRow key={index} activity={activity} />
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-gray-400">
                No recent activity.
              </p>
            )}
          </section>

          <section className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#3F3F46]">
                Status overview
              </h2>
            </div>
            <div className="mb-8 flex flex-wrap gap-7 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <i className="h-2 w-2 rounded-full bg-[#046C3F]" />
                Dispensed
              </span>
              <span className="flex items-center gap-2">
                <i className="h-2 w-2 rounded-full bg-[#1AC073]" />
                Refilled
              </span>
              <span className="flex items-center gap-2">
                <i className="h-2 w-2 rounded-full bg-[#F33131]" />
                Out of Stock
              </span>
            </div>
            {isLoadingPie ? (
              <div className="flex h-52 items-center justify-center">
                <Loader2 size={24} className="animate-spin text-[#046C3F]" />
              </div>
            ) : (
              <PieChart
                dispensed={pieData?.dispensed ?? 0}
                refilled={pieData?.refilled ?? 0}
                outOfStock={pieData?.out_of_stock ?? 0}
              />
            )}
          </section>
        </div>

        <DataTable
          title="Patient Prescription"
          data={prescriptionsData?.results || []}
          columns={columns}
          viewAllLink="/pharmacist-dashboard/prescriptions"
          emptyMessage={
            isLoadingPrescriptions
              ? "Loading prescriptions..."
              : "No prescriptions found."
          }
        />
      </div>
    </div>
  );
}
