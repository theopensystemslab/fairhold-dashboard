import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const Age: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="How old are you?" results={results}></SurveyGraphCard>
    )
}
