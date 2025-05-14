import React from "react"
import { BarOrPieResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const AffordFairhold: React.FC<BarOrPieResults> = ( results ) => {
    return (
        <SurveyGraphCard title="Could you afford a Fairhold home in your area?" results={results}></SurveyGraphCard>
    )
}
