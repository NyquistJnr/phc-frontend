import { Suspense } from "react";
import CreateReferral from "@/src/components/doctorDashboard/referrals/CreateReferral";

export default function CreateDoctorReferralPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateReferral />
    </Suspense>
  );
}
