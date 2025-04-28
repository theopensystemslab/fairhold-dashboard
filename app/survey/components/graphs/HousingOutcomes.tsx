import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const HousingOutcomes: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="What do you most want from housing that you don't currently get?" results={results}></SurveyGraphCard>
    )
}
