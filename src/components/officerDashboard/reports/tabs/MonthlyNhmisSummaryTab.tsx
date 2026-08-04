"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarRange,
  Building2,
  HeartPulse,
  Baby,
  Users2,
  Bug,
  ArrowRightLeft,
  ShieldAlert,
  PackageX,
  Download,
  FileText,
} from "lucide-react";
import StatCard from "@/src/components/stateDashboard/reports/shared/StatCard";
import RankedBarList from "@/src/components/stateDashboard/reports/shared/RankedBarList";
import { LoadingBlock, EmptyBlock } from "@/src/components/stateDashboard/reports/shared/QueryState";
import PrintableReport, { PrintPayload } from "@/src/components/stateDashboard/reports/shared/PrintableReport";
import { EpidemicProneBadge } from "../shared/OicBadges";
import { useMonthlyNhmisSummaryReport } from "@/src/hooks/oic/use-reports";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function MonthlyNhmisSummaryTab({}: { startDate?: string; endDate?: string } = {}) {
  const [month, setMonth] = useState(currentMonth);
  const { data, isLoading } = useMonthlyNhmisSummaryReport(month);
  const [printPayload, setPrintPayload] = useState<PrintPayload | null>(null);

  useEffect(() => {
    if (printPayload) window.print();
  }, [printPayload]);

  const outbreaks = useMemo(
    () => (data?.disease_surveillance.results ?? []).filter((r) => r.is_epidemic_prone && r.cases > 0),
    [data],
  );

  const diseasesWithCases = useMemo(
    () => (data?.disease_surveillance.results ?? []).filter((r) => r.cases > 0).map((r) => ({ label: r.disease, value: r.cases })),
    [data],
  );

  const referralDestinations = useMemo(
    () => (data?.referrals.referral_destinations ?? []).map((d) => ({ label: d.destination, value: d.count })),
    [data],
  );

  const handleExport = () => {
    if (!data) return;
    setPrintPayload({
      reportTitle: `Monthly NHMIS Summary — ${data.facility.name}`,
      periodLabel: `${formatMonthLabel(data.month)} (${data.start_date} to ${data.end_date})`,
      summaryCards: [
        { label: "ANC 1", value: data.maternal_health.anc_1 },
        { label: "Deliveries", value: data.maternal_health.deliveries },
        { label: "Immunization Doses", value: data.child_health.immunization_coverage.reduce((a, v) => a + v.count, 0) },
        { label: "Referrals Sent", value: data.referrals.total_referrals },
      ],
      columns: [
        { header: "Section", key: "section" },
        { header: "Metric", key: "metric" },
        { header: "Value", key: "value", align: "right" },
      ],
      rows: [
        { section: "Facility", metric: "Name", value: data.facility.name },
        { section: "Facility", metric: "Code", value: data.facility.code },
        { section: "Facility", metric: "LGA", value: data.facility.lga },
        { section: "Maternal Health", metric: "ANC 1", value: data.maternal_health.anc_1 },
        { section: "Maternal Health", metric: "ANC Repeat Visits", value: data.maternal_health.anc_repeat },
        { section: "Maternal Health", metric: "ANC 4+", value: data.maternal_health.anc_4 },
        { section: "Maternal Health", metric: "Deliveries", value: data.maternal_health.deliveries },
        { section: "Maternal Health", metric: "Stillbirths (not tracked)", value: data.maternal_health.stillbirths },
        { section: "Maternal Health", metric: "Low Birth Weight (not tracked)", value: data.maternal_health.low_birth_weight },
        { section: "Maternal Health", metric: "Maternal Deaths (not tracked)", value: data.maternal_health.maternal_deaths },
        { section: "Maternal Health", metric: "Neonatal Deaths", value: data.maternal_health.neonatal_deaths },
        { section: "Maternal Health", metric: "IPTp Coverage", value: `${data.maternal_health.iptp_coverage}%` },
        ...data.child_health.immunization_coverage.map((v) => ({ section: "Child Health", metric: `Immunization — ${v.vaccine}`, value: v.count })),
        { section: "Child Health", metric: "Growth Monitoring (not tracked)", value: data.child_health.growth_monitoring },
        { section: "Child Health", metric: "SAM Cases (not tracked)", value: data.child_health.sam },
        { section: "Child Health", metric: "Vitamin A (estimated)", value: data.child_health.vitamin_a },
        { section: "Child Health", metric: "Deworming (estimated)", value: data.child_health.deworming },
        { section: "Family Planning", metric: "New Clients (not tracked)", value: data.family_planning.new_clients },
        { section: "Family Planning", metric: "Repeat Clients (not tracked)", value: data.family_planning.repeat_clients },
        { section: "Family Planning", metric: "Counselling Sessions (not tracked)", value: data.family_planning.counselling_sessions },
        ...data.disease_surveillance.results.map((r) => ({
          section: "Disease Surveillance",
          metric: r.disease + (r.is_epidemic_prone ? " (epidemic-prone)" : ""),
          value: r.cases,
        })),
        { section: "Referrals", metric: "Total Sent", value: data.referrals.total_referrals },
        { section: "Referrals", metric: "Completed", value: data.referrals.completed_referrals },
        { section: "Referrals", metric: "Emergency", value: data.referrals.emergency_referrals },
        { section: "Referrals", metric: "Ambulance", value: data.referrals.ambulance_referrals },
        { section: "Referrals", metric: "Avg Time (hrs)", value: data.referrals.average_referral_time_hours },
        { section: "Adverse Events", metric: "Total Events", value: data.adverse_events.facility_summary.total_adverse_events },
        { section: "Adverse Events", metric: "Severe Events", value: data.adverse_events.facility_summary.severe_events },
        { section: "Adverse Events", metric: "Resolved", value: data.adverse_events.facility_summary.resolved },
        { section: "Adverse Events", metric: "Pending", value: data.adverse_events.facility_summary.pending },
        { section: "Drug Logistics", metric: "Drug Stock Alerts", value: data.drug_logistics.drug_stock_alerts },
      ],
      note: "This is the official monthly NHMIS summary, auto-aggregated from every section of this facility's activity. Fields marked (not tracked) or (estimated) have no underlying data model yet or are approximated from related data.",
    });
  };

  return (
    <>
      <div className="space-y-6 print:hidden">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F7F0] flex items-center justify-center shrink-0">
              <CalendarRange size={18} className="text-[#046C3F]" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reporting Month</p>
              <p className="text-sm text-gray-500 mt-0.5">Aggregates every section for one calendar month</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="month"
              value={month}
              max={currentMonth()}
              onChange={(e) => e.target.value && setMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#046C3F]/30"
            />
            <button
              onClick={handleExport}
              disabled={!data}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#046C3F] text-white rounded-lg text-sm font-semibold hover:bg-[#035531] transition-colors disabled:opacity-50"
            >
              <FileText size={16} />
              Export Official Report
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <LoadingBlock label="Loading monthly summary..." />
          </div>
        ) : !data ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <EmptyBlock label="No summary available for this month." />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#E0F2FE] flex items-center justify-center shrink-0">
                <Building2 size={20} className="text-[#0284C7]" />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">{data.facility.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {data.facility.code} · {data.facility.lga} · {formatMonthLabel(data.month)}
                </p>
              </div>
            </div>

            {outbreaks.length > 0 && (
              <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-red-700 mb-1.5">
                    {outbreaks.length} epidemic-prone disease{outbreaks.length === 1 ? "" : "s"} with active cases this month
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {outbreaks.map((o) => (
                      <span key={o.disease} className="inline-flex items-center gap-1.5 bg-white border border-red-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-700">
                        {o.disease} · {o.cases} cases
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <HeartPulse size={16} className="text-[#046C3F]" />
                <h3 className="text-base font-bold text-[#101928]">Maternal Health</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={HeartPulse} label="ANC 1" value={data.maternal_health.anc_1} tone="green" />
                <StatCard icon={HeartPulse} label="ANC Repeat" value={data.maternal_health.anc_repeat} tone="blue" />
                <StatCard icon={HeartPulse} label="ANC 4+" value={data.maternal_health.anc_4} tone="amber" />
                <StatCard icon={HeartPulse} label="IPTp Coverage" value={`${data.maternal_health.iptp_coverage}%`} tone="neutral" />
                <StatCard icon={Baby} label="Deliveries" value={data.maternal_health.deliveries} tone="green" />
                <StatCard icon={Baby} label="Stillbirths" value={data.maternal_health.stillbirths} tone="neutral" placeholder="not-tracked" />
                <StatCard icon={Baby} label="Low Birth Weight" value={data.maternal_health.low_birth_weight} tone="neutral" placeholder="not-tracked" />
                <StatCard icon={Baby} label="Maternal Deaths" value={data.maternal_health.maternal_deaths} tone="neutral" placeholder="not-tracked" />
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Baby size={16} className="text-[#046C3F]" />
                <h3 className="text-base font-bold text-[#101928]">Child Health</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <StatCard icon={Baby} label="Growth Monitoring" value={data.child_health.growth_monitoring} tone="neutral" placeholder="not-tracked" />
                <StatCard icon={Baby} label="SAM Cases" value={data.child_health.sam} tone="neutral" placeholder="not-tracked" />
                <StatCard icon={Baby} label="Vitamin A" value={data.child_health.vitamin_a} tone="amber" placeholder="estimated" />
                <StatCard icon={Baby} label="Deworming" value={data.child_health.deworming} tone="amber" placeholder="estimated" />
              </div>
              {data.child_health.immunization_coverage.length > 0 && (
                <RankedBarList
                  items={data.child_health.immunization_coverage.map((v) => ({ label: v.vaccine, value: v.count }))}
                  limit={8}
                  color="#1AC073"
                />
              )}
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users2 size={16} className="text-[#046C3F]" />
                <h3 className="text-base font-bold text-[#101928]">Family Planning</h3>
                <span className="text-[10px] font-bold uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">Not yet available</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon={Users2} label="New Clients" value={data.family_planning.new_clients} tone="neutral" placeholder="not-tracked" />
                <StatCard icon={Users2} label="Repeat Clients" value={data.family_planning.repeat_clients} tone="neutral" placeholder="not-tracked" />
                <StatCard icon={Users2} label="Counselling Sessions" value={data.family_planning.counselling_sessions} tone="neutral" placeholder="not-tracked" />
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bug size={16} className="text-[#046C3F]" />
                <h3 className="text-base font-bold text-[#101928]">Disease Surveillance</h3>
              </div>
              {diseasesWithCases.length === 0 ? (
                <EmptyBlock label="No disease cases reported this month." />
              ) : (
                <div className="space-y-2">
                  {diseasesWithCases.map((d) => {
                    const item = data.disease_surveillance.results.find((r) => r.disease === d.label);
                    return (
                      <div key={d.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm font-medium text-gray-700">{d.label}</span>
                        <div className="flex items-center gap-2">
                          {item?.is_epidemic_prone && <EpidemicProneBadge />}
                          <span className="text-sm font-bold text-gray-900 tabular-nums">{d.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <ArrowRightLeft size={16} className="text-[#046C3F]" />
                <h3 className="text-base font-bold text-[#101928]">Referrals</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <StatCard icon={ArrowRightLeft} label="Total Sent" value={data.referrals.total_referrals} tone="green" />
                <StatCard icon={ArrowRightLeft} label="Completed" value={data.referrals.completed_referrals} tone="blue" />
                <StatCard icon={ArrowRightLeft} label="Emergency" value={data.referrals.emergency_referrals} tone="red" />
                <StatCard icon={ArrowRightLeft} label="Avg Time (hrs)" value={data.referrals.average_referral_time_hours} tone="neutral" />
              </div>
              {referralDestinations.length > 0 && <RankedBarList items={referralDestinations} limit={6} color="#0284C7" />}
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert size={16} className="text-[#046C3F]" />
                <h3 className="text-base font-bold text-[#101928]">Adverse Events</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={ShieldAlert} label="Total Events" value={data.adverse_events.facility_summary.total_adverse_events} tone="green" />
                <StatCard icon={ShieldAlert} label="Severe" value={data.adverse_events.facility_summary.severe_events} tone="red" />
                <StatCard icon={ShieldAlert} label="Resolved" value={data.adverse_events.facility_summary.resolved} tone="blue" />
                <StatCard icon={ShieldAlert} label="Pending" value={data.adverse_events.facility_summary.pending} tone="amber" />
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <PackageX size={16} className="text-[#046C3F]" />
                <h3 className="text-base font-bold text-[#101928]">Drug Logistics</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={PackageX}
                  label="Drug Stock Alerts"
                  value={data.drug_logistics.drug_stock_alerts}
                  tone={data.drug_logistics.drug_stock_alerts > 0 ? "red" : "neutral"}
                />
              </div>
            </section>

            <div className="flex justify-end print:hidden">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#046C3F] text-white rounded-lg text-sm font-semibold hover:bg-[#035531] transition-colors"
              >
                <Download size={16} />
                Export Official Report
              </button>
            </div>
          </>
        )}
      </div>

      <PrintableReport payload={printPayload} />
    </>
  );
}
