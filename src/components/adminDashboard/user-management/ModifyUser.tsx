"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/src/components/adminDashboard/generics/header";
import {
  Search,
  Edit2,
  UserX,
  KeyRound,
  UserCheck,
  Plus,
  RotateCcw,
  Calendar,
  Loader2,
  Activity,
  Users,
} from "lucide-react";
import DataTable, {
  Column,
} from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import ActionMenu from "@/src/components/adminDashboard/generics/ActionMenu";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import MetricCard from "@/src/components/adminDashboard/generics/MetricCard";
import CustomDateFilter from "@/src/components/adminDashboard/generics/Date";
import ResetPasswordModal from "@/src/components/adminDashboard/user-management/modals/resetModal";
import { useUsers, useUserStats, User } from "@/src/hooks/useUsers";

const ITEMS_PER_PAGE = 10;

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

export default function UserManagement() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);

  const [startDate, setStartDate] = useState<string | undefined>();
  const [endDate, setEndDate] = useState<string | undefined>();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error" | "warning" | "info",
  });
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const dateFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dateFilterRef.current &&
        !dateFilterRef.current.contains(e.target as Node)
      ) {
        setDateFilterOpen(false);
      }
    }
    if (dateFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dateFilterOpen]);

  const isActiveParam =
    statusFilter === "Active"
      ? true
      : statusFilter === "Suspended"
        ? false
        : undefined;

  const { data: statsData } = useUserStats();
  const {
    data: usersData,
    isLoading: isUsersLoading,
    refetch,
  } = useUsers({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    role: roleFilter === "All" ? undefined : mapRoleToApi(roleFilter),
    search: debouncedSearch || undefined,
    isActive: isActiveParam,
    startDate,
    endDate,
  });

  const users = usersData?.results || [];
  const totalPages = usersData?.total_pages || 1;

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToastMsg({ title, message, type });
    setToastVisible(true);
  };

  const getStatusStyle = (isActive: boolean) => {
    return isActive
      ? "bg-[#D2F1DF] text-[#046C3F]"
      : "bg-[#FFE0E0] text-[#D32F2F]";
  };

  const columns: Column<User>[] = [
    {
      key: "staff_id",
      label: "Staff ID",
      render: (row) => row.staff_id || "N/A",
    },
    {
      key: "first_name",
      label: "Name",
      render: (row) => `${row.first_name} ${row.last_name}`,
    },
    { key: "role", label: "Role", render: (row) => formatRoleUI(row.role) },
    { key: "email", label: "Email", render: (row) => row.email },
    {
      key: "created_at",
      label: "Date Created",
      render: (row) => formatDate(row.created_at),
    },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(row.is_active)}`}
        >
          {row.is_active ? "Active" : "Suspended"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <ActionMenu
          items={[
            {
              label: "Modify",
              icon: Edit2,
              onClick: () =>
                router.push(
                  `/dashboard/user-management/modify-user?id=${row.id}`,
                ),
            },
            row.is_active
              ? {
                  label: "Suspend",
                  icon: UserX,
                  onClick: () =>
                    showToast(
                      "User Suspended",
                      `${row.first_name} has been suspended`,
                      "error",
                    ),
                  variant: "danger" as const,
                }
              : {
                  label: "Reactivate",
                  icon: RotateCcw,
                  onClick: () =>
                    showToast(
                      "User Reactivated",
                      `${row.first_name} has been reactivated`,
                    ),
                },
            {
              label: "Reset Password",
              icon: KeyRound,
              onClick: () => {
                setSelectedUser(row);
                setResetModalOpen(true);
              },
            },
          ]}
        />
      ),
    },
  ];

  const breadcrumbs = [{ label: "User Management", active: true }];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="User Management" breadcrumbs={breadcrumbs} />

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
            colorClass="bg-white border border-gray-100"
          />
          <MetricCard
            icon={UserCheck}
            title="Active Users"
            value={String(statsData?.active_users || 0)}
            colorClass="bg-[#046C3F] text-white"
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
          <div className="p-4 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-700">All Users</h3>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by ID, name, email..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
                />
              </div>

              <FilterDropdown
                label="All Roles"
                options={[
                  "All",
                  "Staff",
                  "State Admin",
                  "Facility IT Admin",
                  "Doctor",
                  "Nurse",
                  "Patient",
                ]}
                selected={roleFilter}
                onChange={(v) => {
                  setRoleFilter(v);
                  setCurrentPage(1);
                }}
              />
              <FilterDropdown
                label="All Status"
                options={["All", "Active", "Suspended"]}
                selected={statusFilter}
                onChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}
              />
              <div className="relative" ref={dateFilterRef}>
                <button
                  onClick={() => setDateFilterOpen(!dateFilterOpen)}
                  className={`px-3 sm:px-4 py-2 border rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                    dateFilterOpen || startDate
                      ? "border-[#046C3F] text-[#046C3F] bg-[#E8F7F0]"
                      : "border-gray-200 text-gray-600 bg-white hover:bg-gray-50"
                  }`}
                >
                  <Calendar size={14} />
                  {startDate && endDate
                    ? `${startDate.substring(5)} to ${endDate.substring(5)}`
                    : startDate
                      ? startDate
                      : "Date"}
                </button>

                {dateFilterOpen && (
                  <div className="absolute right-0 top-full mt-2 z-[100] px-2 sm:px-0">
                    <CustomDateFilter
                      onApply={(start, end) => {
                        setStartDate(start);
                        setEndDate(end);
                        setCurrentPage(1);
                        setDateFilterOpen(false);
                      }}
                      onClear={() => {
                        setStartDate(undefined);
                        setEndDate(undefined);
                        setCurrentPage(1);
                        setDateFilterOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {isUsersLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
              <p className="text-sm font-medium">Fetching users...</p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={users}
                emptyMessage={
                  debouncedSearch
                    ? "No users match your criteria."
                    : "No users found."
                }
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      <Toast
        type={toastMsg.type}
        title={toastMsg.title}
        message={toastMsg.message}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />

      <ResetPasswordModal
        isOpen={resetModalOpen}
        onClose={() => {
          setResetModalOpen(false);
          setSelectedUser(null);
        }}
        onContinue={() => {
          setResetModalOpen(false);
          router.push(
            `/dashboard/user-management/reset-password?id=${selectedUser?.id}`,
          );
        }}
      />
    </div>
  );
}
