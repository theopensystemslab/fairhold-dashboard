import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label, Legend } from 'recharts';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatValue } from "@/app/lib/format";

const chartConfig = {
  noMaintenance: {
    label: "No Maintenance",
    color: "rgb(var(--fairhold-land-color-rgb))", 
  },
  lowMaintenance: {
    label: "Low Maintenance",
    color: "rgb(var(--fairhold-land-color-rgb))",
  },
  mediumMaintenance: {
    label: "Medium Maintenance",
    color: "rgb(var(--fairhold-land-color-rgb))",
  },
  highMaintenance: {
    label: "High Maintenance",
    color: "rgb(var(--fairhold-land-color-rgb))",
  },
} satisfies ChartConfig;

export interface DataPoint {
  year: number;
  noMaintenance: number;
  lowMaintenance: number;
  mediumMaintenance: number;
  highMaintenance: number;
}

interface ResaleValueLineChartProps {
  data: DataPoint[];
  selectedMaintenance: 'noMaintenance' | 'lowMaintenance' | 'mediumMaintenance' | 'highMaintenance';
}

const ResaleValueLineChart: React.FC<ResaleValueLineChartProps> = ({
  data,
  selectedMaintenance
}) => {
  const renderLine = (dataKey: keyof Omit<DataPoint, 'year'>) => (
    <Line
      type="monotone"
      dataKey={dataKey}
      stroke={`var(--color-${dataKey})`}
      strokeWidth={2}
      strokeDasharray={dataKey === selectedMaintenance ? "0" : "5 5"}
      dot={false}
    />
  );

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
            >
              <Label
                value="Resale Value (£)"
                angle={-90}
                position="left"
                offset={0}
                className="label-class"
              />
            </YAxis>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {renderLine('noMaintenance')}
            {renderLine('lowMaintenance')}
            {renderLine('mediumMaintenance')}
            {renderLine('highMaintenance')}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ResaleValueLineChart;