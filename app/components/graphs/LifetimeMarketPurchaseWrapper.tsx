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
    (household.tenure.marketPurchase?.lifetime || []).map((item, index) => {
      // Access and store household.lifetime array
      // TODO remove defensive code after types tightened upstream
      const incomeThreshold =
        household.lifetime && household.lifetime[index]
          ? household.lifetime[index].affordabilityThresholdIncome
          : 0;

      // Access and store all other variables
      return {
        year: index.toString(), // or just `year: index` if you want it as a number
        landCost: item.landMortgagePaymentYearly,
        houseCost: item.houseMortgagePaymentYearly,
        maintenanceCost: item.maintenanceCost,
        // billsCost: item.gasBillYearly,
        incomeThreshold: incomeThreshold,
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
