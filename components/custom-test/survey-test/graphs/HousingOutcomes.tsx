import React, { useState } from "react"
import { TickProps } from "@/lib/survey/types";
import SurveyGraphCard from "@/components/custom-test/survey-test/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import SurveyTenureSelector from "../SurveyTenureSelector";
import { TENURE_COLORS } from "@lib/survey/constants";
import { getTopFive } from "@lib/survey/utils";

export const HousingOutcomes = () => {
    const housingOutcomes = useSurveyContext().barOrPie.housingOutcomes;
    
    // Get available tenure keys (we might not have all of them, eg if no shared ownership residents fill out the survey)
    const tenureOptions = Object.keys(housingOutcomes);

    const [selectedTenure, setSelectedTenure] = useState(
        tenureOptions.length > 0 ? tenureOptions[0] : ""
    );
    const housingOutcomesTopFive = getTopFive(housingOutcomes[selectedTenure] || []);

    const color = TENURE_COLORS[selectedTenure] || "rgb(var(--text-default-rgb))";

    const Tick = (props: TickProps) => {
        const { x, y, payload } = props;
        return (
            <g transform={`translate(${x},${y})`}>
            <text 
                x={-10} 
                y={0} 
                dy={4} 
                textAnchor="end" 
                fill={color} 
                fontSize={10}
                width={240}
            >
                {payload.value}
            </text>
            </g>
        );
    }

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
                    data={housingOutcomesTopFive}
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
                        width={350} 
                        fontSize={10}
                        interval={0}
                        tick={Tick}
                        tickLine={false}
                        axisLine={false}
                        /> 
                    <Bar dataKey="value" fill={color} /> 
                </BarChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
