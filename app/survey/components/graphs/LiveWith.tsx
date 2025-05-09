import React from "react"
import { Results } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const LiveWith: React.FC<Results> = (results) => {
    return (
        <SurveyGraphCard title="Who do you want to live with?" results={results}></SurveyGraphCard>
    )
}
