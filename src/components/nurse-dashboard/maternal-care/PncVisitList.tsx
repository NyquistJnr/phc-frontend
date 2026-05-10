"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";

import { usePncVisits } from "@/src/hooks/nurses/use-maternal-care";
import { PncVisitResult } from "./type";
import { TABLE_OUTCOME_OPTIONS } from "./type";

interface PncVisitListProps {
  episodeId: string;
}

export function PncVisitList({ episodeId }: PncVisitListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const startDate = searchParams.get("start_date") || "";
  const endDate = searchParams.get("end_date") || "";
  const outcomeFilter = searchParams.get("outcome") || "All Outcomes";

  const { data: pncData, isFetching } = usePncVisits({
    episode_id: episodeId,
    page,
    page_size: pageSize,
    start_date: startDate,
    end_date: endDate,
    outcome: outcomeFilter,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Outcomes") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      if (key !== "page") newParams.set("page", "1");
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns: ColumnDef<PncVisitResult>[] = [
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
    { header: "Timing of Visit", accessorKey: "timing_of_visit" },
    {
      header: "Outcome",
      render: (row) => {
        const colors: Record<string, { bg: string; text: string }> = {
          TREATED: { bg: "#DFF3EA", text: "#039855" },
          ADMITTED: { bg: "#FFF4E5", text: "#B54708" },
          REFERRED: { bg: "#FDE8E8", text: "#C81E1E" },
        };
        const activeColor = colors[row.outcome] ?? {
          bg: "#F3F4F6",
          text: "#374151",
        };
        return (
          <StatusBadge
            label={row.outcome}
            bgColorHex={activeColor.bg}
            textColorHex={activeColor.text}
          />
        );
      },
    },
    {
      header: "Referral Reason",
      render: (row) => row.referral_reason || "N/A",
    },
  ];

  return (
    <DataTable
      title="Postnatal Visit Records"
      data={(pncData?.results || []) as any[]}
      columns={columns as any}
      totalPages={pncData?.total_pages}
      emptyMessage={
        isFetching
          ? "Loading records..."
          : "No PNC visit records found for this episode."
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
            options={TABLE_OUTCOME_OPTIONS}
            selected={outcomeFilter}
            onSelect={(val) => updateUrlParams("outcome", val)}
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
