"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive pie chart";

type DataInput = {
  paymentType: string;
  marketPurchase: number;
  marketRent: number;
  fairholdLandPurchase: number;
  fairholdLandRent: number;
};

interface TotalPaymentProps {
  data: DataInput[];
}

function formatToThousands(value: number): string {
  // Round to the nearest thousand and divide by 1,000
  const thousands = Math.round(value / 1000);

  // Return the formatted string with the pound symbol and "K" suffix
  return `£ ${thousands}k`;
}
/* const desktopData = [
  { month: "january", desktop: 186, fill: "var(--color-january)" },
  { month: "february", desktop: 305, fill: "var(--color-february)" },
  { month: "march", desktop: 237, fill: "var(--color-march)" },
  { month: "april", desktop: 173, fill: "var(--color-april)" },
  { month: "may", desktop: 209, fill: "var(--color-may)" },
]; */

const chartConfig = {
  pounds: {
    label: "Pounds",
  },
  marketPurchase: {
    label: "marketPurchase",
    color: "hsl(var(--chart-1))",
  },
  marketRent: {
    label: "marketRent",
    color: "hsl(var(--chart-2))",
  },
  fairholdLandPurchase: {
    label: "fairholdLandPurchase",
    color: "hsl(var(--chart-3))",
  },
  fairholdLandRent: {
    label: "fairholdLandRent",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const TotalPaymentPieChart: React.FC<TotalPaymentProps> = ({ data }) => {
  const id = "pie-interactive";
  const chartData = [
    {
      tenure: "marketPurchase",
      totalpayment: data[0].marketPurchase,
      fill: "hsl(var(--chart-1))",
    },
    {
      tenure: "marketRent",
      totalpayment: data[0].marketRent,
      fill: "hsl(var(--chart-2))",
    },
    {
      tenure: "fairholdLandPurchase",
      totalpayment: data[0].fairholdLandPurchase,
      fill: "hsl(var(--chart-3))",
    },
    {
      tenure: "fairholdLandRent",
      totalpayment: data[0].fairholdLandRent,
      fill: "hsl(var(--chart-4))",
    },
  ];

  const [activeTenure, setActiveTenure] = React.useState(chartData[0].tenure);

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.tenure === activeTenure),
    [activeTenure]
  );
  const tenures = React.useMemo(() => chartData.map((item) => item.tenure), []);

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Total payment</CardTitle>
          <CardDescription>Pounds spent by tenure model</CardDescription>
        </div>
        <Select value={activeTenure} onValueChange={setActiveTenure}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select tenure" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {tenures.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig];

              if (!config) {
                return null;
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="totalpayment"
              nameKey="tenure"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const totalPoundsSpent = formatToThousands(
                      chartData[activeIndex].totalpayment
                    );
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalPoundsSpent.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          British pounds
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
export default TotalPaymentPieChart;
