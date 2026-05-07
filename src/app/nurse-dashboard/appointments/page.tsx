import Appointments from "@/src/components/nurse-dashboard/appointments/Appointments";
import { Suspense } from "react";

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Appointments />
    </Suspense>
  );
}
