import { useState } from "react";
import GraphCard from "../../ui/GraphCard";
import ResaleValueWrapper from "../../graphs/ResaleValueWrapper";
import { Drawer } from "../../ui/Drawer";
import { Household } from "@/app/models/Household";
import TenureSelector from "../../ui/TenureSelector";

const TENURES = ['fairholdLandPurchase', 'fairholdLandRent'] as const;
type Tenure = (typeof TENURES)[number];

interface DashboardProps {
  data: Household;
}

export const ResaleValue: React.FC<DashboardProps> = ({ data }) => {
  const [selectedTenure, setSelectedTenure] = useState<Tenure>('fairholdLandPurchase');

  return (
    <GraphCard
      title="How much could I sell it for?"
      subtitle="Estimated sale price at any time"
    >
      <div className="flex flex-col h-full w-3/4 justify-between">
      <div className="flex gap-2 mb-4">
          {TENURES.map(tenure => ( 
            <TenureSelector 
              key={tenure} 
              isSelected={selectedTenure === tenure} 
              tenureType={tenure}
              onClick={() => setSelectedTenure(tenure)} 
            > 
              {`Fairhold ${tenure === 'fairholdLandPurchase' ? 'Land Purchase' : 'Land Rent'}`} 
            </TenureSelector> 
          ))} 
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
