import GraphCard from "../../ui/GraphCard";
import HowMuchFHCostWrapper from "../../graphs/HowMuchFHCostWrapper";
import { Drawer } from "../../ui/Drawer";
import { Household } from "@/app/models/Household";
import ReactMarkdown from 'react-markdown';
import explanationContent from '../Help/HowMuchFHCost.md';

interface DashboardProps {
  data: Household;
}

export const HowMuchFHCost: React.FC<DashboardProps> = ({ data }) => {
  return (
    <GraphCard
      title="How much would a Fairhold home cost me?"
      subtitle="The up-front cost of a home, compared with conventional home ownership"
    >
      <div className="flex flex-col h-full md:w-3/4 w-full justify-between">
        <HowMuchFHCostWrapper household={data} />
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description={<div className="space-y-4"><ReactMarkdown>{explanationContent}</ReactMarkdown></div>}
        />
      </div>
    </GraphCard>
  );
};
