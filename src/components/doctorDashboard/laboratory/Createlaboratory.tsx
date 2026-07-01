"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Loader2,
  Save,
  Search,
  ChevronDown,
  X,
  Plus,
  Trash2,
} from "lucide-react";

import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import {
  useFacilityUsers,
  useLabEquipment,
  useAppointmentsSearch,
  useCreateLabRequest,
} from "@/src/hooks/doctors/use-lab-requests";

// --- Types & Constants ---
interface TestItem {
  id: string; // Used for React keys and mapping
  testName: string;
  linkedItem: string;
  sampleType: string;
}

interface LabRequestFormState {
  appointmentId: string;
  requestedBy: string;
  priority: string;
  clinicalNotes: string;
  tests: TestItem[];
}

const INITIAL_FORM: LabRequestFormState = {
  appointmentId: "",
  requestedBy: "",
  priority: "",
  clinicalNotes: "",
  tests: [
    { id: "1", testName: "", linkedItem: "", sampleType: "" }, // Start with one empty test
  ],
};

const PRIORITY_OPTIONS = [
  { label: "Normal", value: "NORMAL" },
  { label: "Urgent", value: "URGENT" },
  { label: "Stat", value: "STAT" },
];

const SAMPLE_TYPE_OPTIONS = [
  { label: "Blood", value: "Blood" },
  { label: "Urine", value: "Urine" },
  { label: "Stool", value: "Stool" },
  { label: "Swab", value: "Swab" },
  { label: "Other", value: "Other" },
];

