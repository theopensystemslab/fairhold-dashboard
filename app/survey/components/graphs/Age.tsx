import React from "react"
import { Results } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const Age: React.FC<Results> = (results) => {
    return (
        <SurveyGraphCard title="How old are you?" results={results}></SurveyGraphCard>
    )
}
