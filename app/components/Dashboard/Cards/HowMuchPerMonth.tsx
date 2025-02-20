import GraphCard from "../../ui/GraphCard";
import HowMuchPerMonthWrapper from "../../graphs/HowMuchPerMonthWrapper";
import { Drawer } from "../../ui/Drawer";
import { DashboardProps } from "../../ui/Dashboard";

type ProcessedDataOnly = Pick<DashboardProps, "processedData">;

export const HowMuchPerMonth: React.FC<ProcessedDataOnly> = ({
  processedData,
}) => {
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
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum minus eligendi fugit nulla officia dolor inventore nemo ex quo quia, laborum qui ratione aperiam, pariatur explicabo ipsum culpa impedit ad!"
        />
      </div>
    </GraphCard>
  );
};
