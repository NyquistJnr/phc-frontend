"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  LayoutList,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import type { ScheduleRule, ScheduleRuleType, VisitTasksMap } from "./type";

const RULE_CARDS: {
  value: ScheduleRuleType;
  title: string;
  description: string;
  icon: typeof Ban;
}[] = [
  {
    value: "ONCE",
    title: "Single Visit",
    description: "No automatic follow-up is scheduled",
    icon: Ban,
  },
  {
    value: "RECURRING",
    title: "Fixed Interval",
    description: "Same gap between every visit, indefinitely",
    icon: RefreshCw,
  },
  {
    value: "VARIABLE_SEQUENCE",
    title: "Variable Sequence",
    description: "Different gap for each visit transition",
    icon: LayoutList,
  },
];

interface TaskRow {
  key: number;
  visitNumber: string;
  tasksText: string;
}

let taskRowSeq = 0;
function nextRowKey() {
  taskRowSeq += 1;
  return taskRowSeq;
}

function tasksMapToRows(tasks?: VisitTasksMap): TaskRow[] {
  if (!tasks) return [];
  return Object.entries(tasks).map(([visitNumber, taskList]) => ({
    key: nextRowKey(),
    visitNumber,
    tasksText: taskList.join(", "),
  }));
}

function rowsToTasksMap(rows: TaskRow[]): VisitTasksMap | undefined {
  const map: VisitTasksMap = {};
  for (const row of rows) {
    const visitNumber = row.visitNumber.trim();
    const tasks = row.tasksText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!visitNumber || !/^\d+$/.test(visitNumber) || tasks.length === 0) {
      continue;
    }
    map[visitNumber] = tasks;
  }
  return Object.keys(map).length > 0 ? map : undefined;
}

export interface ScheduleRuleEditorProps {
  value: ScheduleRule;
  onChange: (rule: ScheduleRule, isValid: boolean) => void;
  disabled?: boolean;
}

