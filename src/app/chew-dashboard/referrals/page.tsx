import { Suspense } from "react";

import ReferralHistory from "@/src/components/chewDashboard/referrals/ReferralHistory";

export default function ChewReferralsPage() {
  return (
    <Suspense fallback={null}>
      <ReferralHistory />
    </Suspense>
  );
}
