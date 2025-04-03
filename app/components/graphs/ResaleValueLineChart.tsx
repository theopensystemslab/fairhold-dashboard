import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, TooltipProps } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  StyledChartContainer,
} from "../ui/StyledChartContainer";
import { formatValue } from "@/app/lib/format";
import { MaintenanceLevel } from "@/app/models/constants";

type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: Array<{
    name: keyof Omit<DataPoint, "year">;
    value: number;
    stroke: string;
  }>;
};

const chartConfig = {
  none: {
    label: "No maintenance",
    color: "rgb(var(--fairhold-equity-color-rgb))", 
  },
  low: {
    label: "Low maintenance",
    color: "rgb(var(--fairhold-equity-color-rgb))",
  },
  medium: {
    label: "Medium maintenance",
    color: "rgb(var(--fairhold-equity-color-rgb))",
  },
  high: {
    label: "High maintenance",
    color: "rgb(var(--fairhold-equity-color-rgb))",
  },
} satisfies ChartConfig;

export interface DataPoint {
  year: number;
  none: number;
  low: number;
  medium: number;
  high: number;
}

interface ResaleValueLineChartProps {
  data: DataPoint[];
  selectedMaintenance: MaintenanceLevel;
  maxY: number;
}

const ResaleValueLineChart: React.FC<ResaleValueLineChartProps> = ({
  data,
  selectedMaintenance,
  maxY
}) => {
  const renderLine = (dataKey: keyof Omit<DataPoint, "year">) => (
    <Line
      type="monotone"
      dataKey={dataKey}
      stroke={`var(--color-${dataKey})`}
      strokeWidth={2}
      strokeDasharray={dataKey === selectedMaintenance ? "0" : "5 5"}
      dot={false}
    />
  );
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 border rounded shadow">
        <p className="font-medium mb-2">Year {label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <svg width="20" height="2" className="flex-shrink-0">
              <line
                x1="0"
                y1="1"
                x2="20"
                y2="1"
                stroke={entry.stroke}
                strokeWidth="2"
                strokeDasharray={entry.name === selectedMaintenance ? "0" : "5 5"}
              />
            </svg>
            <span>{chartConfig[entry.name as keyof typeof chartConfig].label}:</span>
            <span className="font-medium">{formatValue(entry.value ?? 0)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="h-full w-full">
      <CardContent className="h-full w-full p-0 md:p-4">
        <StyledChartContainer config={chartConfig}  className="h-full w-full">
          <LineChart
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year"
              tickLine={false}
              ticks={Array.from(
                { length: Math.floor(data.length / 5) + 1 },
                (_, i) => i * 5
              ).filter(tick => tick <= data.length)}
            >
            </XAxis>
            <YAxis
              tickFormatter={formatValue}
              tickLine={false}
              domain={[0, maxY]}
              width={40}
            >
            </YAxis>
            <ChartTooltip content={<CustomTooltip />} />
            {renderLine("high")}
            {renderLine("medium")}
            {renderLine("low")}
            {renderLine("none")}
          </LineChart>
        </StyledChartContainer>
      </CardContent>
    </Card>
  );
};

export default ResaleValueLineChart;