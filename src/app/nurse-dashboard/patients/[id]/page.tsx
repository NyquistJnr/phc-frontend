"use client";

import { useRouter } from "next/navigation";
import PatientProfile from "@/src/components/nurse-dashboard/patients/PatientDetails";

export default function PatientDetailsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/nurse-dashboard/patients");
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      <PatientProfile onBack={handleBack} />
    </main>
  );
}
