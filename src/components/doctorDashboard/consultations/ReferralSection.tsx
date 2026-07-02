"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  GitBranch,
  Loader2,
  Plus,
  Search,
  User,
} from "lucide-react";
import { useCreateReferral, useDepartments, useReferrals } from "@/src/hooks/nurses/use-referrals";
import { useFacilities } from "@/src/hooks/useFacilities";

// ─── Constants ────────────────────────────────────────────────────────────────

const REFERRAL_TYPE_OPTIONS = [
  { label: "Physical", value: "PHYSICAL" },
  { label: "Telemedicine", value: "TELEMEDICINE" },
  { label: "Emergency", value: "EMERGENCY" },
];

const DESTINATION_LEVEL_OPTIONS = [
  { label: "Primary Health Care (Internal)", value: "PRIMARY" },
  { label: "Secondary Health Care", value: "SECONDARY" },
  { label: "Higher Health Care", value: "HIGHER" },
  { label: "Other", value: "OTHER" },
];

const TRANSPORT_MODE_OPTIONS = [
  { label: "Private Vehicle", value: "PRIVATE" },
  { label: "Ambulance", value: "AMBULANCE" },
  { label: "Public Transportation", value: "PUBLIC" },
  { label: "Other", value: "OTHER" },
];

const REFERRAL_MODE_OPTIONS = [
  { label: "Softcopy (Email/Digital)", value: "SOFTCOPY" },
  { label: "Hardcopy (Physical Document)", value: "HARDCOPY" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#FFF4E5", text: "#B45309" },
  APPROVED: { bg: "#ECFDF5", text: "#065F46" },
  REJECTED: { bg: "#FEF2F2", text: "#991B1B" },
  COMPLETED: { bg: "#EFF6FF", text: "#1D4ED8" },
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SearchableSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  isLoading = false,
}: {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  isLoading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((c) => !c)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="mb-1 block text-xs text-[#62636C]">{label}</span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span className={selected ? "truncate text-gray-700" : "text-gray-400"}>
            {isLoading ? "Loading…" : selected?.label || placeholder}
          </span>
          <ChevronDown
            size={18}
            className={`shrink-0 text-gray-600 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white p-3 shadow-md">
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="h-9 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-[#046C3F]"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-sm text-gray-400">No options found.</p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setSearch("");
                    setOpen(false);
                  }}
                  className={`block w-full rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                    value === opt.value
                      ? "bg-[#E8F7F0] font-medium text-[#046C3F]"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FieldShell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F]">
      <label className="mb-1 block text-xs text-[#62636C]">{label}</label>
      {children}
    </div>
  );
}

// ─── Referral Form ────────────────────────────────────────────────────────────

type ReferralFormState = {
  destination_level: string;
  referral_type: string;
  mode_of_transportation: string;
  reason_for_referral: string;
  clinical_summary: string;
  receiving_facility: string;
  receiving_department: string;
  mode_of_referral: string;
  // Which single target the softcopy email goes to — a doctor XOR a
  // department, since the backend payload only supports one at a time.
  target_type: "" | "DOCTOR" | "DEPARTMENT";
  target_doctor_email: string;
  target_department_email: string;
  email_subject: string;
  email_body: string;
};

const EMPTY_FORM: ReferralFormState = {
  destination_level: "",
  referral_type: "",
  mode_of_transportation: "",
  reason_for_referral: "",
  clinical_summary: "",
  receiving_facility: "",
  receiving_department: "",
  mode_of_referral: "",
  target_type: "",
  target_doctor_email: "",
  target_department_email: "",
  email_subject: "",
  email_body: "",
};

