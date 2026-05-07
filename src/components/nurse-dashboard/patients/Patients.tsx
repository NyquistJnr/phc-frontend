"use client";

import { Search, Calendar, UserRoundPlus, Save } from "lucide-react";
import { ReusableForm, FormFieldDef } from "../../generic/ui/ReusableForm";

export default function RegisterChildDemo() {
  const registerFields: FormFieldDef[] = [
    {
      name: "patientName",
      label: "Patient Name",
      type: "text",
      placeholder: "Search patient by name or ID",
      icon: <Search size={18} />,
    },
    {
      name: "patientId",
      label: "Patient ID",
      type: "text",
      placeholder: "PAT-PLT-000234",
      readOnly: true,
    },
    {
      name: "encounterId",
      label: "Encounter ID",
      type: "text",
      placeholder: "ENC-PLT-000234",
      readOnly: true,
    },
    {
      name: "facility",
      label: "Facility",
      type: "text",
      placeholder: "Auto-filled from logged-in facility",
      readOnly: true,
    },
    {
      name: "childWard",
      label: "Child's ward",
      type: "text",
      placeholder: "Auto-filled",
      readOnly: true,
    },
    {
      name: "childLGA",
      label: "Child's LGA",
      type: "text",
      placeholder: "Auto-filled",
      icon: <Calendar size={18} />,
      readOnly: true,
    },
    {
      name: "facilityType",
      label: "Facility Type",
      type: "select",
      placeholder: "Select",
      options: [
        { label: "Hospital", value: "hospital" },
        { label: "Clinic", value: "clinic" },
      ],
    },
    {
      name: "childState",
      label: "Child's state",
      type: "text",
      placeholder: "Auto-filled",
      readOnly: true,
    },
    {
      name: "dateOfVisit",
      label: "Date of Visit",
      type: "date",
      placeholder: "12/12/2020",
    },
    {
      name: "sessionType",
      label: "Session Type",
      type: "select",
      placeholder: "Select",
      options: [
        { label: "Morning", value: "morning" },
        { label: "Afternoon", value: "afternoon" },
      ],
    },
    {
      name: "siteName",
      label: "Site Name (Optional)",
      type: "text",
      placeholder: "Enter name",
      helperText: "Only for Outreach / Mobile",
    },
    {
      name: "vaccinationsGiven",
      label: "Vaccinations Given",
      type: "select",
      placeholder: "Select",
      options: [
        { label: "Polio", value: "polio" },
        { label: "Measles", value: "measles" },
      ],
    },
    {
      name: "ageAtVaccination",
      label: "Age at Vaccination",
      type: "text",
      placeholder: "Auto-calculated from Date of Birth",
      icon: <Calendar size={18} />,
      readOnly: true,
    },
    {
      name: "responsibleOfficer",
      label: "Responsible Officer",
      type: "text",
      placeholder: "Staff performing immunization",
    },
    {
      name: "reportingPeriod",
      label: "Reporting Period",
      type: "month",
      placeholder: "Month / Year",
    },
    {
      name: "notes",
      label: "Note (Optional)",
      type: "textarea",
      placeholder:
        "Any relevant notes (adverse reactions, follow-up required)...",
      colSpan: 2,
    },
  ];

  const handleSubmit = (data: Record<string, any>) => {
    console.log("Form Submitted:", data);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ReusableForm
        title="Register Child"
        headerIcon={<UserRoundPlus size={24} />}
        fields={registerFields}
        columns={2}
        submitLabel="Register Child"
        cancelLabel="Cancel"
        submitIcon={<Save size={18} />}
        onSubmit={handleSubmit}
        onCancel={() => console.log("Cancelled")}
      />
    </div>
  );
}
