import GraphCard from "../../ui/GraphCard";
import TenureComparisonWrapper from "../../graphs/TenureComparisonWrapper";
import { Drawer } from "../../ui/Drawer";
import { Household } from "@/app/models/Household";

interface DashboardProps {
  data: Household;
}

export const HowMuchPerMonth: React.FC<DashboardProps> = ({ data }) => {
  return (
    <GraphCard
      title="How much would a Fairhold home cost?"
      subtitle="The up-front cost of a home, compared with conventional home ownership."
    >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <TenureComparisonWrapper household={data} />
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum minus eligendi fugit nulla officia dolor inventore nemo ex quo quia, laborum qui ratione aperiam, pariatur explicabo ipsum culpa impedit ad!"
        />
      </div>
    </GraphCard>
  );
};
