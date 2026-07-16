"use client";

import {
  Clock,
  Stethoscope,
  CheckCircle2,
  FlaskConical,
  ChevronDown,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";
import { useState } from "react";
import DashboardStatCard from "@/src/components/generic/dashboard/DashboardStatCard";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import {
  useDoctorAlerts,
  useDoctorPendingLabs,
  useDoctorStats,
} from "@/src/hooks/doctors/use-doctors";
import { useConsultations } from "@/src/hooks/doctors/use-consultation";
import type {
  DoctorDashboardAlertItem,
  DoctorDashboardAlertSeverity,
  DoctorDashboardApiRecord,
  DoctorDashboardConsultationRow,
  DoctorDashboardConsultationStatus,
  DoctorDashboardLabResult,
  DoctorDashboardLabStatus,
} from "./DoctorDashboardHome.types";

function getRecord(value: unknown): DoctorDashboardApiRecord {
  return value && typeof value === "object"
    ? (value as DoctorDashboardApiRecord)
    : {};
}

function getText(
  record: DoctorDashboardApiRecord,
  keys: string[],
  fallback: string,
) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value) return value;
  }
  return fallback;
}

function getStat(
  record: DoctorDashboardApiRecord,
  keys: string[],
  fallback: number,
) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" || typeof value === "string") return value;
  }
  return fallback;
}

// ── Badge styles (inline to avoid Tailwind purge on dynamic keys) ─────────────

const LAB_BADGE_STYLE: Record<
  DoctorDashboardLabStatus,
  { bg: string; text: string }
> = {
  Ready: { bg: "#E8F7F0", text: "#046C3F" },
  Pending: { bg: "#FFF7ED", text: "#C2410C" },
  Processing: { bg: "#EFF6FF", text: "#1D4ED8" },
  Urgent: { bg: "#FEF2F2", text: "#DC2626" },
};

const ALERT_BADGE_STYLE: Record<
  DoctorDashboardAlertSeverity,
  { bg: string; text: string }
> = {
  "High risk": { bg: "#FEF2F2", text: "#DC2626" },
  Urgent: { bg: "#FFF7ED", text: "#C2410C" },
  Awaiting: { bg: "#FFFBEB", text: "#B45309" },
  Ready: { bg: "#E8F7F0", text: "#046C3F" },
};

const CONSULTATION_BADGE_STYLE: Record<
  DoctorDashboardConsultationStatus,
  { bg: string; text: string }
> = {
  "In-consultation": { bg: "#EFF6FF", text: "#1D4ED8" },
  Urgent: { bg: "#FEF2F2", text: "#DC2626" },
  Waiting: { bg: "#FFFBEB", text: "#B45309" },
  Completed: { bg: "#E8F7F0", text: "#046C3F" },
};

// ── Badges ────────────────────────────────────────────────────────────────────

function LabBadge({ status }: { status: DoctorDashboardLabStatus }) {
  const badge = LAB_BADGE_STYLE[status];
  return (
    <StatusBadge
      label={status}
      bgColorHex={badge.bg}
      textColorHex={badge.text}
    />
  );
}

function AlertBadge({ severity }: { severity: DoctorDashboardAlertSeverity }) {
  const badge = ALERT_BADGE_STYLE[severity];
  return (
    <StatusBadge
      label={severity}
      bgColorHex={badge.bg}
      textColorHex={badge.text}
    />
  );
}

function ConsultationBadge({
  status,
}: {
  status: DoctorDashboardConsultationStatus;
}) {
  const badge = CONSULTATION_BADGE_STYLE[status];
  return (
    <StatusBadge
      label={status}
      bgColorHex={badge.bg}
      textColorHex={badge.text}
    />
  );
}

// ── Action button ─────────────────────────────────────────────────────────────

