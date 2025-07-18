import React from "react"
import SurveyGraphCard from "@/components/custom-test/survey-test/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";


export const IdealHouseType = () => {
    const idealHouseType = useSurveyContext().sankey.idealHouseType;
    
    return (
        <SurveyGraphCard title="What type of home do you want to live in?">
            <ResponsiveContainer>
                <CustomSankey
                    nodes={idealHouseType.nodes}
                    links={idealHouseType.links}            >
                </CustomSankey>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
