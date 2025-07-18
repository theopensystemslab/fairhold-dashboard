"use client";
import React from "react";
import ErrorBoundary from "../../ErrorBoundary";
import { Household } from "@/models/Household";
import HowMuchFHCostBarChart from "./HowMuchFHCostBarChart";
import HowMuchFHCostNotViableBarChart from "./HowMuchFHCostNotViableBarChart";

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
  const scaleFactor = 1.1;
  const marketPurchase = household.property.averageMarketPrice;
  const fairholdLandPurchase = household.property.depreciatedBuildPrice + household.tenure.fairholdLandPurchase.discountedLandPrice;
  const newBuildPrice = household.property.newBuildPrice
  const highestValue = Math.max(marketPurchase, fairholdLandPurchase, newBuildPrice) // we need newBuildPrice here to ensure the reference line when not viable can be shown
  const maxY = highestValue * scaleFactor

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

  if(household.property.landPrice < 0) {
    return (
      <ErrorBoundary>
        <div className="h-full w-full">
          <HowMuchFHCostNotViableBarChart data={formattedData} maxY={maxY} newBuildPrice={newBuildPrice}/>
        </div>
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <div className="h-full w-full">
        <HowMuchFHCostBarChart data={formattedData} maxY={maxY} />
      </div>
    </ErrorBoundary>
  );
};

export default HowMuchFHCostWrapper;
