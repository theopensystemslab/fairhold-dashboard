import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

const GraphCard: React.FC<Props> = ({ title, subtitle, children }) => {
  return (
    <div className="h-screen snap-start p-10 flex flex-col">
      <div className="w-3/4">
        <h1 className="text-black">{title}</h1>
        {subtitle && <h2>{subtitle}</h2>}
      </div>
      {children && <div className="mt-4 flex-1">{children}</div>}
    </div>
  );
};

export default GraphCard;
