import { useState, useEffect, useMemo } from "react";
import GraphCard from "../ui/GraphCard";
import ResaleValueWrapper from "../graphs/ResaleValueWrapper";
import { Drawer } from "../../../components/ui/Drawer";
import { Household } from "@/app/models/Household";
import TenureSelector from "../ui/TenureSelector";
import TenureSelectorMobile from "../ui/TenureSelectorMobile";
import ReactMarkdown from 'react-markdown';
import explanationContent from '../help/ResaleValue.md';
import { DEFAULT_FORECAST_PARAMETERS } from "@/app/models/ForecastParameters";
import { remark } from "remark";
import { visit } from 'unist-util-visit';
import { TENURE_COLORS_DARK, TENURE_COLORS_LIGHT, TextNode } from "./types";

const TENURES = ['fairholdLandPurchase', 'fairholdLandRent'] as const;
const TENURE_LABELS = {
  fairholdLandPurchase: 'Fairhold /LP',
  fairholdLandRent: 'Fairhold /LR'
}
type Tenure = (typeof TENURES)[number];

interface DashboardProps {
  data: Household;
}

export const ResaleValue: React.FC<DashboardProps> = ({ data }) => {
  const [selectedTenure, setSelectedTenure] = useState<Tenure>('fairholdLandPurchase');
  const [processedContent, setProcessedContent] = useState('');
  
  // We don't want to hard code the variables in markdown because then we'd have to maintain them in multiple places
  const replacements = useMemo(() => ({
    constructionPriceGrowthPerYear: (DEFAULT_FORECAST_PARAMETERS.constructionPriceGrowthPerYear * 100).toString()
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
      title="How much could I sell it for?"
      subtitle="With Fairhold, you can’t sell the land for more than you bought it for (adjusted for inflation). The value of the building is based on its condition."
    >
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex gap-2 mb-4">
          <div className="block md:hidden w-full">
            <TenureSelectorMobile
              selectedTenure={selectedTenure}
              onChange={(tenure) => setSelectedTenure(tenure as Tenure)}
              tenures={[...TENURES]}
              tenureLabels={TENURE_LABELS}
              tenureColorsDark={TENURE_COLORS_DARK}
              tenureColorsLight={TENURE_COLORS_LIGHT}
            />
          </div>

          <div className="hidden md:flex gap-2">
            {TENURES.map(tenure => ( 
              <TenureSelector 
                key={tenure} 
                isSelected={selectedTenure === tenure} 
                tenureType={tenure}
                onClick={() => setSelectedTenure(tenure)}
                tenureColorsDark={TENURE_COLORS_DARK}
                tenureColorsLight={TENURE_COLORS_LIGHT}
              > 
                {`Fairhold ${tenure === 'fairholdLandPurchase' ? 'Land Purchase' : 'Land Rent'}`} 
              </TenureSelector> 
            ))} 
          </div>
        </div>
        
        <ResaleValueWrapper 
          household={data}
          tenure={selectedTenure}
        />
        
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description={<div  className="space-y-4"><ReactMarkdown>{processedContent}</ReactMarkdown></div>}
        />
      </div>
    </GraphCard>
  );
};
