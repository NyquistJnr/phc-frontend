"use client";

import { useState, ElementType } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  PlusCircle,
} from "lucide-react";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import LabRequests from "./LabRequests";
import LabResults from "./LabResults";

type Tab = "requests" | "results";

const stats = [
  {
    title: "Pending lab Requests",
    value: 0,
    icon: ClipboardList,
    active: true,
  },
  { title: "In Progress", value: 0, icon: ClipboardList },
  { title: "Completed Today", value: 0, icon: CheckCircle2 },
];

function StatCard({
  title,
  value,
  icon: Icon,
  active,
}: {
  title: string;
  value: number;
  icon: ElementType;
  active?: boolean;
}) {
  return (
    <div
      className={`min-h-36 rounded-xl p-4 ${active ? "bg-[#046C3F] text-white" : "bg-white text-gray-500"}`}
    >
      <div className="mb-8 flex items-start justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-[#0B7F4D] text-white" : "bg-[#FFF7ED] text-gray-700"}`}
        >
          <Icon size={21} />
        </span>
        <span
          className={`flex items-center gap-1 text-xs ${active ? "text-white" : "text-gray-300"}`}
        >
          This Week <ChevronDown size={14} />
        </span>
      </div>
      <p className={`mb-3 text-sm ${active ? "text-white" : "text-gray-400"}`}>
        {title}
      </p>
      <p
        className={`text-3xl font-semibold ${active ? "text-white" : "text-gray-800"}`}
      >
        {value}
      </p>
    </div>
  );
}

function SegmentedTabs({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
}) {
  return (
    <div className="mb-6 grid max-w-[400px] grid-cols-2 overflow-hidden rounded-lg bg-[#EEF7F4]">
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
  );
}

export default function LaboratoryListing() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("requests");

  const pageTitle = tab === "results" ? "Lab Results" : "Lab Requests";
  const breadcrumbs =
    tab === "results"
      ? [{ label: "Laboratory" }, { label: "Lab results" }]
      : [{ label: "Laboratory" }];

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
          {tab === "results" && (
            <button
              onClick={() => router.push("/lab-dashboard/laboratory/new")}
              className="flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-6 text-base font-medium text-white"
            >
              <PlusCircle size={20} /> Enter New Lab Result
            </button>
          )}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3 xl:max-w-3xl">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <SegmentedTabs tab={tab} setTab={setTab} />

        {tab === "requests" ? <LabRequests /> : <LabResults />}
      </div>
    </div>
  );
}
