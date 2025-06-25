import React from "react"
import { TickProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";

export const WhyFairhold = () => {
  let { whyFairhold } = useSurveyContext().barOrPie;
  whyFairhold = whyFairhold.slice(0,5);
  const maxValue = whyFairhold.length > 0 ? whyFairhold[0].value : 0;
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
        title="Why would you choose Fairhold?" 
        subtitle="Top 5 responses from people who would choose Fairhold"
      >
          <ResponsiveContainer height={whyFairhold.length * 30}>
          <BarChart
              data={whyFairhold}
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
              <Bar dataKey="value" fill="rgb(var(--fairhold-equity-color-rgb))" /> 
          </BarChart>
          </ResponsiveContainer>
      </SurveyGraphCard>
  )
}
