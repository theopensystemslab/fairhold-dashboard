import React from "react"
import { Sankey, Tooltip, Rectangle, ResponsiveContainer } from "recharts"; 


type CustomNodeProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    payload: NodePayload;
    color?: string;
}

type NodePayload = {
    name: string;
    label?: string;
    sourceNodes: [];
    sourceLinks: [];
    targetLinks: [];
    targetNodes: [];
    value: number;
    depth: number;
    x: number;
    dx: number;
    y: number;
    dy: number;
    color?: string;
}

type CustomLinkProps = {
    sourceX: number;
    targetX: number;
    sourceY: number;
    targetY: number;
    sourceControlX: number;
    targetControlX: number;
    sourceRelativeY: number;
    targetRelativeY: number;
    linkWidth: number;
    index: number;
    payload: CustomLinkPayload;
}

type CustomLinkPayload = {
    source: NodePayload & { color?: string };
    target: NodePayload & { color?: string };
    value: number;
    dy: number;
    sy: number;
    ty: number;
    sourceColor?: string;
    targetColor?: string;
}

type SankeyProps = {
    nodes: Array<{name: string}>;
    links: Array<{source: number, target: number, value: number}>;
    leftLabel?: string;
    rightLabel?: string;
};

export const CustomSankey: React.FC<SankeyProps> = ({ 
    nodes, 
    links,
    leftLabel,
    rightLabel
}) => {

    // Custom Node Component with Label 
    const CustomNode = (props: CustomNodeProps) => { 
        const isLeft = props.payload.depth === 0;
        const adjustmentFactor = 10;
            return ( 
            <g> 
                <Rectangle 
                    {...props} 
                    fill={props.payload.color || "rgb(var(--survey-grey-mid))"} 
                /> 
                <text 
                    x={isLeft ? props.x - adjustmentFactor : props.x + props.width + adjustmentFactor}
                    y={props.y + props.height / 2} 
                    textAnchor={isLeft ? "end" : "start"}
                    dominantBaseline="middle" 
                    fill={props.payload.color} 
                    fontSize={14}
                    fontWeight={"bold"}
                    fillOpacity={0.8}
                > 
                    {props.payload.label || props.payload.name} 
                </text> 
            </g> 
        ); 
    };

    // Custom Link Component with Label 
    const CustomLink = (props: CustomLinkProps) => { 
        const { 
            sourceX, 
            targetX, 
            sourceY, 
            targetY, 
            sourceControlX, 
            targetControlX, 
            linkWidth, 
            payload 
        } = props; 
        const sourceColor = payload.source.color || "rgb(var(--survey-grey-mid))";
        const targetColor = payload.target.color || "rgb(var(--survey-grey-mid))";

        const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9-_]/g, ""); // handle special characters (eg for tenure like "I don't know")
        const sourceLabel = sanitize(payload.source.name.replace(/\s+/g, "-"));
        const targetLabel = sanitize(payload.target.name.replace(/\s+/g, "-"));
        const gradientId = `link-gradient-${sourceLabel}-to-${targetLabel}`; // we need a unique ID

        // Calculate a midpoint for the label 
        const midX = (sourceX + targetX) / 2; 
        const midY = (props.sourceY + props.targetY) / 2; 

        return ( 
            <g> 
                <defs>
                    <linearGradient id={gradientId} gradientUnits="userSpaceOnUse"
                        x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
                        <stop offset="0%" stopColor={sourceColor} />
                        <stop offset="100%" stopColor={targetColor} />
                    </linearGradient>
                </defs>
                <path 
                    d={`M${sourceX},${sourceY}C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`} 
                    fill="none" 
                    stroke={`url(#${gradientId})`}
                    strokeOpacity={0.5} 
                    strokeWidth={linkWidth}
                /> 
                {linkWidth > 5 && ( // Only show labels if link is wide enough 
                    <text 
                        x={midX} 
                        y={midY} 
                        textAnchor="middle" 
                        dominantBaseline="middle" 
                        fill="#333" 
                        fontSize={14} 
                        pointerEvents="none" 
                    > 
                        {payload.value} 
                    </text> 
                )} 
            </g> 
        ); 
    }; 

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: "0 2rem 0 2rem",
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 1,
                height: 40
            }}>
                <span className="text-md font-medium">{leftLabel}</span>
                <span className="text-md font-medium">{rightLabel}</span>
            </div>
            <div style={{ width: "100%", height: "calc(100% - 40px)", marginTop: 40 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <Sankey
                        data={{
                            nodes: nodes,
                            links: links
                        }}
                        node={CustomNode}
                        link={CustomLink}
                        nodePadding={50}
                        margin={{
                            left: 150,
                            right: 100,
                            top: 50,
                            bottom: 50,
                        }}
                    >
                        <Tooltip />
                    </Sankey>
                </ResponsiveContainer>
            </div>
        </div>
    )
}