import React from "react"
import { SankeyResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const HouseType: React.FC<SankeyResults> = (results) => {
    return (
        <SurveyGraphCard title="What type of home do you want to live in?" results={results}></SurveyGraphCard>
    )
}
