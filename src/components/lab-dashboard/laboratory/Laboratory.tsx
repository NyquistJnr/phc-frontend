"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ElementType, ReactNode } from "react";
import {
  Beaker,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Eye,
  FileUp,
  MoreHorizontal,
  PlusCircle,
  Search,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import {
  LAB_REQUESTS,
  LAB_RESULTS,
  LabRequestRow,
  LabResultRow,
  labBadgeColors,
} from "./labData";

type Tab = "requests" | "results" | "enter";

const stats = [
  { title: "Pending lab Requests", value: 0, icon: ClipboardList, active: true },
  { title: "In Progress", value: 0, icon: ClipboardList },
  { title: "Completed Today", value: 0, icon: CheckCircle2 },
];

const resultOptions = ["Select", "Positive", "Negative"];

function StatCard({
  title,
  value,
  icon: Icon,
  active,
}: {
  title: string;
  value: number;
  icon: ElementType;
  active?: boolean;
}) {
  return (
    <div
      className={`min-h-36 rounded-xl p-4 ${
        active ? "bg-[#046C3F] text-white" : "bg-white text-gray-500"
      }`}
    >
      <div className="mb-8 flex items-start justify-between">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            active ? "bg-[#0B7F4D] text-white" : "bg-[#FFF7ED] text-gray-700"
          }`}
        >
          <Icon size={21} />
        </span>
        <span className={`flex items-center gap-1 text-xs ${active ? "text-white" : "text-gray-300"}`}>
          This Week <ChevronDown size={14} />
        </span>
      </div>
      <p className={`mb-3 text-sm ${active ? "text-white" : "text-gray-400"}`}>
        {title}
      </p>
      <p className={`text-3xl font-semibold ${active ? "text-white" : "text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}

function SegmentedTabs({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  return (
    <div className="mb-6 grid max-w-[400px] grid-cols-2 overflow-hidden rounded-lg bg-[#EEF7F4]">
      <button
        onClick={() => setTab("requests")}
        className={`h-10 text-sm font-medium ${
          tab === "requests" ? "bg-[#046C3F] text-white" : "text-gray-400"
        }`}
      >
        Lab Requests
      </button>
      <button
        onClick={() => setTab("results")}
        className={`h-10 text-sm font-medium ${
          tab !== "requests" ? "bg-[#046C3F] text-white" : "text-gray-400"
        }`}
      >
        Lab Results
      </button>
    </div>
  );
}

function MenuButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

function RequestActionMenu({
  onView,
  onEnter,
  onExport,
}: {
  onView: () => void;
  onEnter: () => void;
  onExport: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const toggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.right - 190 });
    }
    setOpen((value) => !value);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggle}
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
        aria-label="Open actions"
      >
        <MoreHorizontal size={18} />
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: coords.top, left: coords.left, width: 190 }}
            className="z-[9999] rounded-lg border border-gray-200 bg-white py-3 shadow-xl"
          >
            <MenuButton
              onClick={() => {
                setOpen(false);
                onView();
              }}
            >
              <Eye size={20} /> View
            </MenuButton>
            <MenuButton
              onClick={() => {
                setOpen(false);
                onEnter();
              }}
            >
              <PlusCircle size={20} /> Enter Result
            </MenuButton>
            <MenuButton
              onClick={() => {
                setOpen(false);
                onExport();
              }}
            >
              <FileUp size={20} /> Export
            </MenuButton>
          </div>,
          document.body,
        )}
    </>
  );
}

function ResultActionMenu({
  onView,
  onExport,
}: {
  onView: () => void;
  onExport: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const toggle = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.right - 190 });
    }
    setOpen((value) => !value);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggle}
        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
        aria-label="Open actions"
      >
        <MoreHorizontal size={18} />
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: coords.top, left: coords.left, width: 190 }}
            className="z-[9999] rounded-lg border border-gray-200 bg-white py-3 shadow-xl"
          >
            <MenuButton
              onClick={() => {
                setOpen(false);
                onView();
              }}
            >
              <Eye size={20} /> View result
            </MenuButton>
            <MenuButton
              onClick={() => {
                setOpen(false);
                onExport();
              }}
            >
              <FileUp size={20} /> Export result
            </MenuButton>
          </div>,
          document.body,
        )}
    </>
  );
}

function Field({
  label,
  value,
  placeholder,
  icon,
  readOnly,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: ReactNode;
  readOnly?: boolean;
}) {
  return (
    <label
      className={`flex min-h-[58px] items-center gap-3 rounded-lg border border-gray-300 px-4 ${
        readOnly ? "bg-gray-100 text-gray-500" : "bg-white text-gray-700"
      }`}
    >
      {icon && <span className="shrink-0 text-gray-600">{icon}</span>}
      <span className="min-w-0">
        <span className="block text-xs text-gray-500">{label}</span>
        <span className="block truncate text-base text-gray-400">
          {value || placeholder}
        </span>
      </span>
    </label>
  );
}

