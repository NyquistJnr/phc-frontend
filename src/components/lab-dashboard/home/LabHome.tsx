"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardList, MoreHorizontal, PackageCheck } from "lucide-react";
import DashboardStatCard from "@/src/components/generic/dashboard/DashboardStatCard";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import {
  LAB_REQUESTS,
  LabRequestRow,
  labBadgeColors,
} from "@/src/components/lab-dashboard/laboratory/labData";

const stats = [
  {
    title: "Pending lab Requests",
    value: 56,
    icon: ClipboardList,
    href: "/lab-dashboard/laboratory",
    active: true,
  },
  {
    title: "In Progress",
    value: 34,
    icon: ClipboardList,
    href: "/lab-dashboard/laboratory",
  },
  {
    title: "Completed Today",
    value: 27,
    icon: CheckCircle2,
    href: "/lab-dashboard/laboratory",
  },
  {
    title: "Inventory Alerts",
    value: 21,
    icon: PackageCheck,
    href: "/lab-dashboard/lab-inventory",
  },
];

export default function LabHome() {
  const columns: ColumnDef<LabRequestRow>[] = [
    { header: "Lab request ID", accessorKey: "requestId", sortable: true },
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Test Type", accessorKey: "testType", sortable: true },
    { header: "Requested by", accessorKey: "requestedBy", sortable: true },
    {
      header: "Priority",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.priority}
          bgColorHex={labBadgeColors[row.priority].bg}
          textColorHex={labBadgeColors[row.priority].text}
        />
      ),
    },
    { header: "Date", accessorKey: "date", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.status}
          bgColorHex={labBadgeColors[row.status].bg}
          textColorHex={labBadgeColors[row.status].text}
        />
      ),
    },
    {
      header: "Action",
      sortable: true,
      render: () => (
        <Link
          href="/lab-dashboard/laboratory"
          className="inline-flex rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Open laboratory"
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
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
            Good morning, Festus
          </h1>
          <p className="text-base text-[#3F3F46]">
            Here&apos;s what&apos;s happening across the laboratory today.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStatCard key={stat.title} {...stat} />
          ))}
        </div>

        <DataTable
          title="Patient Lab Requests"
          data={LAB_REQUESTS.slice(0, 6)}
          columns={columns}
          viewAllLink="/lab-dashboard/laboratory"
          emptyMessage="No lab requests found."
        />
      </div>
    </div>
  );
}
