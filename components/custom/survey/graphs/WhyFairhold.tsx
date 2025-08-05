import React from "react"
import { TickProps } from "@lib/survey/types";
import SurveyGraphCard from "@components/custom/survey/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";

export const WhyFairhold = () => {
  const { whyFairhold } = useSurveyContext().barOrPie;

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
                  tickLine={false}
                  axisLine={false}
                  tickCount={2}
                  /> 
              <YAxis 
                  type="category"    
                  dataKey="answer" 
                  width={150} 
                  fontSize={10}
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  tick={Tick}/> 
              <Bar dataKey="value" fill="rgb(var(--fairhold-equity-color-rgb))" /> 
          </BarChart>
          </ResponsiveContainer>
      </SurveyGraphCard>
  )
}
