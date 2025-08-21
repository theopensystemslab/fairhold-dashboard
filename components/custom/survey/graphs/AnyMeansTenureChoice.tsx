import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import { TENURE_COLORS } from "@lib/survey/constants"
import { CustomLabelListContentProps } from "@/components/custom/dashboard/graphs/shared";
import { BarOrPieResult } from "@/lib/survey/types";

export interface CustomYTickProps {
  x: number;
  y: number;
  payload: { value: string };
  index?: number;
}

const RankLabel: React.FC<CustomLabelListContentProps> = ({ index, x, y }) => {
    const rank = typeof index === "number" ? index + 1 : "";
    return (
        <text
            x={Number(x) + 5}
            y={Number(y) + 15}
            fill="white"
            fontSize={12}
        >
            {rank}
        </text>
    );
};

const ColoredYAxisTick: React.FC<CustomYTickProps> = ({ x, y, payload: { value: label }  }) => {
    return (
        <text
            x={x}
            y={y + 5}
            fill={TENURE_COLORS[label] || "rgb(var(--text-inaccessible-rgb))"}
            fontSize={10}
            textAnchor="end"
        >
            {label}
        </text>
    );
};

export const AnyMeansTenureChoice: React.FC = () => {
    const { anyMeansTenureChoice } = useSurveyContext().surveyResults.barOrPie as { anyMeansTenureChoice: BarOrPieResult[] };
    const { loading } = useSurveyContext();
    
    return (
        <SurveyGraphCard 
            title="Rank the tenures by preference"
            subtitle="If you could afford (and were eligible for) any type of home, which would you prefer?"
            loading={loading}
        >
            {(animate) => (
                <div style={{ width: "100%", height: "100%" }}>
                    <ResponsiveContainer height={150}>
                        <BarChart
                            data={anyMeansTenureChoice}
                            barSize={20}
                    barGap={0}
                    layout="vertical"
                >
                    <XAxis 
                        type="number"
                        height={20}
                        fontSize={10}
                        interval={10}
                        axisLine={false}
                        tickLine={false}
                        tick={false}
                        /> 
                    <YAxis 
                        type="category"    
                        dataKey="answer" 
                        width={150} 
                        fontSize={10}
                        interval={0}
                        tickLine={false}
                        axisLine={false}
                        tick={(props) => (
                            <ColoredYAxisTick 
                            {...props}
                            />
                        )}
                        /> 
                    <Bar 
                        dataKey="value"
                        isAnimationActive={animate}
                    >
                        {
                            anyMeansTenureChoice.map(({ answer }, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={TENURE_COLORS[answer] || "rgb(var(--text-inaccessible-rgb))"}
                                />
                            ))
                        }
                        <LabelList 
                            dataKey="value"
                            position="insideStart"
                            fill="white"    
                            content={RankLabel}
                        />
                        </Bar>  
                    </BarChart>
                </ResponsiveContainer>
            </div>
            )}
        </SurveyGraphCard>
    )
}