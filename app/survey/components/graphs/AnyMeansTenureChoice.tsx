import React from "react"
import { Results } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const AnyMeansTenureChoice: React.FC<Results> = (results) => {
    return (
        <SurveyGraphCard title="What tenure would you choose?" results={results}></SurveyGraphCard>
    )
}
