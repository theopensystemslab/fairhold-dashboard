import React from "react";
import { Household } from "@/app/models/Household";
interface Props {
  household: Household;
}

const idenityfunction = (household: Household) => {
  return household;
};
const GraphCard5: React.FC<Props> = ({ household }) => {
  {
    idenityfunction(household);
  }
  return (
    <div className="h-screen snap-start">
      <span className="text-2xl text-black">
        What difference would Fairhold make to me, my community, and the world??
      </span>
    </div>
  );
};

export default GraphCard5;
