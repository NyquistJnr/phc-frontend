"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Pill,
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
import { useMyAppointments } from "@/src/hooks/doctors/use-consultation";
import {
  useCreatePrescription,
  useInventoryDrugs,
} from "@/src/hooks/doctors/use-prescriptions";
import type {
  MyAppointment,
  PaginatedResponse,
} from "@/src/components/doctorDashboard/consultations/types";

interface MedicationItem {
  id: string;
  inventory_item: string;
  inventory_item_label: string;
  custom_drug_name: string;
  quantity: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  special_instructions: string;
}

const EMPTY_MEDICATION_FIELDS = {
  inventory_item: "",
  inventory_item_label: "",
  custom_drug_name: "",
  quantity: "1",
  dosage: "",
  frequency: "",
  duration: "",
  route: "",
  special_instructions: "",
};

interface PrescriptionFormState {
  appointmentId: string;
  priority: string;
  instructions: string;
  items: MedicationItem[];
}

const INITIAL_FORM: PrescriptionFormState = {
  appointmentId: "",
  priority: "",
  instructions: "",
  items: [{ id: "1", ...EMPTY_MEDICATION_FIELDS }],
};

const PRIORITY_OPTIONS = [
  { label: "Normal", value: "NORMAL" },
  { label: "Urgent", value: "URGENT" },
  { label: "Critical", value: "CRITICAL" },
];

const FREQUENCY_OPTIONS = [
  { label: "Once daily", value: "Once daily" },
  { label: "Twice daily", value: "Twice daily" },
  { label: "Three times daily", value: "Three times daily" },
  { label: "Every 8 hours", value: "Every 8 hours" },
  { label: "Every 12 hours", value: "Every 12 hours" },
];

