import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";

export const Age = () => {
    const ageGroup = useSurveyContext().barOrPie.ageGroup;
    
    return (
        <SurveyGraphCard title="How old are you?">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie 
                        data={ageGroup} 
                        dataKey="value" 
                        nameKey="answer" 
                        fill="rgb(var(--survey-placeholder))" 
                        innerRadius="40%"
                        outerRadius="80%"
                        />
                    <Legend align="center" verticalAlign="bottom" />
                </PieChart>
        </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
  