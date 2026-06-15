"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Search,
  Eye,
  Upload,
  MoreHorizontal,
  Calendar as CalendarIcon,
  ClipboardList,
  RefreshCcw,
} from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { PeriodFilterButton } from "@/src/components/doctorDashboard/generics/PeriodFilterButton";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import {
  useCreateDoctorLabRequest,
  useDoctorLabRequests,
  useRequestDoctorLabRepeat,
} from "@/src/hooks/doctors/use-doctors";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import type {
  DoctorLabApiPayload,
  DoctorLabRow,
  DoctorLabStatus,
} from "@/src/components/doctorDashboard/type";

const STATUS_BADGE: Record<DoctorLabStatus, React.CSSProperties> = {
  Ready: { background: "#E8F7F0", color: "#046C3F" },
  Processing: { background: "#FFFBEB", color: "#B45309" },
};

// ── Action menu (... dots) ────────────────────────────────────────────────────

function ActionMenu({ row }: { row: DoctorLabRow }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted] = useState(() => typeof document !== "undefined");
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const repeatRequest = useRequestDoctorLabRepeat();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.right - 160 });
    }
    setOpen((o) => !o);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
      >
        <MoreHorizontal size={16} />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: 160,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1"
          >
            <button
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye size={15} className="text-gray-400" /> View result
            </button>
            <button
              onClick={() => {
                repeatRequest.mutate(
                  {
                    labRequestId: row.requestId,
                    notes: `Repeat ${row.labTest} for ${row.patientName}`,
                  },
                  { onSettled: () => setOpen(false) },
                );
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCcw size={15} className="text-gray-400" /> Request repeat
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload size={15} className="text-gray-400" /> Export result
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

// ── Lab Results tab ───────────────────────────────────────────────────────────

function LabResults() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const { data: labRequestsData, isLoading } = useDoctorLabRequests({
    page: 1,
    page_size: 10,
    search,
    status,
  });

  const rows = useMemo<DoctorLabRow[]>(() => {
    const payload = labRequestsData as DoctorLabApiPayload | undefined;
    const apiRows = payload?.results || payload?.data?.results;
    if (!apiRows?.length) return [];
    return apiRows.map((row) => ({
      requestId: row.lab_request_id || row.request_id || row.id || "-",
      patientId: row.patient_id || row.patient?.patient_id || "-",
      patientName: row.patient_name || row.patient?.full_name || "-",
      labTest: row.lab_test || row.test_type || row.test_name || "Lab Test",
      result: row.result || row.result_value || "---",
      date: row.date || row.request_date || row.created_at || "-",
      status: (row.status || "Processing") as DoctorLabStatus,
    }));
  }, [labRequestsData]);
  const totalPages =
    (labRequestsData as DoctorLabApiPayload | undefined)?.total_pages || 1;

  const columns = useMemo<ColumnDef<DoctorLabRow>[]>(
    () => [
      { header: "Lab request ID", accessorKey: "requestId", sortable: true },
      { header: "Patient ID", accessorKey: "patientId", sortable: true },
      { header: "Patient Name", accessorKey: "patientName", sortable: true },
      { header: "Lab Tests", accessorKey: "labTest", sortable: true },
      { header: "Result", accessorKey: "result", sortable: true },
      { header: "Date", accessorKey: "date", sortable: true },
      {
        header: "Status",
        accessorKey: "status",
        sortable: true,
        render: (row) => (
          <span
            className="px-2.5 py-1 rounded-lg text-xs font-semibold"
            style={STATUS_BADGE[row.status]}
          >
            {row.status}
          </span>
        ),
      },
      {
        header: "Action",
        render: (row) => <ActionMenu row={row} />,
      },
    ],
    [],
  );

  return (
    <DataTable
      title="Lab Results"
      data={rows}
      columns={columns}
      showSearch
      searchPlaceholder="Search by patient name or ID"
      onSearch={setSearch}
      totalPages={totalPages}
      emptyMessage={
        isLoading ? "Loading lab requests..." : "No lab requests found."
      }
      toolbarActions={
        <>
          <PeriodFilterButton label="Date Range" />
          <FilterDropdown
            label="All Status"
            options={["All Status", "Ready", "Processing"]}
            selected={status}
            onChange={setStatus}
          />
        </>
      }
    />
  );
}

// ── Lab Request form dropdowns ────────────────────────────────────────────────

const REQUESTED_BY_OPTIONS = [
  "Dr. Suleiman",
  "Dr. Adamu",
  "Dr. Ada",
  "Dr. Musa",
  "Dr. Fatima",
  "Dr. Chukwu",
];
const TEST_TYPE_OPTIONS = [
  "Malaria RDT",
  "Malaria smear",
  "Full blood count",
  "Widal test",
  "HIV rapid test",
  "Urinalysis",
  "Blood glucose (RBS)",
  "Liver function tests",
  "Renal function tests",
  "Pregnancy test (UPT)",
];
const SAMPLE_TYPE_OPTIONS = ["Blood", "Urine", "Stool", "Swab"];
const PRIORITY_OPTIONS = ["Routine", "Urgent"];

function SearchableSelect({
  label,
  placeholder,
  options,
}: {
  label: string;
  placeholder: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted] = useState(() => typeof document !== "undefined");
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const openDropdown = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropH = Math.min(options.length * 44 + 60, 300);
      const top =
        rect.bottom + dropH > window.innerHeight
          ? rect.top - dropH - 4
          : rect.bottom + 4;
      setCoords({ top, left: rect.left, width: rect.width });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div
        ref={triggerRef}
        onClick={openDropdown}
        className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center justify-between cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p
            className={`text-sm truncate ${selected ? "text-gray-700" : "text-gray-400"}`}
          >
            {selected || placeholder}
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 outline-none focus:ring-1 focus:ring-[#1AC073]"
                />
              </div>
            </div>
            <div
              style={{ maxHeight: "220px", overflowY: "auto" }}
              className="py-1"
            >
              {filtered.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No results
                </p>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelected(opt);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                      style={
                        selected === opt
                          ? { background: "#046C3F", borderColor: "#046C3F" }
                          : { borderColor: "#D1D5DB" }
                      }
                    >
                      {selected === opt && (
                        <svg width="10" height="10" viewBox="0 0 10 10">
                          <polyline
                            points="1.5,5 4,7.5 8.5,2.5"
                            stroke="#fff"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={
                        selected === opt
                          ? "text-[#046C3F] font-medium"
                          : "text-gray-700"
                      }
                    >
                      {opt}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function SimpleSelect({
  label,
  placeholder,
  options,
}: {
  label: string;
  placeholder: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const [mounted] = useState(() => typeof document !== "undefined");
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const openDropdown = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropH = options.length * 44 + 16;
      const top =
        rect.bottom + dropH > window.innerHeight
          ? rect.top - dropH - 4
          : rect.bottom + 4;
      setCoords({ top, left: rect.left, width: rect.width });
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={openDropdown}
        className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center justify-between cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p
            className={`text-sm truncate ${selected ? "text-gray-700" : "text-gray-400"}`}
          >
            {selected || placeholder}
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {mounted &&
        open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-1"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-left transition-colors"
              >
                <div
                  className="w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors"
                  style={
                    selected === opt
                      ? { background: "#046C3F", borderColor: "#046C3F" }
                      : { borderColor: "#D1D5DB" }
                  }
                >
                  {selected === opt && (
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <polyline
                        points="1.5,5 4,7.5 8.5,2.5"
                        stroke="#fff"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={
                    selected === opt
                      ? "text-[#046C3F] font-medium"
                      : "text-gray-700"
                  }
                >
                  {opt}
                </span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

// ── Lab Request form ──────────────────────────────────────────────────────────

function FormField({
  label,
  value,
  placeholder,
  icon,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center gap-3">
      {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <input
          className="w-full text-sm text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
          placeholder={placeholder}
          defaultValue={value}
        />
      </div>
    </div>
  );
}

export function LabRequestForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const createLabRequest = useCreateDoctorLabRequest();

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#E8F7F0] flex items-center justify-center shrink-0">
            <ClipboardList size={18} className="text-[#046C3F]" />
          </div>
          <h3 className="text-base font-bold text-gray-800">Lab Request</h3>
        </div>

        <div className="space-y-4">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            <FormField
              label="Search patient"
              placeholder="Search patient by name or ID"
              icon={<Search size={15} />}
            />
            <FormField label="Encounter ID" value="ENC-PLT-000234" />
            <FormField label="Lab Request ID" value="LAB-PLT-000234" />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
            }}
          >
            <SearchableSelect
              label="Requested By"
              placeholder="Doctor/User ID"
              options={REQUESTED_BY_OPTIONS}
            />
            <SearchableSelect
              label="Sample Type (Optional)"
              placeholder="Select"
              options={SAMPLE_TYPE_OPTIONS}
            />
            <SearchableSelect
              label="Test type"
              placeholder="Select test"
              options={TEST_TYPE_OPTIONS}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SimpleSelect
              label="Priority"
              placeholder="Select priority"
              options={PRIORITY_OPTIONS}
            />
            <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-3 bg-white flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Request Date</p>
                <p className="text-sm text-gray-700">12/12/2020</p>
              </div>
              <CalendarIcon size={16} className="text-gray-400 shrink-0" />
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl px-4 pt-3 pb-4 bg-white">
            <p className="text-xs text-gray-400 mb-2">Clinical notes for lab</p>
            <textarea
              rows={5}
              className="w-full text-sm text-gray-500 outline-none bg-transparent resize-none placeholder:text-gray-400"
              placeholder="Reason for test, suspected diagnosis..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-10">
          <button
            onClick={() => router.push("/doctor-dashboard/laboratory")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              createLabRequest.mutate(
                {
                  patient: "PAT-PLT-000234",
                  requested_by: "Doctor",
                  sample_type: "Blood",
                  test_type: "Malaria RDT",
                  priority: "Routine",
                  clinical_notes: "Static doctor lab request entry",
                },
                {
                  onSuccess: () => {
                    setSubmitted(true);
                    router.push("/doctor-dashboard/laboratory");
                  },
                  onError: () => setSubmitted(true),
                },
              );
            }}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#046C3F" }}
          >
            {createLabRequest.isPending ? "Sending..." : "Send to lab"}
          </button>
        </div>
      </div>

      {submitted && (
        <div
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
          className="flex items-center gap-3 bg-white border-l-4 border-[#046C3F] rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.14)] px-4 py-3 min-w-70"
        >
          <div className="w-5 h-5 rounded-full bg-[#046C3F] flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 10 10">
              <polyline
                points="1.5,5 4,7.5 8.5,2.5"
                stroke="#fff"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 flex-1">
            Lab test request submitted
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-gray-400 hover:text-gray-600 shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <line
                x1="1"
                y1="1"
                x2="13"
                y2="13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <line
                x1="13"
                y1="1"
                x2="1"
                y2="13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

export default function Laboratory() {
  const breadcrumbs = [{ label: "Laboratory", active: true }];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-w-0">
      <DoctorHeader title="Laboratory" breadcrumbs={breadcrumbs} />

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Laboratory</h1>
            <p className="text-sm text-gray-500 mt-1">
              Review results and request repeat diagnostics
            </p>
          </div>

          <Link
            href="/doctor-dashboard/laboratory/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0"
            style={{ background: "#046C3F" }}
          >
            <span className="text-lg leading-none">+</span> Lab Request
          </Link>
        </div>

        <LabResults />
      </div>
    </div>
  );
}
