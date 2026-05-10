"use client";

import { Suspense } from "react";
import ReferralHistory from "@/src/components/doctorDashboard/referrals/ReferralHistory";

export default function DoctorReferralsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReferralHistory />
    </Suspense>
  );
}
