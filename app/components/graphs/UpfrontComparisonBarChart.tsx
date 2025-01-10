"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Label } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  freeholdLand: {
    label: "Land",
    color: "rgb(var(--freehold-land-color-rgb))",
  },
  freeholdHouse: {
    label: "House",
    color: "rgb(var(--freehold-house-color-rgb))",
  },
  fairholdLand: {
    label: "Land",
    color: "rgb(var(--fairhold-land-color-rgb))",
  },
  fairholdHouse: {
    label: "House",
    color: "rgb(var(--fairhold-house-color-rgb))",
  },
} satisfies ChartConfig;

import React from "react";

type DataInput = {
  category: string;
  marketPurchase: number;
  fairholdLandPurchase: number;
  fairholdLandRent: number;
  [key: string]: string | number;
};

interface StackedBarChartProps {
  data: DataInput[];
}

const UpfrontComparisonBarChart: React.FC<StackedBarChartProps> = ({
  data,
}) => {
  const chartData = [
    {
      tenure: "freehold",
      freeholdLand: data[0].marketPurchase,
      freeholdHouse: data[1].marketPurchase,
    },
    {
      tenure: "fairhold: land purchase",
      fairholdLand: data[0].fairholdLandPurchase,
      fairholdHouse: data[2].fairholdLandPurchase,
    },
    {
      tenure: "fairhold: land rent",
      fairholdLand: data[0].fairholdLandRent,
      fairholdHouse: data[2].fairholdLandRent,
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
              tickFormatter={(value) => {
                switch (value) {
                  case "freehold":
                    return "Freehold";
                  case "fairhold: land purchase":
                    return "Fairhold - Land Purchase";
                  case "fairhold: land rent":
                    return "Fairhold - Land Rent";
                  default:
                    return value;
                }
              }}
            >
              <Label
                value="Tenure Types"
                position="bottom"
                offset={20}
                className="label-class"
              />
            </XAxis>

            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="freeholdLand"
              stackId="a"
              fill="var(--color-freeholdLand)"
            />
            <Bar
              dataKey="freeholdHouse"
              stackId="a"
              fill="var(--color-freeholdHouse)"
            />

            <Bar
              dataKey="fairholdLand"
              stackId="a"
              fill="var(--color-fairholdLand)"
            />
            <Bar
              dataKey="fairholdHouse"
              stackId="a"
              fill="var(--color-fairholdHouse)"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default UpfrontComparisonBarChart;
