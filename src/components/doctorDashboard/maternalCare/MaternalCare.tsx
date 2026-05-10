"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import DoctorHeader from "@/src/components/doctorDashboard/generics/Header";
import { useEpisodeDetails } from "@/src/hooks/nurses/use-maternal-care";
import { AncVisitList } from "./AncVisitList";
import { PncVisitList } from "./PncVisitList";
import { CareTab } from "./types";

export default function MaternalCareEpisodeDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const episodeId = params.id as string;

  const [tab, setTab] = useState<CareTab>("anc");

  const { data: episode } = useEpisodeDetails(episodeId);

  const handleTabChange = (nextTab: CareTab) => {
    setTab(nextTab);
    router.push(pathname, { scroll: false });
  };

  const title =
    tab === "pnc" ? "Postnatal Care (PNC)" : "ANC (Antenatal Care) Visits";

  const subtitle =
    tab === "pnc"
      ? "Track maternal and newborn health after delivery"
      : "Manage prenatal care for pregnant women";

  return (
    <div className="min-h-screen bg-[#F6F7FC]">
      <DoctorHeader
        title="Episode Details"
        breadcrumbs={[
          { label: "Maternal Care", href: "/doctor-dashboard/maternal-care" },
          { label: episode?.episode_id || "Episode Details" },
        ]}
      />

      <div className="px-4 py-6 sm:px-6 lg:py-8">
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
          <Link
            href={`/doctor-dashboard/maternal-care/${episodeId}/${tab === "anc" ? "anc" : "pnc"}/new`}
            className="inline-flex h-11 items-center justify-center gap-3 rounded-xl bg-[#046C3F] px-7 text-base font-medium text-white transition-colors hover:bg-[#035a34]"
          >
            <Plus size={20} />
            {tab === "anc" ? "New ANC Visit" : "New Postnatal Visit"}
          </Link>
        </div>

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

        {tab === "anc" ? (
          <AncVisitList episodeId={episodeId} />
        ) : (
          <PncVisitList episodeId={episodeId} />
        )}
      </div>
    </div>
  );
}
