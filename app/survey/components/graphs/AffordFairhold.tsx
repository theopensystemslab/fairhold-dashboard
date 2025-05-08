import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, Tooltip } from "recharts";

export const AffordFairhold: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="Could you afford a Fairhold home in your area?" results={results}>
            <PieChart>
                <Pie data={results.affordFairhold} dataKey="value" nameKey="name" fill="#8884d8" />
                <Legend align="center" verticalAlign="bottom"/>
                <Tooltip />
            </PieChart>
        </SurveyGraphCard>
    )
}
