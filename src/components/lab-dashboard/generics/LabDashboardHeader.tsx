"use client";

import DashboardHeader, {
  DashboardBreadcrumb,
} from "@/src/components/generic/dashboard/DashboardHeader";

type LabDashboardHeaderProps = {
  title: string;
  breadcrumbs?: DashboardBreadcrumb[];
};

export default function LabDashboardHeader({
  title,
  breadcrumbs = [],
}: LabDashboardHeaderProps) {
  return (
    <DashboardHeader
      title={title}
      breadcrumbs={breadcrumbs}
      notificationHref="/lab-dashboard/notifications"
      profileHref="/lab-dashboard/profile"
      fallbackName="Festus"
      fallbackRole="Lab Tech"
    />
  );
}
