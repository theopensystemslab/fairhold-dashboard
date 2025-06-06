import React from "react";
import { BarOrPieResults } from "@/app/survey/types";
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer } from "recharts";
  
  export const Country: React.FC<BarOrPieResults> = ({ uk }) => {
    return (
      <SurveyGraphCard title="Which country?">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie data={uk} dataKey="value" nameKey="answer" fill="rgb(var(--survey-placeholder))" />
            <Legend align="center" verticalAlign="bottom" />
            </PieChart>
        </ResponsiveContainer>
      </SurveyGraphCard>
    );
  };
