import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend } from "recharts";

export const Country: React.FC<SurveyComponentProps> = ({ results }) => {
    const ukCount = results.reduce((total, result) => 
        result.uk === "United Kingdom" ? total + 1 : total, 0);
    const nonUkCount = results.length - ukCount;
    const countryData = [
        { name: "United Kingdom", value: ukCount },
        { name: "Non-UK", value: nonUkCount },
    ]
    return (
        <SurveyGraphCard title="Which country?" results={results}>
            <PieChart>
                <Pie data={countryData} dataKey="value" nameKey="name" fill="#8884d8" />
                <Legend align="center" verticalAlign="bottom" height={36}/>
            </PieChart>
        </SurveyGraphCard>
    )
}