function ActionButton({
  status,
  appointmentId,
  consultationId,
}: {
  status: DoctorDashboardConsultationStatus;
  appointmentId: string;
  consultationId: string;
}) {
  const noteHref = appointmentId
    ? `/doctor-dashboard/consultations/${consultationId}`
    : "/doctor-dashboard/consultations";

  if (status === "In-consultation") {
    return (
      <Link
        href={noteHref}
        className="inline-block px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Continue
      </Link>
    );
  }
  if (status === "Completed") {
    const viewHref = consultationId
      ? `/doctor-dashboard/consultations/${consultationId}`
      : "/doctor-dashboard/consultations";
    return (
      <Link
        href={viewHref}
        className="inline-block px-4 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        View
      </Link>
    );
  }
  return (
    <Link
      href={noteHref}
      className="inline-block px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors"
      style={{ background: "#046C3F" }}
    >
      Start
    </Link>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DoctorDashboardHome() {
  const breadcrumbs = [{ label: "", active: true }];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: statsData } = useDoctorStats({
    start_date: startDate,
    end_date: endDate,
  });
  const { data: alertsData } = useDoctorAlerts();
  const { data: pendingLabsData } = useDoctorPendingLabs({
    page: 1,
    page_size: 4,
  });
  const { data: consultationsData, isLoading: isLoadingConsultations } =
    useConsultations({ page: 1, page_size: 4 });

  const statsPayload = getRecord(statsData);
  const stats = getRecord(statsPayload.stats || statsPayload);
  const pendingPayload = getRecord(pendingLabsData);
  const pendingDataPayload = getRecord(pendingPayload.data);
  const pendingRows =
    pendingPayload.results ||
    pendingDataPayload.results ||
    pendingPayload.data ||
    pendingLabsData;
  const labResults =
    (Array.isArray(pendingRows) ? pendingRows : [])
      ?.slice?.(0, 4)
      ?.map?.((item) => {
        const record = getRecord(item);
        const patient = getRecord(record.patient);
        const status =
          record.status === "COMPLETED"
            ? "Ready"
            : record.status === "IN_PROGRESS"
              ? "Processing"
              : record.priority === "URGENT"
                ? "Urgent"
                : "Pending";

        const rawDate = getText(
          record,
          ["created_at", "date", "time"],
          "today",
        );

        const timeFormatted = rawDate.includes("T")
          ? new Date(rawDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : rawDate;

        return {
          test: getText(
            record,
            ["test_type", "test", "lab_test"],
            "Lab request",
          ),
          patient: getText(
            record,
            ["patient_name", "patient"],
            getText(patient, ["full_name"], "Patient"),
          ),
          time:
            rawDate === "today"
              ? "Requested today"
              : `Requested ${timeFormatted}`,
          status: status as DoctorDashboardLabStatus,
        };
      }) ?? [];
  const alertsPayload = getRecord(alertsData);
  const alertsDataPayload = getRecord(alertsPayload.data);
  const alertRows =
    alertsPayload.results ||
    alertsDataPayload.results ||
    alertsPayload.data ||
    alertsData;

  const alerts =
    (Array.isArray(alertRows) ? alertRows : [])
      ?.slice?.(0, 4)
      ?.map?.((alert) => {
        const record = getRecord(alert);

        const rawStatus = getText(record, ["status", "severity"], "PENDING");
        let severity: DoctorDashboardAlertSeverity = "Awaiting";

        if (rawStatus === "RESULT_READY" || rawStatus === "ACCEPTED") {
          severity = "Ready";
        } else if (rawStatus === "REJECTED") {
          severity = "High risk";
        } else if (rawStatus === "PENDING") {
          severity = "Awaiting";
        } else if (
          ["High risk", "Urgent", "Awaiting", "Ready"].includes(rawStatus)
        ) {
          severity = rawStatus as DoctorDashboardAlertSeverity;
        }

        const rawType = getText(record, ["alert_type"], "Alert");
        const alertType =
          rawType === "LAB"
            ? "Lab"
            : rawType === "REFERRAL"
              ? "Referral"
              : rawType;
        const patientName = getText(
          record,
          ["patient_name"],
          "Unknown Patient",
        );

        const details = getText(
          record,
          ["details", "message", "description"],
          "No details provided",
        );
        const rawDate = getText(
          record,
          ["date", "created_at", "time"],
          "today",
        );

        const timeFormatted = rawDate.includes("T")
          ? new Date(rawDate).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : rawDate;

        return {
          title: `${alertType} - ${patientName}`,
          subtitle: details,
          time: timeFormatted,
          severity,
        };
      }) ?? [];

  const consultationsPayload = getRecord(consultationsData);
  const consultationsDataPayload = getRecord(consultationsPayload.data);
  const consultationRows =
    consultationsPayload.results ||
    consultationsDataPayload.results ||
    consultationsPayload.data ||
    consultationsData;
  const consultationQueue: DoctorDashboardConsultationRow[] = (
    Array.isArray(consultationRows) ? consultationRows : []
  )
    .slice(0, 4)
    .map((consultation) => {
      const record = getRecord(consultation);
      const appointment = getRecord(record.appointment);
      const patient = getRecord(record.patient);
      const rawStatus = getText(record, ["status"], "");
      const appointmentStatus = getText(appointment, ["status"], rawStatus);
      const status: DoctorDashboardConsultationStatus =
        appointmentStatus === "COMPLETED"
          ? "Completed"
          : appointmentStatus === "IN_PROGRESS"
            ? "In-consultation"
            : getText(appointment, ["priority"], "") === "URGENT"
              ? "Urgent"
              : "Waiting";

      return {
        patientId: getText(
          record,
          ["patient_display_id"],
          getText(
            appointment,
            ["patient_display_id"],
            getText(patient, ["patient_id"], "-"),
          ),
        ),
        patientName: getText(
          record,
          ["patient_name"],
          getText(
            appointment,
            ["patient_name"],
            getText(patient, ["full_name"], "Patient"),
          ),
        ),
        chiefComplaint: getText(
          record,
          ["chief_complaint", "presenting_complaint"],
          getText(appointment, ["reason_for_visit", "notes"], "-"),
        ),
        status,
        appointmentId:
          typeof record.appointment === "string"
            ? record.appointment
            : getText(appointment, ["id"], ""),
        consultationId: getText(record, ["id"], ""),
      };
    });

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Dashboard" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 space-y-6">
        <div className="flex justify-end">
          <NurseDateRangeFilter
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

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardStatCard
            icon={Clock}
            title="Waiting"
            value={getStat(stats, ["waiting", "waiting_queue"], 0)}
            active
            showPeriod={false}
          />
          <DashboardStatCard
            icon={Stethoscope}
            title="In Consultations"
            value={getStat(stats, ["in_consultation", "in_consultations"], 0)}
            showPeriod={false}
          />
          <DashboardStatCard
            icon={CheckCircle2}
            title="Completed"
            value={getStat(stats, ["completed", "completed_today"], 0)}
            showPeriod={false}
          />
          <DashboardStatCard
            icon={FlaskConical}
            title="Pending Labs"
            value={getStat(stats, ["pending_labs", "pending_lab_requests"], 0)}
            showPeriod={false}
          />
        </div>

        {/* Pending Lab Results + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Pending Lab Results */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FlaskConical size={18} className="text-gray-400" />
                <h2 className="text-base font-bold text-gray-800">
                  Pending Lab Results
                </h2>
              </div>
              <Link
                href="/doctor-dashboard/laboratory"
                className="flex items-center gap-1 text-xs font-semibold text-[#046C3F] hover:underline"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {labResults.length ? (
                labResults.map((item: DoctorDashboardLabResult, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.test}
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {item.patient} · {item.time}
                      </p>
                    </div>
                    <LabBadge status={item.status} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No pending lab results.</p>
              )}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={18} className="text-gray-400" />
              <h2 className="text-base font-bold text-gray-800">Alerts</h2>
            </div>
            <div className="space-y-4">
              {alerts.length ? (
                alerts.map((alert: DoctorDashboardAlertItem, i: number) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-snug">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {alert.subtitle} · {alert.time}
                      </p>
                    </div>
                    <AlertBadge severity={alert.severity} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No alerts yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Today's Consultation Queue */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-800">
              Today&apos;s Consultation Queue
            </h2>
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
                  {[
                    "Patient ID",
                    "Patient Name",
                    "Chief Complaint",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="pb-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider"
                    >
                      <span className="flex items-center gap-1">
                        {h} <ChevronDown size={12} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {consultationQueue.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-2 text-sm text-gray-600 font-medium">
                      {row.patientId}
                    </td>
                    <td className="py-4 px-2 text-sm text-gray-800 font-semibold">
                      {row.patientName}
                    </td>
                    <td className="py-4 px-2 text-sm text-gray-500 max-w-[260px] truncate">
                      {row.chiefComplaint}
                    </td>
                    <td className="py-4 px-2">
                      <ConsultationBadge status={row.status} />
                    </td>
                    <td className="py-4 px-2">
                      <ActionButton
                        status={row.status}
                        appointmentId={row.appointmentId}
                        consultationId={row.consultationId}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!isLoadingConsultations && consultationQueue.length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">
                No consultations found.
              </p>
            )}
            {isLoadingConsultations && (
              <p className="py-8 text-center text-sm text-gray-400">
                Loading consultation queue...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
