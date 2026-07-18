"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Users, Loader2, Building2, UserPlus, Trash2, Search } from "lucide-react";
import Header from "@/src/components/adminDashboard/generics/header";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import ActionMenu from "@/src/components/adminDashboard/generics/ActionMenu";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { useDepartment, useDepartmentMembers, useRemoveDepartmentMembers, DepartmentMember } from "@/src/hooks/useDepartments";
import AddMembersModal from "./modals/AddMembersModal";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

export default function DepartmentDetails({ departmentId }: { departmentId: string }) {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddMembersModalOpen, setIsAddMembersModalOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data: department, isLoading: isDeptLoading } = useDepartment(departmentId);
  const { data: membersData, isLoading: isMembersLoading } = useDepartmentMembers(departmentId, debouncedSearch);

  const removeMembersMutation = useRemoveDepartmentMembers(departmentId);

  const handleRemoveMember = (member: DepartmentMember) => {
    if (window.confirm(`Are you sure you want to remove ${member.first_name} ${member.last_name} from this department?`)) {
      removeMembersMutation.mutate([member.id], {
        onSuccess: () => {
          toast.success("Staff member removed successfully.");
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to remove staff member.");
        }
      });
    }
  };

  const members = membersData?.results || [];
  const totalPages = Math.ceil((membersData?.count || 0) / ITEMS_PER_PAGE) || 1;

  const columns: Column<DepartmentMember>[] = [
    { key: "name", label: "Staff Name", render: (row) => <span className="font-semibold">{row.first_name} {row.last_name}</span> },
    { key: "email", label: "Email Address", render: (row) => row.email },
    { key: "role", label: "Role", render: (row) => row.role },
    {
      key: "position",
      label: "Position",
      render: (row) => (
        <StatusBadge 
          label={row.position || "Member"} 
          bgColorHex={row.position === "Head of Department" ? "#EAF7F1" : "#F3F4F6"}
          textColorHex={row.position === "Head of Department" ? "#046C3F" : "#6B7280"}
        />
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <ActionMenu
          items={[
            {
              label: "Remove from Department",
              icon: Trash2,
              onClick: () => handleRemoveMember(row),
              variant: "danger",
            },
          ]}
        />
      ),
    },
  ];

  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "Departments", path: "/dashboard/facility-management/departments" },
    { label: department?.name || "Details", active: true },
  ];

  if (isDeptLoading) {
    return (
      <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
        <Header title="Department Details" breadcrumbs={breadcrumbs} />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
          <p className="text-sm font-medium">Loading department details...</p>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
        <Header title="Department Details" breadcrumbs={breadcrumbs} />
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
          <Building2 size={48} className="mb-4 text-gray-300" />
          <p className="text-sm font-medium">Department not found.</p>
          <button 
            onClick={() => router.push("/dashboard/facility-management/departments")}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
      <Header title="Department Details" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard/facility-management/departments")}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                {department.name}
                <StatusBadge 
                  label={department.is_active ? "Active" : "Inactive"} 
                  bgColorHex={department.is_active ? "#D2F1DF" : "#FFE5D3"}
                  textColorHex={department.is_active ? "#046C3F" : "#FF8433"}
                />
              </h2>
              <p className="text-gray-600 font-medium mt-1">
                {department.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-6">
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-700 text-lg shrink-0 flex items-center gap-2">
              <Users className="text-[#046C3F]" size={20} />
              Department Members
              <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full font-bold ml-2">
                {membersData?.count || 0}
              </span>
            </h3>

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
                  placeholder="Search staff..."
                  className="pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#1AC073] transition-colors"
                />
              </div>
              <button
                onClick={() => setIsAddMembersModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#046C3F] hover:bg-[#035a34] text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm text-sm"
              >
                <UserPlus size={16} strokeWidth={2.5} />
                <span>Add Staff</span>
              </button>
            </div>
          </div>

          {isMembersLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
              <p className="text-sm font-medium">Loading members...</p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={members}
                emptyMessage={
                  debouncedSearch
                    ? "No staff members match your search."
                    : "No staff members found in this department."
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

      <AddMembersModal
        isOpen={isAddMembersModalOpen}
        onClose={() => setIsAddMembersModalOpen(false)}
        departmentId={departmentId}
      />
    </div>
  );
}