function ReferralForm({
  appointmentId,
  onSuccess,
  onCancel,
}: {
  appointmentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ReferralFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const { data: facilitiesData, isLoading: isLoadingFacilities } = useFacilities({
    pageSize: 100,
    isActive: true,
  });
  const { data: departmentsData, isLoading: isLoadingDepartments } =
    useDepartments(form.receiving_facility);
  const { mutate: createReferral, isPending } = useCreateReferral();

  const facilityOptions = useMemo(() => {
    if (!facilitiesData?.results) return [];
    return facilitiesData.results.map((f) => ({ label: f.name, value: f.id }));
  }, [facilitiesData]);

  const departmentOptions = useMemo(() => {
    if (!departmentsData?.results) return [];
    return departmentsData.results.map((d: any) => ({ label: d.name, value: d.id }));
  }, [departmentsData]);

  const set = (field: keyof ReferralFormState, value: string) => {
    setForm((c) => ({ ...c, [field]: value }));
    setFormError("");
  };

  // Switching target keeps the two email fields mutually exclusive by
  // construction, so the payload can never carry both at once.
  const selectTargetType = (type: "DOCTOR" | "DEPARTMENT") => {
    setForm((c) => ({
      ...c,
      target_type: type,
      target_doctor_email: type === "DOCTOR" ? c.target_doctor_email : "",
      target_department_email:
        type === "DEPARTMENT" ? c.target_department_email : "",
    }));
    setFormError("");
  };

  const isTelemedicine = form.referral_type === "TELEMEDICINE";
  const isPrimary = form.destination_level === "PRIMARY";
  const isSoftcopy = form.mode_of_referral === "SOFTCOPY";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.destination_level ||
      !form.referral_type ||
      (!isTelemedicine && !form.mode_of_transportation) ||
      !form.reason_for_referral.trim()
    ) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (!isPrimary) {
      if (!form.mode_of_referral) {
        setFormError("Please select a mode of referral.");
        return;
      }
      if (isSoftcopy) {
        if (!form.target_type) {
          setFormError(
            "Please choose whether this referral is going to a doctor or a department.",
          );
          return;
        }
        const targetEmail =
          form.target_type === "DOCTOR"
            ? form.target_doctor_email
            : form.target_department_email;
        if (!targetEmail.trim()) {
          setFormError(
            form.target_type === "DOCTOR"
              ? "Please provide the target doctor's email."
              : "Please provide the target department's email.",
          );
          return;
        }
      }
    }

    createReferral(
      {
        appointment: appointmentId,
        destination_level: form.destination_level,
        referral_type: form.referral_type,
        mode_of_transportation: isTelemedicine ? null : form.mode_of_transportation,
        reason_for_referral: form.reason_for_referral,
        clinical_summary: form.clinical_summary,
        receiving_facility: null,
        receiving_department: isPrimary ? form.receiving_department : null,
        mode_of_referral: isPrimary ? null : form.mode_of_referral,
        // target_type keeps these mutually exclusive, but guard with
        // `|| null` too so a cleared/never-set field is never sent as "".
        target_doctor_email:
          !isPrimary && isSoftcopy && form.target_type === "DOCTOR"
            ? form.target_doctor_email || null
            : null,
        target_department_email:
          !isPrimary && isSoftcopy && form.target_type === "DEPARTMENT"
            ? form.target_department_email || null
            : null,
        email_subject: !isPrimary && isSoftcopy ? form.email_subject : "",
        email_body: !isPrimary && isSoftcopy ? form.email_body : "",
      } as any,
      {
        onSuccess: () => onSuccess(),
        onError: (err: any) => {
          setFormError(
            err?.response?.data?.message || "Failed to create referral.",
          );
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formError && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SearchableSelect
          label="Destination Level *"
          placeholder="Select level"
          options={DESTINATION_LEVEL_OPTIONS}
          value={form.destination_level}
          onChange={(v) => set("destination_level", v)}
        />
        <SearchableSelect
          label="Referral Type *"
          placeholder="Select type"
          options={REFERRAL_TYPE_OPTIONS}
          value={form.referral_type}
          onChange={(v) => set("referral_type", v)}
        />
        {!isTelemedicine && (
          <SearchableSelect
            label="Mode of Transportation *"
            placeholder="Select transport mode"
            options={TRANSPORT_MODE_OPTIONS}
            value={form.mode_of_transportation}
            onChange={(v) => set("mode_of_transportation", v)}
          />
        )}
      </div>

      {isPrimary && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <SearchableSelect
            label="Facility (to find department)"
            placeholder="Select facility"
            options={facilityOptions}
            value={form.receiving_facility}
            isLoading={isLoadingFacilities}
            onChange={(v) => set("receiving_facility", v)}
          />
          <SearchableSelect
            label="Receiving Department"
            placeholder="Select department"
            options={departmentOptions}
            value={form.receiving_department}
            isLoading={isLoadingDepartments}
            onChange={(v) => set("receiving_department", v)}
          />
        </div>
      )}

      {form.destination_level && !isPrimary && (
        <div className="space-y-5">
          <SearchableSelect
            label="Mode of Referral *"
            placeholder="Select mode"
            options={REFERRAL_MODE_OPTIONS}
            value={form.mode_of_referral}
            onChange={(v) => {
              set("mode_of_referral", v);
              if (v !== "SOFTCOPY") {
                // Hardcopy referrals hand off a physical document — there's
                // no email target, so clear any prior choice.
                setForm((c) => ({
                  ...c,
                  target_type: "",
                  target_doctor_email: "",
                  target_department_email: "",
                  email_subject: "",
                  email_body: "",
                }));
              }
            }}
          />

          {isSoftcopy && (
            <>
              <div>
                <p className="mb-2 text-xs text-[#62636C]">Refer To *</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => selectTargetType("DOCTOR")}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                      form.target_type === "DOCTOR"
                        ? "border-[#046C3F] bg-[#E8F7F0] text-[#046C3F]"
                        : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <User size={16} />A Specific Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => selectTargetType("DEPARTMENT")}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                      form.target_type === "DEPARTMENT"
                        ? "border-[#046C3F] bg-[#E8F7F0] text-[#046C3F]"
                        : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Building2 size={16} />A Department
                  </button>
                </div>
              </div>

              {form.target_type === "DOCTOR" && (
                <FieldShell label="Target Doctor Email *">
                  <input
                    type="email"
                    value={form.target_doctor_email}
                    onChange={(e) => set("target_doctor_email", e.target.value)}
                    placeholder="dr.smith@example.com"
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </FieldShell>
              )}

              {form.target_type === "DEPARTMENT" && (
                <FieldShell label="Target Department Email *">
                  <input
                    type="email"
                    value={form.target_department_email}
                    onChange={(e) =>
                      set("target_department_email", e.target.value)
                    }
                    placeholder="surgery@example.com"
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  />
                </FieldShell>
              )}

              {form.target_type && (
                <>
                  <FieldShell label="Email Subject">
                    <input
                      type="text"
                      value={form.email_subject}
                      onChange={(e) => set("email_subject", e.target.value)}
                      placeholder="Emergency Surgical Transfer…"
                      className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>
                  <FieldShell label="Email Body">
                    <textarea
                      value={form.email_body}
                      onChange={(e) => set("email_body", e.target.value)}
                      placeholder="Provide details for the receiving end…"
                      rows={3}
                      className="w-full resize-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />
                  </FieldShell>
                </>
              )}
            </>
          )}
        </div>
      )}

      <FieldShell label="Reason for Referral *">
        <textarea
          value={form.reason_for_referral}
          onChange={(e) => set("reason_for_referral", e.target.value)}
          placeholder="Detailed reason for this referral…"
          rows={3}
          className="w-full resize-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
      </FieldShell>

      <FieldShell label="Clinical Summary (Optional)">
        <textarea
          value={form.clinical_summary}
          onChange={(e) => set("clinical_summary", e.target.value)}
          placeholder="Current medications, additional observations…"
          rows={2}
          className="w-full resize-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
        />
      </FieldShell>

      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="h-10 rounded-lg bg-gray-100 px-6 text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex h-10 items-center gap-2 rounded-lg bg-[#046C3F] px-6 text-sm font-medium text-white hover:bg-[#035a34] disabled:opacity-70"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? "Submitting…" : "Submit Referral"}
        </button>
      </div>
    </form>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function ReferralSection({ appointmentId }: { appointmentId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: referralsData, refetch } = useReferrals({ appointment_id: appointmentId, page_size: 10 });
  const existingReferrals: any[] = (referralsData as any)?.results || [];

  const handleSuccess = () => {
    setShowForm(false);
    setSubmitted(true);
    refetch();
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <GitBranch size={18} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-black">Referral</h2>
            {existingReferrals.length > 0 && (
              <p className="text-xs text-gray-500">
                {existingReferrals.length} referral{existingReferrals.length !== 1 ? "s" : ""} for this appointment
              </p>
            )}
          </div>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg border border-orange-300 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors"
          >
            <Plus size={16} /> Create Referral
          </button>
        )}
      </div>

      {submitted && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-[#046C3F]">
          <CheckCircle2 size={16} />
          Referral submitted successfully.
        </div>
      )}

      {/* Existing referrals */}
      {existingReferrals.length > 0 && (
        <div className="mb-6 space-y-2">
          {existingReferrals.map((ref: any) => {
            const color = STATUS_COLORS[ref.status] || { bg: "#F3F4F6", text: "#374151" };
            return (
              <div
                key={ref.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {ref.destination_level} — {ref.referral_type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ref.reason_for_referral?.slice(0, 60)}
                    {ref.reason_for_referral?.length > 60 ? "…" : ""}
                  </p>
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: color.bg, color: color.text }}
                >
                  {ref.status}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {!showForm && existingReferrals.length === 0 && (
        <p className="mb-5 text-sm text-gray-400">
          No referrals for this appointment yet.
        </p>
      )}

      {/* Referral form */}
      {showForm && (
        <div className="rounded-xl border border-orange-100 bg-orange-50/20 p-5">
          <p className="mb-4 text-sm font-semibold text-gray-700">New Referral</p>
          <ReferralForm
            appointmentId={appointmentId}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}
