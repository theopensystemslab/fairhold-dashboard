import React from "react"
import { SurveyComponentProps } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "@/app/survey/components/CustomSankey";

export const LiveWith: React.FC<SurveyComponentProps> = ({ results }) => {
    return (
        <SurveyGraphCard title="Who do you want to live with?" results={results}>
            <CustomSankey
                nodes={results.liveWith.nodes}
                links={results.liveWith.links}            >
            </CustomSankey>
        </SurveyGraphCard>
    )
}