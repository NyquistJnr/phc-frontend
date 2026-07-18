"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Department } from "@/src/hooks/useDepartments";
import { useUsers } from "@/src/hooks/useUsers";

interface CreateEditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Department>) => void;
  isSubmitting: boolean;
  initialData?: Department | null;
}

export default function CreateEditDepartmentModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
}: CreateEditDepartmentModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [head, setHead] = useState<string>("");

  const { data: staffData, isLoading: isStaffLoading } = useUsers({
    isActive: true,
    pageSize: 100,
  });

  const staffList =
    staffData?.results?.filter(
      (user) => user.role !== "PATIENT" && user.role !== "FACILITY_IT_ADMIN",
    ) || [];

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || "");
        setDescription(initialData.description || "");
        setIsActive(initialData.is_active ?? true);
        
        // Handle case where head might be an object or a string ID
        const headValue = initialData.head;
        if (headValue && typeof headValue === "object" && "id" in headValue) {
          setHead((headValue as any).id);
        } else {
          setHead((headValue as string) || "");
        }
      } else {
        setName("");
        setDescription("");
        setIsActive(true);
        setHead("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      is_active: isActive,
      head: head || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Department" : "Create Department"}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Department Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#046C3F]/20 focus:border-[#046C3F] transition-all"
              placeholder="e.g. Cardiology"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#046C3F]/20 focus:border-[#046C3F] transition-all resize-none"
              placeholder="Brief description of the department..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Department Head <span className="text-gray-400 font-normal">(Optional)</span></label>
            <select
              value={head}
              onChange={(e) => setHead(e.target.value)}
              disabled={isStaffLoading}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#046C3F]/20 focus:border-[#046C3F] transition-all disabled:opacity-60"
            >
              <option value="">Select a staff member...</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.first_name} {staff.last_name} ({staff.staff_id || staff.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 py-2">
            <div className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="isActive"
                className="sr-only peer"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#046C3F]"></div>
            </div>
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
              Active Status
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 py-3 px-4 bg-[#046C3F] hover:bg-[#035a34] text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
