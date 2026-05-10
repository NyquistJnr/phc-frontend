"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";

import { useAncVisits } from "@/src/hooks/nurses/use-maternal-care";
import { AncVisitResult } from "./type";
import { ATTENDANCE_TYPES } from "./type";

interface AncVisitListProps {
  episodeId: string;
}

export function AncVisitList({ episodeId }: AncVisitListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const startDate = searchParams.get("start_date") || "";
  const endDate = searchParams.get("end_date") || "";
  const attendanceType = searchParams.get("attendance_type") || "All Types";

  const { data: ancData, isFetching } = useAncVisits({
    episode_id: episodeId,
    page,
    page_size: pageSize,
    start_date: startDate,
    end_date: endDate,
    attendance_type: attendanceType,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Types") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      if (key !== "page") newParams.set("page", "1");
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns: ColumnDef<AncVisitResult>[] = [
    {
      header: "Visit Date",
      render: (row) => row.appointment_date,
      sortable: true,
    },
    {
      header: "Attendance Type",
      render: (row) => (
        <StatusBadge
          label={row.attendance_type}
          bgColorHex="#F3F4F6"
          textColorHex="#374151"
        />
      ),
    },
    { header: "Risk Factors", accessorKey: "risk_factors" },
    {
      header: "Iron/Folate Given",
      render: (row) => (row.iron_folate_given ? "Yes" : "No"),
    },
    { header: "Notes", accessorKey: "notes" },
  ];

  return (
    <DataTable
      title="ANC Visit Records"
      data={(ancData?.results || []) as any[]}
      columns={columns as any}
      totalPages={ancData?.total_pages}
      emptyMessage={
        isFetching
          ? "Loading records..."
          : "No ANC visit records found for this episode."
      }
      toolbarActions={
        <>
          <NurseDateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onApply={(start, end) => {
              const params = new URLSearchParams(searchParams.toString());
              if (start) params.set("start_date", start);
              else params.delete("start_date");
              if (end) params.set("end_date", end);
              else params.delete("end_date");
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
            onClear={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("start_date");
              params.delete("end_date");
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          />
          <CustomDropdown
            options={ATTENDANCE_TYPES}
            selected={attendanceType}
            onSelect={(val) => updateUrlParams("attendance_type", val)}
          />
          <CustomDropdown
            options={["10", "50", "100"]}
            selected={pageSize.toString()}
            placeholder="Rows per page"
            onSelect={(val) => updateUrlParams("page_size", val)}
          />
        </>
      }
    />
  );
}
