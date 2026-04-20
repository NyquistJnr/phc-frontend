"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Edit2,
  KeyRound,
  UserX,
  RotateCcw,
  Calendar,
  Loader2,
} from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import ActionMenu from "@/src/components/adminDashboard/generics/ActionMenu";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import CustomDateFilter from "@/src/components/adminDashboard/generics/Date";
import ResetPasswordModal from "@/src/components/adminDashboard/user-management/modals/resetModal";
import SuspendAccountModal from "@/src/components/adminDashboard/user-management/modals/suspendModal";
import { useUsers, User } from "@/src/hooks/useUsers";

const ITEMS_PER_PAGE = 10;

const DUMMY_USERS: User[] = [
  { id: "1", staff_id: "STF-PLT-000045", first_name: "Dr. Abubakar", last_name: "Musa", middle_name: null, email: "abubakar.musa@phc.gov.ng", phone_number: "+2348012345678", role: "DOCTOR", is_active: true, facility_name: "PHC Surulere", facility_id: "f1", suspended_at: null, last_login: null, created_at: "2026-03-05T07:15:00Z" },
  { id: "2", staff_id: "STF-PLT-000046", first_name: "Gustova", last_name: "Abubaka", middle_name: null, email: "gustova.abubaka@phc.gov.ng", phone_number: "+2348023456789", role: "NURSE", is_active: false, facility_name: "PHC Ikeja", facility_id: "f2", suspended_at: null, last_login: null, created_at: "2026-03-05T07:15:00Z" },
  { id: "3", staff_id: "STF-PLT-000047", first_name: "Chidi", last_name: "Okonkwo", middle_name: null, email: "chidi.okonkwo@phc.gov.ng", phone_number: "+2348034567890", role: "LAB_TECHNICIAN", is_active: true, facility_name: "PHC Ajah", facility_id: "f3", suspended_at: null, last_login: null, created_at: "2026-03-05T07:15:00Z" },
  { id: "4", staff_id: "STF-PLT-000048", first_name: "Amina", last_name: "Bello", middle_name: null, email: "amina.bello@phc.gov.ng", phone_number: "+2348045678901", role: "CHEW", is_active: false, facility_name: "PHC Ajah", facility_id: "f3", suspended_at: null, last_login: null, created_at: "2026-03-05T07:15:00Z" },
  { id: "5", staff_id: "STF-PLT-000049", first_name: "Emeka", last_name: "Eze", middle_name: null, email: "emeka.eze@phc.gov.ng", phone_number: "+2348056789012", role: "PHARMACIST", is_active: true, facility_name: "PHC Ajah", facility_id: "f3", suspended_at: null, last_login: null, created_at: "2026-03-05T07:15:00Z" },
  { id: "6", staff_id: "STF-PLT-000050", first_name: "Fatima", last_name: "Usman", middle_name: null, email: "fatima.usman@phc.gov.ng", phone_number: "+2348067890123", role: "DOCTOR", is_active: false, facility_name: "PHC Ajah", facility_id: "f3", suspended_at: null, last_login: null, created_at: "2026-03-05T07:15:00Z" },
  { id: "7", staff_id: "STF-PLT-000051", first_name: "Ngozi", last_name: "Adeyemi", middle_name: null, email: "ngozi.adeyemi@phc.gov.ng", phone_number: "+2348078901234", role: "NURSE", is_active: true, facility_name: "PHC Ajah", facility_id: "f3", suspended_at: null, last_login: null, created_at: "2026-03-05T07:15:00Z" },
  { id: "8", staff_id: "STF-PLT-000052", first_name: "Tunde", last_name: "Salami", middle_name: null, email: "tunde.salami@phc.gov.ng", phone_number: "+2348089012345", role: "LAB_TECHNICIAN", is_active: false, facility_name: "PHC Ajah", facility_id: "f3", suspended_at: null, last_login: null, created_at: "2026-03-05T07:15:00Z" },
  { id: "9", staff_id: "STF-PLT-000053", first_name: "Kemi", last_name: "Owolabi", middle_name: null, email: "kemi.owolabi@phc.gov.ng", phone_number: "+2348090123456", role: "CHEW", is_active: true, facility_name: "PHC Ajah", facility_id: "f3", suspended_at: null, last_login: null, created_at: "2026-03-05T07:15:00Z" },
  { id: "10", staff_id: "STF-PLT-000054", first_name: "Biodun", last_name: "Afolabi", middle_name: null, email: "biodun.afolabi@phc.gov.ng", phone_number: "+2348001234567", role: "PHARMACIST", is_active: false, facility_name: "PHC Ajah", facility_id: "f3", suspended_at: null, last_login: null, created_at: "2026-03-05T07:15:00Z" },
];

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

const formatRoleUI = (apiRole: string) =>
  apiRole
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");

