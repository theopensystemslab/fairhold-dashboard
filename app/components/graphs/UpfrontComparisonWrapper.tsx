"use client";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Household } from "@/app/models/Household";
import UpfrontComparisonBarChart from "./UpfrontComparisonBarChart";

interface UpfrontComparisonWrapperProps {
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

const UpfrontComparisonWrapper: React.FC<UpfrontComparisonWrapperProps> = ({
  household,
}) => {
  if (!household) {
    return <div>No household data available</div>;
  }

  const formatData = (household: Household) => {
    return [
      {
        category: "Land price",
        marketPurchase: household.property.landPrice || 0,
        fairholdLandPurchase:
          household.tenure.fairholdLandPurchase?.discountedLandPrice || 0,
        fairholdLandRent: 0,
      },
      {
        category: "House price",
        marketPurchase:
          household.property.averageMarketPrice -
            household.property.landPrice || 0,
        fairholdLandPurchase: household.property.depreciatedBuildPrice || 0,
        fairholdLandRent: household.property.depreciatedBuildPrice || 0,
      },
    ];
  };

  const formattedData = formatData(household);

  return (
    <ErrorBoundary>
      <div>
        <h2>Tenure Comparison Chart</h2>
        <UpfrontComparisonBarChart data={formattedData} />
      </div>
    </ErrorBoundary>
  );
};

export default UpfrontComparisonWrapper;
