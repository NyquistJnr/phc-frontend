"use client";

import Link from "next/link";
import { useState } from "react";
import type { ElementType, ReactNode } from "react";
import { Activity, Baby, Syringe, Users } from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import {
  useNurseStats,
  useDashboardVitalsQueue,
} from "@/src/hooks/nurses/use-dashboard";
import { useSession } from "next-auth/react";

const badgeColors = {
  green: { bg: "#DFF3EA", text: "#039855" },
  red: { bg: "#FDE8E8", text: "#F33131" },
  blue: { bg: "#E2E7FF", text: "#046C3F" },
  amber: { bg: "#FFF4E5", text: "#1F2937" },
};

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  active,
  isLoading,
}: {
  title: string;
  value: number;
  icon: ElementType;
  href: string;
  active?: boolean;
  isLoading?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`min-h-36 rounded-xl p-4 transition-colors ${
        active
          ? "bg-[#046C3F] text-white"
          : "bg-white text-gray-500 hover:bg-[#F9FFFC] border border-gray-100 shadow-sm"
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
      </div>
      <p className={`mb-2 text-sm ${active ? "text-white" : "text-gray-400"}`}>
        {title}
      </p>
      {isLoading ? (
        <div
          className={`h-8 w-16 animate-pulse rounded ${
            active ? "bg-[#0B7F4D]" : "bg-gray-200"
          }`}
        ></div>
      ) : (
        <p
          className={`text-3xl font-semibold ${
            active ? "text-white" : "text-gray-800"
          }`}
        >
          {value}
        </p>
      )}
    </Link>
  );
}

export default function IHOHome() {
  const { data: session } = useSession();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: statsData, isLoading: isLoadingStats } = useNurseStats({
    start_date: startDate,
    end_date: endDate,
  });

  const { data: vitalsData, isLoading: isLoadingVitals } =
    useDashboardVitalsQueue({
      page: 1,
      page_size: 10,
    });

  const dashboardStats = [
    {
      title: "Waiting Queue",
      value: statsData?.waiting_in_queue || 0,
      icon: Users,
      href: "/iho-dashboard/patients",
      active: true,
    },
    {
      title: "Vitals Pending",
      value: statsData?.vitals_pending || 0,
      icon: Activity,
      href: "/iho-dashboard/patients", // Since IHO doesn't have a vitals page, redirect to patients
    },
    {
      title: "Maternal Alerts",
      value: statsData?.maternal_alerts || 0,
      icon: Baby,
      href: "/iho-dashboard/patients", // Since IHO doesn't have maternal care, redirect to patients
    },
    {
      title: "Vaccines Due",
      value: statsData?.vaccines_due || 0,
      icon: Syringe,
      href: "/iho-dashboard/patients", // Since IHO doesn't have immunization, redirect to patients
    },
  ];

  const patientColumns: ColumnDef<any>[] = [
    { header: "Patient ID", accessorKey: "patient_display_id", sortable: true },
    {
      header: "Patient Name",
      sortable: true,
      render: (row) => row.patient_name || "-",
    },
    {
      header: "Age",
      sortable: true,
      render: (row) => `${row.age} yrs`,
    },
    { header: "Visit Type", accessorKey: "visit_type", sortable: true },
    {
      header: "Priority",
      sortable: true,
      render: (row) => {
        const priority = row.appointment_priority;
        const color =
          priority === "LOW"
            ? badgeColors.green
            : priority === "NORMAL" || priority === "MEDIUM"
              ? badgeColors.amber
              : badgeColors.red;

        return (
          <StatusBadge
            label={priority}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Status",
      sortable: true,
      render: (row) => {
        const status = row.appointment_status;
        const color =
          status === "COMPLETED" || status === "VITALS_DONE"
            ? badgeColors.green
            : status === "WAITING" || status === "PENDING"
              ? badgeColors.amber
              : badgeColors.red;

        return (
          <StatusBadge
            label={status.replace("_", " ")}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Action",
      render: (row) => (
        <Link
          href={`/iho-dashboard/appointments/${row.appointment}`}
          className={`inline-flex rounded-full px-4 py-1.5 text-xs font-medium border border-[#8CC5AE] bg-[#EAF7F1] text-[#046C3F]`}
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader title="Dashboard" breadcrumbs={[]} />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Good morning, {session?.user?.first_name}
            </h1>
            <p className="text-base text-[#3F3F46]">
              Here&apos;s the patient queue for today
            </p>
          </div>
          <div>
            <NurseDateRangeFilter
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
          {dashboardStats.map((stat) => (
            <StatCard key={stat.title} {...stat} isLoading={isLoadingStats} />
          ))}
        </div>
        
        <DataTable
          title="Patient waiting for vital"
          data={vitalsData?.results || []}
          columns={patientColumns}
          viewAllLink="/iho-dashboard/appointments"
          emptyMessage={
            isLoadingVitals
              ? "Loading vitals queue..."
              : "No patients waiting for vitals."
          }
        />
      </div>
    </div>
  );
}
