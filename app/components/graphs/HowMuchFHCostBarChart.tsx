"use client";

import { Bar, BarChart, CartesianGrid, XAxis, Label, LabelList, Tooltip } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
} from "@/components/ui/chart";
import { TooltipProps } from "recharts";
import {
  StyledChartContainer,
} from "../ui/StyledChartContainer";

import React from "react";
import { formatValue } from "@/app/lib/format";

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

const UpFrontCostTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) return null;

    // Sort payload so House comes before Land
    const sortedPayload = [...payload].sort((a, b) => {
      const aIsLand = (a.dataKey as string).includes("Land");
      const bIsLand = (b.dataKey as string).includes("Land");
      return aIsLand ? 1 : bIsLand ? -1 : 0;
    });

  return (
    <div className="rounded-lg bg-[rgb(var(--text-default-rgb))] p-2 shadow-sm">
      <div className="flex flex-col gap-2">
        {sortedPayload.map((segment, index) => {
          const dataKey = segment.dataKey as string;
          const value = segment.value as number;

          let segmentLabel = "";
          if (dataKey.includes("House")) {
            segmentLabel = "House";
          }
          else if (dataKey.includes("Land")) {
            segmentLabel = "Land";
          }
          return (
            <div key={index} className="grid grid-cols-2 gap-2">
              <div className="font-normal text-white">
                {`${segmentLabel}`}
              </div>
              <div className="text-right text-white">{formatValue(value)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
    return `Land`;
  } else if (dataKey.includes('House')) {
    return `House`;
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
      freeholdLandLabel: "Land",
      freeholdHouse: data[1].marketPurchase,
      freeholdHouseLabel: "House",
      freeholdTotal: data[0].marketPurchase + data[1].marketPurchase,
    },
    {
      tenure: "fairhold: land purchase",
      fairholdLand: data[0].fairholdLandPurchase,
      fairholdLandLabel: "Land",
      fairholdHouse: data[2].fairholdLandPurchase,
      fairholdHouseLabel: "House",
      fairholdTotal: data[0].fairholdLandPurchase + data[2].fairholdLandPurchase,
    },
    {
      tenure: "fairhold: land rent",
      fairholdHouse: data[2].fairholdLandRent,
      fairholdHouseLabel: "House",
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
                dataKey="freeholdLandLabel"
                position="center"
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
                dataKey="freeholdHouseLabel"
                position="center"
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
                dataKey="fairholdLandLabel"
                position="center"
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
                dataKey="fairholdHouseLabel"
                position="center"
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
            <Tooltip content={<UpFrontCostTooltip />} />
          </BarChart>
        </StyledChartContainer>
      </CardContent>
    </Card>
  );
};

export default HowMuchFHCostBarChart;