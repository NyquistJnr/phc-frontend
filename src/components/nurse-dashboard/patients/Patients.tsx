"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import {
  ActionButton,
  StatusBadge,
} from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import { usePatients } from "@/src/hooks/nurses/use-patients";
import { Patient } from "./type";

const PAGE_SIZES = ["10", "100", "200"];

const badgeColors: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "#DFF3EA", text: "#039855" },
  NONE: { bg: "#FDE8E8", text: "#F33131" },
  UNKNOWN: { bg: "#FFF4E5", text: "#1F2937" },
};

export default function Patients() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (localSearch === currentSearch) {
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (localSearch) {
        params.set("search", localSearch);
      } else {
        params.delete("search");
      }

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, pathname, router, searchParams]);

  const { data, isLoading } = usePatients({
    page,
    page_size: pageSize,
    search: searchParams.get("search") || undefined,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const patients = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const columns: ColumnDef<Patient>[] = [
    {
      header: "Patient ID",
      render: (row) => row.profile?.patient_id || "N/A",
    },
    {
      header: "Patient Name",
      render: (row) => `${row.first_name} ${row.last_name}`.trim(),
    },
    {
      header: "Age / Group",
      render: (row) => `${row.profile?.age} yrs (${row.profile?.age_group})`,
    },
    {
      header: "Gender",
      render: (row) => row.profile?.sex || "N/A",
    },
    {
      header: "Blood Group",
      render: (row) => row.profile?.blood_group || "N/A",
    },
    {
      header: "Insurance",
      render: (row) => {
        const status = row.profile?.insurance_status || "UNKNOWN";
        const color = badgeColors[status] || badgeColors.UNKNOWN;

        return (
          <StatusBadge
            label={status}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Action",
      render: (row) => (
        <ActionButton
          label="View"
          variant="soft"
          onClick={() => router.push(`/nurse-dashboard/patients/${row.id}`)}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Patients"
        breadcrumbs={[{ label: "Patients" }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Patients
            </h2>
            <p className="text-base text-[#3F3F46]">
              View and manage patient records
            </p>
          </div>
        </div>

        <DataTable
          title="Patients"
          data={patients}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient name or ID"
          onSearch={(val) => setLocalSearch(val)}
          totalPages={totalPages}
          emptyMessage={
            isLoading ? "Loading patients..." : "No patients found."
          }
          toolbarActions={
            <>
              <CustomDropdown
                options={PAGE_SIZES}
                selected={pageSize.toString()}
                onSelect={(val) => updateUrlParams("page_size", val)}
                placeholder="Rows per page"
              />
            </>
          }
        />
      </div>
    </div>
  );
}
