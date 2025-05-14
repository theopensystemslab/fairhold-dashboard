import React from "react"
import { BarOrPieResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";

export const Age: React.FC<BarOrPieResults> = ({ ageGroup }) => {
    return (
        <SurveyGraphCard title="How old are you?">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={ageGroup} dataKey="value" nameKey="answer" fill="rgb(var(--survey-placeholder))" />
                    <Legend align="center" verticalAlign="bottom" />
                </PieChart>
        </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
  