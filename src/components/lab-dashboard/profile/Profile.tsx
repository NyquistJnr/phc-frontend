"use client";

import DashboardProfileScreen from "@/src/components/generic/dashboard/DashboardProfileScreen";
import LabBackButton from "@/src/components/lab-dashboard/generics/LabBackButton";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";

export default function LabProfile() {
  return (
    <DashboardProfileScreen
      Header={LabDashboardHeader}
      BackButton={LabBackButton}
      firstName="Festus"
      lastName="Gilbert"
      email="festusgilbert@gmail.com"
      phone="08065650633"
      address="No. 93 Skyfield Apartments"
      city="Yaba"
      country="Nigeria"
      state="Lagos"
    />
  );
}
