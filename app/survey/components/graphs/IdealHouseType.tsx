import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { useSurveyContext } from "../../context";


export const IdealHouseType = () => {
    const { idealHouseType } = useSurveyContext().sankey;
    
    return (
        <SurveyGraphCard title="What type of home do you want to live in?">
            <CustomSankey
                nodes={idealHouseType.nodes}
                links={idealHouseType.links}       
                leftLabel="I live in"
                rightLabel="I want to live in"
                >
            </CustomSankey>
        </SurveyGraphCard>
    )
}
