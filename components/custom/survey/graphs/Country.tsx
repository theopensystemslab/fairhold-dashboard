import React from "react";
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "../../context";

  export const Country = () => {
    const { uk } = useSurveyContext().barOrPie;
    
   const COLORS = [
      "rgb(var(--survey-blue))", "rgb(var(--survey-blue-light))"
    ];
  
    return (
      <SurveyGraphCard title="Where do you live?">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie 
              data={uk} 
              dataKey="value" 
              nameKey="answer" 
              fill="rgb(var(--survey-placeholder))" 
              innerRadius="60%"
              outerRadius="80%"
              >
              {uk.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              </Pie>
            <Legend align="center" verticalAlign="bottom" />
            </PieChart>
        </ResponsiveContainer>
      </SurveyGraphCard>
    );
  };
