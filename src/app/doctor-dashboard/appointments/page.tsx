import { Suspense } from "react";
import DoctorAppointments from "@/src/components/doctorDashboard/consultations/Appointments";

export default function DoctorAppointmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DoctorAppointments />
    </Suspense>
  );
}
