import { useState } from "react";
import GraphCard from "../../ui/GraphCard";
import ResaleValueWrapper from "../../graphs/ResaleValueWrapper";
import { Drawer } from "../../ui/Drawer";
import { Household } from "@/app/models/Household";
import TenureSelector from "../../ui/TenureSelector";

interface DashboardProps {
  data: Household;
}

export const ResaleValue: React.FC<DashboardProps> = ({ data }) => {
  const [selectedTenure, setSelectedTenure] = useState<'landPurchase' | 'landRent'>('landPurchase');

  return (
    <GraphCard
      title="How much could I sell it for?"
      subtitle="Estimated sale price at any time"
    >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <div className="flex gap-2 mb-4">
          <TenureSelector 
            isSelected={selectedTenure === 'landPurchase'}
            onClick={() => setSelectedTenure('landPurchase')}
          >
            Fairhold Land Purchase
          </TenureSelector>
          <TenureSelector 
            isSelected={selectedTenure === 'landRent'}
            onClick={() => setSelectedTenure('landRent')}
          >
            Fairhold Land Rent
          </TenureSelector>
        </div>
        
        <ResaleValueWrapper 
          household={data}
          tenure={selectedTenure}
        />
        
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum minus eligendi fugit nulla officia dolor inventore nemo ex quo quia, laborum qui ratione aperiam, pariatur explicabo ipsum culpa impedit ad!"
        />
      </div>
    </GraphCard>
  );
};
