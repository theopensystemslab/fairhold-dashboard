import React from "react";
import { SurveyResults } from "@/app/survey/types";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle?: React.ReactNode;
  results: SurveyResults[];
}>;

const SurveyGraphCard: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
      <div className="justify-center">
        <h3 className={`text-xl md:text-2xl sm:text-lg font-bold text-black`}>{title}</h3>
        {subtitle && <p className={`text-md md:text-lg text-gray-600 mt-2 font-normal`}>{subtitle}</p>}
      {children && <div className="mt-4 h-[calc(100vh-16rem)]">{children}</div>}
    </div>
  );
};

export default SurveyGraphCard;
