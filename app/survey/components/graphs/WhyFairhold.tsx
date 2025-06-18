import React from "react"
import { BarOrPieResults, TickProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

export const WhyFairhold: React.FC<BarOrPieResults> = ({ whyFairhold }) => {
    const Tick = (props: TickProps) => {
        const { x, y, payload } = props;
        return (
          <g transform={`translate(${x},${y})`}>
            <text 
              x={-10} 
              y={0} 
              dy={4} 
              textAnchor="end" 
              fill="#333" 
              fontSize={10}
              width={240}
            >
              {payload.value}
            </text>
          </g>
        );
    }
    
    return (
        <SurveyGraphCard title="Why would you choose Fairhold?">
            <ResponsiveContainer>
            <BarChart
                data={whyFairhold}
                barSize={20}
                layout="vertical"
            >
                <XAxis 
                    type="number"
                    hide={true}
                    /> 
                <YAxis 
                    type="category"    
                    dataKey="answer" 
                    width={350} 
                    fontSize={10}
                    interval={0}
                    tick={Tick}/> 
                <Bar dataKey="value" fill="rgb(var(--survey-placeholder))" /> 
            </BarChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
