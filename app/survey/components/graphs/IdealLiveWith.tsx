import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey"
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";

export const IdealLiveWith = () => {
    const idealLiveWith = useSurveyContext().sankey.idealLiveWith;
    
    return (
        <SurveyGraphCard title="Who do you want to live with?">
            <ResponsiveContainer width="100%" height="100%">
                <CustomSankey
                    nodes={idealLiveWith.nodes}
                    links={idealLiveWith.links}            >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
