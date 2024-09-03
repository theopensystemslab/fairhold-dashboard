"use client";
import React from "react";
import ErrorBoundary from '../ErrorBoundary';
import { Household } from "@/app/models/Household";
import LifetimeCombinedChart from "./LifetimeCombinedChart";

interface Props {
  household: Household;
}

const LifetimeFairholdLandPurchaseWrapper: React.FC<Props> = ({
  household,
}) => {
  // Create color scheme for different versions of the graph
  const colorScheme = {
    land: "#026600",
    house: "#78ba77",
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
          landCost: item.fairholdLandMortgageYearly,
          houseCost: item.depreciatedHouseMortgageYearly,
          // billsCost: item.gasBillYearly,
          maintenanceCost: item.maintenanceCost,
        };
      }
    ) ?? [];

  return (
    <ErrorBoundary>
    <div>
      <h2>Lifetime Costs Chart</h2>
      <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
    </div>
    </ErrorBoundary>
  );
};

export default LifetimeFairholdLandPurchaseWrapper;
