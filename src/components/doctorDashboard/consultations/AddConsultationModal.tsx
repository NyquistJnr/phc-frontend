"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  FileText,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useMyAppointments } from "@/src/hooks/doctors/use-consultation";
import type { MyAppointment, PaginatedResponse } from "./types";

const PAGE_SIZE = 5;

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  SCHEDULED: { bg: "#EFF6FF", text: "#1D4ED8" },
  IN_PROGRESS: { bg: "#FFF4E5", text: "#B45309" },
  COMPLETED: { bg: "#ECFDF5", text: "#065F46" },
  CANCELLED: { bg: "#FEF2F2", text: "#991B1B" },
};

function formatDate(date?: string, time?: string) {
  if (!date) return "-";
  const formatted = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return time ? `${formatted} · ${time.slice(0, 5)}` : formatted;
}

export default function AddConsultationModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { data, isLoading, isFetching } = useMyAppointments({
    search: search || undefined,
    page,
    page_size: PAGE_SIZE,
  });

  const appointmentsData = data as PaginatedResponse<MyAppointment> | undefined;
  const appointments = appointmentsData?.results || [];
  const totalPages = appointmentsData?.total_pages || 1;
  const totalCount = appointmentsData?.count ?? appointments.length;

  const handleSelect = (appointmentId: string) => {
    router.push(`/doctor-dashboard/consultations/new?appointment=${appointmentId}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex min-h-full items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl rounded-xl bg-white px-6 py-7 shadow-2xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8F7F0] text-[#046C3F]">
                <FileText size={20} />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Add Consultation Note
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Select an appointment to begin a consultation note.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative mb-5">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              autoFocus
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by patient name or appointment ID…"
              className="h-11 w-full rounded-lg border border-gray-300 pl-11 pr-10 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
            />
            {isFetching && (
              <Loader2
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
              />
            )}
          </div>

          <div className="min-h-[280px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-gray-400">
                <Loader2 size={20} className="animate-spin" />
                Loading appointments…
              </div>
            ) : appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-sm text-gray-400">
                <Calendar size={22} className="text-gray-300" />
                {search
                  ? `No appointments match "${search}".`
                  : "No appointments found."}
              </div>
            ) : (
              <div className="space-y-2">
                {appointments.map((appointment) => {
                  const color =
                    STATUS_COLORS[appointment.status || ""] ||
                    STATUS_COLORS.SCHEDULED;
                  return (
                    <button
                      key={appointment.id}
                      type="button"
                      onClick={() => handleSelect(appointment.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-[#046C3F] hover:bg-[#F8FAF9]"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {appointment.patient_name || "Unknown Patient"}
                          </p>
                          {appointment.patient_display_id && (
                            <span className="shrink-0 text-xs text-gray-400">
                              {appointment.patient_display_id}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {appointment.appointment_id ? `${appointment.appointment_id} · ` : ""}
                          {formatDate(
                            appointment.appointment_date,
                            appointment.appointment_time,
                          )}
                          {appointment.visit_type
                            ? ` · ${appointment.visit_type}`
                            : ""}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: color.bg, color: color.text }}
                      >
                        {appointment.status || "-"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {appointments.length > 0 && totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">
                Page {page} of {totalPages} · {totalCount} total
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={13} /> Prev
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
