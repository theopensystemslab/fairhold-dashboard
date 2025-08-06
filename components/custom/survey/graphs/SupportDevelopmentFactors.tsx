import React from "react"
import { TickProps } from "@lib/survey/types";
import SurveyGraphCard from "@components/custom/survey/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";

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
            <ResponsiveContainer height={480} width="100%">
            <BarChart
                data={supportDevelopmentFactors}
                barSize={20}
                layout="vertical"
            >
                <XAxis 
                  type="number" 
                  tick={false}
                  tickLine={false}
                  axisLine={false}                  
                /> 
                <YAxis 
                    type="category"    
                    dataKey="answer" 
                    width={150} 
                    fontSize={10}
                    interval={0}
                    tick={Tick}
                    axisLine={false}
                    tickLine={false}
                    /> 
                    
                <Bar dataKey="value" fill="rgb(var(--fairhold-equity-color-rgb))" /> 
            </BarChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
