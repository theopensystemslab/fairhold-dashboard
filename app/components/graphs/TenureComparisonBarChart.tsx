"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
  freehold: {
    label: "Freehold",
    color: "rgb(var(--freehold-land-color-rgb))",
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
  affordabilityMonthly: number;
  [key: string]: string | number;
};

// Define the props type for StackedBarChart
interface StackedBarChartProps {
  data: DataInput[];
}

// Implementation of the Chart.js Stacked Bar Chart
const TenureComparisonBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  const chartData = [
    {
      tenure: "Freehold",
      land: data[0].marketPurchase,
      house: data[1].marketPurchase,
      freehold: data[0].marketPurchase + data[1].marketPurchase,
    },
    {
      tenure: "Private Rent",
      land: data[0].marketRent,
      house: data[1].marketRent,
      privateRent: data[0].marketRent + data[1].marketRent,
    },

    {
      tenure: "Fairhold - Land Purchase",
      land: data[0].fairholdLandPurchase,
      house: data[1].fairholdLandPurchase,
      fairholdPurchase:
        data[0].fairholdLandPurchase + data[1].fairholdLandPurchase,
    },
    {
      tenure: "Fairhold - Land Rent",
      land: data[0].fairholdLandRent,
      house: data[1].fairholdLandRent,
      fairholdrent: data[0].fairholdLandRent + data[1].fairholdLandRent,
    },

    {
      tenure: "Social Rent",
      land: data[0].socialRent,
      house: data[1].socialRent,
      socialRent: data[0].socialRent + data[1].socialRent,
    },
  ];

  return (
    <Card>
      <CardHeader></CardHeader>
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
            <Bar dataKey="freehold" fill="var(--color-freehold)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing the montly cost by tenure type.
        </div>
      </CardFooter>
    </Card>
  );
};

export default TenureComparisonBarChart;
