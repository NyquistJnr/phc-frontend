"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import EnterResultForm from "./EnterResultForm";

export default function NewLabResult() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = () => {
    setToast("Result submitted successfully.");

    setTimeout(() => {
      setToast(null);
      router.push("/lab-dashboard/laboratory");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader
        title="Laboratory"
        breadcrumbs={[
          { label: "Laboratory" },
          { label: "Lab results" },
          { label: "Enter New Result" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7 mt-4">
          <h1 className="text-2xl font-semibold text-black sm:text-3xl">
            Enter Lab Result
          </h1>
        </div>

        <EnterResultForm onCancel={handleCancel} onSubmit={handleSubmit} />
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[350px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
          <span className="mt-0.5 h-6 w-6 rounded-lg border border-[#9ADDBA] bg-[#E8F7F0]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">{toast}</p>
            <p className="text-sm text-gray-500">
              Result for Musa Abdullahi submitted to Dr Reyes
            </p>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-900">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
