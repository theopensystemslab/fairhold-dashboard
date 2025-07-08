import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "@context/surveyContext";

export const Age = () => {
    const { ageGroup } = useSurveyContext().barOrPie;
    
    const COLORS = [
      "rgb(var(--survey-grey-lightest))", "rgb(var(--survey-grey-light))", "rgb(var(--survey-grey-mid))", "rgb(var(--survey-grey-dark))", "rgb(var(--survey-black))"  
    ];
  
    return (
        <SurveyGraphCard title="How old are you?">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie 
                        data={ageGroup} 
                        dataKey="value" 
                        nameKey="answer" 
                        fill="rgb(var(--survey-placeholder))" 
                        innerRadius="60%"
                        outerRadius="80%"
                        >
                        {ageGroup.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend align="center" verticalAlign="bottom" />
                </PieChart>
        </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
  