"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DataTable, ColumnDef } from "../../generic/ui/DataTable";
import { StatusBadge, ActionButton } from "../../generic/ui/TableHelpers";
import { CustomDropdown } from "../../generic/ui/CustomDropdown";

type PatientRow = {
  id: string;
  name: string;
  ageGender: string;
  visitType: string;
  priority: "High" | "Medium" | "Low";
  status: "Vitals Pending" | "Waiting" | "Completed";
};

const patientData: PatientRow[] = [
  {
    id: "PAT-PLT-000234",
    name: "Ngozi Eze",
    ageGender: "45 / M",
    visitType: "ANC",
    priority: "High",
    status: "Vitals Pending",
  },
  {
    id: "PAT-PLT-000234",
    name: "Emeka Dike",
    ageGender: "45 / F",
    visitType: "General",
    priority: "High",
    status: "Vitals Pending",
  },
  {
    id: "PAT-PLT-000234",
    name: "Amina Bello",
    ageGender: "45 / M",
    visitType: "Immunization",
    priority: "Medium",
    status: "Waiting",
  },
  {
    id: "PAT-PLT-000234",
    name: "Chukwu Obi",
    ageGender: "45 / F",
    visitType: "Postnatal",
    priority: "Low",
    status: "Completed",
  },
];

export default function PatientsDashboard() {
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(patientData.length / itemsPerPage);

  const paginatedData = patientData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const columns: ColumnDef<PatientRow>[] = [
    {
      header: "Patient ID",
      sortable: true,
      render: (row) => (
        <Link
          href={`/patients/${row.id}`}
          className="text-gray-500 hover:text-[#0a6c38]"
        >
          {row.id}
        </Link>
      ),
    },
    { header: "Patient Name", accessorKey: "name", sortable: true },
    { header: "Age/Gender", accessorKey: "ageGender", sortable: true },
    { header: "Visit Type", accessorKey: "visitType", sortable: true },
    {
      header: "Priority",
      sortable: true,
      render: (row) => {
        let bgHex = "#f3f4f6";
        let textHex = "#4b5563";
        if (row.priority === "High") {
          bgHex = "#fee2e2";
          textHex = "#dc2626";
        }
        if (row.priority === "Medium") {
          bgHex = "#ffedd5";
          textHex = "#c2410c";
        }
        if (row.priority === "Low") {
          bgHex = "#dcfce7";
          textHex = "#16a34a";
        }

        return (
          <StatusBadge
            label={row.priority}
            bgColorHex={bgHex}
            textColorHex={textHex}
          />
        );
      },
    },
    {
      header: "Status",
      sortable: true,
      render: (row) => {
        let bgHex = "#f3f4f6";
        let textHex = "#4b5563";
        if (row.status === "Vitals Pending") {
          bgHex = "#fee2e2";
          textHex = "#dc2626";
        }
        if (row.status === "Waiting") {
          bgHex = "#ffedd5";
          textHex = "#c2410c";
        }
        if (row.status === "Completed") {
          bgHex = "#dcfce7";
          textHex = "#16a34a";
        }

        return (
          <StatusBadge
            label={row.status}
            bgColorHex={bgHex}
            textColorHex={textHex}
          />
        );
      },
    },
    {
      header: "Action",
      sortable: true,
      render: (row) => (
        <ActionButton
          label={row.status === "Completed" ? "View" : "Record Vitals"}
          variant={row.status === "Completed" ? "soft" : "solid"}
          onClick={() => console.log("Action on", row.id)}
        />
      ),
    },
  ];

  return (
    <div className="p-2 bg-[#f8f9fb] min-h-screen">
      <DataTable
        title="Today's Patient waiting for vital"
        data={paginatedData}
        columns={columns}
        showSearch={true}
        searchPlaceholder="Search patients..."
        totalPages={totalPages}
        toolbarActions={
          <>
            <CustomDropdown
              options={["All Roles", "Host", "Driver", "Customer", "Admin"]}
              selected={roleFilter}
              onSelect={setRoleFilter}
            />

            <CustomDropdown
              options={["All Statuses", "Active", "Pending", "Banned"]}
              selected={statusFilter}
              onSelect={setStatusFilter}
            />
          </>
        }
        onViewAll={() => console.log("Routing to all patients")}
      />
    </div>
  );
}
