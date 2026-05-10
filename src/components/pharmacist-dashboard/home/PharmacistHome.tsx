"use client";

import Link from "next/link";
import {
  AlertOctagon,
  ArrowRight,
  Box,
  MoreHorizontal,
  Pill,
  ReceiptText,
} from "lucide-react";
import DashboardStatCard from "@/src/components/generic/dashboard/DashboardStatCard";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import {
  PRESCRIPTIONS,
  PrescriptionRow,
  prescriptionBadgeColors,
} from "@/src/components/pharmacist-dashboard/prescriptions/pharmacyData";

const stats = [
  {
    title: "Pending Prescriptions",
    value: 263,
    icon: ReceiptText,
    active: true,
    href: "/pharmacist-dashboard/prescriptions",
  },
  {
    title: "Dispensed Today",
    value: 193,
    icon: Pill,
    href: "/pharmacist-dashboard/prescriptions",
  },
  {
    title: "Low Stock Alerts",
    value: 34,
    icon: Box,
    href: "/pharmacist-dashboard/inventory",
  },
  {
    title: "ADR Reports",
    value: 24,
    icon: AlertOctagon,
    href: "/pharmacist-dashboard/adverse-events",
  },
];

const activity = [
  {
    label: "Dispensed Metformin 500mg x60 to Liam O'Connor",
    time: "11:00 AM",
    color: "#00A556",
  },
  {
    label: "Low stock alert: Salbutamol Inhaler (7 units left)",
    time: "11:00 AM",
    color: "#FFC987",
  },
  {
    label: "ADR-PLT-000234 submitted for Tramadol - Severe",
    time: "11:00 AM",
    color: "#E12D2D",
  },
  {
    label: "Dispensed Atorvastatin 40mg to Rotimi Alade",
    time: "11:00 AM",
    color: "#00A556",
  },
  {
    label: "Restocked Azithromycin 500mg (+200)",
    time: "11:00 AM",
    color: "#FFC987",
  },
];

export default function PharmacistHome() {
  const columns: ColumnDef<PrescriptionRow>[] = [
    { header: "Prescribed ID", accessorKey: "prescribedId", sortable: true },
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Medications", accessorKey: "medications", sortable: true },
    { header: "Prescribed By", accessorKey: "prescribedBy", sortable: true },
    { header: "Date", accessorKey: "date", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.status}
          bgColorHex={prescriptionBadgeColors[row.status].bg}
          textColorHex={prescriptionBadgeColors[row.status].text}
        />
      ),
    },
    {
      header: "Action",
      sortable: true,
      render: () => (
        <Link
          href="/pharmacist-dashboard/prescriptions"
          className="inline-flex rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Open prescription"
        >
          <MoreHorizontal size={18} />
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader title="Dashboard" breadcrumbs={[]} />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
            Good morning, Festus
          </h1>
          <p className="text-base text-[#3F3F46]">
            Here&apos;s what&apos;s happening across the pharmacy today.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,424px)_320px]">
          <section className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#3F3F46]">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {activity.map((item) => (
                <div key={item.label} className="flex gap-3">
                  <span
                    className="mt-1 h-[70px] w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="text-base font-medium leading-6 text-[#53545C]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-[#1F2A44]">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#3F3F46]">
                Status overview
              </h2>
              <span className="text-xs text-gray-300">This Week</span>
            </div>
            <div className="mb-8 flex flex-wrap gap-7 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <i className="h-2 w-2 rounded-full bg-[#046C3F]" />
                Dispensed
              </span>
              <span className="flex items-center gap-2">
                <i className="h-2 w-2 rounded-full bg-[#1AC073]" />
                Pending
              </span>
              <span className="flex items-center gap-2">
                <i className="h-2 w-2 rounded-full bg-[#FFC987]" />
                Cancelled
              </span>
            </div>
            <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-full bg-[conic-gradient(#046C3F_0_46%,#FFC987_46%_76%,#1AC073_76%_90%,#E9EDFB_90%_100%)]">
              <div className="h-28 w-28 rounded-full bg-white" />
            </div>
          </section>
        </div>

        <DataTable
          title="Patient Prescription"
          data={PRESCRIPTIONS.slice(0, 6)}
          columns={columns}
          viewAllLink="/pharmacist-dashboard/prescriptions"
          emptyMessage="No prescriptions found."
          totalPages={undefined}
        />

        <Link
          href="/pharmacist-dashboard/prescriptions"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#046C3F] lg:hidden"
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
