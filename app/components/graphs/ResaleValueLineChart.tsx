import React, { useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, TooltipProps, Tooltip, LabelList } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
} from "@/components/ui/chart";
import {
  StyledChartContainer,
} from "../ui/StyledChartContainer";
import { formatValue } from "@/app/lib/format";
import { MaintenanceLevel } from "@/models/constants";
import { CustomLabelListContentProps } from "./shared";

type CustomTooltipProps = TooltipProps<number, string> & {
  payload?: Array<{
    name: keyof Omit<DataPoint, "year">;
    value: number;
    stroke: string;
  }>;
};

const chartConfig = {
  none: {
    label: "None",
  },
  low: {
    label: "Low",
  },
  medium: {
    label: "Medium",
  },
  high: {
    label: "High",
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

interface ResaleValueLabelListContentProps extends CustomLabelListContentProps {
  dataKey: keyof Omit<DataPoint, "year">;
  selectedMaintenance: MaintenanceLevel;
  data: DataPoint[];
}

const CustomLabelListContent: React.FC<ResaleValueLabelListContentProps> = ({
  x,
  y,
  index,
  dataKey,
  selectedMaintenance,
  data,
}) => {
    const isLast = index === data.length - 1;
    if (!isLast) return null;
    if (typeof x !== "number" || typeof y !== "number") return null;

    const label = chartConfig[dataKey].label;
    const longestLabel = Math.max(chartConfig['none'].label.length, chartConfig['low'].label.length, chartConfig['medium'].label.length, chartConfig['high'].label.length)
    const paddingX = 8;
    const paddingY = 4;
    const fontSize = 12;

    const rectWidth = longestLabel * 7 + paddingX * 2;
    const rectHeight = fontSize + paddingY * 2;
    return (
      <g transform={`translate(${x}, ${y - rectHeight / 2})`}>
      <rect
        width={rectWidth}
        height={rectHeight}
        rx={rectHeight / 2}
        ry={rectHeight / 2}
        fill={dataKey === selectedMaintenance 
          ? `rgb(var(--fairhold-equity-color-rgb))` 
          : `rgb(var(--fairhold-interest-color-rgb))`}
      />
      <text
        x={rectWidth / 2}
        y={rectHeight / 2 + fontSize / 3}
        fill="#fff"
        fontSize={fontSize}
        textAnchor="middle"
        dominantBaseline={"top"}
      >
        {label}
      </text>
    </g>
    );
  }

const ResaleValueLineChart: React.FC<ResaleValueLineChartProps> = ({
  data,
  selectedMaintenance,
  maxY
}) => {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null); // We use useState to figure out what line is being hovered over for the tooltip

  const renderLine = (dataKey: keyof Omit<DataPoint, "year">) => (
    <Line
      type="monotone"
      dataKey={dataKey}
      stroke={dataKey === selectedMaintenance 
        ? `rgb(var(--fairhold-equity-color-rgb))` 
        : `rgb(var(--fairhold-interest-color-rgb))`}
      strokeWidth={2}
      dot={false}
      activeDot={false}
      onMouseOver={() => setHoveredLine(dataKey)}
      onMouseOut={() => setHoveredLine(null)}
      >
    <LabelList
      content={(props) => (
        <CustomLabelListContent
          {...props}
          dataKey={dataKey}
          selectedMaintenance={selectedMaintenance}
          data={data}
        />
      )}
    />
      </Line>
    );  
  const CustomTooltip = ({ active, payload, label, hoveredLine }: CustomTooltipProps & { hoveredLine: string | null }) => {
    if (!active || !payload || !payload.length || hoveredLine !== selectedMaintenance) return null; 

    // Find the entry that matches the selected maintenance level
    const selectedEntry = payload.find(entry => entry.name === selectedMaintenance);
    
    if (!selectedEntry) return null;

    return (
      <div className="rounded-xl bg-[rgb(var(--text-default-rgb))] p-1 shadow">
        <span className="mb-2 text-white">Year {label} </span>
        <span className="text-[rgb(var(--fairhold-interest-color-rgb))] font-medium">{formatValue(selectedEntry.value ?? 0)}</span>

      </div>
    );
  };

  return (
    <Card className="h-full w-full">
      <CardContent className="h-full w-full p-0 md:p-4">
        <StyledChartContainer config={chartConfig}  className="h-full w-full">
          <LineChart
            data={data}
            margin={{ top: 20, right: 70, left: 20, bottom: 20 }}
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
            <Tooltip
              content={<CustomTooltip hoveredLine={hoveredLine} />}
              isAnimationActive={false}
              cursor={false}
            />
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