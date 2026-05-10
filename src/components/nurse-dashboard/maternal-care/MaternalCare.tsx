"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import NurseBackButton from "@/src/components/nurse-dashboard/generics/NurseBackButton";
import NurseDashboardHeader from "@/src/components/nurse-dashboard/generics/NurseDashboardHeader";

import { useEpisodeDetails } from "@/src/hooks/nurses/use-maternal-care";

import { AncVisitList } from "./AncVisitList";
import { PncVisitList } from "./PncVisitList";
import { AncVisitForm } from "./AncVisitForm";
import { PncVisitForm } from "./PncVisitForm";
import { SuccessToast } from "../../generic/ui/SuccessToast";
import { CareTab, INITIAL_FORM, MaternalForm, Mode } from "./type";

export default function MaternalCareEpisodeDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const episodeId = params.id as string;

  const [tab, setTab] = useState<CareTab>("anc");
  const [mode, setMode] = useState<Mode>("list");
  const [form, setForm] = useState<MaternalForm>(INITIAL_FORM);
  const [toast, setToast] = useState("");

  const { data: episode } = useEpisodeDetails(episodeId);

  const inForm = mode !== "list";

  useEffect(() => {
    if (episode && mode !== "list") {
      setForm((current) => ({
        ...current,
        patientName: episode.patient_name,
        patientId: episode.patient_display_id,
        lmp: episode.last_menstrual_period,
        edd: episode.expected_date_of_delivery,
        gravida: String(episode.gravida),
        parity: String(episode.parity),
        livingChildren: String(episode.living_children),
      }));
    }
  }, [episode, mode]);

  const update = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleTabChange = (nextTab: CareTab) => {
    setTab(nextTab);
    setMode("list");
    router.push(pathname, { scroll: false });
  };

  const handleAncSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast("ANC visit registered successfully");
    setMode("list");
    setForm(INITIAL_FORM);
  };

  const handlePncSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast("Postnatal record saved successfully");
    setMode("list");
    setForm(INITIAL_FORM);
  };

  const title =
    mode === "ancForm"
      ? "ANC Registration"
      : tab === "pnc"
        ? "Postnatal Care (PNC)"
        : "ANC (Antenatal Care) Visits";

  const subtitle =
    mode === "ancForm"
      ? "Capture antenatal care visit information"
      : tab === "pnc"
        ? "Track maternal and newborn health after delivery"
        : "Manage prenatal care for pregnant women";

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <NurseDashboardHeader
        title="Episode Details"
        breadcrumbs={[
          { label: "Maternal Care", href: "/nurse-dashboard/maternal-care" },
          { label: episode?.episode_id || "Episode Details" },
          ...(inForm && tab === "anc" ? [{ label: "New ANC Visit" }] : []),
          ...(inForm && tab === "pnc" ? [{ label: "New PNC Visit" }] : []),
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
        {inForm && <NurseBackButton onClick={() => setMode("list")} />}

        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-semibold text-black sm:text-3xl">
              {title}
            </h2>
            <p className="text-base text-[#3F3F46]">
              {subtitle}{" "}
              {episode &&
                `- Patient: ${episode.patient_name} (${episode.patient_display_id})`}
            </p>
          </div>
          {!inForm && (
            <button
              type="button"
              onClick={() => setMode(tab === "anc" ? "ancForm" : "pncForm")}
              className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
            >
              <Plus size={20} />
              {tab === "anc" ? "New ANC Visit" : "New Postnatal Visit"}
            </button>
          )}
        </div>

        {!inForm && (
          <div className="mb-6 grid w-full max-w-[400px] grid-cols-2 overflow-hidden rounded-lg bg-[#EEF5F3]">
            <button
              type="button"
              onClick={() => handleTabChange("anc")}
              className={`h-10 px-4 text-base font-medium transition-colors ${
                tab === "anc"
                  ? "bg-[#046C3F] text-white"
                  : "text-[#62636C] hover:bg-[#DDF0E8]"
              }`}
            >
              ANC Visits
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("pnc")}
              className={`h-10 px-4 text-base font-medium transition-colors ${
                tab === "pnc"
                  ? "bg-[#046C3F] text-white"
                  : "text-[#62636C] hover:bg-[#DDF0E8]"
              }`}
            >
              Postnatal Care
            </button>
          </div>
        )}

        {mode === "ancForm" ? (
          <AncVisitForm
            form={form}
            update={update}
            onCancel={() => setMode("list")}
            onSubmit={handleAncSubmit}
          />
        ) : mode === "pncForm" ? (
          <PncVisitForm
            form={form}
            update={update}
            onCancel={() => setMode("list")}
            onSubmit={handlePncSubmit}
          />
        ) : tab === "anc" ? (
          <AncVisitList episodeId={episodeId} />
        ) : (
          <PncVisitList episodeId={episodeId} />
        )}
      </div>

      {toast && <SuccessToast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
