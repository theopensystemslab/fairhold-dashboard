import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const Postcode: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="What is your postcode?" results={results}></SurveyGraphCard>
    )
}
