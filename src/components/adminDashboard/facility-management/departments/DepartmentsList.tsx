"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Eye, Edit2, Trash2, Loader2, Building2 } from "lucide-react";
import Header from "@/src/components/adminDashboard/generics/header";
import DataTable, { Column } from "@/src/components/adminDashboard/generics/DataTable";
import Pagination from "@/src/components/adminDashboard/generics/Pagination";
import ActionMenu from "@/src/components/adminDashboard/generics/ActionMenu";
import FilterDropdown from "@/src/components/adminDashboard/generics/FilterDropdown";
import { StatusBadge } from "@/src/components/generic/ui/TableHelpers";
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment, Department } from "@/src/hooks/useDepartments";
import CreateEditDepartmentModal from "./modals/CreateEditDepartmentModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

export default function DepartmentsList() {
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const isActiveParam = statusFilter === "Active" ? true : statusFilter === "Inactive" ? false : undefined;

  const { data: departmentsData, isLoading } = useDepartments({
    search: debouncedSearch || undefined,
    isActive: isActiveParam,
  });

  const createMutation = useCreateDepartment();
  // Using a generic update for the list view but specific one needs ID.
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const updateMutation = useUpdateDepartment(updatingId || "");
  const deleteMutation = useDeleteDepartment();

  const departments = departmentsData?.results || [];
  const totalPages = Math.ceil((departmentsData?.count || 0) / ITEMS_PER_PAGE) || 1;

  const handleCreateOrEdit = (data: Partial<Department>) => {
    if (departmentToEdit) {
      setUpdatingId(departmentToEdit.id);
      updateMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Department updated successfully.");
          setIsCreateEditModalOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to update department.");
        }
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Department created successfully.");
          setIsCreateEditModalOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to create department.");
        }
      });
    }
  };

  const handleDelete = () => {
    if (!departmentToDelete) return;
    deleteMutation.mutate(departmentToDelete.id, {
      onSuccess: () => {
        toast.success("Department deleted successfully.");
        setIsDeleteModalOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete department.");
      }
    });
  };

  const openEditModal = (dept: Department) => {
    setDepartmentToEdit(dept);
    setIsCreateEditModalOpen(true);
  };

  const openCreateModal = () => {
    setDepartmentToEdit(null);
    setIsCreateEditModalOpen(true);
  };

  const columns: Column<Department>[] = [
    { key: "name", label: "Department Name", render: (row) => <span className="font-semibold">{row.name}</span> },
    { key: "description", label: "Description", render: (row) => <span className="text-gray-500 truncate max-w-xs inline-block">{row.description || "N/A"}</span> },
    {
      key: "is_active",
      label: "Status",
      render: (row) => (
        <StatusBadge 
          label={row.is_active ? "Active" : "Inactive"} 
          bgColorHex={row.is_active ? "#D2F1DF" : "#FFE5D3"}
          textColorHex={row.is_active ? "#046C3F" : "#FF8433"}
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
              label: "Manage Members",
              icon: Eye,
              onClick: () => router.push(`/dashboard/facility-management/departments/${row.id}`),
            },
            {
              label: "Edit Details",
              icon: Edit2,
              onClick: () => openEditModal(row),
            },
            {
              label: "Delete",
              icon: Trash2,
              onClick: () => {
                setDepartmentToDelete(row);
                setIsDeleteModalOpen(true);
              },
              variant: "danger",
            },
          ]}
        />
      ),
    },
  ];

  const breadcrumbs = [
    { label: "Facility Management" },
    { label: "Departments", active: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] min-h-screen">
      <Header title="Departments" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Departments
            </h2>
            <p className="text-gray-600 font-medium">
              Manage all departments and their staff members.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#046C3F] hover:bg-[#035a34] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Create Department</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-700 text-lg shrink-0 flex items-center gap-2">
              <Building2 className="text-[#046C3F]" size={20} />
              All Departments
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
                  placeholder="Search departments..."
                  className="pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#1AC073] transition-colors"
                />
              </div>
              <FilterDropdown
                label="Status"
                options={["All", "Active", "Inactive"]}
                selected={statusFilter}
                onChange={(v) => {
                  setStatusFilter(v);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="animate-spin mb-4 text-[#046C3F]" size={32} />
              <p className="text-sm font-medium">Loading departments...</p>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={departments}
                emptyMessage={
                  debouncedSearch
                    ? "No departments match your search."
                    : "No departments found. Create one to get started."
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

      <CreateEditDepartmentModal
        isOpen={isCreateEditModalOpen}
        onClose={() => setIsCreateEditModalOpen(false)}
        initialData={departmentToEdit}
        onSubmit={handleCreateOrEdit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
        title="Delete Department"
        message={`Are you sure you want to delete ${departmentToDelete?.name}? This action cannot be undone and will remove all staff members from this department.`}
      />
    </div>
  );
}
