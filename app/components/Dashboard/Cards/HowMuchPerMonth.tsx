import { useState, useEffect, useMemo } from "react";
import GraphCard from "../../ui/GraphCard";
import HowMuchPerMonthWrapper from "../../graphs/HowMuchPerMonthWrapper";
import { Drawer } from "../../ui/Drawer";
import { DashboardProps } from "../../ui/Dashboard";
import ReactMarkdown from 'react-markdown';
import explanationContent from '../Help/HowMuchPerMonth.md';
import { DEFAULT_INITIAL_DEPOSIT, DEFAULT_INTEREST_RATE, DEFAULT_MORTGAGE_TERM } from "@/app/models/constants";
import { remark } from "remark";
import { visit } from 'unist-util-visit';
import type { TextNode } from "./types";

type ProcessedDataOnly = Pick<DashboardProps, "processedData">;

export const HowMuchPerMonth: React.FC<ProcessedDataOnly> = ({
  processedData,
}) => {
  const [processedContent, setProcessedContent] = useState('');

  // We don't want to hard code the variables in markdown because then we'd have to maintain them in multiple places
  const replacements = useMemo(() => ({
    DEFAULT_INTEREST_RATE: (DEFAULT_INTEREST_RATE * 100).toString(),
    DEFAULT_MORTGAGE_TERM: DEFAULT_MORTGAGE_TERM.toString(),
    DEFAULT_INITIAL_DEPOSIT: (DEFAULT_INITIAL_DEPOSIT * 100).toString()
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
      title="How much would it cost every month?"
      subtitle="Monthly cost of housing, not including energy bills."
    >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <HowMuchPerMonthWrapper household={processedData} />
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description={<ReactMarkdown className="space-y-4">{processedContent}</ReactMarkdown>}
        />
      </div>
    </GraphCard>
  );
};
