import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { CustomSankey } from "../CustomSankey";
import { useSurveyContext } from "@context/surveyContext";

export const IdealHouseType: React.FC<{ loading: boolean }> = ({ loading }) => {
    const { idealHouseType } = useSurveyContext().sankey;
    
    return (
        <SurveyGraphCard title="What type of home do you want to live in?" loading={loading}>
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
