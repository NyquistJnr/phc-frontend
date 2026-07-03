"use client";

import { useState } from "react";
import { CalendarClock, Loader2, Pencil, Save, Trash2, X } from "lucide-react";
import Header from "@/src/components/stateDashboard/generics/Header";
import Toast from "@/src/components/adminDashboard/generics/Toast";
import ScheduleRuleEditor from "@/src/components/nurse-dashboard/maternal-care/ScheduleRuleEditor";
import {
  useGlobalScheduleRules,
  useCreateGlobalScheduleRule,
  useUpdateGlobalScheduleRule,
  useDeleteGlobalScheduleRule,
} from "@/src/hooks/nurses/use-maternal-care";
import type {
  GlobalScheduleRule,
  ScheduleRule,
} from "@/src/components/nurse-dashboard/maternal-care/type";
import { summarizeRule } from "@/src/components/nurse-dashboard/maternal-care/scheduleUtils";

const EMPTY_RULE: ScheduleRule = { rule_type: "VARIABLE_SEQUENCE" };

function ScheduleCareTypeCard({
  careType,
  rule,
  isLoading,
  onSaved,
  onError,
}: {
  careType: "ANC" | "PNC";
  rule: GlobalScheduleRule | undefined;
  isLoading: boolean;
  onSaved: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftRule, setDraftRule] = useState<ScheduleRule>(
    rule || EMPTY_RULE,
  );
  const [isValid, setIsValid] = useState(true);
  const [editorKey, setEditorKey] = useState(0);

  const { mutate: createRule, isPending: isCreating } =
    useCreateGlobalScheduleRule();
  const { mutate: updateRule, isPending: isUpdating } =
    useUpdateGlobalScheduleRule();
  const { mutate: deleteRule, isPending: isDeleting } =
    useDeleteGlobalScheduleRule();

  const isSaving = isCreating || isUpdating;

  const startEditing = () => {
    setDraftRule(rule || EMPTY_RULE);
    setEditorKey((k) => k + 1);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!isValid) {
      onError("Please complete the required fields for this schedule.");
      return;
    }

    if (rule?.id) {
      updateRule(
        { id: rule.id, payload: draftRule },
        {
          onSuccess: () => {
            setIsEditing(false);
            onSaved(`${careType} standard schedule updated.`);
          },
          onError: (error: unknown) =>
            onError(
              error instanceof Error
                ? error.message
                : "Failed to update the schedule. Please try again.",
            ),
        },
      );
    } else {
      createRule(
        { ...draftRule, care_type: careType },
        {
          onSuccess: () => {
            setIsEditing(false);
            onSaved(`${careType} standard schedule created.`);
          },
          onError: (error: unknown) =>
            onError(
              error instanceof Error
                ? error.message
                : "Failed to create the schedule. Please try again.",
            ),
        },
      );
    }
  };

  const handleDelete = () => {
    if (!rule?.id) return;
    if (
      !window.confirm(
        `Delete the ${careType} standard schedule? Patients without a personal override will fall back to single-visit (no auto follow-up) until a new standard is set.`,
      )
    ) {
      return;
    }
    deleteRule(rule.id, {
      onSuccess: () => onSaved(`${careType} standard schedule deleted.`),
      onError: (error: unknown) =>
        onError(
          error instanceof Error
            ? error.message
            : "Failed to delete the schedule. Please try again.",
        ),
    });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F7F0] text-[#046C3F]">
            <CalendarClock size={18} />
          </span>
          <h2 className="text-lg font-bold text-gray-800">
            {careType === "ANC" ? "Antenatal Care (ANC)" : "Postnatal Care (PNC)"}
          </h2>
        </div>
        {!isEditing && (
          <div className="flex items-center gap-2">
            {rule && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
              >
                {isDeleting ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
                Delete
              </button>
            )}
            <button
              onClick={startEditing}
              className="flex items-center gap-2 rounded-lg bg-[#046C3F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#035a34]"
            >
              <Pencil size={15} />
              {rule ? "Edit Standard" : "Set Standard"}
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={24} className="animate-spin text-[#046C3F]" />
        </div>
      ) : isEditing ? (
        <div>
          <ScheduleRuleEditor
            key={editorKey}
            value={draftRule}
            onChange={(nextRule, valid) => {
              setDraftRule(nextRule);
              setIsValid(valid);
            }}
          />
          <div className="mt-6 flex gap-3 border-t border-gray-100 pt-5">
            <button
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-60"
            >
              <X size={15} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !isValid}
              className="flex items-center gap-2 rounded-lg bg-[#046C3F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#035a34] disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {isSaving ? "Saving..." : "Save Standard"}
            </button>
          </div>
        </div>
      ) : rule ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">{summarizeRule(rule)}</p>
          {rule.visit_tasks && Object.keys(rule.visit_tasks).length > 0 && (
            <div className="space-y-1">
              {Object.entries(rule.visit_tasks).map(([visitNumber, tasks]) => (
                <p key={visitNumber} className="text-xs text-gray-400">
                  Visit {visitNumber}: {tasks.join(", ")}
                </p>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          No facility standard set for {careType} yet. Without one, patients
          default to a single visit with no automatic follow-up unless they
          have a personal override.
        </p>
      )}
    </div>
  );
}

export default function AncPncSchedule() {
  const { data, isLoading } = useGlobalScheduleRules();
  const [toast, setToast] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const ancRule = data?.results.find((r) => r.care_type === "ANC");
  const pncRule = data?.results.find((r) => r.care_type === "PNC");

  const breadcrumbs = [
    { label: "Configuration" },
    { label: "ANC/PNC Schedule", active: true },
  ];

  const showToast = (
    type: "success" | "error",
    title: string,
    message: string,
  ) => setToast({ type, title, message });

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC]">
      <Header title="Configuration" breadcrumbs={breadcrumbs} />

      <div className="p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            ANC/PNC Schedule
          </h1>
          <p className="text-gray-600 text-sm">
            Set the facility-wide standard follow-up schedule for antenatal
            and postnatal care. Individual patients can be given a personal
            override from their maternal care episode, which takes priority
            over this standard.
          </p>
        </div>

        <div className="grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
          <ScheduleCareTypeCard
            careType="ANC"
            rule={ancRule}
            isLoading={isLoading}
            onSaved={(message) => showToast("success", "Saved", message)}
            onError={(message) => showToast("error", "Error", message)}
          />
          <ScheduleCareTypeCard
            careType="PNC"
            rule={pncRule}
            isLoading={isLoading}
            onSaved={(message) => showToast("success", "Saved", message)}
            onError={(message) => showToast("error", "Error", message)}
          />
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          visible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
