"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, ReferenceLine } from "recharts";
import { Card, CardContent } from "@/components/card";
import {
  ChartConfig,
} from "@/components/chart";
import {
  StyledChartContainer,
} from "@components/custom/ui/StyledChartContainer";
import { BarLabelListTopLeft, CustomLabelListContentProps, CustomTick, getLabel } from "./shared"

const chartConfig = {
  freehold: {
    color: "rgb(var(--not-viable-light-color-rgb))",
  },
  fairhold: {
    color: "rgb(var(--fairhold-interest-color-rgb))",
  },
} satisfies ChartConfig;

const CenterLabelListContent: React.FC<CustomLabelListContentProps> = ({
  x,
  y,
  value,
  width,
  height,
}) => {
  if ( typeof x !== 'number' || 
    typeof y !== 'number' || 
    typeof width !== 'number' ||
    typeof height !== 'number' ||
    !value
  ) return null;

  const labelColor = (() => {
      switch (value) {
        case "Not viable":
          return "rgb(var(--not-viable-dark-color-rgb))";
        case "House":
          return "white";
        default:
          return "black";
      }
    })();

  const labelWidth = 80;
  const xPos = x + width / 2 - labelWidth / 2;
  const yPos = y + height / 2 - 10;

  return (
    <foreignObject x={xPos} y={yPos} width={80} height={20}>
        <div
        style={{
            color: labelColor,
            fontSize: "12px",
            fontWeight: 600,
            textAlign: "center",
        }}
        >
        {value}
        </div>
    </foreignObject>
  );
};

type DataInput = {
  category: string;
  marketPurchase: number;
  fairholdLandPurchase: number;
  fairholdLandRent: number;
  [key: string]: string | number;
};

interface StackedBarChartProps { // TODO: refactor so there is only one exported StackedBarChartProps type?
  data: DataInput[];
  newBuildPrice: number;
  maxY: number;
}

const HowMuchFHCostBarChart: React.FC<StackedBarChartProps> = ({
  data,
  newBuildPrice,
  maxY
}) => {
  const chartData = [
    {
      tenure: "Freehold",
      total: data[0].marketPurchase + data[1].marketPurchase,
      label: "Not viable",    
      fill: "rgb(var(--not-viable-light-color-rgb))",
      color: "rgb(var(--not-viable-dark-color-rgb))",
    },
    {
      tenure: "Fairhold - Land Purchase",
      total: data[2].fairholdLandPurchase,
      label: "House",
      fill: "rgb(var(--fairhold-interest-color-rgb))",
      color: "rgb(var(--fairhold-equity-color-rgb))",
    },
    {
      tenure: "Fairhold - Land Rent",
      total: data[2].fairholdLandRent,
      label: "House",
      fill: "rgb(var(--fairhold-interest-color-rgb))",
      color: "rgb(var(--fairhold-equity-color-rgb))",
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
                  getColor={(value) =>
                    value === "Freehold"
                      ? "rgb(var(--not-viable-dark-color-rgb))"
                      : "rgb(var(--fairhold-equity-color-rgb))"
                  }
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

            <ReferenceLine 
                y={newBuildPrice} 
                z={0}
                stroke="rgb(var(--text-default-rgb))" 
                label={(props) => {
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
                        Build cost
                      </text>
                    </g>
                  );
                }}
              />   
            <Bar
              dataKey="total"
              >
              <LabelList
                dataKey="label"
                position="center"
                fontSize={12}
                content={(props) => (
                  <CenterLabelListContent {...props}/>
                )}
              />
              <LabelList
                dataKey="total"
                position="top"
                content={(props) => (
                  <BarLabelListTopLeft {...props} color={props.index !== undefined ? chartData[props.index].color : "#666"}/>
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