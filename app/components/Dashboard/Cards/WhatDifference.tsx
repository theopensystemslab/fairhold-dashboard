import { Household } from "@/app/models/Household";
import { Drawer } from "../../ui/Drawer";
import GraphCard from "../../ui/GraphCard"
import { DEFAULT_INTEREST_RATE, DEFAULT_MORTGAGE_TERM, DEFAULT_INITIAL_DEPOSIT } from "@/app/models/constants";
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

const Card: React.FC<React.PropsWithChildren<CardProps>> = ({ title, children }) => (
  <div className="px-4 py-4 flex flex-col flex-1 max-w-[300px] bg-white drop-shadow-md">
      <p className="text-2xl font-semibold mb-0 text-[rgb(var(--text-default-rgb))]">{title}</p>
    <div className="text-sm">{children}</div>
  </div>
)

const SubCard: React.FC<React.PropsWithChildren<CardProps>> = ({ figure, title, children})  => (
  <div className="py-2">
    <p className="text-2xl text-[rgb(var(--fairhold-equity-color-rgb))] font-semibold">{figure}</p>
    <p className="text-xl text-[rgb(var(--fairhold-equity-color-rgb))] font-semibold">{title}</p>
    <div className="text-sm">{children}</div>
  </div>
)

const Highlight: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="text-[rgb(var(--fairhold-equity-color-rgb))] font-semibold">{children}</span>
)

const Cards: React.FC<CardsProps> = ({ household }) => {
  const lifetime = household.lifetime.lifetimeData.length;
  const moneySaved = `£${Math.max(Math.round(household.socialValue.moneySaved),0).toLocaleString()}`; // Using .toLocaleString() to separate decimals and thousands correctly
  const communityWealthLifetime = `£${Math.round(household.socialValue.communityWealthLifetime).toLocaleString()}`;
  const embodiedCarbonSavings = `${household.socialValue.embodiedCarbonSavings.toFixed(1)} TCO₂e`;
  const savingsEnergyPoundsYearly = `£${Math.round(household.socialValue.savingsEnergyPoundsYearly).toLocaleString()}`
  const savingsToNHSYear1 = `£${Math.round(household.lifetime.lifetimeData[0].healthSavings.nhs)}`;
  const savingsToNHSPerHouseLifetime = `£${Math.round(household.lifetime.lifetimeData[household.lifetime.lifetimeData.length - 1].healthSavings.nhsCumulative).toLocaleString()}`;
  const savingsToSocietyPerHouseLifetime = `£${Math.round(household.lifetime.lifetimeData[household.lifetime.lifetimeData.length - 1].healthSavings.socialCumulative).toLocaleString()}`;
  const newBuildPrice = `£${Math.round(household.property.newBuildPrice).toLocaleString()}`;
  const operationalCarbonSavingsYearly = `${household.socialValue.operationalCarbonSavingsYearly.toFixed(1)} TCO₂e`;
  const maintenanceCost = `£${Math.round(household.lifetime.lifetimeData[0].maintenanceCost[household.property.maintenanceLevel]).toLocaleString()}`;
  const localJobs = household.socialValue.localJobs.toFixed(1);

  return <div className="flex md:flex-row flex-col gap-6 w-3/4 justify-center py-4">
    <Card title="Economy">
      <SubCard figure={moneySaved} title="Savings on housing costs">Over {lifetime} years.</SubCard>
      <SubCard figure={savingsToNHSPerHouseLifetime} title="Health savings">If moving from substandard accommodation, the home would save the NHS <Highlight>{savingsToNHSYear1}</Highlight> per year and the wider economy <Highlight>{savingsToSocietyPerHouseLifetime}</Highlight> over {lifetime} years.</SubCard>
      <SubCard figure={savingsEnergyPoundsYearly} title="Energy savings">Every year, if new build or retrofitted.</SubCard>
    </Card>

    <Card title="Community">
      <SubCard figure={communityWealthLifetime} title="Community wealth">Contributions to community infrastructure and services over {lifetime} years, if using Fairhold Land Rent.</SubCard>
      <SubCard figure={newBuildPrice} title="Local economy boost">If new build, the home would add <Highlight>{newBuildPrice}</Highlight> to the local economy, and <Highlight>{maintenanceCost}</Highlight> every year, supporting <Highlight>{localJobs}</Highlight> full-time equivalent jobs in total.</SubCard>
    </Card>

    <Card title="Environment">
      <SubCard figure={embodiedCarbonSavings} title={"Embodied carbon savings"}>If new build, compared to typical development.</SubCard>
      <SubCard figure={operationalCarbonSavingsYearly} title={"Annual carbon savings"}>If new build or retrofit, compared to the average home.</SubCard>
    </Card>
  </div>
}

export const WhatDifference: React.FC<WhatDifferenceProps> = ({ data }) => {
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
      title="What impact would Fairhold have?"
      subtitle="The wider benefits for people and planet."  
    >
      <div className="flex flex-col h-full w-full">
        <Cards household={data}/>
        <Drawer 
          buttonTitle="Find out more about how we estimated these"
          title="How we estimated these figures"
          description={<div className="space-y-4"><ReactMarkdown>{processedContent}</ReactMarkdown></div>}
        />
      </div>
    </GraphCard>
  )
};
