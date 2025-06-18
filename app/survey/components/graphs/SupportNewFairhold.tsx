import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";

export const SupportNewFairhold = () => {
    const supportNewFairhold = useSurveyContext().barOrPie.supportNewFairhold;
    
    return (
        <SurveyGraphCard title="Would you support the creation of Fairhold homes in the area where you want to live?">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie 
                        data={supportNewFairhold} 
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
