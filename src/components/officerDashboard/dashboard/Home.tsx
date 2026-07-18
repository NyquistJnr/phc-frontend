"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  ClipboardList,
  Folder,
  ArrowRight,
  ListFilter,
  Users,
} from "lucide-react";
import OfficerDashboardHeader from "@/src/components/officerDashboard/generics/OfficerDashboardHeader";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import {
  useClinicalStats,
  usePatientVisitTrend,
  useClinicalActivity,
  useDiseaseOverview,
  useRecentAppointments,
} from "@/src/hooks/core/use-clinical-analytics";
import Link from "next/link";

export default function OICDashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: clinicalStats, isLoading: isLoadingStats } = useClinicalStats({
    start_date: startDate,
    end_date: endDate,
  });

  const { data: trendData, isLoading: isLoadingTrend } = usePatientVisitTrend({
    start_date: startDate,
    end_date: endDate,
  });

  const { data: activityData, isLoading: isLoadingActivity } = useClinicalActivity({
    start_date: startDate,
    end_date: endDate,
  });

  const { data: diseaseData, isLoading: isLoadingDiseases } = useDiseaseOverview({
    start_date: startDate,
    end_date: endDate,
  });

  const { data: recentPatientsData, isLoading: isLoadingPatients } = useRecentAppointments({
    page_size: 5,
  });

  const handleAction = (actionName: string) => {
    alert(`Action triggered: ${actionName}`);
  };

  const visitTrendData = trendData?.trend || [];
  // Find max count for relative height
  const maxTrend = visitTrendData.reduce((max: number, t: any) => Math.max(max, t.count), 0) || 1;

  const diseasesData = diseaseData?.diseases || [];

  const recentPatients = recentPatientsData?.results || [];

  const alertsData = [
    {
      title: "Monthly Malaria Report",
      date: "Mar 31, 2026",
      status: "Pending",
      border: "border-[#F59E0B]",
      bg: "bg-orange-50",
      text: "text-orange-700",
    },
    {
      title: "Staff Performance Report",
      date: "Mar 31, 2026",
      status: "Overdue",
      border: "border-[#EF4444]",
      bg: "bg-red-50",
      text: "text-red-700",
    },
    {
      title: "Weekly Activity Summary",
      date: "Mar 31, 2026",
      status: "Submitted",
      border: "border-[#22C55E]",
      bg: "bg-green-50",
      text: "text-green-700",
    },
  ];

  // Map Clinical Activity values
  const totalActivity = (activityData?.consultations || 0) + (activityData?.lab_tests || 0) + (activityData?.prescriptions || 0) || 1;
  const consPct = ((activityData?.consultations || 0) / totalActivity) * 100;
  const labPct = ((activityData?.lab_tests || 0) / totalActivity) * 100;
  const presPct = ((activityData?.prescriptions || 0) / totalActivity) * 100;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-screen bg-[#F8FAFC] font-sans min-w-0 overflow-hidden">
      <OfficerDashboardHeader title="Dashboard" breadcrumbs={[]} />

      {/* SCROLLABLE DASHBOARD CONTENT */}
      <div className="flex-1 overflow-auto p-4 sm:p-8">
        
        {/* Date Filter Top Bar */}
        <div className="mb-6 flex justify-end">
          <DateRangeFilter
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

        {/* TOP METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Special Green Card */}
          <div className="bg-[#2A6543] rounded-[20px] p-5 shadow-sm text-white flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Users size={18} className="text-white" />
                </div>
              </div>
            </div>
            <p className="text-sm font-medium mb-3">Today&apos;s Patients</p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-[#F59E0B] font-medium mb-1">
                  Waiting
                </p>
                <p className="text-2xl font-bold">{isLoadingStats ? "..." : clinicalStats?.todays_patients?.waiting_patients || 0}</p>
              </div>
              <div>
                <p className="text-xs text-[#4ADE80] font-medium mb-1">Seen</p>
                <p className="text-2xl font-bold">{isLoadingStats ? "..." : clinicalStats?.todays_patients?.seen_attended_to_patient || 0}</p>
              </div>
              <div>
                <p className="text-xs text-[#60A5FA] font-medium mb-1">
                  Referred
                </p>
                <p className="text-2xl font-bold">{isLoadingStats ? "..." : clinicalStats?.todays_patients?.referred_patients?.total || 0}</p>
              </div>
            </div>
          </div>

          {/* Standard Cards */}
          {[
            { title: "Consultations", value: isLoadingStats ? "..." : clinicalStats?.consultations || 0, icon: Stethoscope },
            { title: "Lab Tests", value: isLoadingStats ? "..." : clinicalStats?.lab_tests || 0, icon: ClipboardList },
            { title: "Pending Reports", value: "10", icon: Folder },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <card.icon size={18} className="text-gray-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MIDDLE SECTION: Charts & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Patient Visit Trend */}
          <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-gray-900">
                Patient Visit Trend
              </h3>
            </div>

            <div className="flex items-end justify-between h-[220px] pb-6 relative">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 pb-6">
                <span>{maxTrend}</span>
                <span>{Math.round(maxTrend * 0.8)}</span>
                <span>{Math.round(maxTrend * 0.6)}</span>
                <span>{Math.round(maxTrend * 0.4)}</span>
                <span>{Math.round(maxTrend * 0.2)}</span>
                <span>0</span>
              </div>

              {/* Bars */}
              <div className="flex justify-between items-end w-full h-full ml-10">
                {isLoadingTrend ? (
                   <span className="text-sm text-gray-400">Loading trend...</span>
                ) : visitTrendData.length === 0 ? (
                   <span className="text-sm text-gray-400">No data available for selected range.</span>
                ) : visitTrendData.map((data: any, idx: number) => {
                  const heightPct = Math.max((data.count / maxTrend) * 100, 5); // min 5% height
                  return (
                  <div key={idx} className="flex flex-col items-center gap-3">
                    <div className="w-[14px] h-[180px] bg-gray-100 rounded-full relative overflow-hidden">
                      <div
                        className="absolute bottom-0 w-full bg-[#2A6543] rounded-full transition-all duration-500"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )})}
              </div>
            </div>
          </div>

          {/* Reporting Alerts */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Reporting Alerts
                </h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                  Reports alerts & Notification
                </p>
              </div>
              <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-full">
                3 New
              </span>
            </div>

            <div className="space-y-4 flex-1">
              {alertsData.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-l-4 ${alert.border} ${alert.bg} flex justify-between items-center cursor-pointer hover:opacity-90 transition-opacity`}
                  onClick={() => handleAction(`View Alert: ${alert.title}`)}
                >
                  <div>
                    <p className={`text-sm font-semibold ${alert.text}`}>
                      {alert.title}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1">
                      {alert.date}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold text-gray-700">
                    {alert.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Donut Chart & Disease Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Clinical Activity */}
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col items-center relative">
            <div className="w-full flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Clinical Activity
              </h3>
            </div>

            {/* Legend */}
            <div className="w-full flex justify-center gap-4 mb-8 text-[11px] text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2A6543]"></span>
                Consultations
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#68D391]"></span>Lab Test
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FDBA74]"></span>
                Prescriptions
              </div>
            </div>

            {/* CSS Donut Chart */}
            {isLoadingActivity ? (
                <span className="text-sm text-gray-400 flex-1 flex items-center">Loading...</span>
            ) : totalActivity === 1 && consPct === 0 && labPct === 0 && presPct === 0 ? (
                <span className="text-sm text-gray-400 flex-1 flex items-center">No activity data.</span>
            ) : (
            <div
              className="relative w-48 h-48 rounded-full mb-4"
              style={{
                background:
                  `conic-gradient(#2A6543 0% ${consPct}%, #68D391 ${consPct}% ${consPct + labPct}%, #FDBA74 ${consPct + labPct}% 100%)`,
              }}
            >
              <div className="absolute inset-5 bg-white rounded-full flex items-center justify-center">
                 <div className="text-center">
                   <p className="text-[10px] text-gray-500 font-medium">Total</p>
                   <p className="text-2xl font-bold text-gray-900">{totalActivity}</p>
                 </div>
              </div>
            </div>
            )}
          </div>

          {/* Disease Overview */}
          <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Disease Overview
              </h3>
            </div>

            <div className="space-y-5 flex-1">
              {isLoadingDiseases ? (
                  <span className="text-sm text-gray-400">Loading diseases...</span>
              ) : diseasesData.length === 0 ? (
                  <span className="text-sm text-gray-400">No data available.</span>
              ) : diseasesData.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-xs text-gray-600 font-medium w-[120px] truncate" title={item.disease}>
                    {item.disease}
                  </span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2A6543] rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 font-medium w-8 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900">Recent Patients</h3>
            <Link
              href="/oic-dashboard/patient-records"
              className="flex items-center gap-2 text-[#2A6543] text-sm font-semibold hover:underline"
            >
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-50 text-gray-500 text-xs font-semibold">
                  <th className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      Patient Name <ListFilter size={14} />
                    </div>
                  </th>
                  <th className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      Phone Number <ListFilter size={14} />
                    </div>
                  </th>
                  <th className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      Timestamp <ListFilter size={14} />
                    </div>
                  </th>
                  <th className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      Status <ListFilter size={14} />
                    </div>
                  </th>
                  <th className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      Action <ListFilter size={14} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoadingPatients ? (
                   <tr>
                     <td colSpan={5} className="py-4 px-6 text-sm text-gray-400 text-center">Loading patients...</td>
                   </tr>
                ) : recentPatients.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="py-4 px-6 text-sm text-gray-400 text-center">No recent patients found.</td>
                   </tr>
                ) : recentPatients.map((patient: any, index: number) => {
                   const status = patient.recent_appointment_status;
                   const statusStyle = 
                     status === "Seen" ? "bg-[#EBF7F2] text-[#2A6543]" :
                     status === "Referred" ? "bg-red-50 text-red-600" :
                     "bg-orange-50 text-orange-600"; // Waiting
                   
                   return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                      {patient.first_name} {patient.last_name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {patient.phone_number ? (
                        patient.phone_number
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px] italic">
                          Not Applicable (Minor)
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(patient.recent_appointment_date)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusStyle}`}
                      >
                        {status || "Unknown"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() =>
                          handleAction(`View Patient: ${patient.first_name}`)
                        }
                        className="text-sm font-semibold text-[#2A6543] hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
