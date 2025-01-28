import GraphCard from "../../ui/GraphCard";
import HowMuchPerMonthWrapper from "../../graphs/HowMuchPerMonthWrapper";
import { Drawer } from "../../ui/Drawer";
import { DashboardProps } from "../../ui/Dashboard";
import ReactMarkdown from 'react-markdown';
import explanationContent from '../Help/HowMuchPerMonth.md';
import { DEFAULT_INITIAL_DEPOSIT, DEFAULT_INTEREST_RATE, DEFAULT_MORTGAGE_TERM } from "@/app/models/constants";

type ProcessedDataOnly = Pick<DashboardProps, "processedData">;

export const HowMuchPerMonth: React.FC<ProcessedDataOnly> = ({
  processedData,
}) => {
  // We don't want to hard code the variables in markdown because then we'd have to maintain them in multiple places
  const processedContent = explanationContent.replace(
    `{{DEFAULT_INTEREST_RATE}}`,
    (DEFAULT_INTEREST_RATE * 100).toString()
  ).replace(
    `{{DEFAULT_MORTGAGE_TERM}}`,
    DEFAULT_MORTGAGE_TERM.toString()
  ).replace(
    `{{DEFAULT_INITIAL_DEPOSIT}}`,
    (DEFAULT_INITIAL_DEPOSIT * 100).toString()
  );

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
