import { useState } from "react";
import GraphCard from "../../ui/GraphCard";
import CostOverTimeWrapper, { TenureType } from "../../graphs/CostOverTimeWrapper";
import { Drawer } from "../../ui/Drawer";
import TenureSelector from "../../ui/TenureSelector";
import { DashboardProps } from "../../ui/Dashboard";
import { DEFAULT_FORECAST_PARAMETERS } from "@/app/models/ForecastParameters";
import { formatValue } from "@/app/lib/format";

const TENURES = ['marketPurchase', 'marketRent', 'fairholdLandPurchase', 'fairholdLandRent', 'socialRent'] as const
const TENURE_LABELS = {
  marketPurchase: 'Freehold',
  marketRent: 'Private rent',
  fairholdLandPurchase: 'Fairhold Land Purchase',
  fairholdLandRent: 'Fairhold Land Rent',
  socialRent: 'Social rent'
}

const TENURE_COLORS = {
  marketPurchase: 'rgb(var(--freehold-equity-color-rgb))',
  marketRent: 'rgb(var(--private-rent-land-color-rgb))',
  fairholdLandPurchase: 'rgb(var(--fairhold-equity-color-rgb))',
  fairholdLandRent: 'rgb(var(--fairhold-equity-color-rgb))',
  socialRent: 'rgb(var(--social-rent-land-color-rgb))'
} as const;

export const CostOverTime: React.FC<DashboardProps> = ({ processedData }) => {
  const [selectedTenure, setSelectedTenure] = useState<TenureType>('marketPurchase');
  const lifetimeTotal = processedData.lifetime.lifetimeData[processedData.lifetime.lifetimeData.length - 1].cumulativeCosts[selectedTenure];

  return (
    <GraphCard
      title="How would the cost change over my life?"
      subtitle={
        <span>
          Over {DEFAULT_FORECAST_PARAMETERS.yearsForecast} years, the home would cost{' '}
          <span style={{ color: TENURE_COLORS[selectedTenure] }}>
            {formatValue(lifetimeTotal)}
          </span>
        </span>
      }
      >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <div className="flex gap-2 mb-4">
        {TENURES.map(tenure => (
          <TenureSelector
            key={tenure}
            isSelected={selectedTenure === tenure}
            onClick={() => setSelectedTenure(tenure)}
            tenureType={tenure}
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