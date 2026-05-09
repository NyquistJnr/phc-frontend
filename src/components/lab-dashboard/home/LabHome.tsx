"use client";

import Link from "next/link";
import type { ElementType } from "react";
import { CheckCircle2, ChevronDown, ClipboardList, MoreHorizontal, PackageCheck } from "lucide-react";
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

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  active,
}: {
  title: string;
  value: number;
  icon: ElementType;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`min-h-36 rounded-xl p-4 transition-colors ${
        active
          ? "bg-[#046C3F] text-white"
          : "bg-white text-gray-500 hover:bg-[#F9FFFC]"
      }`}
    >
      <div className="mb-8 flex items-start justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            active ? "bg-[#0B7F4D] text-white" : "bg-[#FFF7ED] text-gray-700"
          }`}
        >
          <Icon size={21} />
        </span>
        <span className={`flex items-center gap-1 text-xs ${active ? "text-white" : "text-gray-300"}`}>
          This Week <ChevronDown size={14} />
        </span>
      </div>
      <p className={`mb-3 text-sm ${active ? "text-white" : "text-gray-400"}`}>
        {title}
      </p>
      <p className={`text-3xl font-semibold ${active ? "text-white" : "text-gray-800"}`}>
        {value}
      </p>
    </Link>
  );
}

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
            <StatCard key={stat.title} {...stat} />
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
