import { Baby, Syringe } from "lucide-react";
import {
  ImmunizationRow,
  ListContainer,
  MaternalAlertRow,
} from "../../generic/stats/ListCards";
import { StatsSection } from "../../generic/stats/StatsSection";

export default function NurseHome() {
  return (
    <div className="p-4">
      <StatsSection />

      {/* Bottom Lists Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Maternal Alerts Card */}
        <ListContainer title="Maternal Alerts" icon={<Baby size={24} />}>
          <MaternalAlertRow
            name="Blessing Nwachukwu - ANC visit due today"
            description="28 weeks · 4th antenatal visit"
            status="ANC Due"
            variant="green"
          />
          <MaternalAlertRow
            name="Maryam Lawal"
            description="High-risk pregnancy, BP elevated"
            status="High risk"
            variant="red"
          />
          <MaternalAlertRow
            name="Blessing Uche"
            description="Day 6 review"
            status="Postnatal"
            variant="blue"
          />
          <MaternalAlertRow
            name="Blessing Uche"
            description="High-risk pregnancy, BP elevated"
            status="Urgent"
            variant="red"
          />
        </ListContainer>

        {/* Immunization Due Card */}
        <ListContainer title="Immunization Due" icon={<Syringe size={24} />}>
          <ImmunizationRow
            name="Ibrahim Musa"
            description="Measles 2nd dose · 6 yrs"
            dateStatus="Today"
          />
          <ImmunizationRow
            name="Baby Eze"
            description="Penta-3 + OPV-3 · 14 wks"
            dateStatus="Today"
          />
          <ImmunizationRow
            name="Baby Bello"
            description="Penta-2 + Rota · 10 wks"
            dateStatus="Tomorrow"
          />
          <ImmunizationRow
            name="Baby Emeka"
            description="Penta-2 + Rota · 10 wks"
            dateStatus="Tomorrow"
          />
        </ListContainer>
      </div>
    </div>
  );
}
