import React from "react"
import { BarOrPieResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";

export const SupportDevelopment: React.FC<BarOrPieResults> = (results) => {
    return (
        <SurveyGraphCard title="Would you support development in general?" results={results}>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={results.supportDevelopment} dataKey="value" nameKey="answer" fill="rgb(var(--survey-placeholder))" />
                    <Legend align="center" verticalAlign="bottom" />
             </PieChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
