"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ClipboardList,
  PlusCircle,
} from "lucide-react";
import DashboardStatCard from "@/src/components/generic/dashboard/DashboardStatCard";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import LabDateRangeFilter from "@/src/components/lab-dashboard/generics/LabDateRangeFilter";
import {
  useLabRequestStats,
  useLabTestStats,
} from "@/src/hooks/laboratory/use-laboratory";
import LabRequests from "./LabRequests";
import LabResults from "./LabResults";

type Tab = "requests" | "results";

function getStatValue(
  data: Record<string, unknown> | undefined,
  keys: string[],
) {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") return Number(value);
  }
  return 0;
}

function SegmentedTabs({
  tab,
  setTab,
  actions,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="grid w-full max-w-[400px] grid-cols-2 overflow-hidden rounded-lg bg-[#EEF7F4]">
        <button
          onClick={() => setTab("requests")}
          className={`h-10 text-sm font-medium ${tab === "requests" ? "bg-[#046C3F] text-white" : "text-gray-400"}`}
        >
          Lab Requests
        </button>
        <button
          onClick={() => setTab("results")}
          className={`h-10 text-sm font-medium ${tab !== "requests" ? "bg-[#046C3F] text-white" : "text-gray-400"}`}
        >
          Lab Results
        </button>
      </div>
      {actions}
    </div>
  );
}

export default function LaboratoryListing() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("requests");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const statsFilters = { start_date: startDate, end_date: endDate };
  const { data: requestStats } = useLabRequestStats(statsFilters);
  const { data: testStats } = useLabTestStats(statsFilters);

  const pageTitle = tab === "results" ? "Lab Results" : "Lab Requests";
  const breadcrumbs =
    tab === "results"
      ? [{ label: "Laboratory" }, { label: "Lab results" }]
      : [{ label: "Laboratory" }];
  const stats = [
    {
      title: "Pending lab Requests",
      value: getStatValue(requestStats, [
        "pending_lab_requests",
        "pending",
        "pending_requests",
      ]),
      icon: ClipboardList,
      active: true,
    },
    {
      title: "In Progress",
      value: getStatValue(requestStats, [
        "in_progress",
        "processing",
        "partial",
      ]),
      icon: ClipboardList,
    },
    {
      title: "Completed Today",
      value: getStatValue(testStats, ["completed", "result_ready", "ready"]),
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader title="Laboratory" breadcrumbs={breadcrumbs} />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black sm:text-3xl">
              {pageTitle}
            </h1>
            {tab === "requests" && (
              <p className="mt-2 text-base text-[#3F3F46]">
                Test requests from Doctor
              </p>
            )}
          </div>
          <LabDateRangeFilter
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

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3 xl:max-w-3xl">
          {stats.map((stat) => (
            <DashboardStatCard key={stat.title} {...stat} showPeriod={false} />
          ))}
        </div>

        <SegmentedTabs
          tab={tab}
          setTab={setTab}
          actions={
            tab === "results" ? (
              <button
                onClick={() => router.push("/lab-dashboard/laboratory/new")}
                className="flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-6 text-base font-medium text-white"
              >
                <PlusCircle size={20} /> Enter New Lab Result
              </button>
            ) : null
          }
        />

        {tab === "requests" ? <LabRequests /> : <LabResults />}
      </div>
    </div>
  );
}
