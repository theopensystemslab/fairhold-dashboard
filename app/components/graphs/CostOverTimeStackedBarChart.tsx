"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip, Label } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { TooltipProps } from "recharts";
import { ValueType } from "tailwindcss/types/config";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { formatValue } from "@/app/lib/format";

export interface LifetimeBarData {
  landRent?: number;
  equity?: number;
  interest?: number;
  rent?: number;
  maintenance?: number;
}

const CostOverTimeTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">Year {label}</div>
        {payload.map((entry, index) => (
          <div key={`${entry.name}-${index}`} className="grid grid-cols-2 gap-4">
            <div style={{ color: entry.color }}>{entry.name}:</div>
            <div>£{entry.value ? entry.value.toLocaleString() : '0'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
        <ChartContainer config={chartConfig}
        className="[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-transparent">
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year">
              <Label
                  value="Year"
                  position="bottom"
                  offset={10}
                  className="label-class"
                  />
            </XAxis> 
            <YAxis 
              domain={[0, maxY]}
              tickFormatter={formatValue}
              >
                
                <Label
                  value="Cost"
                  angle={-90}
                  position="left"
                  offset={10}
                  className="label-class"
                  />
              </YAxis>
            <Tooltip content={<CostOverTimeTooltip />} />
            <Legend 
                verticalAlign="top"
            />
            
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

