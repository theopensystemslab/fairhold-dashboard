"use client";
import React from "react";
import ErrorBoundary from "../../ErrorBoundary";
import { Household } from "@/models/Household";
import HowMuchPerMonthBarChart from "./HowMuchPerMonthBarChart";

interface HowMuchPerMonthWrapperProps {
  household: Household;
}

const HowMuchPerMonthWrapper: React.FC<HowMuchPerMonthWrapperProps> = ({
  household,
}) => {
  console.log("HowMuchPerMonthWrapper household:", household);

  if (!household) {
    return <div>No household data available</div>;
  }

  const fairholdLandPurchaseMonthly = household.tenure.fairholdLandPurchase.depreciatedHouseMortgage.monthlyPayment + household.tenure.fairholdLandPurchase.discountedLandMortgage.monthlyPayment
  const marketPurchaseMonthly = household.tenure.marketPurchase.landMortgage.monthlyPayment + household.tenure.marketPurchase.houseMortgage.monthlyPayment
  const affordabilityMonthly = (household.incomeYearly / 12) *
    household.forecastParameters
      .affordabilityThresholdIncomePercentage || 0
  const highestValue = Math.max(fairholdLandPurchaseMonthly, marketPurchaseMonthly, affordabilityMonthly)
  const scaleFactor = 1.1
  const maxY = Math.ceil(scaleFactor * highestValue / 500) * 500

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
          affordabilityMonthly,
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
          affordabilityMonthly,
      },
    ];
  };

  const formattedData = formatData(household);

  return (
    <ErrorBoundary>
      <div  className="h-full">
        <HowMuchPerMonthBarChart 
          data={formattedData}
          maxY={maxY} 
          />
      </div>
    </ErrorBoundary>
  );
};

export default HowMuchPerMonthWrapper;
