"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Label, LabelList } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
} from "@/components/ui/chart";
import {
  StyledChartContainer,
} from "../ui/StyledChartContainer";

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
  total: {
    color: "transparent",
  }
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

const formatValueWithLabel = (value: number, dataKey: string) => {
  const formattedValue = formatValue(value);
  
  if (dataKey.includes('Land')) {
    return `Land: ${formattedValue}`;
  } else if (dataKey.includes('House')) {
    return `House: ${formattedValue}`;
  } else if (dataKey === 'total') {
    return formattedValue;
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
      freeholdTotal: data[0].marketPurchase + data[1].marketPurchase,
    },
    {
      tenure: "fairhold: land purchase",
      fairholdLand: data[0].fairholdLandPurchase,
      fairholdHouse: data[2].fairholdLandPurchase,
      fairholdTotal: data[0].fairholdLandPurchase + data[2].fairholdLandPurchase,
    },
    {
      tenure: "fairhold: land rent",
      fairholdHouse: data[2].fairholdLandRent,
      fairholdTotal: data[2].fairholdLandRent,
    },
  ];

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <StyledChartContainer config={chartConfig}
        className="[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 30 }}>
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
              <LabelList
                dataKey="freeholdTotal"
                position="top"
                offset={10}
                formatter={(value: number) => formatValueWithLabel(value, "freeholdTotal")}
                fill="rgb(var(--freehold-equity-color-rgb))" 
                fontSize={18}
                fontWeight={600}
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
              <LabelList
                dataKey="fairholdTotal"
                position="top"
                offset={10}
                formatter={(value: number) => formatValueWithLabel(value, "fairholdTotal")}
                fill="rgb(var(--fairhold-equity-color-rgb))"
                fontSize={18}
                fontWeight={600}
                />
            </Bar>
          </BarChart>
        </StyledChartContainer>
      </CardContent>
    </Card>
  );
};

export default HowMuchFHCostBarChart;