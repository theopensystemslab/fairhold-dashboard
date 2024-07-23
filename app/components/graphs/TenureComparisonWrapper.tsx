"use client";
import React from "react";
import { Household } from "@/sharedCode/classes";
import TenureComparisonBarChart from "./TenureComparisonBarChart";

interface TenureComparisonWrapperProps {
  household?: Household;
  mortgageLand?: { monthlyPayment: number };
  averageRentLand?: { averageRentLandMonthly: number };
  socialRentMonthlyLand?: { socialRentMonthlyLand: number };
  mortgageFairholdLandPurchase?: { monthlyPayment: number };
  fairholdLandRent?: { discountedLandRent: number };
  mortgageHouse?: { monthlyPayment: number };
  mortgageDepreciatedHouse?: { monthlyPayment: number };
  averageRentHouse?: number;
  socialRentMonthlyHouse?: number;
}

const TenureComparisonWrapper: React.FC<TenureComparisonWrapperProps> = ({
  household,
}) => {
  console.log("TenureComparisonWrapper household:", household);

  if (!household) {
    return <div>No household data available</div>;
  }

  const transformHouseholdToProps = (
    household: Household
  ): TenureComparisonWrapperProps => {
    return {
      household,
      mortgageLand: household.tenureMarketPurchase?.landMortgage
        ? {
            monthlyPayment:
              household.tenureMarketPurchase.landMortgage.monthlyPayment || 0,
          }
        : undefined,
      averageRentLand: household.tenureMarketRent.averageRentLandYearly / 12,

      socialRentMonthlyLand: household.tenureSocialRent?.socialRentMonthlyLand,
      mortgageFairholdLandPurchase: household.tenureFairholdLandPurchase
        ?.discountedLandMortgage
        ? {
            monthlyPayment:
              household.tenureFairholdLandPurchase.discountedLandMortgage
                .monthlyPayment || 0,
          }
        : undefined,
      fairholdLandRent: household.tenureFairholdLandRent
        ?.discountedLandRentYearly
        ? {
            discountedLandRent:
              household.tenureFairholdLandRent.discountedLandRentYearly / 12 ||
              0,
          }
        : undefined,
      mortgageHouse: household.tenureMarketPurchase?.houseMortgage
        ? {
            monthlyPayment:
              household.tenureMarketPurchase.houseMortgage.monthlyPayment || 0,
          }
        : undefined,
      mortgageDepreciatedHouse: household.tenureFairholdLandPurchase
        ?.depreciatedHouseMortgage
        ? {
            monthlyPayment:
              household.tenureFairholdLandPurchase.depreciatedHouseMortgage
                .monthlyPayment || 0,
          }
        : undefined,
      averageRentHouse: household.tenureMarketRent?.averageRentHouseYearly / 12,
      socialRentMonthlyHouse: household.tenureSocialRent.socialRentMonthlyHouse,
    };
  };

  const formatData = (household: TenureComparisonWrapperProps) => {
    return [
      {
        category: "Monthly Costs Land",
        marketPurchase: household.mortgageLand?.monthlyPayment || 0,
        marketRent: household.averageRentLand || 0,
        socialRent: household.socialRentMonthlyLand || 0,
        fairholdLandPurchase:
          household.mortgageFairholdLandPurchase?.monthlyPayment || 0,
        fairholdLandRent: household.fairholdLandRent?.discountedLandRent || 0,
      },
      {
        category: "Monthly Costs House",
        marketPurchase: household.mortgageHouse?.monthlyPayment || 0,
        marketRent: household.averageRentHouse || 0,
        socialRent: household.socialRentMonthlyHouse || 0,
        fairholdLandPurchase:
          household.mortgageDepreciatedHouse?.monthlyPayment || 0,
        fairholdLandRent:
          household.mortgageDepreciatedHouse?.monthlyPayment || 0,
      },
    ];
  };

  const formattedProps = transformHouseholdToProps(household);
  const formattedData = formatData(formattedProps);

  return (
    <div>
      <h2>Tenure Comparison Chart</h2>
      <TenureComparisonBarChart data={formattedData} />
    </div>
  );
};

export default TenureComparisonWrapper;

