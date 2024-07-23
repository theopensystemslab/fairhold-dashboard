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
  averageRentHouse?: { averageRentHouse: number };
  socialRentMonthlyHouse?: { socialRentMonthlyHouse: number };
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
      mortgageLand: household.tenure.marketPurchase?.landMortgage
        ? {
            monthlyPayment:
              household.tenure.marketPurchase.landMortgage.monthlyPayment || 0,
          }
        : undefined,
      averageRentLand: household.tenure.marketRent?.averageRentLandYearly
        ? { averageRentLandMonthly: household.tenure.marketRent.averageRentLandYearly / 12 }
        : undefined,
      socialRentMonthlyLand: household.tenure.socialRent?.socialRentMonthlyLand
        ? { socialRentMonthlyLand: household.tenure.socialRent.socialRentMonthlyLand }
        : undefined,
      mortgageFairholdLandPurchase: household.tenure.fairholdLandPurchase
        ?.discountedLandMortgage
        ? {
            monthlyPayment:
              household.tenure.fairholdLandPurchase.discountedLandMortgage
                .monthlyPayment || 0,
          }
        : undefined,
      fairholdLandRent: household.tenure.fairholdLandRent?.discountedLandRentYearly
        ? {
            discountedLandRent:
              household.tenure.fairholdLandRent.discountedLandRentYearly / 12 || 0,
          }
        : undefined,
      mortgageHouse: household.tenure.marketPurchase?.houseMortgage
        ? {
            monthlyPayment:
              household.tenure.marketPurchase.houseMortgage.monthlyPayment || 0,
          }
        : undefined,
      mortgageDepreciatedHouse: household.tenure.fairholdLandPurchase?.depreciatedHouseMortgage
        ? {
            monthlyPayment:
              household.tenure.fairholdLandPurchase.depreciatedHouseMortgage
                .monthlyPayment || 0,
          }
        : undefined,
      averageRentHouse: household.tenure.marketRent?.averageRentHouseYearly
        ? {
          averageRentHouse:
            household.tenure.marketRent?.averageRentHouseYearly / 12|| 0,
        }
      : undefined,
      socialRentMonthlyHouse: household.tenure.socialRent?.socialRentMonthlyHouse
        ? {
          socialRentMonthlyHouse:
          household.tenure.socialRent?.socialRentMonthlyHouse || 0,
        }
      : undefined,
    };
  };

  const formatData = (household: TenureComparisonWrapperProps) => {
    const toNumber = (value: number | { [key: string]: number } | undefined) =>
      typeof value === 'number' ? value : value ? Object.values(value)[0] : 0;

    return [
      {
        category: "Monthly Costs Land",
        marketPurchase: household.mortgageLand?.monthlyPayment || 0,
        marketRent: toNumber(household.averageRentLand) || 0,
        socialRent: toNumber(household.socialRentMonthlyLand) || 0,
        fairholdLandPurchase:
          household.mortgageFairholdLandPurchase?.monthlyPayment || 0,
        fairholdLandRent: toNumber(household.fairholdLandRent) || 0,
      },
      {
        category: "Monthly Costs House",
        marketPurchase: household.mortgageHouse?.monthlyPayment || 0,
        marketRent: toNumber(household.averageRentHouse) || 0,
        socialRent: toNumber(household.socialRentMonthlyHouse) || 0,
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
