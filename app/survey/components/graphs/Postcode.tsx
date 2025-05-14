import React from "react"
import { BarOrPieResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const Postcode: React.FC<BarOrPieResults> = (results) => {
    return (
        <SurveyGraphCard title="What is your postcode?" results={results}></SurveyGraphCard>
    )
}
