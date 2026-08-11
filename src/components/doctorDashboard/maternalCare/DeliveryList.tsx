"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Eye, MoreHorizontal } from "lucide-react";

import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";

import { useDeliveries } from "@/src/hooks/nurses/use-maternal-care";
import { DeliveryResult } from "@/src/components/nurse-dashboard/maternal-care/type";

function DeliveryActionMenu({
  row,
}: {
  row: DeliveryResult;
}) {
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
          ? rect.top + window.scrollY - 50
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
            <button
              onClick={() => {
                router.push(
                  `/doctor-dashboard/maternal-care/delivery/${row.id}`,
                );
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Eye size={16} className="text-gray-700" /> View Detail
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

interface DeliveryListProps {
  episodeId: string;
}

export function DeliveryList({ episodeId }: DeliveryListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const startDate = searchParams.get("start_date") || "";
  const endDate = searchParams.get("end_date") || "";

  const { data: deliveriesData, isFetching } = useDeliveries({
    episode_id: episodeId,
    page,
    page_size: pageSize,
    start_date: startDate,
    end_date: endDate,
  });

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Types") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      if (key !== "page") newParams.set("page", "1");
      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const columns: ColumnDef<DeliveryResult>[] = [
    {
      header: "Delivery Date",
      render: (row) => row.delivery_date,
      sortable: true,
    },
    {
      header: "Child Name",
      accessorKey: "child_name",
      sortable: true,
    },
    {
      header: "Mother Name",
      accessorKey: "mother_name",
    },
    {
      header: "Month",
      accessorKey: "month",
    },
    {
      header: "Episode ID",
      accessorKey: "episode_id",
    },
    {
      header: "Sex",
      accessorKey: "sex",
    },
    {
      header: "Action",
      render: (row) => <DeliveryActionMenu row={row} />,
    },
  ];

  return (
    <DataTable
      title="Delivery Records"
      data={(deliveriesData?.results || []) as any[]}
      columns={columns as any}
      totalPages={deliveriesData?.total_pages}
      emptyMessage={
        isFetching
          ? "Loading records..."
          : "No delivery records found for this episode."
      }
      toolbarActions={
        <>
          <NurseDateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onApply={(start, end) => {
              const params = new URLSearchParams(searchParams.toString());
              if (start) params.set("start_date", start);
              else params.delete("start_date");
              if (end) params.set("end_date", end);
              else params.delete("end_date");
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
            onClear={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("start_date");
              params.delete("end_date");
              params.set("page", "1");
              router.push(`${pathname}?${params.toString()}`, {
                scroll: false,
              });
            }}
          />
          <CustomDropdown
            options={["10", "50", "100"]}
            selected={pageSize.toString()}
            placeholder="Rows per page"
            onSelect={(val) => updateUrlParams("page_size", val)}
          />
        </>
      }
    />
  );
}
