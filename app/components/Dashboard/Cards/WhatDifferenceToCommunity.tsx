import { Household } from "@/app/models/Household";
import { Drawer } from "../../ui/Drawer";
import GraphCard from "../../ui/GraphCard"
import { SOCIAL_VALUE_YEARS, DEFAULT_INTEREST_RATE, DEFAULT_MORTGAGE_TERM, DEFAULT_INITIAL_DEPOSIT } from "@/app/models/constants";
import ReactMarkdown from 'react-markdown';
import explanationContent from '../Help/WhatDifference.md';
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

const CardsSelf: React.FC<CardsProps> = ({ household }) => {
  const moneySaved = Math.max(Math.round(household.socialValue.moneySaved),0).toLocaleString(); // Using .toLocaleString() to separate decimals and thousands correctly
  const savingsEnergyPoundsYearly = Math.round(household.socialValue.savingsEnergyPoundsYearly).toLocaleString()

  return <div className="flex flex-wrap gap-6">
    <Card title="Money saved" figure={`£${moneySaved}`}>
      <p>If Fairhold Land Purchase, on housing costs over {DEFAULT_FORECAST_PARAMETERS.yearsForecast} years compared to conventional ownership</p>
    </Card>
    <Card title="Energy savings" figure={`£${savingsEnergyPoundsYearly}`} subfigure="per year">
      <p>Every year, if new build or retrofitted</p>
    </Card>
  </div>
}

const CardsCommunity: React.FC<CardsProps> = ({ household }) => {
    const communityWealthDecade = Math.round(household.socialValue.communityWealthDecade).toLocaleString();
    const savingsToNHSPerHouseLifetime = Math.round(household.lifetime.lifetimeData[household.lifetime.lifetimeData.length - 1].healthSavings.nhsCumulative).toLocaleString();
    const savingsToSocietyPerHouseLifetime = Math.round(household.lifetime.lifetimeData[household.lifetime.lifetimeData.length - 1].healthSavings.socialCumulative).toLocaleString();
    const newBuildPrice = Math.round(household.property.newBuildPrice).toLocaleString();
    const maintenanceCost = Math.round(household.lifetime.lifetimeData[0].maintenanceCost[household.property.maintenanceLevel]).toLocaleString();
    const localJobs = household.socialValue.localJobs.toFixed(1);
  
    return <div className="flex flex-wrap gap-6">
      <Card title="Community wealth">
        <p>
          If Fairhold Land Rent, every {SOCIAL_VALUE_YEARS} years the house would contribute{" "}
          <Highlight>£{communityWealthDecade}</Highlight> to community infrastructure and services
        </p>
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
    </div>
  }

  const CardsWorld: React.FC<CardsProps> = ({ household }) => {
    const embodiedCarbonSavings = household.socialValue.embodiedCarbonSavings.toFixed(1);
    const operationalCarbonSavingsYearly = household.socialValue.operationalCarbonSavingsYearly.toFixed(1);
  
    return <div className="flex flex-wrap gap-6">
      <Card title="Embodied carbon savings" figure={`${embodiedCarbonSavings} TCO₂e`}>
        <p>If new build, compared to typical development</p>
      </Card>
      <Card title="Annual carbon savings" figure={`${operationalCarbonSavingsYearly} TCO₂e`}>
        <p>If new build or retrofit, compared to average home</p>
      </Card>
    </div>
  }

export const WhatDifferenceToCommunity: React.FC<WhatDifferenceProps> = ({ data }) => {
  // We don't want to hard code the variables in markdown because then we'd have to maintain them in multiple places
  const processedContent = explanationContent.replace(
    `{{DEFAULT_INTEREST_RATE}}`,
    (DEFAULT_INTEREST_RATE * 100).toString()
  ).replace(
    `{{DEFAULT_MORTGAGE_TERM}}`,
    DEFAULT_MORTGAGE_TERM.toString()
  ).replace(
    `{{DEFAULT_INITIAL_DEPOSIT}}`,
    (DEFAULT_INITIAL_DEPOSIT * 100).toString()
  ).replace(
    `{{propertyPriceGrowthPerYear}}`,
    (DEFAULT_FORECAST_PARAMETERS.propertyPriceGrowthPerYear * 100).toString()
  ).replace(
    `{{incomeGrowthPerYear}}`,
    (DEFAULT_FORECAST_PARAMETERS.incomeGrowthPerYear * 100).toString()
  );
  
  return (
    <GraphCard 
      title="What difference would Fairhold make..."
    >
      <div className="flex flex-col h-full w-3/4 justify-between">
        <h2>To me?</h2>
        <CardsSelf household={data}/>
        <h2>To my community?</h2>
        <CardsCommunity household={data}/>
        <h2>To the world?</h2>
        <CardsWorld household={data}/>
        <Drawer
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description={<ReactMarkdown className="space-y-4">{processedContent}</ReactMarkdown>}
        />
      </div>

      
    </GraphCard>
  )
};
