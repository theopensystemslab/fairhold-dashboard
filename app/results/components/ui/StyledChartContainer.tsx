import { ChartContainer } from "@/components/ui/chart";
import { ComponentProps } from "react";

type ChartContainerProps = ComponentProps<typeof ChartContainer>

export const StyledChartContainer = ({ className, ...props }: ChartContainerProps) => {
    return (
      <ChartContainer
        {...props}
        className={`[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent ${className || ''}`}
      />
    );
  };