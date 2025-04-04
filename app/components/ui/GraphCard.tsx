import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle?: React.ReactNode;
}>;

const GraphCard: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
    <div className="h-screen snap-start p-10 flex flex-col">
      <div className="w-full md:w-3/4">
        <h1 className={`text-2xl md:text-3xl lg:text-4xl  sm:text-xl font-bold text-black`}>{title}</h1>
        {subtitle && <h2 className={`text-lg md:text-xl lg:text-2xl text-gray-600 mt-2`}>{subtitle}</h2>}
      </div>
      {children && <div className="mt-4 flex-1">{children}</div>}
    </div>
  );
};

export default GraphCard;
