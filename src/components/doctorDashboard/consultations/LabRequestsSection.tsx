"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  FlaskConical,
  Loader2,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import {
  useLabRequestsByAppointment,
  useCreateLabRequest,
  useLabEquipment,
} from "@/src/hooks/doctors/use-lab-requests";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TestRow {
  id: string;
  testName: string;
  linkedItem: string;
  sampleType: string;
}

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

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "#FFF4E5", text: "#B45309" },
  IN_PROGRESS: { bg: "#EFF6FF", text: "#1D4ED8" },
  COMPLETED: { bg: "#ECFDF5", text: "#065F46" },
  CANCELLED: { bg: "#FEF2F2", text: "#991B1B" },
};

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SelectField({
  label,
  placeholder,
  options,
  value,
  searchable = false,
  isLoading = false,
  onChange,
  onSearchChange,
}: {
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
  value: string;
  searchable?: boolean;
  isLoading?: boolean;
  onChange: (value: string) => void;
  onSearchChange?: (term: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const displayOptions = onSearchChange
    ? options
    : options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = options.find((o) => o.value === value)?.label;

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
          <span className={selectedLabel ? "text-gray-700 truncate" : "text-gray-400"}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            size={18}
            className={`shrink-0 text-gray-600 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white p-3 shadow-md">
          {searchable && (
            <div className="relative mb-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  onSearchChange?.(e.target.value);
                }}
                placeholder="Search..."
                className="h-9 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-[#046C3F]"
              />
              {isLoading && (
                <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
              )}
            </div>
          )}
          <div className="max-h-48 overflow-y-auto">
            {displayOptions.length > 0 ? (
              displayOptions.map((opt, i) => {
                const sel = value === opt.value;
                return (
                  <button
                    key={`${opt.value}-${i}`}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setSearch("");
                      onSearchChange?.("");
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        sel ? "border-[#046C3F] bg-[#046C3F]" : "border-gray-300"
                      }`}
                    >
                      {sel && <span className="h-2 w-2 rounded-sm bg-white" />}
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })
            ) : (
              <p className="px-2 py-3 text-sm text-gray-400">
                {isLoading ? "Searching…" : "No results found"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = STATUS_COLORS[status] || { bg: "#F3F4F6", text: "#374151" };
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: color.bg, color: color.text }}
    >
      {status}
    </span>
  );
}

// ─── Existing Requests List ───────────────────────────────────────────────────

