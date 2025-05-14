import React from "react"
import { Results } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const SupportDevelopment: React.FC<Results> = (results) => {
    return (
        <SurveyGraphCard title="Would you support development in general?" results={results}></SurveyGraphCard>
    )
}
