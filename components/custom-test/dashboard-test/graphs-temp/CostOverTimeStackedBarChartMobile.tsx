"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/card";
import { StyledChartContainer } from "../../ui-test/StyledChartContainer";
import { formatValue } from "@/app/lib/format";
import { LifetimeBarData } from "./CostOverTimeStackedBarChart";
import { CostOverTimeTooltip } from "./CostOverTimeStackedBarChart";

interface CostOverTimeHorizontalChartProps {
  data: LifetimeBarData[];
  maxY: number;
  config: {
    colors: {
      landRent?: string;
      equity?: string;
      interest?: string;
      rent?: string;
      maintenance?: string;
    };
  };
}

const CostOverTimeHorizontalChart: React.FC<CostOverTimeHorizontalChartProps> = ({
  data,
  maxY,
  config
}) => {
  const chartConfig: Record<string, { label: string; color: string }> = {};
  
  // Same config setup as StackedBarChart
  Object.entries(config.colors).forEach(([key, color]) => {
    if (color) {
      chartConfig[key] = {
        label: key.charAt(0).toUpperCase() + key.slice(1),
        color
      };
    }
  });

  return (
    <Card className="h-full">
      <CardContent className="h-[600px] w-full">
        <StyledChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 5, left: 5, bottom: 20 }}
            className="h-full w-full"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
            <XAxis
              type="number"
              domain={[0, maxY]}
              tickFormatter={formatValue}
              orientation="top"
              tickLine={false}
            >
            </XAxis>
            <YAxis
              type="category"
              dataKey="year"
              ticks={Array.from(
                { length: Math.floor(data.length / 5) + 1 },
                (_, i) => i * 5
              ).filter(tick => tick <= data.length)}
              width={20}
              axisLine={false}
              tickLine={false}
            >
            </YAxis>
            <Tooltip content={<CostOverTimeTooltip />}
            />
            
            {Object.entries(config.colors).map(([key, color]) => (
              color && (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={color}
                  name={chartConfig[key].label}
                />
              )
            ))}
          </BarChart>
        </StyledChartContainer>
      </CardContent>
    </Card>
  );
};

export default CostOverTimeHorizontalChart;