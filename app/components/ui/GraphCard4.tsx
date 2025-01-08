import React from "react";
import { Household } from "@/app/models/Household";
interface Props {
  household: Household;
}

const idenityfunction = (household: Household) => {
  return household;
};
const GraphCard4: React.FC<Props> = ({ household }) => {
  {
    idenityfunction(household);
  }
  return (
    <div className="h-screen snap-start">
      <span className="text-2xl text-black">How much could I sell it for?</span>
    </div>
  );
};

export default GraphCard4;
