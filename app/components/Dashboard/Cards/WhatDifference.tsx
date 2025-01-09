
import { Drawer } from "../../ui/Drawer";
import GraphCard from "../../ui/GraphCard"

type CardProps = {
  title: string;
  figure?: string;
  subfigure?: string 
}

const Card: React.FC<React.PropsWithChildren<CardProps>> = ({ title, figure, subfigure, children }) => (
  <div className="flex flex-col w-1/5">
    <p className="text-lg font-semibold mb-0">{title}</p>
    <div className="text-sm">{children}</div>
    <div className="flex items-center gap-2">
      {figure &&
        <p className="text-4xl text-green-500 font-semibold">{figure}</p>
      }
      {figure && subfigure && 
        <p className="text-sm text-green-500 font-semibold">{subfigure}</p>
      }
    </div>
  </div>
)

const Highlight: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="text-green-500 font-semibold">{children}</span>
)

const Cards = () => (
  <div className="flex flex-wrap gap-6">
    <Card title="Money saved" figure="£30,000">
      <p>On housing costs over 10 years, compared to conventional ownership</p>
    </Card>
    <Card title="Community wealth">
      <p>
        Every 10 years the house would contribute{" "}
        <Highlight>£120,000</Highlight> to community infrastructure and services
      </p>
    </Card>
    <Card title="Embodied carbon savings" figure="40 TCO₂e">
      <p>If new build, compared to typical development</p>
    </Card>
    <Card title="Energy savings" figure="£500" subfigure="per year">
      <p>Every year, if new build or retrofitted</p>
    </Card>
    <Card title="Savings to NHS" figure="£2,000">
      <p>per person, per year of a healthy, well-maintained home</p>
    </Card>
    <Card title="Local economy">
      <p>If a new build, the home would add <Highlight>£200,000</Highlight> to the local economy, and <Highlight>£3,000</Highlight> every year, supporting <Highlight>3.6</Highlight> jobs in total</p>
    </Card>
    <Card title="Annual carbon savings" figure="3 TCO₂e">
      <p>If new build, compared to average home</p>
    </Card>
  </div>
)

export const WhatDifference: React.FC = () => {
  return (
    <GraphCard 
      title="What difference would Fairhold make to me, my community, and the world?"
      subtitle="Social, environmental and economic impacts"  
    >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <Cards />
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum minus eligendi fugit nulla officia dolor inventore nemo ex quo quia, laborum qui ratione aperiam, pariatur explicabo ipsum culpa impedit ad!"
        />
      </div>
    </GraphCard>
  )
};
