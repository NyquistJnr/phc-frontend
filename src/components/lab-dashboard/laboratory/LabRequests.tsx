"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Eye, FileUp, MoreHorizontal, PlusCircle, X } from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import DateRangeFilter from "@/src/components/generic/ui/DateRangeFilter";
import { LAB_REQUESTS, LabRequestRow, labBadgeColors } from "./labData";
import { MenuButton, ResultViewModal } from "./LabSharedUI";

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

export default function LabRequests() {
  const router = useRouter();
  const [requestSearch, setRequestSearch] = useState("");
  const [requestPriority, setRequestPriority] = useState("All Priority");
  const [requestStatus, setRequestStatus] = useState("All Status");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const filteredRequests = useMemo(() => {
    const term = requestSearch.toLowerCase();
    return LAB_REQUESTS.filter((row) => {
      const matchesSearch = [
        row.requestId,
        row.patientId,
        row.patientName,
        row.testType,
        row.requestedBy,
      ].some((val) => val.toLowerCase().includes(term));
      const matchesPriority =
        requestPriority === "All Priority" || row.priority === requestPriority;
      const matchesStatus =
        requestStatus === "All Status" || row.status === requestStatus;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [requestPriority, requestSearch, requestStatus]);

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
          onEnter={() => router.push("/laboratory/new")}
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
