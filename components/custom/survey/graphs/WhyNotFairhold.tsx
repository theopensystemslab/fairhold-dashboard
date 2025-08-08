import React from "react"
import SurveyGraphCard from "@components/custom/survey/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import CustomTick from "@components/custom/survey/CustomTick";

export const WhyNotFairhold = () => {
  const whyNotFairhold = useSurveyContext().barOrPie.whyNotFairhold;
  
  return (
      <SurveyGraphCard title="Why wouldn't you choose Fairhold?">
          <ResponsiveContainer>
          <BarChart
              data={whyNotFairhold}
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
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  tick={(props) => <CustomTick {...props} />}
                /> 
              <Bar dataKey="value" fill="rgb(var(--survey-placeholder))" /> 
          </BarChart>
          </ResponsiveContainer>
      </SurveyGraphCard>
  )
}