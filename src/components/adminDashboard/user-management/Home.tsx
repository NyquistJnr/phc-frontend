"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Edit2,
  UserX,
  KeyRound,
  UserCheck,
  Plus,
  RotateCcw,
  Activity,
  Users,
  MoreHorizontal,
} from "lucide-react";

import Header from "@/src/components/adminDashboard/generics/header";
import MetricCard from "@/src/components/adminDashboard/generics/MetricCard";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import ResetPasswordModal from "@/src/components/adminDashboard/user-management/modals/resetModal";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import NurseDateRangeFilter from "@/src/components/nurse-dashboard/generics/NurseDateRangeFilter";

import {
  useUsers,
  useUserStats,
  useToggleUserStatus,
  User,
} from "@/src/hooks/useUsers";

const ROLE_OPTIONS = [
  "All Roles",
  "Staff",
  "Facility IT Admin",
  "Doctor",
  "Nurse",
  "Pharmacist",
  "Lab Technician",
  "Officer In Charge",
  "Chew",
];

const STATUS_OPTIONS = ["All Status", "Active", "Suspended"];
const PAGE_SIZES = ["10", "50", "100", "200"];

const formatDate = (isoString: string) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    ", " +
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
};

const mapRoleToApi = (uiRole: string) => {
  const map: Record<string, string> = {
    "State Admin": "ADMIN",
    "Facility IT Admin": "FACILITY_IT_ADMIN",
    "Lab Technician": "LAB_TECHNICIAN",
    "Officer In Charge": "OFFICER_IN_CHARGE",
    Chew: "CHEW",
    Pharmacist: "PHARMACIST",
    Doctor: "DOCTOR",
    Nurse: "NURSE",
    Patient: "PATIENT",
    Staff: "STAFF",
  };
  return map[uiRole] || uiRole;
};

const formatRoleUI = (apiRole: string) => {
  return apiRole
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
};

