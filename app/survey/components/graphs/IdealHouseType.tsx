import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "../../context";


export const IdealHouseType = () => {
    const idealHouseType = useSurveyContext().sankey.idealHouseType;
    
    return (
        <SurveyGraphCard title="What type of home do you want to live in?">
            <ResponsiveContainer>
                <CustomSankey
                    nodes={idealHouseType.nodes}
                    links={idealHouseType.links}       
                    leftLabel="Current"
                    rightLabel="Ideal"
                    >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
