import { LabRequest } from "@/src/components/lab-dashboard/home/types";
import { EnrichedLabTest } from "./labTestContext";

export const labBadgeColors = {
  Routine: { bg: "#E2E7FF", text: "#046C3F" },
  Normal: { bg: "#E2E7FF", text: "#046C3F" },
  Urgent: { bg: "#FDE8E8", text: "#F33131" },
  Pending: { bg: "#FFF4E5", text: "#1F2937" },
  Partial: { bg: "#E2E7FF", text: "#046C3F" },
  Processing: { bg: "#E2E7FF", text: "#046C3F" },
  "In-Progress": { bg: "#E2E7FF", text: "#046C3F" },
  "Sample-Collected": { bg: "#E2E7FF", text: "#046C3F" },
  Completed: { bg: "#DFF3EA", text: "#039855" },
  Ready: { bg: "#DFF3EA", text: "#039855" },
  "Result-Ready": { bg: "#DFF3EA", text: "#039855" },
  Cancelled: { bg: "#FDE8E8", text: "#F33131" },
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export function printLabRequest(request: LabRequest) {
  const printableRows = [
    ["Request ID", request.request_id],
    ["Patient", request.patient_name],
    ["Patient ID", request.patient_display_id],
    ["Requested By", request.requested_by_name],
    ["Priority", request.priority],
    ["Status", request.status],
    ["Clinical Notes", request.clinical_notes || "-"],
    ["Date", formatDate(request.created_at)],
  ];

  const testsRows = (request.tests || []).map((test) => [
    test.test_name,
    test.test_status,
    test.result_value ? `${test.result_value} ${test.result_unit || ""}` : "-",
  ]);

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return false;
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Lab Request - ${escapeHtml(request.request_id)}</title>
        <style>
          body { color: #111827; font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #046C3F; font-size: 24px; margin-bottom: 4px; }
          h2 { color: #046C3F; font-size: 18px; margin-top: 32px; margin-bottom: 12px; }
          p { color: #4B5563; margin-top: 0; }
          table { border-collapse: collapse; margin-top: 24px; width: 100%; }
          th, td { border: 1px solid #E5E7EB; padding: 12px; text-align: left; }
          th { background: #F6F7FC; width: 32%; }
          .tests-table th { width: auto; }
        </style>
      </head>
      <body>
        <h1>Lab Request: ${escapeHtml(request.request_id)}</h1>
        <p>Generated from PHC Lab Dashboard</p>
        <table>
          <tbody>
            ${printableRows
              .map(
                ([label, value]) =>
                  `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
        
        <h2>Requested Tests</h2>
        <table class="tests-table">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Status</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            ${testsRows
              .map(
                ([name, status, result]) =>
                  `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(status)}</td><td>${escapeHtml(result)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
}

export function printLabResult(test: EnrichedLabTest) {
  const printableRows = [
    ["Test Name", test.test_name],
    ["Request ID", test.request_id || "-"],
    ["Patient", test.patient_name || "-"],
    ["Patient ID", test.patient_display_id || "-"],
    ["Status", test.test_status],
    ["Result Value", test.result_value || "-"],
    ["Result Unit", test.result_unit || "-"],
    ["Test Method", test.test_method || "-"],
    ["Interpretation", test.result_interpretation || "-"],
    ["Result Notes", test.result_notes || "-"],
    ["Result Date", formatDate(test.result_date)],
    ["Requested By", test.requested_by_name || "-"],
  ];

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return false;
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Lab Result - ${escapeHtml(test.test_name)}</title>
        <style>
          body { color: #111827; font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #046C3F; font-size: 24px; margin-bottom: 4px; }
          p { color: #4B5563; margin-top: 0; }
          table { border-collapse: collapse; margin-top: 24px; width: 100%; }
          th, td { border: 1px solid #E5E7EB; padding: 12px; text-align: left; }
          th { background: #F6F7FC; width: 32%; }
        </style>
      </head>
      <body>
        <h1>Lab Result: ${escapeHtml(test.test_name)}</h1>
        <p>Generated from PHC Lab Dashboard</p>
        <table>
          <tbody>
            ${printableRows
              .map(
                ([label, value]) =>
                  `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
}
