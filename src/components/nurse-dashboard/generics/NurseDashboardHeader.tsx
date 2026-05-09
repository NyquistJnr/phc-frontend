"use client";

import DashboardHeader, {
  DashboardBreadcrumb,
} from "@/src/components/generic/dashboard/DashboardHeader";

type NurseDashboardHeaderProps = {
  title: string;
  breadcrumbs?: DashboardBreadcrumb[];
};

export default function NurseDashboardHeader({
  title,
  breadcrumbs = [],
}: NurseDashboardHeaderProps) {
  return (
    <DashboardHeader
      title={title}
      breadcrumbs={breadcrumbs}
      notificationHref="/nurse-dashboard/notifications"
      fallbackName="Grace"
      fallbackRole="Nurse"
    />
  );
}
