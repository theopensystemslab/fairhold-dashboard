"use client";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Household } from "@/app/models/Household";
import ResaleValueLineChart from "./ResaleValueLineChart";
import type { DataPoint } from "./ResaleValueLineChart"

interface ResaleValueWrapperProps {
  tenure: 'landPurchase' | 'landRent';
  household: Household;
}

const ResaleValueWrapper: React.FC<ResaleValueWrapperProps> = ({
    tenure,
    household
}) => {
    // Since we want one line (user selected) to be solid, need to map the maintenance percentage to the line type
    const getSelectedMaintenance = (maintenancePercentage: number): 'noMaintenance' | 'lowMaintenance' | 'mediumMaintenance' | 'highMaintenance' => { // LINE CHANGED
      switch (maintenancePercentage) {
        case 0:
          return 'noMaintenance';
        case 0.015:
          return 'lowMaintenance';
        case 0.019:
          return 'mediumMaintenance';
        case 0.025:
          return 'highMaintenance';
        default:
          return 'lowMaintenance';
      }
    };

    /** Needs either `landRent` or `landPurchase` to denote Fairhold tenure type; based on this arg, it will determine if land resale value is 0 or FHLP over time */
    const formatData = (household: Household) => {
      const lifetime = household.lifetime.lifetimeData 
      const chartData: DataPoint[] = [];

      for (let i = 0; i < lifetime.length; i++ ) {
        // Fairhold land rent cannot be sold for anything, assign as 0 
        const landValue = tenure === 'landRent' ? 0 : lifetime[i].fairholdLandPurchaseResaleValue;
      
        chartData.push({
          year: i + 1,
          noMaintenance: landValue + lifetime[i].depreciatedHouseResaleValueNoMaintenance,
          lowMaintenance: landValue + lifetime[i].depreciatedHouseResaleValueLowMaintenance,
          mediumMaintenance: landValue + lifetime[i].depreciatedHouseResaleValueMediumMaintenance,
          highMaintenance: landValue + lifetime[i].depreciatedHouseResaleValueHighMaintenance
        })
        
      }
      return chartData
    }

    const formattedData = formatData(household);
    const selectedMaintenance = getSelectedMaintenance(household.property.maintenancePercentage)

    // We want a constant y value across the graphs so we can compare resale values between them
    const finalYear = household.lifetime.lifetimeData[household.lifetime.lifetimeData.length - 1]
    const maxY = Math.ceil((1.1 * (finalYear.fairholdLandPurchaseResaleValue + finalYear.depreciatedHouseResaleValueHighMaintenance)) / 100000) * 100000 // Round to nearest hundred thousand to make things tidy

    if (!household) {
      return <div>No household data available</div>;
    }

    return (
        <ErrorBoundary>
        <div>
          <ResaleValueLineChart 
            data={formattedData} 
            selectedMaintenance={selectedMaintenance}
            maxY={maxY}
            />
        </div>
      </ErrorBoundary>
    );
};

export default ResaleValueWrapper