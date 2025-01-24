import { Household } from "@/app/models/Household";
import { Drawer } from "../../ui/Drawer";
import GraphCard from "../../ui/GraphCard"

type CardsProps = {
  household: Household;
}

type CardProps = {
  title: string;
  figure?: string;
  subfigure?: string 
}

type WhatDifferenceProps = {
  data: Household;
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

const Cards: React.FC<CardsProps> = ({ household }) => (
  <div className="flex flex-wrap gap-6">
    <Card title="Money saved" figure={`£${Math.round(household.socialValue.moneySaved).toLocaleString()}`}>
      <p>If Fairhold Land Purchase, on housing costs over 10 years compared to conventional ownership</p>
    </Card>
    <Card title="Community wealth">
      <p>
        Every 10 years the house would contribute{" "}
        <Highlight>£{Math.round(household.socialValue.communityWealthDecade).toLocaleString()}</Highlight> to community infrastructure and services
      </p>
    </Card>
    <Card title="Embodied carbon savings" figure={`${household.socialValue.embodiedCarbonSavings} TCO₂e`}>
      <p>If new build, compared to typical development</p>
    </Card>
    <Card title="Energy savings" figure={`£${Math.round(household.socialValue.savingsEnergyPoundsYearly).toLocaleString()}`} subfigure="per year">
      <p>Every year, if new build or retrofitted</p>
    </Card>
    <Card title="Savings to NHS" figure={`£${Math.round(household.socialValue.savingsToNHSPerHeadYearly).toLocaleString()}`}>
      <p>per person, per year of a healthy, well-maintained home</p>
    </Card>
    <Card title="Local economy">
      <p>If new build, the home would add <Highlight>£{Math.round(household.property.newBuildPrice).toLocaleString()}</Highlight> to the local economy, and <Highlight>£{Math.round(household.lifetime.lifetimeData[0].maintenanceCost[household.property.maintenanceLevel]).toLocaleString()}</Highlight> every year, supporting <Highlight>{household.socialValue.localJobs}</Highlight> jobs in total</p>
    </Card>
    <Card title="Annual carbon savings" figure={`${household.socialValue.operationalCarbonSavingsYearly} TCO₂e`}>
      <p>If new build or retrofit, compared to average home</p>
    </Card>
  </div>
)

export const WhatDifference: React.FC<WhatDifferenceProps> = ({ data }) => {
  return (
    <GraphCard 
      title="What difference would Fairhold make to me, my community, and the world?"
      subtitle="Social, environmental and economic impacts"  
    >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <Cards household={data}/>
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum minus eligendi fugit nulla officia dolor inventore nemo ex quo quia, laborum qui ratione aperiam, pariatur explicabo ipsum culpa impedit ad!"
        />
      </div>
    </GraphCard>
  )
};
