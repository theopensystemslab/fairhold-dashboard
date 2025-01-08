import React from "react";
import { Household } from "@/app/models/Household";
interface Props {
  household: Household;
}

const idenityfunction = (household: Household) => {
  return household;
};
const GraphCard3: React.FC<Props> = ({ household }) => {
  {
    idenityfunction(household);
  }
  return (
    <div className="h-screen snap-start">
      <span className="text-2xl text-black">
        How would the cost change over my life?
      </span>
    </div>
  );
};

export default GraphCard3;
