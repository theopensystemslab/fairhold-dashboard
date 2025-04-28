import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const SupportDevelopment: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="Would you support development in general?" results={results}></SurveyGraphCard>
    )
}
