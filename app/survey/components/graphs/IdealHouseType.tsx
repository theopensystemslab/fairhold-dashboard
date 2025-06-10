import React from "react"
import { SankeyResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { ResponsiveContainer } from "recharts";

export const IdealHouseType: React.FC<SankeyResults> = ({ idealHouseType }) => {
    console.log(idealHouseType)
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
