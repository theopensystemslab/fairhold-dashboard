import React from "react"
import SurveyGraphCard from "@components/custom/survey/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import CustomTick from "@components/custom/survey/CustomTick";

export const SupportDevelopmentFactors = () => {
  const supportDevelopmentFactors = useSurveyContext().barOrPie.supportDevelopmentFactors;
    
    return (
        <SurveyGraphCard title="Which of these factors would make you more likely to support new homes being created near where you live?">
            <ResponsiveContainer height="100%" width="100%">
            <BarChart
                data={supportDevelopmentFactors}
                barSize={20}
                height={480}
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
                    width={180} 
                    interval={0}
                    tick={CustomTick}
                    axisLine={false}
                    tickLine={false}
                    /> 
                    
                <Bar dataKey="value" fill="rgb(var(--fairhold-equity-color-rgb))" /> 
            </BarChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
