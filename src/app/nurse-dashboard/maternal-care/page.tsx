import { Suspense } from "react";
import MaternalCare from "@/src/components/nurse-dashboard/maternal-care/MaternalCare";

export default function MaternalCarePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MaternalCare />
    </Suspense>
  );
}
