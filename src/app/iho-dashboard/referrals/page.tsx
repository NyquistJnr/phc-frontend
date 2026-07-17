"use client";

import { Suspense } from "react";
import ReferralHistory from "@/src/components/iho-dashboard/referrals/ReferralHistory";

export default function ReferralsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReferralHistory />
    </Suspense>
  );
}
