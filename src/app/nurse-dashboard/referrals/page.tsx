import { Suspense } from "react";
import Referrals from "../../../components/nurse-dashboard/referrals/Referrals";

export default function ReferralsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Referrals />
    </Suspense>
  );
}
