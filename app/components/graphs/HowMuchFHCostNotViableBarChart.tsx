"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList, Tooltip, ReferenceLine } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
} from "@/components/ui/chart";
import {
  StyledChartContainer,
} from "../ui/StyledChartContainer";
import { formatValue } from "@/app/lib/format";
import { CustomLabelListContentProps } from "./types";

const chartConfig = {
  freehold: {
    color: "rgb(var(--not-viable-light-color-rgb))",
  },
  fairhold: {
    color: "rgb(var(--fairhold-interest-color-rgb))",
  },
} satisfies ChartConfig;

const CustomLabelListContent: React.FC<CustomLabelListContentProps> = ({
  x,
  y,
  value,
  index
}) => {

  if (x === undefined || y === undefined || value === undefined) return null;

  const labelColor = (() => {
    switch (index) {
      case 0:
        return "rgb(var(--not-viable-dark-color-rgb))";
      default:
        return "rgb(var(--fairhold-equity-color-rgb))";
    }
  })();

  const xPos = typeof x === 'number' ? x - 2 : 0;
  const yPos = typeof y === 'number' ? y - 30 : 0;
  const checkedValue = typeof value === 'number' ? value : parseFloat(value as string);
  const formattedValue = formatValue(checkedValue);

  return (
    <foreignObject x={xPos} y={yPos} width={100} height={30}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          color: labelColor,
          backgroundColor: "rgb(var(--background-end-rgb))",
          fontSize: "18px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          padding: "2px 6px",
          zIndex: 10,
        }}
      >
        {formattedValue}
      </div>
    </foreignObject>
  );
}

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

interface CustomTickProps {
  x: number; 
  y: number; 
  payload: { value: string } 
}

const CustomTick: React.FC<CustomTickProps> = ({ x, y, payload }) => {
    const label = (() => {
      switch (payload.value) {
        case "freehold":
          return "Freehold";
        case "fairhold: land purchase":
          return "Fairhold /\nLand Purchase";
        case "fairhold: land rent":
          return "Fairhold /\nLand Rent";
        default:
          return payload.value;
      }
    })();
    const labelColor = (() => {
      switch (payload.value) {
        case "freehold":
          return "rgb(var(--not-viable-dark-color-rgb))";
        default:
          return "rgb(var(--fairhold-equity-color-rgb))";
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
  }

const HowMuchFHCostBarChart: React.FC<StackedBarChartProps> = ({
  data,
  newBuildPrice,
  maxY
}) => {
  const chartData = [
    {
      tenure: "freehold",
      total: data[0].marketPurchase + data[1].marketPurchase,
      label: "Not viable",    
      fill: "rgb(var(--not-viable-light-color-rgb))",
    },
    {
      tenure: "fairhold: land purchase",
      total: data[2].fairholdLandPurchase,
      label: "House",
      fill: "rgb(var(--fairhold-interest-color-rgb))",
    },
    {
      tenure: "fairhold: land rent",
      total: data[2].fairholdLandRent,
      label: "House",
      fill: "rgb(var(--fairhold-interest-color-rgb))",
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
                  <CustomTick {...props} />
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

            <Tooltip isAnimationActive={false} />
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
                  <CustomLabelListContent {...props}/>
                )}
              />
              <LabelList
                dataKey="total"
                position="top"
                content={(props) => {
                  if (!props.x || !props.y || !props.value) return null;
                  
                  const labelColor = (() => {
                    switch (props.index) {
                      case 0:
                        return "rgb(var(--not-viable-dark-color-rgb))";
                      default:
                        return "rgb(var(--fairhold-equity-color-rgb))";
                    }
                  })();

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
                          color: labelColor,
                          backgroundColor: "rgb(var(--background-end-rgb))",
                          fontSize: "18px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          padding: "2px 6px",
                          zIndex: 10,
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