import React from "react"
import { SankeyResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { ResponsiveContainer } from "recharts";

export const HouseType: React.FC<SankeyResults> = ({ houseType }) => {
    return (
        <SurveyGraphCard title="What type of home do you want to live in?">
            <ResponsiveContainer>
                <CustomSankey
                    nodes={houseType.nodes}
                    links={houseType.links}            >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
