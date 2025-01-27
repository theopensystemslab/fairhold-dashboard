import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label, TooltipProps } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
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
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year"
              tickLine={false}
            >
              <Label
                value="Years"
                position="bottom"
                offset={20}
                className="label-class"
              />
            </XAxis>
            <YAxis
              tickFormatter={formatValue}
              tickLine={false}
              domain={[0, maxY]}
            >
              <Label
                value="Resale Value"
                angle={-90}
                position="left"
                offset={0}
                className="label-class"
              />
            </YAxis>
            <ChartTooltip content={<CustomTooltip />} />
            {renderLine("high")}
            {renderLine("medium")}
            {renderLine("low")}
            {renderLine("none")}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ResaleValueLineChart;