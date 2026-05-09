"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import {
  ActionButton,
  StatusBadge,
} from "@/src/components/generic/ui/TableHelpers";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import { useVitalsList } from "@/src/hooks/nurses/use-vitals";

const VISIT_TYPES = [
  "ANC",
  "GENERAL",
  "IMMUNIZATION",
  "POSTNATAL",
  "CONSULTATION",
  "FOLLOW_UP",
  "LAB_TEST",
];
const PRIORITY_OPTIONS = ["All Priority", "CRITICAL", "HIGH", "NORMAL", "LOW"];
const STATUS_OPTIONS = [
  "All Status",
  "WAITING",
  "PENDING",
  "VITALS_DONE",
  "COMPLETED",
];
const PAGE_SIZES = ["10", "100", "200"];

const badgeColors = {
  green: { bg: "#DFF3EA", text: "#039855" },
  red: { bg: "#FDE8E8", text: "#F33131" },
  amber: { bg: "#FFF4E5", text: "#1F2937" },
};

export default function VitalsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const visitFilter = searchParams.get("visit_type") || "All Visit Types";
  const priorityFilter = searchParams.get("priority") || "All Priority";
  const statusFilter = searchParams.get("status") || "All Status";

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (localSearch === currentSearch) return;

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

  const { data, isLoading } = useVitalsList({
    page,
    page_size: pageSize,
    search: searchParams.get("search") || undefined,
    visit_type: visitFilter,
    priority: priorityFilter,
    status: statusFilter,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && !value.startsWith("All ")) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns: ColumnDef<any>[] = [
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
    {
      header: "Visit Type",
      sortable: true,
      render: (row) => row.visit_type?.replace("_", " ") || "-",
    },
    {
      header: "Priority",
      sortable: true,
      render: (row) => {
        const priority = row.appointment_priority;
        const color =
          priority === "LOW"
            ? badgeColors.green
            : priority === "NORMAL"
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
            label={status?.replace("_", " ")}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Action",
      sortable: false,
      render: (row) => {
        const isCompleted =
          row.appointment_status === "COMPLETED" ||
          row.appointment_status === "VITALS_DONE";
        return (
          <ActionButton
            label={isCompleted ? "View" : "Record Vitals"}
            variant={isCompleted ? "soft" : "solid"}
            onClick={() =>
              router.push(`/nurse-dashboard/appointments/${row.appointment}`)
            }
          />
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Vitals"
        breadcrumbs={[{ label: "Vitals" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Record Patient Vitals
            </h2>
            <p className="text-base text-[#3F3F46]">
              Take and save patient vital signs
            </p>
          </div>
        </div>

        <DataTable
          title="Patient Vitals Queue"
          data={data?.results || []}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient name or ID"
          onSearch={setLocalSearch}
          totalPages={data?.total_pages}
          emptyMessage={
            isLoading
              ? "Loading vitals queue..."
              : "No patients match your criteria."
          }
          toolbarActions={
            <>
              <CustomDropdown
                options={["All Visit Types", ...VISIT_TYPES]}
                selected={visitFilter}
                onSelect={(val) => updateUrlParams("visit_type", val)}
              />
              <CustomDropdown
                options={PRIORITY_OPTIONS}
                selected={priorityFilter}
                onSelect={(val) => updateUrlParams("priority", val)}
              />
              <CustomDropdown
                options={STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={(val) => updateUrlParams("status", val)}
              />
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
