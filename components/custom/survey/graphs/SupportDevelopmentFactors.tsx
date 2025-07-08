import React from "react"
import { TickProps } from "@/app/survey/types";
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@/app/survey/context";

export const SupportDevelopmentFactors = () => {
  const supportDevelopmentFactors = useSurveyContext().barOrPie.supportDevelopmentFactors;
  
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
        <SurveyGraphCard title="Which of these factors would make you more likely to support new homes being created near where you live?">
            <ResponsiveContainer height="100%" width="100%">
            <BarChart
                data={supportDevelopmentFactors}
                barSize={20}
                height={480}
                layout="vertical"
            >
                <XAxis type="number" /> 
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
