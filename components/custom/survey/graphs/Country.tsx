import React from "react";
import SurveyGraphCard from "@/components/custom/survey/SurveyGraphCard";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";
import { useSurveyContext } from "@context/surveyContext";
import { BarOrPieResult } from "@/lib/survey/types";

export const Country: React.FC = () => {
  const { uk } = useSurveyContext().surveyResults.barOrPie as { uk: BarOrPieResult[] };
  const { loading } = useSurveyContext();

  const COLORS = [
    "rgb(var(--survey-blue))", "rgb(var(--survey-blue-light))"
  ];
  
  return (
    <SurveyGraphCard title="Where do you live?" loading={loading}>
      {(animate) => (
        <div style={{ width: "100%", height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={uk} 
                  dataKey="value" 
                  nameKey="answer" 
                  fill="rgb(var(--survey-placeholder))" 
                  innerRadius="60%"
                  outerRadius="80%"
                  isAnimationActive={animate}
                  >
                  {uk.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  </Pie>
                <Legend 
                  align="left" 
                  verticalAlign="bottom" 
                  wrapperStyle={{ fontSize: 14 }}
                />
              </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </SurveyGraphCard>
  );
  };
