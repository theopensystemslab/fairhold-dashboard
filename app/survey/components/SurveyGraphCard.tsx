import React from "react";
import { SurveyResults } from "@/app/survey/types";
import { ResponsiveContainer } from "recharts";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle?: React.ReactNode;
  results: SurveyResults[];
}>;

const SurveyGraphCard: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
    <div className="justify-center w-full bg-white m-4 p-4">
        <h3 className={`text-xl md:text-lg sm:text-md font-normal text-black`}>{title}</h3>
        {subtitle && <p className={`text-md md:text-lg text-gray-600 mt-2 font-normal`}>{subtitle}</p>}
        <div className="w-full h-[250px] mt-4">
        {children && React.isValidElement(children) ? (
            <ResponsiveContainer width="100%" height="100%">
              {children}
            </ResponsiveContainer>
          ) : (
            <div>No chart data available</div>
          )}
        </div>
      </div>
  );
};

export default SurveyGraphCard;
