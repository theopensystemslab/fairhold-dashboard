import GraphCard from "../../ui/GraphCard";
import UpfrontComparisonWrapper from "../../graphs/UpfrontComparisonWrapper";
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
      title="How much would a Fairhold home cost?"
      subtitle="The up-front cost of a home, compared with conventional home ownership."
    >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <UpfrontComparisonWrapper household={data} />
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description={<ReactMarkdown className="space-y-4">{explanationContent}</ReactMarkdown>}
        />
      </div>
    </GraphCard>
  );
};
