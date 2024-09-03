"use client";
import React from "react";
import ErrorBoundary from '../ErrorBoundary';
import { Household } from "@/app/models/Household";
import LifetimeCombinedChart from "./LifetimeCombinedChart";

interface Props {
  household: Household;
}

const LifetimeMarketPurchaseWrapper: React.FC<Props> = ({ household }) => {
  // Create color scheme for different versions of the graph
  const colorScheme = {
    land: "#194285",
    house: "#5178b8",
    maintenance: "#595959",
    bills: "#adadad",
    incomeThreshold: "#6c9e6e",
  };

  // Process and format the data for the chart
  const chartData =
    (household.lifetime.lifetimeData).map(
      (item, index) => {
        return {
          year: index.toString(),
          incomeThreshold: item.affordabilityThresholdIncome,
          landCost: item.marketLandMortgageYearly,
          houseCost: item.newbuildHouseMortgageYearly,
          maintenanceCost: item.maintenanceCost,
          // billsCost: item.gasBillYearly,
        };
    }) ?? [];

  return (
    <ErrorBoundary>
      <div>
        <h2>Lifetime Costs Chart</h2>
        <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
      </div>
    </ErrorBoundary>
  );
};

export default LifetimeMarketPurchaseWrapper;
