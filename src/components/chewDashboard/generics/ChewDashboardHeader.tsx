"use client";

import DashboardHeader from "@/src/components/generic/dashboard/DashboardHeader";

type ChewBreadcrumb = {
  label: string;
  href?: string;
  active?: boolean;
};

type ChewDashboardHeaderProps = {
  title: string;
  breadcrumbs?: ChewBreadcrumb[];
};

export default function ChewDashboardHeader({
  title,
  breadcrumbs = [],
}: ChewDashboardHeaderProps) {
  return (
    <DashboardHeader
      title={title}
      breadcrumbs={breadcrumbs.map(({ label, href }) => ({ label, href }))}
      notificationHref="/chew-dashboard/notifications"
      profileHref="/chew-dashboard/profile"
      fallbackName="CHEW"
      fallbackRole="CHEW"
    />
  );
}
