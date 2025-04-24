import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend } from "recharts";

export const Age: React.FC<SurveyComponentProps> = ({ results }) => {
    const ageData = [
        { name: "0-18", value: 0 },
        { name: "18-24", value: 0 },
        { name: "25-34", value: 0 },
        { name: "35-44", value: 0 },
        { name: "45-54", value: 0 },
        { name: "55-64", value: 0 },
        { name: "65+", value: 0 },  
    ]

    for (const result of results) {
        if (result.ageGroup === "0-18") ageData[0].value++;
        else if (result.ageGroup === "18-24") ageData[1].value++;
        else if (result.ageGroup === "25-34") ageData[2].value++;
        else if (result.ageGroup === "35-44") ageData[3].value++;
        else if (result.ageGroup === "45-54") ageData[4].value++;
        else if (result.ageGroup === "55-64") ageData[5].value++;
        else if (result.ageGroup === "65+") ageData[6].value++;
    }

    return (
        <SurveyGraphCard title="How old are you?" results={results}>
            <PieChart>
                <Pie data={ageData} dataKey="value" nameKey="name" fill="#8884d8" />
                <Legend align="center" verticalAlign="bottom"/>
            </PieChart>
        </SurveyGraphCard>
    )
}
