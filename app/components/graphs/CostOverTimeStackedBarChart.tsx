"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface LifetimeBarData {
  landRent?: number;
  equity?: number;
  interest?: number;
  rent?: number;
  maintenance?: number;
}

  interface CostOverTimeStackedBarChartProps {
    data: LifetimeBarData[];
    maxY: number;
    config: {
      colors: {
        landRent?: string;
        equity?: string;
        interest?: string;
        rent?: string;
        maintenance?: string;
      };
      // showMaintenance: boolean;
    };
  }

const CostOverTimeStackedBarChart: React.FC<CostOverTimeStackedBarChartProps> = ({
  data,
  maxY,
  config
}) => {
  const chartConfig: Record<string, { label: string; color: string }> = {}; 
    
  if (config.colors.landRent) { 
    chartConfig.landRent = { 
      label: "Land Rent", 
      color: config.colors.landRent, 
    }; 
  }

  if (config.colors.equity) { 
    chartConfig.equity = { 
      label: "Equity", 
      color: config.colors.equity, 
    }; 
  }

  if (config.colors.interest) { 
    chartConfig.interest = { 
      label: "Interest", 
      color: config.colors.interest, 
    }; 
  }

  if (config.colors.rent) { 
    chartConfig.rent = { 
      label: "Rent", 
      color: config.colors.rent, 
    }; 
  }

  if (config.colors.maintenance) { 
    chartConfig.maintenance = { 
      label: "Maintenance", 
      color: config.colors.maintenance, 
    }; 
  }

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis 
              domain={[0, maxY]}/>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            
            {config.colors.landRent && ( 
              <Bar dataKey="landRent" stackId="a" fill={config.colors.landRent} name="Land Rent" /> 
            )}
            {config.colors.equity && ( 
              <Bar dataKey="equity" stackId="a" fill={config.colors.equity} name="Equity" /> 
            )}
            {config.colors.interest && ( 
              <Bar dataKey="interest" stackId="a" fill={config.colors.interest} name="Interest" /> 
            )}
            {config.colors.rent && ( 
              <Bar dataKey="rent" stackId="a" fill={config.colors.rent} name="Rent" /> 
            )}
            {config.colors.maintenance && (
              <Bar dataKey="maintenance" stackId="a" fill={config.colors.maintenance} name="Maintenance" />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CostOverTimeStackedBarChart