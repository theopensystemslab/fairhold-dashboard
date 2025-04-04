import GraphCard from "../../ui/GraphCard";
import HowMuchFHCostWrapper from "../../graphs/HowMuchFHCostWrapper";
import { Drawer } from "../../ui/Drawer";
import { Household } from "@/app/models/Household";
import ReactMarkdown from 'react-markdown';
import explanationContent from '../Help/HowMuchFHCost.md';

interface DashboardProps {
  data: Household;
}

export const HowMuchFHCost: React.FC<DashboardProps> = ({ data }) => {
  const fairholdPercentage = Math.round((data.tenure.fairholdLandPurchase.discountedLandPrice + data.property.depreciatedBuildPrice) // shows FairholdLP
    / data.property.averageMarketPrice * 100)

  return (
    <GraphCard
      title="How much would a home cost?"
      subtitle={
              <span>
                A Fairhold home could cost 
                <span style={{ color: "rgb(var(--fairhold-equity-color-rgb))" }} className="font-semibold">
                  {` ${fairholdPercentage}% `}
                </span>
                of its freehold price.
              </span>
            }
          >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <HowMuchFHCostWrapper household={data} />
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description={<ReactMarkdown className="space-y-4">{explanationContent}</ReactMarkdown>}
        />
      </div>
    </GraphCard>
  );
};
