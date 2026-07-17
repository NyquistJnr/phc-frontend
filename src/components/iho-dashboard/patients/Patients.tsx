"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { MoreHorizontal, Eye, Edit, Plus, CalendarPlus } from "lucide-react";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import NurseDashboardHeader from "@/src/components/iho-dashboard/generics/NurseDashboardHeader";
import { usePatients } from "@/src/hooks/nurses/use-patients";
import { Patient } from "./type";
import Link from "next/link";

const PAGE_SIZES = ["10", "100", "200"];

const badgeColors: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "#DFF3EA", text: "#039855" },
  NONE: { bg: "#FDE8E8", text: "#F33131" },
  UNKNOWN: { bg: "#FFF4E5", text: "#1F2937" },
};

function PatientActionMenu({ row }: { row: Patient }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const top =
        rect.bottom + 100 > window.innerHeight
          ? rect.top + window.scrollY - 100 - 4
          : rect.bottom + window.scrollY + 4;
      const left = Math.max(
        12 + window.scrollX,
        rect.right - 192 + window.scrollX,
      );
      setCoords({ top, left });
    }
    setOpen((c) => !c);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const items = [
    {
      label: "View Patient",
      icon: Eye,
      onClick: () => router.push(`/iho-dashboard/patients/${row.id}`),
    },
    {
      label: "Edit Patient",
      icon: Edit,
      onClick: () => router.push(`/iho-dashboard/patients/${row.id}/edit`),
    },
    {
      label: "New Appointment",
      icon: CalendarPlus,
      onClick: () =>
        router.push(`/iho-dashboard/appointments/new?patientId=${row.id}`),
    },
  ];

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <MoreHorizontal size={18} />
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: coords.top, left: coords.left }}
            className="absolute z-[999] w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Icon size={16} className="text-gray-500" /> {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}

export default function Patients() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;

  const initialSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(initialSearch);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (localSearch === currentSearch) {
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (localSearch) {
        params.set("search", localSearch);
      } else {
        params.delete("search");
      }

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, pathname, router, searchParams]);

  const { data, isLoading } = usePatients({
    page,
    page_size: pageSize,
    search: searchParams.get("search") || undefined,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const patients = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const columns: ColumnDef<Patient>[] = [
    {
      header: "Patient ID",
      render: (row) => row.profile?.patient_id || "N/A",
    },
    {
      header: "Patient Name",
      render: (row) => `${row.first_name} ${row.last_name}`.trim(),
    },
    {
      header: "Age / Group",
      render: (row) => `${row.profile?.age} yrs (${row.profile?.age_group})`,
    },
    {
      header: "Gender",
      render: (row) => row.profile?.sex || "N/A",
    },
    {
      header: "Blood Group",
      render: (row) => row.profile?.blood_group || "N/A",
    },
    {
      header: "Insurance",
      render: (row) => {
        const status = row.profile?.insurance_status || "UNKNOWN";
        const color = badgeColors[status] || badgeColors.UNKNOWN;

        return (
          <StatusBadge
            label={status}
            bgColorHex={color.bg}
            textColorHex={color.text}
          />
        );
      },
    },
    {
      header: "Action",
      render: (row) => <PatientActionMenu row={row} />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Patients"
        breadcrumbs={[{ label: "Patients" }]}
      />
      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              Patients
            </h2>
            <p className="text-base text-[#3F3F46]">
              View and manage patient records
            </p>
          </div>

          <Link
            href="/iho-dashboard/patients/new"
            className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
          >
            <Plus size={20} /> New Patient
          </Link>
        </div>

        <DataTable
          title="Patients"
          data={patients}
          columns={columns}
          showSearch
          searchPlaceholder="Search by patient name or ID"
          onSearch={(val) => setLocalSearch(val)}
          totalPages={totalPages}
          emptyMessage={
            isLoading ? "Loading patients..." : "No patients found."
          }
          toolbarActions={
            <>
              <CustomDropdown
                options={PAGE_SIZES}
                selected={pageSize.toString()}
                onSelect={(val) => updateUrlParams("page_size", val)}
                placeholder="Rows per page"
              />
            </>
          }
        />
      </div>
    </div>
  );
}
