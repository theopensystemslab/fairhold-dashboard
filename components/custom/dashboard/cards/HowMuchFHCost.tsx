import GraphCard from "../../ui/GraphCard";
import HowMuchFHCostWrapper from "../graphs/HowMuchFHCostWrapper";
import { Drawer } from "../../ui/Drawer";
import { Household } from "@/models/Household";
import ReactMarkdown from 'react-markdown';
import explanationContent from '@components/custom/dashboard/help/HowMuchFHCost.md';

interface DashboardProps {
  data: Household;
}

export const HowMuchFHCost: React.FC<DashboardProps> = ({ data }) => {
  const fairholdPercentage = Math.round((data.tenure.fairholdLandPurchase.discountedLandPrice + data.property.depreciatedBuildPrice) // shows FairholdLP
    / data.property.averageMarketPrice * 100)

  const subtitle = data.property.landPrice < 0 ? (
    <span>
      Here, freehold homes are worth less than their build cost.&nbsp;
      <span style={{ color: "rgb(var(--not-viable-dark-color-rgb))" }}>
        Conventional development is unviable
      </span>
      &nbsp;and Fairhold homes may be hard to sell or finance for their full value. While less needed here, £1 Fairhold plots could help revive the local economy.
    </span>
  ) : (
    <span>
      A Fairhold home could cost 
      <span style={{ color: "rgb(var(--fairhold-equity-color-rgb))" }} className="font-semibold">
        {` ${fairholdPercentage}% `}
      </span>
      of its freehold price.
    </span>
  );
  return (
    <GraphCard
      title="How much would a home cost?"
      subtitle={subtitle}
          >
      <div className="flex flex-col h-full w-full justify-between">
        <HowMuchFHCostWrapper household={data} />
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description={<div className="space-y-4"><ReactMarkdown>{explanationContent}</ReactMarkdown></div>}
        />
      </div>
    </GraphCard>
  );
};
