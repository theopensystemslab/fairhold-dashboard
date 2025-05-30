import React from "react";
import { BarOrPieResults, SankeyResults } from "@/app/survey/types";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle?: React.ReactNode;
  results: BarOrPieResults | SankeyResults;
}>;

const SurveyGraphCard: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
    <div className="justify-center w-full bg-white m-4 p-4">
        <h3 className={`text-xl md:text-lg sm:text-md font-normal text-black`}>{title}</h3>
        {subtitle && <p className={`text-md md:text-lg text-gray-600 mt-2 font-normal`}>{subtitle}</p>}
      {children && <div className="mt-4 h-[calc(100vh-16rem)]">{children}</div>}
    </div>
  );
};

export default SurveyGraphCard;
