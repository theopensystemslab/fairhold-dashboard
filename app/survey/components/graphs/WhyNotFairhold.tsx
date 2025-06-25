import React from "react"
import { TickProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";

export const WhyNotFairhold = () => {
  let whyNotFairhold = useSurveyContext().barOrPie.whyNotFairhold;
  whyNotFairhold = whyNotFairhold.slice(0,5)
  const maxValue = whyNotFairhold.length > 0 ? whyNotFairhold[0].value : 0;
  const maxResponses = Math.ceil(maxValue / 10) * 10;
  const xDomainMax = maxResponses < 10 ? 10 : maxResponses;

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
      <SurveyGraphCard 
        title="Why <em>not</em> Fairhold?"
        subtitle="Top 5 responses from people who would not choose Fairhold">
          <ResponsiveContainer height={whyNotFairhold.length * 30}>
          <BarChart
              data={whyNotFairhold}
              barSize={20}
              barGap={0}
              layout="vertical"
          >
              <XAxis 
                  type="number"
                  height={20}
                  fontSize={10}
                  interval={10}
                  domain={[0, xDomainMax]}
                  axisLine={false}
                  tickLine={false}
                  tick={true}
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