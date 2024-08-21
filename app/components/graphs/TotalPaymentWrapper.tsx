"use client";
import React from "react";
import ErrorBoundary from '../ErrorBoundary';
import { Household } from "@/app/models/Household";
import TotalPaymentBarChart from "./TotalPaymentBarChart";

interface TotalPaymentWrapperProps {
  household: Household;
}

type LifetimeValues = {
  [key: string]: number;
};

const TotalPaymentWrapper: React.FC<TotalPaymentWrapperProps> = ({
  household,
}) => {
  console.log("TotalPaymentWrapper household: ", household);

  const sumLifetimeValues = (
    lifetime: LifetimeValues[] | undefined,
    keys: string[]
  ): number => {
    if (!lifetime || !Array.isArray(lifetime)) return 0;

    return lifetime.reduce((sum, entry) => {
      return (
        sum +
        keys.reduce((entrySum, key) => {
          return entrySum + (typeof entry[key] === "number" ? entry[key] : 0);
        }, 0)
      );
    }, 0);
  };

  const chartData = [
    {
      paymentType: "Total Payments",
      marketPurchase: sumLifetimeValues(
        household.tenure.marketPurchase?.lifetime,
        ["houseMortgagePaymentYearly", "landMortgagePaymentYearly"]
      ),
      marketRent: sumLifetimeValues(household.tenure.marketRent?.lifetime, [
        "averageRentHouseYearly",
        "averageRentLandYearly",
      ]),
      fairholdLandPurchase: sumLifetimeValues(
        household.tenure.fairholdLandPurchase?.lifetime,
        ["houseMortgagePaymentYearly", "landMortgagePaymentYearly"]
      ),
      fairholdLandRent: sumLifetimeValues(
        household.tenure.fairholdLandRent?.lifetime,
        ["fairholdRentLand", "houseMortgagePaymentYearly"]
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
