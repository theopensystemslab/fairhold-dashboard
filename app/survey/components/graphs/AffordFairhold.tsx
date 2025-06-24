import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "../../context";
import { AFFORD_FAIRHOLD_ORDER } from "../../constants";

export const AffordFairhold = () => {
    let { affordFairhold } = useSurveyContext().barOrPie;

    affordFairhold = affordFairhold.slice().sort(
        (a, b) =>
            AFFORD_FAIRHOLD_ORDER.indexOf(a.answer as string) -
            AFFORD_FAIRHOLD_ORDER.indexOf(b.answer as string)
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
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend align="center" verticalAlign="bottom" />
                </PieChart>
            </ResponsiveContainer>
        </SurveyGraphCard>
    )
}
