import React from "react";
import { useAnimateOnView } from "@hooks/UseAnimateOnView";

type Props = {
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode | ((animate: boolean) => React.ReactNode);
};

const SurveyGraphCard: React.FC<Props> = ({ title, subtitle, action, children }) => {
  const { ref, animate } = useAnimateOnView();

  return (
    <div ref={ref} className="flex flex-1 flex-col justify-center h-full w-full bg-white p-4">
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
      {typeof children === "function" ? children(animate) : children}
    </div>
  );
};

export default SurveyGraphCard;