"use client";

import Link from "next/link";
import { useState } from "react";
import type { ElementType, ReactNode } from "react";
import { Activity, ArrowRight, Baby, Syringe, Users } from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import {
  useNurseStats,
  useDashboardVitalsQueue,
  useDashboardMaternalAlerts,
  useDashboardImmunizationsDue,
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

function SummaryPanel({
  title,
  icon,
  href,
  children,
}: {
  title: string;
  icon: ReactNode;
  href: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <span className="text-gray-700">{icon}</span>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        <Link
          href={href}
          className="flex items-center gap-2 text-sm font-medium text-[#046C3F] hover:underline"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <div className="space-y-0 flex-grow">{children}</div>
    </section>
  );
}

function ListRow({
  name,
  description,
  status,
  color,
}: {
  name: string;
  description: string;
  status: string;
  color: "green" | "red" | "blue" | "amber";
}) {
  const colorSet = badgeColors[color];

  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-4 last:border-b-0">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-gray-800">{name}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <StatusBadge
        label={status}
        bgColorHex={colorSet.bg}
        textColorHex={colorSet.text}
      />
    </div>
  );
}

export default function NurseHome() {
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

  const { data: maternalData, isLoading: isLoadingMaternal } =
    useDashboardMaternalAlerts({
      page: 1,
      page_size: 4,
    });

  const { data: immunizationsData, isLoading: isLoadingImmunizations } =
    useDashboardImmunizationsDue({
      page: 1,
      page_size: 4,
    });

  const dashboardStats = [
    {
      title: "Waiting Queue",
      value: statsData?.waiting_in_queue || 0,
      icon: Users,
      href: "/nurse-dashboard/patients",
      active: true,
    },
    {
      title: "Vitals Pending",
      value: statsData?.vitals_pending || 0,
      icon: Activity,
      href: "/nurse-dashboard/vitals",
    },
    {
      title: "Maternal Alerts",
      value: statsData?.maternal_alerts || 0,
      icon: Baby,
      href: "/nurse-dashboard/maternal-care",
    },
    {
      title: "Vaccines Due",
      value: statsData?.vaccines_due || 0,
      icon: Syringe,
      href: "/nurse-dashboard/immunization",
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
          href={`/nurse-dashboard/appointments/${row.appointment}`}
          className={`inline-flex rounded-full px-4 py-1.5 text-xs font-medium ${
            row.appointment_status === "VITALS_DONE" ||
            row.appointment_status === "COMPLETED"
              ? "border border-[#8CC5AE] bg-[#EAF7F1] text-[#046C3F]"
              : "bg-[#046C3F] text-white"
          }`}
        >
          {row.appointment_status === "VITALS_DONE" ||
          row.appointment_status === "COMPLETED"
            ? "View"
            : "Record Vitals"}
        </Link>
      ),
    },
  ];

  const getMaternalAlertColor = (priority: string) => {
    if (priority === "CRITICAL" || priority === "URGENT") return "red";
    if (priority === "NORMAL") return "amber";
    return "blue";
  };

  const getImmunizationColor = (nextDueDate: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (nextDueDate < todayStr) return "red";
    if (nextDueDate === todayStr) return "blue";
    return "amber";
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader title="Dashboard" breadcrumbs={[]} />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Good morning, Nurse {session?.user?.first_name}
            </h1>
            <p className="text-base text-[#3F3F46]">
              Here&apos;s your patient workload for today
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
        <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-[0.82fr_1.18fr]">
          <SummaryPanel
            title="Maternal Alerts"
            icon={<Baby size={23} />}
            href="/nurse-dashboard/maternal-care"
          >
            {isLoadingMaternal ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Loading maternal alerts...
              </div>
            ) : maternalData?.results?.length > 0 ? (
              maternalData.results.map((alert: any, i: number) => (
                <ListRow
                  key={`${alert.patient_id}-${i}`}
                  name={alert.patient_name}
                  description={alert.details}
                  status={alert.priority}
                  color={getMaternalAlertColor(alert.priority)}
                />
              ))
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">
                No active maternal alerts.
              </div>
            )}
          </SummaryPanel>

          <SummaryPanel
            title="Immunization Due"
            icon={<Syringe size={23} />}
            href="/nurse-dashboard/immunization"
          >
            {isLoadingImmunizations ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Loading immunizations...
              </div>
            ) : immunizationsData?.results?.length > 0 ? (
              immunizationsData.results.map((item: any) => (
                <ListRow
                  key={item.id}
                  name={item.patient_name}
                  description={`${item.vaccine_name} · ${item.next_dose_target}`}
                  status={item.user_friendly_date}
                  color={getImmunizationColor(item.next_due_date)}
                />
              ))
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">
                No immunizations due.
              </div>
            )}
          </SummaryPanel>
        </div>
        <DataTable
          title="Patient waiting for vital"
          data={vitalsData?.results || []}
          columns={patientColumns}
          viewAllLink="/nurse-dashboard/vitals"
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
