"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  land: {
    label: "Land",
    color: "hsl(var(--chart-1))",
  },
  newHouse: {
    label: "NewHouse",
    color: "hsl(var(--chart-2))",
  },
  depreciatedHouse: {
    label: "DepreciatedHouse",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

import React from "react";

// Define type for DataInput
type DataInput = {
  category: string;
  marketPurchase: number;
  fairholdLandPurchase: number;
  fairholdLandRent: number;
  [key: string]: string | number;
};

// Define the props type for StackedBarChart
interface StackedBarChartProps {
  data: DataInput[];
}

// Implementation of the Chart.js Stacked Bar Chart
const UpfrontComparisonBarChart: React.FC<StackedBarChartProps> = ({
  data,
}) => {
  const chartData = [
    {
      tenure: "market: purchase",
      land: data[0].marketPurchase,
      newHouse: data[1].marketPurchase,
    },
    {
      tenure: "fairhold: land purchase",
      land: data[0].fairholdLandPurchase,
      depreciatedHouse: data[2].fairholdLandPurchase,
    },
    {
      tenure: "fairhold: land rent",
      land: data[0].fairholdLandRent,
      depreciatedHouse: data[2].fairholdLandRent,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tenure comparison</CardTitle>
        <CardDescription>Total upfront cost £</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tenure"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="land"
              stackId="a"
              fill="var(--color-land)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="newHouse"
              stackId="a"
              fill="var(--color-newHouse)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="depreciatedHouse"
              stackId="a"
              fill="var(--color-depreciatedHouse)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing the upfront cost.
        </div>
      </CardFooter>
    </Card>
  );
};

export default UpfrontComparisonBarChart;
