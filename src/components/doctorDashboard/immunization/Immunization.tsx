"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import ImmunizationList from "./ImmunizationList";
import { useImmunizationRecords } from "@/src/hooks/nurses/use-immunization";

export default function Immunization() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const statusFilter = searchParams.get("status") || "All Status";
  const sessionTypeFilter =
    searchParams.get("session_type") || "All Session Types";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";

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

  const { data, isLoading } = useImmunizationRecords({
    page,
    page_size: pageSize,
    status: statusFilter === "All Status" ? undefined : statusFilter,
    session_type:
      sessionTypeFilter === "All Session Types" ? undefined : sessionTypeFilter,
    search: searchParams.get("search") || undefined,
    start_date,
    end_date,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Status" && value !== "All Session Types") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Immunization"
        breadcrumbs={[{ label: "Immunization" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <ImmunizationList
          records={data?.results || []}
          totalPages={data?.total_pages}
          isLoading={isLoading}
          setLocalSearch={setLocalSearch}
          statusFilter={statusFilter}
          sessionTypeFilter={sessionTypeFilter}
          startDate={start_date}
          endDate={end_date}
          updateUrlParams={updateUrlParams}
          onRegisterClick={() =>
            router.push("/doctor-dashboard/immunization/new")
          }
        />
      </div>
    </div>
  );
}
