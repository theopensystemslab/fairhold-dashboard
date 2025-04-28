import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const AnyMeansTenureChoice: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="What tenure would you choose?" results={results}></SurveyGraphCard>
    )
}
