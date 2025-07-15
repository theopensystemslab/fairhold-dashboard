import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { useSurveyContext } from "@context/surveyContext";


export const IdealHouseType = () => {
    const { idealHouseType } = useSurveyContext().sankey;
    
    return (
        <SurveyGraphCard title="What type of home do you want to live in?">
            <CustomSankey
                nodes={idealHouseType.nodes}
                links={idealHouseType.links}       
                leftLabel="Current"
                rightLabel="Ideal"
                >
            </CustomSankey>
        </SurveyGraphCard>
    )
}
