import React from "react"
import { BarOrPieResults } from "@/app/survey/types";
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";

export const Postcode: React.FC<BarOrPieResults> = ({ postcode }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const placeholder = postcode;
    return (
        <SurveyGraphCard title="What is your postcode?"></SurveyGraphCard>
    )
}
