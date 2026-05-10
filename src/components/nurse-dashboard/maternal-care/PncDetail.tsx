"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Activity, FileText, Baby } from "lucide-react";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { usePncVisitDetails } from "@/src/hooks/nurses/use-maternal-care";

export default function PncVisitDetailPage() {
  const router = useRouter();

  const params = useParams();
  const pncId = params?.pnc as string;
  const { data: pnc, isLoading, isError } = usePncVisitDetails(pncId);

  const displayYesNo = (val: any) => {
    if (val === true || val === "true") return "Yes";
    if (val === false || val === "false") return "No";
    return val || "N/A";
  };

  const getOutcomeColors = (outcome: string) => {
    switch (outcome?.toUpperCase()) {
      case "TREATED":
        return { bg: "#DFF3EA", text: "#039855" };
      case "ADMITTED":
        return { bg: "#FFF4E5", text: "#B54708" };
      case "REFERRED":
        return { bg: "#FDE8E8", text: "#C81E1E" };
      case "HEALTHY":
        return { bg: "#DFF3EA", text: "#039855" };
      default:
        return { bg: "#F3F4F6", text: "#374151" };
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading PNC Visit details...
      </div>
    );
  }

  if (isError || !pnc) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load visit details.
      </div>
    );
  }

  const motherOutcomeColors = getOutcomeColors(pnc.outcome);

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Maternal Care"
        breadcrumbs={[
          {
            label: "Maternal Episodes",
            href: "/nurse-dashboard/maternal-care",
          },
          {
            label: "Episode Details",
            href: `/nurse-dashboard/maternal-care/${params.id}`,
          },
          { label: "PNC Visit Detail" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8 max-w-8xl mx-auto">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Episode
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Postnatal Care (PNC) Visit
              </h2>
              <p className="text-sm text-gray-500 mt-1">Visit ID: {pnc.id}</p>
            </div>
            <div className="flex gap-3 items-center">
              <StatusBadge
                label={`${pnc.attendance_type} VISIT`}
                bgColorHex="#F3F4F6"
                textColorHex="#374151"
              />
              <StatusBadge
                label={`OUTCOME: ${pnc.outcome}`}
                bgColorHex={motherOutcomeColors.bg}
                textColorHex={motherOutcomeColors.text}
              />
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock size={16} className="text-[#046C3F]" /> General Info
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-0.5 text-xs">
                    Appointment Date
                  </p>
                  <p className="font-medium text-gray-900">
                    {pnc.appointment_date}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5 text-xs">
                    Timing of Visit
                  </p>
                  <p className="font-medium text-gray-900">
                    {pnc.timing_of_visit || "N/A"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity size={16} className="text-[#046C3F]" /> Clinical
                Vitals
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-0.5 text-xs">Hemoglobin PCV</p>
                  <p className="font-medium text-gray-900">
                    {pnc.hemoglobin_pcv || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5 text-xs">Urinalysis</p>
                  <p className="font-medium text-gray-900">
                    {pnc.urinalysis || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5 text-xs">
                    Vaginal Exam Conducted
                  </p>
                  <p className="font-medium text-gray-900">
                    {displayYesNo(pnc.vaginal_examination_conducted)}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText size={16} className="text-[#046C3F]" /> Notes &
                Referrals
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-0.5 text-xs">
                    Counselling Topics
                  </p>
                  <p className="font-medium text-gray-900">
                    {pnc.counselling_topics || "None"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-0.5 text-xs">
                    Referral Reason
                  </p>
                  <p className="font-medium text-gray-900">
                    {pnc.referral_reason || "No referral made"}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Baby className="text-[#046C3F]" /> Newborn Assessments
        </h2>

        {pnc.newborn_assessments && pnc.newborn_assessments.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {pnc.newborn_assessments.map((baby) => {
              const babyOutcomeColor = getOutcomeColors(baby.outcome);
              return (
                <div
                  key={baby.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">
                        {baby.baby_name}
                      </h4>
                      <p className="text-sm text-[#046C3F] font-medium">
                        {baby.baby_display_id}
                      </p>
                    </div>
                    <StatusBadge
                      label={baby.outcome}
                      bgColorHex={babyOutcomeColor.bg}
                      textColorHex={babyOutcomeColor.text}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Temperature</p>
                      <p className="font-medium text-sm text-gray-900">
                        {baby.temperature}°C
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Cord Care Assessed
                      </p>
                      <p className="font-medium text-sm text-gray-900">
                        {displayYesNo(baby.cord_care_assessed)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Exclusive Breastfeeding
                      </p>
                      <p className="font-medium text-sm text-gray-900">
                        {baby.exclusive_breastfeeding || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Neonatal Jaundice
                      </p>
                      <p className="font-medium text-sm text-gray-900">
                        {displayYesNo(baby.neonatal_jaundice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">KMC Provided</p>
                      <p className="font-medium text-sm text-gray-900">
                        {displayYesNo(baby.kmc_provided)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        1st Dose Antibiotics
                      </p>
                      <p className="font-medium text-sm text-gray-900">
                        {displayYesNo(baby.first_dose_antibiotics_given)}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-3 mt-2">
                      <p className="text-xs text-gray-500 mb-1">
                        Newborn Danger Signs
                      </p>
                      <p className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-900">
                        {baby.newborn_danger_signs || "None recorded"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-500">
              No newborn assessments recorded for this visit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
