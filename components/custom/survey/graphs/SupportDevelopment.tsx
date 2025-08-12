import React from "react"
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import { useAnimateOnView } from "@hooks/UseAnimateOnView";

export const SupportDevelopment: React.FC = () => {
    const { supportDevelopment } = useSurveyContext().surveyResults.barOrPie;
    const { loading } = useSurveyContext();

    const COLORS = [
      "rgb(var(--fairhold-equity-color-rgb))", "rgb(var(--fairhold-interest-color-rgb))", "rgb(var(--survey-orange))", "rgb(var(--survey-pink))", "rgb(var(--social-rent-land-color-rgb))", "rgb(var(--survey-grey-light))"
    ];

    const { ref, animate } = useAnimateOnView();

    return (
        <SurveyGraphCard title="In general, do you support the development of new homes in your area?" loading={loading}>
            <div ref={ref} style={{ width: "100%", height: "100%" }}>
                <ResponsiveContainer height={300}>
                    <PieChart>
                        <Pie 
                            data={supportDevelopment} 
                            dataKey="value" 
                            nameKey="answer" 
                            fill="rgb(var(--survey-placeholder))"
                            innerRadius="60%"
                            outerRadius="80%"
                            isAnimationActive={animate}
                        >
                        {supportDevelopment.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend 
                        align="center" 
                        verticalAlign="bottom" 
                        wrapperStyle={{ fontSize: 18 }}
                    />
             </PieChart>
            </ResponsiveContainer>
        </div>
        </SurveyGraphCard>
    )
};