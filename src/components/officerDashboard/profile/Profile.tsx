"use client";

import DashboardProfileScreen from "@/src/components/generic/dashboard/DashboardProfileScreen";
import OfficerBackButton from "@/src/components/officerDashboard/generics/OfficerBackButton";
import OfficerDashboardHeader from "@/src/components/officerDashboard/generics/OfficerDashboardHeader";

export default function OfficerProfile() {
  return (
    <DashboardProfileScreen
      Header={OfficerDashboardHeader}
      BackButton={OfficerBackButton}
      firstName="Nobert"
      lastName="Ndako"
      email="nobertndako@gmail.com"
      phone="08065650633"
      address="No. 93 Skyfield Apartments"
      city="Yaba"
      country="Nigeria"
      state="Lagos"
    />
  );
}
