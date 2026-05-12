import { Suspense } from "react";
import Appointments from "@/src/components/chewDashboard/appointments/Appointments";

export default function ChewAppointmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Appointments />
    </Suspense>
  );
}
