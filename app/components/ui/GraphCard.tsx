import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
}>;

const GraphCard: React.FC<Props> = ({ title }) => {
  return (
    <div className="h-screen snap-start">
      <span className="text-2xl text-black">{title}</span>
    </div>
  );
};

export default GraphCard;
