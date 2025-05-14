import React from "react"
import { BarOrPieResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";

export const Postcode: React.FC<BarOrPieResults> = ({ postcode }) => {
    console.log(postcode)
    return (
        <SurveyGraphCard title="What is your postcode?"></SurveyGraphCard>
    )
}