export default function ScheduleRuleEditor({
  value,
  onChange,
  disabled = false,
}: ScheduleRuleEditorProps) {
  const [ruleType, setRuleType] = useState<ScheduleRuleType>(
    value.rule_type || "VARIABLE_SEQUENCE",
  );
  const [intervalDays, setIntervalDays] = useState(
    value.interval_days ? String(value.interval_days) : "",
  );
  const [intervals, setIntervals] = useState<number[]>(
    value.intervals_sequence || [],
  );
  const [intervalInput, setIntervalInput] = useState("");
  const [taskRows, setTaskRows] = useState<TaskRow[]>(
    tasksMapToRows(value.visit_tasks),
  );
  const [visitNumberInput, setVisitNumberInput] = useState("");
  const [tasksTextInput, setTasksTextInput] = useState("");

  const isValid = useMemo(() => {
    if (ruleType === "RECURRING") {
      const days = Number(intervalDays);
      return Number.isFinite(days) && days > 0;
    }
    if (ruleType === "VARIABLE_SEQUENCE") {
      return intervals.length > 0;
    }
    return true;
  }, [ruleType, intervalDays, intervals]);

  useEffect(() => {
    const rule: ScheduleRule = { rule_type: ruleType };
    if (ruleType === "RECURRING") {
      const days = Number(intervalDays);
      if (Number.isFinite(days) && days > 0) rule.interval_days = days;
    }
    if (ruleType === "VARIABLE_SEQUENCE" && intervals.length > 0) {
      rule.intervals_sequence = intervals;
    }
    const tasksMap = rowsToTasksMap(taskRows);
    if (tasksMap) rule.visit_tasks = tasksMap;

    onChange(rule, isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleType, intervalDays, intervals, taskRows]);

  const addInterval = () => {
    const days = Number(intervalInput);
    if (!Number.isFinite(days) || days <= 0) return;
    setIntervals((current) => [...current, days]);
    setIntervalInput("");
  };

  const removeInterval = (index: number) => {
    setIntervals((current) => current.filter((_, i) => i !== index));
  };

  const addTaskRow = () => {
    if (!visitNumberInput.trim() || !tasksTextInput.trim()) return;
    setTaskRows((current) => [
      ...current,
      {
        key: nextRowKey(),
        visitNumber: visitNumberInput.trim(),
        tasksText: tasksTextInput.trim(),
      },
    ]);
    setVisitNumberInput("");
    setTasksTextInput("");
  };

  const removeTaskRow = (key: number) => {
    setTaskRows((current) => current.filter((row) => row.key !== key));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-700">
          Schedule Type
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {RULE_CARDS.map((card) => {
            const Icon = card.icon;
            const selected = ruleType === card.value;
            return (
              <button
                key={card.value}
                type="button"
                disabled={disabled}
                onClick={() => setRuleType(card.value)}
                className={`flex flex-col rounded-xl border-2 p-4 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                  selected
                    ? "border-[#046C3F] bg-[#F0FAF5]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      selected
                        ? "bg-[#046C3F] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      selected ? "border-[#046C3F]" : "border-gray-300"
                    }`}
                  >
                    {selected && (
                      <CheckCircle2
                        size={14}
                        className="fill-[#046C3F] text-white"
                      />
                    )}
                  </span>
                </div>
                <span
                  className={`text-sm font-semibold ${selected ? "text-[#046C3F]" : "text-gray-700"}`}
                >
                  {card.title}
                </span>
                <span className="mt-0.5 text-xs text-gray-500">
                  {card.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {ruleType === "RECURRING" && (
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Days between visits *
          </label>
          <input
            type="number"
            min="1"
            disabled={disabled}
            value={intervalDays}
            onChange={(e) => setIntervalDays(e.target.value)}
            placeholder="e.g. 28"
            className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2.5 text-base text-gray-700 outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F] disabled:bg-gray-50"
          />
        </div>
      )}

      {ruleType === "VARIABLE_SEQUENCE" && (
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            Visit intervals (days) *
          </label>
          <p className="mb-3 text-xs text-gray-400">
            Add the day-gap for each visit transition in order — e.g. 28
            means the next visit is 28 days after the previous one. Once the
            list runs out, no further follow-up is scheduled.
          </p>
          {intervals.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {intervals.map((days, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 rounded-full bg-[#E8F7F0] px-3 py-1.5 text-sm font-medium text-[#046C3F]"
                >
                  Visit {index + 1} → {index + 2}: {days}d
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => removeInterval(index)}
                      aria-label={`Remove interval ${index + 1}`}
                      className="text-[#046C3F] hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
          {!disabled && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={intervalInput}
                onChange={(e) => setIntervalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInterval();
                  }
                }}
                placeholder="Days"
                className="w-32 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
              />
              <button
                type="button"
                onClick={addInterval}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8F7F0] px-3 py-2 text-sm font-medium text-[#046C3F] transition-colors hover:bg-[#d1f0e1]"
              >
                <Plus size={14} /> Add Interval
              </button>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">
          Recommended Tasks per Visit (Optional)
        </label>
        <p className="mb-3 text-xs text-gray-400">
          Attach recommended tasks to a specific upcoming visit number — e.g.
          visit 1: &quot;Booking Bloods, Dating Scan&quot;.
        </p>
        {taskRows.length > 0 && (
          <div className="mb-3 space-y-2">
            {taskRows.map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5"
              >
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-gray-800">
                    Visit {row.visitNumber}:{" "}
                  </span>
                  <span className="text-sm text-gray-600">
                    {row.tasksText}
                  </span>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeTaskRow(row.key)}
                    aria-label="Remove visit task"
                    className="shrink-0 text-gray-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {!disabled && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="number"
              min="1"
              value={visitNumberInput}
              onChange={(e) => setVisitNumberInput(e.target.value)}
              placeholder="Visit #"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F] sm:w-24"
            />
            <input
              type="text"
              value={tasksTextInput}
              onChange={(e) => setTasksTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTaskRow();
                }
              }}
              placeholder="Tasks, comma-separated"
              className="w-full flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 outline-none focus:border-[#046C3F] focus:ring-1 focus:ring-[#046C3F]"
            />
            <button
              type="button"
              onClick={addTaskRow}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#E8F7F0] px-3 py-2 text-sm font-medium text-[#046C3F] transition-colors hover:bg-[#d1f0e1]"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
