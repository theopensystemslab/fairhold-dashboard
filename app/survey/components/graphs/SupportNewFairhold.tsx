import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const SupportNewFairhold: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="Would you support the creation of Fairhold homes in the area where you want to live?" results={results}></SurveyGraphCard>
    )
}
