export type DoctorDashboardLabStatus = "Ready" | "Pending" | "Processing" | "Urgent";
export type DoctorDashboardAlertSeverity = "High risk" | "Urgent" | "Awaiting" | "Ready";
export type DoctorDashboardConsultationStatus =
  | "In-consultation"
  | "Urgent"
  | "Waiting"
  | "Completed";

export type DoctorDashboardLabResult = {
  test: string;
  patient: string;
  time: string;
  status: DoctorDashboardLabStatus;
};

export type DoctorDashboardAlertItem = {
  title: string;
  subtitle: string;
  time: string;
  severity: DoctorDashboardAlertSeverity;
};

export type DoctorDashboardConsultationRow = {
  patientId: string;
  patientName: string;
  chiefComplaint: string;
  status: DoctorDashboardConsultationStatus;
  appointmentId: string;
  consultationId: string;
};

export type DoctorDashboardApiRecord = Record<string, unknown>;
