import { formatValue } from "@/app/lib/format";

export interface CustomLabelListContentProps {
    x?: number | string | undefined;
    y?: number | string | undefined;
    value?: number | string;
    index?: number;
    color?: string | undefined;
    width?: string | number | undefined;
    height?: string | number | undefined;
}

export const BarLabelListTopLeft: React.FC<CustomLabelListContentProps> = ({ x, y, value, color }) => {
  if (x === undefined || y === undefined || value === undefined) return null;
  const xAdjust = 2;
  const yAdjust = 30;
  const xPos = typeof x === "number" ? x - xAdjust : Number(x) - xAdjust;
  const yPos = typeof y === "number" ? y - yAdjust : Number(y) - yAdjust;
  const numValue = typeof value === "number" ? value : parseFloat(value as string);
  const formattedValue = formatValue(numValue);

  return (
    <foreignObject x={xPos} y={yPos} width={100} height={30}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          color,
          fontSize: "18px",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {formattedValue}
      </div>
    </foreignObject>
  );
};

export interface CustomTickProps {
  x: number;
  y: number;
  payload: { value: string };
  getLabel: (value: string) => string;
  getColor: (value: string, index?: number) => string;
  index?: number;
}

export const CustomTick: React.FC<CustomTickProps> = ({
  x,
  y,
  payload,
  getLabel,
  getColor,
  index,
}) => {
  const label = getLabel(payload.value);
  const color = getColor(payload.value, index);

  return (
    <g transform={`translate(${x},${y})`}>
      {label.split('\n').map((line: string, i: number) => (
        <text
          key={i}
          x={0}
          y={i * 20}
          dy={10}
          textAnchor="middle"
          style={{ fill: color }}
          fontSize="12px"
          fontWeight={600}
        >
          {line}
        </text>
      ))}
    </g>
  );
};