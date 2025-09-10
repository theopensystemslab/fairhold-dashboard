import React from "react"
import SurveyGraphCard from "@components/custom/survey/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import CustomTick from "../CustomTick";

export const WhyFairhold: React.FC<{ maxX: number }> = ({ maxX }) => {
  const { whyFairhold } = useSurveyContext().surveyResults.barOrPie;
  const { loading } = useSurveyContext();
  
  return (
      <SurveyGraphCard title="Why would you choose Fairhold?" loading={loading} >
          <ResponsiveContainer height={150}>
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
                  domain={[0, maxX]}
                  /> 
              <YAxis 
                  type="category"    
                  dataKey="answer" 
                  width={150} 
                  fontSize={10}
                  interval={0}
                  tickLine={false}
                  axisLine={false}
                  tick={(props) => 
                    <CustomTick 
                        {...props} 
                        color={"rgb(var(--fairhold-equity-color-rgb))"} 
                    />
                    }                        
                  /> 
              <Bar dataKey="value" fill="rgb(var(--fairhold-equity-color-rgb))" /> 
          </BarChart>
          </ResponsiveContainer>
      </SurveyGraphCard>
  )
}
