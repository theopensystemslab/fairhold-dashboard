import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle?: React.ReactNode;
}>;

const GraphCard: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen snap-start w-full md:w-3/4 p-10 flex flex-col overflow-y-auto my-2 pb-6 pt-12">
      <div className="justify-center">
        <h1 className={`text-2xl md:text-3xl lg:text-4xl sm:text-xl font-bold text-black`}>{title}</h1>
        {subtitle && <h2 className={`text-lg md:text-xl lg:text-2xl text-gray-600 mt-2 font-normal`}>{subtitle}</h2>}
      </div>
      {children && <div className="mt-4 h-[calc(100vh-16rem)]">{children}</div>}
    </div>
  );
};

export default GraphCard;
