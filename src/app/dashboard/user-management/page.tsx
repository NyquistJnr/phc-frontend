"use client";

import { Suspense } from "react";
import UserManagement from "@/src/components/adminDashboard/user-management/Home";

export default function UserManagementPage() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <UserManagement />
    </Suspense>
  );
}
