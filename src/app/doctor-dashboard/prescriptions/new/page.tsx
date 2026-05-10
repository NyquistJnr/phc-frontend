import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { CreatePrescription } from "@/src/components/doctorDashboard/prescriptions/Prescriptions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPrescriptionPage() {
  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader
        title="Prescriptions"
        breadcrumbs={[
          { label: "Prescriptions", href: "/doctor-dashboard/prescriptions" },
          { label: "Create Prescription", active: true },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <Link
          href="/doctor-dashboard/prescriptions"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Prescription</h1>
        <CreatePrescription />
      </div>
    </div>
  );
}
