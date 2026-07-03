import type { ScheduleRule } from "./type";

export function summarizeRule(rule: ScheduleRule) {
  if (rule.rule_type === "ONCE") return "Single visit — no automatic follow-up";
  if (rule.rule_type === "RECURRING") {
    return rule.interval_days
      ? `Every ${rule.interval_days} day${rule.interval_days === 1 ? "" : "s"}`
      : "Fixed interval";
  }
  if (rule.rule_type === "VARIABLE_SEQUENCE") {
    return rule.intervals_sequence?.length
      ? `Variable sequence: ${rule.intervals_sequence.join(", ")} days`
      : "Variable sequence (no intervals set)";
  }
  return "-";
}
