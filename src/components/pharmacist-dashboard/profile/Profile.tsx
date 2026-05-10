"use client";

import DashboardProfileScreen from "@/src/components/generic/dashboard/DashboardProfileScreen";
import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";

export default function PharmacistProfile() {
  return (
    <DashboardProfileScreen
      Header={PharmacistDashboardHeader}
      BackButton={PharmacistBackButton}
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
