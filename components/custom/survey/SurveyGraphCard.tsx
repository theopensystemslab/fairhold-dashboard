import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}>;

const SurveyGraphCard: React.FC<Props> = ({ title, subtitle, action, children }) => {
  return (
    <div className="flex flex-1 flex-col justify-center h-full w-full bg-white m-4 p-4">
        <h3 className={`text-xl md:text-lg sm:text-md font-bold text-black`}>{title}</h3>
                {(subtitle || action) && (
          <div className="flex items-center gap-4 mt-2">
            {subtitle && <p className="text-md text-gray-600 font-normal">{subtitle}</p>}
            {action}
          </div>
        )}      
        {children && <div className="mt-4 flex-1">{children}</div>}
    </div>
  );
};

export default SurveyGraphCard;
