"use client";

import { Bar, BarChart, CartesianGrid, XAxis, LabelList, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
} from "@/components/ui/chart";
import {
  StyledChartContainer,
} from "../ui/StyledChartContainer";
import { useState } from "react";
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

const HowMuchFHCostBarChart: React.FC<StackedBarChartProps> = ({
  data,
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
              tick={({ x, y, payload }) => {
                const label = (() => {
                  switch (payload.value) {
                    case "freehold":
                      return "Freehold";
                    case "fairhold: land purchase":
                      return "Fairhold –\nLand Purchase";
                    case "fairhold: land rent":
                      return "Fairhold –\nLand Rent";
                    default:
                      return payload.value;
                  }
                })();

                return (
                  <g transform={`translate(${x},${y})`}>
                    {label.split('\n').map((line: string, i: number) => (
                      <text
                        key={i}
                        x={0}
                        y={i * 20}
                        dy={10}
                        textAnchor="middle"
                        fill="#666"
                        fontSize="12px"
                      >
                        {line}
                      </text>
                    ))}
                  </g>
                );
              }}
            >
            </XAxis>

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
                content={(props) => {
                  if (!props.x || !props.y || !props.value) return null;
                  
                  const xPos = typeof props.x === 'number' ? props.x - 2 : 0;
                  const yPos = typeof props.y === 'number' ? props.y - 30 : 0;
                  const value = typeof props.value === 'number' ? props.value : parseFloat(props.value as string);
                  const formattedValue = formatValue(value);

                  return (
                    <foreignObject x={xPos} y={yPos} width={100} height={30}>
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          color: "rgb(var(--freehold-equity-color-rgb))",
                          fontSize: "18px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formattedValue}
                      </div>
                    </foreignObject>
                  );
                }}
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
                content={(props) => {
                  if (!props.x || !props.y || !props.value) return null;
                  
                  const xPos = typeof props.x === 'number' ? props.x - 2 : 0;
                  const yPos = typeof props.y === 'number' ? props.y - 30 : 0;
                  const value = typeof props.value === 'number' ? props.value : parseFloat(props.value as string);
                  const formattedValue = formatValue(value);

                  return (
                    <foreignObject x={xPos} y={yPos} width={100} height={30}>
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          color: "rgb(var(--fairhold-equity-color-rgb))",
                          fontSize: "18px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formattedValue}
                      </div>
                    </foreignObject>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </StyledChartContainer>
      </CardContent>
    </Card>
  );
};

export default HowMuchFHCostBarChart;