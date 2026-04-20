"use client";

import { Bell, Save } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";

interface AIFeature {
  title: string;
  description: string;
}

const AI_FEATURES: AIFeature[] = [
  {
    title: "AI Decision Support",
    description: "AI-powered clinical decision support for diagnosis assistance",
  },
  {
    title: "Predictive Analytics",
    description: "Predict disease outbreaks and resource needs using ML models",
  },
  {
    title: "Smart Triage",
    description: "Automated patient triage based on symptoms and vitals",
  },
  {
    title: "Diagnosis Suggestions",
    description: "Automated diagnosis suggestions for patient based illness",
  },
  {
    title: "Treatment Recommendations",
    description: "Automated diagnosis suggestions for patient based illness",
  },
  {
    title: "Automated Report Summaries",
    description: "Automated diagnosis suggestions for patient based illness",
  },
];

export default function AIConfiguration() {
  const breadcrumbs = [
    { label: "Configuration" },
    { label: "AI Configuration", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="Configuration" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            AI Configuration{" "}
            <span className="text-xl font-medium text-gray-400">(Beta / Future Feature)</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Configure AI-powered assistance for clinical decision-making
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-3xl">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center">
              <Bell size={18} className="text-[#046C3F]" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">AI Configuration</h2>
          </div>

          {/* Feature List */}
          <div className="space-y-4 mb-10">
            {AI_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center justify-between p-4 sm:p-5 border border-gray-100 rounded-xl bg-[#FAFAFA] hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-0.5 pr-4">
                  <p className="text-sm font-semibold text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
                <span className="shrink-0 px-3 py-1.5 bg-[#E8F7F0] text-[#046C3F] text-xs font-semibold rounded-lg whitespace-nowrap">
                  Coming soon
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              disabled
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl text-sm cursor-not-allowed"
            >
              <Save size={16} />
              Save Configuration
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
