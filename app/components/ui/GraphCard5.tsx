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
        How much would a Fairhold home cost?
      </span>
    </div>
  );
};

export default GraphCard5;
