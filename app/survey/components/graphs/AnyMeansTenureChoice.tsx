import React from "react"
import SurveyGraphCard from "@/app/survey/components/SurveyGraphCard";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from "recharts";
import { useSurveyContext } from "../../context";
import { TENURE_COLORS } from "../../constants"
import { CustomLabelListContentProps } from "@/app/components/graphs/shared";

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
    const answerStr = Array.isArray(label) ? label[0] : label;
    return (
        <text
            x={x}
            y={y + 5}
            fill={TENURE_COLORS[answerStr] || "rgb(var(--text-inaccessible-rgb))"}
            fontSize={10}
            textAnchor="end"
        >
            {answerStr}
        </text>
    );
};

export const AnyMeansTenureChoice = () => {
    const { anyMeansTenureChoice } = useSurveyContext().barOrPie;
    return (
        <SurveyGraphCard 
            title="Rank the tenures by preference"
            subtitle="If you could afford (and were eligible for) any type of home, which would you prefer?"
            >
          <ResponsiveContainer height={anyMeansTenureChoice.length * 30}>
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
                  width={350} 
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
              <Bar dataKey="value">
                {anyMeansTenureChoice.map((entry, index) => {
                    let answerStr = "";
                    if (Array.isArray(entry.answer)) {
                        answerStr = entry.answer[0] ?? "";
                    } else if (typeof entry.answer === "string") {
                        answerStr = entry.answer;
                    }
                    return (
                        <Cell
                            key={`cell-${index}`}
                            fill={TENURE_COLORS[answerStr] || "rgb(var(--text-inaccessible-rgb))"}
                        />
                    );
                })}
                <LabelList 
                    dataKey="value"
                    position="insideStart"
                    fill="white"    
                    content={RankLabel}
                />
                </Bar>  
          </BarChart>
          </ResponsiveContainer>
        </SurveyGraphCard>
    )
}