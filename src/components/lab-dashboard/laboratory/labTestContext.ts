import {
  LabRequest,
  LabTest,
} from "@/src/components/lab-dashboard/home/types";

export type LabTestRequestContext = {
  lab_request_uuid: string;
  request_id: string;
  patient: string;
  patient_name: string;
  patient_display_id: string;
  requested_by_name: string;
  priority: string;
  clinical_notes: string;
  created_at: string;
};

export type EnrichedLabTest = LabTest & Partial<LabTestRequestContext>;

export function buildLabTestContextMap(
  requests: LabRequest[] = [],
): Map<string, LabTestRequestContext> {
  const contextMap = new Map<string, LabTestRequestContext>();

  requests.forEach((request) => {
    request.tests?.forEach((test) => {
      contextMap.set(test.id, {
        lab_request_uuid: request.id,
        request_id: request.request_id,
        patient: request.patient,
        patient_name: request.patient_name,
        patient_display_id: request.patient_display_id,
        requested_by_name: request.requested_by_name,
        priority: request.priority,
        clinical_notes: request.clinical_notes,
        created_at: request.created_at,
      });
    });
  });

  return contextMap;
}

export function enrichLabTest(
  test: LabTest,
  contextMap: Map<string, LabTestRequestContext>,
): EnrichedLabTest {
  return {
    ...test,
    ...contextMap.get(test.id),
  };
}

export function enrichLabTests(
  tests: LabTest[],
  requests: LabRequest[] = [],
): EnrichedLabTest[] {
  const contextMap = buildLabTestContextMap(requests);
  return tests.map((test) => enrichLabTest(test, contextMap));
}

export function findRequestForTest(
  requests: LabRequest[] = [],
  testId: string,
) {
  return requests.find((request) =>
    request.tests?.some((test) => test.id === testId),
  );
}
