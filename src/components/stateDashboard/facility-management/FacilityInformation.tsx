"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useSearchParams,
  useRouter,
  usePathname,
  useParams,
} from "next/navigation";
import {
  Download,
  Plus,
  Users,
  UserCheck,
  UserX,
  X,
  MoreHorizontal,
  Power,
  ChevronDown,
} from "lucide-react";
import { createPortal } from "react-dom";

import Header from "@/src/components/stateDashboard/generics/Header";
import DashboardStatCard from "../../generic/dashboard/DashboardStatCard";
import { CustomDropdown } from "@/src/components/generic/ui/CustomDropdown";
import { ColumnDef, DataTable } from "@/src/components/generic/ui/DataTable";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import {
  useFacilityUsers,
  useInviteFacilityUser,
  useToggleUserStatus,
  FacilityUser,
} from "@/src/hooks/general/use-facilities";

const FILTER_ROLE_OPTIONS = [
  "All Roles",
  "DOCTOR",
  "NURSE",
  "PHARMACIST",
  "LAB_TECHNICIAN",
  "CHEW",
  "FACILITY_IT_ADMIN",
  "OFFICER_IN_CHARGE",
  "STAFF",
];
const CREATION_ROLE_OPTIONS = FILTER_ROLE_OPTIONS.filter(
  (r) => r !== "All Roles" && r !== "STAFF",
);
const STATUS_OPTIONS = ["All Status", "Active", "Inactive"];
const PAGE_SIZES = ["10", "20", "50", "100"];

const statusColors: Record<string, { bg: string; text: string }> = {
  Active: { bg: "#DFF3EA", text: "#039855" },
  Inactive: { bg: "#FFF4E5", text: "#F79009" },
};

const inputStyles =
  "block w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#1AC073] focus:outline-none focus:ring-1 focus:ring-[#1AC073] transition-colors";
const labelStyles = "block text-sm font-medium text-gray-700 mb-1.5";

