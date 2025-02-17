import { Household } from "@/app/models/Household";
import { Drawer } from "../../ui/Drawer";
import GraphCard from "../../ui/GraphCard"
import { SOCIAL_VALUE_YEARS } from "@/app/models/constants";
import { DEFAULT_FORECAST_PARAMETERS } from "@/app/models/ForecastParameters";

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

const Cards: React.FC<CardsProps> = ({ household }) => {
  const moneySaved = Math.round(household.socialValue.moneySaved).toLocaleString(); // Using .toLocaleString() to separate decimals and thousands correctly
  const communityWealthDecade = Math.round(household.socialValue.communityWealthDecade).toLocaleString();
  const embodiedCarbonSavings = household.socialValue.embodiedCarbonSavings.toFixed(1);
  const savingsEnergyPoundsYearly = Math.round(household.socialValue.savingsEnergyPoundsYearly).toLocaleString()
  const savingsToNHSPerHouseLifetime = Math.round(household.lifetime.lifetimeData[household.lifetime.lifetimeData.length - 1].healthSavings.nhsCumulative).toLocaleString();
  const savingsToSocietyPerHouseLifetime = Math.round(household.lifetime.lifetimeData[household.lifetime.lifetimeData.length - 1].healthSavings.socialCumulative).toLocaleString();
  const newBuildPrice = Math.round(household.property.newBuildPrice).toLocaleString();
  const operationalCarbonSavingsYearly = household.socialValue.operationalCarbonSavingsYearly.toFixed(1);
  const maintenanceCost = Math.round(household.lifetime.lifetimeData[0].maintenanceCost[household.property.maintenanceLevel]).toLocaleString();
  const localJobs = household.socialValue.localJobs.toFixed(1);

  return <div className="flex flex-wrap gap-6">
    <Card title="Money saved" figure={`£${moneySaved}`}>
      <p>If Fairhold Land Purchase, on housing costs over {DEFAULT_FORECAST_PARAMETERS.yearsForecast} years compared to conventional ownership</p>
    </Card>
    <Card title="Community wealth">
      <p>
        Every ${SOCIAL_VALUE_YEARS} years the house would contribute{" "}
        <Highlight>£{communityWealthDecade}</Highlight> to community infrastructure and services
      </p>
    </Card>
    <Card title="Embodied carbon savings" figure={`${embodiedCarbonSavings} TCO₂e`}>
      <p>If new build, compared to typical development</p>
    </Card>
    <Card title="Energy savings" figure={`£${savingsEnergyPoundsYearly}`} subfigure="per year">
      <p>Every year, if new build or retrofitted</p>
    </Card>
    <Card title="Health savings">
    <p>
        If moving from substandard accommodation, Fairhold would save the NHS {" "}
        <Highlight>£{savingsToNHSPerHouseLifetime}</Highlight> and society at large {" "}<Highlight>£{savingsToSocietyPerHouseLifetime}</Highlight> over {DEFAULT_FORECAST_PARAMETERS.yearsForecast} years
      </p>
    </Card>
    <Card title="Local economy">
      <p>If new build, the home would add <Highlight>£{newBuildPrice}</Highlight> to the local economy, and <Highlight>£{maintenanceCost}</Highlight> every year, supporting <Highlight>{localJobs}</Highlight> full-time-equivalent jobs in total</p>
    </Card>
    <Card title="Annual carbon savings" figure={`${operationalCarbonSavingsYearly} TCO₂e`}>
      <p>If new build or retrofit, compared to average home</p>
    </Card>
  </div>
}

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
