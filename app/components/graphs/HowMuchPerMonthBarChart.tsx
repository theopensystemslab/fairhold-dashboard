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
import { BarLabelListTopLeft, CustomTick, getLabel, getColor } from "./shared";

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
                  <BarLabelListTopLeft
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
  )};

export default HowMuchPerMonthBarChart;
