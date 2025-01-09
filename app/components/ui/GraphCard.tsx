import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
}>;

const GraphCard: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="h-screen snap-start p-20">
      <h1 className="text-2xl text-black">{title}</h1>
      {children && <div className="mt-4 h-full">{children}</div>}
    </div>
  );
};

export default GraphCard;
