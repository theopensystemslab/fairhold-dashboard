import React from "react"
import { SankeyResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const AnyMeansTenureChoice: React.FC<SankeyResults> = (results) => {
    return (
        <SurveyGraphCard title="What tenure would you choose?" results={results}></SurveyGraphCard>
    )
}
