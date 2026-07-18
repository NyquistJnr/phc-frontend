"use client";

import { useRouter } from "next/navigation";
import PatientProfile from "@/src/components/officerDashboard/patients-records/PatientDetails";

export default function PatientDetailsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/oic-dashboard/patient-records");
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <PatientProfile onBack={handleBack} />
    </main>
  );
}
