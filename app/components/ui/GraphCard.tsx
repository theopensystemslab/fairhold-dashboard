import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle?: React.ReactNode;
}>;

const GraphCard: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
    <div className="h-screen snap-start p-10 flex flex-col">
      <div className=" w-full lg:w-3/4">
        <h1 className="tracking-tight font-bold mt-0 text-2xl md:text-3xl md:mb-2.5 lg:text-5xl lg:leading-14">
          {title}
        </h1>
        {subtitle && (
          <h2 className="mt-5 font-bold  text:sm md:text-xl lg:text-2xl lg:leading-9">
            {subtitle}
          </h2>
        )}
      </div>
      {children && <div className="mt-4 flex-1">{children}</div>}
    </div>
  );
};

export default GraphCard;
