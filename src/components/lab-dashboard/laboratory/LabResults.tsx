"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Eye, FileUp, MoreHorizontal, X } from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { LAB_RESULTS, LabResultRow, labBadgeColors } from "./labData";
import { MenuButton, ResultViewModal } from "./LabSharedUI";

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
      >
        <MoreHorizontal size={18} />
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width: 190,
            }}
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

export default function LabResults() {
  const [resultSearch, setResultSearch] = useState("");
  const [resultStatus, setResultStatus] = useState("All Status");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredResults = useMemo(() => {
    const term = resultSearch.toLowerCase();
    return LAB_RESULTS.filter((row) => {
      const matchesSearch = [
        row.requestId,
        row.patientId,
        row.patientName,
        row.labTests,
        row.result,
      ].some((val) => val.toLowerCase().includes(term));
      const matchesStatus =
        resultStatus === "All Status" || row.status === resultStatus;
      return matchesSearch && matchesStatus;
    });
  }, [resultSearch, resultStatus]);

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
            setTimeout(() => setToast(null), 2500);
          }}
        />
      ),
    },
  ];

  return (
    <>
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
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[350px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
          <span className="mt-0.5 h-6 w-6 rounded-lg border border-[#9ADDBA] bg-[#E8F7F0]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">{toast}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-900">
            <X size={18} />
          </button>
        </div>
      )}
      {viewModalOpen && typeof document !== "undefined" && (
        <ResultViewModal onClose={() => setViewModalOpen(false)} />
      )}
    </>
  );
}