function UserActionMenu({
  row,
  showToast,
}: {
  row: User;
  showToast: (
    title: string,
    message: string,
    type: "success" | "error",
  ) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const { mutate: toggleStatus, isPending: isToggling } = useToggleUserStatus();

  const toggleMenu = () => {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const top =
        rect.bottom + 188 > window.innerHeight
          ? rect.top + window.scrollY - 188 - 4
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

  const handleToggleStatus = () => {
    const newStatus = !row.is_active;
    toggleStatus(
      { userId: row.id, isActive: newStatus },
      {
        onSuccess: () => {
          setShowStatusModal(false);
          showToast(
            `User ${newStatus ? "Reactivated" : "Suspended"}`,
            `${row.first_name} has been ${newStatus ? "reactivated" : "suspended"}`,
            newStatus ? "success" : "error",
          );
        },
        onError: (error: any) => {
          showToast(
            "Action Failed",
            error.message || "Failed to update user",
            "error",
          );
        },
      },
    );
  };

  const items = [
    {
      label: "Modify",
      icon: Edit2,
      onClick: () =>
        router.push(`/dashboard/user-management/modify-user?id=${row.id}`),
      className: "text-gray-700",
    },
    {
      label: "Reset Password",
      icon: KeyRound,
      onClick: () => setShowResetModal(true),
      className: "text-gray-700",
    },
    row.is_active
      ? {
          label: "Suspend",
          icon: UserX,
          onClick: () => setShowStatusModal(true),
          className: "text-red-600",
        }
      : {
          label: "Reactivate",
          icon: RotateCcw,
          onClick: () => setShowStatusModal(true),
          className: "text-[#046C3F]",
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
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 ${item.className}`}
                >
                  <Icon size={16} className={item.className} /> {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}

      {showStatusModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {row.is_active ? "Suspend User" : "Reactivate User"}
              </h3>
              <p className="mb-6 text-sm text-gray-500">
                Are you sure you want to{" "}
                {row.is_active ? "suspend" : "reactivate"}{" "}
                <b>
                  {row.first_name} {row.last_name}
                </b>
                ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggleStatus}
                  disabled={isToggling}
                  className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-70 ${
                    row.is_active
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-[#046C3F] hover:bg-[#035a34]"
                  }`}
                >
                  {isToggling
                    ? "Processing..."
                    : `Yes, ${row.is_active ? "Suspend" : "Reactivate"}`}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onContinue={() => {
          setShowResetModal(false);
          router.push(`/dashboard/user-management/reset-password?id=${row.id}`);
        }}
      />
    </>
  );
}

export default function UserManagement() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const roleFilter = searchParams.get("role") || "All Roles";
  const statusFilter = searchParams.get("status") || "All Status";
  const start_date = searchParams.get("start_date") || "";
  const end_date = searchParams.get("end_date") || "";
  const initialSearch = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(initialSearch);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error" | "warning" | "info",
  });

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (localSearch === currentSearch) return;

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

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Status" && value !== "All Roles") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const isActiveParam =
    statusFilter === "Active"
      ? true
      : statusFilter === "Suspended"
        ? false
        : undefined;

  const { data: statsData } = useUserStats();
  const { data: usersData, isLoading: isUsersLoading } = useUsers({
    page,
    pageSize,
    role: roleFilter === "All Roles" ? undefined : mapRoleToApi(roleFilter),
    search: searchParams.get("search") || undefined,
    isActive: isActiveParam,
    startDate: start_date,
    endDate: end_date,
  });

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToastMsg({ title, message, type });
    setToastVisible(true);
  };

  const columns: ColumnDef<User>[] = [
    { header: "Staff ID", accessorKey: "staff_id", sortable: true },
    {
      header: "Name",
      render: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      header: "Role",
      render: (row) => formatRoleUI(row.role),
      sortable: true,
    },
    { header: "Email", accessorKey: "email" },
    {
      header: "Date Created",
      render: (row) => formatDate(row.created_at),
      sortable: true,
    },
    {
      header: "Status",
      render: (row) => (
        <StatusBadge
          label={row.is_active ? "Active" : "Suspended"}
          bgColorHex={row.is_active ? "#D2F1DF" : "#FFE0E0"}
          textColorHex={row.is_active ? "#046C3F" : "#D32F2F"}
        />
      ),
    },
    {
      header: "Action",
      render: (row) => <UserActionMenu row={row} showToast={showToast} />,
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F6F7FC]">
      <Header
        title="User Management"
        breadcrumbs={[{ label: "User Management", active: true }]}
      />

      <div className="p-4 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              User Management
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage all user accounts across your facilities.
            </p>
          </div>
          <Link
            href="/dashboard/user-management/create-user"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#046C3F] text-white rounded-xl font-semibold shadow-md hover:bg-[#035a34] transition-colors text-sm"
          >
            <Plus size={18} />
            Create New User
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Users}
            title="Total Users"
            value={String(statsData?.total_users || 0)}
            colorClass="bg-[#046C3F] text-white"
          />
          <MetricCard
            icon={UserCheck}
            title="Active Users"
            value={String(statsData?.active_users || 0)}
            colorClass="bg-white border border-gray-100"
          />
          <MetricCard
            icon={UserX}
            title="Suspended Users"
            value={String(statsData?.suspended_users || 0)}
            colorClass="bg-white border border-gray-100"
          />
          <MetricCard
            icon={Activity}
            title="Total Staff"
            value={String(statsData?.total_staffs || 0)}
            colorClass="bg-white border border-gray-100"
          />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <DataTable
            title="All Users"
            data={usersData?.results || []}
            columns={columns}
            showSearch
            searchPlaceholder="Search by ID, name, email..."
            onSearch={(val) => setLocalSearch(val)}
            totalPages={usersData?.total_pages}
            emptyMessage={
              isUsersLoading
                ? "Fetching users..."
                : localSearch
                  ? "No users match your criteria."
                  : "No users found."
            }
            toolbarActions={
              <>
                <NurseDateRangeFilter
                  startDate={start_date}
                  endDate={end_date}
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
                  options={ROLE_OPTIONS}
                  selected={roleFilter}
                  onSelect={(val) => updateUrlParams("role", val)}
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

      <Toast
        type={toastMsg.type}
        title={toastMsg.title}
        message={toastMsg.message}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
