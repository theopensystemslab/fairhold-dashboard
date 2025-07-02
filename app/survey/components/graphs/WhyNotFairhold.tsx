import React from "react"
import { TickProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";
import { getTopFive, calculateChartMaximum } from "../../utils";

export const WhyNotFairhold = () => {
  const whyNotFairhold = useSurveyContext().barOrPie.whyNotFairhold;
  const chartMax = calculateChartMaximum(whyNotFairhold);
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
      <SurveyGraphCard 
        title={<>Why <em>not</em> Fairhold?</>}
        subtitle="Top 5 responses from people who would not choose Fairhold">
          <ResponsiveContainer height={whyNotFairholdTopFive.length * 30}>
          <BarChart
              data={whyNotFairholdTopFive}
              barSize={20}
              barGap={0}
              layout="vertical"
          >
              <XAxis 
                  type="number"
                  height={20}
                  fontSize={10}
                  interval={10}
                  domain={[0, chartMax]}
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