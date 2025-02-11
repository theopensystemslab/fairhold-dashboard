import { useState, useEffect, useMemo } from "react";
import GraphCard from "../../ui/GraphCard";
import CostOverTimeWrapper, { TenureType } from "../../graphs/CostOverTimeWrapper";
import { Drawer } from "../../ui/Drawer";
import TenureSelector from "../../ui/TenureSelector";
import { DashboardProps } from "../../ui/Dashboard";
import { formatValue } from "@/app/lib/format";
import ReactMarkdown from 'react-markdown';
import explanationContent from '../Help/CostOverTime.md';
import { DEFAULT_FORECAST_PARAMETERS } from "@/app/models/ForecastParameters";
import { SOCIAL_RENT_ADJUSTMENT_FORECAST } from "@/app/models/constants";
import { remark } from "remark";
import { visit } from 'unist-util-visit';
import type { TextNode } from "./types";

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
  const [processedContent, setProcessedContent] = useState('');
  
  // We don't hard code the variables in markdown because then we'd have to maintain them in multiple places
  const replacements = useMemo(() => ({
    constructionPriceGrowthPerYear: (DEFAULT_FORECAST_PARAMETERS.constructionPriceGrowthPerYear * 100).toString(),
    rentGrowthPerYear: (DEFAULT_FORECAST_PARAMETERS.rentGrowthPerYear * 100).toString(),
    propertyPriceGrowthPerYear: (DEFAULT_FORECAST_PARAMETERS.propertyPriceGrowthPerYear * 100).toString(),
    incomeGrowthPerYear: (DEFAULT_FORECAST_PARAMETERS.propertyPriceGrowthPerYear * 100).toString(),
    SOCIAL_RENT_ADJUSTMENT_FORECAST: (SOCIAL_RENT_ADJUSTMENT_FORECAST * 100).toString()
  }), []);

  useEffect(() => {
    const processMarkdown = async () => {
      const result = await remark()
        .use(() => (tree) => {
          visit(tree, 'text', (node: TextNode) => {
            let value = node.value;
            Object.entries(replacements).forEach(([key, replacement]) => {
              value = value.replace(`{{${key}}}`, replacement);
            });
            node.value = value;
          });
        })
        .process(explanationContent);
      setProcessedContent(result.toString());
    };
    
    processMarkdown();
  }, [replacements]);

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
          description={<ReactMarkdown className="space-y-4">{processedContent}</ReactMarkdown>}
        />
      </div>
    </GraphCard>
  );
};