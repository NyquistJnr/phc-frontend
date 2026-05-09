"use client";

import { Suspense } from "react";
import ReferralHistory from "@/src/components/nurse-dashboard/referrals/ReferralHistory";

export default function ReferralsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReferralHistory />
    </Suspense>
  );
}
