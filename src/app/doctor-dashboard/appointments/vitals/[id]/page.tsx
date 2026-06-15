import { Suspense } from "react";
import RecordVitalDoctor from "@/src/components/doctorDashboard/appointments/CreateVitals";

export default function DoctorAppointmentsVitalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecordVitalDoctor />
    </Suspense>
  );
}