function ExistingRequest({ request }: { request: any }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => setExpanded((c) => !c)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-3">
          <ChevronRight
            size={16}
            className={`text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`}
          />
          <div>
            <p className="text-sm font-medium text-gray-800">
              {request.request_id || "Lab Request"}
            </p>
            <p className="text-xs text-gray-500">
              {request.tests?.length || 0} test{request.tests?.length !== 1 ? "s" : ""}
              {request.clinical_notes ? ` · ${request.clinical_notes.slice(0, 40)}…` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-white px-2 py-0.5 text-xs font-medium text-gray-600 border border-gray-200">
            {request.priority}
          </span>
          <StatusBadge status={request.status} />
        </div>
      </button>

      {expanded && request.tests?.length > 0 && (
        <div className="border-t border-gray-200 px-4 pb-3 pt-2">
          <div className="space-y-2">
            {request.tests.map((test: any) => (
              <div key={test.id} className="flex items-center justify-between rounded-md bg-white px-3 py-2 border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">{test.test_name}</p>
                  <p className="text-xs text-gray-500">
                    Sample: {test.sample_type}
                    {test.linked_item_name ? ` · Equipment: ${test.linked_item_name}` : ""}
                  </p>
                  {test.result_value && (
                    <p className="text-xs text-[#046C3F] mt-0.5">
                      Result: {test.result_value} {test.result_unit}
                    </p>
                  )}
                </div>
                <StatusBadge status={test.test_status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── New Lab Request Form ─────────────────────────────────────────────────────

function NewLabRequestForm({
  appointmentId,
  onSuccess,
  onCancel,
}: {
  appointmentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [priority, setPriority] = useState("NORMAL");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [tests, setTests] = useState<TestRow[]>([
    { id: "1", testName: "", linkedItem: "", sampleType: "" },
  ]);
  const [itemSearch, setItemSearch] = useState("");
  const [formError, setFormError] = useState("");

  const { data: itemData, isFetching: isLoadingItems } = useLabEquipment(itemSearch);
  const { mutate: createLabRequest, isPending } = useCreateLabRequest();

  const itemOptions = (itemData || []).map((item: any) => ({
    label: `${item.name} (${item.total_stock} in stock)`,
    value: item.id,
  }));

  const addTest = () =>
    setTests((c) => [
      ...c,
      { id: Date.now().toString(), testName: "", linkedItem: "", sampleType: "" },
    ]);

  const removeTest = (id: string) =>
    setTests((c) => c.filter((t) => t.id !== id));

  const updateTest = (id: string, field: keyof TestRow, value: string) =>
    setTests((c) => c.map((t) => (t.id === id ? { ...t, [field]: value } : t)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const hasEmpty = tests.some((t) => !t.testName || !t.sampleType);
    if (tests.length === 0 || hasEmpty) {
      setFormError("Each test needs a name and sample type.");
      return;
    }

    createLabRequest(
      {
        appointment: appointmentId,
        priority,
        clinical_notes: clinicalNotes,
        tests: tests.map((t) => ({
          test_name: t.testName,
          sample_type: t.sampleType,
          ...(t.linkedItem && { linked_item: t.linkedItem }),
        })),
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (err: any) => {
          setFormError(
            err?.response?.data?.message || "Failed to create lab request.",
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
        <SelectField
          label="Priority"
          placeholder="Select priority"
          options={PRIORITY_OPTIONS}
          value={priority}
          onChange={setPriority}
        />
        <div className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F]">
          <label className="mb-1 block text-xs text-[#62636C]">
            Clinical Notes (Optional)
          </label>
          <input
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Reason for test, suspected diagnosis…"
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Test rows */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Tests</p>
          <button
            type="button"
            onClick={addTest}
            className="flex items-center gap-1.5 rounded-lg bg-[#E8F7F0] px-3 py-1.5 text-xs font-medium text-[#046C3F] hover:bg-[#D1EFE3] transition-colors"
          >
            <Plus size={14} /> Add Test
          </button>
        </div>
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div
              key={test.id}
              className="relative grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-3"
            >
              {tests.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTest(test.id)}
                  className="absolute -right-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500 hover:bg-red-100"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <div className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 focus-within:border-[#046C3F] focus-within:ring-1 focus-within:ring-[#046C3F]">
                <label className="mb-1 block text-xs text-[#62636C]">
                  Test Name {index + 1} *
                </label>
                <input
                  value={test.testName}
                  onChange={(e) => updateTest(test.id, "testName", e.target.value)}
                  placeholder="e.g. Full Blood Count"
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
              <SelectField
                label="Linked Equipment (Optional)"
                placeholder="Search equipment"
                options={itemOptions}
                value={test.linkedItem}
                searchable
                isLoading={isLoadingItems}
                onChange={(v) => updateTest(test.id, "linkedItem", v)}
                onSearchChange={setItemSearch}
              />
              <SelectField
                label="Sample Type *"
                placeholder="Select sample"
                options={SAMPLE_TYPE_OPTIONS}
                value={test.sampleType}
                onChange={(v) => updateTest(test.id, "sampleType", v)}
              />
            </div>
          ))}
        </div>
      </div>

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
          {isPending ? "Submitting…" : "Submit Request"}
        </button>
      </div>
    </form>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function LabRequestsSection({ appointmentId }: { appointmentId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: requests, isLoading, refetch } = useLabRequestsByAppointment(appointmentId);
  const existingRequests: any[] = Array.isArray(requests) ? requests : [];

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
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <FlaskConical size={18} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-black">Lab Requests</h2>
            {existingRequests.length > 0 && (
              <p className="text-xs text-gray-500">
                {existingRequests.length} request{existingRequests.length !== 1 ? "s" : ""} for this appointment
              </p>
            )}
          </div>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg border border-[#046C3F] px-4 py-2 text-sm font-medium text-[#046C3F] hover:bg-[#F0FAF5] transition-colors"
          >
            <Plus size={16} /> New Request
          </button>
        )}
      </div>

      {submitted && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-sm text-[#046C3F]">
          <CheckCircle2 size={16} />
          Lab request submitted successfully.
        </div>
      )}

      {/* Existing requests */}
      {isLoading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" /> Loading requests…
        </div>
      ) : existingRequests.length > 0 ? (
        <div className="mb-6 space-y-3">
          {existingRequests.map((req) => (
            <ExistingRequest key={req.id} request={req} />
          ))}
        </div>
      ) : !showForm ? (
        <p className="mb-5 text-sm text-gray-400">
          No lab requests for this appointment yet.
        </p>
      ) : null}

      {/* New request form */}
      {showForm && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-5">
          <p className="mb-4 text-sm font-semibold text-gray-700">New Lab Request</p>
          <NewLabRequestForm
            appointmentId={appointmentId}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}
