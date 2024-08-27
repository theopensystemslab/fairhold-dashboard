"use client";
import React from "react";
import ErrorBoundary from '../ErrorBoundary';
import { Household } from "@/app/models/Household";
import TotalPaymentBarChart from "./TotalPaymentBarChart";
import { LifetimeData } from "@/app/models/Lifetime";

interface TotalPaymentWrapperProps {
  household: Household;
}

const TotalPaymentWrapper: React.FC<TotalPaymentWrapperProps> = ({
  household,
}) => {
  console.log("TotalPaymentWrapper household: ", household);

  const sumLifetimeValues = (
    lifetime: LifetimeData[] | undefined,
    keys: (keyof LifetimeData)[]
  ): number => {
    if (!lifetime || !Array.isArray(lifetime)) return 0;
  
    let totalSum = 0;
  
    for (const entry of lifetime) {
      let entrySum = 0;
      for (const key of keys) {
        entrySum += entry[key];
      }
      totalSum += entrySum;
    }
  
    return totalSum;
  };

  const chartData = [
    {
      paymentType: "Total Payments",
      marketPurchase: sumLifetimeValues(
        household.lifetime.lifetimeData,
        ["newbuildHouseMortgageYearly", "marketLandMortgageYearly"]
      ),
      marketRent: sumLifetimeValues(
        household.lifetime.lifetimeData, 
        ["marketHouseRentYearly", "marketLandRentYearly",
      ]),
      fairholdLandPurchase: sumLifetimeValues(
        household.lifetime.lifetimeData, 
        ["depreciatedHouseMortgageYearly", "fairholdLandMortgageYearly"]
      ),
      fairholdLandRent: sumLifetimeValues(
        household.lifetime.lifetimeData, 
        ["depreciatedHouseMortgageYearly", "fairholdLandRentYearly"]
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <div>
        <h2>Total Payments Chart</h2>
        <TotalPaymentBarChart data={chartData} />
      </div>
    </ErrorBoundary>
  );
};

export default TotalPaymentWrapper;
