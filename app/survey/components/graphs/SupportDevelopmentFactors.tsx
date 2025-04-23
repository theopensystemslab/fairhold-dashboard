import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const SupportDevelopmentFactors: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="Which of these factors would make you more likely to support new homes being created near where you live?" results={results}></SurveyGraphCard>
    )
}
