"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A radar chart with lines only";

const chartConfig = {
  land: {
    label: "Land",
    color: "hsl(var(--chart-1))",
  },
  house: {
    label: "House",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

import React from "react";

// Define type for DataInput
type DataInput = {
  category: string;
  marketPurchase: number;
  marketRent: number;
  socialRent: number;
  fairholdLandPurchase: number;
  fairholdLandRent: number;
  [key: string]: string | number;
};

// Define the props type for StackedBarChart
interface StackedBarChartProps {
  data: DataInput[];
}

// Implementation of the Chart.js Stacked Bar Chart
const TenureComparisonBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  console.log("TenureComparisonBarChart data: ", data);

  const chartData = [
    {
      tenure: "market: purchase",
      land: data[0].marketPurchase,
      house: data[1].marketPurchase,
    },
    {
      tenure: "market: rent",
      land: data[0].marketRent,
      house: data[1].marketRent,
    },
    {
      tenure: "social rent",
      land: data[0].socialRent,
      house: data[1].socialRent,
    },
    {
      tenure: "fairhold: land purchase",
      land: data[0].fairholdLandPurchase,
      house: data[1].fairholdLandPurchase,
    },
    {
      tenure: "fairhold: land rent",
      land: data[0].fairholdLandRent,
      house: data[1].fairholdLandRent,
    },
  ];

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Monthly payment</CardTitle>
        <CardDescription>
          Monthly payment for both land and house by tenure type
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis
              dataKey="tenure"
              tick={{ width: 80, textAnchor: "middle" }}
            />
            <PolarGrid radialLines={false} />
            <Radar
              dataKey="land"
              fill="var(--color-land)"
              fillOpacity={0}
              stroke="var(--color-land)"
              strokeWidth={2}
            />
            <Radar
              dataKey="house"
              fill="var(--color-house)"
              fillOpacity={0}
              stroke="var(--color-house)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
};

export default TenureComparisonBarChart;
