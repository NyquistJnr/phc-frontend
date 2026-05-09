import { Suspense } from "react";
import CreateUserFromStateAdmin from "@/src/components/adminDashboard/facility-management/CreateUserFromStateAdmin";

export default function CreateUserFromStateAdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateUserFromStateAdmin />
    </Suspense>
  );
}
