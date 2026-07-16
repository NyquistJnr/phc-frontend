import { Suspense } from "react";
import CreateReferral from "@/src/components/chewDashboard/referrals/CreateReferral";

export default function ChewCreateReferralPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateReferral />
    </Suspense>
  );
}
