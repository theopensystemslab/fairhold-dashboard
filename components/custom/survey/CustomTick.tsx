import { TickProps } from "@lib/survey/types";

interface Props extends TickProps {
  color?: string;
}
const CustomTick: React.FC<Props> = ({ x, y, payload, color }) => (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={-10} 
        y={0} 
        dy={4} 
        textAnchor="end" 
        fill={color || "#333"} 
        fontSize={12}
        width={240}
      >
        {payload.value}
      </text>
    </g>
  );

  export default CustomTick;