import { Suspense } from "react";
import ChewHealthPromotion from "@/src/components/chewDashboard/healthPromotion/ChewHealthPromotion";

export default function ChewHealthPromotionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChewHealthPromotion />
    </Suspense>
  );
}
