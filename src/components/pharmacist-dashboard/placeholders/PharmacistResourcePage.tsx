"use client";

import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import {
  ADVERSE_EVENTS,
  PHARMACY_INVENTORY,
  PHARMACY_PATIENTS,
  PHARMACY_PAYMENTS,
} from "@/src/components/pharmacist-dashboard/prescriptions/pharmacyData";

type Resource = "patients" | "inventory" | "payments" | "adverse-events";

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "#DDF2EA", text: "#00A556" },
  "In Stock": { bg: "#DDF2EA", text: "#00A556" },
  "Low Stock": { bg: "#FFF1DE", text: "#2E2E2E" },
  "Out of Stock": { bg: "#FFE5E5", text: "#FF1F1F" },
  Completed: { bg: "#DDF2EA", text: "#00A556" },
  Pending: { bg: "#FFF1DE", text: "#2E2E2E" },
  Submitted: { bg: "#E2E7FF", text: "#046C3F" },
  Reviewed: { bg: "#DDF2EA", text: "#00A556" },
  Reported: { bg: "#E2E7FF", text: "#046C3F" },
  Resolved: { bg: "#DDF2EA", text: "#00A556" },
  Mild: { bg: "#DDF2EA", text: "#00A556" },
  Moderate: { bg: "#FFF1DE", text: "#2E2E2E" },
  Severe: { bg: "#FFE5E5", text: "#FF1F1F" },
};

function badge(label: string) {
  const color = statusColors[label] ?? { bg: "#F1F5F9", text: "#475569" };
  return (
    <StatusBadge
      label={label}
      bgColorHex={color.bg}
      textColorHex={color.text}
    />
  );
}

const pageConfig = {
  patients: {
    header: "Patients",
    title: "Patients",
    subtitle: "View pharmacy patient records",
    tableTitle: "Patient Records",
    data: PHARMACY_PATIENTS,
    columns: [
      { header: "Patient ID", accessorKey: "patientId", sortable: true },
      { header: "Patient Name", accessorKey: "patientName", sortable: true },
      { header: "Age/Gender", accessorKey: "ageGender", sortable: true },
      {
        header: "Last Prescription",
        accessorKey: "lastPrescription",
        sortable: true,
      },
      {
        header: "Status",
        sortable: true,
        render: (row: (typeof PHARMACY_PATIENTS)[number]) => badge(row.status),
      },
    ] satisfies ColumnDef<(typeof PHARMACY_PATIENTS)[number]>[],
  },
  inventory: {
    header: "Inventory",
    title: "Inventory",
    subtitle: "Monitor pharmacy stock, low stock and expiry",
    tableTitle: "Drug Stock",
    data: PHARMACY_INVENTORY,
    columns: [
      { header: "Item", accessorKey: "drugName", sortable: true },
      { header: "Batch", accessorKey: "batch", sortable: true },
      { header: "Unit", accessorKey: "unit", sortable: true },
      { header: "Qty", accessorKey: "qty", sortable: true },
      { header: "Threshold", accessorKey: "threshold", sortable: true },
      { header: "Expiry", accessorKey: "expiry", sortable: true },
      {
        header: "Status",
        sortable: true,
        render: (row: (typeof PHARMACY_INVENTORY)[number]) => badge(row.status),
      },
      { header: "Last Updated", accessorKey: "updated", sortable: true },
    ] satisfies ColumnDef<(typeof PHARMACY_INVENTORY)[number]>[],
  },
  payments: {
    header: "Payments",
    title: "Payments",
    subtitle: "Track prescription payments and payment methods",
    tableTitle: "Payment Records",
    data: PHARMACY_PAYMENTS,
    columns: [
      { header: "Payment ID", accessorKey: "paymentId", sortable: true },
      { header: "Patient Name", accessorKey: "patientName", sortable: true },
      { header: "Amount", accessorKey: "amount", sortable: true },
      { header: "Method", accessorKey: "method", sortable: true },
      { header: "Date", accessorKey: "date", sortable: true },
      {
        header: "Status",
        sortable: true,
        render: (row: (typeof PHARMACY_PAYMENTS)[number]) => badge(row.status),
      },
    ] satisfies ColumnDef<(typeof PHARMACY_PAYMENTS)[number]>[],
  },
  "adverse-events": {
    header: "Adverse Events",
    title: "Adverse Events",
    subtitle: "Review adverse drug reaction reports",
    tableTitle: "ADR Reports",
    data: ADVERSE_EVENTS,
    columns: [
      { header: "Report ID", accessorKey: "reportId", sortable: true },
      { header: "Patient Name", accessorKey: "patientName", sortable: true },
      { header: "Drug", accessorKey: "drug", sortable: true },
      { header: "Reaction", accessorKey: "reaction", sortable: true },
      { header: "Reported By", accessorKey: "reportedBy", sortable: true },
      { header: "Severity", accessorKey: "severity", sortable: true },
      { header: "Date", accessorKey: "date", sortable: true },
      {
        header: "Status",
        sortable: true,
        render: (row: (typeof ADVERSE_EVENTS)[number]) => badge(row.status),
      },
    ] satisfies ColumnDef<(typeof ADVERSE_EVENTS)[number]>[],
  },
};

export default function PharmacistResourcePage({
  resource,
}: {
  resource: Resource;
}) {
  const config = pageConfig[resource];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title={config.header}
        breadcrumbs={[{ label: config.header }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7">
          <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
            {config.title}
          </h1>
          <p className="text-base text-[#3F3F46]">{config.subtitle}</p>
        </div>

        <DataTable
          title={config.tableTitle}
          data={config.data as never[]}
          columns={config.columns as ColumnDef<never>[]}
          showSearch
          searchPlaceholder="Search"
          totalPages={3}
          emptyMessage={`No ${config.tableTitle.toLowerCase()} found.`}
        />
      </div>
    </div>
  );
}
