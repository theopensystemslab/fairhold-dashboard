import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
}>;

const GraphCard: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="h-screen snap-start">
      <span className="text-2xl text-black">{title}</span>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default GraphCard;
