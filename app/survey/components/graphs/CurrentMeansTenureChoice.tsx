import React from "react"
import { Results } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const CurrentMeansTenureChoice: React.FC<Results> = (results) => {
    return (
        <SurveyGraphCard title="Could you afford a Fairhold home in your area?" results={results}></SurveyGraphCard>
    )
}
