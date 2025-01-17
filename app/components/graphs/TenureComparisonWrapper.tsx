"use client";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Household } from "@/app/models/Household";
import TenureComparisonBarChart from "./TenureComparisonBarChart";

interface TenureComparisonWrapperProps {
  household: Household;
}

const TenureComparisonWrapper: React.FC<TenureComparisonWrapperProps> = ({
  household,
}) => {
  console.log("TenureComparisonWrapper household:", household);

  if (!household) {
    return <div>No household data available</div>;
  }

  const formatData = (household: Household) => {
    return [
      {
        category: "Monthly Costs Land",
        marketPurchase:
          household.tenure.marketPurchase?.landMortgage?.monthlyPayment || 0,
        marketRent: household.tenure.marketRent?.averageRentLandMonthly || 0,
        socialRent: household.tenure.socialRent?.socialRentMonthlyLand || 0,
        fairholdLandPurchase:
          household.tenure.fairholdLandPurchase?.discountedLandMortgage
            ?.monthlyPayment || 0,
        fairholdLandRent:
          household.tenure.fairholdLandRent?.discountedLandRentMonthly || 0,
        affordabilityMonthly:
          (household.incomeYearly / 12) *
            household.forecastParameters
              .affordabilityThresholdIncomePercentage || 0,
      },
      {
        category: "Monthly Costs House",
        marketPurchase:
          household.tenure.marketPurchase?.houseMortgage?.monthlyPayment || 0,
        marketRent: household.tenure.marketRent?.averageRentHouseMonthly || 0,
        socialRent: household.tenure.socialRent?.socialRentMonthlyHouse || 0,
        fairholdLandPurchase:
          household.tenure.fairholdLandPurchase?.depreciatedHouseMortgage
            ?.monthlyPayment || 0,
        fairholdLandRent:
          household.tenure.fairholdLandPurchase?.depreciatedHouseMortgage
            ?.monthlyPayment || 0,
        affordabilityMonthly:
          (household.incomeYearly / 12) *
            household.forecastParameters
              .affordabilityThresholdIncomePercentage || 0,
      },
    ];
  };

  const formattedData = formatData(household);

  return (
    <ErrorBoundary>
      <div>
        <TenureComparisonBarChart data={formattedData} />
      </div>
    </ErrorBoundary>
  );
};

export default TenureComparisonWrapper;
