import React from "react"
import { TickProps } from "@/app/survey/types";
import SurveyGraphCard from "@/components/custom-test/survey-test/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../../../app/survey/context";
import { getTopFive } from "@/app/survey/utils";

export const WhyNotFairhold = () => {
  const whyNotFairhold = useSurveyContext().barOrPie.whyNotFairhold;
  const whyNotFairholdTopFive = getTopFive(whyNotFairhold);

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
      <SurveyGraphCard title="Why wouldn't you choose Fairhold?">
          <ResponsiveContainer>
          <BarChart
              data={whyNotFairholdTopFive}
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
                  width={350} 
                  fontSize={10}
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  tick={Tick}/> 
              <Bar dataKey="value" fill="rgb(var(--survey-placeholder))" /> 
          </BarChart>
          </ResponsiveContainer>
      </SurveyGraphCard>
  )
}