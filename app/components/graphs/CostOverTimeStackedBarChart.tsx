"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface LifetimeBarData {
  year: number;
  land: number;
  house: number;
  maintenance?: number;
}

  interface CostOverTimeStackedBarChartProps {
    data: LifetimeBarData[];
    config: {
      colors: {
        land: string;
        house: string;
        maintenance?: string;
      };
      showMaintenance: boolean;
    };
  }

const CostOverTimeStackedBarChart: React.FC<CostOverTimeStackedBarChartProps> = ({
  data,
  config
}) => {
    const chartConfig: Record<string, { label: string; color: string }> = { // LINE CHANGED
        land: {
          label: "Land",
          color: config.colors.land,
        },
        house: {
          label: "House",
          color: config.colors.house,
        },
      };
    
      if (config.colors.maintenance) { // LINE CHANGED
        chartConfig.maintenance = { // LINE CHANGED
          label: "Maintenance", // LINE CHANGED
          color: config.colors.maintenance, // LINE CHANGED
        }; // LINE CHANGED
      }
  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            
            <Bar dataKey="land" stackId="a" fill={config.colors.land} name="Land" />
            <Bar dataKey="house" stackId="a" fill={config.colors.house} name="House" />
            {config.showMaintenance && config.colors.maintenance && (
              <Bar 
                dataKey="maintenance" 
                stackId="a" 
                fill={config.colors.maintenance} 
                name="Maintenance" 
              />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CostOverTimeStackedBarChart