import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";
export const AffordFairhold = () => {
    const affordFairhold = useSurveyContext().barOrPie.affordFairhold;

    return (
        <SurveyGraphCard title="Could you afford a Fairhold home in your area?">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie 
                        data={affordFairhold} 
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
