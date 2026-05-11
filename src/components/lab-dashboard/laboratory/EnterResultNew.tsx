"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import LabDashboardHeader from "@/src/components/lab-dashboard/generics/LabDashboardHeader";
import LabBackButton from "@/src/components/lab-dashboard/generics/LabBackButton";
import { LabRequest, LabTest } from "@/src/components/lab-dashboard/home/types";
import {
  useAdvancedLabRequests,
  useLabRequestById,
  useLabTestById,
  useSubmitLabTestResult,
} from "@/src/hooks/laboratory/use-laboratory";
import EnterResultForm from "./EnterResultForm";
import { buildLabTestContextMap, enrichLabTest } from "./labTestContext";

export default function NewLabResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get("test_id") || "";
  const requestId = searchParams.get("request_id") || "";
  const [toast, setToast] = useState<string | null>(null);

  const { data: test, isLoading } = useLabTestById(testId);
  const { data: request, isLoading: isLoadingRequest } =
    useLabRequestById(requestId);
  const { data: requestContextData, isLoading: isLoadingContext } =
    useAdvancedLabRequests({
      page: 1,
      page_size: 200,
    });
  const submitResultMutation = useSubmitLabTestResult();

  const fallbackRequest = useMemo(
    () =>
      (requestContextData?.results || []).find((labRequest: LabRequest) =>
        labRequest.tests?.some((requestTest) => requestTest.id === testId),
      ),
    [requestContextData?.results, testId],
  );
  const selectedRequest = (request as LabRequest | undefined) || fallbackRequest;
  const enrichedTest = useMemo(() => {
    if (!test) return undefined;
    const contextMap = buildLabTestContextMap(
      selectedRequest ? [selectedRequest] : requestContextData?.results || [],
    );
    return enrichLabTest(test as LabTest, contextMap);
  }, [requestContextData?.results, selectedRequest, test]);

  const handleCancel = () => {
    router.back();
  };

  const loadingContext = requestId ? isLoadingRequest : isLoadingContext;

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <LabDashboardHeader
        title="Laboratory"
        breadcrumbs={[
          { label: "Laboratory", href: "/lab-dashboard/laboratory" },
          { label: "Lab results" },
          { label: "Enter New Result" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        <LabBackButton onClick={handleCancel} />

        <div className="mb-7 mt-4">
          <h1 className="text-2xl font-semibold text-black sm:text-3xl">
            Enter Lab Result
          </h1>
        </div>

        {!testId ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Select a lab test before entering a result.
          </div>
        ) : isLoading || loadingContext ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Loading lab test...
          </div>
        ) : !enrichedTest ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500">
            Lab test not found.
          </div>
        ) : (
          <EnterResultForm
            test={enrichedTest}
            onCancel={handleCancel}
            isSubmitting={submitResultMutation.isPending}
            onSubmit={(payload) => {
              submitResultMutation.mutate(
                { id: testId, payload },
                {
                  onSuccess: () => {
                    setToast("Result submitted successfully.");
                    setTimeout(() => {
                      setToast(null);
                      router.push("/lab-dashboard/laboratory");
                    }, 1200);
                  },
                  onError: () => {
                    setToast("Could not submit result. Please try again.");
                  },
                },
              );
            }}
          />
        )}
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex w-[350px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded border border-gray-200 bg-white p-4 shadow-xl">
          <span className="mt-0.5 h-6 w-6 rounded-lg border border-[#9ADDBA] bg-[#E8F7F0]" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900">{toast}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-gray-900">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
