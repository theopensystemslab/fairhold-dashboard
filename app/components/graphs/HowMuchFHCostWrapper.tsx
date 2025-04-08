"use client";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Household } from "@/app/models/Household";
import HowMuchFHCostBarChart from "./HowMuchFHCostBarChart";

interface HowMuchFHCostWrapperProps {
  household: Household;
  mortgageLand?: number;
  averageRentLand?: number;
  socialRentMonthlyLand?: number;
  mortgageFairholdLandPurchase?: number;
  fairholdLandRent?: number;
  mortgageHouse?: number;
  mortgageDepreciatedHouse?: number;
  averageRentHouse?: number;
  socialRentMonthlyHouse?: number;
}

const HowMuchFHCostWrapper: React.FC<HowMuchFHCostWrapperProps> = ({
  household,
}) => {
  if (!household) {
    return <div>No household data available</div>;
  }

  const formatData = (household: Household) => {
    return [
      {
        category: "LandPrice",
        marketPurchase: household.property.landPrice || 0,
        fairholdLandPurchase:
          household.tenure.fairholdLandPurchase?.discountedLandPrice || 0,
        fairholdLandRent: 0,
      },
      {
        category: "NewHouse price",
        marketPurchase:
          household.property.averageMarketPrice -
            household.property.landPrice || 0,
        fairholdLandPurchase: 0,
        fairholdLandRent: 0,
      },
      {
        category: "DepreciatedHouse price",
        marketPurchase: 0,
        fairholdLandPurchase: household.property.depreciatedBuildPrice || 0,
        fairholdLandRent: household.property.depreciatedBuildPrice || 0,
      },
    ];
  };

  const formattedData = formatData(household);

  return (
    <ErrorBoundary>
      <div className="h-full w-full">
        <HowMuchFHCostBarChart data={formattedData} />
      </div>
    </ErrorBoundary>
  );
};

export default HowMuchFHCostWrapper;
