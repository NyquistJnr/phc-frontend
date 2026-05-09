"use client";

import DashboardHeader, {
  DashboardBreadcrumb,
} from "@/src/components/generic/dashboard/DashboardHeader";

type OfficerDashboardHeaderProps = {
  title: string;
  breadcrumbs?: DashboardBreadcrumb[];
};

export default function OfficerDashboardHeader({
  title,
  breadcrumbs = [],
}: OfficerDashboardHeaderProps) {
  return (
    <DashboardHeader
      title={title}
      breadcrumbs={breadcrumbs}
      notificationHref="/oic-dashboard/notifications"
      fallbackName="Nobert"
      fallbackRole="OIC"
    />
  );
}
