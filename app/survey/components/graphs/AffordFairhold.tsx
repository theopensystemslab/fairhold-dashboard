import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "../../context";
import { AFFORD_FAIRHOLD } from "../../constants";

export const AffordFairhold = () => {
    let { affordFairhold } = useSurveyContext().barOrPie;

    const orderedAnswers = AFFORD_FAIRHOLD.map(({ label }) => label)

    affordFairhold = affordFairhold.sort(
    (a, b) =>
        orderedAnswers.indexOf(a.answer as typeof orderedAnswers[number]) -
        orderedAnswers.indexOf(b.answer as typeof orderedAnswers[number])
    );

    const COLORS = [
      "rgb(var(--fairhold-equity-color-rgb))", "rgb(var(--fairhold-interest-color-rgb))", "rgb(var(--social-rent-land-color-rgb))" 
    ];

    return (
        <SurveyGraphCard title="Could you afford to buy a Fairhold home in your area?">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie 
                        data={affordFairhold} 
                        dataKey="value" 
                        nameKey="answer" 
                        fill="rgb(var(--survey-placeholder))" 
                        innerRadius="60%"
                        outerRadius="80%"
                        >
                    {affordFairhold.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                    </Pie>
                    <Legend align="center" verticalAlign="bottom" />
                </PieChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
