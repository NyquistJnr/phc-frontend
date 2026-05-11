import ChewMaternalFollowUps from "@/src/components/chewDashboard/maternalFollowUps/ChewMaternalFollowUps";
import { Suspense } from "react";

export default function ChewMaternalFollowUpsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChewMaternalFollowUps />
    </Suspense>
  );
}
