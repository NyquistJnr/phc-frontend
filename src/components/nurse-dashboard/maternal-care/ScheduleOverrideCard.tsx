"use client";

import { useState } from "react";
import { CalendarClock, Loader2, Pencil, RotateCcw, Save, X } from "lucide-react";
import ScheduleRuleEditor from "./ScheduleRuleEditor";
import { summarizeRule } from "./scheduleUtils";
import { useUpdateEpisodeSchedule } from "@/src/hooks/nurses/use-maternal-care";
import type { ScheduleRule } from "./type";

const EMPTY_RULE: ScheduleRule = { rule_type: "VARIABLE_SEQUENCE" };

export default function ScheduleOverrideCard({
  episodeId,
  careType,
  currentSchedule,
}: {
  episodeId: string;
  careType: "ANC" | "PNC";
  currentSchedule: ScheduleRule | null | undefined;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftRule, setDraftRule] = useState<ScheduleRule>(
    currentSchedule || EMPTY_RULE,
  );
  const [isValid, setIsValid] = useState(true);
  const [editorKey, setEditorKey] = useState(0);
  const [error, setError] = useState("");

  const { mutate: updateSchedule, isPending } = useUpdateEpisodeSchedule();

  const scheduleField =
    careType === "ANC" ? "custom_anc_schedule" : "custom_pnc_schedule";

  const startEditing = () => {
    setDraftRule(currentSchedule || EMPTY_RULE);
    setEditorKey((k) => k + 1);
    setError("");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!isValid) {
      setError("Please complete the required fields for this schedule.");
      return;
    }
    setError("");
    updateSchedule(
      { id: episodeId, payload: { [scheduleField]: draftRule } },
      {
        onSuccess: () => setIsEditing(false),
        onError: (err: unknown) =>
          setError(
            err instanceof Error
              ? err.message
              : "Failed to save the schedule override. Please try again.",
          ),
      },
    );
  };

  const handleRevert = () => {
    if (
      !window.confirm(
        `Remove the custom ${careType} schedule for this patient? They'll revert to the facility standard.`,
      )
    ) {
      return;
    }
    setError("");
    updateSchedule(
      { id: episodeId, payload: { [scheduleField]: null } },
      {
        onError: (err: unknown) =>
          setError(
            err instanceof Error
              ? err.message
              : "Failed to revert the schedule. Please try again.",
          ),
      },
    );
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F7F0] text-[#046C3F]">
            <CalendarClock size={16} />
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {careType} Follow-up Schedule
            </p>
            <p className="text-xs text-gray-400">
              {currentSchedule
                ? "Custom schedule for this patient"
                : "Using the facility standard schedule"}
            </p>
          </div>
        </div>
        {!isEditing && (
          <div className="flex items-center gap-2">
            {currentSchedule && (
              <button
                onClick={handleRevert}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-60"
              >
                <RotateCcw size={13} /> Revert to Standard
              </button>
            )}
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 rounded-lg border border-[#046C3F] px-3 py-1.5 text-xs font-semibold text-[#046C3F] transition-colors hover:bg-[#F0FAF5]"
            >
              <Pencil size={13} />
              {currentSchedule ? "Edit Override" : "Set Custom Schedule"}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      {isEditing ? (
        <div>
          <ScheduleRuleEditor
            key={editorKey}
            value={draftRule}
            onChange={(nextRule, valid) => {
              setDraftRule(nextRule);
              setIsValid(valid);
            }}
          />
          <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
            <button
              onClick={() => setIsEditing(false)}
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-60"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending || !isValid}
              className="flex items-center gap-2 rounded-lg bg-[#046C3F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#035a34] disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {isPending ? "Saving..." : "Save Override"}
            </button>
          </div>
        </div>
      ) : currentSchedule ? (
        <p className="text-sm text-gray-600">{summarizeRule(currentSchedule)}</p>
      ) : null}
    </div>
  );
}
