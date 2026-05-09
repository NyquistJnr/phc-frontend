export type LabRequestStatus = "Pending" | "In-Progress" | "Completed";
export type LabResultStatus = "Ready" | "Processing";
export type LabPriority = "Routine" | "Urgent";

export type LabRequestRow = {
  requestId: string;
  patientId: string;
  patientName: string;
  testType: string;
  requestedBy: string;
  priority: LabPriority;
  date: string;
  status: LabRequestStatus;
};

export type LabResultRow = {
  requestId: string;
  patientId: string;
  patientName: string;
  labTests: string;
  result: string;
  date: string;
  status: LabResultStatus;
};

export const LAB_REQUESTS: LabRequestRow[] = [
  ["Musa Abdullahi", "Hepatitis B", "Dr. Garcia", "Routine", "2026-03-30", "Pending"],
  ["Amina Yusuf", "Urinalysis", "Dr. Reyes", "Urgent", "2026-03-29", "Completed"],
  ["Fatima Ibrahim", "Malaria Smear", "Dr. Lim", "Routine", "2026-03-28", "In-Progress"],
  ["Bayo Ogunleye", "Lipid Profile", "Dr. Lim", "Routine", "2026-03-27", "In-Progress"],
  ["Bayo Ogunleye", "Lipid Profile", "Dr. Lim", "Routine", "2026-03-26", "Pending"],
  ["Bayo Ogunleye", "Fasting Blood Sugar", "Dr. Lim", "Routine", "2026-03-25", "In-Progress"],
  ["Bayo Ogunleye", "Urinalysis", "Dr. Lim", "Urgent", "2026-03-24", "Completed"],
  ["Bayo Ogunleye", "Urinalysis", "Dr. Lim", "Urgent", "2026-03-23", "Completed"],
  ["Bayo Ogunleye", "Urinalysis", "Dr. Lim", "Routine", "2026-03-22", "Pending"],
  ["Bayo Ogunleye", "Urinalysis", "Dr. Lim", "Routine", "2026-03-21", "In-Progress"],
].map(([patientName, testType, requestedBy, priority, date, status]) => ({
  requestId: "LAB-PLT-000234",
  patientId: "PAT-PLT-000234",
  patientName,
  testType,
  requestedBy,
  priority: priority as LabPriority,
  date,
  status: status as LabRequestStatus,
}));

export const LAB_RESULTS: LabResultRow[] = [
  ["Musa Abdullahi", "Fasting Blood Sugar", "POSITIVE (P.f)", "2026-03-30", "Ready"],
  ["Amina Yusuf", "Hemoglobin", "---", "2026-03-29", "Processing"],
  ["Fatima Ibrahim", "Malaria RDT", "Normal", "2026-03-28", "Ready"],
  ["Bayo Ogunleye", "Full Blood Count", "Normal", "2026-03-27", "Ready"],
  ["Bayo Ogunleye", "Widal test", "O: 1/160 (high)", "2026-03-26", "Ready"],
  ["Bayo Ogunleye", "Urinalysis", "142 mg/dL", "2026-03-25", "Ready"],
  ["Bayo Ogunleye", "Urinalysis", "---", "2026-03-24", "Processing"],
  ["Bayo Ogunleye", "Urinalysis", "---", "2026-03-23", "Processing"],
  ["Bayo Ogunleye", "Urinalysis", "9.2 g/dL", "2026-03-22", "Ready"],
  ["Bayo Ogunleye", "Urinalysis", "9.2 g/dL", "2026-03-21", "Ready"],
].map(([patientName, labTests, result, date, status]) => ({
  requestId: "LAB-PLT-000234",
  patientId: "PAT-PLT-000234",
  patientName,
  labTests,
  result,
  date,
  status: status as LabResultStatus,
}));

export const labBadgeColors = {
  Routine: { bg: "#E2E7FF", text: "#046C3F" },
  Urgent: { bg: "#FDE8E8", text: "#F33131" },
  Pending: { bg: "#FFF4E5", text: "#1F2937" },
  "In-Progress": { bg: "#E2E7FF", text: "#046C3F" },
  Completed: { bg: "#DFF3EA", text: "#039855" },
  Ready: { bg: "#DFF3EA", text: "#039855" },
  Processing: { bg: "#FFF4E5", text: "#1F2937" },
};
