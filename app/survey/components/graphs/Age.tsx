import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend } from "recharts";

export const Age: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="How old are you?" results={results}>
            <PieChart>
                <Pie data={results.age} dataKey="value" nameKey="name" fill="#8884d8" />
                <Legend align="center" verticalAlign="bottom"/>
            </PieChart>
        </SurveyGraphCard>
    )
}
