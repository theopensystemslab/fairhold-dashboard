import React from "react"
import { Results } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const Country: React.FC<Results> = (results) => {
    return (
        <SurveyGraphCard title="Which country?" results={results}></SurveyGraphCard>
    )
}
