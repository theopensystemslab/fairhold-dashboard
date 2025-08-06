import React, { useState } from "react"
import SurveyGraphCard from "@components/custom/survey/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import SurveyTenureSelector from "../SurveyTenureSelector";
import { TENURE_COLORS } from "@lib/survey/constants";
import CustomTick from "../CustomTick";

export const HousingOutcomes = () => {
    const housingOutcomes = useSurveyContext().barOrPie.housingOutcomes;
    
    // Get available tenure keys (we might not have all of them, eg if no shared ownership residents fill out the survey)
    const tenureOptions = Object.keys(housingOutcomes);

    const [selectedTenure, setSelectedTenure] = useState(
        tenureOptions.length > 0 ? tenureOptions[0] : ""
    );

    const color = TENURE_COLORS[selectedTenure] || "rgb(var(--text-default-rgb))";

    return (
        <SurveyGraphCard 
            title="What do you most want from housing that you don't currently get?" 
            subtitle="Showing top 10 responses for"
            action={
            <SurveyTenureSelector
                options={tenureOptions}
                value={selectedTenure}
                onChange={setSelectedTenure}
                color={color}
            />
            }  
            >

            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={housingOutcomes[selectedTenure]}
                    barSize={20}
                    layout="vertical"
                >
                    <XAxis 
                        type="number"
                        tickLine={false}
                        axisLine={false}
                        tickCount={2}
                        tickFormatter={(value: number) => Math.round(value).toString()}
                        /> 
                    <YAxis 
                        type="category"    
                        dataKey="answer" 
                        width={150} 
                        interval={0}
                        tick={CustomTick}
                        tickLine={false}
                        axisLine={false}
                        /> 
                    <Bar dataKey="value" fill={color} /> 
                </BarChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
