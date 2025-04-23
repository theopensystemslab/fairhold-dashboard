import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const LiveWith: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="Who do you want to live with?" results={results}></SurveyGraphCard>
    )
}
