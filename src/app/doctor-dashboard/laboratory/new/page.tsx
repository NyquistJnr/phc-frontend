import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { LabRequestForm } from "@/src/components/doctorDashboard/laboratory/Laboratory";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewLabRequestPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Laboratory"
        breadcrumbs={[
          { label: "Laboratory", href: "/doctor-dashboard/laboratory" },
          { label: "Lab Request", active: true },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <Link
          href="/doctor-dashboard/laboratory"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">New lab request</h1>
        <LabRequestForm />
      </div>
    </div>
  );
}
