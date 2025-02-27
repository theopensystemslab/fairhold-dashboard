"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Label, LabelList, Tooltip, TooltipProps } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
} from "@/components/ui/chart";
import {
  StyledChartContainer,
} from "../ui/StyledChartContainer";
import { ValueType } from "tailwindcss/types/config";
import { NameType } from "recharts/types/component/DefaultTooltipContent";

const chartConfig = {
  freeholdLand: {
    color: "rgb(var(--freehold-equity-color-rgb))",
  },
  freeholdHouse: {
    color: "rgb(var(--freehold-interest-color-rgb))",
  },
  fairholdLand: {
    color: "rgb(var(--fairhold-equity-color-rgb))",
  },
  fairholdHouse: {
    color: "rgb(var(--fairhold-interest-color-rgb))",
  },
} satisfies ChartConfig;

import React from "react";
import { formatValue } from "@/app/lib/format";

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

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) return null;

  const total = payload[0].payload.total;
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">Total:</div>
        <div>£{total.toLocaleString()}</div>
      </div>
    </div>
  );
};

const formatValueWithLabel = (value: number, dataKey: string) => {
  const formattedValue = formatValue(value);
  
  if (dataKey.includes('Land')) {
    return `Land: ${formattedValue}`;
  } else if (dataKey.includes('House')) {
    return `House: ${formattedValue}`;
  }
  
  return formattedValue;
};

const HowMuchFHCostBarChart: React.FC<StackedBarChartProps> = ({
  data,
}) => {
  const chartData = [
    {
      tenure: "freehold",
      freeholdLand: data[0].marketPurchase,
      freeholdHouse: data[1].marketPurchase,
      total: data[0].marketPurchase + data[1].marketPurchase,
    },
    {
      tenure: "fairhold: land purchase",
      fairholdLand: data[0].fairholdLandPurchase,
      fairholdHouse: data[2].fairholdLandPurchase,
      total: data[0].fairholdLandPurchase + data[2].fairholdLandPurchase,
    },
    {
      tenure: "fairhold: land rent",
      fairholdHouse: data[2].fairholdLandRent,
      total: data[2].fairholdLandRent,
    },
  ];

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <StyledChartContainer config={chartConfig}
        className="[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tenure"
              tickLine={false}
              tickFormatter={(value) => {
                switch (value) {
                  case "freehold":
                    return "Freehold";
                  case "fairhold: land purchase":
                    return "Fairhold – Land Purchase";
                  case "fairhold: land rent":
                    return "Fairhold – Land Rent";
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

            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="freeholdLand"
              stackId="stack"
              fill="var(--color-freeholdLand)"
            >
              <LabelList
                dataKey="freeholdLand"
                position="center"
                formatter={(value: number) => formatValueWithLabel(value, "freeholdLand")}
                fill="white"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="freeholdHouse"
              stackId="stack"
              fill="var(--color-freeholdHouse)"
            >
              <LabelList
                dataKey="freeholdHouse"
                position="center"
                formatter={(value: number) => formatValueWithLabel(value, "freeholdHouse")}
                fill="white"
                fontSize={12}
              />
              </Bar>
            <Bar
              dataKey="fairholdLand"
              stackId="stack"
              fill="var(--color-fairholdLand)"
            >
              <LabelList
                dataKey="fairholdLand"
                position="center"
                formatter={(value: number) => formatValueWithLabel(value, "fairholdLand")}
                fill="white"
                fontSize={12}
              />
              </Bar>
            <Bar
              dataKey="fairholdHouse"
              stackId="stack"
              fill="var(--color-fairholdHouse)"
            >
              <LabelList
                dataKey="fairholdHouse"
                position="center"
                formatter={(value: number) => formatValueWithLabel(value, "fairholdHouse")}
                fill="white"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </StyledChartContainer>
      </CardContent>
    </Card>
  );
};

export default HowMuchFHCostBarChart;