export default function FacilityUsersDetail() {
  const params = useParams();
  const facilityId = params.id as string;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("page_size")) || 10;
  const statusFilter = searchParams.get("status") || "All Status";
  const roleFilter = searchParams.get("role") || "All Roles";
  const initialSearch = searchParams.get("search") || "";

  const [localSearch, setLocalSearch] = useState(initialSearch);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    title: "",
    message: "",
    type: "success" as "success" | "error",
    visible: false,
  });

  const formatRoleName = (role: string) => {
    if (role === "FACILITY_IT_ADMIN") return "Facility IT Admin";
    if (role === "CHEW") return "CHEW";
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const inviteUserMutation = useInviteFacilityUser();
  const toggleUserMutation = useToggleUserStatus();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone_number: "",
    role: "DOCTOR",
  });

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error",
  ) => {
    setToastMsg({ title, message, type, visible: true });
  };

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (localSearch === currentSearch) return;

    const handler = setTimeout(() => {
      const urlParams = new URLSearchParams(searchParams.toString());
      if (localSearch) urlParams.set("search", localSearch);
      else urlParams.delete("search");
      urlParams.set("page", "1");
      router.push(`${pathname}?${urlParams.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, pathname, router, searchParams]);

  const isActiveParam =
    statusFilter === "Active"
      ? true
      : statusFilter === "Inactive"
        ? false
        : undefined;

  const { data: usersData, isLoading } = useFacilityUsers({
    facilityId,
    page,
    pageSize,
    search: searchParams.get("search") || undefined,
    role: roleFilter !== "All Roles" ? roleFilter : undefined,
    isActive: isActiveParam,
  });

  const users: FacilityUser[] = usersData?.results ?? [];
  const totalPages = usersData?.total_pages ?? 1;
  const totalCount = usersData?.count ?? 0;

  const updateUrlParams = useCallback(
    (key: string, value: string) => {
      const urlParams = new URLSearchParams(searchParams.toString());
      if (value && value !== "All Status" && value !== "All Roles") {
        urlParams.set(key, value);
      } else {
        urlParams.delete(key);
      }
      if (key !== "page") urlParams.set("page", "1");
      router.push(`${pathname}?${urlParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inviteUserMutation.mutateAsync({
        ...formData,
        is_active: true,
        facility_id: facilityId,
      });
      showToast("Success", "User has been successfully invited.", "success");
      setIsModalOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        phone_number: "",
        role: "DOCTOR",
      });
    } catch (error: any) {
      showToast("Error", error?.message || "Failed to invite user.", "error");
    }
  };

  const handleToggleStatus = async (user: FacilityUser) => {
    try {
      const newStatus = !user.is_active;
      await toggleUserMutation.mutateAsync({
        userId: user.id,
        isActive: newStatus,
        facilityId: facilityId,
      });
      showToast(
        "Status Updated",
        `User has been successfully ${newStatus ? "activated" : "suspended"}.`,
        "success",
      );
    } catch (error: any) {
      showToast("Error", "Failed to update user status.", "error");
    }
  };

  const UserActionMenu = ({ row }: { row: FacilityUser }) => {
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
      if (!open && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const top = rect.bottom + window.scrollY + 4;
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
      if (open) document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
      <>
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
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
                  setOpen(false);
                  handleToggleStatus(row);
                }}
                disabled={toggleUserMutation.isPending}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 ${
                  row.is_active ? "text-red-600" : "text-[#039855]"
                }`}
              >
                <Power size={16} />{" "}
                {row.is_active ? "Suspend User" : "Activate User"}
              </button>
            </div>,
            document.body,
          )}
      </>
    );
  };

  const columns: ColumnDef<FacilityUser>[] = [
    { header: "Staff ID", accessorKey: "staff_id", sortable: true },
    {
      header: "Full Name",
      render: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      header: "Role",
      render: (row) => (
        <span className="capitalize">
          {row.role.replace(/_/g, " ").toLowerCase()}
        </span>
      ),
      sortable: true,
    },
    { header: "Email Address", accessorKey: "email" },
    { header: "Phone Number", accessorKey: "phone_number" },
    {
      header: "Status",
      render: (row) => {
        const statusLabel = row.is_active ? "Active" : "Inactive";
        const colorData = statusColors[statusLabel];
        return (
          <StatusBadge
            label={statusLabel}
            bgColorHex={colorData.bg}
            textColorHex={colorData.text}
          />
        );
      },
    },
    { header: "Action", render: (row) => <UserActionMenu row={row} /> },
  ];

  const breadcrumbs = [
    {
      label: "Facility Management",
      href: "/state-dashboard/facility-management/view-facility",
    },
    { label: "Facility Users", active: true },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-[#F6F7FC]">
      <Header title="Facility Users" breadcrumbs={breadcrumbs} />

      <div className="px-4 py-6 sm:px-8 lg:py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardStatCard
            title="Total Users"
            value={totalCount}
            icon={Users}
            active={true}
            showPeriod={false}
          />
          <DashboardStatCard
            title="Active Users"
            value="--"
            icon={UserCheck}
            showPeriod={false}
          />
          <DashboardStatCard
            title="Inactive Users"
            value="--"
            icon={UserX}
            showPeriod={false}
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              User Directory
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-0.5">
              Manage and view all personnel assigned to this facility
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 border border-[#046C3F] bg-white text-[#046C3F] text-sm font-semibold rounded-xl hover:bg-[#E8F7F0] transition-colors shadow-sm">
              <Download size={16} /> Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#046C3F] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#035a34] shadow-sm"
            >
              <Plus size={18} /> Add User
            </button>
          </div>
        </div>

        <DataTable
          title="Users"
          data={users}
          columns={columns}
          showSearch
          searchPlaceholder="Search by name, ID or email..."
          onSearch={(val) => setLocalSearch(val)}
          totalPages={totalPages}
          emptyMessage={
            isLoading
              ? "Loading users..."
              : "No users match your search criteria."
          }
          toolbarActions={
            <>
              <CustomDropdown
                options={FILTER_ROLE_OPTIONS}
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 overflow-y-auto py-10">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl flex flex-col m-auto relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add New User</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyles}>First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className={labelStyles}>Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className={labelStyles}>
                  Middle Name{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.middle_name}
                  onChange={(e) =>
                    setFormData({ ...formData, middle_name: e.target.value })
                  }
                  className={inputStyles}
                  placeholder="William"
                />
              </div>

              <div>
                <label className={labelStyles}>Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={inputStyles}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className={labelStyles}>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone_number: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className={inputStyles}
                  placeholder="08000000000"
                />
              </div>
              <div className="relative">
                <label className={labelStyles}>Role</label>
                <div
                  className={`${inputStyles} flex items-center cursor-pointer justify-between bg-white`}
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                >
                  <span
                    className={
                      formData.role ? "text-gray-900" : "text-gray-400"
                    }
                  >
                    {formData.role
                      ? formatRoleName(formData.role)
                      : "Select Role"}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 ml-auto transition-transform duration-200 ${
                      isRoleDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isRoleDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsRoleDropdownOpen(false)}
                    />
                    <div className="absolute bottom-full mb-1.5 left-0 w-full bg-white border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-20 p-3 space-y-1 max-h-52 overflow-y-auto">
                      {CREATION_ROLE_OPTIONS.map((role) => (
                        <div
                          key={role}
                          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-2 rounded-lg transition-colors"
                          onClick={() => {
                            setFormData({ ...formData, role: role });
                            setIsRoleDropdownOpen(false);
                          }}
                        >
                          <input
                            type="radio"
                            readOnly
                            checked={formData.role === role}
                            className="w-4 h-4 text-[#1AC073] cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {formatRoleName(role)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteUserMutation.isPending}
                  className="flex-1 py-3 bg-[#046C3F] text-white font-semibold rounded-xl hover:bg-[#035a34] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {inviteUserMutation.isPending ? "Inviting..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast
        type={toastMsg.type}
        title={toastMsg.title}
        message={toastMsg.message}
        visible={toastMsg.visible}
        onClose={() => setToastMsg({ ...toastMsg, visible: false })}
      />
    </div>
  );
}
