import React from "react"
import { SankeyResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { ResponsiveContainer } from "recharts";

export const LiveWith: React.FC<SankeyResults> = ({ liveWith }) => {
    return (
        <SurveyGraphCard title="Who do you want to live with?">
            <ResponsiveContainer>
            <CustomSankey
                nodes={liveWith.nodes}
                links={liveWith.links}            >
            </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
