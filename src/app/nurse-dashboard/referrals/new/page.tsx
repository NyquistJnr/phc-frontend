import { Suspense } from "react";
import CreateReferral from "@/src/components/nurse-dashboard/referrals/CreateReferral";

export default function CreateReferralPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateReferral />
    </Suspense>
  );
}
