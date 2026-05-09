"use client";

import Link from "next/link";
import type { ElementType, ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  Baby,
  ChevronDown,
  Syringe,
  Users,
} from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";

type DashboardPatient = {
  patientId: string;
  patientName: string;
  ageGender: string;
  visitType: string;
  priority: "High" | "Medium" | "Low";
  status: "Vitals Pending" | "Waiting" | "Completed";
};

const PATIENT_ROWS: DashboardPatient[] = [
  ["Ngozi Eze", "45 / M", "ANC", "High", "Vitals Pending"],
  ["Emeka Dike", "45 / F", "General", "High", "Vitals Pending"],
  ["Amina Bello", "45 / M", "Immunization", "Medium", "Waiting"],
  ["Chukwu Obi", "45 / F", "Postnatal", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Medium", "Waiting"],
  ["Kemi Adeyemi", "45 / F", "Consultation", "High", "Vitals Pending"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "High", "Vitals Pending"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Low", "Completed"],
  ["Kemi Adeyemi", "45 / M", "Consultation", "Low", "Completed"],
].map(([patientName, ageGender, visitType, priority, status]) => ({
  patientId: "PAT-PLT-000234",
  patientName,
  ageGender,
  visitType,
  priority: priority as DashboardPatient["priority"],
  status: status as DashboardPatient["status"],
}));

const stats = [
  {
    title: "Waiting Queue",
    value: 37,
    icon: Users,
    href: "/nurse-dashboard/patients",
    active: true,
  },
  {
    title: "Vitals Pending",
    value: 18,
    icon: Activity,
    href: "/nurse-dashboard/vitals",
  },
  {
    title: "Maternal Alerts",
    value: 6,
    icon: Baby,
    href: "/nurse-dashboard/maternal-care",
  },
  {
    title: "Vaccines Due",
    value: 23,
    icon: Syringe,
    href: "/nurse-dashboard/immunization",
  },
];

const maternalAlerts = [
  {
    name: "Blessing Nwachukwu - ANC visit due today",
    description: "28 weeks · 4th antenatal visit",
    status: "ANC Due",
    color: "green",
  },
  {
    name: "Maryam Lawal",
    description: "High-risk pregnancy, BP elevated",
    status: "High risk",
    color: "red",
  },
  {
    name: "Blessing Uche",
    description: "Day 6 review",
    status: "Postnatal",
    color: "blue",
  },
  {
    name: "Blessing Uche",
    description: "High-risk pregnancy, BP elevated",
    status: "Urgent",
    color: "red",
  },
];

const immunizationDue = [
  {
    name: "Ibrahim Musa",
    description: "Measles 2nd dose · 6 yrs",
    status: "Today",
  },
  {
    name: "Baby Eze",
    description: "Penta-3 + OPV-3 · 14 wks",
    status: "Today",
  },
  {
    name: "Baby Bello",
    description: "Penta-2 + Rota · 10 wks",
    status: "Tomorrow",
  },
  {
    name: "Baby Emeka",
    description: "Penta-2 + Rota · 10 wks",
    status: "Tomorrow",
  },
];

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
    <section className="rounded-xl bg-white p-6">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-5">
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
      <div className="space-y-0">{children}</div>
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
    <div className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-gray-800">{name}</p>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
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
  const patientColumns: ColumnDef<DashboardPatient>[] = [
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Age/Gender", accessorKey: "ageGender", sortable: true },
    { header: "Visit Type", accessorKey: "visitType", sortable: true },
    {
      header: "Priority",
      sortable: true,
      render: (row) => {
        const color =
          row.priority === "Low"
            ? badgeColors.green
            : row.priority === "Medium"
              ? badgeColors.amber
              : badgeColors.red;

        return (
          <StatusBadge
            label={row.priority}
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
        const color =
          row.status === "Completed"
            ? badgeColors.green
            : row.status === "Waiting"
              ? badgeColors.amber
              : badgeColors.red;

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
      sortable: true,
      render: (row) => (
        <Link
          href="/nurse-dashboard/vitals"
          className={`inline-flex rounded-full px-4 py-1.5 text-xs font-medium ${
            row.status === "Completed"
              ? "border border-[#8CC5AE] bg-[#EAF7F1] text-[#046C3F]"
              : "bg-[#046C3F] text-white"
          }`}
        >
          {row.status === "Completed" ? "View" : "Record Vitals"}
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader title="Dashboard" breadcrumbs={[]} />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
            Good morning, Nurse Grace
          </h1>
          <p className="text-base text-[#3F3F46]">
            Here&apos;s your patient workload for today
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-[0.82fr_1.18fr]">
          <SummaryPanel
            title="Maternal Alerts"
            icon={<Baby size={23} />}
            href="/nurse-dashboard/maternal-care"
          >
            {maternalAlerts.map((alert) => (
              <ListRow
                key={`${alert.name}-${alert.status}`}
                name={alert.name}
                description={alert.description}
                status={alert.status}
                color={alert.color as "green" | "red" | "blue" | "amber"}
              />
            ))}
          </SummaryPanel>

          <SummaryPanel
            title="Immunization Due"
            icon={<Syringe size={23} />}
            href="/nurse-dashboard/immunization"
          >
            {immunizationDue.map((item) => (
              <ListRow
                key={`${item.name}-${item.status}`}
                name={item.name}
                description={item.description}
                status={item.status}
                color={item.status === "Today" ? "blue" : "amber"}
              />
            ))}
          </SummaryPanel>
        </div>

        <DataTable
          title="Today's Patient waiting for vital"
          data={PATIENT_ROWS}
          columns={patientColumns}
          viewAllLink="/nurse-dashboard/vitals"
          emptyMessage="No patients waiting for vitals."
        />
      </div>
    </div>
  );
}
