"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Check,
  ChevronDown,
  Download,
  Eye,
  MoreHorizontal,
  Pill,
  Plus,
  Search,
  X,
} from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import PharmacistBackButton from "@/src/components/pharmacist-dashboard/generics/PharmacistBackButton";
import PharmacistDashboardHeader from "@/src/components/pharmacist-dashboard/generics/PharmacistDashboardHeader";
import {
  DRUG_OPTIONS,
  FREQUENCY_OPTIONS,
  PAYMENT_OPTIONS,
  PRESCRIPTIONS,
  PrescriptionRow,
  PrescriptionStatus,
  prescriptionBadgeColors,
} from "@/src/components/pharmacist-dashboard/prescriptions/pharmacyData";

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  options: string[];
  onChange: (value: string) => void;
  searchable?: boolean;
};

function FormField({
  label,
  value,
  placeholder,
  icon,
  readOnly,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="flex h-[58px] items-center gap-3 rounded-md border border-[#D1D5DB] bg-white px-4">
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[#53545C]">{label}</span>
        <input
          value={value}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full bg-transparent text-base text-[#6B7280] outline-none placeholder:text-[#A7ADB5]"
        />
      </span>
    </label>
  );
}

function ReadonlyField({
  label,
  value,
  icon,
  className = "",
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[58px] items-center gap-3 rounded-md border border-[#D8DDE3] bg-[#F1F2F4] px-4 ${className}`}
    >
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[#8B909A]">{label}</span>
        <span className="mt-1 block truncate text-base text-[#7A7F89]">
          {value}
        </span>
      </span>
    </div>
  );
}

function PrescriptionViewModal({
  onClose,
  onDispense,
}: {
  onClose: () => void;
  onDispense: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/20 px-4 py-10 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[1100px] rounded-xl bg-white px-6 py-8 shadow-2xl sm:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Pill size={28} className="text-[#046C3F]" />
            <h2 className="text-2xl font-semibold text-black">
              View Prescription
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#FFF3E7] p-2 text-[#FF4D4F]"
            aria-label="Close prescription view"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
          <ReadonlyField
            label="Patient Name"
            value="Auto-generated"
            icon={<Search size={24} className="text-[#5B616A]" />}
          />
          <ReadonlyField label="Encounter ID" value="ENC-PLT-000234" />
          <ReadonlyField label="Prescription ID" value="PRC-PLT-000234" />
          <ReadonlyField label="Dispense ID" value="Disabled" />
        </div>

        <div className="mt-8 space-y-8">
          {[1, 2].map((medication) => (
            <section key={medication} className="max-w-[770px] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#8B909A]">
                  Medication {medication}
                </h3>
                <span className="text-xl font-semibold text-[#8B909A]">
                  {medication}/2
                </span>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <ReadonlyField label="Drug Name" value="Paracetamol 500mg" />
                {medication === 1 && (
                  <ReadonlyField label="Prescribed By" value="Filled" />
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <ReadonlyField label="Dosage" value="500mg 1 tab" />
                <ReadonlyField label="Frequency" value="Twice daily" />
                <ReadonlyField label="Duration" value="7 days" />
              </div>
              <ReadonlyField
                label="Notes"
                value="Filled"
                className="h-40 items-start py-4"
              />
            </section>
          ))}
        </div>

        <div className="mt-8 max-w-[375px]">
          <ReadonlyField label="Payment method" value="Cash" />
        </div>

        <div className="mt-8 flex max-w-[770px] flex-col gap-4 sm:flex-row">
          <button
            onClick={onDispense}
            className="inline-flex h-14 items-center justify-center rounded-lg bg-[#046C3F] px-10 text-lg font-medium text-white"
          >
            Start Dispensing
          </button>
          <button className="inline-flex h-14 items-center justify-center gap-3 rounded-lg border border-[#046C3F] px-10 text-lg font-medium text-[#046C3F]">
            <Download size={20} />
            Export File
          </button>
        </div>
      </div>
    </div>
  );
}

function FormSelectField({
  label,
  value,
  placeholder = "Select",
  options,
  onChange,
  searchable,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const visibleOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-[58px] w-full items-center justify-between rounded-md border border-[#D1D5DB] bg-white px-4 text-left"
      >
        <span className="min-w-0">
          <span className="block text-xs text-[#53545C]">{label}</span>
          <span className="mt-1 block truncate text-base text-[#6B7280]">
            {value || placeholder}
          </span>
        </span>
        <ChevronDown
          size={20}
          className={`text-[#111827] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full rounded border border-gray-200 bg-white p-3 shadow-xl">
          {searchable && (
            <label className="mb-3 flex h-11 items-center gap-3 rounded-md border border-gray-200 px-3">
              <Search size={18} className="text-[#111827]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </label>
          )}
          <div className="max-h-72 overflow-y-auto pr-1">
            {visibleOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setSearch("");
                }}
                className="flex w-full items-center gap-4 rounded px-2 py-3 text-left text-[#7A7F89] hover:bg-gray-50"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                    value === option
                      ? "border-[#046C3F] bg-[#046C3F] text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {value === option && <Check size={14} />}
                </span>
                <span>{option}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MedicationSection({
  index,
  total,
  drug,
  frequency,
  outOfStock,
  onDrugChange,
  onFrequencyChange,
  onStockChange,
}: {
  index: number;
  total: number;
  drug: string;
  frequency: string;
  outOfStock: boolean;
  onDrugChange: (value: string) => void;
  onFrequencyChange: (value: string) => void;
  onStockChange: (value: boolean) => void;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#8B909A]">
          Medication {index}
        </h3>
        <span className="text-xl font-semibold text-[#8B909A]">
          {index}/{total}
        </span>
      </div>

      <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
        <FormSelectField
          label="Drug Name"
          value={drug}
          options={DRUG_OPTIONS}
          onChange={onDrugChange}
          searchable
        />
        {index === 1 && (
          <FormSelectField
            label="Prescribed By"
            value="Festus"
            options={["Festus", "Dr Emeka Dike", "Dr Reyes"]}
            onChange={() => undefined}
          />
        )}
      </div>

      <div className="grid max-w-[770px] grid-cols-1 gap-3 md:grid-cols-3">
        <FormField label="Dosage" value="500mg 1 tab" readOnly />
        <FormSelectField
          label="Frequency"
          value={frequency}
          options={FREQUENCY_OPTIONS}
          onChange={onFrequencyChange}
        />
        <FormField label="Duration" value="7 days" readOnly />
      </div>

      {index === 1 && (
        <textarea
          className="h-40 w-full max-w-[770px] resize-none rounded-md border border-[#D1D5DB] px-4 py-3 text-base outline-none placeholder:text-[#A7ADB5]"
          placeholder="Additional dispensing notes"
          aria-label="Medication 1 notes"
        />
      )}

      <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-[275px_1fr]">
        <button
          type="button"
          className="flex h-14 items-center justify-center gap-4 rounded-md border border-dashed border-[#046C3F] text-xl font-medium text-[#046C3F]"
        >
          <Plus size={20} />
          Substitute
        </button>
        <label className="flex items-start gap-4 text-[#8B909A]">
          <input
            type="checkbox"
            checked={outOfStock}
            onChange={(event) => onStockChange(event.target.checked)}
            className="mt-1 h-6 w-6 rounded border-gray-300 text-[#046C3F] focus:ring-[#046C3F]"
          />
          <span>
            <span className="block text-base">Out of stock</span>
            <span className="mt-2 block text-sm text-[#A7ADB5]">
              Mark if drug is out of stock
            </span>
          </span>
        </label>
      </div>

      {index === 2 && (
        <textarea
          className="h-40 w-full max-w-[770px] resize-none rounded-md border border-[#D1D5DB] px-4 py-3 text-base outline-none placeholder:text-[#A7ADB5]"
          placeholder="Additional dispensing notes"
          aria-label="Medication 2 notes"
        />
      )}
    </section>
  );
}

function DispenseForm({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [drugOne, setDrugOne] = useState("Paracetamol 500mg");
  const [drugTwo, setDrugTwo] = useState("Paracetamol 500mg");
  const [frequencyOne, setFrequencyOne] = useState("Twice daily");
  const [frequencyTwo, setFrequencyTwo] = useState("Twice daily");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [outOne, setOutOne] = useState(false);
  const [outTwo, setOutTwo] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Prescriptions"
        breadcrumbs={[
          { label: "Prescriptions", href: "/pharmacist-dashboard/prescriptions" },
          { label: "Dispense" },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <PharmacistBackButton onClick={onBack} />

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
          className="rounded-xl bg-white px-5 py-8 shadow-sm sm:px-6"
        >
          <div className="mb-8 flex items-center gap-3">
            <Pill size={28} className="text-[#046C3F]" />
            <h1 className="text-2xl font-semibold text-black">
              Dispense medication
            </h1>
          </div>

          <div className="mb-8 grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              label="Patient Name"
              value=""
              placeholder="Auto-generated"
              icon={<Search size={24} className="text-[#111827]" />}
              readOnly
            />
            <FormField label="Encounter ID" value="ENC-PLT-000234" readOnly />
            <FormField label="Prescription ID" value="PRC-PLT-000234" readOnly />
            <FormField label="Dispense ID" value="DSP-PLT-000234" readOnly />
          </div>

          <div className="space-y-10">
            <MedicationSection
              index={1}
              total={2}
              drug={drugOne}
              frequency={frequencyOne}
              outOfStock={outOne}
              onDrugChange={setDrugOne}
              onFrequencyChange={setFrequencyOne}
              onStockChange={setOutOne}
            />
            <MedicationSection
              index={2}
              total={2}
              drug={drugTwo}
              frequency={frequencyTwo}
              outOfStock={outTwo}
              onDrugChange={setDrugTwo}
              onFrequencyChange={setFrequencyTwo}
              onStockChange={setOutTwo}
            />
          </div>

          <div className="mt-8 max-w-[375px]">
            <FormSelectField
              label="Payment method"
              value={paymentMethod}
              options={PAYMENT_OPTIONS}
              onChange={setPaymentMethod}
            />
          </div>

          <div className="mt-8 flex max-w-[770px] flex-col gap-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onBack}
              className="h-14 rounded-lg bg-[#C1C4CE] px-16 text-xl font-medium text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-14 rounded-lg bg-[#046C3F] px-10 text-xl font-medium text-white"
            >
              Submit Dispense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReviewPrescription({
  onBack,
  onStartDispensing,
}: {
  onBack: () => void;
  onStartDispensing: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Prescriptions"
        breadcrumbs={[
          { label: "Prescriptions", href: "/pharmacist-dashboard/prescriptions" },
          { label: "Dispense" },
        ]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <PharmacistBackButton onClick={onBack} />
        <section className="rounded-xl bg-white px-5 py-8 shadow-sm sm:px-6">
          <div className="mb-8 flex items-center gap-3">
            <Pill size={28} className="text-[#046C3F]" />
            <h1 className="text-2xl font-semibold text-black">
              Review Doctor&apos;s Prescription
            </h1>
          </div>

          <div className="grid max-w-[770px] grid-cols-1 gap-5 md:grid-cols-2">
            <ReadonlyField label="Prescription ID" value="PRC-PLT-000234" />
            <ReadonlyField label="Prescribed by" value="Dr Festus" />
            <ReadonlyField label="Patient Name" value="Gustova Abubaka" />
            <ReadonlyField label="Drug Name" value="Paracetamol 500mg" />
          </div>

          <div className="mt-8 space-y-8">
            <section className="max-w-[770px] space-y-6">
              <h2 className="text-xl font-semibold text-[#8B909A]">
                Medication 1
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <ReadonlyField label="Dosage" value="500mg 1 tab" />
                <ReadonlyField label="Frequency" value="Twice Daily" />
                <ReadonlyField label="Duration" value="7 days" />
              </div>
            </section>
            <section className="max-w-[770px] space-y-6">
              <h2 className="text-xl font-semibold text-[#8B909A]">
                Medication 2
              </h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <ReadonlyField label="Drug Name" value="Paracetamol 500mg" />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <ReadonlyField label="Dosage" value="500mg 1 tab" />
                <ReadonlyField label="Frequency" value="Twice Daily" />
                <ReadonlyField label="Duration" value="7 days" />
              </div>
            </section>
          </div>

          <div className="mt-8 max-w-[770px]">
            <ReadonlyField label="Priority" value="Routine" />
            <ReadonlyField
              label="Instruction"
              value="Filled"
              className="mt-6 h-40 items-start py-4"
            />
          </div>

          <div className="mt-8 flex max-w-[770px] justify-end">
            <button
              onClick={onStartDispensing}
              className="h-14 rounded-lg bg-[#046C3F] px-10 text-xl font-medium text-white"
            >
              Start Dispensing
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Prescriptions() {
  const [rows, setRows] = useState(PRESCRIPTIONS);
  const [mode, setMode] = useState<"list" | "review" | "dispense">("list");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [toast, setToast] = useState(false);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        [
          row.prescribedId,
          row.patientId,
          row.patientName,
          row.medications,
          row.prescribedBy,
        ].some((field) => field.toLowerCase().includes(term));
      const matchesStatus = status === "All Status" || row.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, status]);

  const submitDispense = () => {
    setRows((current) => [
      {
        ...current[0],
        status: "Dispensed",
      },
      ...current.slice(1),
    ]);
    setMode("list");
    setToast(true);
    window.setTimeout(() => setToast(false), 3000);
  };

  if (mode === "dispense") {
    return <DispenseForm onBack={() => setMode("list")} onSubmit={submitDispense} />;
  }

  if (mode === "review") {
    return (
      <ReviewPrescription
        onBack={() => setMode("list")}
        onStartDispensing={() => setMode("dispense")}
      />
    );
  }

  const columns: ColumnDef<PrescriptionRow>[] = [
    { header: "Prescribed ID", accessorKey: "prescribedId", sortable: true },
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Medications", accessorKey: "medications", sortable: true },
    { header: "Prescribed By", accessorKey: "prescribedBy", sortable: true },
    { header: "Date", accessorKey: "date", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.status}
          bgColorHex={prescriptionBadgeColors[row.status].bg}
          textColorHex={prescriptionBadgeColors[row.status].text}
        />
      ),
    },
    {
      header: "Action",
      sortable: true,
      render: (row) => {
        const rowIndex = rows.indexOf(row);
        return (
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === rowIndex ? null : rowIndex)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Prescription actions"
            >
              <MoreHorizontal size={18} />
            </button>
            {openMenu === rowIndex && (
              <div className="absolute right-0 top-9 z-30 w-44 rounded border border-gray-200 bg-white p-3 shadow-xl">
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    setViewOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-gray-700 hover:bg-gray-50"
                >
                  <Eye size={18} /> View
                </button>
                <button
                  onClick={() => {
                    setOpenMenu(null);
                    setMode("review");
                  }}
                  className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-gray-700 hover:bg-gray-50"
                >
                  <Pill size={18} /> Dispense
                </button>
                <button className="flex w-full items-center gap-3 rounded px-2 py-2 text-left text-gray-700 hover:bg-gray-50">
                  <Download size={18} /> Export
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <PharmacistDashboardHeader
        title="Prescriptions"
        breadcrumbs={[{ label: "Prescriptions" }]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7">
          <h1 className="mb-2 text-2xl font-semibold text-black sm:text-3xl">
            Prescriptions
          </h1>
          <p className="text-base text-[#3F3F46]">
            Manage and dispense prescription to patient
          </p>
        </div>

        <DataTable
          title="Patient Prescription History"
          data={filteredRows}
          columns={columns}
          showSearch
          searchPlaceholder="Search patient by Drug name..."
          onSearch={setSearch}
          toolbarActions={
            <>
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onApply={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                onClear={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              />
              <CustomDropdown
                options={[
                  "All Status",
                  ...Object.keys(prescriptionBadgeColors),
                ]}
                selected={status}
                onSelect={(value) => setStatus(value as PrescriptionStatus | "All Status")}
              />
            </>
          }
          totalPages={68}
          emptyMessage="No prescriptions match your criteria."
        />
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-[80] flex w-[360px] max-w-[calc(100vw-2rem)] items-center gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
          <span className="h-6 w-6 rounded-lg border border-[#9EE2BE] bg-[#DDF2EA]" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#111827]">
              Prescription dispensed
            </p>
            <p className="text-sm text-[#475569]">Recorded for Emeka Dike</p>
          </div>
          <button onClick={() => setToast(false)} aria-label="Close toast">
            <X size={18} />
          </button>
        </div>
      )}

      {viewOpen && (
        <PrescriptionViewModal
          onClose={() => setViewOpen(false)}
          onDispense={() => {
            setViewOpen(false);
            setMode("review");
          }}
        />
      )}
    </div>
  );
}
