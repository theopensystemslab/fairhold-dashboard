import { useState } from "react";
import GraphCard from "../../ui/GraphCard";
import CostOverTimeWrapper, { TenureType } from "../../graphs/CostOverTimeWrapper";
import { Drawer } from "../../ui/Drawer";
import TenureSelector from "../../ui/TenureSelector";
import { DashboardProps } from "../../ui/Dashboard";

const TENURES = ['marketPurchase', 'marketRent', 'fairholdLandPurchase', 'fairholdLandRent', 'socialRent'] as const
const TENURE_LABELS = {
  marketPurchase: 'Freehold',
  marketRent: 'Private rent',
  fairholdLandPurchase: 'Fairhold Land Purchase',
  fairholdLandRent: 'Fairhold Land Rent',
  socialRent: 'Social rent'
}

export const CostOverTime: React.FC<DashboardProps> = ({ processedData }) => {
  const [selectedTenure, setSelectedTenure] = useState<TenureType>('marketPurchase');

  return (
    <GraphCard
      title="How would the cost change over my life?"
      subtitle="Over x years, the home would cost £y" // TODO: interpolate
    >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <div className="flex gap-2 mb-4">
        {TENURES.map(tenure => (
          <TenureSelector
            key={tenure}
            isSelected={selectedTenure === tenure}
            onClick={() => setSelectedTenure(tenure)}
          >
            {TENURE_LABELS[tenure]}
          </TenureSelector>
        ))}
        </div>

        <CostOverTimeWrapper 
          household={processedData}
          tenure={selectedTenure}
        />

        <Drawer
          buttonTitle="Find out more about how we calculated these"
          title="How we calculated these figures"
          description="..."
        />
      </div>
    </GraphCard>
  );
};