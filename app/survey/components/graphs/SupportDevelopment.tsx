import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";

export const SupportDevelopment = () => {
    const supportDevelopment = useSurveyContext().barOrPie.supportDevelopment;
    
    return (
        <SurveyGraphCard title="Would you support development in general?">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={supportDevelopment} dataKey="value" nameKey="answer" fill="rgb(var(--survey-placeholder))" />
                    <Legend align="center" verticalAlign="bottom" />
             </PieChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
