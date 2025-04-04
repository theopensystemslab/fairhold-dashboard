"use client";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Household } from "@/app/models/Household";
import ResaleValueLineChart from "./ResaleValueLineChart";
import type { DataPoint } from "./ResaleValueLineChart"

interface ResaleValueWrapperProps {
  tenure: 'fairholdLandPurchase' | 'fairholdLandRent';
  household: Household;
}

const ResaleValueWrapper: React.FC<ResaleValueWrapperProps> = ({
    tenure,
    household
}) => {

    /** Needs either `landRent` or `landPurchase` to denote Fairhold tenure type; based on this arg, it will determine if land resale value is 0 or FHLP over time */
    const formatData = (household: Household) => {
      const lifetime = household.lifetime.lifetimeData 
      const chartData: DataPoint[] = [];

      for (let i = 0; i < lifetime.length; i++ ) {
        // Fairhold land rent cannot be sold for anything, assign as 0 
        const landValue = tenure === 'fairholdLandRent' ? 0 : lifetime[i].fairholdLandPurchaseResaleValue;
      
        chartData.push({
          year: i + 1,
          none: landValue + lifetime[i].depreciatedHouseResaleValue.none,
          low: landValue + lifetime[i].depreciatedHouseResaleValue.low,
          medium: landValue + lifetime[i].depreciatedHouseResaleValue.medium,
          high: landValue + lifetime[i].depreciatedHouseResaleValue.high
        })
        
      }
      return chartData
    }

    const formattedData = formatData(household);

    // We want a constant y value across the graphs so we can compare resale values between them
    const finalYear = household.lifetime.lifetimeData[household.lifetime.lifetimeData.length - 1]
    const maxY = Math.ceil((1.1 * (finalYear.fairholdLandPurchaseResaleValue + finalYear.depreciatedHouseResaleValue.high)) / 100000) * 100000 // Scale y axis by 1.1 (for a bit of visual headroom) and round to nearest hundred thousand to make things tidy

    if (!household) {
      return <div>No household data available</div>;
    }

    return (
        <ErrorBoundary>
        <div  className="h-full">
          <ResaleValueLineChart 
            data={formattedData} 
            selectedMaintenance={household.property.maintenanceLevel}
            maxY={maxY}
            />
        </div>
      </ErrorBoundary>
    );
};

export default ResaleValueWrapper