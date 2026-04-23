"use client";

import { Clock, Stethoscope, CheckCircle2, FlaskConical, ChevronDown, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";

// ── Types ─────────────────────────────────────────────────────────────────────

type LabStatus = "Ready" | "Pending" | "Processing" | "Urgent";
type AlertSeverity = "High risk" | "Urgent" | "Awaiting" | "Ready";
type ConsultationStatus = "In-consultation" | "Urgent" | "Waiting" | "Completed";

interface LabResult {
  test: string;
  patient: string;
  time: string;
  status: LabStatus;
}

interface AlertItem {
  title: string;
  subtitle: string;
  time: string;
  severity: AlertSeverity;
}

interface ConsultationRow {
  patientId: string;
  patientName: string;
  chiefComplaint: string;
  status: ConsultationStatus;
}

// ── Static data ───────────────────────────────────────────────────────────────

const LAB_RESULTS: LabResult[] = [
  { test: "Malaria RDT", patient: "Emeka Dike", time: "Requested 9:12am", status: "Ready" },
  { test: "FBC", patient: "Ngozi Eze", time: "Requested 8:45am", status: "Pending" },
  { test: "Urinalysis", patient: "Fatima Musa", time: "Requested 8:20am", status: "Processing" },
  { test: "Urinalysis", patient: "Fatima Musa", time: "Requested 8:20am", status: "Urgent" },
];

const ALERTS: AlertItem[] = [
  {
    title: "High-risk pregnancy — Amina Bello (32wks, pre-eclampsia)",
    subtitle: "Maternal alert",
    time: "now",
    severity: "High risk",
  },
  {
    title: "Immunizations due — 5 children this week",
    subtitle: "Immunization",
    time: "today",
    severity: "Urgent",
  },
  {
    title: "Referral pending — Emeka Dike (cardiology)",
    subtitle: "Referral awaiting",
    time: "today",
    severity: "Awaiting",
  },
  {
    title: "Lab result ready — Fatima Musa urinalysis",
    subtitle: "Lab",
    time: "2 min ago",
    severity: "Ready",
  },
];

const CONSULTATION_QUEUE: ConsultationRow[] = [
  {
    patientId: "PAT-PLT-000234",
    patientName: "Ngozi Eze",
    chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose",
    status: "In-consultation",
  },
  {
    patientId: "PAT-PLT-000234",
    patientName: "Emeka Dike",
    chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose",
    status: "Urgent",
  },
  {
    patientId: "PAT-PLT-000234",
    patientName: "Amina Bello",
    chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose",
    status: "Waiting",
  },
  {
    patientId: "PAT-PLT-000234",
    patientName: "Chukwu Obi",
    chiefComplaint: "Fever, headache, Chest pain, Cough, runny nose",
    status: "Completed",
  },
];

// ── Badge styles (inline to avoid Tailwind purge on dynamic keys) ─────────────

const LAB_BADGE_STYLE: Record<LabStatus, React.CSSProperties> = {
  Ready:      { background: "#E8F7F0", color: "#046C3F" },
  Pending:    { background: "#FFF7ED", color: "#C2410C" },
  Processing: { background: "#EFF6FF", color: "#1D4ED8" },
  Urgent:     { background: "#FEF2F2", color: "#DC2626" },
};

const ALERT_BADGE_STYLE: Record<AlertSeverity, React.CSSProperties> = {
  "High risk": { background: "#FEF2F2", color: "#DC2626" },
  "Urgent":    { background: "#FFF7ED", color: "#C2410C" },
  "Awaiting":  { background: "#FFFBEB", color: "#B45309" },
  "Ready":     { background: "#E8F7F0", color: "#046C3F" },
};

const CONSULTATION_BADGE_STYLE: Record<ConsultationStatus, React.CSSProperties> = {
  "In-consultation": { background: "#EFF6FF", color: "#1D4ED8" },
  "Urgent":          { background: "#FEF2F2", color: "#DC2626" },
  "Waiting":         { background: "#FFFBEB", color: "#B45309" },
  "Completed":       { background: "#E8F7F0", color: "#046C3F" },
};

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between min-h-[120px]">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
          <Icon size={18} />
        </div>
        <PeriodFilterButton label="This Week" />
      </div>
      <div className="mt-3">
        <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-4xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// ── Badges ────────────────────────────────────────────────────────────────────

function LabBadge({ status }: { status: LabStatus }) {
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
      style={LAB_BADGE_STYLE[status]}
    >
      {status}
    </span>
  );
}

function AlertBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
      style={ALERT_BADGE_STYLE[severity]}
    >
      {severity}
    </span>
  );
}

function ConsultationBadge({ status }: { status: ConsultationStatus }) {
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
      style={CONSULTATION_BADGE_STYLE[status]}
    >
      {status}
    </span>
  );
}

// ── Action button ─────────────────────────────────────────────────────────────

function ActionButton({ status }: { status: ConsultationStatus }) {
  if (status === "In-consultation") {
    return (
      <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        Continue
      </button>
    );
  }
  if (status === "Completed") {
    return (
      <button className="px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
        View
      </button>
    );
  }
  return (
    <button className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors" style={{ background: "#046C3F" }}>
      Start
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DoctorDashboardHome() {
  const breadcrumbs = [{ label: "", active: true }];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Dashboard" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 space-y-6">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Clock} label="Waiting" value={14} />
          <StatCard icon={Stethoscope} label="In Consultations" value={8} />
          <StatCard icon={CheckCircle2} label="Completed" value={32} />
          <StatCard icon={FlaskConical} label="Pending Labs" value={11} />
        </div>

        {/* Pending Lab Results + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* Pending Lab Results */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FlaskConical size={18} className="text-gray-400" />
                <h2 className="text-base font-bold text-gray-800">Pending Lab Results</h2>
              </div>
              <Link
                href="/doctor-dashboard/laboratory"
                className="flex items-center gap-1 text-xs font-semibold text-[#046C3F] hover:underline"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {LAB_RESULTS.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.test}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {item.patient} · {item.time}
                    </p>
                  </div>
                  <LabBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-gray-400" />
              <h2 className="text-base font-bold text-gray-800">Alerts</h2>
            </div>
            <div className="space-y-4">
              {ALERTS.map((alert, i) => (
                <div key={i} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{alert.title}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {alert.subtitle} · {alert.time}
                    </p>
                  </div>
                  <AlertBadge severity={alert.severity} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Consultation Queue */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800">Today&apos;s Consultation Queue</h2>
            <Link
              href="/doctor-dashboard/consultations"
              className="flex items-center gap-1 text-xs font-semibold text-[#046C3F] hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Patient ID", "Patient Name", "Chief Complaint", "Status", "Action"].map((h) => (
                    <th key={h} className="pb-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span className="flex items-center gap-1">{h} <ChevronDown size={12} /></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CONSULTATION_QUEUE.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-2 text-sm text-gray-600 font-medium">{row.patientId}</td>
                    <td className="py-4 px-2 text-sm text-gray-800 font-semibold">{row.patientName}</td>
                    <td className="py-4 px-2 text-sm text-gray-500 max-w-[260px] truncate">{row.chiefComplaint}</td>
                    <td className="py-4 px-2">
                      <ConsultationBadge status={row.status} />
                    </td>
                    <td className="py-4 px-2">
                      <ActionButton status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
