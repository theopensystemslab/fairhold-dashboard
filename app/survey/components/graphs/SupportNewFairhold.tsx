import React from "react"
import { BarOrPieResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";


export const SupportNewFairhold: React.FC<BarOrPieResults> = ({ supportNewFairhold }) => {
    return (
        <SurveyGraphCard title="Would you support the creation of Fairhold homes in the area where you want to live?">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={supportNewFairhold} dataKey="value" nameKey="answer" fill="rgb(var(--survey-placeholder))" />
                    <Legend align="center" verticalAlign="bottom" />
             </PieChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
