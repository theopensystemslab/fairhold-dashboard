"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList, Tooltip, YAxis } from "recharts";
import { Card, CardContent } from "@/components/card";
import {
  ChartConfig,
} from "@/components/chart";
import {
  StyledChartContainer,
} from "../../ui-test/StyledChartContainer";
import { useState } from "react";
import { BarLabelListTopLeft, CustomTick, getLabel, getColor } from "./shared"

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

type DataInput = {
  category: string;
  marketPurchase: number;
  fairholdLandPurchase: number;
  fairholdLandRent: number;
  [key: string]: string | number;
};

interface StackedBarChartProps {
  data: DataInput[];
  maxY: number;
}

const HowMuchFHCostBarChart: React.FC<StackedBarChartProps> = ({
  data,
  maxY,
}) => {
  const [hoveredBar, setHoveredBar] = useState<{ dataKey: string; value: number } | null>(null);
  const CustomTooltip: React.FC<{ hoveredBar: { dataKey: string; value: number } | null }> = ({ hoveredBar }) => {
    if (!hoveredBar) return null;
  
    const { dataKey, value } = hoveredBar;
    const label = dataKey.includes("Land") ? "Land" : "House";
  
    return (
      <div className="bg-[rgb(var(--text-default-rgb))] p-2 shadow-sm rounded-xl">
        <div style={{ color: "rgb(var(--button-background-rgb))" }}>
          {label} £{value.toLocaleString()}
        </div>
      </div>
    );
  };

  const chartData = [
    {
      tenure: "Freehold",
      freeholdLand: data[0].marketPurchase,
      freeholdLandLabel: "Land",
      freeholdHouse: data[1].marketPurchase,
      freeholdHouseLabel: "House",
      freeholdTotal: data[0].marketPurchase + data[1].marketPurchase,
    },
    {
      tenure: "Fairhold - Land Purchase",
      fairholdLand: data[0].fairholdLandPurchase,
      fairholdLandLabel: "Land",
      fairholdHouse: data[2].fairholdLandPurchase,
      fairholdHouseLabel: "House",
      fairholdTotal: data[0].fairholdLandPurchase + data[2].fairholdLandPurchase,
    },
    {
      tenure: "Fairhold - Land Rent",
      fairholdHouse: data[2].fairholdLandRent,
      fairholdHouseLabel: "House",
      fairholdTotal: data[2].fairholdLandRent,
    },
  ];

  return (
    <Card className="h-full w-full">
      <CardContent className="h-full w-full p-0 md:p-4">
        <StyledChartContainer config={chartConfig}
        className="[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent h-full w-full">
          <BarChart className="w-full" accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tenure"
              tickLine={false}
              interval={0} 
              height={60}  
              tick={(props) => (
                <CustomTick 
                  {...props} 
                  getLabel={getLabel}
                  getColor={getColor}
                  index={props.index}
                  />
              )}
            >
            </XAxis>

            <YAxis
              domain={[0, maxY]}
              tick={false}
              tickLine={false}
              axisLine={false}
              hide={true}
              ></YAxis>  
            <Tooltip content={<CustomTooltip hoveredBar={hoveredBar} />} isAnimationActive={false} />
            <Bar
              dataKey="freeholdLand"
              stackId="stack"
              fill="var(--color-freeholdLand)"
              onMouseOver={() =>
                setHoveredBar({ dataKey: "freeholdLand", value: Math.round(chartData[0].freeholdLand || 0 )})
              }
              onMouseOut={() => setHoveredBar(null)}              >
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
              onMouseOver={() =>
                setHoveredBar({ dataKey: "freeholdHouse", value: Math.round(chartData[0].freeholdHouse || 0 )})
              }
              onMouseOut={() => setHoveredBar(null)}
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
                content={(props) => (
                  <BarLabelListTopLeft {...props} color="rgb(var(--freehold-equity-color-rgb))" />
                )}
              />
            </Bar>
            <Bar
              dataKey="fairholdLand"
              stackId="stack"
              fill="var(--color-fairholdLand)"
              onMouseOver={() =>
                setHoveredBar({ dataKey: "fairholdLand", value: Math.round(chartData[1].fairholdLand || 0 )})
              }
              onMouseOut={() => setHoveredBar(null)}
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
              onMouseOver={() =>
                setHoveredBar({ dataKey: "fairholdHouse", value: Math.round(chartData[1].fairholdHouse || 0 )})
              }
              onMouseOut={() => setHoveredBar(null)}
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
                content={(props) => (
                  <BarLabelListTopLeft {...props} color="rgb(var(--fairhold-equity-color-rgb))" />
                )}
              />
            </Bar>
          </BarChart>
        </StyledChartContainer>
      </CardContent>
    </Card>
  );
};

export default HowMuchFHCostBarChart;