// --- Shared UI Shells ---
function FieldShell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex flex-col justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F] ${className}`}
    >
      <label className="mb-1 block text-xs text-[#62636C]">{label}</label>
      {children}
    </div>
  );
}

function SelectField({
  label,
  placeholder,
  options,
  value,
  searchable = false,
  isLoading = false,
  onChange,
  onSearchChange,
  disabled = false,
}: {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  searchable?: boolean;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onSearchChange?: (term: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const displayOptions = onSearchChange
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      );
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearch(term);
    if (onSearchChange) onSearchChange(term);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((c) => !c)}
        className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F] ${disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : ""}`}
      >
        <span className="mb-1 block text-xs text-[#62636C]">{label}</span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span
            className={
              selectedLabel ? "text-gray-700 truncate" : "text-gray-400"
            }
          >
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            size={20}
            className={`text-gray-800 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
          {searchable && (
            <div className="relative mb-3 flex items-center">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900"
              />
              <input
                value={search}
                onChange={handleSearch}
                placeholder="Search..."
                className="h-11 w-full rounded-lg border border-gray-300 pl-12 pr-10 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
              />
              {isLoading && (
                <Loader2
                  size={16}
                  className="absolute right-4 animate-spin text-gray-400"
                />
              )}
            </div>
          )}
          <div className="max-h-60 overflow-y-auto pr-1">
            {displayOptions.length > 0 ? (
              displayOptions.map((option, index) => {
                const selected = value === option.value;
                return (
                  <button
                    key={`${option.value}-${index}`}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setSearch("");
                      if (onSearchChange) onSearchChange("");
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-4 rounded-md px-2 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${selected ? "border-[#046C3F] bg-[#046C3F]" : "border-gray-300 bg-white"}`}
                    >
                      {selected && (
                        <span className="h-2.5 w-2.5 rounded-sm bg-white" />
                      )}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })
            ) : (
              <div className="px-2 py-2 text-sm text-gray-500">
                {isLoading ? "Searching..." : "No results found"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SuccessToast({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex w-[min(390px,calc(100vw-2rem))] items-center gap-4 rounded border border-gray-200 bg-white px-5 py-3 shadow-sm">
      <span className="h-12 w-1 rounded-full bg-[#039855]" />
      <span className="h-6 w-6 rounded-lg border border-[#A8E6C4] bg-[#E8F7F0]" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">
          Lab Request Created
        </p>
        <p className="text-sm text-gray-600">
          The request was successfully submitted.
        </p>
      </div>
      <button
        onClick={onClose}
        className="border-l border-gray-100 pl-4 text-gray-900 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// --- Main Form Component ---
export default function LabRequestForm() {
  const router = useRouter();
  const [form, setForm] = useState<LabRequestFormState>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // Search Terms
  const [staffSearch, setStaffSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");

  // Queries
  const { data: staffData, isFetching: isLoadingStaff } =
    useFacilityUsers(staffSearch);
  const { data: itemData, isFetching: isLoadingItems } =
    useLabEquipment(itemSearch);
  const { data: appointmentData, isFetching: isLoadingAppointments } =
    useAppointmentsSearch(appointmentSearch);

  // Mutations
  const { mutate: createLabRequest, isPending: isCreating } =
    useCreateLabRequest();

  // Option Mappings
  const staffOptions = (staffData || []).map((staff: any) => ({
    label: `${staff.first_name} ${staff.last_name} (${staff.role})`,
    value: staff.id,
  }));

  const itemOptions = (itemData || []).map((item: any) => ({
    label: `${item.name} (${item.total_stock} in stock)`,
    value: item.id,
  }));

  const appointmentOptions = (appointmentData || []).map((apt: any) => ({
    label: `${apt.appointment_id} - ${apt.patient_name} (${apt.visit_type})`,
    value: apt.id,
  }));

  // Handlers
  const handleMainChange = <K extends keyof LabRequestFormState>(
    field: K,
    value: LabRequestFormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleTestChange = (
    id: string,
    field: keyof TestItem,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      tests: current.tests.map((test) =>
        test.id === id ? { ...test, [field]: value } : test,
      ),
    }));
    setFormError("");
  };

  const addTest = () => {
    setForm((current) => ({
      ...current,
      tests: [
        ...current.tests,
        {
          id: Date.now().toString(),
          testName: "",
          linkedItem: "",
          sampleType: "",
        },
      ],
    }));
  };

  const removeTest = (id: string) => {
    setForm((current) => ({
      ...current,
      tests: current.tests.filter((test) => test.id !== id),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.appointmentId || !form.priority) {
      setFormError("Please select the required Appointment and Priority.");
      return;
    }

    const hasEmptyTests = form.tests.some((t) => !t.testName || !t.sampleType);
    if (form.tests.length === 0 || hasEmptyTests) {
      setFormError("Please complete all fields for every added test.");
      return;
    }

    const payload: any = {
      appointment: form.appointmentId,
      priority: form.priority,
      clinical_notes: form.clinicalNotes,
      tests: form.tests.map((test) => ({
        test_name: test.testName,
        sample_type: test.sampleType,
        ...(test.linkedItem && { linked_item: test.linkedItem }),
      })),
    };

    if (form.requestedBy) {
      payload.requested_by = form.requestedBy;
    }

    createLabRequest(payload, {
      onSuccess: () => {
        setToastVisible(true);
        setTimeout(() => router.push("/doctor-dashboard/laboratory"), 2000);
      },
      onError: (error: any) => {
        setFormError(
          error?.response?.data?.message ||
            "Failed to submit lab request. Please try again.",
        );
      },
    });
  };

  const handleCancel = () => router.push("/doctor-dashboard/laboratory");

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Laboratory"
        breadcrumbs={[
          { label: "Laboratory", href: "/doctor-dashboard/laboratory" },
          { label: "New Request" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            New Lab Request
          </h2>
          <p className="text-base text-[#3F3F46]">
            Create and dispatch tests to the laboratory
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F7F0] text-[#046C3F]">
              <ClipboardList size={18} />
            </span>
            <h2 className="text-xl font-semibold text-black">
              Request Details
            </h2>
          </div>

          <div className="max-w-4xl space-y-8">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            {/* General Request Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SelectField
                label="Appointment"
                placeholder="Search Appointment"
                options={appointmentOptions}
                searchable
                isLoading={isLoadingAppointments}
                value={form.appointmentId}
                onChange={(val) => handleMainChange("appointmentId", val)}
                onSearchChange={setAppointmentSearch}
              />

              <SelectField
                label="Requested By (Optional)"
                placeholder="Search Facility Staff"
                options={staffOptions}
                searchable
                isLoading={isLoadingStaff}
                value={form.requestedBy}
                onChange={(val) => handleMainChange("requestedBy", val)}
                onSearchChange={setStaffSearch}
              />

              <SelectField
                label="Priority"
                placeholder="Select Priority"
                options={PRIORITY_OPTIONS}
                value={form.priority}
                onChange={(val) => handleMainChange("priority", val)}
              />
            </div>

            <FieldShell label="Clinical Notes">
              <textarea
                value={form.clinicalNotes}
                onChange={(e) =>
                  handleMainChange("clinicalNotes", e.target.value)
                }
                placeholder="Reason for test, suspected diagnosis..."
                rows={4}
                className="w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400 mt-1"
              />
            </FieldShell>

            {/* Dynamic Tests Section */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-black">
                  Test Parameters
                </h2>
                <button
                  type="button"
                  onClick={addTest}
                  className="flex items-center gap-2 text-sm font-medium text-[#046C3F] hover:text-[#035a34] bg-[#E8F7F0] px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Plus size={16} /> Add Test
                </button>
              </div>

              <div className="space-y-6">
                {form.tests.map((test, index) => (
                  <div
                    key={test.id}
                    className="relative grid grid-cols-1 gap-6 md:grid-cols-3 bg-gray-50 p-5 rounded-xl border border-gray-200"
                  >
                    {/* Only show delete button if there is more than one test */}
                    {form.tests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTest(test.id)}
                        className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 border border-red-100 shadow-sm hover:bg-red-100 transition-colors"
                        title="Remove Test"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <FieldShell label={`Test Name ${index + 1}`}>
                      <input
                        value={test.testName}
                        onChange={(e) =>
                          handleTestChange(test.id, "testName", e.target.value)
                        }
                        className="w-full bg-transparent text-base outline-none mt-1"
                        placeholder="e.g. Full Blood Count"
                      />
                    </FieldShell>

                    <SelectField
                      label="Linked Lab Equipment (Optional)"
                      placeholder="Search Equipment"
                      options={itemOptions}
                      searchable
                      isLoading={isLoadingItems}
                      value={test.linkedItem}
                      onChange={(val) =>
                        handleTestChange(test.id, "linkedItem", val)
                      }
                      onSearchChange={setItemSearch}
                    />

                    <SelectField
                      label="Sample Type"
                      placeholder="Select Sample"
                      options={SAMPLE_TYPE_OPTIONS}
                      value={test.sampleType}
                      onChange={(val) =>
                        handleTestChange(test.id, "sampleType", val)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-stretch justify-end gap-4 pt-8 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isCreating}
                className="h-14 rounded-xl bg-[#B9BDC9] px-12 text-lg font-medium text-white transition-colors hover:bg-[#A9AEBC] disabled:opacity-70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-8 text-lg font-medium text-white transition-colors hover:bg-[#035a34] disabled:opacity-70"
              >
                {isCreating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {isCreating ? "Submitting..." : "Send to Lab"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
