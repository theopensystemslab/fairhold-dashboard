import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const Country: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="Which country?" results={results}></SurveyGraphCard>
    )
}
