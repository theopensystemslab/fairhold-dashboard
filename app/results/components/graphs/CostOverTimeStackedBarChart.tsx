"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  StyledChartContainer,
} from "../ui/StyledChartContainer";
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

export const CostOverTimeTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload) return null;

  return (
    <div className="rounded-xl bg-[rgb(var(--text-default-rgb))] p-2 shadow-sm">
      <div className="grid grid-cols-1">
        <div className="font-bold text-[rgb(var(--button-background-rgb))]"> Year {label}</div>
        {payload.map((entry, index) => {
          let barLabel 
          if (entry.name === "Equity" && payload[0].payload.year === 1) {
            barLabel = "Deposit"
          } else if (entry.name === "Equity") {
            barLabel = "Repayment"
          } else {
            barLabel = entry.name
          }
          return (
          <div key={`tooltip-${entry.name}-${index}`} className="grid grid-cols-2 gap-4">
            <div style={{ color: "rgb(var(--button-background-rgb))" }}>
              {barLabel}
            </div>
            <div style={{ color: entry.color }}>
              £{entry.value ? Math.round(parseFloat(entry.value)).toLocaleString() : '0'}</div>
          </div>
          )
  })}
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
    <Card className="h-full w-full">
      <CardContent className="h-full w-full p-0 md:p-4">
        <StyledChartContainer config={chartConfig}
        className="h-full w-full">
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year"
              tickLine={false}
              ></XAxis>
            <YAxis 
              domain={[0, maxY]}
              tickFormatter={formatValue}
              tickLine={false}
              >
              </YAxis>
            <Tooltip content={<CostOverTimeTooltip />} />
            
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
        </StyledChartContainer>
      </CardContent>
    </Card>
  );
};

export default CostOverTimeStackedBarChart

