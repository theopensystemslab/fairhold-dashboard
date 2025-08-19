import React from "react"
import SurveyGraphCard from "@components/custom/survey/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
export const AffordFairhold = () => {
    const { affordFairhold } = useSurveyContext().barOrPie;

    const COLORS = [
      "rgb(var(--fairhold-equity-color-rgb))", "rgb(var(--fairhold-interest-color-rgb))", "rgb(var(--social-rent-land-color-rgb))" 
    ];

    return (
        <SurveyGraphCard title="Could you afford to buy a Fairhold home in your area?">
            {(animate) => (
                <div style={{ width: "100%", height: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={affordFairhold} 
                                dataKey="value" 
                                nameKey="answer" 
                                fill="rgb(var(--survey-placeholder))" 
                                innerRadius="60%"
                                outerRadius="80%"
                                isAnimationActive={animate}
                                >
                            {affordFairhold.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))}
                            </Pie>
                            <Legend 
                                align="left" 
                                height={50}
                                verticalAlign="bottom" 
                                wrapperStyle={{ fontSize: 14 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </SurveyGraphCard>
    )
}
