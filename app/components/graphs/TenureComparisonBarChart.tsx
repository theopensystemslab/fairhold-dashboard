"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatValue } from "@/app/lib/format";

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

interface StackedBarChartProps {
  data: DataInput[];
}

const TenureComparisonBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  const chartData = [
    {
      tenure: "Freehold",
      land: data[0].marketPurchase,
      house: data[1].marketPurchase,
      monthly: data[0].marketPurchase + data[1].marketPurchase,
      fill: "rgb(var(--freehold-land-color-rgb))",
    },
    {
      tenure: "Private Rent",
      land: data[0].marketRent,
      house: data[1].marketRent,
      monthly: data[0].marketRent + data[1].marketRent,
      fill: "rgb(var(--private-rent-color-rgb))",
    },

    {
      tenure: "Fairhold - Land Purchase",
      land: data[0].fairholdLandPurchase,
      house: data[1].fairholdLandPurchase,
      monthly: data[0].fairholdLandPurchase + data[1].fairholdLandPurchase,
      fill: "rgb(var(--fairhold-land-color-rgb))",
    },
    {
      tenure: "Fairhold - Land Rent",
      land: data[0].fairholdLandRent,
      house: data[1].fairholdLandRent,
      monthly: data[0].fairholdLandRent + data[1].fairholdLandRent,
      fill: "rgb(var(--fairhold-house-color-rgb))",
    },

    {
      tenure: "Social Rent",
      land: data[0].socialRent,
      house: data[1].socialRent,
      monthly: data[0].socialRent + data[1].socialRent,
      fill: "rgb(var(--social-rent-color-rgb))",
    },
  ];

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
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
            <Bar dataKey="monthly" strokeWidth={2} activeIndex={2}>
              <LabelList
                dataKey="monthly"
                position="center"
                formatter={formatValue}
                fill="white"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TenureComparisonBarChart;