export default function ManageUsers() {
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
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const dateFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const isActiveParam =
    statusFilter === "Active" ? true : statusFilter === "Inactive" ? false : undefined;

  useUsers({
    page: currentPage,
    pageSize: ITEMS_PER_PAGE,
    role: roleFilter === "All" ? undefined : mapRoleToApi(roleFilter),
    search: debouncedSearch || undefined,
    isActive: isActiveParam,
    startDate,
    endDate,
  });

  // TODO: remove dummy data and restore API results when backend is ready
  const [dummyUsers, setDummyUsers] = useState<User[]>(DUMMY_USERS);
  const isLoading = false;

  const filteredUsers = dummyUsers.filter((u) => {
    const matchSearch = !debouncedSearch ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (u.staff_id || "").toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (u.facility_name || "").toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === mapRoleToApi(roleFilter);
    const matchStatus = isActiveParam === undefined || u.is_active === isActiveParam;
    return matchSearch && matchRole && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  const users = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    setToastMsg({ title, message, type });
    setToastVisible(true);
  };

  const getStatusStyle = (isActive: boolean) =>
    isActive ? "bg-[#D2F1DF] text-[#046C3F]" : "bg-[#FFE0E0] text-[#D32F2F]";

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
    {
      key: "role",
      label: "Role",
      render: (row) => formatRoleUI(row.role),
    },
    {
      key: "facility_name",
      label: "Facility",
      render: (row) => row.facility_name || "N/A",
    },
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
          {row.is_active ? "Active" : "Inactive"}
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
              label: "View",
              icon: Eye,
              onClick: () =>
                router.push(`/state-dashboard/user-management/view-user?id=${row.id}`),
            },
            {
              label: "Modify",
              icon: Edit2,
              onClick: () =>
                router.push(`/state-dashboard/user-management/modify-user?id=${row.id}`),
            },
            {
              label: "Reset Password",
              icon: KeyRound,
              onClick: () => {
                setSelectedUser(row);
                setResetModalOpen(true);
              },
            },
            row.is_active
              ? {
                  label: "Suspend Account",
                  icon: UserX,
                  onClick: () => {
                    setSelectedUser(row);
                    setSuspendModalOpen(true);
                  },
                  variant: "danger" as const,
                }
              : {
                  label: "Reactivate",
                  icon: RotateCcw,
                  onClick: () => {
                    setDummyUsers((prev) =>
                      prev.map((u) => (u.id === row.id ? { ...u, is_active: true } : u)),
                    );
                    showToast("User Reactivated", `${row.first_name} has been reactivated`, "success");
                  },
                },
          ]}
        />
      ),
    },
  ];

  const breadcrumbs = [
    { label: "User Management" },
    { label: "Manage Users", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header title="User Management" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Users</h2>
          <p className="text-gray-500 text-sm mt-1">Manage users across all facilities</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-700">Manage Users</h3>

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
                  placeholder="Search by staff ID, name, role or facility..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs w-full sm:w-72 focus:outline-none focus:ring-1 focus:ring-[#1AC073]"
                />
              </div>

              <FilterDropdown
                label="All Role"
                options={["All", "Staff", "State Admin", "Facility IT Admin", "Doctor", "Nurse", "Patient"]}
                selected={roleFilter}
                onChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}
              />
              <FilterDropdown
                label="All Status"
                options={["All", "Active", "Inactive"]}
                selected={statusFilter}
                onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
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
                      : "Date Range"}
                </button>

                {dateFilterOpen && (
                  <div className="absolute right-0 top-full mt-2 z-100 px-2 sm:px-0">
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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
              <p className="text-sm font-medium">Fetching users...</p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={users}
                emptyMessage={debouncedSearch ? "No users match your criteria." : "No users found."}
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
        onClose={() => { setResetModalOpen(false); setSelectedUser(null); }}
        onContinue={() => {
          setResetModalOpen(false);
          router.push(`/state-dashboard/user-management/reset-password?id=${selectedUser?.id}`);
        }}
        userName={selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : undefined}
        staffId={selectedUser?.staff_id || undefined}
        facility={selectedUser?.facility_name || undefined}
      />

      <SuspendAccountModal
        isOpen={suspendModalOpen}
        onClose={() => { setSuspendModalOpen(false); setSelectedUser(null); }}
        onConfirm={() => {
          if (!selectedUser) return;
          const user = selectedUser;
          setDummyUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, is_active: false } : u)),
          );
          setSuspendModalOpen(false);
          setSelectedUser(null);
          showToast(
            "Account Suspended",
            `You have suspended ${user.first_name} ${user.last_name} Account`,
            "error",
          );
        }}
        userName={selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : undefined}
        staffId={selectedUser?.staff_id || undefined}
        facility={selectedUser?.facility_name || undefined}
      />
    </div>
  );
}
