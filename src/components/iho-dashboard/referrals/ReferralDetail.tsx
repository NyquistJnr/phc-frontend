"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, User, Activity, ArrowRightLeft, Mail, Video, ExternalLink, Users } from "lucide-react";

import NurseDashboardHeader from "@/src/components/iho-dashboard/generics/NurseDashboardHeader";
import NurseBackButton from "@/src/components/iho-dashboard/generics/NurseBackButton";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { useReferralById } from "@/src/hooks/nurses/use-referrals";

const statusColors: Record<string, { bg: string; text: string }> = {
  ACCEPTED: { bg: "#DFF3EA", text: "#039855" },
  PENDING: { bg: "#FFF4E5", text: "#1F2937" },
  REJECTED: { bg: "#FDE8E8", text: "#F33131" },
};

const destinationMap: Record<string, string> = {
  PRIMARY: "Primary Health Care",
  SECONDARY: "Secondary Health Care",
  HIGHER: "Higher Health Care",
  OTHER: "Other",
};

const transportMap: Record<string, string> = {
  PRIVATE: "Private Vehicle",
  AMBULANCE: "Ambulance",
  PUBLIC: "Public Transportation",
  OTHER: "Other",
};

const referralModeMap: Record<string, string> = {
  SOFTCOPY: "Softcopy (Email/Digital)",
  HARDCOPY: "Hardcopy (Physical Document)",
};

function DetailItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 ${className}`}
    >
      <p className="mb-1 text-xs text-[#62636C]">{label}</p>
      <div className="text-sm font-medium text-gray-900">{value || "N/A"}</div>
    </div>
  );
}

export default function ReferralDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: referral, isLoading, isError } = useReferralById(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F7FC]">
        <NurseDashboardHeader
          title="Referrals"
          breadcrumbs={[{ label: "Referrals" }, { label: "Detail" }]}
        />
        <div className="flex items-center justify-center py-20 text-gray-500">
          Loading referral details...
        </div>
      </div>
    );
  }

  if (isError || !referral) {
    return (
      <div className="min-h-screen bg-[#F6F7FC]">
        <NurseDashboardHeader
          title="Referrals"
          breadcrumbs={[{ label: "Referrals" }, { label: "Detail" }]}
        />
        <div className="px-4 py-6 sm:px-6">
          <NurseBackButton
            onClick={() => router.push("/iho-dashboard/referrals")}
          />
          <div className="mt-8 rounded-xl bg-white p-8 text-center text-red-500 shadow-sm">
            Failed to load referral data. Please try again.
          </div>
        </div>
      </div>
    );
  }

  const colorData = statusColors[referral.status] || {
    bg: "#F3F4F6",
    text: "#374151",
  };

  const hasCommunicationData =
    referral.target_doctor_email ||
    referral.target_department_email ||
    referral.email_subject ||
    referral.email_body;

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Referrals"
        breadcrumbs={[{ label: "Referrals" }, { label: "Referral Detail" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton
          onClick={() => router.push("/iho-dashboard/referrals")}
        />

        <div className="mb-7 mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Referral Detail
            </h2>
            <p className="text-base text-[#3F3F46]">
              View detailed information about this referral
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <StatusBadge
              label={
                referral.status.charAt(0) +
                referral.status.slice(1).toLowerCase()
              }
              bgColorHex={colorData.bg}
              textColorHex={colorData.text}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
              <User size={20} className="text-[#046C3F]" /> Patient Details
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem label="Patient Name" value={referral.patient_name} />
              <DetailItem
                label="Patient ID"
                value={referral.patient_display_id}
              />
              <DetailItem label="Referral ID" value={referral.referral_id} />
              <DetailItem
                label="Date Created"
                value={new Date(referral.created_at).toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
              <ArrowRightLeft size={20} className="text-[#046C3F]" /> Facility &
              Routing
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem
                label="Direction"
                value={
                  referral.direction
                    ? referral.direction.charAt(0).toUpperCase() +
                      referral.direction.slice(1).toLowerCase()
                    : "N/A"
                }
              />
              <DetailItem
                label="Destination Level"
                value={
                  referral.destination_level
                    ? destinationMap[referral.destination_level] ||
                      referral.destination_level
                    : "N/A"
                }
              />
              <DetailItem
                label="Mode of Transportation"
                value={
                  referral.mode_of_transportation
                    ? transportMap[referral.mode_of_transportation] ||
                      referral.mode_of_transportation
                    : "N/A"
                }
              />
              <DetailItem
                label="Referring Facility"
                value={referral.referring_facility_name}
              />
              <DetailItem
                label="Receiving Facility"
                value={referral.receiving_facility_name}
              />
              <DetailItem
                label="Referred By"
                value={referral.referred_by_name}
              />
              {referral.mode_of_referral && (
                <DetailItem
                  label="Referral Mode"
                  value={
                    referralModeMap[referral.mode_of_referral] ||
                    referral.mode_of_referral
                  }
                />
              )}
            </div>
          </div>

          {hasCommunicationData && (
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
                <Mail size={20} className="text-[#046C3F]" /> Communication
                Details
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                <DetailItem
                  label="Target Doctor Email"
                  value={referral.target_doctor_email}
                />
                <DetailItem
                  label="Target Department Email"
                  value={referral.target_department_email}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <DetailItem
                  label="Email Subject"
                  value={referral.email_subject}
                />
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
                  <p className="mb-2 flex items-center gap-2 font-medium text-gray-700">
                    <FileText size={16} className="text-gray-500" /> Email Body
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-gray-600">
                    {referral.email_body || "No email body provided."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {referral.telemedicine_session && (
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
                <Video size={20} className="text-[#046C3F]" /> Telemedicine Session
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                <DetailItem label="Session ID" value={referral.telemedicine_session.session_id} />
                <DetailItem label="Session Status" value={
                  <span className="capitalize font-semibold text-purple-600">{referral.telemedicine_session.status}</span>
                } />
              </div>
              
              <div className="mb-6 flex flex-wrap gap-4">
                <button
                  onClick={() => window.open(referral.telemedicine_session?.host_join_url, "_blank")}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                >
                  <ExternalLink size={16} />
                  Join as Host
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referral.telemedicine_session?.patient_join_url || "");
                    alert("Patient join link copied to clipboard!");
                  }}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <ExternalLink size={16} />
                  Copy Patient Link
                </button>
              </div>

              {referral.telemedicine_session.participants && referral.telemedicine_session.participants.length > 0 && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Users size={16} /> Participants
                  </h4>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Host</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {referral.telemedicine_session.participants.map((p, idx) => (
                          <tr key={idx} className="bg-white">
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {p.name}
                              <div className="font-normal text-gray-500 text-xs">{p.email}</div>
                            </td>
                            <td className="px-4 py-3 capitalize">{p.role}</td>
                            <td className="px-4 py-3">
                              {p.is_host ? (
                                <span className="inline-flex rounded-full bg-purple-50 px-2 text-xs font-semibold text-purple-700">Host</span>
                              ) : "No"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-800">
              <Activity size={20} className="text-[#046C3F]" /> Clinical
              Information
            </div>

            <div className="mb-4 w-fit">
              <DetailItem
                label="Referral Type"
                value={
                  referral.referral_type
                    ? referral.referral_type.charAt(0) +
                      referral.referral_type.slice(1).toLowerCase()
                    : "N/A"
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
                <p className="mb-2 flex items-center gap-2 font-medium text-gray-700">
                  <FileText size={16} className="text-gray-500" /> Reason for
                  Referral
                </p>
                <p className="whitespace-pre-wrap text-sm text-gray-600">
                  {referral.reason_for_referral || "No reason provided."}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
                <p className="mb-2 flex items-center gap-2 font-medium text-gray-700">
                  <FileText size={16} className="text-gray-500" /> Clinical
                  Summary
                </p>
                <p className="whitespace-pre-wrap text-sm text-gray-600">
                  {referral.clinical_summary || "No summary provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
