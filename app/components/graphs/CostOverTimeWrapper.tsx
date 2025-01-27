"use client";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Household } from "@/app/models/Household";
import CostOverTimeStackedBarChart, { LifetimeBarData } from "./CostOverTimeStackedBarChart";
import { MaintenanceLevel } from "@/app/models/constants";

export type TenureType = 'marketPurchase' | 'fairholdLandPurchase' | 'fairholdLandRent' | 'marketRent' | 'socialRent';

const TENURE_COLORS = {
    marketPurchase: {
      equity: "rgb(var(--freehold-equity-color-rgb))",
      interest: "rgb(var(--freehold-interest-color-rgb))",
      maintenance: "rgb(var(--freehold-detail-color-rgb))",
    },
    fairholdLandPurchase: {
      equity: "rgb(var(--fairhold-equity-color-rgb))",
      interest: "rgb(var(--fairhold-interest-color-rgb))",
      maintenance: "rgb(var(--fairhold-detail-color-rgb))",
    },
    fairholdLandRent: {
      landRent: "rgb(var(--fairhold-land-rent-color-rgb))",
      equity: "rgb(var(--fairhold-equity-color-rgb))",
      interest: "rgb(var(--fairhold-interest-color-rgb))",
      maintenance: "rgb(var(--fairhold-detail-color-rgb))",
    },
    marketRent: {
      rent: "rgb(var(--private-rent-land-color-rgb))"
    },
    socialRent: {
      rent: "rgb(var(--social-rent-land-color-rgb))",
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
                        equity: yearData.marketPurchaseYearly.yearlyEquityPaid,
                        interest: yearData.marketPurchaseYearly.yearlyInterestPaid,
                        maintenance: yearData.maintenanceCost[maintenanceLevel]
                    }
                case 'marketRent':
                    return {
                        year: index,
                        rent: yearData.marketRentYearly
                    };                
                case 'fairholdLandPurchase':
                    return {
                        year: index,
                        equity: yearData.fairholdLandPurchaseYearly.yearlyEquityPaid,
                        interest: yearData.fairholdLandPurchaseYearly.yearlyInterestPaid,
                        maintenance: yearData.maintenanceCost[maintenanceLevel]
                    }
                case 'fairholdLandRent':
                    return {
                        year: index,
                        landRent: yearData.fairholdLandRentCGRYearly,
                        equity: yearData.fairholdLandRentYearly.yearlyEquityPaid,
                        interest: yearData.fairholdLandRentYearly.yearlyInterestPaid,
                        maintenance: yearData.maintenanceCost[maintenanceLevel]
                    }
                case 'socialRent':
                    return {
                        year: index,
                        rent: yearData.socialRentYearly
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
    
    // We want a constant y value across the graphs so we can compare costs between them
    const firstYear = household.lifetime.lifetimeData[0]
    const maxY = Math.ceil((1 * (firstYear.marketPurchaseYearly.yearlyEquityPaid + firstYear.marketPurchaseYearly.yearlyInterestPaid)) / 100000) * 100000 // Scale y axis by 1.1 (for a bit of visual headroom) and round to nearest hundred thousand to make things tidy

    return (
        <ErrorBoundary>
      <CostOverTimeStackedBarChart 
        data={formattedData}
        config={chartConfig}
        maxY={maxY}
      />
    </ErrorBoundary>
    )
};

export default CostOverTimeWrapper;
