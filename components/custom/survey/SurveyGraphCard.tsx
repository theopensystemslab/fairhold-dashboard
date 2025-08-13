import React from "react";
import { ClipLoader } from "react-spinners";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}>;

const SurveyGraphCard: React.FC<Props> = ({ title, subtitle, action, children }) => {
  return (
    <div className="flex flex-1 flex-col justify-center h-full w-full bg-white p-4">
        <h3 className={`text-xl md:text-lg sm:text-md font-bold text-black mt-0`}>{title}</h3>
                {(subtitle || action) && (
          <div className="flex items-center gap-4 mt-2">
            {subtitle && (
              <p className="text-md font-normal" style={{ color: "rgba(var(--survey-grey-mid))" }}>
                {subtitle}
              </p>
            )}
            {action}
          </div>
        )}
        <div className="mt-4 flex-1">
          {children ? (
            children
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <ClipLoader />
            </div>
          )}
        </div>
      </div>
  );
};

export default SurveyGraphCard;
