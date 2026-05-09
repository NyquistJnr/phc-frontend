import { Suspense } from "react";
import Appointments from "@/src/components/nurse-dashboard/appointments/Appointments";

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Appointments />
    </Suspense>
  );
}
