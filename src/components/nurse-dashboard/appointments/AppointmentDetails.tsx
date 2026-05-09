"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  ClipboardList,
} from "lucide-react";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { useAppointment } from "@/src/hooks/nurses/use-appointments";

const statusColors: Record<string, { bg: string; text: string }> = {
  SCHEDULED: { bg: "#FFF4E5", text: "#1F2937" },
  IN_PROGRESS: { bg: "#E2E7FF", text: "#046C3F" },
  COMPLETED: { bg: "#DFF3EA", text: "#039855" },
  CANCELLED: { bg: "#FDE8E8", text: "#F33131" },
  NO_SHOW: { bg: "#FDE8E8", text: "#F33131" },
  VITALS_DONE: { bg: "#E2E7FF", text: "#046C3F" },
};

export default function AppointmentDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: response, isLoading, isError } = useAppointment(id);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F7FC]">
        <p className="text-gray-500">Loading appointment details...</p>
      </div>
    );
  }

  if (isError || !response?.data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F6F7FC]">
        <p className="mb-4 text-gray-500">
          Failed to load appointment details.
        </p>
        <button
          onClick={() => router.back()}
          className="rounded-lg bg-[#046C3F] px-4 py-2 text-white hover:bg-[#035a34]"
        >
          Go Back
        </button>
      </div>
    );
  }

  const appointment = response.data;
  const colorData = statusColors[appointment.status] || {
    bg: "#F3F4F6",
    text: "#374151",
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Appointment Details"
        breadcrumbs={[
          { label: "Appointments", href: "/nurse-dashboard/appointments" },
          { label: appointment.appointment_id },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8 max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push("/nurse-dashboard/appointments")}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft size={18} /> Back to List
          </button>

          <StatusBadge
            label={appointment.status.replace("_", " ")}
            bgColorHex={colorData.bg}
            textColorHex={colorData.text}
          />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Card */}
          <div className="md:col-span-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4EA] text-[#046C3F]">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {appointment.patient_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {appointment.patient_display_id}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Assigned Staff
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {appointment.assigned_staff_name || "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Created By
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {appointment.created_by_name}
                </p>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900 border-b border-gray-100 pb-4 flex items-center gap-2">
              <ClipboardList size={20} className="text-[#046C3F]" />
              Visit Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 text-gray-400" size={18} />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Date
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {new Date(appointment.appointment_date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 text-gray-400" size={18} />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Time
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {appointment.appointment_time.slice(0, 5)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:col-span-2">
                <FileText className="mt-0.5 text-gray-400" size={18} />
                <div className="w-full">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Visit Type
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {appointment.visit_type}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2 bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">
                  Reason for Visit
                </p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {appointment.reason_for_visit || "No reason provided."}
                </p>
              </div>

              {appointment.notes && (
                <div className="sm:col-span-2 bg-yellow-50/50 rounded-xl p-4 border border-yellow-100">
                  <p className="text-xs font-medium uppercase tracking-wider text-yellow-800 mb-2">
                    Additional Notes
                  </p>
                  <p className="text-sm text-yellow-900 leading-relaxed">
                    {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
