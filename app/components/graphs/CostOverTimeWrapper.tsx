"use client";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Household } from "@/app/models/Household";
import CostOverTimeStackedBarChart, { LifetimeBarData } from "./CostOverTimeStackedBarChart";
import { MaintenanceLevel } from "@/app/models/constants";

export type TenureType = 'marketPurchase' | 'fairholdLandPurchase' | 'fairholdLandRent' | 'marketRent' | 'socialRent';

const TENURE_COLORS = {
    marketPurchase: {
      land: "rgb(var(--freehold-land-color-rgb))",
      house: "rgb(var(--freehold-house-color-rgb))",
      maintenance: "rgb(var(--maintenance-color-rgb))",
    },
    fairholdLandPurchase: {
      land: "rgb(var(--fairhold-land-color-rgb))",
      house: "rgb(var(--fairhold-house-color-rgb))",
      maintenance: "rgb(var(--maintenance-color-rgb))",
    },
    fairholdLandRent: {
      land: "rgb(var(--fairhold-land-color-rgb))",
      house: "rgb(var(--fairhold-house-color-rgb))",
      maintenance: "rgb(var(--maintenance-color-rgb))",
    },
    marketRent: {
      land: "rgb(var(--private-rent-land-color-rgb))",
      house: "rgb(var(--private-rent-house-color-rgb))",
    },
    socialRent: {
      land: "rgb(var(--social-rent-land-color-rgb))",
      house: "rgb(var(--social-rent-house-color-rgb))",
    }
  } as const;
interface CostOverTimeWrapperProps {
    tenure: TenureType;
    household: Household;
}

const CostOverTimeWrapper: React.FC<CostOverTimeWrapperProps> = ({
    tenure,
    household
}) => {
    const formatData = (tenure: TenureType, household: Household, maintenanceLevel: MaintenanceLevel): LifetimeBarData[] => {
        const lifetimeData = household.lifetime.lifetimeData;

        return lifetimeData.map((yearData, index) => {
            switch (tenure) {
                case 'marketPurchase': 
                    return {
                        year: index,
                        land: yearData.marketLandMortgageYearly,
                        house: yearData.newbuildHouseMortgageYearly,
                        maintenance: yearData.maintenanceCost[maintenanceLevel]
                    }
                case 'marketRent':
                    return {
                        year: index,
                        land: yearData.marketLandRentYearly,
                        house: yearData.marketHouseRentYearly,
                    };                
                case 'fairholdLandPurchase':
                    return {
                        year: index,
                        land: yearData.fairholdLandMortgageYearly,
                        house: yearData.depreciatedHouseMortgageYearly,
                        maintenance: yearData.maintenanceCost[maintenanceLevel]
                    }
                case 'fairholdLandRent':
                    return {
                        year: index,
                        land: yearData.fairholdLandRentYearly,
                        house: yearData.depreciatedHouseMortgageYearly,
                        maintenance: yearData.maintenanceCost[maintenanceLevel]
                    }
                case 'socialRent':
                    return {
                        year: index,
                        land: yearData.socialRentLandYearly,
                        house: yearData.socialRentHouseYearly
                    }
            }
        })
        
    }
    const chartConfig = {
        colors: TENURE_COLORS[tenure],
        showMaintenance: ['marketPurchase', 'fairholdLandPurchase', 'fairholdLandRent'].includes(tenure)
    }

    const maintenanceLevel = household.property.maintenanceLevel

    const formattedData = formatData(tenure, household, maintenanceLevel);

    return (
        <ErrorBoundary>
      <CostOverTimeStackedBarChart 
        data={formattedData}
        config={chartConfig}
      />
    </ErrorBoundary>
    )
};

export default CostOverTimeWrapper;
