"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Building2, Download, Eye, Edit2, MoreHorizontal } from "lucide-react";
import { createPortal } from "react-dom";

import Header from "@/src/components/stateDashboard/generics/Header";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import {
  useFacilities,
  useFacilityStats,
  Facility,
} from "@/src/hooks/useFacilities";

const LEVEL_OPTIONS = ["All Levels", "Health Post", "PHC Clinic", "PHC Centre"];
const STATUS_OPTIONS = ["All Status", "Active", "Inactive"];
const PAGE_SIZES = ["10", "20", "50", "100"];

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "#DFF3EA", text: "#039855" },
  Inactive: { bg: "#FFF4E5", text: "#F79009" },
};

function FacilityActionMenu({ row }: { row: Facility }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

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
      label: "View Detail",
      icon: Eye,
      onClick: () =>
        router.push(
          `/state-dashboard/facility-management/view-facility/${row.id}`,
        ),
      className: "text-gray-700",
    },
    {
      label: "Edit",
      icon: Edit2,
      onClick: () =>
        router.push(
          `/state-dashboard/facility-management/view-facility/${row.id}/edit`,
        ),
      className: "text-gray-700",
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

      {/* Action Dropdown Menu */}
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
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 ${item.className}`}
                >
                  <Icon size={16} className={item.className} /> {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}

export default function ViewFacility() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const statusFilter = searchParams.get("status") || "All Status";
  const levelFilter = searchParams.get("level") || "All Levels";

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

  const isActiveParam =
    statusFilter === "Active"
      ? true
      : statusFilter === "Inactive"
        ? false
        : undefined;
  const levelParam = levelFilter !== "All Levels" ? levelFilter : undefined;

  const { data: statsData } = useFacilityStats();
  const { data: facilitiesData, isLoading } = useFacilities({
    page,
    pageSize,
    search: searchParams.get("search") || undefined,
    isActive: isActiveParam,
  });

  const facilities: Facility[] = facilitiesData?.results ?? [];
  const totalPages = facilitiesData?.total_pages ?? 1;
  const totalCount = statsData?.total_facilities ?? facilitiesData?.count ?? 0;

  // Client-side level filter (API doesn't support level filter yet as per original code)
  const filteredFacilities = levelParam
    ? facilities.filter((f) => f.level === levelParam)
    : facilities;

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Status" && value !== "All Levels") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns: ColumnDef<Facility>[] = [
    { header: "Code", accessorKey: "code", sortable: true },
    { header: "Facility Name", accessorKey: "name", sortable: true },
    { header: "Level", accessorKey: "level", sortable: true },
    { header: "LGA", render: (row) => `${row.lga} LGA`, sortable: true },
    {
      header: "User",
      render: (row) => `${row.staff_count ?? 100}`,
      sortable: true,
    },
    {
      header: "Status",
      render: (row) => {
        const statusLabel = row.is_active ? "Active" : "Inactive";
        const colorData = statusColors[statusLabel] || {
          bg: "#F3F4F6",
          text: "#374151",
        };
        return (
          <StatusBadge
            label={statusLabel}
            bgColorHex={colorData.bg}
            textColorHex={colorData.text}
          />
        );
      },
    },
    { header: "Action", render: (row) => <FacilityActionMenu row={row} /> },
  ];

  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "View Facility", active: true },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#F6F7FC]">
      <Header title="Facility Management" breadcrumbs={breadcrumbs} />

      <div className="px-4 py-6 sm:px-8 lg:py-8">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              Facilities
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-0.5">
              {totalCount} {totalCount === 1 ? "facility" : "facilities"}{" "}
              registered
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-[#046C3F] bg-white text-[#046C3F] text-sm font-semibold rounded-xl hover:bg-[#E8F7F0] transition-colors">
              <Download size={16} className="text-[#046C3F]" />
              Export
            </button>
            <Link
              href="/state-dashboard/facility-management/create-facility"
              className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#035a34] shadow-sm"
            >
              <Building2 size={16} /> Add Facility
            </Link>
          </div>
        </div>

        <DataTable
          title="Facilities"
          data={filteredFacilities}
          columns={columns}
          showSearch
          searchPlaceholder="Search by name or code..."
          onSearch={(val) => setLocalSearch(val)}
          totalPages={totalPages}
          emptyMessage={
            isLoading
              ? "Loading facilities..."
              : "No facilities match your criteria."
          }
          toolbarActions={
            <>
              <CustomDropdown
                options={LEVEL_OPTIONS}
                selected={levelFilter}
                onSelect={(val) => updateUrlParams("level", val)}
              />

              <CustomDropdown
                options={STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={(val) => updateUrlParams("status", val)}
              />

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