const ROUTE_OPTIONS = [
  { label: "Oral", value: "Oral" },
  { label: "Intravenous", value: "Intravenous" },
  { label: "Intramuscular", value: "Intramuscular" },
  { label: "Topical", value: "Topical" },
  { label: "Subcutaneous", value: "Subcutaneous" },
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
  allowCustom = false,
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
  // Lets the user type a value that isn't in the list and use it as-is,
  // for fields whose options are just common presets, not an exhaustive set.
  allowCustom?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const isSearchable = searchable || allowCustom;
  const trimmedSearch = search.trim();

  const displayOptions = onSearchChange
    ? options
    : options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      );
  // A custom value won't be found among the preset options — fall back to
  // showing the raw value itself so the trigger doesn't look empty.
  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ||
    (allowCustom ? value : undefined);
  const showAddCustom =
    allowCustom &&
    trimmedSearch.length > 0 &&
    !isLoading &&
    displayOptions.length === 0;

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
          {isSearchable && (
            <div className="relative mb-3 flex items-center">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900"
              />
              <input
                value={search}
                onChange={handleSearch}
                placeholder={
                  allowCustom ? "Search or type your own..." : "Search..."
                }
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
          <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
            {/* Added a clear option for non-required fields like inventory item */}
            <button
              type="button"
              onClick={() => {
                onChange("");
                setSearch("");
                if (onSearchChange) onSearchChange("");
                setOpen(false);
              }}
              className="flex w-full items-center gap-4 rounded-md px-2 py-2.5 text-left text-sm text-gray-500 hover:bg-gray-50 italic"
            >
              <span className="w-6" />
              <span>None / Clear Selection</span>
            </button>
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
            ) : !showAddCustom ? (
              <div className="px-2 py-2 text-sm text-gray-500">
                {isLoading ? "Searching..." : "No results found"}
              </div>
            ) : null}

            {showAddCustom && (
              <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50/60 p-3">
                <p className="mb-2 text-xs text-amber-700">
                  &ldquo;{trimmedSearch}&rdquo; isn&apos;t one of the presets.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onChange(trimmedSearch);
                    setSearch("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-left text-sm font-medium text-[#046C3F] shadow-sm transition-colors hover:bg-[#F0FAF5]"
                >
                  <Plus size={14} /> Use &ldquo;{trimmedSearch}&rdquo;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// A drug field that only reveals "custom drug name" once a search has come up
// empty against the inventory — so free-text entry is a fallback, not a
// parallel default path.
function DrugComboBox({
  label,
  inventoryItemId,
  inventoryItemLabel,
  customDrugName,
  onSelectInventory,
  onSelectCustom,
  onClear,
}: {
  label: string;
  inventoryItemId: string;
  inventoryItemLabel: string;
  customDrugName: string;
  onSelectInventory: (id: string, label: string) => void;
  onSelectCustom: (name: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: inventoryData, isFetching: isLoading } =
    useInventoryDrugs(debouncedSearch);

  const options: { value: string; label: string }[] = (
    inventoryData || []
  ).map((drug: any) => ({
    value: drug.id as string,
    label: `${drug.name} (${drug.total_stock} in stock)`,
  }));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const isCustom = !inventoryItemId && !!customDrugName;
  const hasSelection = !!inventoryItemId || isCustom;
  const displayLabel = inventoryItemId ? inventoryItemLabel : customDrugName;
  const hasSearched = debouncedSearch.length > 0;
  const showAddCustom = hasSearched && !isLoading && options.length === 0;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left focus:border-[#046C3F] focus:outline-none focus:ring-1 focus:ring-[#046C3F]"
      >
        <span className="mb-1 flex items-center justify-between gap-2 text-xs text-[#62636C]">
          <span>{label}</span>
          {isCustom && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              Custom — not in inventory
            </span>
          )}
        </span>
        <span className="flex items-center justify-between gap-3 text-base">
          <span
            className={hasSelection ? "truncate text-gray-700" : "text-gray-400"}
          >
            {displayLabel || "Search medication by name..."}
          </span>
          <ChevronDown
            size={20}
            className={`shrink-0 text-gray-800 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-gray-300 bg-white p-4 shadow-md">
          <div className="relative mb-3 flex items-center">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Type to search the drug inventory..."
              className="h-11 w-full rounded-lg border border-gray-300 pl-11 pr-10 text-sm outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
            />
            {isLoading && (
              <Loader2
                size={16}
                className="absolute right-4 animate-spin text-gray-400"
              />
            )}
          </div>

          {hasSelection && (
            <button
              type="button"
              onClick={() => {
                onClear();
                setSearch("");
                setOpen(false);
              }}
              className="mb-2 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm italic text-gray-500 hover:bg-gray-50"
            >
              <X size={14} /> Clear selection
            </button>
          )}

          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            {options.length > 0
              ? options.map((option) => {
                  const selected = inventoryItemId === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onSelectInventory(option.value, option.label);
                        setSearch("");
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
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
              : !hasSearched && (
                  <div className="px-2 py-3 text-sm text-gray-400">
                    {isLoading
                      ? "Loading inventory..."
                      : "Start typing to search the drug inventory."}
                  </div>
                )}

            {showAddCustom && (
              <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50/60 p-3">
                <p className="mb-2 text-xs text-amber-700">
                  &ldquo;{debouncedSearch}&rdquo; isn&apos;t in the inventory.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCustom(debouncedSearch);
                    setSearch("");
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md bg-white px-3 py-2 text-left text-sm font-medium text-[#046C3F] shadow-sm transition-colors hover:bg-[#F0FAF5]"
                >
                  <Plus size={14} /> Prescribe &ldquo;{debouncedSearch}&rdquo; as
                  a custom drug
                </button>
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
          Prescription Created
        </p>
        <p className="text-sm text-gray-600">
          The prescription was successfully submitted.
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
export default function CreatePrescription() {
  const router = useRouter();
  const [form, setForm] = useState<PrescriptionFormState>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // Search Terms
  const [appointmentSearch, setAppointmentSearch] = useState("");

  // Queries
  const { data: appointmentsRawData, isFetching: isLoadingAppointments } =
    useMyAppointments({ search: appointmentSearch });

  // Mutations
  const { mutate: createPrescription, isPending: isCreating } =
    useCreatePrescription();

  // Option Mappings
  const appointments = useMemo(() => {
    const payload = appointmentsRawData as
      | PaginatedResponse<MyAppointment>
      | MyAppointment[]
      | undefined;
    return Array.isArray(payload) ? payload : payload?.results || [];
  }, [appointmentsRawData]);

  const appointmentOptions = appointments.map((apt) => ({
    label: `${apt.appointment_id || ""} - ${apt.patient_name || "Unknown Patient"} (${apt.visit_type || "Visit"})`,
    value: apt.id,
  }));

  // Handlers
  const handleMainChange = <K extends keyof PrescriptionFormState>(
    field: K,
    value: PrescriptionFormState[K],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  };

  const handleMedicationChange = (
    id: string,
    field: keyof MedicationItem,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
    setFormError("");
  };

  const updateMedicationFields = (id: string, patch: Partial<MedicationItem>) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
    setFormError("");
  };

  const addMedication = () => {
    setForm((current) => ({
      ...current,
      items: [
        ...current.items,
        { id: Date.now().toString(), ...EMPTY_MEDICATION_FIELDS },
      ],
    }));
  };

  const removeMedication = (id: string) => {
    setForm((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedAptObj = appointments.find(
      (a) => a.id === form.appointmentId,
    );
    if (!form.appointmentId || !selectedAptObj?.patient) {
      setFormError("Please select a valid Appointment with a linked patient.");
      return;
    }
    if (!form.priority) {
      setFormError("Please select the priority for this prescription.");
      return;
    }

    const hasIncompleteItems = form.items.some(
      (item) =>
        (!item.inventory_item && !item.custom_drug_name) ||
        !item.dosage ||
        !item.frequency ||
        !item.duration,
    );

    if (form.items.length === 0 || hasIncompleteItems) {
      setFormError(
        "Please complete all required fields (Drug, Dosage, Frequency, Duration) for every medication.",
      );
      return;
    }

    const hasInvalidQuantity = form.items.some(
      (item) => !item.quantity || Number(item.quantity) <= 0,
    );

    if (hasInvalidQuantity) {
      setFormError("Please enter a valid quantity for every medication.");
      return;
    }

    const payload: any = {
      patient: selectedAptObj.patient,
      appointment: form.appointmentId,
      priority: form.priority,
      instructions: form.instructions,
      items: form.items.map((item) => {
        const itemPayload: any = {
          quantity: Number(item.quantity) || 1,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          route: item.route || undefined,
          special_instructions: item.special_instructions || undefined,
        };

        // Enforce the API logic: use inventory_item if selected, else custom_drug_name
        if (item.inventory_item) {
          itemPayload.inventory_item = item.inventory_item;
        } else {
          itemPayload.custom_drug_name = item.custom_drug_name;
        }

        return itemPayload;
      }),
    };

    createPrescription(payload, {
      onSuccess: (response: any) => {
        setToastVisible(true);
        const createdId =
          response?.data?.data?.id || response?.data?.id || response?.id;
        setTimeout(() => {
          router.push(
            createdId
              ? `/doctor-dashboard/prescriptions/${createdId}`
              : "/doctor-dashboard/prescriptions",
          );
        }, 2000);
      },
      onError: (error: any) => {
        setFormError(
          error?.response?.data?.message ||
            error?.response?.data?.detail ||
            "Failed to submit prescription. Please try again.",
        );
      },
    });
  };

  const handleCancel = () => router.push("/doctor-dashboard/prescriptions");

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Prescriptions"
        breadcrumbs={[
          { label: "Prescriptions", href: "/doctor-dashboard/prescriptions" },
          { label: "Create Prescription" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <NurseBackButton onClick={handleCancel} />

        <div className="mb-7">
          <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
            New Prescription
          </h2>
          <p className="text-base text-[#3F3F46]">
            Dispense medications and issue custom prescriptions
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-100 bg-white px-5 py-7 shadow-sm sm:px-6 lg:px-8"
        >
          <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F7F0] text-[#046C3F]">
              <Pill size={18} />
            </span>
            <h2 className="text-xl font-semibold text-black">
              Prescription Details
            </h2>
          </div>

          <div className="max-w-5xl space-y-8">
            {formError && (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            {/* General Prescription Info */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SelectField
                label="Appointment *"
                placeholder="Search Appointment"
                options={appointmentOptions}
                searchable
                isLoading={isLoadingAppointments}
                value={form.appointmentId}
                onChange={(val) => handleMainChange("appointmentId", val)}
                onSearchChange={setAppointmentSearch}
              />

              <SelectField
                label="Priority *"
                placeholder="Select Priority"
                options={PRIORITY_OPTIONS}
                value={form.priority}
                onChange={(val) => handleMainChange("priority", val)}
              />
            </div>

            <FieldShell label="General Instructions (Optional)">
              <textarea
                value={form.instructions}
                onChange={(e) =>
                  handleMainChange("instructions", e.target.value)
                }
                placeholder="Any overarching instructions for the pharmacist or patient..."
                rows={3}
                className="mt-1 w-full resize-none bg-transparent text-base text-gray-700 outline-none placeholder:text-gray-400"
              />
            </FieldShell>

            {/* Dynamic Medications Section */}
            <div className="mt-8 border-t border-gray-100 pt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-black">
                  Medications
                </h2>
                <button
                  type="button"
                  onClick={addMedication}
                  className="flex items-center gap-2 rounded-lg bg-[#E8F7F0] px-3 py-1.5 text-sm font-medium text-[#046C3F] transition-colors hover:bg-[#d1f0e1]"
                >
                  <Plus size={16} /> Add Drug
                </button>
              </div>

              <div className="space-y-6">
                {form.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative grid grid-cols-1 gap-6 rounded-xl border border-gray-200 bg-gray-50 p-5 md:grid-cols-3"
                  >
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(item.id)}
                        className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500 shadow-sm transition-colors hover:bg-red-100"
                        title="Remove Medication"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <div className="col-span-1 space-y-6 md:col-span-3 lg:col-span-1">
                      <DrugComboBox
                        label={`Medication ${index + 1} *`}
                        inventoryItemId={item.inventory_item}
                        inventoryItemLabel={item.inventory_item_label}
                        customDrugName={item.custom_drug_name}
                        onSelectInventory={(id, label) =>
                          updateMedicationFields(item.id, {
                            inventory_item: id,
                            inventory_item_label: label,
                            custom_drug_name: "",
                          })
                        }
                        onSelectCustom={(name) =>
                          updateMedicationFields(item.id, {
                            custom_drug_name: name,
                            inventory_item: "",
                            inventory_item_label: "",
                          })
                        }
                        onClear={() =>
                          updateMedicationFields(item.id, {
                            inventory_item: "",
                            inventory_item_label: "",
                            custom_drug_name: "",
                          })
                        }
                      />
                    </div>

                    <div className="col-span-1 grid grid-cols-1 gap-6 md:col-span-2 lg:col-span-2 md:grid-cols-2">
                      <FieldShell label="Dosage *">
                        <input
                          value={item.dosage}
                          onChange={(e) =>
                            handleMedicationChange(
                              item.id,
                              "dosage",
                              e.target.value,
                            )
                          }
                          className="mt-1 w-full bg-transparent text-base outline-none"
                          placeholder="e.g. 2 Tablets, 10ml"
                        />
                      </FieldShell>

                      <FieldShell label="Quantity to Dispense *">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleMedicationChange(
                              item.id,
                              "quantity",
                              e.target.value,
                            )
                          }
                          className="mt-1 w-full bg-transparent text-base outline-none"
                          placeholder="e.g. 20"
                        />
                      </FieldShell>

                      <SelectField
                        label="Frequency *"
                        placeholder="Select or type Frequency"
                        options={FREQUENCY_OPTIONS}
                        value={item.frequency}
                        allowCustom
                        onChange={(val) =>
                          handleMedicationChange(item.id, "frequency", val)
                        }
                      />

                      <FieldShell label="Duration *">
                        <input
                          value={item.duration}
                          onChange={(e) =>
                            handleMedicationChange(
                              item.id,
                              "duration",
                              e.target.value,
                            )
                          }
                          className="mt-1 w-full bg-transparent text-base outline-none"
                          placeholder="e.g. 5 Days, 2 Weeks"
                        />
                      </FieldShell>

                      <SelectField
                        label="Route (Optional)"
                        placeholder="Select Route"
                        options={ROUTE_OPTIONS}
                        value={item.route}
                        onChange={(val) =>
                          handleMedicationChange(item.id, "route", val)
                        }
                      />

                      <div className="md:col-span-2">
                        <FieldShell label="Special Instructions (Optional)">
                          <input
                            value={item.special_instructions}
                            onChange={(e) =>
                              handleMedicationChange(
                                item.id,
                                "special_instructions",
                                e.target.value,
                              )
                            }
                            className="mt-1 w-full bg-transparent text-base outline-none"
                            placeholder="e.g. Take after meals"
                          />
                        </FieldShell>
                      </div>
                    </div>
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
                {isCreating ? "Submitting..." : "Create Prescription"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toastVisible && <SuccessToast onClose={() => setToastVisible(false)} />}
    </div>
  );
}
