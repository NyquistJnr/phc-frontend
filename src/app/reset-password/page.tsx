import { Suspense } from "react";
import ResetPassword from "@/src/components/auth/reset-password/ResetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
}
