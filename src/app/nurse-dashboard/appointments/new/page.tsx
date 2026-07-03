"use client";

import { Suspense } from "react";
import NewAppointments from "@/src/components/nurse-dashboard/appointments/CreateAppointment";

export default function NewAppointmentsPage() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <NewAppointments />
    </Suspense>
  );
}
