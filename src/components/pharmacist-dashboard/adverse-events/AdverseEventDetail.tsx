"use client";

import { type ReactNode, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Loader2,
  Search,
  Trash2,
  User,
} from "lucide-react";

import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import {
  useAdverseEventDetail,
  useDeleteAdverseEvent,
  useUpdateAdverseEvent,
} from "@/src/hooks/pharmacist/use-adverse-events";
import type { AdverseEventStatus } from "./type";

const SEVERITY_COLORS: Record<string, { bg: string; text: string }> = {
  MILD: { bg: "#DDF2EA", text: "#00A556" },
  MODERATE: { bg: "#FFF4E5", text: "#B45309" },
  SEVERE: { bg: "#FFE1D6", text: "#C2410C" },
  LIFE_THREATENING: { bg: "#FDE8E8", text: "#F33131" },
  FATAL: { bg: "#1F2937", text: "#FFFFFF" },
};

const SEVERITY_LABELS: Record<string, string> = {
  MILD: "Mild",
  MODERATE: "Moderate",
  SEVERE: "Severe",
  LIFE_THREATENING: "Life-Threatening",
  FATAL: "Fatal",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  REPORTED: { bg: "#E2E7FF", text: "#046C3F" },
  UNDER_REVIEW: { bg: "#FFF4E5", text: "#B45309" },
  RESOLVED: { bg: "#DFF3EA", text: "#039855" },
  CLOSED: { bg: "#F1F5F9", text: "#475569" },
};

const STATUS_OPTIONS: { label: string; value: AdverseEventStatus }[] = [
  { label: "Reported", value: "REPORTED" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function ReadonlyField({
  label,
  value,
  icon,
  className = "",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[58px] items-center gap-3 rounded-md border border-[#D8DDE3] bg-[#F1F2F4] px-4 ${className}`}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[#8B909A]">{label}</span>
        <span className="mt-1 block truncate text-base text-[#7A7F89]">
          {value || "-"}
        </span>
      </span>
    </div>
  );
}

export default function AdverseEventDetail() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [toastMessage, setToastMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  const { data: event, isLoading } = useAdverseEventDetail(eventId);
  const { mutate: updateEvent, isPending: isUpdatingStatus } =
    useUpdateAdverseEvent();
  const { mutate: deleteEvent, isPending: isDeleting } =
    useDeleteAdverseEvent();

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 3000);
  };

  const handleStatusChange = (status: AdverseEventStatus) => {
    if (!event || status === event.status) return;
    setStatusError("");
    updateEvent(
      { id: event.id, payload: { status } },
      {
        onSuccess: () => showToast(`Status updated to ${status.replace(/_/g, " ")}`),
        onError: (error: unknown) => {
          setStatusError(
            error instanceof Error
              ? error.message
              : "Failed to update status. Please try again.",
          );
        },
      },
    );
  };

  const handleDelete = () => {
    if (!event) return;
    if (
      !window.confirm(
        `Delete adverse event report ${event.event_id}? This action cannot be undone.`,
      )
    ) {
      return;
    }
    deleteEvent(event.id, {
      onSuccess: () => {
        router.push("/pharmacist-dashboard/adverse-events");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F6F7FC]">
        <PharmacistDashboardHeader
          title="Adverse Events"
          breadcrumbs={[
            {
              label: "Adverse Events",
              href: "/pharmacist-dashboard/adverse-events",
            },
            { label: "Details" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#046C3F]" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F6F7FC]">
        <PharmacistDashboardHeader
          title="Adverse Events"
          breadcrumbs={[
            {
              label: "Adverse Events",
              href: "/pharmacist-dashboard/adverse-events",
            },
          ]}
        />
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-lg text-gray-500">Adverse event report not found.</p>
          <button
            onClick={() => router.back()}
            className="text-[#046C3F] hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const severityColor = SEVERITY_COLORS[event.severity] || SEVERITY_COLORS.MILD;

  return (
    <div className="min-h-screen bg-[#F6F7FC] pb-12">
      <PharmacistDashboardHeader
        title="Adverse Events"
        breadcrumbs={[
          {
            label: "Adverse Events",
            href: "/pharmacist-dashboard/adverse-events",
          },
          { label: event.event_id },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <PharmacistBackButton onClick={() => router.back()} />

        <section className="mt-6 rounded-xl bg-white px-5 py-8 shadow-sm sm:px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FDE8E8] text-[#F33131]">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h1 className="text-2xl font-semibold text-black">
                  {event.event_id}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Reported {formatDate(event.created_at)}
                </p>
              </div>
            </div>
            <StatusBadge
              label={SEVERITY_LABELS[event.severity] || event.severity}
              bgColorHex={severityColor.bg}
              textColorHex={severityColor.text}
            />
          </div>

          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Patient
          </div>
          <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
            <ReadonlyField
              label="Patient Name"
              value={event.patient_name}
              icon={<Search size={20} className="text-[#8B909A]" />}
            />
            <ReadonlyField
              label="Patient Display ID"
              value={event.patient_display_id}
            />
            <ReadonlyField
              label="Age"
              value={event.patient_age !== undefined ? String(event.patient_age) : "-"}
            />
            <ReadonlyField label="Sex" value={event.patient_sex || "-"} />
            <ReadonlyField
              label="Reported By"
              value={event.reported_by_name || "-"}
              icon={<User size={20} className="text-[#8B909A]" />}
            />
          </div>

          <hr className="my-10 max-w-[770px] border-gray-100" />

          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Reaction Details
          </div>
          <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
            <ReadonlyField
              label="Suspected Drug"
              value={event.suspected_drug_name}
            />
            <ReadonlyField label="Dosage" value={event.dosage} />
            <ReadonlyField
              label="Date of Reaction"
              value={formatDate(event.date_of_reaction)}
            />
            <ReadonlyField
              label="Stop Date"
              value={event.stop_date ? formatDate(event.stop_date) : "-"}
            />
            <ReadonlyField label="Reaction Type" value={event.reaction_type} />
          </div>
          <div className="mt-5 max-w-[770px]">
            <ReadonlyField
              label="Detailed Symptoms"
              value={event.detailed_symptoms}
              className="min-h-[120px] items-start py-4"
            />
          </div>

          <hr className="my-10 max-w-[770px] border-gray-100" />

          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Status
          </div>
          {statusError && (
            <div className="mb-4 max-w-[770px] rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {statusError}
            </div>
          )}
          <div className="flex max-w-[770px] flex-wrap gap-3">
            {STATUS_OPTIONS.map((option) => {
              const active = event.status === option.value;
              const color = STATUS_COLORS[option.value];
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={isUpdatingStatus || active}
                  onClick={() => handleStatusChange(option.value)}
                  className="rounded-full border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-default"
                  style={
                    active
                      ? {
                          backgroundColor: color.bg,
                          color: color.text,
                          borderColor: color.text,
                        }
                      : {
                          backgroundColor: "white",
                          color: "#6B7280",
                          borderColor: "#D1D5DB",
                        }
                  }
                >
                  {isUpdatingStatus && !active ? (
                    <Loader2 size={14} className="mr-1 inline animate-spin" />
                  ) : null}
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex max-w-[770px] flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-red-200 px-8 text-lg font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              {isDeleting ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Trash2 size={20} />
              )}
              {isDeleting ? "Deleting..." : "Delete Report"}
            </button>
          </div>
        </section>
      </div>

      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
          <span className="h-12 w-1 rounded-full bg-[#039855]" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Updated</p>
            <p className="text-sm text-gray-600">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
