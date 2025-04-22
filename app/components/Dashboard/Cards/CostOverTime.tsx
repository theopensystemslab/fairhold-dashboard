import { useState, useEffect, useMemo } from "react";
import GraphCard from "../../ui/GraphCard";
import CostOverTimeWrapper, { TenureType } from "../../graphs/CostOverTimeWrapper";
import { Drawer } from "../../ui/Drawer";
import TenureSelector from "../../ui/TenureSelector";
import TenureSelectorMobile from "../../ui/TenureSelectorMobile";
import { DashboardProps } from "../../ui/Dashboard";
import { formatValue } from "@/app/lib/format";
import ReactMarkdown from 'react-markdown';
import explanationContent from '../Help/CostOverTime.md';
import { DEFAULT_FORECAST_PARAMETERS } from "@/app/models/ForecastParameters";
import { SOCIAL_RENT_ADJUSTMENT_FORECAST } from "@/app/models/constants";
import { remark } from "remark";
import { visit } from 'unist-util-visit';
import { TENURE_COLORS_DARK, TENURE_COLORS_LIGHT, TextNode } from "./types";

const TENURES = ['marketPurchase', 'marketRent', 'fairholdLandPurchase', 'fairholdLandRent', 'socialRent'] as const
const TENURE_LABELS = {
  marketPurchase: 'Freehold',
  marketRent: 'Private rent',
  fairholdLandPurchase: 'Fairhold /LP',
  fairholdLandRent: 'Fairhold /LR',
  socialRent: 'Social rent'
}



export const CostOverTime: React.FC<DashboardProps> = ({ processedData }) => {
  const [selectedTenure, setSelectedTenure] = useState<TenureType>('marketPurchase');
  const lifetimeTotal = processedData.lifetime.lifetimeData[processedData.lifetime.lifetimeData.length - 1].cumulativeCosts[selectedTenure];
  const [processedContent, setProcessedContent] = useState('');
  
  const constructionPriceGrowthPerYear = DEFAULT_FORECAST_PARAMETERS.constructionPriceGrowthPerYear * 100;
  const rentGrowthPerYear = DEFAULT_FORECAST_PARAMETERS.rentGrowthPerYear * 100;
  const propertyPriceGrowthPerYear = DEFAULT_FORECAST_PARAMETERS.propertyPriceGrowthPerYear * 100;
  const incomeGrowthPerYear = (DEFAULT_FORECAST_PARAMETERS.incomeGrowthPerYear * 100).toString();
  // We don't hard code the variables in markdown because then we'd have to maintain them in multiple places
  const replacements = useMemo(() => ({
    constructionPriceGrowthPerYear: constructionPriceGrowthPerYear.toString(),
    rentGrowthPerYear: rentGrowthPerYear.toString(),
    propertyPriceGrowthPerYear: propertyPriceGrowthPerYear.toString(),
    incomeGrowthPerYear: incomeGrowthPerYear.toString(),
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
          <span style={{ color: TENURE_COLORS_DARK[selectedTenure] }}>
            {formatValue(lifetimeTotal)}
          </span>
        </span>
      }
      >
      <div className="flex flex-col h-full w-full md:w-3/4 justify-between">
        <div className="flex gap-2 mb-4">
            <div className="block md:hidden w-full">
              <TenureSelectorMobile
                selectedTenure={selectedTenure}
                onChange={(tenure) => setSelectedTenure(tenure as TenureType)}
                tenures={[...TENURES]}
                tenureLabels={TENURE_LABELS}
                tenureColorsDark={TENURE_COLORS_DARK}
                tenureColorsLight={TENURE_COLORS_LIGHT}
              />
            </div>

            <div className="hidden md:flex gap-2">
              {TENURES.map((tenure) => (
                <TenureSelector
                  key={tenure}
                  isSelected={selectedTenure === tenure}
                  onClick={() => setSelectedTenure(tenure)}
                  tenureType={tenure}
                  tenureColorsDark={TENURE_COLORS_DARK}
                  tenureColorsLight={TENURE_COLORS_LIGHT}
                >
                  {TENURE_LABELS[tenure]}
                </TenureSelector>
              ))}
            </div>
          </div>

        <CostOverTimeWrapper 
          household={processedData}
          tenure={selectedTenure}
        />

        <Drawer
          buttonTitle={`Assuming ${constructionPriceGrowthPerYear}% house price inflation and ${propertyPriceGrowthPerYear}% general inflation. Find out more about how we calculated these`}
          title="How we calculated these figures"
          description={<div className="space-y-4"><ReactMarkdown>{processedContent}</ReactMarkdown></div>}
        />
      </div>
    </GraphCard>
  );
};