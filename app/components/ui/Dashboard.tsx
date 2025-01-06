import React from "react";
import TenureComparisonWrapper from "../graphs/TenureComparisonWrapper";
import TotalPaymentWrapper from "../graphs/TotalPaymentWrapper";
import LifetimeMarketPurchaseWrapper from "../graphs/LifetimeMarketPurchaseWrapper";
import LifetimeMarketRentWrapper from "../graphs/LifetimeMarketRentWrapper";
import LifetimeFairholdLandPurchaseWrapper from "../graphs/LifetimeFairholdLandPurchaseWrapper";
import LifetimeFairholdLandRentWrapper from "../graphs/LifetimeFairholdLandRentWrapper";
import { formType } from "@/app/schemas/formSchema";
import FormEdit from "./FormEdit";
import { Household } from "@/app/models/Household";

interface DashboardProps {
  processedData: Household;
  inputData: formType; // Add this property
}

const Dashboard: React.FC<DashboardProps> = ({ processedData, inputData }) => {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Render multiple graph components here */}
      <FormEdit formData={inputData} />
      <TenureComparisonWrapper household={processedData} />
      <TotalPaymentWrapper household={processedData} />
      <LifetimeMarketPurchaseWrapper household={processedData} />
      <LifetimeMarketRentWrapper household={processedData} />
      <LifetimeFairholdLandPurchaseWrapper household={processedData} />
      <LifetimeFairholdLandRentWrapper household={processedData} />{" "}
    </div>
  );
};

export default Dashboard;
