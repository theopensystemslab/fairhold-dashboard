import React from "react";
import { Household } from "@/app/models/Household";
interface Props {
  household: Household;
}

const idenityfunction = (household: Household) => {
  return household;
};
const GraphCard6: React.FC<Props> = ({ household }) => {
  {
    idenityfunction(household);
  }
  return (
    <div className="h-screen snap-start">
      <span className="text-2xl text-black">What would you choose??</span>
    </div>
  );
};

export default GraphCard6;
