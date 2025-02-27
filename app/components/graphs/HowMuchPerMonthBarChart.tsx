"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, LabelList, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
}

const HowMuchPerMonthBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
  const chartData = [
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
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        <StyledChartContainer config={{}}
        className="[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="tenure"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
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
            <ReferenceLine 
              y={data[0].affordabilityMonthly} 
              stroke="rgb(var(--text-inaccessible-rgb))" 
              strokeDasharray="6 6" 
              label={{ 
                value: '35% average household income',
                position: 'insideTopRight',
                fill: 'rgb(var(--text-inaccessible-rgb))',
                fontSize: 12, 
                offset: 10
              }} 
            />        
          </BarChart>
        </StyledChartContainer>
      </CardContent>
    </Card>
  );
};

export default HowMuchPerMonthBarChart;
