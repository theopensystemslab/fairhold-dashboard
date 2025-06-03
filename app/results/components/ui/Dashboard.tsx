import React, { useRef, useState } from "react";
import { Household } from "@/app/models/Household";
import { FormFrontend } from "@/app/schemas/formSchema";
import { WhatWouldYouChoose } from "../cards/WhatWouldYouChoose";
import { WhatDifference } from "../cards/WhatDifference";
import { HowMuchFHCost } from "../cards/HowMuchFHCost";
import { Carousel } from "./Carousel";
import { HowMuchPerMonth } from "../cards/HowMuchPerMonth";
import { ResaleValue } from "../cards/ResaleValue";
import { CostOverTime } from "../cards/CostOverTime";

export interface DashboardProps {
  processedData: Household;
  inputData?: FormFrontend;
}

const Dashboard: React.FC<DashboardProps> = ({ inputData, processedData }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollTop = scrollContainerRef.current.scrollTop;
      const pageHeight = window.innerHeight;
      const newPage = Math.round(scrollTop / pageHeight);
      setCurrentPage(newPage);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const someUnusedVariable = inputData;

  return (
    <div className="snap-container md:h-screen overflow-hidden">
      <div
        className="snap-y snap-mandatory h-full overflow-y-auto flex flex-col items-center align-center"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <HowMuchFHCost data={processedData} />
        <HowMuchPerMonth processedData={processedData} />
        <CostOverTime processedData={processedData} />
        <ResaleValue data={processedData} />
        <WhatDifference data={processedData}/>
        <WhatWouldYouChoose />
      </div>
      <Carousel
        scrollContainerRef={scrollContainerRef}
        currentPage={currentPage}
      />
    </div>
  );
};

export default Dashboard;
