import React from "react"
import { Results } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const Postcode: React.FC<Results> = (results) => {
    return (
        <SurveyGraphCard title="What is your postcode?" results={results}></SurveyGraphCard>
    )
}
