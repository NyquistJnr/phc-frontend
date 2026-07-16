export interface EpisodeResult {
  id: string;
  episode_id: string;
  patient: string;
  patient_name: string;
  patient_display_id: string;
  status: "ACTIVE" | "DELIVERED" | "CLOSED" | "MISCARRIAGE";
  last_menstrual_period: string;
  expected_date_of_delivery: string;
  gravida: number;
  parity: number;
  living_children: number;
  partner_name: string;
  partner_phone: string;
  created_at: string;
}

export interface EpisodesResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: EpisodeResult[];
}

export interface EpisodeFilters {
  page?: number;
  page_size?: number;
  status?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreateEpisodePayload {
  patient: string;
  status: "ACTIVE" | "DELIVERED" | "CLOSED" | "MISCARRIAGE";
  last_menstrual_period: string;
  expected_date_of_delivery: string;
  gravida: number;
  parity: number;
  living_children: number;
  partner_name: string;
  partner_phone: string;
}

export interface AncVisitResult {
  id: string;
  appointment_date: string;
  attendance_type: "NEW" | "RETURN";
  hiv_status: string;
  vdrl_syphilis: string;
  hepatitis_b: string;
  hemoglobin: string;
  urinalysis: string;
  tt_dose_given: string;
  iptp_dose_given: string;
  iron_folate_given: boolean;
  risk_factors: string;
  notes: string;
  episode: string;
  appointment: string;
  created_at: string;
}

export interface PncNewbornAssessment {
  id: string;
  pnc_visit: string;
  baby: string;
  baby_name: string;
  baby_display_id: string;
  cord_care_assessed: boolean;
  temperature: string;
  exclusive_breastfeeding: string;
  newborn_danger_signs: string;
  neonatal_jaundice: boolean;
  first_dose_antibiotics_given: boolean;
  kmc_provided: boolean;
  outcome: string;
}

export interface PncVisitResult {
  id: string;
  episode: string;
  appointment: string;
  appointment_date: string;
  attendance_type: "NEW" | "RETURN";
  timing_of_visit: string;
  vaginal_examination_conducted: boolean;
  hemoglobin_pcv: string;
  urinalysis: string;
  counselling_topics: string;
  outcome: "TREATED" | "ADMITTED" | "REFERRED";
  referral_reason: string;
  newborn_assessments: PncNewbornAssessment[];
  created_at: string;
}

export interface AncVisitsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: AncVisitResult[];
}

export interface PncVisitsResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: PncVisitResult[];
}

export interface DeliveryResult {
  id: string;
  delivery_date: string;
  child_name: string;
  mother_name: string;
  delivery_mode: string;
  birth_status: string;
  sex: string;
  episode_id?: string;
  episode_uuid?: string;
  birth_weight?: string;
  apgar_score_1min?: string;
  apgar_score_5min?: string;
  complications?: string;
  notes?: string;
}

export interface DeliveriesResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: DeliveryResult[];
}

export interface DeliveryFilters {
  episode_id: string;
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
}

export interface MaternalVisitFilters {
  episode_id: string;
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  attendance_type?: string;
  outcome?: string;
}

export type CareTab = "anc" | "delivery" | "pnc";
export type Mode = "list" | "ancForm" | "pncForm";
export type MaternalForm = Record<string, string>;

export const ATTENDANCE_TYPES = ["All Types", "NEW", "RETURN"];
export const TABLE_OUTCOME_OPTIONS = [
  "All Outcomes",
  "TREATED",
  "ADMITTED",
  "REFERRED",
];

export const SELECT_OPTIONS = ["Select", "New (N)", "Return (R)"];
export const YES_NO_OPTIONS = ["Select", "Yes", "No"];
export const BLOOD_GROUP_OPTIONS = [
  "Select blood group",
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];
export const GENOTYPE_OPTIONS = ["Select genotype", "AA", "AS", "SS", "AC"];
export const FORM_OUTCOME_OPTIONS = [
  "Select",
  "No Treatment (NT)",
  "Treated",
  "Admitted",
  "Referred Out",
];
export const TRANSPORT_OPTIONS = ["Select", "Ambulance", "Others"];

export const INITIAL_FORM: MaternalForm = {
  patientName: "",
  facility: "Ikeja PHC",
  patientId: "",
  encounterId: "",
  patientAge: "",
  attendanceType: "",
  encounterDate: "",
  cardNumber: "",
  lmp: "",
  edd: "",
  gravida: "",
  parity: "",
  livingChildren: "",
  height: "",
  weight: "",
  bloodPressure: "",
  bmi: "Auto-Calculated",
  bloodGroup: "",
  genotype: "",
  hivStatus: "",
  vdrl: "",
  hepatitisB: "",
  hemoglobin: "",
  urinalysis: "",
  tt1: "",
  ipt1: "",
  ironFolate: "",
  riskFactors: "",
  allergies: "",
  additionalNotes: "",
  ward: "Auto-filled",
  lga: "Auto-filled",
  state: "Auto-filled",
  pncDate: "",
  ageGroup: "Auto-calculated e.g 20-34 / 35-49 / ≥50",
  timing: "",
  visitType: "",
  associatedProblems: "",
  vaginalExam: "",
  nutritionCounselling: "",
  fpCounselling: "",
  fgmCounselling: "",
  infectionCounselling: "",
  babySex: "",
  breastfeeding: "",
  complementaryFeeding: "",
  newbornDangerSigns: "",
  firstAntibiotics: "",
  neonatalTetanus: "",
  neonatalJaundice: "",
  kmcProvided: "",
  outcome: "",
  responsibleOfficer: "",
  referralReason: "",
  transportOut: "",
  createdAt: "",
};

export interface AncVisitResult {
  id: string;
  appointment_date: string;
  attendance_type: "NEW" | "RETURN";
  hiv_status: string;
  vdrl_syphilis: string;
  hepatitis_b: string;
  hemoglobin: string;
  urinalysis: string;
  tt_dose_given: string;
  iptp_dose_given: string;
  iron_folate_given: boolean;
  risk_factors: string;
  notes: string;
  episode: string;
  appointment: string;
  created_at: string;
}

export interface PncVisitResult {
  id: string;
  episode: string;
  appointment: string;
  appointment_date: string;
  attendance_type: "NEW" | "RETURN";
  timing_of_visit: string;
  vaginal_examination_conducted: boolean;
  hemoglobin_pcv: string;
  urinalysis: string;
  counselling_topics: string;
  outcome: "TREATED" | "ADMITTED" | "REFERRED";
  referral_reason: string;
  newborn_assessments: PncNewbornAssessment[];
  created_at: string;
}

export interface AncPayloadForm {
  attendance_type: string;
  appointment: string;
  hiv_status: string;
  vdrl_syphilis: string;
  hepatitis_b: string;
  hemoglobin: string;
  urinalysis: string;
  tt_dose_given: string;
  iptp_dose_given: string;
  iron_folate_given: string;
  risk_factors: string;
  notes: string;
}

export interface EpisodeBaby {
  id: string;
  patient_display_id: string;
  full_name: string;
  sex: string;
  date_of_birth: string;
}
