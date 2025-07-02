import React from "react";

type Props = React.PropsWithChildren<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}>;

const SurveyGraphCard: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
    <div className="justify-center w-full bg-white m-4 p-4">
        <h3 className="text-xl md:text-lg sm:text-md font-bold text-black">{title}</h3>
        {subtitle && <p className={`text-md text-gray-600 mt-2 font-normal`}>{subtitle}</p>}
      {children && <div className="mt-4 h-[calc(60vh-16rem)]">{children}</div>}
    </div>
  );
};

export default SurveyGraphCard;
