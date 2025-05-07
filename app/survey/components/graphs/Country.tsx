import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend } from "recharts";

export const Country: React.FC<SurveyComponentProps> = ({ results }) => {
    console.log(results.country)
    return (
        <SurveyGraphCard title="Which country?" results={results}>
            <PieChart>
                <Pie data={results.country} dataKey="value" nameKey="name" fill="#8884d8" />
                <Legend align="center" verticalAlign="bottom" height={36}/>
            </PieChart>
        </SurveyGraphCard>
    )
}
