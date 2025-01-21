import { useState } from "react";
import GraphCard from "../../ui/GraphCard";
import CostOverTimeWrapper, { TenureType } from "../../graphs/CostOverTimeWrapper";
import { Drawer } from "../../ui/Drawer";
import { Household } from "@/app/models/Household";
import TenureSelector from "../../ui/TenureSelector";

interface DashboardProps {
  data: Household;
}

export const CostOverTime: React.FC<DashboardProps> = ({ data }) => {
  const [selectedTenure, setSelectedTenure] = useState<TenureType>('marketPurchase');

  return (
    <GraphCard
      title="How would the cost change over my life?"
      subtitle="Over x years, the home would cost £y" // TODO: interpolate
    >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <div className="flex gap-2 mb-4">
          <TenureSelector 
            isSelected={selectedTenure === 'marketPurchase'}
            onClick={() => setSelectedTenure('marketPurchase')}
          >
            Market Purchase
          </TenureSelector>
          <TenureSelector 
            isSelected={selectedTenure === 'marketRent'}
            onClick={() => setSelectedTenure('marketRent')}
          >
            Market Rent
          </TenureSelector>
          <TenureSelector 
            isSelected={selectedTenure === 'fairholdLandPurchase'}
            onClick={() => setSelectedTenure('fairholdLandPurchase')}
          >
            Fairhold Land Purchase
          </TenureSelector>
          <TenureSelector 
            isSelected={selectedTenure === 'fairholdLandRent'}
            onClick={() => setSelectedTenure('fairholdLandRent')}
          >
            Fairhold Land Rent
          </TenureSelector>
          <TenureSelector 
            isSelected={selectedTenure === 'socialRent'}
            onClick={() => setSelectedTenure('socialRent')}
          >
            Social Rent
          </TenureSelector>
        </div>

        <CostOverTimeWrapper 
          household={data}
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