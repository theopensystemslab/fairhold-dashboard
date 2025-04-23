import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const HouseType: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="Desire home type" results={results}></SurveyGraphCard>
    )
}
