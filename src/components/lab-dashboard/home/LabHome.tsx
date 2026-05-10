"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import { CheckCircle2, ClipboardList, MoreHorizontal, PackageCheck } from "lucide-react";
import DashboardStatCard from "@/src/components/generic/dashboard/DashboardStatCard";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import { labBadgeColors } from "@/src/components/lab-dashboard/laboratory/labData";
import {
  useLabStats,
  useLabRequests,
} from "@/src/hooks/laboratory/use-laboratory";
import { LabRequest } from "./types";
import LabDateRangeFilter from "../generics/LabDateRangeFilter";



const formatBadgeLabel = (str: string) => {
  if (!str) return "Unknown";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function LabHome() {
  const { data: session } = useSession();

  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;

  const [startDate, setStartDate] = useState(
    searchParams.get("start_date") || "",
  );
  const [endDate, setEndDate] = useState(searchParams.get("end_date") || "");

  const { data: statsData } = useLabStats({
    start_date: startDate,
    end_date: endDate,
  });
  const { data: requestsData, isLoading: isLoadingRequests } = useLabRequests({
    page,
    page_size: pageSize,
  });

  const stats = [
    {
      title: "Pending lab Requests",
      value: statsData?.pending_lab_requests || 0,
      icon: ClipboardList,
      href: "/lab-dashboard/laboratory",
      active: true,
    },
    {
      title: "In Progress",
      value: statsData?.in_progress || 0,
      icon: ClipboardList,
      href: "/lab-dashboard/laboratory",
    },
    {
      title: "Completed Today",
      value: statsData?.completed || 0,
      icon: CheckCircle2,
      href: "/lab-dashboard/laboratory",
    },
    {
      title: "Inventory Alerts",
      value: statsData?.inventory_alert_count || 0,
      icon: PackageCheck,
      href: "/lab-dashboard/lab-inventory",
    },
  ];
  const columns: ColumnDef<LabRequest>[] = [
    { header: "Lab request ID", accessorKey: "request_id", sortable: true },
    { header: "Patient ID", accessorKey: "patient_display_id", sortable: true },
    { header: "Patient Name", accessorKey: "patient_name", sortable: true },
    {
      header: "Test Type",
      render: (row) =>
        row.tests && row.tests.length > 0
          ? row.tests.map((t) => t.test_name).join(", ")
          : "N/A",
    },
    {
      header: "Requested by",
      accessorKey: "requested_by_name",
      sortable: true,
    },
    {
      header: "Priority",
      sortable: true,
      render: (row) => {
        const mappedPriority =
          row.priority === "NORMAL" ? "Routine" : row.priority;
        const formattedLabel = formatBadgeLabel(mappedPriority);
        const color = labBadgeColors[
          formattedLabel as keyof typeof labBadgeColors
        ] || { bg: "#E2E7FF", text: "#046C3F" };

        return (
          <StatusBadge
            label={formattedLabel}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Date",
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A",
      sortable: true,
    },
    {
      header: "Status",
      sortable: true,
      render: (row) => {
        const formattedLabel = formatBadgeLabel(row.status);
        const color = labBadgeColors[
          formattedLabel as keyof typeof labBadgeColors
        ] || { bg: "#FFF4E5", text: "#1F2937" };

        return (
          <StatusBadge
            label={formattedLabel}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Action",
      sortable: false,
      render: (row) => (
        <Link
          href={`/lab-dashboard/laboratory/${row.id}`}
          className="inline-flex rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Open laboratory detail"
        >
          <MoreHorizontal size={18} />
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader title="Dashboard" breadcrumbs={[]} />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
              Good morning, {session?.user?.first_name}
            </h1>
            <p className="text-base text-[#3F3F46]">
              Here&apos;s what&apos;s happening across the laboratory today.
            </p>
          </div>
          <div>
            <LabDateRangeFilter
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
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <DataTable
            title="Patient Lab Requests"
            data={requestsData?.results || []}
            columns={columns}
            viewAllLink="/lab-dashboard/laboratory"
            totalPages={requestsData?.total_pages}
            emptyMessage={
              isLoadingRequests
                ? "Loading lab requests..."
                : "No lab requests found."
            }
          />
        </div>
      </div>
    </div>
  );
}
