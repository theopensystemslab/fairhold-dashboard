"use client";
import React from "react";
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
    (household.tenure.fairholdLandPurchase?.lifetime || []).map(
      (item, index) => {
        // Access and store household.lifetime array
        // TODO remove defensive code after types tightened upstream
        const incomeThreshold =
          household.lifetime && household.lifetime[index]
            ? household.lifetime[index].affordabilityThresholdIncome
            : 0;

        // Access and store all other variables
        return {
          year: index.toString(),
          landCost: item.landMortgagePaymentYearly,
          houseCost: item.houseMortgagePaymentYearly,
          // billsCost: item.gasBillYearly,
          maintenanceCost: item.maintenanceCost,
          incomeThreshold: incomeThreshold,
        };
      }
    ) ?? [];

  return (
    <div>
      <h2>Lifetime Costs Chart</h2>
      <LifetimeCombinedChart data={chartData} colorScheme={colorScheme} />
    </div>
  );
};

export default LifetimeFairholdLandPurchaseWrapper;
