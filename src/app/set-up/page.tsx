import { Suspense } from "react";
import SetUpAccount from "@/src/components/auth/set-up/SetUp";

export default function SetUpAccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetUpAccount />
    </Suspense>
  );
}
