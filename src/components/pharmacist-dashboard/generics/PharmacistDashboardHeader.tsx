"use client";

import DashboardHeader, {
  DashboardBreadcrumb,
} from "@/src/components/generic/dashboard/DashboardHeader";

type PharmacistDashboardHeaderProps = {
  title: string;
  breadcrumbs?: DashboardBreadcrumb[];
};

export default function PharmacistDashboardHeader({
  title,
  breadcrumbs = [],
}: PharmacistDashboardHeaderProps) {
  return (
    <DashboardHeader
      title={title}
      breadcrumbs={breadcrumbs}
      notificationHref="/pharmacist-dashboard/notifications"
      profileHref="/pharmacist-dashboard/profile"
      fallbackName="Festus"
      fallbackRole="Pharmacist"
    />
  );
}
