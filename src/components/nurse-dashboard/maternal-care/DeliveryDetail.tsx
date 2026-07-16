"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Activity, FileText, Baby, Info } from "lucide-react";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { useDeliveryDetails } from "@/src/hooks/nurses/use-maternal-care";

export default function DeliveryDetail() {
  const router = useRouter();
  const params = useParams();

  const deliveryId = params?.id as string;

  const { data: delivery, isLoading, isError } = useDeliveryDetails(deliveryId);

  if (!deliveryId) return null;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading Delivery details...
      </div>
    );
  }

  if (isError || !delivery) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load delivery details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Delivery Records"
        breadcrumbs={[
          {
            label: "Delivery Directory",
            href: "/nurse-dashboard/maternal-care/delivery",
          },
          { label: "Delivery Detail" },
        ]}
      />

      <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6 lg:py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Delivery Record
              </h2>
              <p className="text-sm text-gray-500 mt-1">Delivery ID: {delivery.id}</p>
            </div>
            <div className="flex gap-3 items-center">
              <StatusBadge
                label={delivery.birth_status}
                bgColorHex={delivery.birth_status === "ALIVE" ? "#DFF3EA" : "#FEE2E2"}
                textColorHex={delivery.birth_status === "ALIVE" ? "#039855" : "#991B1B"}
              />
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Info size={16} className="text-[#046C3F]" /> General
                Information
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Delivery Date</p>
                  <p className="font-medium text-gray-900">
                    {delivery.delivery_date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Delivery Mode</p>
                  <p className="font-medium text-gray-900">
                    {delivery.delivery_mode || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mother Name</p>
                  <p className="font-medium text-gray-900">
                    {delivery.mother_name || "N/A"}
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Baby size={16} className="text-[#046C3F]" /> Newborn Info
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Child Name</p>
                  <p className="font-medium text-gray-900">
                    {delivery.child_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sex</p>
                  <p className="font-medium text-gray-900">
                    {delivery.sex || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Birth Weight</p>
                  <p className="font-medium text-gray-900">
                    {delivery.birth_weight ? `${delivery.birth_weight} kg` : "N/A"}
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity size={16} className="text-[#046C3F]" /> Clinical Assessments
              </h3>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">APGAR Score (1 min)</p>
                  <p className="font-medium text-gray-900">
                    {delivery.apgar_score_1min || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">APGAR Score (5 min)</p>
                  <p className="font-medium text-gray-900">
                    {delivery.apgar_score_5min || "N/A"}
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText size={16} className="text-[#046C3F]" /> Clinical Notes
              </h3>
              <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Complications</p>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                    {delivery.complications || "None recorded"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">General Notes</p>
                  <p className="text-sm text-gray-900 bg-white p-3 rounded-lg border border-gray-200">
                    {delivery.notes || "No additional notes provided."}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
