"use client";

import { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { useUsers } from "@/src/hooks/useUsers";
import { useAddDepartmentMembers, useDepartmentMembers } from "@/src/hooks/useDepartments";
import { toast } from "react-toastify";

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
}

export default function AddMembersModal({
  isOpen,
  onClose,
  departmentId,
}: AddMembersModalProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    if (!isOpen) {
      setSearchInput("");
      setDebouncedSearch("");
      setSelectedStaffIds(new Set());
    }
  }, [isOpen]);

  const { data: staffData, isLoading: isStaffLoading } = useUsers({
    search: debouncedSearch || undefined,
    isActive: true,
  });

  const staffList = staffData?.results?.filter((user) => user.role !== "PATIENT" && user.role !== "FACILITY_IT_ADMIN") || [];

  const addMembersMutation = useAddDepartmentMembers(departmentId);
  const { data: currentMembersData } = useDepartmentMembers(departmentId);
  const existingMemberIds = new Set(currentMembersData?.results?.map((m) => m.id) || []);

  if (!isOpen) return null;

  const toggleStaffSelection = (id: string) => {
    const newSet = new Set(selectedStaffIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedStaffIds(newSet);
  };

  const handleAddMembers = () => {
    if (selectedStaffIds.size === 0) return;

    addMembersMutation.mutate(Array.from(selectedStaffIds), {
      onSuccess: () => {
        toast.success("Staff members added successfully.");
        onClose();
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to add members.");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Staff Members</h2>
            <p className="text-sm text-gray-500 mt-1">Select staff to add to this department.</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-6 pb-2 border-b border-gray-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search staff by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#046C3F]/20 focus:border-[#046C3F] transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {isStaffLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Loader2 className="animate-spin mb-3 text-[#046C3F]" size={24} />
              <p className="text-sm font-medium">Searching staff...</p>
            </div>
          ) : staffList.length > 0 ? (
            <div className="space-y-1">
              {staffList.map((staff) => {
                const isExisting = existingMemberIds.has(staff.id);
                return (
                  <label
                    key={staff.id}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                      isExisting 
                        ? "bg-gray-50 opacity-60 cursor-not-allowed" 
                        : selectedStaffIds.has(staff.id) 
                          ? "bg-[#E8F7F0] cursor-pointer" 
                          : "hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={isExisting}
                      checked={isExisting || selectedStaffIds.has(staff.id)}
                      onChange={() => toggleStaffSelection(staff.id)}
                      className="w-5 h-5 rounded border-gray-300 text-[#046C3F] focus:ring-[#046C3F] disabled:opacity-50"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {staff.first_name} {staff.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{staff.email} • {staff.role}</p>
                    </div>
                    {isExisting && (
                      <span className="text-xs text-gray-400 ml-auto italic font-medium">Already member</span>
                    )}
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500 font-medium">No staff found.</p>
            </div>
          )}
        </div>

        <div className="p-6 pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            {selectedStaffIds.size} staff selected
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMembers}
              disabled={selectedStaffIds.size === 0 || addMembersMutation.isPending}
              className="px-5 py-2.5 bg-[#046C3F] hover:bg-[#035a34] text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {addMembersMutation.isPending && <Loader2 size={16} className="animate-spin" />}
              {addMembersMutation.isPending ? "Adding..." : "Add Selected"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