function TextArea({
  label,
  placeholder,
  readOnly,
  value,
}: {
  label: string;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
}) {
  return (
    <label
      className={`block rounded-lg border border-gray-300 px-4 py-3 ${
        readOnly ? "bg-gray-100" : "bg-white"
      }`}
    >
      <span className="block text-xs text-gray-500">{label}</span>
      <textarea
        readOnly={readOnly}
        value={value}
        placeholder={placeholder}
        onChange={() => undefined}
        className="mt-1 h-32 w-full resize-none bg-transparent text-base text-gray-600 outline-none placeholder:text-gray-400"
      />
    </label>
  );
}

function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9CCCB6] text-[#046C3F]">
        {icon}
      </span>
      <h2 className="text-xl font-semibold text-black">{title}</h2>
    </div>
  );
}

function ResultValueDropdown({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-[58px] w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-left"
      >
        <span>
          <span className="block text-xs text-gray-500">Result Value</span>
          <span className="block text-base text-gray-400">{selected}</span>
        </span>
        <ChevronDown size={20} />
      </button>
      {open && (
        <div className="absolute left-1/2 z-30 mt-[-12px] w-52 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
          {resultOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
              className="flex w-full items-center gap-4 py-2.5 text-left text-gray-500"
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                  selected === option
                    ? "border-[#046C3F] bg-[#046C3F] text-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selected === option && <Check size={14} />}
              </span>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EnterResultForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const [resultValue, setResultValue] = useState("Select");

  return (
    <div className="rounded-xl bg-white px-6 py-7 lg:px-8">
      <SectionTitle icon={<UserRound size={18} />} title="Patient Info" />
      <div className="mb-8 grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-3">
        <Field label="Search patient" value="Musa Abdullahi" icon={<Search size={24} />} readOnly />
        <Field label="Encounter ID" value="ENC-PLT-000234" readOnly />
        <Field label="Lab Request ID" value="LAB-PLT-000234" readOnly />
        <Field label="Patient ID" value="PAT-PLT-000234" readOnly />
        <Field label="Age" value="34" readOnly />
        <Field label="Gender" value="Male" readOnly />
      </div>

      <SectionTitle icon={<ClipboardList size={18} />} title="Test Details" />
      <div className="mb-8 grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-3">
        <Field label="Test type" value="Urinalysis" readOnly />
        <Field label="Requested By" value="Dr Reyes" readOnly />
        <Field label="Sample Type (Optional)" value="Blood" readOnly />
        <Field label="Priority" value="Urgent" readOnly />
        <Field label="Request Date" value="12/12/2020" icon={<Calendar size={22} />} readOnly />
        <div className="md:col-span-3">
          <TextArea label="Clinical notes for lab" value="Filled" readOnly />
        </div>
      </div>

      <SectionTitle icon={<Beaker size={18} />} title="Result Entry" />
      <div className="grid max-w-4xl grid-cols-1 gap-7 md:grid-cols-2">
        <Field label="Test Name" placeholder="Enter" />
        <Field label="Test Method" placeholder="e.g RDT, Microscopy" />
        <ResultValueDropdown selected={resultValue} onSelect={setResultValue} />
        <Field label="Result Units" value="0 mg/dL" readOnly />
        <Field label="Entered By" placeholder="Search" icon={<Search size={24} />} />
        <Field label="Result Date" value="12/12/2020" icon={<Calendar size={22} />} />
        <div className="md:col-span-2">
          <TextArea label="Result Interpretation (Optional)" placeholder="Clinical interpretation" />
        </div>
        <div className="md:col-span-2">
          <TextArea label="Notes (Optional)" placeholder="Additional lab comments" />
        </div>
      </div>

      <div className="mt-7 flex flex-col justify-end gap-4 sm:flex-row">
        <button
          onClick={onCancel}
          className="h-14 rounded-xl bg-[#BEC1CB] px-16 text-lg font-medium text-white"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-16 text-lg font-medium text-white"
        >
          <Send size={22} /> Submit Result
        </button>
      </div>
    </div>
  );
}

function ResultViewModal({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/20 px-4 py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl rounded-xl bg-white px-6 py-8 shadow-2xl lg:px-12">
        <div className="mb-8 flex justify-end">
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF4E5] text-black"
            aria-label="Close result"
          >
            <X size={20} />
          </button>
        </div>
        <SectionTitle icon={<UserRound size={18} />} title="Patient Info" />
        <div className="mb-8 grid grid-cols-1 gap-7 md:grid-cols-3">
          <Field label="Search patient" value="Musa Abdullahi" icon={<Search size={24} />} readOnly />
          <Field label="Encounter ID" value="ENC-PLT-000234" readOnly />
          <Field label="Lab Request ID" value="LAB-PLT-000234" readOnly />
          <Field label="Patient ID" value="PAT-PLT-000234" readOnly />
          <Field label="Age" value="34" readOnly />
          <Field label="Gender" value="Male" readOnly />
        </div>

        <SectionTitle icon={<ClipboardList size={18} />} title="Test Details" />
        <div className="mb-8 grid grid-cols-1 gap-7 md:grid-cols-3">
          <Field label="Test type" value="Urinalysis" readOnly />
          <Field label="Requested By" value="Dr Reyes" readOnly />
          <Field label="Sample Type (Optional)" value="Blood" readOnly />
          <Field label="Priority" value="Disabled" readOnly />
          <Field label="Request Date" value="12/12/2020" icon={<Calendar size={22} />} readOnly />
          <div className="md:col-span-3">
            <TextArea label="Clinical notes for lab" value="Filled" readOnly />
          </div>
        </div>

        <SectionTitle icon={<Beaker size={18} />} title="Result Entry" />
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          <Field label="Test Name" value="Malaria RDT" readOnly />
          <Field label="Test Method" value="Microscopy" readOnly />
          <Field label="Result Value" value="Negative" readOnly />
          <Field label="Result Units" value="100 mg/dL" readOnly />
          <Field label="Entered By" value="Festus" icon={<Search size={24} />} readOnly />
          <Field label="Result Date" value="12/12/2020" icon={<Calendar size={22} />} readOnly />
          <div className="md:col-span-2">
            <TextArea label="Result Interpretation (Optional)" value="Filled" readOnly />
          </div>
          <div className="md:col-span-2">
            <TextArea label="Notes (Optional)" value="Filled" readOnly />
          </div>
        </div>

        <div className="mt-7 flex flex-col justify-end gap-4 sm:flex-row">
          <button className="flex h-14 items-center justify-center gap-3 rounded-xl px-12 text-lg font-medium text-[#046C3F]">
            <FileUp size={22} /> Edit
          </button>
          <button className="flex h-14 items-center justify-center gap-3 rounded-xl border border-[#046C3F] px-12 text-lg font-medium text-[#046C3F]">
            <FileUp size={22} /> Export File
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function Laboratory() {
  const [tab, setTab] = useState<Tab>("requests");
  const [requestSearch, setRequestSearch] = useState("");
  const [requestPriority, setRequestPriority] = useState("All Priority");
  const [requestStatus, setRequestStatus] = useState("All Status");
  const [resultSearch, setResultSearch] = useState("");
  const [resultStatus, setResultStatus] = useState("All Status");
  const [toast, setToast] = useState<string | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const filteredRequests = useMemo(() => {
    const term = requestSearch.toLowerCase();
    return LAB_REQUESTS.filter((row) => {
      const matchesSearch = [
        row.requestId,
        row.patientId,
        row.patientName,
        row.testType,
        row.requestedBy,
      ].some((value) => value.toLowerCase().includes(term));
      const matchesPriority =
        requestPriority === "All Priority" || row.priority === requestPriority;
      const matchesStatus =
        requestStatus === "All Status" || row.status === requestStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [requestPriority, requestSearch, requestStatus]);

  const filteredResults = useMemo(() => {
    const term = resultSearch.toLowerCase();
    return LAB_RESULTS.filter((row) => {
      const matchesSearch = [
        row.requestId,
        row.patientId,
        row.patientName,
        row.labTests,
        row.result,
      ].some((value) => value.toLowerCase().includes(term));
      const matchesStatus =
        resultStatus === "All Status" || row.status === resultStatus;

      return matchesSearch && matchesStatus;
    });
  }, [resultSearch, resultStatus]);

  const requestColumns: ColumnDef<LabRequestRow>[] = [
    { header: "Lab request ID", accessorKey: "requestId", sortable: true },
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Test Type", accessorKey: "testType", sortable: true },
    { header: "Requested by", accessorKey: "requestedBy", sortable: true },
    {
      header: "Priority",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.priority}
          bgColorHex={labBadgeColors[row.priority].bg}
          textColorHex={labBadgeColors[row.priority].text}
        />
      ),
    },
    { header: "Date", accessorKey: "date", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.status}
          bgColorHex={labBadgeColors[row.status].bg}
          textColorHex={labBadgeColors[row.status].text}
        />
      ),
    },
    {
      header: "Action",
      sortable: true,
      render: () => (
        <RequestActionMenu
          onView={() => setViewModalOpen(true)}
          onEnter={() => setTab("enter")}
          onExport={() => {
            setToast("Export started");
            window.setTimeout(() => setToast(null), 2500);
          }}
        />
      ),
    },
  ];

  const resultColumns: ColumnDef<LabResultRow>[] = [
    { header: "Lab request ID", accessorKey: "requestId", sortable: true },
    { header: "Patient ID", accessorKey: "patientId", sortable: true },
    { header: "Patient Name", accessorKey: "patientName", sortable: true },
    { header: "Lab Tests", accessorKey: "labTests", sortable: true },
    { header: "Result", accessorKey: "result", sortable: true },
    { header: "Date", accessorKey: "date", sortable: true },
    {
      header: "Status",
      sortable: true,
      render: (row) => (
        <StatusBadge
          label={row.status}
          bgColorHex={labBadgeColors[row.status].bg}
          textColorHex={labBadgeColors[row.status].text}
        />
      ),
    },
    {
      header: "Action",
      sortable: true,
      render: () => (
        <ResultActionMenu
          onView={() => setViewModalOpen(true)}
          onExport={() => {
            setToast("Export started");
            window.setTimeout(() => setToast(null), 2500);
          }}
        />
      ),
    },
  ];

  const pageTitle =
    tab === "enter" ? "Enter Lab Result" : tab === "results" ? "Lab Results" : "Lab Requests";
  const breadcrumbs =
    tab === "enter"
      ? [{ label: "Laboratory" }, { label: "Lab results" }, { label: "Enter New Result" }]
      : tab === "results"
        ? [{ label: "Laboratory" }, { label: "Lab results" }]
        : [{ label: "Laboratory" }];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader title="Laboratory" breadcrumbs={breadcrumbs} />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        {tab === "enter" && <NurseBackButton onClick={() => setTab("results")} />}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black sm:text-3xl">
              {pageTitle}
            </h1>
            {tab === "requests" && (
              <p className="mt-2 text-base text-[#3F3F46]">
                Test requests from Doctor
              </p>
            )}
          </div>
          {tab === "results" && (
            <button
              onClick={() => setTab("enter")}
              className="flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-6 text-base font-medium text-white"
            >
              <PlusCircle size={20} /> Enter New Lab Result
            </button>
          )}
        </div>

        {tab !== "enter" && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3 xl:max-w-3xl">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>
            <SegmentedTabs tab={tab} setTab={setTab} />
          </>
        )}

        {tab === "enter" ? (
          <EnterResultForm
            onCancel={() => setTab("results")}
            onSubmit={() => {
              setToast("Result submitted");
              setTab("results");
              window.setTimeout(() => setToast(null), 2500);
            }}
          />
        ) : tab === "requests" ? (
          <DataTable
            title="Lab Request"
            data={filteredRequests}
            columns={requestColumns}
            showSearch
            searchPlaceholder="Search by patient name or ID"
            onSearch={setRequestSearch}
            toolbarActions={
              <>
                <DateRangeFilter
                  startDate=""
                  endDate=""
                  onApply={() => {}}
                  onClear={() => {}}
                />
                <CustomDropdown
                  options={["All Priority", "Routine", "Urgent"]}
                  selected={requestPriority}
                  onSelect={setRequestPriority}
                />
                <CustomDropdown
                  options={["All Status", "Pending", "In-Progress", "Completed"]}
                  selected={requestStatus}
                  onSelect={setRequestStatus}
                />
              </>
            }
            totalPages={68}
            emptyMessage="No lab requests match your criteria."
          />
        ) : (
          <DataTable
            title="Lab Results"
            data={filteredResults}
            columns={resultColumns}
            showSearch
            searchPlaceholder="Search by patient name or ID"
            onSearch={setResultSearch}
            toolbarActions={
              <>
                <DateRangeFilter
                  startDate=""
                  endDate=""
                  onApply={() => {}}
                  onClear={() => {}}
                />
                <CustomDropdown
                  options={["All Status", "Ready", "Processing"]}
                  selected={resultStatus}
                  onSelect={setResultStatus}
                />
              </>
            }
            totalPages={68}
            emptyMessage="No lab results match your criteria."
          />
        )}
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[350px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
          <span className="mt-0.5 h-6 w-6 rounded-lg border border-[#9ADDBA] bg-[#E8F7F0]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">{toast}</p>
            <p className="text-sm text-gray-500">
              {toast === "Result submitted"
                ? "Result for Musa Abdullahi submitted to Dr Reyes"
                : "The selected lab record export has been prepared."}
            </p>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-900">
            <X size={18} />
          </button>
        </div>
      )}

      {viewModalOpen && typeof document !== "undefined" && (
        <ResultViewModal onClose={() => setViewModalOpen(false)} />
      )}
    </div>
  );
}
