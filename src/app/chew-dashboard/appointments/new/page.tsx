"use client";

import { Suspense } from "react";
import CreateAppointment from "@/src/components/chewDashboard/appointments/CreateAppointment";

export default function ChewNewAppointmentPage() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <CreateAppointment />
    </Suspense>
  );
}
