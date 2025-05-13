import React from "react"
import { SankeyResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const LiveWith: React.FC<SankeyResults> = (results) => {
    return (
        <SurveyGraphCard title="Who do you want to live with?" results={results}></SurveyGraphCard>
    )
}
