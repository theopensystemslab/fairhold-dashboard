"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, ReferenceLine } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  StyledChartContainer,
} from "../ui/StyledChartContainer";
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
  maxY: number;
}

type ChartData = {
  tenure: string;
  land: number;
  house: number;
  monthly: number;
  fill: string;
}

interface CustomLabelListContentProps {
  x?: number | string | undefined;
  y?: number | string | undefined;
  value?: number | string;
  index?: number;
  color: string;
}

const CustomLabelListContent: React.FC<CustomLabelListContentProps> = ({
  x,
  y,
  value,
  color
}) => {
  const xNum = typeof x === "number" ? x : Number(x);
  const yNum = typeof y === "number" ? y : Number(y);
  const xPos = xNum - 2;
  const yPos = yNum - 30;

  const numValue = typeof value === "number" ? value : Number(value);
  const formattedValue = formatValue(numValue);

  return (
    <foreignObject x={xPos} y={yPos} width={100} height={30}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          color: color,
          fontSize: "18px",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {formattedValue}
      </div>
    </foreignObject>
  )};

const HowMuchPerMonthBarChart: React.FC<StackedBarChartProps> = ({ 
  data, 
  maxY 
}) => {
  const chartData:ChartData[] = [
    {
      tenure: "Freehold",
      land: data[0].marketPurchase,
      house: data[1].marketPurchase,
      monthly: data[0].marketPurchase + data[1].marketPurchase,
      fill: "rgb(var(--freehold-equity-color-rgb))",
    },
    {
      tenure: "Private Rent",
      land: data[0].marketRent,
      house: data[1].marketRent,
      monthly: data[0].marketRent + data[1].marketRent,
      fill: "rgb(var(--private-rent-land-color-rgb))",
    },

    {
      tenure: "Fairhold - Land Purchase",
      land: data[0].fairholdLandPurchase,
      house: data[1].fairholdLandPurchase,
      monthly: data[0].fairholdLandPurchase + data[1].fairholdLandPurchase,
      fill: "rgb(var(--fairhold-equity-color-rgb))",
    },
    {
      tenure: "Fairhold - Land Rent",
      land: data[0].fairholdLandRent,
      house: data[1].fairholdLandRent,
      monthly: data[0].fairholdLandRent + data[1].fairholdLandRent,
      fill: "rgb(var(--fairhold-interest-color-rgb))",
    },

    {
      tenure: "Social Rent",
      land: data[0].socialRent,
      house: data[1].socialRent,
      monthly: data[0].socialRent + data[1].socialRent,
      fill: "rgb(var(--social-rent-land-color-rgb))",
    },
  ];

  const getLabelColor = (tenure: string): string => {
    switch (tenure) {
      case "Freehold":
        return "rgb(var(--freehold-equity-color-rgb))";
      case "Private Rent":
        return "rgb(var(--private-rent-land-color-rgb))";
      case "Fairhold - Land Purchase":
        return "rgb(var(--fairhold-equity-color-rgb))";
      case "Fairhold - Land Rent":
        return "rgb(var(--fairhold-equity-color-rgb))";
      case "Social Rent":
        return "rgb(var(--social-rent-land-color-rgb))";
      default:
        return "#666";
    }
  }

  return (
    <Card className="h-full w-full">
      <CardContent className="h-full w-full p-0 md:p-4">
        <StyledChartContainer config={{}}
        className="[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent h-full w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tenure"
              tickLine={false}
              interval={0} 
              height={60} 
              tick={({ x, y, payload }) => {
                const labelColor = getLabelColor(payload.value);
                const label = (() => {
                  switch (payload.value) {
                    case "Freehold":
                      return "Freehold";
                    case "Private Rent":
                      return "Private\nrent";
                    case "Fairhold - Land Purchase":
                      return "Fairhold \n/LP";
                    case "Fairhold - Land Rent":
                      return "Fairhold \n/LR";
                    case "Social Rent":
                      return "Social\nRent";
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
                                      style={{ fill: labelColor }}
                                      fontSize="12px"
                                      fontWeight={600}
                                    >
                                      {line}
                                    </text>
                                  ))}
                                </g>
                              );
                            }}
                          >
                          </XAxis>
            <YAxis 
              domain={[0, maxY]}
              tick={false}
              axisLine={false}
              tickLine={false}
              hide={true}
              ></YAxis>
            <ChartLegend content={<ChartLegendContent />} />    
              <Bar dataKey="monthly" strokeWidth={2} activeIndex={2}>
              <LabelList
                dataKey="monthly"
                position="top"
                content={(props) => (
                  <CustomLabelListContent
                    {...props}
                    color={props.index !== undefined ? chartData[props.index].fill : "#666"}
                  />
                )}
              />
            </Bar>
            <ReferenceLine 
              y={data[0].affordabilityMonthly} 
              stroke="rgb(var(--text-default-rgb))" 
              label={(props) => { // formatting here is to ensure line break
                const { viewBox } = props;
                return (
                  <g>
                    <text
                      x={viewBox.width} 
                      y={viewBox.y - 15} 
                      textAnchor="end"
                      fill="rgb(var(--text-default-rgb))"
                      fontSize={12}
                    >
                      Affordable
                    </text>
                  </g>
                );
              }}
            />    
          </BarChart>
        </StyledChartContainer>
      </CardContent>
    </Card>
  );
};

export default HowMuchPerMonthBarChart;
