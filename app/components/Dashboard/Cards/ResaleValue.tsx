import { useState } from "react";
import GraphCard from "../../ui/GraphCard";
import ResaleValueWrapper from "../../graphs/ResaleValueWrapper";
import { Drawer } from "../../ui/Drawer";
import { Household } from "@/app/models/Household";
import TenureSelector from "../../ui/TenureSelector";
import ReactMarkdown from 'react-markdown';
import explanationContent from '../Help/ResaleValue.md';
import { DEFAULT_FORECAST_PARAMETERS } from "@/app/models/ForecastParameters";

const TENURES = ['fairholdLandPurchase', 'fairholdLandRent'] as const;
type Tenure = (typeof TENURES)[number];

interface DashboardProps {
  data: Household;
}

export const ResaleValue: React.FC<DashboardProps> = ({ data }) => {
    // We don't want to hard code the variables in markdown because then we'd have to maintain them in multiple places
    const processedContent = explanationContent.replace(
      `{{constructionPriceGrowthPerYear}}`,
      (DEFAULT_FORECAST_PARAMETERS.constructionPriceGrowthPerYear * 100).toString()
    )

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
          description={<ReactMarkdown className="space-y-4">{processedContent}</ReactMarkdown>}
        />
      </div>
    </GraphCard>
  );
};
